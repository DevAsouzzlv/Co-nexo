// src/components/DiarioBordoModal.jsx
import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  CheckCircle2, 
  Calendar, 
  Plus, 
  FileText, 
  ExternalLink,
  Phone,
  AlertCircle
} from 'lucide-react';

export default function DiarioBordoModal({
  isOpen,
  onClose,
  student,
  diarios = [],
  onSaveDiario,
  isReadOnly = false
}) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [sessaoNumero, setSessaoNumero] = useState(student?.sessaoAtual || 1);
  const [diagnostico, setDiagnostico] = useState('');
  const [tarefas, setTarefas] = useState('');
  const [linksMateriais, setLinksMateriais] = useState('');
  const [statusMei, setStatusMei] = useState(student?.statusNegocio || 'Informal');
  const [formError, setFormError] = useState('');

  React.useEffect(() => {
    if (isOpen && student) {
      setSessaoNumero(student.sessaoAtual || 1);
      setStatusMei(student.statusNegocio || 'Informal');
      setIsAddingNew(false);
      setDiagnostico('');
      setTarefas('');
      setLinksMateriais('');
      setFormError('');
    }
  }, [isOpen, student]);

  if (!isOpen || !student) return null;

  const studentDiarios = diarios.filter((d) => d.alunoId === student.id);

  const handleSave = (e) => {
    e.preventDefault();
    setFormError('');

    if (!diagnostico.trim() || diagnostico.trim().length < 10) {
      setFormError('Por favor, descreva o diagnóstico ou resumo pedagógico da sessão (mínimo 10 caracteres).');
      return;
    }

    onSaveDiario({
      id: `diario-${student.id}-${Date.now()}`,
      alunoId: student.id,
      sessaoNumero: Number(sessaoNumero),
      dataRegistro: new Date().toISOString().split('T')[0],
      tipo: sessaoNumero === 1 ? 'Diagnostico_1h' : 'Mentoria_2h',
      diagnostico: diagnostico.trim(),
      tarefasProximoEncontro: tarefas.trim(),
      linksMateriais: linksMateriais.trim(),
      statusMei,
      consultorNome: 'Consultoria'
    });

    setIsAddingNew(false);
    setDiagnostico('');
    setTarefas('');
    setLinksMateriais('');
    setFormError('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200/90"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho Oficial SENAC */}
        <div className="bg-gradient-to-r from-[#00386C] via-[#004A8D] to-[#00264A] px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#84BD00] text-slate-950 flex items-center justify-center text-lg font-black shrink-0 shadow-md">
              {student.avatar || '💼'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight text-white">{student.nome}</h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/20 text-white">
                  {student.negocio}
                </span>
              </div>
              <p className="text-xs text-blue-100">
                Prontuário Pedagógico Digital • Etapa: {student.etapaPrograma} • MEI: {student.statusNegocio}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Prontuário */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Card Resumo do Empreendedor */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Documento</span>
              <span className="font-bold text-slate-800">{student.documento || 'Não informado'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">WhatsApp</span>
              <a
                href={`https://wa.me/55${(student.whatsapp || '').replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#004A8D] hover:underline flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5 text-[#004A8D]" />
                {student.whatsapp}
              </a>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Assiduidade</span>
              <span className="font-bold text-slate-800">{student.totalFaltas || 0} falta(s)</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Sessão Atual</span>
              <span className="font-bold text-[#004A8D]">Sessão {student.sessaoAtual || 1} de 5</span>
            </div>
          </div>

          {/* Histórico das Sessões Registradas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Histórico de Encontros Pedagógicos ({studentDiarios.length})
              </h4>
              {!isReadOnly && !isAddingNew && (
                <button
                  type="button"
                  onClick={() => setIsAddingNew(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#004A8D] hover:bg-[#00386C] text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#84BD00]" />
                  <span>+ Novo Registro Pedagógico</span>
                </button>
              )}
            </div>

            {studentDiarios.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-xs text-slate-500">
                Nenhum diário registrado ainda para este empreendedor.
              </div>
            ) : (
              <div className="space-y-3">
                {studentDiarios.map((diario) => (
                  <div key={diario.id} className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black text-[#004A8D] flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#84BD00]" />
                        Sessão {diario.sessaoNumero} • {diario.tipo === 'Diagnostico_1h' ? 'Diagnóstico 1h' : 'Mentoria 2h'}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">{diario.dataRegistro}</span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {diario.diagnostico}
                    </p>

                    {diario.tarefasProximoEncontro && (
                      <div className="pt-1 text-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                          Compromissos para o Próximo Encontro:
                        </span>
                        <div className="text-slate-600 font-medium whitespace-pre-line pl-2 border-l-2 border-[#004A8D]">
                          {diario.tarefasProximoEncontro}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Formulário de Novo Registro */}
          {isAddingNew && (
            <form onSubmit={handleSave} className="p-5 rounded-2xl bg-blue-50/40 border border-blue-200 space-y-3.5 animate-fade-in">
              <h5 className="text-xs font-black text-[#004A8D] uppercase tracking-wider">
                Novo Registro de Mentoria Pedagógica
              </h5>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Número da Sessão</label>
                  <select
                    value={sessaoNumero}
                    onChange={(e) => setSessaoNumero(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#004A8D]"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>Sessão {n} de 5</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Status MEI</label>
                  <select
                    value={statusMei}
                    onChange={(e) => setStatusMei(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#004A8D]"
                  >
                    <option value="Informal">Informal</option>
                    <option value="MEI">MEI Formalizado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Diagnóstico / Evolução Pedagógica <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={diagnostico}
                  onChange={(e) => setDiagnostico(e.target.value)}
                  placeholder="Resuma o progresso técnico do aluno, desafios de bancada e orientações..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#004A8D]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Tarefas Combinadas para o Próximo Encontro</label>
                <input
                  type="text"
                  value={tarefas}
                  onChange={(e) => setTarefas(e.target.value)}
                  placeholder="Ex: Pesar embalagens na bancada, cotar novo fornecedor"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#004A8D]"
                />
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black text-white bg-[#004A8D] hover:bg-[#00386C] rounded-xl shadow-xs cursor-pointer"
                >
                  Gravar no Prontuário
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
