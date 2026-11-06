// src/components/StudentCleanView.jsx
import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';

export default function StudentCleanView({
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
    nome: 'Arthur Silva',
    negocio: 'Tempero do Arthur (Alimentação)',
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
  const todayAppointment = appointments.find(a => a.alunoId === currentStudent.id && (a.turnoId === 'turno-1' || a.horarioInicio === '16:00'));
  const isConfirmed = todayAppointment?.whatsappStatus?.includes('Confirmado');

  const [localWhatsappConfirmed, setLocalWhatsappConfirmed] = useState(isConfirmed);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Tarefas práticas de bancada
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Pesar carnes e embalagens marmitex na bancada', done: true },
    { id: 2, text: 'Separar notas de compra de temperos e embalagens', done: false },
    { id: 3, text: 'Abrir conta jurídica PJ separada no banco digital', done: false }
  ]);
  const [newTaskInput, setNewTaskInput] = useState('');

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    showToast('Status da tarefa atualizado!');
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), text: newTaskInput.trim(), done: false }]);
    setNewTaskInput('');
    showToast('✓ Tarefa adicionada ao seu plano de bancada!');
  };

  const handleConfirmarPresenca = () => {
    setLocalWhatsappConfirmed(true);
    if (onConfirmWhatsApp) {
      onConfirmWhatsApp(todayAppointment?.id || 'agend-3');
    }
    showToast('✓ Presença confirmada no WhatsApp! A recepção e a mentora Aline foram notificadas.');
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
    link.setAttribute('download', `Ficha_Tecnica_Tempero_do_Arthur_${Date.now()}.csv`);
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
      "- Nome Fantasia: Tempero do Arthur\r\n" +
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
            ? 'bg-[#F29100] text-slate-950 border-[#F29100] ring-4 ring-[#F29100]/30 font-black'
            : toastMessage.type === 'warning'
              ? 'bg-rose-600 text-white border-rose-700'
              : 'bg-[#004A8D] text-white border-blue-900 ring-2 ring-[#F29100]'
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
      {/* TELA 1: MEU PAINEL (PORTAL DO ALUNO)                           */}
      {/* ============================================================== */}
      {currentTab === 'portal' && (
        <div className="space-y-6">
          {/* Card Destaque - Sessão de Hoje com Cores Oficiais SENAC */}
          <div className="bg-gradient-to-br from-[#00386C] via-[#004A8D] to-[#00264A] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F29100] text-slate-950 text-xs font-black shadow-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-900 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950"></span>
                  </span>
                  Hoje • 16:00 às 18:00 (Sala 02 Presencial)
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Sessão {currentStudent.sessaoAtual || 3}: Precificação na Prática & Margem
                </h2>
                <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
                  Mentora Aline Ferreira • Foco: Calibragem de CMV, corte de desperdício na bancada e preço do prato executivo.
                </p>
              </div>

              <button
                onClick={handleConfirmarPresenca}
                disabled={localWhatsappConfirmed}
                className={`px-6 py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer shrink-0 shadow-lg ${
                  localWhatsappConfirmed 
                    ? 'bg-emerald-500 text-white cursor-default' 
                    : 'bg-[#F29100] hover:bg-[#D97D00] text-slate-950'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>{localWhatsappConfirmed ? '✓ Presença Confirmada no WhatsApp' : 'Confirmar Presença no WhatsApp'}</span>
              </button>
            </div>
          </div>

          {/* RÉGUA TRANSPARENTE DE ASSIDUIDADE (REGRA DE NEGÓCIO ESSENCIAL) */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#004A8D]" />
                  <span>Sua Régua de Assiduidade no Hub</span>
                </h3>
                <p className="text-xs text-slate-500">
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

          {/* Trilha de 5 Semanas */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Sua Trilha de Formação (5 Semanas)
              </h3>
              <span className="text-xs font-bold text-[#004A8D] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Progresso: 60% Concluído (Sessão {currentStudent.sessaoAtual || 3} de 5)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200">
                <span className="text-[10px] font-bold text-[#004A8D]">Sessão 1 ✓</span>
                <h4 className="text-xs font-bold text-slate-900 mt-1">Diagnóstico</h4>
                <p className="text-[10px] text-slate-500 mt-1">Realizada em 05/10</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200">
                <span className="text-[10px] font-bold text-[#004A8D]">Sessão 2 ✓</span>
                <h4 className="text-xs font-bold text-slate-900 mt-1">Custos & Ficha</h4>
                <p className="text-[10px] text-slate-500 mt-1">Realizada em 12/10</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#004A8D] text-white shadow-md">
                <span className="text-[10px] font-bold text-[#F29100]">Sessão 3 (Hoje)</span>
                <h4 className="text-xs font-bold mt-1">Precificação</h4>
                <p className="text-[10px] text-blue-100 mt-1">Em atendimento</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400">Sessão 4</span>
                <h4 className="text-xs font-bold text-slate-800 mt-1">Fluxo & PF/PJ</h4>
                <p className="text-[10px] text-slate-500 mt-1">Agendada 26/10</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400">Sessão 5</span>
                <h4 className="text-xs font-bold text-slate-800 mt-1">Formalização MEI</h4>
                <p className="text-[10px] text-slate-500 mt-1">Formatura 02/11</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TELA 2: PLANO DE AÇÃO & TAREFAS DE BANCADA                     */}
      {/* ============================================================== */}
      {currentTab === 'metas' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900">Plano de Ação para Bancada & Cozinha</h3>
              <p className="text-xs text-slate-500">Tarefas práticas combinadas com a mentora Aline Ferreira</p>
            </div>
            <span className="text-xs font-black text-[#004A8D] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
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
              <Plus className="w-4 h-4 text-[#F29100]" />
              <span>Adicionar</span>
            </button>
          </form>

          <div className="space-y-2.5">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                  task.done 
                    ? 'bg-blue-50/50 border-blue-200 text-slate-400 line-through' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => {}}
                  className="rounded text-[#004A8D] focus:ring-[#004A8D] cursor-pointer h-4 w-4 shrink-0"
                />
                <span className="text-xs font-medium flex-1">{task.text}</span>
                {task.done && (
                  <span className="text-[10px] font-bold text-[#004A8D] bg-white px-2 py-0.5 rounded-md border border-blue-200 shrink-0">
                    Concluído
                  </span>
                )}
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
            <h3 className="text-base font-black text-slate-900">Evolução Financeira do Tempero do Arthur</h3>
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
            <p className="text-xs text-slate-500">Documentos oficiais disponibilizados pela mentora Aline</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-[#004A8D]">
                Planilha CSV
              </span>
              <h4 className="text-sm font-bold text-slate-900">Ficha_Tecnica_Tempero_do_Arthur.csv</h4>
              <p className="text-xs text-slate-500">Planilha calculada de CMV por porção (carnes, grãos, embalagens e ponto de equilíbrio).</p>
              <button
                type="button"
                onClick={downloadFichaTecnica}
                className="w-full py-2.5 rounded-xl bg-[#004A8D] hover:bg-[#00386C] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4 text-[#F29100]" />
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
                <Download className="w-4 h-4 text-[#F29100]" />
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
                : 'bg-[#F29100]/10 border-2 border-[#F29100]/60'
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
                  <Award className="w-4 h-4 text-[#F29100]" />
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
    </div>
  );
}
