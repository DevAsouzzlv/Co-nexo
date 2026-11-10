// src/components/ProntuarioHistoricoModal.jsx
import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  Download, 
  Sparkles, 
  Clock, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  Printer,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function ProntuarioHistoricoModal({
  isOpen,
  onClose,
  student,
  diarios = [],
  initialSessionNumber = 1
}) {
  const [activeSessionNum, setActiveSessionNum] = useState(initialSessionNumber || 1);

  React.useEffect(() => {
    if (isOpen) {
      setActiveSessionNum(initialSessionNumber || 1);
    }
  }, [isOpen, initialSessionNumber]);

  if (!isOpen || !student) return null;

  const studentDiarios = diarios.filter((d) => d.alunoId === student.id)
    .sort((a, b) => a.sessaoNumero - b.sessaoNumero);

  // Encontra o diário específico da sessão ativa
  const currentDiario = studentDiarios.find((d) => d.sessaoNumero === activeSessionNum) || studentDiarios[0] || {
    sessaoNumero: activeSessionNum,
    titulo: `Sessão ${activeSessionNum}: Mentoria de Acompanhamento`,
    dataRegistro: '2026-11-10',
    diagnostico: 'Sessão pedagógica em andamento.',
    parecerConsultor: 'Acompanhamento de metas práticas de bancada e evolução do faturamento.',
    tarefasProximoEncontro: 'Executar compromissos acordados com o mentor.',
    statusMei: student.statusNegocio || 'Informal',
    consultorNome: 'Aline Ferreira',
    metricasSessao: {
      faturamento: 'R$ 5.100/mês',
      cmv: '36%',
      margem: '28%',
      contasSegregadas: '100% Segregada'
    },
    anexos: []
  };

  const handlePrint = () => {
    window.print();
  };

  const sessionsNav = [1, 2, 3, 4, 5];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-white rounded-[32px] shadow-[0_25px_70px_rgba(0,0,0,0.25)] border border-slate-200/90 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho Oficial Co.Nexo SENAC */}
        <div className="bg-gradient-to-r from-[#004A8D] via-[#00386C] to-[#00264A] px-6 py-5 text-white flex items-center justify-between shrink-0 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#84BD00]/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-3.5 relative z-10">
            <div className="h-11 w-11 rounded-2xl bg-[#84BD00] text-slate-950 flex items-center justify-center font-black text-sm shadow-md shadow-[#84BD00]/30 shrink-0">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Prontuário Pedagógico Digital
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#84BD00] text-slate-950 shadow-xs">
                  Histórico Oficial SENAC Hub
                </span>
              </div>
              <p className="text-xs text-blue-100">
                {student.nome} • {student.negocio} ({student.etapaPrograma})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 relative z-10">
            <button
              onClick={handlePrint}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
              title="Imprimir Prontuário"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de Navegação entre Sessões (Sessão 1 a 5) */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider shrink-0 mr-1">
            Sessões do Ciclo:
          </span>
          {sessionsNav.map((sNum) => {
            const diarioExistente = studentDiarios.find((d) => d.sessaoNumero === sNum);
            const isSelected = activeSessionNum === sNum;
            const isCompleted = sNum < (student.sessaoAtual || 3);
            const isCurrent = sNum === (student.sessaoAtual || 3);

            return (
              <button
                key={sNum}
                type="button"
                onClick={() => setActiveSessionNum(sNum)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#004A8D] text-white shadow-xs'
                    : isCompleted
                      ? 'bg-blue-100/70 text-[#004A8D] hover:bg-blue-200/60'
                      : isCurrent
                        ? 'bg-[#84BD00]/20 text-lime-900 border border-[#84BD00]/50'
                        : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#84BD00]" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-[#84BD00] animate-pulse" />
                ) : null}
                <span>Sessão {sNum}</span>
                {isCurrent && <span className="text-[9px] opacity-80">(Hoje)</span>}
              </button>
            );
          })}
        </div>

        {/* Conteúdo Detalhado da Sessão Selecionada */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar text-xs">
          
          {/* Topo da Sessão: Título, Data & Consultor */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 to-slate-50 border border-blue-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#004A8D] text-white">
                  Sessão {currentDiario.sessaoNumero}
                </span>
                <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {currentDiario.dataRegistro}
                </span>
              </div>
              <h4 className="text-sm font-black text-slate-900 mt-1">
                {currentDiario.titulo || `Módulo ${currentDiario.sessaoNumero}: Diagnóstico & Alinhamento`}
              </h4>
            </div>

            <div className="flex items-center gap-2 text-[11px] bg-white p-2 rounded-xl border border-slate-200 shrink-0">
              <Building2 className="w-3.5 h-3.5 text-[#004A8D]" />
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Consultor(a)</span>
                <span className="font-bold text-slate-800">{currentDiario.consultorNome || 'Aline Ferreira'}</span>
              </div>
            </div>
          </div>

          {/* Métricas de Negócio Registradas Nesta Sessão */}
          {currentDiario.metricasSessao && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Faturamento</span>
                <span className="text-xs font-black text-slate-900 mt-0.5 block">
                  {currentDiario.metricasSessao.faturamento || 'R$ 3.200/mês'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">CMV / Insumos</span>
                <span className="text-xs font-black text-amber-600 mt-0.5 block">
                  {currentDiario.metricasSessao.cmv || '36%'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Margem Líquida</span>
                <span className="text-xs font-black text-[#84BD00] mt-0.5 block">
                  {currentDiario.metricasSessao.margem || '28%'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Segregação PF/PJ</span>
                <span className="text-xs font-black text-[#004A8D] mt-0.5 block">
                  {currentDiario.metricasSessao.contasSegregadas || 'Ativa'}
                </span>
              </div>
            </div>
          )}

          {/* Diagnóstico & Parecer Pedagógico */}
          <div className="space-y-2">
            <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#004A8D]" />
              <span>Diagnóstico Técnico da Sessão:</span>
            </h5>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-700 leading-relaxed shadow-2xs">
              {currentDiario.diagnostico}
            </div>
          </div>

          {/* Parecer do Consultor */}
          {currentDiario.parecerConsultor && (
            <div className="space-y-2">
              <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#84BD00]" />
                <span>Parecer Docente & Plano de Bancada:</span>
              </h5>
              <div className="p-4 rounded-2xl bg-lime-50/50 border border-lime-200/70 text-slate-800 leading-relaxed">
                {currentDiario.parecerConsultor}
              </div>
            </div>
          )}

          {/* Compromissos e Tarefas para o Próximo Encontro */}
          {currentDiario.tarefasProximoEncontro && (
            <div className="space-y-2">
              <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#004A8D]" />
                <span>Compromissos Práticos Combinados para o Próximo Encontro:</span>
              </h5>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-700 whitespace-pre-line leading-relaxed border-l-4 border-l-[#004A8D]">
                {currentDiario.tarefasProximoEncontro}
              </div>
            </div>
          )}

          {/* Fichas Técnicas & Documentos Anexados */}
          {currentDiario.anexos && currentDiario.anexos.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Documentos & Fichas Técnicas Desta Sessão:</span>
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentDiario.anexos.map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-[#004A8D] shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-slate-900 block truncate text-xs">{doc.nome}</span>
                        <span className="text-[10px] text-slate-400">{doc.tamanho}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert(`Baixando cópia oficial de: ${doc.nome}`)}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#004A8D] text-[#004A8D] cursor-pointer"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Rodapé do Prontuário */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            Status MEI: <strong className="text-slate-800">{currentDiario.statusMei || 'Informal'}</strong>
          </span>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 transition cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Imprimir</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#004A8D] hover:bg-[#00386C] text-white font-bold transition cursor-pointer shadow-xs active:scale-98"
            >
              Fechar Prontuário
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
