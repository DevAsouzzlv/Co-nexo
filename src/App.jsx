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
import BlindTestGuideModal from './components/BlindTestGuideModal';
import { Sparkles } from 'lucide-react';
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
  const [isBlindTestGuideOpen, setIsBlindTestGuideOpen] = useState(false);
  const [globalToast, setGlobalToast] = useState(null);

  const showGlobalToast = (message) => {
    setGlobalToast(message);
    setTimeout(() => {
      setGlobalToast(null);
    }, 3500);
  };

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
    showGlobalToast('Sessão encerrada com sucesso.');
  };

  // Alternância rápida de perfil para o Teste às Cegas
  const handleSwitchPersona = (personaId) => {
    const accs = getStoredAccounts();
    const acc = accs.find(a => a.id === personaId || a.roleType === personaId);
    handleLogin(personaId, acc);
    showGlobalToast(`✓ Alternado para o perfil de ${acc?.nome || personaId}`);
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
    showGlobalToast('✓ Agendamento salvo com sucesso!');
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
    showGlobalToast('📲 Presença confirmada via WhatsApp!');
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
    showGlobalToast('🎉 Formalização MEI registrada com sucesso!');
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
    showGlobalToast('📝 Diário de bordo e metas salvos com sucesso!');
  };

  const handleSaveNovoMentorado = (novoAluno) => {
    setData((prev) => ({
      ...prev,
      students: [novoAluno, ...prev.students]
    }));
    showGlobalToast('✓ Novo mentorado cadastrado no SENAC Hub!');
  };

  // Encaixe Rápido de Aluno em Horário Vago
  const handleQuickEncaixe = (targetAppointmentId, alunoId) => {
    setData((prev) => {
      let student = prev.students.find(s => s.id === alunoId);
      const waitingItem = prev.waitingList?.find(w => w.id === alunoId || w.nome === student?.nome);

      let updatedStudents = [...prev.students];
      // Se o aluno veio da fila de espera e ainda não está na lista principal, integra automaticamente
      if (!student && waitingItem) {
        student = {
          id: waitingItem.id,
          nome: waitingItem.nome,
          negocio: waitingItem.negocio,
          segmento: waitingItem.segmento || 'Alimentação & Varejo',
          whatsapp: waitingItem.whatsapp || '(11) 97222-3344',
          documento: waitingItem.documento || '234.567.890-88',
          statusNegocio: 'Informal',
          cnpj: '',
          etapaPrograma: 'Diagnostico',
          sessaoAtual: 1,
          totalFaltas: 0,
          totalReagendamentos: 0,
          statusFormalizacaoMei: 'Em Processo',
          dataConclusao: null,
          avatar: '🧁'
        };
        updatedStudents = [student, ...updatedStudents];
      }

      const updatedAppointments = prev.appointments.map((a) => {
        if (a.id === targetAppointmentId) {
          return {
            ...a,
            alunoId: student?.id || alunoId,
            status: 'Confirmado',
            whatsappStatus: '✓ Encaixe rápido confirmado'
          };
        }
        return a;
      });

      // Remove da fila de espera se estiver lá
      const updatedWaiting = waitingItem 
        ? prev.waitingList.filter(w => w.id !== waitingItem.id && w.nome !== waitingItem.nome)
        : prev.waitingList;

      return {
        ...prev,
        appointments: updatedAppointments,
        students: updatedStudents,
        waitingList: updatedWaiting
      };
    });
    showGlobalToast('⚡ Encaixe realizado com sucesso! Ociosidade eliminada.');
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
      <div className="fixed -bottom-24 left-1/4 w-96 h-96 rounded-full bg-[#84BD00]/5 blur-[100px] pointer-events-none z-0" />

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
          onOpenBlindTestGuide={() => setIsBlindTestGuideOpen(true)}
        />

        {/* Banner de Aviso de Teste às Cegas & Contexto do Perfil */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-blue-500/5 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#84BD00] text-slate-950 font-black shrink-0 shadow-xs text-xs">
              🧪
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-amber-950 uppercase tracking-wide text-[10px]">
                  Ambiente de Teste às Cegas
                </span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-amber-200 text-slate-700 font-bold">
                  {currentProfile?.roleLabel}: {currentProfile?.nome}
                </span>
                <span className="text-[10px] text-slate-400 hidden md:inline">
                  • {currentProfile?.badge}
                </span>
              </div>
              <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                {currentPersona === 'max' && 'Recepção: Teste encaixes na grade de 8h, confirmação de presença WhatsApp e novo mentorado.'}
                {currentPersona === 'aline' && 'Consultoria: Teste prontuário individual, diário de bordo e simulação de custos/CMV.'}
                {currentPersona === 'arthur' && 'Mentorado: Teste compromissos de bancada, upload de tarefas respondidas e presença WhatsApp.'}
                {currentPersona === 'regis' && 'Coordenação: Audite metas de 8h dos docentes, no-show e exporte relatório CSV homologado.'}
                {currentPersona === 'admin' && 'Admin Supremo: Gerencie perfis institucionais e permissões de acesso do SENAC Hub.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => setIsBlindTestGuideOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-[#004A8D] font-bold text-xs border border-blue-200 shadow-2xs transition active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#84BD00]" />
              <span>Roteiro de Teste</span>
            </button>
          </div>
        </div>

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

      {/* Botão Flutuante Permanente para o Teste às Cegas */}
      <div className="fixed bottom-5 right-5 z-40 hidden sm:flex">
        <button
          onClick={() => setIsBlindTestGuideOpen(true)}
          className="bg-slate-900/90 hover:bg-slate-900 text-white px-4 py-2.5 rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.2)] border border-slate-700/50 flex items-center gap-2.5 text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
          </span>
          <span>🧪 Guia do Teste às Cegas</span>
        </button>
      </div>

      {/* Toast de Notificação Global Apple HIG */}
      {globalToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-fade-in">
          <div className="bg-slate-900/95 text-white px-5 py-2.5 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-md flex items-center gap-2.5 text-xs font-bold tracking-tight">
            <Sparkles className="w-4 h-4 text-[#84BD00] shrink-0" />
            <span>{globalToast}</span>
          </div>
        </div>
      )}

      {/* Modal do Guia de Teste às Cegas */}
      <BlindTestGuideModal
        isOpen={isBlindTestGuideOpen}
        onClose={() => setIsBlindTestGuideOpen(false)}
        currentPersona={currentPersona}
        onSwitchPersona={handleSwitchPersona}
        onResetDemo={handleResetDemo}
        onResetClean={handleResetClean}
        onExportBackup={handleExportBackup}
      />
    </div>
  );
}
