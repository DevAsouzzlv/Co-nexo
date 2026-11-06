// src/components/ReceptionCleanView.jsx
import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  UserPlus, 
  Send, 
  Search, 
  Check, 
  ChevronDown, 
  ShieldAlert, 
  Phone, 
  FileText 
} from 'lucide-react';

export default function ReceptionCleanView({
  students,
  consultors,
  appointments,
  waitingList = [],
  onOpenAgendamento,
  onOpenDiario,
  onOpenNovoMentorado,
  onUpdateAppointmentStatus,
  onQuickEncaixe,
  onAddToWaitingList,
  onFormalizarAluno,
  currentTab = 'dashboard',
  setCurrentTab
}) {
  const [selectedConsultorId] = useState(consultors[0]?.id || 'cons-1');
  const [selectedTurnoId] = useState('turno-1');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [isWhatsappSent, setIsWhatsappSent] = useState(false);

  // Notificações Toast em Tempo Real
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Formulário inline para nova pessoa na fila de espera
  const [showAddWaitingForm, setShowAddWaitingForm] = useState(false);
  const [newWaitingName, setNewWaitingName] = useState('');
  const [newWaitingBusiness, setNewWaitingBusiness] = useState('');
  const [newWaitingPhone, setNewWaitingPhone] = useState('');
  const newWaitingType = 'Diagnostico_1h';

  // Estados para a Agenda Semanal Interativa (Dropdowns & Filtros)
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [agendaConsultorFilter, setAgendaConsultorFilter] = useState('todos');
  const [agendaSalaFilter, setAgendaSalaFilter] = useState('todas');

  const currentConsultor = consultors.find((c) => c.id === selectedConsultorId) || consultors[0];
  const currentTurno = currentConsultor?.turnos?.find((t) => t.id === selectedTurnoId) || currentConsultor?.turnos?.[0];

  // Agendamentos deste turno específico
  const turnoAppointments = appointments.filter((a) => a.turnoId === currentTurno?.id);
  const occupiedAppointments = turnoAppointments.filter(
    (a) => a.alunoId && a.status !== 'Cancelado' && a.status !== 'Disponivel'
  );

  const totalHorasOcupadas = occupiedAppointments.reduce((acc, curr) => {
    return acc + (curr.tipo === 'Diagnostico_1h' ? 1 : 2);
  }, 0);

  // Ações operacionais com feedback
  const handleMarcarPresenca = (apId, nome) => {
    onUpdateAppointmentStatus(apId, 'Realizada');
    showToast(`✓ Presença confirmada para ${nome || 'o aluno'}!`);
  };

  const handleMarcarFalta = (apId, nome) => {
    onUpdateAppointmentStatus(apId, 'Falta_Menor24h');
    showToast(`⚠️ Falta <24h registrada para ${nome || 'o aluno'}. Assiduidade recalculada.`, 'warning');
  };

  const handleDispararWhatsApp = () => {
    setIsWhatsappSent(true);
    showToast('✓ 4 mensagens de confirmação enviadas com sucesso via WhatsApp!');
  };

  const handleSalvarCandidatoFila = (e) => {
    e.preventDefault();
    if (!newWaitingName.trim()) return;
    if (onAddToWaitingList) {
      onAddToWaitingList({
        nome: newWaitingName,
        negocio: newWaitingBusiness || 'Novo Empreendimento',
        whatsapp: newWaitingPhone || '(11) 98765-0000',
        tipoDesejado: newWaitingType
      });
    }
    showToast(`✓ ${newWaitingName} cadastrado(a) na Fila de Espera!`);
    setNewWaitingName('');
    setNewWaitingBusiness('');
    setNewWaitingPhone('');
    setShowAddWaitingForm(false);
  };

  const handleEncaixarCandidato = (candidate) => {
    const openSlot = appointments.find(a => !a.alunoId || a.status === 'Disponivel');
    if (openSlot && onQuickEncaixe) {
      onQuickEncaixe(openSlot.id, candidate.id);
      showToast(`✓ ${candidate.nome} encaixado no horário das ${openSlot.horarioInicio}!`);
    } else {
      onOpenAgendamento(currentTurno, currentConsultor, { horario: '15:00', tipo: candidate.tipoDesejado });
    }
  };

  // Filtro avançado e reativo de alunos
  const filteredStudents = students.filter((s) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term || 
      s.nome.toLowerCase().includes(term) ||
      s.negocio.toLowerCase().includes(term) ||
      (s.whatsapp && s.whatsapp.includes(term)) ||
      (s.documento && s.documento.includes(term));

    if (!matchesSearch) return false;
    if (statusFilter === 'informal') return s.statusNegocio === 'Informal';
    if (statusFilter === 'mei') return s.statusNegocio === 'MEI';
    if (statusFilter === 'alerta') return s.totalFaltas >= 1 || s.etapaPrograma === 'Desligado';
    if (statusFilter === 'inscrito') return s.etapaPrograma === 'Inscrito';
    return true;
  });

  const antiLimboStudents = students.filter(s => s.statusNegocio !== 'MEI');

  return (
    <div className="space-y-6 relative">
      {/* Toast de Feedback em Tempo Real */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-xl border flex items-center gap-3 transition-all duration-300 animate-slide-in ${
          toastMessage.type === 'warning' 
            ? 'bg-amber-500 text-white border-amber-600' 
            : 'bg-[#004A8D] text-white border-blue-900 ring-2 ring-[#F29100]'
        }`}>
          <CheckCircle2 className="w-5 h-5 text-[#F29100] shrink-0" />
          <span className="text-xs font-bold">{toastMessage.msg}</span>
          <button 
            onClick={() => setToastMessage(null)} 
            className="text-white/80 hover:text-white font-bold text-xs ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 0: VISÃO GERAL DA RECEPÇÃO (DASHBOARD EXECUTIVO)           */}
      {/* ============================================================== */}
      {currentTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Banner de Boas-Vindas */}
          <div className="bg-gradient-to-r from-[#0030A3] via-[#004A8D] to-[#002660] text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-white/15 text-blue-100 border border-white/20">
                Painel da Recepção • SENAC Hub
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
                Olá, Max Ferreira!
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
                Acompanhe a ocupação das salas, o fluxo diário de atendimentos e gerencie encaixes sem janelas ociosas.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenNovoMentorado}
                className="px-4 py-2.5 rounded-2xl bg-[#F29100] hover:bg-[#d98200] active:scale-98 text-slate-950 font-black text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Cadastrar Mentorado</span>
              </button>
            </div>
          </div>

          {/* 4 Cards de Métricas Estratégicas (SENAC Blue & Orange) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Ocupação do Turno
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#004A8D]/10 text-[#004A8D]">
                  Hoje
                </span>
              </div>
              <div className="my-2">
                <h3 className="text-3xl font-black text-[#004A8D] tracking-tight">100%</h3>
                <p className="text-xs text-slate-500 mt-1">4h fechadas sem janelas ociosas</p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Grade otimizada
              </span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Assiduidade
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  +12.4%
                </span>
              </div>
              <div className="my-2">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">92.4%</h3>
                <p className="text-xs text-slate-500 mt-1">Taxa de no-show controlada</p>
              </div>
              <span className="text-[11px] font-semibold text-[#004A8D] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Confirmação ativa via WhatsApp
              </span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Meta MEI D+60
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Meta
                </span>
              </div>
              <div className="my-2">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                  {students.filter((s) => s.statusNegocio === 'MEI').length}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Alunos formalizados com CNPJ</p>
              </div>
              <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> 2 em formalização D+60
              </span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Ações Rápidas
              </span>
              <div className="space-y-2 my-2">
                <button
                  onClick={handleDispararWhatsApp}
                  className="w-full py-2 px-3 rounded-2xl bg-[#F29100]/15 hover:bg-[#F29100]/25 text-[#9A5B00] font-bold text-xs border border-[#F29100]/30 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-[#C87500]" />
                  <span>{isWhatsappSent ? '✓ Lembretes Enviados' : 'Disparar WhatsApp 24h'}</span>
                </button>
                <button
                  onClick={() => setCurrentTab && setCurrentTab('grade')}
                  className="w-full py-2 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-[#004A8D]" />
                  <span>Gerenciar Turno de 4h</span>
                </button>
              </div>
              <span className="text-[10px] text-slate-400 text-center font-medium">Recepção Hub SENAC</span>
            </div>
          </div>

          {/* Grade Dividida em 2 Seções Espaçosas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Seção 1: Consultores em Atendimento Agora */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900">Salas & Consultores em Atendimento</h3>
                  <p className="text-xs text-slate-500">Status das salas do Hub neste momento</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Hub Operando
                </span>
              </div>

              <div className="space-y-3">
                {consultors.map((c) => (
                  <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#004A8D] text-white flex items-center justify-center font-black text-xs">
                        {c.nome.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{c.nome}</h4>
                        <p className="text-[10px] text-slate-500">{c.especialidade} • {c.sala}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-blue-50 text-[#004A8D] border border-blue-200">
                      Disponível
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Seção 2: Próximos Atendimentos de Hoje */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900">Atendimentos Agendados Hoje</h3>
                  <p className="text-xs text-slate-500">Quarta-feira (Turno das 14h às 18h)</p>
                </div>
                <button
                  onClick={() => setCurrentTab && setCurrentTab('agenda')}
                  className="text-xs font-bold text-[#004A8D] hover:underline"
                >
                  Ver Agenda Completa →
                </button>
              </div>

              <div className="space-y-3">
                {appointments.filter(a => a.turnoId === 'turno-1' || a.diaSemana === 'Quarta').slice(0, 3).map((ap) => {
                  const student = students.find(s => s.id === ap.alunoId);
                  const isAvailable = !ap.alunoId || ap.status === 'Disponivel';

                  return (
                    <div key={ap.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-[#004A8D] bg-white px-2 py-1 rounded-lg border border-slate-200">
                          {ap.horarioInicio}-{ap.horarioFim}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            {isAvailable ? 'Vaga Disponível (Encaixe)' : student?.nome || 'Mentorado'}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {isAvailable ? 'Espaço para fechar bloco de 4h' : student?.negocio}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isAvailable 
                          ? 'bg-[#F29100] text-slate-950 font-black' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isAvailable ? 'Aberta' : 'Confirmado'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 1: GRADE DE TURNOS (4 HORAS FECHADAS)                      */}
      {/* ============================================================== */}
      {currentTab === 'grade' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">
                  Grade de Turnos (4h Fechadas)
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  Consultora: {currentConsultor.nome}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Blocos contínuos sem intervalos vazios. Alocação: 1h + 1h + 2h ou 2h + 2h.
              </p>
            </div>

            {/* Seletores dos dias da semana */}
            <div className="flex items-center gap-2 overflow-x-auto">
              {currentConsultor.turnos?.map((turno) => {
                const isSelected = selectedTurnoId === turno.id;
                return (
                  <button
                    key={turno.id}
                    onClick={() => setSelectedTurnoId(turno.id)}
                    className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-[#004A8D] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 border border-slate-200/60'
                    }`}
                  >
                    {turno.diaSemana.split('-')[0]} ({turno.horarioInicio}-{turno.horarioFim})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Visual Proporcional do Bloco de 4 Horas */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Composição do Turno (14:00 às 18:00):</span>
              <span className="text-[#004A8D] font-extrabold">{totalHorasOcupadas} de 4 horas preenchidas</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {turnoAppointments.map((ap) => {
                const student = students.find((s) => s.id === ap.alunoId);
                const isAvailable = !ap.alunoId || ap.status === 'Disponivel' || ap.status === 'Cancelado';
                const isDone = ap.status === 'Realizada';
                const isFalta = ap.status?.includes('Falta');

                if (isAvailable) {
                  return (
                    <div key={ap.id} className="p-4 rounded-2xl bg-[#F29100]/5 border-2 border-dashed border-[#F29100]/60 shadow-2xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold text-[#C87500] font-mono">{ap.horarioInicio} - {ap.horarioFim}</span>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#F29100] text-slate-950">
                            Vaga Aberta
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">Espaço para Fechar Bloco de 4h</h4>
                        <p className="text-xs text-slate-500">Zero ociosidade para a consultora {currentConsultor?.nome}</p>
                      </div>
                      <div className="mt-3 space-y-1.5">
                        {waitingList && waitingList.length > 0 ? (
                          <button
                            onClick={() => handleEncaixarCandidato(waitingList[0])}
                            className="w-full py-2 rounded-xl bg-[#004A8D] hover:bg-[#003B70] text-white font-bold text-xs flex items-center justify-center gap-1 transition cursor-pointer shadow-xs"
                          >
                            <Zap className="w-3.5 h-3.5 text-[#F29100]" />
                            <span>Encaixar {waitingList[0].nome} (Fila)</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onOpenAgendamento(currentTurno, currentConsultor, { horario: ap.horarioInicio, tipo: ap.tipo })}
                            className="w-full py-2 rounded-xl bg-[#004A8D] hover:bg-[#003B70] text-white font-bold text-xs flex items-center justify-center gap-1 transition cursor-pointer shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5 text-[#F29100]" />
                            <span>+ Agendar Horário</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={ap.id} className={`p-4 rounded-2xl bg-white border shadow-2xs space-y-3 ${
                    isDone ? 'border-emerald-300 ring-1 ring-emerald-200' : isFalta ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200/80'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 font-mono">{ap.horarioInicio} - {ap.horarioFim}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isDone 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : isFalta 
                            ? 'bg-rose-100 text-rose-800' 
                            : 'bg-blue-50 text-[#004A8D] border border-blue-200'
                      }`}>
                        {isDone ? '✓ Realizada' : isFalta ? 'Falta <24h' : ap.tipo === 'Diagnostico_1h' ? 'Diagnóstico 1h' : 'Mentoria 2h'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{student?.avatar || '👤'}</span>
                        <h4 className="text-sm font-bold text-slate-900">{student?.nome || 'Empreendedor'}</h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{student?.negocio || 'Negócio'}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-slate-500 truncate max-w-[120px]">
                        {ap.whatsappStatus || 'Agendado'}
                      </span>
                      {!isDone && !isFalta ? (
                        <div className="flex items-center gap-1 shrink-0">
                          <button 
                            onClick={() => handleMarcarPresenca(ap.id, student?.nome)}
                            className="px-2 py-1 text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg cursor-pointer transition"
                          >
                            Presença
                          </button>
                          <button 
                            onClick={() => handleMarcarFalta(ap.id, student?.nome)}
                            className="px-2 py-1 text-[10px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg cursor-pointer transition"
                          >
                            Falta
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onUpdateAppointmentStatus(ap.id, 'Confirmado')}
                          className="text-[10px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
                        >
                          Reverter
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 2: AGENDA SEMANAL COMPLETA & INTERATIVA (DROPBOX CLICÁVEL) */}
      {/* ============================================================== */}
      {currentTab === 'agenda' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          {/* Topo da Agenda: Filtros de Consultores, Salas e Ação Rápida */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#004A8D]" />
                  <span>Agenda Semanal do Hub</span>
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#004A8D]/10 text-[#004A8D]">
                  {appointments.length} horários cadastrados
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Clique nas caixas de agendamento para abrir as opções de confirmação, prontuário e encaixe rápido.
              </p>
            </div>

            {/* Controles de Filtros Dropdown e Novo Agendamento */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Filtro por Consultor */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Consultor:</span>
                <select
                  value={agendaConsultorFilter}
                  onChange={(e) => setAgendaConsultorFilter(e.target.value)}
                  className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer text-xs"
                >
                  <option value="todos">Todos os Consultores</option>
                  {consultors.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>

              {/* Filtro por Sala */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Sala:</span>
                <select
                  value={agendaSalaFilter}
                  onChange={(e) => setAgendaSalaFilter(e.target.value)}
                  className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer text-xs"
                >
                  <option value="todas">Todas as Salas</option>
                  <option value="Sala 02 Presencial">Sala 02 Presencial</option>
                  <option value="Sala 03 Presencial">Sala 03 Presencial</option>
                  <option value="Balcão do Empreendedor">Balcão do Empreendedor</option>
                </select>
              </div>

              <button
                onClick={() => onOpenAgendamento(currentTurno, currentConsultor)}
                className="px-4 py-2 rounded-xl bg-[#004A8D] hover:bg-[#003B70] text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#F29100]" />
                <span>+ Novo Agendamento</span>
              </button>
            </div>
          </div>

          {/* Grade Semanal de 6 Colunas (Segunda a Sábado) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start">
            {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((dia, idx) => {
              // Filtra os agendamentos pertencentes ao dia
              const dayAppointments = appointments.filter((ap) => {
                const matchesDia = ap.diaSemana === dia || 
                  (dia === 'Quarta' && (ap.turnoId === 'turno-1' || ap.diaSemana === 'Quarta')) ||
                  (ap.data && ap.data.includes(`-${19 + idx}`));
                
                if (!matchesDia) return false;
                if (agendaConsultorFilter !== 'todos' && ap.consultorId !== agendaConsultorFilter) return false;
                if (agendaSalaFilter !== 'todas' && ap.sala !== agendaSalaFilter) return false;
                return true;
              });

              const isToday = dia === 'Quarta';

              return (
                <div 
                  key={dia} 
                  className={`p-3.5 rounded-2xl border transition ${
                    isToday 
                      ? 'bg-blue-50/40 border-[#004A8D]/40 ring-1 ring-[#004A8D]/30' 
                      : 'bg-slate-50/80 border-slate-200/80'
                  }`}
                >
                  {/* Cabeçalho do Dia */}
                  <div className="flex items-center justify-between border-b border-slate-200/70 pb-2.5 mb-3">
                    <div>
                      <span className="text-xs font-black text-slate-800">{dia}</span>
                      <p className="text-[10px] text-slate-400 font-mono">14h - 18h</p>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isToday 
                        ? 'bg-[#004A8D] text-white' 
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {isToday ? 'Hoje' : `${dayAppointments.length} slots`}
                    </span>
                  </div>

                  {/* Lista de Caixas de Agendamento Interativas / Dropbox Clicável */}
                  <div className="space-y-2.5">
                    {dayAppointments.length === 0 ? (
                      <div className="p-3 text-center rounded-xl border border-dashed border-slate-200 text-slate-400 text-[11px]">
                        Nenhum horário
                      </div>
                    ) : (
                      dayAppointments.map((ap) => {
                        const student = students.find((s) => s.id === ap.alunoId);
                        const isExpanded = activeDropdownId === ap.id;
                        const isAvailable = !ap.alunoId || ap.status === 'Disponivel';
                        const consultorName = consultors.find(c => c.id === ap.consultorId)?.nome || 'Consultor SENAC';

                        return (
                          <div 
                            key={ap.id}
                            className={`rounded-2xl transition shadow-2xs relative ${
                              isAvailable
                                ? 'bg-[#F29100]/5 border-2 border-dashed border-[#F29100]/50 hover:bg-[#F29100]/10'
                                : isExpanded
                                  ? 'bg-white border-2 border-[#004A8D] shadow-md ring-2 ring-[#004A8D]/15'
                                  : 'bg-white border border-slate-200/90 hover:border-[#004A8D]/60 hover:shadow-xs'
                            }`}
                          >
                            {/* Card Clicável Principal */}
                            <button
                              type="button"
                              onClick={() => setActiveDropdownId(isExpanded ? null : ap.id)}
                              className="w-full text-left p-3 cursor-pointer focus:outline-none"
                            >
                              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                                <span className="font-bold text-slate-700">{ap.horarioInicio} - {ap.horarioFim}</span>
                                <span className={`font-bold px-1.5 py-0.2 rounded-md ${
                                  isAvailable 
                                    ? 'bg-[#F29100] text-slate-950 font-black' 
                                    : ap.tipo === 'Diagnostico_1h'
                                      ? 'bg-blue-100 text-[#004A8D]'
                                      : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {isAvailable ? 'Vaga' : ap.tipo === 'Diagnostico_1h' ? '1h Diag' : '2h Ment'}
                                </span>
                              </div>

                              {isAvailable ? (
                                <div>
                                  <p className="text-xs font-black text-[#9A5B00]">Horário Livre (Encaixe)</p>
                                  <p className="text-[10px] text-slate-500">Clique para reservar vaga</p>
                                </div>
                              ) : (
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs">{student?.avatar || '👤'}</span>
                                    <p className="text-xs font-bold text-slate-900 truncate">
                                      {student?.nome || 'Aluno Alocado'}
                                    </p>
                                  </div>
                                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                                    {student?.negocio || 'Empreendimento'}
                                  </p>
                                </div>
                              )}

                              {/* Rodapé com Indicador de Dropdown */}
                              <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                                <span className="text-slate-400 truncate max-w-[100px]">{ap.sala || 'Sala 02'}</span>
                                <div className="flex items-center gap-1 text-[#004A8D] font-bold">
                                  <span>Opções</span>
                                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                </div>
                              </div>
                            </button>

                            {/* ========================================================= */}
                            {/* DROPDOWN / POPOVER CLICÁVEL COM AÇÕES COMPLETAS           */}
                            {/* ========================================================= */}
                            {isExpanded && (
                              <div className="p-3 bg-slate-50 border-t border-slate-200/80 rounded-b-2xl space-y-2.5 animate-fade-in text-xs">
                                {isAvailable ? (
                                  <div className="space-y-2">
                                    <p className="text-[11px] text-slate-600 font-medium">
                                      Vaga livre para manter o turno contínuo e sem intervalos ociosos.
                                    </p>
                                    <button
                                      onClick={() => onOpenAgendamento(currentTurno, currentConsultor, { horario: ap.horarioInicio, tipo: ap.tipo })}
                                      className="w-full py-2 px-2.5 rounded-xl bg-[#004A8D] hover:bg-[#003B70] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                                    >
                                      <Plus className="w-3.5 h-3.5 text-[#F29100]" />
                                      <span>Encaixar Aluno Neste Horário</span>
                                    </button>
                                  </div>
                                ) : (
                                  <div className="space-y-2.5">
                                    {/* Detalhes do Aluno */}
                                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 space-y-1">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                          ap.status === 'Realizada'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : ap.status?.includes('Falta')
                                              ? 'bg-rose-100 text-rose-800'
                                              : 'bg-blue-100 text-[#004A8D]'
                                        }`}>
                                          {ap.status || 'Confirmado'}
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-slate-700 font-medium">
                                        <strong>Consultor:</strong> {consultorName}
                                      </p>
                                      {student?.whatsapp && (
                                        <p className="text-[10px] text-slate-500 font-mono">
                                          Tel: {student.whatsapp}
                                        </p>
                                      )}
                                    </div>

                                    {/* Botões Rápidos de Ação Operacional */}
                                    <div className="grid grid-cols-2 gap-1.5">
                                      <button
                                        onClick={() => {
                                          handleMarcarPresenca(ap.id, student?.nome);
                                          setActiveDropdownId(null);
                                        }}
                                        className="py-1.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold text-[10px] flex items-center justify-center gap-1 transition cursor-pointer"
                                      >
                                        <Check className="w-3 h-3 text-emerald-700" />
                                        <span>Presença</span>
                                      </button>
                                      <button
                                        onClick={() => {
                                          handleMarcarFalta(ap.id, student?.nome);
                                          setActiveDropdownId(null);
                                        }}
                                        className="py-1.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-[10px] flex items-center justify-center gap-1 transition cursor-pointer"
                                      >
                                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                                        <span>Falta &lt;24h</span>
                                      </button>
                                    </div>

                                    {student && (
                                      <button
                                        onClick={() => {
                                          onOpenDiario(student);
                                          setActiveDropdownId(null);
                                        }}
                                        className="w-full py-1.5 px-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 font-bold text-[10px] text-slate-700 flex items-center justify-center gap-1 transition cursor-pointer"
                                      >
                                        <FileText className="w-3 h-3 text-[#004A8D]" />
                                        <span>Abrir Prontuário Digital</span>
                                      </button>
                                    )}

                                    {student?.whatsapp && (
                                      <a
                                        href={`https://wa.me/55${student.whatsapp.replace(/\D/g, '')}?text=Olá%20${encodeURIComponent(student.nome)},%20confirmamos%20seu%20atendimento%20no%20Hub%20SENAC%20às%20${ap.horarioInicio}.`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full py-1.5 px-2 rounded-xl bg-[#F29100]/15 hover:bg-[#F29100]/25 border border-[#F29100]/30 font-bold text-[10px] text-[#9A5B00] flex items-center justify-center gap-1 transition text-center"
                                      >
                                        <Phone className="w-3 h-3 text-[#C87500]" />
                                        <span>Confirmar WhatsApp</span>
                                      </a>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}

                    {/* Botão sutil para agendar mais um horário no dia */}
                    <button
                      onClick={() => onOpenAgendamento(currentTurno, currentConsultor, { diaSemana: dia })}
                      className="w-full py-2 rounded-xl border border-dashed border-slate-200 hover:border-[#004A8D] hover:text-[#004A8D] text-slate-400 font-bold text-[11px] flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Agendar</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 3: GESTÃO COMPLETA DE ALUNOS & MENTORADOS                  */}
      {/* ============================================================== */}
      {currentTab === 'mentorados' && (
        <div id="secao-mentorados" className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">Gestão & Cadastro de Mentorados</h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#004A8D]/10 text-[#004A8D] border border-[#004A8D]/20">
                  {filteredStudents.length} cadastrado(s)
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Pesquise em tempo real, cadastre novos alunos e abra prontuários digitais.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por nome, negócio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-[#004A8D] focus:outline-none transition w-52 sm:w-64"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[10px] font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50/70 font-bold text-slate-700 focus:outline-none focus:bg-white cursor-pointer"
              >
                <option value="todos">Todos os Alunos</option>
                <option value="informal">Informais (Foco MEI)</option>
                <option value="mei">Já Formalizados (MEI)</option>
                <option value="alerta">Com Faltas / Risco</option>
                <option value="inscrito">Recém-Inscritos</option>
              </select>

              <button
                onClick={onOpenNovoMentorado}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#004A8D] hover:bg-[#003B70] transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#F29100]" />
                <span>+ Novo Mentorado</span>
              </button>
            </div>
          </div>

          {/* Tabela de Resultados */}
          <div className="overflow-x-auto">
            {filteredStudents.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Search className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-700">Nenhum mentorado encontrado para "{searchTerm}"</p>
                <button
                  onClick={onOpenNovoMentorado}
                  className="px-4 py-2 text-xs font-bold text-[#004A8D] bg-blue-50 hover:bg-blue-100 rounded-xl transition cursor-pointer"
                >
                  + Cadastrar Mentorado Agora
                </button>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-3 px-3">Mentorado / Contato</th>
                    <th className="py-3 px-3">Negócio</th>
                    <th className="py-3 px-3">Etapa Atual</th>
                    <th className="py-3 px-3">Situação MEI</th>
                    <th className="py-3 px-3">Assiduidade</th>
                    <th className="py-3 px-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{student.avatar || '💼'}</span>
                          <div>
                            <p className="font-bold text-slate-900">{student.nome}</p>
                            <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                              <Phone className="w-2.5 h-2.5 text-slate-400" /> {student.whatsapp}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-700">{student.negocio}</span>
                        {student.documento && student.documento !== 'Não informado' && (
                          <p className="text-[10px] text-slate-400 font-mono">CPF: {student.documento}</p>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {student.etapaPrograma} (Sessão {student.sessaoAtual || 1}/5)
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          student.statusNegocio === 'MEI'
                            ? 'bg-blue-100 text-[#004A8D]'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {student.statusNegocio}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {student.totalFaltas === 0 ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Presente
                          </span>
                        ) : (
                          <span className="text-rose-700 font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> {student.totalFaltas} falta(s)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenAgendamento(currentTurno, currentConsultor, { alunoId: student.id })}
                            className="px-2.5 py-1 text-[11px] font-bold text-[#004A8D] bg-blue-50 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                          >
                            Encaixar
                          </button>
                          <button
                            onClick={() => onOpenDiario(student)}
                            className="px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          >
                            Prontuário
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 4: FORMALIZAÇÃO MEI & PÓS-CICLO (ACOMPANHAMENTO D+30 E D+60)*/}
      {/* ============================================================== */}
      {currentTab === 'antilimbo' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <span>Formalização & Pós-Ciclo MEI (Acompanhamento D+30 e D+60)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Garante que alunos que concluíram a 5ª sessão não fiquem sem abrir seu CNPJ e separar suas finanças.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
              {antiLimboStudents.length} Em Acompanhamento
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {antiLimboStudents.map(student => (
              <div key={student.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{student.avatar || '💼'}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{student.nome}</h4>
                      <p className="text-[10px] text-slate-500">{student.negocio}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    Sessão {student.sessaoAtual}/5
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-100 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Meta da Formalização:</span>
                  <p className="text-slate-700 font-medium">Abertura de MEI no Portal do Empreendedor e separação bancária PJ.</p>
                </div>

                <div className="flex items-center justify-between pt-2 flex-wrap gap-2">
                  <a
                    href={`https://wa.me/55${(student.whatsapp || '').replace(/\D/g, '')}?text=Olá%20${encodeURIComponent(student.nome)},%20aqui%20é%20do%20Hub%20SENAC!%20Como%20está%20o%20processo%20do%20seu%20MEI?`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#004A8D] text-xs font-bold flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-[#004A8D]" />
                    <span>WhatsApp D+30/60</span>
                  </a>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenDiario(student)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200/70"
                    >
                      Prontuário
                    </button>
                    {onFormalizarAluno && (
                      <button
                        onClick={() => {
                          onFormalizarAluno(student.id, { cnpj: '54.892.102/0001-38' });
                          showToast(`✓ ${student.nome} formalizado com sucesso como MEI!`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold cursor-pointer"
                      >
                        Registrar MEI
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* ============================================================== */}
      {/* ABA 5: FILA DE ESPERA & ENCAIXES RÁPIDOS                      */}
      {/* ============================================================== */}
      {currentTab === 'espera' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#004A8D]" />
                  <span>Fila de Espera & Encaixes Imediatos</span>
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#F29100]/15 text-[#9A5B00] border border-[#F29100]/30">
                  {waitingList.length} aguardando vaga
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Alunos pré-cadastrados que aguardam abertura de horários para diagnóstico ou encaixe rápido de 1 hora.
              </p>
            </div>
            <button
              onClick={() => setShowAddWaitingForm(!showAddWaitingForm)}
              className="px-4 py-2 rounded-xl bg-[#004A8D] hover:bg-[#003B70] text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#F29100]" />
              <span>{showAddWaitingForm ? '✕ Cancelar' : '+ Adicionar à Fila'}</span>
            </button>
          </div>

          {showAddWaitingForm && (
            <form onSubmit={handleSalvarCandidatoFila} className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3 animate-fade-in">
              <h4 className="text-xs font-black text-[#004A8D] uppercase">Novo Empreendedor na Fila</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Nome do empreendedor"
                  value={newWaitingName}
                  onChange={(e) => setNewWaitingName(e.target.value)}
                  required
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
                <input
                  type="text"
                  placeholder="Negócio (Ex: Marmitas Express)"
                  value={newWaitingBusiness}
                  onChange={(e) => setNewWaitingBusiness(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
                <input
                  type="text"
                  placeholder="WhatsApp com DDD"
                  value={newWaitingPhone}
                  onChange={(e) => setNewWaitingPhone(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddWaitingForm(false)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#004A8D] hover:bg-[#003B70] text-white font-bold text-xs rounded-xl"
                >
                  Confirmar Inclusão
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {waitingList.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{item.nome}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-[#004A8D]">
                      Espera: {item.tempoEsperaDias} dia(s)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{item.negocio}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Contato: {item.whatsapp}</p>
                </div>

                <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500">
                    Interesse: {item.tipoDesejado === 'Diagnostico_1h' ? 'Diagnóstico 1h' : 'Mentoria 2h'}
                  </span>
                  <button
                    onClick={() => handleEncaixarCandidato(item)}
                    className="px-3 py-1.5 rounded-xl bg-[#004A8D] hover:bg-[#003B70] text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3 h-3 text-[#F29100]" />
                    <span>Encaixar no Turno</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
