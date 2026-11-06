// src/components/AgendamentoModal.jsx
import React, { useState } from 'react';
import { Calendar, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
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
  const safeConsultor = consultor || { id: 'cons-1', nome: 'Aline Ferreira', especialidade: 'Finanças & Custos' };
  const safeTurno = turno || { id: 'turno-1', diaSemana: 'Quarta-feira', data: '2026-10-23', horarioInicio: '14:00', horarioFim: '18:00' };

  // Filtra agendamentos do turno atual com alunos
  const turnoAppointments = appointments.filter(
    (a) => a.turnoId === safeTurno.id && a.alunoId && a.status !== 'Cancelado' && a.status !== 'Disponivel'
  );

  // Calcula horas ocupadas
  const horasOcupadas = turnoAppointments.reduce((acc, curr) => {
    return acc + (curr.tipo === 'Diagnostico_1h' ? 1 : 2);
  }, 0);
  const horasLivres = Math.max(0, 4 - horasOcupadas);

  // Identifica horários livres possíveis no bloco de 4 horas
  const turnoBaseHora = parseInt(safeTurno.horarioInicio.split(':')[0], 10);
  const possiveisHoras = [turnoBaseHora, turnoBaseHora + 1, turnoBaseHora + 2, turnoBaseHora + 3].map(
    (h) => `${String(h).padStart(2, '0')}:00`
  );

  // Verifica quais horários estão ocupados
  const horariosOcupados = new Set();
  turnoAppointments.forEach((a) => {
    const inicioH = parseInt(a.horarioInicio.split(':')[0], 10);
    const duracao = a.tipo === 'Diagnostico_1h' ? 1 : 2;
    for (let i = 0; i < duracao; i++) {
      horariosOcupados.add(`${String(inicioH + i).padStart(2, '0')}:00`);
    }
  });

  const horariosDisponiveis = possiveisHoras.filter((h) => !horariosOcupados.has(h));

  // Estado local do formulário
  const defaultHorario = initialSlot?.horario || initialSlot?.horarioInicio || horariosDisponiveis[0] || safeTurno.horarioInicio;
  const [alunoId, setAlunoId] = useState(initialSlot?.alunoId || students[0]?.id || '');
  const [horarioInicio, setHorarioInicio] = useState(defaultHorario);
  const [tipo, setTipo] = useState(initialSlot?.tipo || (horasLivres === 1 ? 'Diagnostico_1h' : 'Diagnostico_1h'));
  const [observacao, setObservacao] = useState('');
  const [validationError, setValidationError] = useState('');

  const selectedStudent = students.find((s) => s.id === alunoId);
  const isStudentBlocked = selectedStudent?.etapaPrograma === 'Desligado';

  // Calcula horário de término
  const duracaoHoras = tipo === 'Diagnostico_1h' ? 1 : 2;
  const calculaHorarioFim = (inicio, horas) => {
    const [h, m] = inicio.split(':').map(Number);
    const fimH = h + horas;
    return `${String(fimH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };
  const horarioFim = calculaHorarioFim(horarioInicio, duracaoHoras);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!alunoId) {
      setValidationError('Selecione um mentorado para realizar o encaixe.');
      return;
    }
    if (isStudentBlocked) {
      setValidationError('Este empreendedor está desligado por regras de assiduidade do programa.');
      return;
    }

    onSaveAgendamento({
      targetAgendamentoId: initialSlot?.id || null,
      turnoId: safeTurno.id,
      consultorId: safeConsultor.id,
      alunoId,
      tipo,
      horarioInicio,
      horarioFim,
      status: 'Confirmado',
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
      title="Encaixar Mentorado na Grade"
      subtitle={`Turno de 4 Horas • ${safeConsultor.nome} (${safeTurno.diaSemana})`}
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

        {/* Status da Grade Atual */}
        <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F29100]" />
            <span className="font-bold text-slate-700">Regra Antiburaco:</span>
          </div>
          <span className="font-extrabold text-[#004A8D]">
            {horasLivres}h livre(s) neste turno (de 4h totais)
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

        {/* Alerta de Desligamento se selecionado */}
        {isStudentBlocked && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Este mentorado atingiu o limite de faltas e não pode receber novos agendamentos.</span>
          </div>
        )}

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
              <div className="text-[10px] text-slate-500 font-normal mt-0.5">Fecha par com outro de 1h</div>
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
              <div className="text-[10px] text-slate-500 font-normal mt-0.5">Sessão aprofundada de esteira</div>
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
                <option key={h} value={h}>
                  {h} {horariosOcupados.has(h) ? '(Ocupado)' : '(Livre)'}
                </option>
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
            Observações do Encaixe
          </label>
          <textarea
            id="agend-obs"
            rows={2}
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            placeholder="Ex: Empreendedor solicitou foco em formação de preço de salgados"
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
            Confirmar Encaixe na Grade
          </Button>
        </div>
      </form>
    </Modal>
  );
}
