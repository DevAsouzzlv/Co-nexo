// src/components/EncaixeModal.jsx
import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Calendar, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Building2, 
  Zap, 
  Sparkles,
  Phone
} from 'lucide-react';

export default function EncaixeModal({
  isOpen,
  onClose,
  initialCandidate = null,
  initialSlot = null,
  waitingList = [],
  students = [],
  appointments = [],
  consultors = [],
  onConfirmEncaixe
}) {
  // Procura todos os slots vagos (sem alunoId ou status 'Disponivel')
  const availableSlots = appointments.filter(
    (a) => !a.alunoId || a.status === 'Disponivel'
  );

  // Candidato selecionado (da fila de espera ou aluno)
  const [selectedCandidateId, setSelectedCandidateId] = useState(
    initialCandidate?.id || waitingList[0]?.id || ''
  );
  
  const [selectedSlotId, setSelectedSlotId] = useState(
    initialSlot?.id || availableSlots[0]?.id || ''
  );

  const [sendWhatsApp, setSendWhatsApp] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Sincroniza quando o modal abre com novo candidato ou slot
  React.useEffect(() => {
    if (isOpen) {
      if (initialCandidate?.id) {
        setSelectedCandidateId(initialCandidate.id);
      } else if (waitingList.length > 0) {
        setSelectedCandidateId(waitingList[0].id);
      }
      if (initialSlot?.id) {
        setSelectedSlotId(initialSlot.id);
      } else if (availableSlots.length > 0) {
        setSelectedSlotId(availableSlots[0].id);
      }
      setErrorMsg('');
    }
  }, [isOpen, initialCandidate, initialSlot]);

  if (!isOpen) return null;

  // Identifica os objetos selecionados
  const selectedCandidate = waitingList.find((w) => w.id === selectedCandidateId) ||
    students.find((s) => s.id === selectedCandidateId) ||
    initialCandidate;

  const selectedSlot = appointments.find((a) => a.id === selectedSlotId) || initialSlot || availableSlots[0];
  const consultor = consultors.find((c) => c.id === selectedSlot?.consultorId) || consultors[0];

  const handleConfirm = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedCandidate) {
      setErrorMsg('Por favor, selecione quem será encaixado nesta vaga.');
      return;
    }

    if (!selectedSlot) {
      setErrorMsg('Por favor, selecione a vaga de atendimento para o encaixe.');
      return;
    }

    onConfirmEncaixe({
      slotId: selectedSlot.id,
      candidateId: selectedCandidate.id,
      candidateName: selectedCandidate.nome,
      candidateBusiness: selectedCandidate.negocio,
      candidatePhone: selectedCandidate.whatsapp,
      diaSemana: selectedSlot.diaSemana,
      data: selectedSlot.data,
      horario: `${selectedSlot.horarioInicio} - ${selectedSlot.horarioFim}`,
      sala: selectedSlot.sala || 'Sala 01 Presencial',
      consultorNome: consultor?.nome || 'Consultoria SENAC',
      sendWhatsApp
    });

    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-2.5 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-xl w-full max-h-[92dvh] flex flex-col overflow-hidden border border-slate-200/90 text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho Oficial Co.Nexo (Azul Royal & Verde Limão da Logo) */}
        <div className="bg-gradient-to-r from-[#004A8D] via-[#00386C] to-[#00264A] px-4 sm:px-6 py-3.5 sm:py-5 text-white flex items-center justify-between shrink-0 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#84BD00]/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-2.5 sm:gap-3 relative z-10 min-w-0 pr-2">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-[#84BD00] text-slate-950 flex items-center justify-center font-black text-sm shadow-md shadow-[#84BD00]/30 shrink-0">
              ⚡
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black tracking-tight text-white truncate">
                  Encaixe Rápido de Vaga Ociosa
                </h3>
                <span className="text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#84BD00] text-slate-950 shadow-xs">
                  Zero Ociosidade
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-blue-100 truncate">
                Preenchimento inteligente de horários para atingir a meta de 8h/dia
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 sm:p-2 rounded-xl hover:bg-white/10 transition cursor-pointer relative z-10 shrink-0"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário / Conteúdo */}
        <form onSubmit={handleConfirm} className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1 custom-scrollbar text-xs">
          
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. SELEÇÃO DE QUEM VAI SER ENCAIXADO */}
          <div className="space-y-2">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#004A8D]" />
              <span>1. Quem vai ser atendido (Candidato / Empreendedor):</span>
            </label>

            {waitingList.length > 0 ? (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Candidatos em Fila de Espera Imediata:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {waitingList.map((cand) => {
                    const isSelected = selectedCandidateId === cand.id;
                    return (
                      <button
                        type="button"
                        key={cand.id}
                        onClick={() => setSelectedCandidateId(cand.id)}
                        className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-blue-50/70 border-[#004A8D] ring-2 ring-[#004A8D]/20 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{cand.nome}</h4>
                            <p className="text-[10px] text-slate-500 truncate mt-0.5">{cand.negocio}</p>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-[#004A8D] shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-1 border-t border-slate-100">
                          <span>{cand.tipoDesejado === 'Diagnostico_1h' ? 'Diagnóstico 1h' : 'Mentoria 2h'}</span>
                          <span className="font-semibold text-emerald-600">Espera {cand.tempoEsperaDias || 1}d</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Alternativa: Selecionar de alunos cadastrados */}
            <div className="pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                Ou selecione outro aluno cadastrado:
              </span>
              <select
                value={selectedCandidateId}
                onChange={(e) => setSelectedCandidateId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#004A8D] text-xs font-medium"
              >
                <option value="">Selecione um empreendedor...</option>
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.nome} • {st.negocio} ({st.etapaPrograma})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. SELEÇÃO DE QUANDO VAI SER O ATENDIMENTO */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#004A8D]" />
              <span>2. Quando vai ser (Escolha a Vaga / Horário Disponível):</span>
            </label>

            {availableSlots.length === 0 ? (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-center">
                ⚠️ Não há horários livres pré-cadastrados. O encaixe criará um novo horário extra na grade.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar p-0.5">
                {availableSlots.map((slot) => {
                  const isSelected = selectedSlotId === slot.id;
                  const cNome = consultors.find((c) => c.id === slot.consultorId)?.nome || 'Consultoria';
                  return (
                    <button
                      type="button"
                      key={slot.id}
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#84BD00]/15 border-[#84BD00] ring-2 ring-[#84BD00]/30 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <span className="text-[10px] font-black uppercase text-[#004A8D]">
                            {slot.diaSemana || 'Dia'} • {slot.data ? slot.data.split('-').reverse().slice(0, 2).join('/') : ''}
                          </span>
                          <h4 className="text-xs font-black text-slate-900 mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {slot.horarioInicio} - {slot.horarioFim}
                          </h4>
                        </div>
                        {isSelected && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#84BD00] text-slate-950">
                            Selecionado
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-2 pt-1 border-t border-slate-100 flex items-center justify-between">
                        <span>{slot.sala || 'Sala 01'}</span>
                        <span className="font-semibold truncate max-w-[100px]">{cNome.split(' ')[0]}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. RESUMO DO ENCAIXE COM DETALHES CLAROS DE QUEM E QUANDO */}
          {selectedCandidate && selectedSlot && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 via-emerald-50/50 to-lime-50/80 border border-blue-200/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#004A8D]">
                <Sparkles className="w-4 h-4 text-[#84BD00]" />
                <span>Resumo da Convocação Oficial:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="bg-white/60 p-2.5 rounded-xl border border-blue-100/60">
                  <span className="text-slate-400 font-bold block text-[10px]">Empreendedor:</span>
                  <span className="font-black text-slate-800 text-xs">{selectedCandidate.nome}</span>
                  <p className="text-[10px] text-slate-500">{selectedCandidate.negocio}</p>
                </div>
                <div className="bg-white/60 p-2.5 rounded-xl border border-blue-100/60">
                  <span className="text-slate-400 font-bold block text-[10px]">Data & Horário:</span>
                  <span className="font-black text-[#004A8D] text-xs">
                    {selectedSlot.diaSemana}, {selectedSlot.data || 'Hoje'} às {selectedSlot.horarioInicio}
                  </span>
                  <p className="text-[10px] text-slate-500">{selectedSlot.sala || 'Sala 01 Presencial'}</p>
                </div>
              </div>

              {/* Notificação WhatsApp */}
              <label className="flex items-start sm:items-center gap-2 pt-2 border-t border-blue-100/80 cursor-pointer text-[11px] text-slate-700">
                <input
                  type="checkbox"
                  checked={sendWhatsApp}
                  onChange={(e) => setSendWhatsApp(e.target.checked)}
                  className="rounded text-[#004A8D] focus:ring-[#004A8D] mt-0.5 sm:mt-0"
                />
                <span className="flex items-center gap-1 font-semibold flex-wrap">
                  <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                  Disparar mensagem automática no WhatsApp ({selectedCandidate.whatsapp || '(11) 97222-3344'})
                </span>
              </label>
            </div>
          )}

          {/* Botões do Rodapé */}
          <div className="pt-3 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer text-center"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#004A8D] hover:bg-[#00386C] text-white font-extrabold flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-[#004A8D]/20 active:scale-98"
            >
              <Zap className="w-4 h-4 text-[#84BD00]" />
              <span>Confirmar Encaixe no Turno</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
