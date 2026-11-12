// src/components/StudentCleanView.jsx
import React, { useState } from 'react';
import ProntuarioHistoricoModal from './ProntuarioHistoricoModal';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Send, 
  CheckSquare, 
  Download,
  AlertCircle,
  FileText,
  Layers,
  BookOpen,
  DollarSign,
  ShieldCheck,
  Building2,
  ExternalLink,
  Plus,
  AlertTriangle,
  Award,
  Sparkles,
  Paperclip,
  Upload,
  Trash2
} from 'lucide-react';

export default function StudentCleanView({
  currentUser,
  student,
  appointments = [],
  diarios = [],
  consultors = [],
  onUpdateAppointmentStatus,
  onConfirmWhatsApp,
  onFormalizarAluno,
  currentTab = 'portal',
  setCurrentTab
}) {
  const currentStudent = student || {
    id: 'aluno-1',
    nome: currentUser?.nome || 'Mentorado',
    negocio: currentUser?.cargo || 'Tempero do Arthur (Alimentação)',
    statusNegocio: 'Informal',
    totalFaltas: 1,
    totalReagendamentos: 1,
    sessaoAtual: 3,
    metricasEvolucao: {
      faturamentoAntes: 'R$ 3.200/mês',
      faturamentoDepois: 'R$ 5.100/mês (+59%)',
      margemAntes: '4% (prejuízo oculto)',
      margemDepois: '28% (preço corte R$ 22)',
      segregacaoContas: '100% Segregada (Conta PJ ativa)'
    }
  };

  const isDesligado = (currentStudent.totalFaltas || 0) >= 2 || currentStudent.etapaPrograma === 'Desligado';
  const isMeiFormalizado = currentStudent.statusNegocio === 'MEI' || Boolean(currentStudent.cnpj);

  // Confirmação de Presença
  const todayAppointment = appointments.find(a => a.alunoId === currentStudent.id) || appointments.find(a => a.horarioInicio === '16:00') || appointments[0];
  const consultorDesignado = consultors.find(c => c.id === todayAppointment?.consultorId) || consultors[0];
  const isConfirmed = todayAppointment?.whatsappStatus?.includes('Confirmado');

  const [localWhatsappConfirmed, setLocalWhatsappConfirmed] = useState(isConfirmed);
  const [toastMessage, setToastMessage] = useState(null);
  const [isProntuarioModalOpen, setIsProntuarioModalOpen] = useState(false);
  const [selectedProntuarioSession, setSelectedProntuarioSession] = useState(1);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Tarefas práticas de bancada com suporte a anexo de documento respondido
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      text: 'Pesar carnes e embalagens marmitex na bancada', 
      done: true,
      attachedDoc: {
        name: 'Ficha_Pesagem_Proteinas.pdf',
        size: '245 KB',
        uploadedAt: 'Enviado hoje às 14:15'
      },
      note: 'Pesagem realizada: 180g carne, 220g guarnição. Desperdício reduzido para 8%.'
    },
    { 
      id: 2, 
      text: 'Separar notas de compra de temperos e embalagens para cálculo do CMV', 
      done: false,
      attachedDoc: null,
      note: ''
    },
    { 
      id: 3, 
      text: 'Abrir conta jurídica PJ separada no banco digital (separação pessoa física/jurídica)', 
      done: false,
      attachedDoc: null,
      note: ''
    }
  ]);
  const [newTaskInput, setNewTaskInput] = useState('');

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    showToast('Status da tarefa atualizado!');
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), text: newTaskInput.trim(), done: false, attachedDoc: null, note: '' }]);
    setNewTaskInput('');
    showToast('✓ Tarefa adicionada ao seu plano de bancada!');
  };

  const handleAttachDocument = (taskId, fileName = 'Documento_Respondido.pdf', size = '312 KB') => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          done: true,
          attachedDoc: {
            name: fileName,
            size: size,
            uploadedAt: 'Enviado hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          }
        };
      }
      return t;
    }));
    showToast('✓ Documento respondido anexado com sucesso!');
  };

  const handleRemoveAttachment = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, attachedDoc: null };
      }
      return t;
    }));
    showToast('Documento desanexado da tarefa.');
  };

  const handleDownloadDoc = (doc) => {
    const textContent = `Comprovante: ${doc.name}\nData: ${doc.uploadedAt}\nStatus: Entregue.`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', doc.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Download de ${doc.name} iniciado!`);
  };

  const handleFileInputChange = (taskId, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeStr = file.size > 1024 * 1024 
        ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
        : Math.round(file.size / 1024) + ' KB';
      handleAttachDocument(taskId, file.name, sizeStr);
    }
  };

  const handleConfirmarPresenca = () => {
    setLocalWhatsappConfirmed(true);
    if (onConfirmWhatsApp) {
      onConfirmWhatsApp(todayAppointment?.id || 'agend-3');
    }
    showToast('✓ Presença confirmada no WhatsApp! A recepção e a equipe de consultoria foram notificadas.');
  };

  const handleFormalizarAgora = () => {
    if (onFormalizarAluno) {
      onFormalizarAluno(currentStudent.id, {
        cnpj: '54.892.102/0001-38'
      });
    }
    showToast('🎉 Parabéns! Sua formalização MEI foi concluída com sucesso! CNPJ gerado.', 'celebrate');
  };

  const downloadFichaTecnica = () => {
    const csvContent = 
      "\uFEFFIngrediente,Gramatura (g),Custo Unitario (R$),Custo por Porcao (R$)\r\n" +
      "Proteina Bovina / Frango,180,32.00,5.76\r\n" +
      "Arroz Branco & Feijao Tropeiro,220,7.50,1.65\r\n" +
      "Legumes Salteados & Tempero,100,8.00,0.80\r\n" +
      "Embalagem Termica Marmitex,1 un,1.80,1.80\r\n" +
      "TOTAL CUSTO DIRETO (CMV),-,10.01,10.01\r\n" +
      "PRECO DE VENDA CALIBRADO,-,22.00,22.00\r\n" +
      "MARGEM BRUTA (54.5%),-,11.99,11.99\r\n";

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const nomeSeguro = (currentStudent.negocio || currentStudent.nome || 'Negocio').replace(/[^a-zA-Z0-9]/g, '_');
    link.setAttribute('download', `Ficha_Tecnica_${nomeSeguro}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Download da Ficha Técnica concluído com sucesso!');
  };

  const downloadCartilhaMEI = () => {
    const cartilha = 
      "==========================================================\r\n" +
      "       GUIA OFICIAL DE FORMALIZACAO MEI - SENAC HUB       \r\n" +
      "==========================================================\r\n\r\n" +
      "Passo 1: Acesso ao Portal do Empreendedor\r\n" +
      "- Acesse: gov.br/empresas-e-negocios/pt-br/empreendedor\r\n" +
      "- Faca login com sua conta Gov.br (Prata ou Ouro)\r\n\r\n" +
      "Passo 2: Dados do Negocio\r\n" +
      "- Nome Fantasia: " + (currentStudent.negocio || currentStudent.nome) + "\r\n" +
      "- CNAE Principal: 5620-1/04 - Fornecimento de alimentos preparados preponderantemente para consumo domiciliar\r\n\r\n" +
      "Passo 3: Emissao do CCMEI\r\n" +
      "- Ao finalizar, imprima seu Certificado da Condicao de Microempreendedor Individual (CCMEI)\r\n" +
      "- Com o CNPJ ativo, abra sua conta PJ para separar 100% o dinheiro pessoal do negocio.\r\n";

    const blob = new Blob([cartilha], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Guia_Oficial_Formalizacao_MEI_SENAC.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Download do Guia Oficial MEI concluído!');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notificação */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-xl border flex items-center gap-3 transition-all duration-300 animate-slide-in ${
          toastMessage.type === 'celebrate'
            ? 'bg-[#84BD00] text-slate-950 border-[#84BD00] ring-4 ring-[#84BD00]/30 font-black'
            : toastMessage.type === 'warning'
              ? 'bg-rose-600 text-white border-rose-700'
              : 'bg-[#004A8D] text-white border-blue-900 ring-2 ring-[#84BD00]'
        }`}>
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold">{toastMessage.msg}</span>
          <button 
            onClick={() => setToastMessage(null)} 
            className="text-white/80 hover:text-white font-bold text-xs ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Alerta de Desligamento se atingir 2 faltas */}
      {isDesligado && (
        <div className="p-4 rounded-3xl bg-rose-50 border-2 border-rose-300 text-rose-900 flex items-start gap-3 shadow-md animate-fade-in">
          <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-black">Atenção Crítica: Limite de Faltas Atingido (2/2)</h4>
            <p className="text-xs leading-relaxed">
              Você acumulou 2 faltas sem aviso prévio de 24 horas. Conforme a regra de assiduidade do SENAC Hub, seu atendimento foi suspenso para liberação da vaga a candidatos da fila de espera. Entre em contato com a recepção para justificativa.
            </p>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TELA 1: MEU PAINEL (PORTAL DO ALUNO APPLE HIG)                 */}
      {/* ============================================================== */}
      {currentTab === 'portal' && (
        <div className="space-y-6 animate-fade-in">
          {/* Card Destaque - Sessão de Hoje com Estilo Apple */}
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#003B70] via-[#004A8D] to-[#00284D] text-white p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,74,141,0.18)] border border-white/10">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#84BD00]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#84BD00] text-slate-950 text-xs font-bold shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-900 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950"></span>
                  </span>
                  Hoje • 16:00 às 18:00 (Sala 02 Presencial)
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Sessão {currentStudent.sessaoAtual || 3}: Precificação na Prática & Margem
                </h2>
                <p className="text-xs sm:text-sm text-blue-100/90 max-w-xl font-normal leading-relaxed">
                  {consultorDesignado ? `Mentora ${consultorDesignado.nome}` : 'Consultoria Especializada SENAC Hub'} • Foco: Calibragem de CMV, corte de desperdício e precificação.
                </p>
              </div>

              <button
                onClick={handleConfirmarPresenca}
                disabled={localWhatsappConfirmed}
                className={`px-6 py-3 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shrink-0 shadow-lg active:scale-95 ${
                  localWhatsappConfirmed 
                    ? 'bg-emerald-500 text-white cursor-default' 
                    : 'bg-[#84BD00] hover:bg-[#D97D00] text-slate-950 shadow-[#84BD00]/30'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>{localWhatsappConfirmed ? '✓ Presença Confirmada no WhatsApp' : 'Confirmar Presença no WhatsApp'}</span>
              </button>
            </div>
          </div>

          {/* RÉGUA TRANSPARENTE DE ASSIDUIDADE */}
          <div className="apple-glass-card rounded-[28px] p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/[0.05]">
              <div>
                <h3 className="text-sm font-bold text-[#1D1D1F] uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#004A8D]" />
                  <span>Sua Régua de Assiduidade no Hub</span>
                </h3>
                <p className="text-xs text-[#86868B] font-normal">
                  Regra institucional: máximo de 2 faltas sem aviso prévio de 24h para manter sua vaga.
                </p>
              </div>
              <span className={`text-xs font-black px-3 py-1 rounded-full ${
                (currentStudent.totalFaltas || 0) === 0
                  ? 'bg-emerald-100 text-emerald-800'
                  : (currentStudent.totalFaltas || 0) === 1
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-rose-100 text-rose-800'
              }`}>
                {currentStudent.totalFaltas || 0} de 2 Faltas Registradas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Faltas &lt;24h</span>
                <p className="text-xl font-black text-slate-900 mt-1">
                  {currentStudent.totalFaltas || 0} <span className="text-xs font-normal text-slate-500">/ 2 permitidas</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Saldo restante: <strong>{Math.max(0, 2 - (currentStudent.totalFaltas || 0))} falta</strong>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Reagendamentos</span>
                <p className="text-xl font-black text-slate-900 mt-1">
                  {currentStudent.totalReagendamentos || 1} <span className="text-xs font-normal text-slate-500">/ 2 permitidos</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Saldo restante: <strong>{Math.max(0, 2 - (currentStudent.totalReagendamentos || 1))} reagendamento</strong>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Status Formalização</span>
                <p className="text-xl font-black text-slate-900 mt-1">
                  {isMeiFormalizado ? 'MEI Ativo' : 'Informal'}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  {isMeiFormalizado ? `CNPJ: ${currentStudent.cnpj || '54.892.102/0001-38'}` : 'Meta: Formalizar no 5º Encontro'}
                </p>
              </div>
            </div>
          </div>

          {/* Trilha de 5 Semanas Interativa com Prontuário */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span>Sua Trilha de Formação (5 Semanas)</span>
                  <span className="text-[10px] font-bold text-[#84BD00] bg-lime-50 px-2 py-0.5 rounded-full border border-lime-200">
                    Clique em qualquer sessão para ver o prontuário
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Acesse os diagnósticos, tarefas de bancada e evolução financeira de cada aula
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#004A8D] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  Progresso: 60% Concluído (Sessão {currentStudent.sessaoAtual || 3} de 5)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProntuarioSession(currentStudent.sessaoAtual || 3);
                    setIsProntuarioModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#004A8D] hover:bg-[#00386C] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#84BD00]" />
                  <span>Ver Prontuários</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedProntuarioSession(1);
                  setIsProntuarioModalOpen(true);
                }}
                className="p-3.5 rounded-2xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200 text-left transition hover:scale-[1.02] cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#004A8D]">Sessão 1 ✓</span>
                  <span className="text-[9px] font-bold text-[#84BD00] group-hover:underline">Ver Prontuário →</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-1">Diagnóstico</h4>
                <p className="text-[10px] text-slate-500 mt-1">Realizada em 03/11</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedProntuarioSession(2);
                  setIsProntuarioModalOpen(true);
                }}
                className="p-3.5 rounded-2xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200 text-left transition hover:scale-[1.02] cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#004A8D]">Sessão 2 ✓</span>
                  <span className="text-[9px] font-bold text-[#84BD00] group-hover:underline">Ver Prontuário →</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-1">Custos & Ficha</h4>
                <p className="text-[10px] text-slate-500 mt-1">Realizada em 05/11</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedProntuarioSession(3);
                  setIsProntuarioModalOpen(true);
                }}
                className="p-3.5 rounded-2xl bg-[#004A8D] text-white shadow-md text-left transition hover:scale-[1.02] cursor-pointer group ring-2 ring-[#84BD00]/50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#84BD00]">Sessão 3 (Hoje)</span>
                  <span className="text-[9px] font-bold text-[#84BD00] group-hover:underline">Abrir →</span>
                </div>
                <h4 className="text-xs font-bold mt-1">Precificação & CMV</h4>
                <p className="text-[10px] text-blue-100 mt-1">Hoje (10/11) • 16h-18h</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedProntuarioSession(4);
                  setIsProntuarioModalOpen(true);
                }}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left transition hover:scale-[1.02] cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400">Sessão 4</span>
                  <span className="text-[9px] font-bold text-slate-400 group-hover:text-[#004A8D]">Ver →</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 mt-1">Fluxo & PF/PJ</h4>
                <p className="text-[10px] text-slate-500 mt-1">Agendada 17/11</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedProntuarioSession(5);
                  setIsProntuarioModalOpen(true);
                }}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left transition hover:scale-[1.02] cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400">Sessão 5</span>
                  <span className="text-[9px] font-bold text-slate-400 group-hover:text-[#004A8D]">Ver →</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 mt-1">Formalização MEI</h4>
                <p className="text-[10px] text-slate-500 mt-1">Formatura 24/11</p>
              </button>
            </div>
          </div>
        </div>
      )}

            {/* ============================================================== */}
      {/* TELA: HISTÓRICO INTEGRAL DE PRONTUÁRIOS DE TODAS AS AULAS       */}
      {/* ============================================================== */}
      {currentTab === 'prontuario' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-lime-50 text-lime-900 border border-lime-200">
                  Histórico de Mentorias
                </span>
                <h3 className="text-base font-black text-slate-900">
                  Prontuário Pedagógico de Todas as Aulas Passadas
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Consulte o diagnóstico, pareceres técnicos, tarefas de bancada e anexos de cada sessão realizada
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
            >
              <FileText className="w-3.5 h-3.5 text-[#004A8D]" />
              <span>Imprimir / Exportar Prontuário</span>
            </button>
          </div>

          <div className="space-y-4">
            {diarios.filter(d => d.alunoId === currentStudent.id).map((diario) => (
              <div key={diario.id} className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/60 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-black px-2.5 py-0.5 rounded-full bg-[#004A8D] text-white text-[10px]">
                      Sessão {diario.sessaoNumero}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{diario.titulo || `Módulo ${diario.sessaoNumero}`}</h4>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{diario.dataRegistro}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">{diario.consultorNome}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Diagnóstico Técnico:</span>
                    <p className="text-slate-700 leading-relaxed">{diario.diagnostico}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-lime-50/60 border border-lime-200/60 space-y-1">
                    <span className="text-[10px] font-bold text-lime-900 uppercase block">Parecer do Consultor:</span>
                    <p className="text-slate-700 leading-relaxed">{diario.parecerConsultor || 'Orientação de bancada executada com sucesso.'}</p>
                  </div>
                </div>

                {diario.tarefasProximoEncontro && (
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Tarefas de Bancada Combinadas:</span>
                    <p className="text-slate-600 whitespace-pre-line pl-2 border-l-2 border-[#004A8D]">{diario.tarefasProximoEncontro}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TELA 2: PLANO DE AÇÃO & TAREFAS COM DOCUMENTOS ANEXADOS        */}
      {/* ============================================================== */}
      {currentTab === 'metas' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-[#004A8D] border border-blue-200">
                  Compromissos Práticos
                </span>
                <h3 className="text-base font-black text-slate-900">
                  Plano de Ação • {currentStudent.negocio || 'Seu Empreendimento'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Tarefas práticas combinadas com a equipe de consultoria do SENAC Hub
              </p>
            </div>
            <span className="text-xs font-black text-[#004A8D] bg-blue-50 px-3 py-1 rounded-full border border-blue-200 shrink-0">
              {tasks.filter(t => t.done).length} de {tasks.length} Concluídas
            </span>
          </div>

          {/* Adicionar nova tarefa */}
          <form onSubmit={handleAddTask} className="flex gap-2">
            <input
              type="text"
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              placeholder="Adicionar novo compromisso de bancada..."
              className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#004A8D]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-2xl bg-[#004A8D] hover:bg-[#00386C] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#84BD00]" />
              <span>Adicionar</span>
            </button>
          </form>

          {/* Lista de Tarefas com Campo para Anexar Documento Respondido */}
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  task.done 
                    ? 'bg-blue-50/40 border-blue-200/80' 
                    : 'bg-slate-50/80 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Linha Principal da Tarefa */}
                <div className="flex items-center justify-between gap-3">
                  <div 
                    onClick={() => toggleTask(task.id)}
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => {}}
                      className="rounded text-[#004A8D] focus:ring-[#004A8D] cursor-pointer h-4 w-4 shrink-0"
                    />
                    <span className={`text-xs font-semibold ${task.done ? 'text-slate-700 line-through' : 'text-slate-900'}`}>
                      {task.text}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                    task.done ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {task.done ? 'Concluída' : 'Pendente'}
                  </span>
                </div>

                {/* Área de Documento Respondido / Anexo */}
                <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2">
                  {task.attachedDoc ? (
                    // Documento Já Anexado
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-slate-800 shadow-xs text-xs">
                        <Paperclip className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-bold text-slate-900 truncate max-w-[220px]">
                          {task.attachedDoc.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({task.attachedDoc.size})
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                          {task.attachedDoc.uploadedAt}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDownloadDoc(task.attachedDoc)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#004A8D] text-[11px] font-bold inline-flex items-center gap-1 transition cursor-pointer"
                          title="Baixar ou visualizar documento respondido"
                        >
                          <Download className="w-3 h-3 text-[#84BD00]" />
                          <span>Baixar/Ver</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(task.id)}
                          className="px-2 py-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 text-[11px] font-bold transition cursor-pointer"
                          title="Remover anexo"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Botão para Anexar Novo Documento Respondido
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="file"
                        id={`file-upload-${task.id}`}
                        className="hidden"
                        onChange={(e) => handleFileInputChange(task.id, e)}
                      />
                      <label
                        htmlFor={`file-upload-${task.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-[#004A8D]/50 hover:border-[#004A8D] bg-white hover:bg-blue-50 text-[#004A8D] text-[11px] font-bold transition cursor-pointer shadow-2xs"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-[#84BD00]" />
                        <span>+ Anexar Documento Respondido</span>
                      </label>

                      <div className="flex items-center gap-1 text-[10px]">
                        <span className="text-slate-400">Atalhos:</span>
                        <button
                          type="button"
                          onClick={() => handleAttachDocument(task.id, `Ficha_Bancada_${currentStudent.nome.split(' ')[0]}.pdf`, '280 KB')}
                          className="px-2 py-0.5 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 font-medium transition cursor-pointer"
                        >
                          + Ficha Preenchida
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAttachDocument(task.id, `Comprovante_Foto_${currentStudent.nome.split(' ')[0]}.jpg`, '1.2 MB')}
                          className="px-2 py-0.5 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 font-medium transition cursor-pointer"
                        >
                          + Foto Comprovante
                        </button>
                      </div>
                    </div>
                  )}

                  {task.note && (
                    <p className="text-[11px] text-slate-600 italic bg-white/70 px-2.5 py-1 rounded-lg border border-slate-200/50 w-full">
                      💬 Observação da entrega: "{task.note}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TELA 3: EVOLUÇÃO & FINANÇAS                                    */}
      {/* ============================================================== */}
      {currentTab === 'metricas' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900">Evolução Financeira: {currentStudent.negocio || 'Seu Empreendimento'}</h3>
            <p className="text-xs text-slate-500">Métricas comparativas validadas pela mentoria do SENAC Hub</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Margem de Lucro Real</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#004A8D]">28%</span>
                <span className="text-xs text-emerald-700 font-bold">+24 p.p.</span>
              </div>
              <p className="text-[11px] text-slate-500">Antes era de 4% com prejuízo oculto em embalagens e desperdício.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Faturamento Mensal</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#004A8D]">R$ 5.100</span>
                <span className="text-xs text-emerald-700 font-bold">+59%</span>
              </div>
              <p className="text-[11px] text-slate-500">Subiu de R$ 3.200 após calibração do prato executivo para R$ 22,00.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Segregação de Contas</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-700">100%</span>
                <span className="text-xs text-emerald-700 font-bold">Separada</span>
              </div>
              <p className="text-[11px] text-slate-500">Conta corrente PJ aberta para pagamentos exclusivos de fornecedores.</p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TELA 4: FICHAS TÉCNICAS & MATERIAIS DIDÁTICOS                 */}
      {/* ============================================================== */}
      {currentTab === 'materiais' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900">Materiais & Fichas Técnicas para Download</h3>
            <p className="text-xs text-slate-500">Documentos oficiais disponibilizados pela equipe de consultoria do Hub</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-[#004A8D]">
                Planilha CSV
              </span>
              <h4 className="text-sm font-bold text-slate-900">Ficha_Tecnica_{(currentStudent.negocio || currentStudent.nome || 'Negocio').replace(/[^a-zA-Z0-9]/g, '_')}.csv</h4>
              <p className="text-xs text-slate-500">Planilha calculada de CMV por porção (carnes, grãos, embalagens e ponto de equilíbrio).</p>
              <button
                type="button"
                onClick={downloadFichaTecnica}
                className="w-full py-2.5 rounded-xl bg-[#004A8D] hover:bg-[#00386C] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4 text-[#84BD00]" />
                <span>Baixar Ficha Técnica (CSV Real)</span>
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-[#C87500]">
                Guia em Texto
              </span>
              <h4 className="text-sm font-bold text-slate-900">Guia_Oficial_Formalizacao_MEI_SENAC.txt</h4>
              <p className="text-xs text-slate-500">Passo a passo completo com enquadramento de CNAE de refeições e conta Gov.br.</p>
              <button
                type="button"
                onClick={downloadCartilhaMEI}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4 text-[#84BD00]" />
                <span>Baixar Guia MEI Oficial</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TELA 5: MINHA FORMALIZAÇÃO MEI                                 */}
      {/* ============================================================== */}
      {currentTab === 'formalizacao' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#004A8D]" />
                <span>Trilha de Formalização do MEI</span>
              </h3>
              <p className="text-xs text-slate-500">Passo a passo com apoio da mentora para emissão do seu CNPJ</p>
            </div>
            <span className={`text-xs font-black px-3 py-1 rounded-full ${
              isMeiFormalizado 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-amber-100 text-amber-900'
            }`}>
              {isMeiFormalizado ? '✓ MEI Formalizado' : 'Meta: 5ª Sessão'}
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Passo 1: Conta Gov.br Prata ou Ouro</h4>
                  <p className="text-[11px] text-slate-500">Concluído! Acesso validado ao Portal do Empreendedor.</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800">Concluído</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Passo 2: Definição do CNAE de Alimentação</h4>
                  <p className="text-[11px] text-slate-500">CNAE 5620-1/04 (Fornecimento de alimentos preparados para consumo domiciliar).</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800">Concluído</span>
            </div>

            <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              isMeiFormalizado 
                ? 'bg-emerald-50 border-emerald-300' 
                : 'bg-[#84BD00]/10 border-2 border-[#84BD00]/60'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                  isMeiFormalizado ? 'bg-emerald-600 text-white' : 'bg-[#004A8D] text-white'
                }`}>
                  {isMeiFormalizado ? '✓' : '3'}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Passo 3: Emissão do Certificado CCMEI e CNPJ</h4>
                  <p className="text-xs text-slate-600">
                    {isMeiFormalizado 
                      ? `Parabéns! Empresa formalizada com CNPJ ${currentStudent.cnpj || '54.892.102/0001-38'}.`
                      : 'Clique abaixo para formalizar o negócio e gerar seu CNPJ oficial.'}
                  </p>
                </div>
              </div>

              {!isMeiFormalizado ? (
                <button
                  type="button"
                  onClick={handleFormalizarAgora}
                  className="px-5 py-3 rounded-2xl bg-[#004A8D] hover:bg-[#00386C] active:scale-98 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0"
                >
                  <Award className="w-4 h-4 text-[#84BD00]" />
                  <span>Emitir Certificado MEI & Registrar CNPJ</span>
                </button>
              ) : (
                <span className="text-xs font-black text-emerald-800 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0">
                  CNPJ Ativo: {currentStudent.cnpj || '54.892.102/0001-38'}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Modal de Prontuário Detalhado */}
      <ProntuarioHistoricoModal
        isOpen={isProntuarioModalOpen}
        onClose={() => setIsProntuarioModalOpen(false)}
        student={currentStudent}
        diarios={diarios}
        initialSessionNumber={selectedProntuarioSession}
      />
    </div>
  );
}
