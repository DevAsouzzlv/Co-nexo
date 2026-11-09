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
import AdminCleanView from './components/AdminCleanView';
import AgendamentoModal from './components/AgendamentoModal';
import DiarioBordoModal from './components/DiarioBordoModal';
import NovoMentoradoModal from './components/NovoMentoradoModal';
import ErrorBoundary from './components/ErrorBoundary';
import {
  getStoredData,
  saveStoredData,
  resetToInitial,
  resetCleanEmpty,
  exportBackupJSON,
  getStoredAccounts,
  DEFAULT_ACCOUNTS
} from './services/storage';

export default function App() {
  const [data, setData] = useState(() => getStoredData());
  
  // Estado de Autenticação Real: se null ou vazio, o usuário está na tela de login
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('conexo_auth_persona') ? true : false;
  });
  const [currentPersona, setCurrentPersona] = useState(() => {
    const authEmail = localStorage.getItem('conexo_auth_email');
    if (authEmail === 'admin@conexo.senac.br') return 'admin';
    return localStorage.getItem('conexo_auth_persona') || 'admin';
  });
  const [currentTab, setCurrentTab] = useState(() => {
    const persona = localStorage.getItem('conexo_auth_persona');
    return persona === 'admin' ? 'usuarios' : 'grade';
  });

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
  const handleLogin = (personaId, account) => {
    const effectivePersona = account?.roleType || personaId;
    setCurrentPersona(effectivePersona);
    setIsAuthenticated(true);
    localStorage.setItem('conexo_auth_persona', effectivePersona);
    if (account?.email) {
      localStorage.setItem('conexo_auth_email', account.email);
    }
    setCurrentTab(
      effectivePersona === 'max' ? 'dashboard' :
      effectivePersona === 'aline' ? 'minha-agenda' :
      effectivePersona === 'arthur' ? 'portal' :
      effectivePersona === 'admin' ? 'usuarios' : 'indicadores'
    );
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('conexo_auth_persona');
    localStorage.removeItem('conexo_auth_email');
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

  const handleResetClean = () => {
    const clean = resetCleanEmpty();
    setData(clean);
    setIsAuthenticated(false);
    localStorage.removeItem('conexo_auth_persona');
  };

  const handleResetDemo = () => {
    const initial = resetToInitial();
    setData(initial);
    setIsAuthenticated(false);
    localStorage.removeItem('conexo_auth_persona');
  };

  const handleResetData = () => {
    if (confirm('Deseja ZERAR o banco de dados (remover todos os alunos/mentorados e agendamentos)?\n\nClique em OK para ZERAR TUDO ou Cancelar para manter.')) {
      handleResetClean();
    }
  };

  const handleExportBackup = () => {
    exportBackupJSON(data);
  };

  const accounts = getStoredAccounts();
  const authEmail = localStorage.getItem('conexo_auth_email');
  const currentProfile = accounts.find((p) => 
    (authEmail && p.email?.toLowerCase() === authEmail.toLowerCase()) ||
    p.id === currentPersona || 
    p.roleType === currentPersona
  ) || DEFAULT_ACCOUNTS.find((p) => p.id === currentPersona || p.roleType === currentPersona) || accounts[0] || DEFAULT_ACCOUNTS[0];

  // Resolve dinamicamente o perfil do mentorado autenticado
  const loggedInStudent = data.students?.find((s) => 
    (authEmail && s.email?.toLowerCase() === authEmail.toLowerCase()) ||
    (currentProfile?.email && s.email?.toLowerCase() === currentProfile.email.toLowerCase()) ||
    s.id === currentPersona ||
    s.id === currentProfile?.id ||
    s.nome?.toLowerCase() === currentProfile?.nome?.toLowerCase()
  ) || data.students?.find((s) => s.id === 'aluno-1') || data.students?.[0] || {
    id: currentProfile?.id || 'aluno-custom',
    nome: currentProfile?.nome || 'Mentorado Empreendedor',
    negocio: currentProfile?.cargo || 'Negócio em Validação',
    segmento: 'Empreendedorismo',
    etapaPrograma: 'Trilha',
    sessaoAtual: 1,
    whatsapp: '(11) 99999-0000',
    email: currentProfile?.email || 'mentorado@sp.senac.br'
  };

  // Se não estiver autenticado, exibe EXCLUSIVAMENTE a tela de login inicial
  if (!isAuthenticated) {
    return (
      <LoginPage 
        onLogin={handleLogin} 
        onResetClean={handleResetClean} 
        onResetDemo={handleResetDemo} 
      />
    );
  }

  // Se autenticado, entra no painel exclusivo do usuário
  return (
    <div className="h-screen bg-[#F5F5F7] text-[#1D1D1F] flex p-3 sm:p-5 gap-4 lg:gap-5 relative overflow-hidden selection:bg-[#004A8D]/15 selection:text-[#004A8D]">
      {/* Luz Ambiente Sutil Estilo Apple */}
      <div className="fixed -top-24 -right-24 w-96 h-96 rounded-full bg-[#004A8D]/5 blur-[120px] pointer-events-none z-0" />
      <div className="fixed -bottom-24 left-1/4 w-96 h-96 rounded-full bg-[#F29100]/5 blur-[100px] pointer-events-none z-0" />

      {/* 1. Sidebar Fixa no Desktop (Escondida no Mobile) */}
      <Sidebar
        currentPersona={currentPersona}
        currentUser={currentProfile}
        onLogout={handleLogout}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenNovoMentorado={() => setIsNovoMentoradoOpen(true)}
      />

      {/* 2. Área Principal com Scroll Independente e Sidebar Fixa */}
      <div className="flex-1 flex flex-col gap-4 sm:gap-5 min-w-0 h-full overflow-y-auto overflow-x-hidden relative z-10 custom-scrollbar scroll-smooth pr-1 pb-24 lg:pb-6">
        {/* Top Navbar Responsiva (Fixada no topo do painel de conteúdo) */}
        <TopNavbar
          currentPersona={currentPersona}
          currentUser={currentProfile}
          onLogout={handleLogout}
          onResetData={handleResetData}
          onExportBackup={handleExportBackup}
        />

        {/* Conteúdo Exclusivo da Persona Autenticada */}
        <main className="flex-1">
          <ErrorBoundary key={currentPersona}>
            {currentPersona === 'max' && (
              <ReceptionCleanView
                currentUser={currentProfile}
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
                currentUser={currentProfile}
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
                currentUser={currentProfile}
                student={loggedInStudent}
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

            {currentPersona === 'admin' && (
              <AdminCleanView
                currentUser={currentProfile}
                students={data.students}
                consultors={data.consultors}
                appointments={data.appointments}
                onResetClean={handleResetClean}
                onResetDemo={handleResetDemo}
                onExportBackup={handleExportBackup}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
              />
            )}

            {currentPersona === 'regis' && (
              <CoordinatorCleanView
                currentUser={currentProfile}
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
        key={selectedSlotParaAgendar?.id || `${selectedSlotParaAgendar?.data}-${selectedSlotParaAgendar?.diaSemana}-${selectedSlotParaAgendar?.horario || 'novo'}`}
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
