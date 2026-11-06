// src/App.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import BottomMobileNav from './components/BottomMobileNav';
import LoginPage from './components/LoginPage';
import ReceptionCleanView from './components/ReceptionCleanView';
import MentorCleanView from './components/MentorCleanView';
import StudentCleanView from './components/StudentCleanView';
import CoordinatorCleanView from './components/CoordinatorCleanView';
import AgendamentoModal from './components/AgendamentoModal';
import DiarioBordoModal from './components/DiarioBordoModal';
import NovoMentoradoModal from './components/NovoMentoradoModal';
import ErrorBoundary from './components/ErrorBoundary';
import {
  getStoredData,
  saveStoredData,
  resetToInitial,
  exportBackupJSON
} from './services/storage';

export default function App() {
  const [data, setData] = useState(() => getStoredData());
  
  // Estado de Autenticação Real: se null ou vazio, o usuário está na tela de login
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('conexo_auth_persona') ? true : false;
  });
  const [currentPersona, setCurrentPersona] = useState(() => {
    return localStorage.getItem('conexo_auth_persona') || 'max';
  });
  const [currentTab, setCurrentTab] = useState('grade');

  // Controle de Modais
  const [isAgendamentoOpen, setIsAgendamentoOpen] = useState(false);
  const [selectedTurnoParaAgendar, setSelectedTurnoParaAgendar] = useState(null);
  const [selectedConsultorParaAgendar, setSelectedConsultorParaAgendar] = useState(null);
  const [selectedSlotParaAgendar, setSelectedSlotParaAgendar] = useState(null);

  const [isDiarioOpen, setIsDiarioOpen] = useState(false);
  const [selectedStudentParaDiario, setSelectedStudentParaDiario] = useState(null);

  const [isNovoMentoradoOpen, setIsNovoMentoradoOpen] = useState(false);

  // Sincroniza LocalStorage
  useEffect(() => {
    saveStoredData(data);
  }, [data]);

  // Login handler
  const handleLogin = (personaId) => {
    setCurrentPersona(personaId);
    setIsAuthenticated(true);
    localStorage.setItem('conexo_auth_persona', personaId);
    setCurrentTab(
      personaId === 'max' ? 'dashboard' :
      personaId === 'aline' ? 'minha-agenda' :
      personaId === 'arthur' ? 'portal' : 'indicadores'
    );
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('conexo_auth_persona');
  };

  // Ações de Agendamento
  const handleOpenAgendamento = (turno, consultor, slot = null) => {
    setSelectedTurnoParaAgendar(turno);
    setSelectedConsultorParaAgendar(consultor);
    setSelectedSlotParaAgendar(slot);
    setIsAgendamentoOpen(true);
  };

  const handleSaveAgendamento = (novoAgendamento) => {
    setData((prev) => {
      let updatedAppointments;
      if (novoAgendamento.targetAgendamentoId) {
        updatedAppointments = prev.appointments.map((a) => {
          if (a.id === novoAgendamento.targetAgendamentoId) {
            return { ...a, ...novoAgendamento, id: a.id, status: 'Confirmado' };
          }
          return a;
        });
      } else {
        const agendamentoComId = {
          ...novoAgendamento,
          id: `agend-${Date.now()}`
        };
        updatedAppointments = [...prev.appointments, agendamentoComId];
      }

      const updatedStudents = prev.students.map((s) => {
        if (s.id === novoAgendamento.alunoId) {
          return {
            ...s,
            etapaPrograma: novoAgendamento.tipo === 'Diagnostico_1h' ? 'Diagnostico' : 'Trilha',
            sessaoAtual: novoAgendamento.sessaoNumero
          };
        }
        return s;
      });

      return {
        ...prev,
        appointments: updatedAppointments,
        students: updatedStudents
      };
    });
  };

  const handleUpdateAppointmentStatus = (appointmentId, newStatus) => {
    setData((prev) => {
      let updatedStudents = [...prev.students];
      const targetAppointment = prev.appointments.find((a) => a.id === appointmentId);

      if (targetAppointment && targetAppointment.alunoId) {
        if (newStatus === 'Falta_Menor24h') {
          updatedStudents = updatedStudents.map((s) => {
            if (s.id === targetAppointment.alunoId) {
              const novasFaltas = (s.totalFaltas || 0) + 1;
              const novoStatus = novasFaltas >= 2 ? 'Desligado' : s.etapaPrograma;
              return { 
                ...s, 
                totalFaltas: novasFaltas, 
                etapaPrograma: novoStatus,
                motivoDesligamento: novasFaltas >= 2 ? 'Excedeu limite institucional de faltas (2 faltas consecutivas sem aviso prévio de 24h)' : null
              };
            }
            return s;
          });
        }
      }

      const updatedAppointments = prev.appointments.map((a) => {
        if (a.id === appointmentId) {
          return { 
            ...a, 
            status: newStatus,
            whatsappStatus: newStatus === 'Realizada' ? '✓ Presença realizada no local' : newStatus === 'Falta_Menor24h' ? 'Falta <24h registrada' : a.whatsappStatus
          };
        }
        return a;
      });

      return { ...prev, appointments: updatedAppointments, students: updatedStudents };
    });
  };

  // Confirmação de Presença via WhatsApp (Arthur -> Max & Aline)
  const handleConfirmArthurWhatsApp = (appointmentId) => {
    setData((prev) => {
      const updatedAppointments = prev.appointments.map((a) => {
        if (a.id === appointmentId || (!appointmentId && a.alunoId === 'aluno-1')) {
          return {
            ...a,
            whatsappStatus: '✓ Confirmado pelo Aluno (WhatsApp)'
          };
        }
        return a;
      });
      return { ...prev, appointments: updatedAppointments };
    });
  };

  // Formalização MEI (Arthur -> Regis & Max)
  const handleFormalizarAluno = (studentId, dados = {}) => {
    setData((prev) => {
      const updatedStudents = prev.students.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            statusNegocio: 'MEI',
            cnpj: dados.cnpj || '54.892.102/0001-38',
            statusFormalizacaoMei: 'Formalizado',
            dataFormalizacao: new Date().toISOString().split('T')[0]
          };
        }
        return s;
      });
      return { ...prev, students: updatedStudents };
    });
  };

  const handleOpenDiario = (student) => {
    setSelectedStudentParaDiario(student);
    setIsDiarioOpen(true);
  };

  const handleSaveDiario = (diarioAtualizado) => {
    setData((prev) => {
      const exists = prev.diarios.some((d) => d.id === diarioAtualizado.id);
      let updatedDiarios;
      if (exists) {
        updatedDiarios = prev.diarios.map((d) => (d.id === diarioAtualizado.id ? diarioAtualizado : d));
      } else {
        updatedDiarios = [...prev.diarios, diarioAtualizado];
      }

      const isConcluido = diarioAtualizado.sessaoNumero >= 5;
      const updatedStudents = prev.students.map((s) => {
        if (s.id === diarioAtualizado.alunoId) {
          return { 
            ...s, 
            sessaoAtual: diarioAtualizado.sessaoNumero,
            etapaPrograma: isConcluido ? 'Concluido' : s.etapaPrograma,
            dataConclusao: isConcluido ? new Date().toISOString().split('T')[0] : s.dataConclusao
          };
        }
        return s;
      });

      return { ...prev, diarios: updatedDiarios, students: updatedStudents };
    });
  };

  const handleSaveNovoMentorado = (novoAluno) => {
    setData((prev) => ({
      ...prev,
      students: [novoAluno, ...prev.students]
    }));
  };

  // Encaixe Rápido de Aluno em Horário Vago
  const handleQuickEncaixe = (targetAppointmentId, alunoId) => {
    setData((prev) => {
      const student = prev.students.find(s => s.id === alunoId);
      const waitingItem = prev.waitingList?.find(w => w.id === alunoId || w.nome === student?.nome);

      const updatedAppointments = prev.appointments.map((a) => {
        if (a.id === targetAppointmentId) {
          return {
            ...a,
            alunoId: alunoId,
            status: 'Confirmado',
            whatsappStatus: 'Encaixe rápido realizado'
          };
        }
        return a;
      });

      // Remove da fila de espera se estiver lá
      const updatedWaiting = waitingItem 
        ? prev.waitingList.filter(w => w.id !== waitingItem.id)
        : prev.waitingList;

      return {
        ...prev,
        appointments: updatedAppointments,
        waitingList: updatedWaiting
      };
    });
  };

  // Adicionar à Fila de Espera
  const handleAddToWaitingList = (candidate) => {
    const newCandidate = {
      ...candidate,
      id: `espera-${Date.now()}`,
      tempoEsperaDias: 0,
      status: 'Aguardando Encaixe'
    };
    setData((prev) => ({
      ...prev,
      waitingList: [newCandidate, ...(prev.waitingList || [])]
    }));
  };

  // Salvar Simulação de Preço/CMV no Mentorado
  const handleSaveSimulacao = (studentId, simulacao) => {
    setData((prev) => ({
      ...prev,
      students: prev.students.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            metricasEvolucao: {
              ...(s.metricasEvolucao || {}),
              margemDepois: `${simulacao.margemPercentual}% (Preço calibrado R$ ${simulacao.precoVenda.toFixed(2)})`,
              faturamentoDepois: `R$ ${(simulacao.precoVenda * 240).toLocaleString('pt-BR')}/mês (+${Math.round(simulacao.margemPercentual)}%)`
            }
          };
        }
        return s;
      })
    }));
  };

  const handleResetData = () => {
    if (confirm('Deseja restaurar os dados de demonstração iniciais?')) {
      const initial = resetToInitial();
      setData(initial);
    }
  };

  const handleExportBackup = () => {
    exportBackupJSON(data);
  };

  const arthurStudent = data.students.find((s) => s.id === 'aluno-1') || data.students[0];

  // Se não estiver autenticado, exibe EXCLUSIVAMENTE a tela de login inicial
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Se autenticado, entra no painel exclusivo do usuário
  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-800 flex font-sans p-2 sm:p-5 gap-5 pb-24 lg:pb-5">
      {/* 1. Sidebar Fixa no Desktop (Escondida no Mobile) */}
      <Sidebar
        currentPersona={currentPersona}
        onLogout={handleLogout}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenNovoMentorado={() => setIsNovoMentoradoOpen(true)}
      />

      {/* 2. Área Principal da Tela Autenticada */}
      <div className="flex-1 flex flex-col gap-4 sm:gap-5 min-w-0">
        {/* Top Navbar Responsiva */}
        <TopNavbar
          currentPersona={currentPersona}
          onLogout={handleLogout}
          onResetData={handleResetData}
          onExportBackup={handleExportBackup}
        />

        {/* Conteúdo Exclusivo da Persona Autenticada */}
        <main className="flex-1">
          <ErrorBoundary key={currentPersona}>
            {currentPersona === 'max' && (
              <ReceptionCleanView
                students={data.students}
                consultors={data.consultors}
                appointments={data.appointments}
                waitingList={data.waitingList}
                onOpenAgendamento={handleOpenAgendamento}
                onOpenDiario={handleOpenDiario}
                onOpenNovoMentorado={() => setIsNovoMentoradoOpen(true)}
                onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
                onQuickEncaixe={handleQuickEncaixe}
                onAddToWaitingList={handleAddToWaitingList}
                onFormalizarAluno={handleFormalizarAluno}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
              />
            )}

            {currentPersona === 'aline' && (
              <MentorCleanView
                consultors={data.consultors}
                students={data.students}
                appointments={data.appointments}
                diarios={data.diarios}
                onOpenDiario={handleOpenDiario}
                onSaveDiario={handleSaveDiario}
                onSaveSimulacao={handleSaveSimulacao}
                onFormalizarAluno={handleFormalizarAluno}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
              />
            )}

            {currentPersona === 'arthur' && (
              <StudentCleanView
                student={arthurStudent}
                appointments={data.appointments}
                diarios={data.diarios}
                consultors={data.consultors}
                onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
                onConfirmWhatsApp={handleConfirmArthurWhatsApp}
                onFormalizarAluno={handleFormalizarAluno}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
              />
            )}

            {currentPersona === 'regis' && (
              <CoordinatorCleanView
                students={data.students}
                consultors={data.consultors}
                appointments={data.appointments}
                diarios={data.diarios}
                onOpenDiario={handleOpenDiario}
                currentTab={currentTab}
              />
            )}
          </ErrorBoundary>
        </main>
      </div>

      {/* 3. Barra de Navegação Inferior Móvel (Exclusiva Mobile) */}
      <BottomMobileNav
        currentPersona={currentPersona}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onLogout={handleLogout}
      />

      {/* 3. Modais da Aplicação */}
      <NovoMentoradoModal
        isOpen={isNovoMentoradoOpen}
        onClose={() => setIsNovoMentoradoOpen(false)}
        onSaveStudent={handleSaveNovoMentorado}
      />

      <AgendamentoModal
        key={selectedSlotParaAgendar?.id || selectedTurnoParaAgendar?.id || 'modal-agend'}
        isOpen={isAgendamentoOpen}
        onClose={() => {
          setIsAgendamentoOpen(false);
          setSelectedSlotParaAgendar(null);
        }}
        turno={selectedTurnoParaAgendar}
        consultor={selectedConsultorParaAgendar}
        students={data.students}
        initialSlot={selectedSlotParaAgendar}
        appointments={data.appointments}
        onSaveAgendamento={handleSaveAgendamento}
      />

      <DiarioBordoModal
        isOpen={isDiarioOpen}
        onClose={() => setIsDiarioOpen(false)}
        student={selectedStudentParaDiario}
        diarios={data.diarios}
        onSaveDiario={handleSaveDiario}
        isReadOnly={currentPersona === 'regis' || currentPersona === 'arthur'}
      />
    </div>
  );
}
