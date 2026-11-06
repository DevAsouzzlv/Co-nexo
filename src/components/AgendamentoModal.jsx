// src/components/AgendamentoModal.jsx
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  User, 
  Building2,
  ShieldAlert,
  Info,
  Check
} from 'lucide-react';
import { Modal, Button } from './ui';

// Definição dos dois mentores oficiais e seus turnos estritos de 4 horas
const MENTORES_CONFIG = {
  'cons-1': {
    id: 'cons-1',
    nome: 'Aline Ferreira',
    cargo: 'Consultora de Negócios & Finanças',
    especialidade: 'Custos (CMV), Precificação e Gestão',
    sala: 'Sala 01 Presencial',
    periodoLabel: 'Turno da Manhã (4 horas)',
    horarioInicio: '08:00',
    horarioFim: '12:00',
    horariosPossiveis: ['08:00', '09:00', '10:00', '11:00']
  },
  'cons-2': {
    id: 'cons-2',
    nome: 'Jamile Mendes',
    cargo: 'Consultora de Mercado & Formalização',
    especialidade: 'Vendas, Canais Digitais e MEI',
    sala: 'Sala 02 Presencial',
    periodoLabel: 'Turno da Tarde (4 horas)',
    horarioInicio: '14:00',
    horarioFim: '18:00',
    horariosPossiveis: ['14:00', '15:00', '16:00', '17:00']
  }
};

export default function AgendamentoModal({
  isOpen,
  onClose,
  turno,
  consultor,
  students = [],
  initialSlot = null,
  appointments = [],
  onSaveAgendamento
}) {
  // Define o mentor inicial
  const initialConsultorId = initialSlot?.consultorId || consultor?.id || 'cons-1';
  const defaultConsultorId = MENTORES_CONFIG[initialConsultorId] ? initialConsultorId : 'cons-1';

  const defaultData = initialSlot?.data || turno?.data || '2026-10-21';
  const defaultDia = initialSlot?.diaSemana || turno?.diaSemana || 'Quarta';
  const defaultHorario = initialSlot?.horario || initialSlot?.horarioInicio || (defaultConsultorId === 'cons-1' ? '08:00' : '14:00');

  const [consultorId, setConsultorId] = useState(defaultConsultorId);
  const [alunoId, setAlunoId] = useState(initialSlot?.alunoId || students[0]?.id || '');
  const [dataAgendamento, setDataAgendamento] = useState(defaultData);
  const [diaSemana, setDiaSemana] = useState(defaultDia);
  const [tipo, setTipo] = useState(initialSlot?.tipo || 'Diagnostico_1h');
  const [horarioInicio, setHorarioInicio] = useState(defaultHorario);
  const [observacao, setObservacao] = useState('');
  const [validationError, setValidationError] = useState('');

  const activeMentor = MENTORES_CONFIG[consultorId] || MENTORES_CONFIG['cons-1'];

  // Sincroniza o modal sempre que abrir ou receber novo slot
  useEffect(() => {
    if (isOpen) {
      const cId = initialSlot?.consultorId || consultor?.id || 'cons-1';
      const validCId = MENTORES_CONFIG[cId] ? cId : 'cons-1';
      setConsultorId(validCId);
      
      const dData = initialSlot?.data || turno?.data || '2026-10-21';
      const dDia = initialSlot?.diaSemana || turno?.diaSemana || 'Quarta';
      const defaultH = validCId === 'cons-1' ? '08:00' : '14:00';
      const dHorario = initialSlot?.horario || initialSlot?.horarioInicio || defaultH;

      setAlunoId(initialSlot?.alunoId || students[0]?.id || '');
      setDataAgendamento(dData);
      setDiaSemana(dDia);
      setTipo(initialSlot?.tipo || 'Diagnostico_1h');
      setHorarioInicio(dHorario);
      setObservacao('');
      setValidationError('');
    }
  }, [isOpen, initialSlot, consultor, turno]);

  // Se trocar o mentor, garante que o horário pertença ao turno dele
  const handleSelectMentor = (novoConsultorId) => {
    setConsultorId(novoConsultorId);
    setValidationError('');
    const mentor = MENTORES_CONFIG[novoConsultorId];
    if (mentor) {
      if (!mentor.horariosPossiveis.includes(horarioInicio)) {
        setHorarioInicio(mentor.horariosPossiveis[0]);
      }
    }
  };

  // Atualiza dia da semana ao mudar a data
  const handleDataChange = (novaData) => {
    setDataAgendamento(novaData);
    if (novaData) {
      const dateObj = new Date(novaData + 'T12:00:00');
      const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      setDiaSemana(dias[dateObj.getDay()] || 'Quarta');
    }
  };

  // Cálculo de Horas Ocupadas da Mentora selecionada na data especificada
  const agendamentosDoMentorNoDia = appointments.filter((a) => {
    return (
      a.data === dataAgendamento &&
      a.consultorId === consultorId &&
      a.status !== 'Cancelado' &&
      a.status !== 'Disponivel' &&
      a.id !== initialSlot?.id
    );
  });

  const horasOcupadas = agendamentosDoMentorNoDia.reduce((total, ap) => {
    return total + (ap.tipo === 'Diagnostico_1h' ? 1 : 2);
  }, 0);

  const horasRestantes = Math.max(0, 4 - horasOcupadas);
  const isTurnoLotado = horasOcupadas >= 4;

  // Duração e horário de término
  const duracaoHoras = tipo === 'Diagnostico_1h' ? 1 : 2;
  const calculaHorarioFim = (inicio, horas) => {
    const [h, m] = (inicio || '08:00').split(':').map(Number);
    const fimH = h + horas;
    return `${String(fimH).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}`;
  };
  const horarioFim = calculaHorarioFim(horarioInicio, duracaoHoras);

  // Aluno selecionado
  const selectedStudent = students.find((s) => s.id === alunoId);
  const isStudentBlocked = selectedStudent?.etapaPrograma === 'Desligado';

  // Submissão do agendamento com todas as validações de governança
  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!alunoId) {
      setValidationError('Selecione um mentorado para realizar o agendamento.');
      return;
    }

    if (isStudentBlocked) {
      setValidationError('Este empreendedor está desligado por regras de assiduidade do programa.');
      return;
    }

    // REGRA 1: Limite máximo estrito de 4 horas por mentor por dia
    if (isTurnoLotado) {
      setValidationError(
        `Limite estrito de 4 horas atingido para ${activeMentor.nome} nesta data (${horasOcupadas}h/4h alocadas). Escolha o outro mentor ou outra data.`
      );
      return;
    }

    // REGRA 2: Não estourar o teto de 4 horas com a nova sessão
    if (horasOcupadas + duracaoHoras > 4) {
      setValidationError(
        `Esta sessão de ${duracaoHoras}h ultrapassa o limite de 4 horas do turno (atingiria ${horasOcupadas + duracaoHoras}h). Resta apenas 1h vaga: selecione 'Diagnóstico (1 Hora)' para fechar exatamente as 4h sem horário vazio!`
      );
      return;
    }

    // REGRA 3: Não ultrapassar o término do turno
    const [horaFimNum] = horarioFim.split(':').map(Number);
    const [limiteFimTurnoNum] = activeMentor.horarioFim.split(':').map(Number);
    if (horaFimNum > limiteFimTurnoNum) {
      setValidationError(
        `O atendimento terminaria às ${horarioFim}, ultrapassando o fim do ${activeMentor.periodoLabel} (${activeMentor.horarioFim}). Ajuste o horário de início.`
      );
      return;
    }

    // REGRA 4: Não colidir com outro agendamento do mesmo mentor
    const horarioInicioMin = parseInt(horarioInicio.split(':')[0], 10) * 60 + parseInt(horarioInicio.split(':')[1], 10);
    const horarioFimMin = parseInt(horarioFim.split(':')[0], 10) * 60 + parseInt(horarioFim.split(':')[1], 10);

    const conflito = agendamentosDoMentorNoDia.find((ap) => {
      const apInicioMin = parseInt(ap.horarioInicio.split(':')[0], 10) * 60 + parseInt(ap.horarioInicio.split(':')[1], 10);
      const apFimMin = parseInt(ap.horarioFim.split(':')[0], 10) * 60 + parseInt(ap.horarioFim.split(':')[1], 10);
      return Math.max(horarioInicioMin, apInicioMin) < Math.min(horarioFimMin, apFimMin);
    });

    if (conflito) {
      setValidationError(
        `Conflito de horário: ${activeMentor.nome} já possui atendimento marcado das ${conflito.horarioInicio} às ${conflito.horarioFim}.`
      );
      return;
    }

    onSaveAgendamento({
      targetAgendamentoId: initialSlot?.id || null,
      turnoId: consultorId === 'cons-1' ? 'turno-ali-qua' : 'turno-jam-qua',
      consultorId,
      alunoId,
      tipo,
      horarioInicio,
      horarioFim,
      diaSemana,
      data: dataAgendamento,
      sala: activeMentor.sala,
      status: 'Confirmado',
      whatsappStatus: 'Agendado no Sistema',
      sessaoNumero: tipo === 'Diagnostico_1h' ? 1 : (selectedStudent?.sessaoAtual || 2),
      pauta: tipo === 'Diagnostico_1h' 
        ? '1º Encontro: Diagnóstico Inicial de Negócio & Custos' 
        : 'Mentoria Prática de Aprofundamento',
      observacao: observacao.trim()
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Agendar Mentoria na Grade"
      subtitle="Governança de 8h Diárias • 4h Aline + 4h Jamile (Zero Ociosidade)"
      icon={Calendar}
      badge="Regra Co.Nexo"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Banner de Validação Inline */}
        {validationError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-semibold animate-fade-in">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* 1. SELETOR DE MENTOR (Aline 4h Manhã vs Jamile 4h Tarde) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 block">
              1. Selecione a Mentora & Turno de 4 Horas: <span className="text-rose-500">*</span>
            </label>
            <span className="text-[10px] font-black text-[#004A8D] bg-blue-50 px-2 py-0.5 rounded-md">
              Total Diário: 8h (4h + 4h)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {Object.values(MENTORES_CONFIG).map((m) => {
              const isSelected = consultorId === m.id;
              // Calcula ocupação deste mentor para exibir no card
              const ocupMentor = appointments
                .filter(a => a.data === dataAgendamento && a.consultorId === m.id && a.status !== 'Cancelado' && a.status !== 'Disponivel')
                .reduce((acc, a) => acc + (a.tipo === 'Diagnostico_1h' ? 1 : 2), 0);
              const restMentor = Math.max(0, 4 - ocupMentor);

              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleSelectMentor(m.id)}
                  className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer relative ${
                    isSelected
                      ? 'border-[#004A8D] bg-blue-50/70 text-[#004A8D] ring-2 ring-[#004A8D]/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-extrabold flex items-center gap-1.5">
                      <User className={`w-3.5 h-3.5 ${isSelected ? 'text-[#F29100]' : 'text-slate-400'}`} />
                      {m.nome}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      ocupMentor >= 4 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-[#F29100]/20 text-[#9A5B00]'
                    }`}>
                      {ocupMentor}/4h
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-800">{m.periodoLabel}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">{m.especialidade}</p>
                  <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">{m.sala}</span>
                    <span className={`font-black ${ocupMentor >= 4 ? 'text-emerald-700' : 'text-[#004A8D]'}`}>
                      {ocupMentor >= 4 ? 'Turno Completo' : `Faltam ${restMentor}h`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. MEDIDOR DA CAPACIDADE DE 4 HORAS DO TURNO & REGRA DAS 3 COMBINAÇÕES */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#004A8D]" />
              Ocupação de {activeMentor.nome} em {dataAgendamento.split('-').reverse().join('/')}:
            </span>
            <strong className="text-xs font-black text-[#004A8D]">
              {horasOcupadas}h / 4h alocadas ({Math.round((horasOcupadas / 4) * 100)}%)
            </strong>
          </div>

          {/* Barra de Progresso do Bloco de 4 Horas */}
          <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden flex">
            <div 
              style={{ width: `${Math.min(100, (horasOcupadas / 4) * 100)}%` }} 
              className={`h-full transition-all duration-300 ${
                horasOcupadas >= 4 ? 'bg-emerald-500' : 'bg-[#004A8D]'
              }`}
            />
          </div>

          {/* Status Explicativo */}
          <div className="flex items-center justify-between text-[11px]">
            {horasOcupadas >= 4 ? (
              <span className="font-extrabold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Turno de 4h preenchido com zero ociosidade!
              </span>
            ) : (
              <span className="font-bold text-[#004A8D] flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-[#F29100]" />
                Falta(m) <strong>{horasRestantes}h</strong> para fechar as 4h do mentor sem horário vazio.
              </span>
            )}
            <span className="text-slate-400 font-mono text-[10px]">
              Horário do Turno: {activeMentor.horarioInicio} às {activeMentor.horarioFim}
            </span>
          </div>

          {/* 3 Modelos de Grade Válidos */}
          <div className="pt-2 border-t border-slate-200/70">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              Combinações permitidas por mentor (Total 4h):
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
              <div className={`p-1.5 rounded-xl border ${
                horasOcupadas === 4 ? 'bg-blue-50 border-blue-200 text-[#004A8D] font-black' : 'bg-white border-slate-200 text-slate-600'
              }`}>
                <strong>2 Mentorias</strong>
                <div className="text-[9px] text-slate-400">2h + 2h = 4h</div>
              </div>
              <div className={`p-1.5 rounded-xl border ${
                horasOcupadas === 4 ? 'bg-blue-50 border-blue-200 text-[#004A8D] font-black' : 'bg-white border-slate-200 text-slate-600'
              }`}>
                <strong>4 Diagnósticos</strong>
                <div className="text-[9px] text-slate-400">1h x 4 = 4h</div>
              </div>
              <div className={`p-1.5 rounded-xl border ${
                horasOcupadas === 4 ? 'bg-blue-50 border-blue-200 text-[#004A8D] font-black' : 'bg-white border-slate-200 text-slate-600'
              }`}>
                <strong>1 Mentoria + 2 Diag.</strong>
                <div className="text-[9px] text-slate-400">2h + 1h + 1h = 4h</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. SELETOR DE MENTORADO */}
        <div className="space-y-1">
          <label htmlFor="agend-aluno-select" className="text-xs font-bold text-slate-700 block">
            Mentorado <span className="text-rose-500">*</span>
          </label>
          <select
            id="agend-aluno-select"
            value={alunoId}
            onChange={(e) => {
              setAlunoId(e.target.value);
              setValidationError('');
            }}
            className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004A8D]/15 focus:border-[#004A8D] font-medium"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id} disabled={s.etapaPrograma === 'Desligado'}>
                {s.nome} — {s.negocio} ({s.statusNegocio}) {s.etapaPrograma === 'Desligado' ? '⚠️ [DESLIGADO]' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* 4. DATA E DIA DA SEMANA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Data do Atendimento</label>
            <input
              type="date"
              value={dataAgendamento}
              onChange={(e) => handleDataChange(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white font-mono focus:outline-none focus:ring-2 focus:ring-[#004A8D]/15 focus:border-[#004A8D]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Dia da Semana</label>
            <select
              value={diaSemana}
              onChange={(e) => setDiaSemana(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004A8D]/15 focus:border-[#004A8D]"
            >
              {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 5. TIPO DE ATENDIMENTO (Diagnóstico 1h vs Mentoria 2h) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            Tipo de Atendimento <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                setTipo('Diagnostico_1h');
                setValidationError('');
              }}
              className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer ${
                tipo === 'Diagnostico_1h'
                  ? 'border-[#004A8D] bg-blue-50/70 text-[#004A8D] font-bold shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="text-xs font-bold">1º Encontro: Diagnóstico (1 Hora)</div>
              <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                Mapeamento inicial, precificação e CMV
              </div>
            </button>

            <button
              type="button"
              disabled={horasRestantes === 1}
              onClick={() => {
                if (horasRestantes === 1) {
                  setValidationError('Resta apenas 1 hora no turno da mentora. Selecione Diagnóstico de 1h para completar as 4h sem estourar o limite!');
                  return;
                }
                setTipo('Mentoria_2h');
                setValidationError('');
              }}
              className={`p-3 rounded-2xl border-2 text-left transition ${
                horasRestantes === 1
                  ? 'opacity-40 border-slate-200 bg-slate-100 cursor-not-allowed text-slate-400'
                  : tipo === 'Mentoria_2h'
                    ? 'border-[#004A8D] bg-blue-50/70 text-[#004A8D] font-bold shadow-xs cursor-pointer'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer'
              }`}
            >
              <div className="text-xs font-bold flex items-center justify-between">
                <span>Mentoria Prática (2 Horas)</span>
                {horasRestantes === 1 && <span className="text-[9px] text-rose-600 font-black">Estoura 4h</span>}
              </div>
              <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                Encontro aprofundado na bancada (2 horas)
              </div>
            </button>
          </div>
        </div>

        {/* 6. HORÁRIOS DO TURNO DO MENTOR */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <label htmlFor="agend-horario-inicio" className="text-xs font-bold text-slate-700 block">
              Horário de Início ({activeMentor.periodoLabel})
            </label>
            <select
              id="agend-horario-inicio"
              value={horarioInicio}
              onChange={(e) => {
                setHorarioInicio(e.target.value);
                setValidationError('');
              }}
              className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white font-mono focus:outline-none focus:ring-2 focus:ring-[#004A8D]/15 focus:border-[#004A8D]"
            >
              {activeMentor.horariosPossiveis.map((h) => {
                // Checa se o horário já está ocupado
                const hMin = parseInt(h.split(':')[0], 10) * 60;
                const estaOcupado = agendamentosDoMentorNoDia.some((ap) => {
                  const apIni = parseInt(ap.horarioInicio.split(':')[0], 10) * 60;
                  const apFim = parseInt(ap.horarioFim.split(':')[0], 10) * 60;
                  return hMin >= apIni && hMin < apFim;
                });

                return (
                  <option key={h} value={h}>
                    {h} {estaOcupado ? '— [OCUPADO]' : '— Disponível'}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Horário de Término</label>
            <div className="px-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-100 font-mono text-slate-700 font-bold flex items-center justify-between">
              <span>{horarioFim}</span>
              <span className="text-[10px] text-[#004A8D] font-extrabold">{duracaoHoras}h de sessão</span>
            </div>
          </div>
        </div>

        {/* Observações */}
        <div className="space-y-1">
          <label htmlFor="agend-obs" className="text-xs font-bold text-slate-700 block">
            Observações / Pauta
          </label>
          <textarea
            id="agend-obs"
            rows={2}
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            placeholder="Ex: Foco em calibração de CMV, precificação de marmitas ou abertura de MEI..."
            className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004A8D]/15 focus:border-[#004A8D] placeholder:text-slate-400"
          />
        </div>

        {/* Rodapé com Botões de Ação */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isStudentBlocked || isTurnoLotado}
            leftIcon={CheckCircle2}
          >
            {isTurnoLotado ? 'Turno Lotado (4h/4h)' : 'Confirmar e Gravar na Grade'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
