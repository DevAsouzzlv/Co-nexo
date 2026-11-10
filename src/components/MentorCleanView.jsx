// src/components/MentorCleanView.jsx
import React, { useState } from 'react';
import { CheckCircle2, Download, Calculator, Plus, BookOpen, Phone, Layers, Trash2, Save } from 'lucide-react';

export default function MentorCleanView({
  currentUser,
  consultors = [],
  students = [],
  appointments = [],
  diarios = [],
  onOpenDiario,
  onSaveDiario,
  onSaveSimulacao,
  onFormalizarAluno,
  currentTab = 'minha-agenda',
  setCurrentTab
}) {
  const mentor = currentUser || consultors.find(c => c.email === currentUser?.email) || consultors[0] || { nome: 'Consultora SENAC' };
  const [selectedStudentId, setSelectedStudentId] = useState('aluno-1');
  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0] || {
    id: 'novo',
    nome: 'Nenhum mentorado selecionado',
    negocio: 'Aguardando cadastro de alunos',
    etapaPrograma: 'Inscrito',
    sessaoAtual: 1,
    statusNegocio: 'Informal',
    totalFaltas: 0
  };

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Estado interativo das 5 sessões (Trilha)
  const [selectedSessionNumber, setSelectedSessionNumber] = useState(3);

  // Simulador de CMV e Preço
  const [precoVenda, setPrecoVenda] = useState(22.0);
  const [custoInsumos, setCustoInsumos] = useState(9.20);
  const [custoEmbalagem, setCustoEmbalagem] = useState(1.80);
  const [custoFixoMensal] = useState(1500);

  const custoTotalUnitario = custoInsumos + custoEmbalagem;
  const margemPercentual = (((precoVenda - custoTotalUnitario) / precoVenda) * 100).toFixed(1);
  const lucroBrutoUnitario = (precoVenda - custoTotalUnitario).toFixed(2);
  const pontoEquilibrioPratos = Math.ceil(custoFixoMensal / (precoVenda - custoTotalUnitario));

  // Tarefas interativas
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Pesar carnes e embalagens marmitex na bancada', done: true },
    { id: 2, text: 'Abrir conta bancária PJ separada da física', done: false },
    { id: 3, text: 'Atualizar ficha técnica no Excel com novos fornecedores', done: false }
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  // Anotações da sessão
  const [diarioText, setDiarioText] = useState(
    'Arthur já domina o cálculo de custo por porção. Hoje calibramos o desperdício no corte de proteínas (reduziu de 18% para 8%). Recomendado fixar a margem mínima em 55% para absorver taxas de entrega e embalagem térmica.'
  );

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), text: newTaskText.trim(), done: false }]);
    setNewTaskText('');
    showToast('✓ Nova tarefa de bancada adicionada!');
  };

  const handleDeleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast('Tarefa removida.');
  };

  const handleSaveProntuario = () => {
    if (onSaveDiario) {
      onSaveDiario({
        id: `diario-${currentStudent.id}-${Date.now()}`,
        alunoId: currentStudent.id,
        consultorId: mentor?.id || 'cons-1',
        consultorNome: mentor?.nome || 'Aline Ferreira',
        sessaoNumero: selectedSessionNumber,
        dataRegistro: new Date().toISOString().split('T')[0],
        tipo: selectedSessionNumber === 1 ? 'Diagnostico_1h' : 'Mentoria_2h',
        diagnostico: diarioText,
        tarefasProximoEncontro: tasks.map(t => (t.done ? '✓ ' : '□ ') + t.text).join('\n')
      });
    }
    showToast(`✓ Prontuário de ${currentStudent.nome} atualizado e registrado com sucesso!`);
  };

  const handleSalvarFichaNoProntuario = () => {
    if (onSaveSimulacao) {
      onSaveSimulacao(currentStudent.id, {
        margemPercentual: Number(margemPercentual),
        precoVenda: Number(precoVenda),
        custoTotalUnitario: Number(custoTotalUnitario)
      });
    }
    showToast(`✓ Simulação salva! Margem de ${margemPercentual}% vinculada ao negócio.`);
  };

  const downloadFichaTecnicaCSV = () => {
    const itemNome = `"Prato Executivo ${currentStudent.negocio.replace(/"/g, '""')}"`;
    const csvContent = 
      "\uFEFFItem,Tipo,Custo Unitario,Preco Venda,Margem %,Lucro Unitario,Ponto Equilibrio (Unidades)\r\n" +
      `${itemNome},"Refeicao",${custoTotalUnitario.toFixed(2)},${precoVenda.toFixed(2)},${margemPercentual}%,${lucroBrutoUnitario},${pontoEquilibrioPratos}\r\n` +
      `"Insumos e Proteinas","Custo Direto",${custoInsumos.toFixed(2)},-,-,-,-\r\n` +
      `"Embalagem Termica","Embalagem",${custoEmbalagem.toFixed(2)},-,-,-,-\r\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Ficha_Tecnica_${currentStudent.nome.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('✓ Download da Ficha Técnica iniciado!');
  };

  // Informações completas das 5 sessões
  const sessions = [
    { 
      num: 1, 
      title: 'Diagnóstico & Modelo de Negócio', 
      status: 'Concluída', 
      data: '03/11 (1h)', 
      summary: 'Mapeamento do estágio atual, identificação de informalidade e definição do plano inicial.',
      entregavel: 'Diagnóstico 360° e Levantamento de Despesas'
    },
    { 
      num: 2, 
      title: 'Custos & Ficha Técnica', 
      status: 'Concluída', 
      data: '05/11 (2h)', 
      summary: 'Pesagem de insumos na bancada gastronômica, cálculo de desperdício e formulação de ficha técnica.',
      entregavel: 'Ficha Técnica dos 3 Pratos Mais Vendidos'
    },
    { 
      num: 3, 
      title: 'Precificação & Margem de Contribuição', 
      status: 'Ativa Hoje', 
      data: 'Hoje (10/11 - 16h-18h)', 
      summary: 'Calibragem de preço na prática com teste do prato executivo e corte de despesas ocultas.',
      entregavel: 'Simulação de Preço de Venda com Margem >55%'
    },
    { 
      num: 4, 
      title: 'Fluxo de Caixa & Separação PF/PJ', 
      status: 'Agendada', 
      data: '17/11 (2h)', 
      summary: 'Implantação de rotina diária de fluxo de caixa e abertura de conta jurídica sem taxas.',
      entregavel: 'Planilha de Fluxo de Caixa e Conta PJ Ativa'
    },
    { 
      num: 5, 
      title: 'Formalização MEI & Plano 90 Dias', 
      status: 'Planejada', 
      data: '24/11 (2h)', 
      summary: 'Emissão oficial do CNPJ no Portal do Empreendedor, enquadramento e plano de crescimento.',
      entregavel: 'Certificado MEI e Plano de 90 Dias'
    }
  ];

  const todayAppointments = appointments.filter(a => a.turnoId === 'turno-1' || a.diaSemana === 'Quarta');

  return (
    <div className="space-y-6 relative">
      {/* Toast de Feedback */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-xl border flex items-center gap-3 transition-all duration-300 animate-slide-in ${
          toastMessage.type === 'warning' 
            ? 'bg-amber-500 text-white border-amber-600' 
            : 'bg-[#004A8D] text-white border-blue-900 ring-2 ring-[#84BD00]'
        }`}>
          <CheckCircle2 className="w-5 h-5 text-[#84BD00] shrink-0" />
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
      {/* TELA 1: ATENDIMENTOS DE HOJE (MEUS TURNOS)                     */}
      {/* ============================================================== */}
      {currentTab === 'minha-agenda' && (
        <div className="space-y-6 animate-fade-in">
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#003B70] via-[#004A8D] to-[#00284D] text-white p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,74,141,0.18)] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#84BD00]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-blue-100 border border-white/20 inline-block">
                Turno de Atendimentos • Turno da Manhã
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Olá, {mentor.nome}!
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/90 max-w-xl font-normal leading-relaxed">
                Você tem 4 horas contínuas de consultoria agendadas hoje na <strong>Sala 01 Presencial</strong> (Finanças & CMV).
              </p>
            </div>
            <div className="relative z-10">
              <span className="text-xs font-bold px-4 py-2 rounded-full bg-[#84BD00] text-slate-950 shadow-md">
                08:00 às 12:00 (4h Fechadas)
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#1D1D1F]">Programação de Atendimentos de Hoje</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayAppointments.map((ap) => {
                const student = students.find(s => s.id === ap.alunoId);
                const isAvailable = !ap.alunoId || ap.status === 'Disponivel';

                return (
                  <div key={ap.id} className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {ap.horarioInicio} - {ap.horarioFim}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          isAvailable 
                            ? 'bg-[#84BD00] text-slate-950 font-black' 
                            : 'bg-blue-100 text-[#004A8D]'
                        }`}>
                          {isAvailable ? 'Vaga Livre' : ap.tipo === 'Diagnostico_1h' ? '1h Diagnóstico' : '2h Mentoria'}
                        </span>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-sm font-bold text-slate-900">
                          {isAvailable ? 'Espaço para Encaixe' : student?.nome || 'Mentorado'}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {isAvailable ? 'Turno sem janelas ociosas' : student?.negocio}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      {isAvailable ? (
                        <span className="text-xs text-[#4E7100] font-bold">Aguardando encaixe</span>
                      ) : (
                        <button
                          onClick={() => {
                            if (student) {
                              setSelectedStudentId(student.id);
                              if (setCurrentTab) setCurrentTab('prontuario');
                              showToast(`Atendimento com ${student.nome} iniciado.`);
                            }
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-[#004A8D] hover:bg-[#003B70] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-[#84BD00]" />
                          <span>Iniciar Atendimento & Prontuário</span>
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
      {/* TELA 2: PRONTUÁRIO DIGITAL DO ALUNO (FICHA CLÍNICA/PEDAGÓGICA) */}
      {/* ============================================================== */}
      {currentTab === 'prontuario' && (
        <div className="space-y-6">
          {/* Seletor do Aluno em Atendimento */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Mentorado Ativo:
              </span>
              <select
                value={selectedStudentId}
                onChange={(e) => {
                  setSelectedStudentId(e.target.value);
                  showToast('Prontuário alterado para o aluno selecionado.');
                }}
                className="py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 font-bold text-xs text-[#004A8D] focus:outline-none focus:bg-white cursor-pointer"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome} ({s.negocio})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveProntuario}
                className="px-5 py-2.5 rounded-2xl bg-[#004A8D] hover:bg-[#003B70] text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4 text-[#84BD00]" />
                <span>Salvar Diário de Bordo</span>
              </button>
            </div>
          </div>

          {/* Header do Mentorado Selecionado */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-[#004A8D] text-white flex items-center justify-center font-black text-xl shadow-md">
                {currentStudent.nome.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">{currentStudent.nome}</h2>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#004A8D]/10 text-[#004A8D]">
                    {currentStudent.negocio}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Consultora: {mentor.nome} • Sala 02 Presencial • Sessão {currentStudent.sessaoAtual || 3} de 5 • Status: {currentStudent.statusNegocio}
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              Assiduidade: {currentStudent.totalFaltas === 0 ? '100% Presente' : `${currentStudent.totalFaltas} falta(s)`}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Parecer Pedagógico */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-extrabold text-slate-900">
                    Anotações Clínicas & Parecer Pedagógico
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">Prontuário Homologado</span>
                </div>
                <textarea
                  value={diarioText}
                  onChange={(e) => setDiarioText(e.target.value)}
                  rows={6}
                  placeholder="Descreva a evolução pedagógica, dados financeiros apurados e orientações dadas ao empreendedor..."
                  className="w-full p-4 text-xs text-slate-800 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#004A8D] focus:outline-none transition leading-relaxed resize-none font-medium"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveProntuario}
                    className="px-4 py-2 bg-[#004A8D] hover:bg-[#003B70] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5 text-[#84BD00]" />
                    <span>Gravar Registro no Prontuário</span>
                  </button>
                </div>
              </div>

              {/* Histórico das sessões */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
                <h4 className="text-base font-extrabold text-slate-900">Histórico de Atendimentos</h4>
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">Sessão 1: Diagnóstico de Entrada (03/11)</span>
                      <span className="text-emerald-700 font-bold">Concluída ✓</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                      Marmitas delivery com alta demanda, mas margem desconhecida. Separação de contas iniciada.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">Sessão 2: Ficha Técnica & Pesagem (05/11)</span>
                      <span className="text-emerald-700 font-bold">Concluída ✓</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                      Pesagem de proteínas na bancada. Redução de 10% no desperdício de insumos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna Lateral: Tarefas e Anexos */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-slate-900">Tarefas Práticas de Bancada</h4>
                  <span className="text-xs font-bold text-[#004A8D]">
                    {tasks.filter(t => t.done).length} de {tasks.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-2xl border transition flex items-start justify-between gap-2.5 ${
                        task.done ? 'bg-blue-50/50 border-blue-200 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 cursor-pointer flex-1" onClick={() => toggleTask(task.id)}>
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={() => {}}
                          className="mt-0.5 rounded text-[#004A8D] focus:ring-[#004A8D] cursor-pointer"
                        />
                        <span className={`text-xs ${task.done ? 'line-through text-slate-400' : 'font-medium'}`}>
                          {task.text}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-slate-400 hover:text-rose-600 transition p-0.5"
                        title="Excluir tarefa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 pt-2">
                  <input
                    type="text"
                    placeholder="Nova tarefa prática..."
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                  />
                  <button
                    onClick={handleAddTask}
                    className="p-2 rounded-xl bg-[#004A8D] text-white hover:bg-[#003B70] transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#84BD00]" />
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#0030A3] via-[#004A8D] to-[#002660] text-white rounded-3xl p-5 shadow-sm space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#84BD00]">
                  Material de Apoio Oficial
                </span>
                <h5 className="text-sm font-bold">Ficha_Tecnica_Modelo.csv</h5>
                <p className="text-xs text-blue-100">
                  Planilha padrão SENAC para precificação e controle de CMV.
                </p>
                <button 
                  onClick={downloadFichaTecnicaCSV}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#84BD00]" />
                  <span>Baixar Planilha Oficial</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TELA 3: TRILHA PEDAGÓGICA (5 ETAPAS ESTRUTURADAS)             */}
      {/* ============================================================== */}
      {currentTab === 'trilha' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#004A8D]" />
                <span>Trilha Pedagógica de Desenvolvimento Empresarial (5 Etapas)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Metodologia institucional de formação do empreendedor em 5 sessões de atendimento.
              </p>
            </div>
            <span className="text-xs font-bold text-[#004A8D] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Etapa Selecionada: Sessão 0{selectedSessionNumber}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {sessions.map((sess) => {
              const isSelected = selectedSessionNumber === sess.num;
              const isDone = sess.num < 3;
              const isCurrent = sess.num === 3;

              return (
                <div
                  key={sess.num}
                  onClick={() => setSelectedSessionNumber(sess.num)}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#004A8D] bg-[#004A8D]/5 shadow-sm ring-2 ring-[#004A8D]/20'
                      : 'border-slate-200/80 bg-slate-50 hover:bg-slate-100/70'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        Etapa 0{sess.num}
                      </span>
                      <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-md ${
                        isDone
                          ? 'bg-blue-100 text-[#004A8D]'
                          : isCurrent
                            ? 'bg-[#84BD00] text-slate-950 font-black'
                            : 'bg-slate-200 text-slate-600'
                      }`}>
                        {sess.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{sess.title}</h4>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 font-medium">
                    {sess.data}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detalhe da Sessão Selecionada */}
          {(() => {
            const activeSess = sessions.find(s => s.num === selectedSessionNumber) || sessions[2];
            return (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900">
                    Etapa {activeSess.num}: {activeSess.title}
                  </h3>
                  <span className="text-xs font-bold text-slate-500">{activeSess.data}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{activeSess.summary}</p>
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                  <span className="font-semibold text-slate-500">Entregável Esperado:</span>
                  <span className="font-bold text-[#004A8D]">{activeSess.entregavel}</span>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ============================================================== */}
      {/* TELA 4: SIMULADOR DE CUSTOS & CMV (CALCULADORA PRÁTICA)        */}
      {/* ============================================================== */}
      {currentTab === 'calculadora' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#004A8D]" />
                <span>Simulador de Custos, CMV e Margem de Contribuição</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Calibre o preço de venda para {currentStudent.nome} ({currentStudent.negocio}) e garanta lucratividade real.
              </p>
            </div>
            <button
              onClick={handleSalvarFichaNoProntuario}
              className="px-4 py-2 rounded-xl bg-[#004A8D] hover:bg-[#003B70] text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4 text-[#84BD00]" />
              <span>Salvar Simulação no Prontuário</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Input Preço de Venda */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Preço de Venda</span>
              <div className="text-2xl font-black text-slate-900">R$ {precoVenda.toFixed(2)}</div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPrecoVenda(p => Math.max(5, p - 1))}
                  className="flex-1 py-1.5 text-xs font-bold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg cursor-pointer"
                >
                  - R$ 1
                </button>
                <button
                  onClick={() => setPrecoVenda(p => p + 1)}
                  className="flex-1 py-1.5 text-xs font-bold bg-[#004A8D] hover:bg-[#003B70] text-white rounded-lg cursor-pointer"
                >
                  + R$ 1
                </button>
              </div>
            </div>

            {/* Input Custo de Insumos */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Insumos (Proteína/Guarnição)</span>
              <div className="text-2xl font-black text-slate-900">R$ {custoInsumos.toFixed(2)}</div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCustoInsumos(c => Math.max(1, Number((c - 0.5).toFixed(2))))}
                  className="flex-1 py-1.5 text-xs font-bold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg cursor-pointer"
                >
                  - R$ 0,50
                </button>
                <button
                  onClick={() => setCustoInsumos(c => Number((c + 0.5).toFixed(2)))}
                  className="flex-1 py-1.5 text-xs font-bold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg cursor-pointer"
                >
                  + R$ 0,50
                </button>
              </div>
            </div>

            {/* Input Custo de Embalagem */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Embalagem Térmica</span>
              <div className="text-2xl font-black text-slate-900">R$ {custoEmbalagem.toFixed(2)}</div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCustoEmbalagem(e => Math.max(0.5, Number((e - 0.2).toFixed(2))))}
                  className="flex-1 py-1.5 text-xs font-bold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg cursor-pointer"
                >
                  - R$ 0,20
                </button>
                <button
                  onClick={() => setCustoEmbalagem(e => Number((e + 0.2).toFixed(2)))}
                  className="flex-1 py-1.5 text-xs font-bold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg cursor-pointer"
                >
                  + R$ 0,20
                </button>
              </div>
            </div>

            {/* Resultado Margem */}
            <div className="p-5 rounded-2xl bg-[#004A8D] text-white space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#84BD00]">Margem de Lucro</span>
                <div className="text-3xl font-black mt-1">{margemPercentual}%</div>
                <p className="text-[10px] text-blue-100 mt-1">
                  Lucro bruto: R$ {lucroBrutoUnitario} por prato
                </p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-center ${
                Number(margemPercentual) >= 50 
                  ? 'bg-emerald-400 text-slate-950' 
                  : 'bg-amber-300 text-slate-950'
              }`}>
                {Number(margemPercentual) >= 50 ? '✓ Margem Saudável (>50%)' : 'Atenção na Margem'}
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800">Ponto de Equilíbrio Operacional</h4>
              <p className="text-xs text-slate-500">
                Considerando custos fixos mensais de R$ {custoFixoMensal.toFixed(2)} (aluguel, gás e energia):
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-[#004A8D]">{pontoEquilibrioPratos} unidades/mês</span>
              <p className="text-[10px] text-slate-400">cerca de {Math.ceil(pontoEquilibrioPratos / 22)} pratos por dia útil</p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TELA 5: MEUS MENTORADOS (CARTEIRA DE ALUNOS DA ALINE)           */}
      {/* ============================================================== */}
      {currentTab === 'alunos-mentora' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Carteira de Mentorados de {mentor.nome}</h3>
              <p className="text-xs text-slate-500">Empreendedores acompanhados nesta trilha</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#004A8D] border border-blue-200">
              {students.length} alunos
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {students.map(s => (
              <div key={s.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{s.avatar || '💼'}</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{s.nome}</h4>
                    <p className="text-[10px] text-slate-500">{s.negocio}</p>
                    <span className="text-[10px] font-bold text-[#004A8D]">
                      {s.etapaPrograma} (Sessão {s.sessaoAtual || 1}/5)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedStudentId(s.id);
                      if (setCurrentTab) setCurrentTab('prontuario');
                      showToast(`Prontuário de ${s.nome} aberto.`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[#004A8D] font-bold text-xs transition cursor-pointer"
                  >
                    Ver Prontuário
                  </button>
                  {s.whatsapp && (
                    <a
                      href={`https://wa.me/55${s.whatsapp.replace(/\D/g, '')}?text=Olá%20${encodeURIComponent(s.nome)},%20aqui%20é%20${encodeURIComponent(mentor.nome.split(' ')[0])}%20do%20SENAC!`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-xl bg-[#84BD00]/15 hover:bg-[#84BD00]/25 text-[#4E7100] transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#C87500]" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}