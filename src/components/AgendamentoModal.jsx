// src/components/AgendamentoModal.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, AlertTriangle, CheckCircle2, Sparkles, Clock, User, Building2 } from 'lucide-react';
import { Modal, Button } from './ui';

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
  const safeConsultor = consultor || { id: 'cons-1', nome: 'Aline Ferreira', especialidade: 'Finanças & Custos', sala: 'Sala 02 Presencial' };
  const safeTurno = turno || { id: 'turno-1', diaSemana: 'Quarta-feira', data: '2026-10-21', horarioInicio: '14:00', horarioFim: '18:00' };

  // Identifica horários livres possíveis no bloco de 4 horas
  const turnoBaseHora = parseInt(safeTurno.horarioInicio?.split(':')[0] || '14', 10);
  const possiveisHoras = [
    '08:00', '09:00', '10:00', '11:00', 
    '14:00', '15:00', '16:00', '17:00'
  ];

  // Estado local completo do formulário
  const defaultData = initialSlot?.data || safeTurno.data || '2026-10-21';
  const defaultDia = initialSlot?.diaSemana || safeTurno.diaSemana || 'Quarta';
  const defaultHorario = initialSlot?.horario || initialSlot?.horarioInicio || '14:00';

  const [alunoId, setAlunoId] = useState(initialSlot?.alunoId || students[0]?.id || '');
  const [dataAgendamento, setDataAgendamento] = useState(defaultData);
  const [diaSemana, setDiaSemana] = useState(defaultDia);
  const [horarioInicio, setHorarioInicio] = useState(defaultHorario);
  const [tipo, setTipo] = useState(initialSlot?.tipo || 'Diagnostico_1h');
  const [consultorId, setConsultorId] = useState(safeConsultor?.id || 'cons-1');
  const [sala, setSala] = useState(safeConsultor?.sala || 'Sala 02 Presencial');
  const [observacao, setObservacao] = useState('');
  const [validationError, setValidationError] = useState('');

  // Re-sincroniza o formulário sempre que o modal abrir ou o slot selecionado mudar
  useEffect(() => {
    if (isOpen) {
      const dData = initialSlot?.data || safeTurno.data || '2026-10-21';
      const dDia = initialSlot?.diaSemana || safeTurno.diaSemana || 'Quarta';
      const dHorario = initialSlot?.horario || initialSlot?.horarioInicio || '14:00';
      setAlunoId(initialSlot?.alunoId || students[0]?.id || '');
      setDataAgendamento(dData);
      setDiaSemana(dDia);
      setHorarioInicio(dHorario);
      setTipo(initialSlot?.tipo || 'Diagnostico_1h');
      setConsultorId(safeConsultor?.id || 'cons-1');
      setSala(safeConsultor?.sala || 'Sala 02 Presencial');
      setObservacao('');
      setValidationError('');
    }
  }, [isOpen, initialSlot]);

  const selectedStudent = students.find((s) => s.id === alunoId);
  const isStudentBlocked = selectedStudent?.etapaPrograma === 'Desligado';

  // Atualiza dia da semana ao mudar a data
  const handleDataChange = (novaData) => {
    setDataAgendamento(novaData);
    if (novaData) {
      const dateObj = new Date(novaData + 'T12:00:00');
      const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      setDiaSemana(dias[dateObj.getDay()] || 'Quarta');
    }
  };

  // Calcula horário de término
  const duracaoHoras = tipo === 'Diagnostico_1h' ? 1 : 2;
  const calculaHorarioFim = (inicio, horas) => {
    const [h, m] = inicio.split(':').map(Number);
    const fimH = h + horas;
    return `${String(fimH).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}`;
  };
  const horarioFim = calculaHorarioFim(horarioInicio, duracaoHoras);

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

    onSaveAgendamento({
      targetAgendamentoId: initialSlot?.id || null,
      turnoId: safeTurno?.id || 'turno-1',
      consultorId,
      alunoId,
      tipo,
      horarioInicio,
      horarioFim,
      diaSemana,
      data: dataAgendamento,
      sala,
      status: 'Confirmado',
      whatsappStatus: 'Agendado no Sistema',
      sessaoNumero: tipo === 'Diagnostico_1h' ? 1 : (selectedStudent?.sessaoAtual || 2),
      pauta: tipo === 'Diagnostico_1h' ? 'Diagnóstico Inicial de Negócio & Custos' : 'Mentoria Aprofundada na Prática',
      observacao: observacao.trim()
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Agendar Mentoria na Grade"
      subtitle="Planejamento de Atendimentos • Co.Nexo SENAC Hub"
      icon={Calendar}
      badge="Anti-Ociosidade"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Banner de Validação Inline */}
        {validationError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Informações da Data e Dia */}
        <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F29100]" />
            <span className="font-bold text-slate-800">
              {diaSemana} • {dataAgendamento.split('-').reverse().join('/')}
            </span>
          </div>
          <span className="font-black text-[#004A8D] bg-white px-3 py-1 rounded-full border border-blue-200 shadow-2xs">
            {sala}
          </span>
        </div>

        {/* Seletor de Mentorado */}
        <div className="space-y-1">
          <label htmlFor="agend-aluno-select" className="text-xs font-bold text-slate-700 block">
            Selecione o Mentorado <span className="text-rose-500">*</span>
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

        {/* Alerta de Desligamento */}
        {isStudentBlocked && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Este mentorado atingiu o limite de faltas e não pode receber novos agendamentos.</span>
          </div>
        )}

        {/* Data e Dia da Semana Editáveis */}
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

        {/* Tipo de Atendimento */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">Tipo de Atendimento</label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setTipo('Diagnostico_1h')}
              className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer ${
                tipo === 'Diagnostico_1h'
                  ? 'border-[#004A8D] bg-blue-50/70 text-[#004A8D] font-bold shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="text-xs font-bold">Diagnóstico (1 Hora)</div>
              <div className="text-[10px] text-slate-500 font-normal mt-0.5">Mapeamento inicial de custos</div>
            </button>

            <button
              type="button"
              onClick={() => setTipo('Mentoria_2h')}
              className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer ${
                tipo === 'Mentoria_2h'
                  ? 'border-[#004A8D] bg-blue-50/70 text-[#004A8D] font-bold shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="text-xs font-bold">Mentoria (2 Horas)</div>
              <div className="text-[10px] text-slate-500 font-normal mt-0.5">Sessão prática na bancada</div>
            </button>
          </div>
        </div>

        {/* Horários */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <label htmlFor="agend-horario-inicio" className="text-xs font-bold text-slate-700 block">
              Horário de Início
            </label>
            <select
              id="agend-horario-inicio"
              value={horarioInicio}
              onChange={(e) => setHorarioInicio(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white font-mono focus:outline-none focus:ring-2 focus:ring-[#004A8D]/15 focus:border-[#004A8D]"
            >
              {possiveisHoras.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Horário de Término</label>
            <div className="px-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-100 font-mono text-slate-700 font-bold">
              {horarioFim} ({duracaoHoras}h de duração)
            </div>
          </div>
        </div>

        {/* Observações */}
        <div className="space-y-1">
          <label htmlFor="agend-obs" className="text-xs font-bold text-slate-700 block">
            Observações do Encaixe / Pauta
          </label>
          <textarea
            id="agend-obs"
            rows={2}
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            placeholder="Ex: Foco em calibração de CMV, corte de desperdício ou separação bancária..."
            className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004A8D]/15 focus:border-[#004A8D] placeholder:text-slate-400"
          />
        </div>

        {/* Rodapé com Botões de Ação Padronizados */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isStudentBlocked}
            leftIcon={CheckCircle2}
          >
            Confirmar e Gravar na Grade
          </Button>
        </div>
      </form>
    </Modal>
  );
}
