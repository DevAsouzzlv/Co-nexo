// src/components/BlindTestGuideModal.jsx
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  ShieldCheck, 
  Building2, 
  GraduationCap, 
  UserCheck, 
  BarChart3, 
  ArrowRight, 
  HelpCircle,
  FileText,
  Clock,
  RotateCcw,
  DownloadCloud,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { DEMO_ACCOUNTS } from '../services/storage';

export default function BlindTestGuideModal({
  isOpen,
  onClose,
  currentPersona,
  onSwitchPersona,
  onResetDemo,
  onResetClean,
  onExportBackup
}) {
  const [activeTab, setActiveTab] = useState('roteiro'); // 'roteiro' | 'perfis' | 'senac'
  
  // Checklist interativo persistido no localStorage
  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem('conexo_blind_test_checklist');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      'recepcao_encaixe': false,
      'recepcao_whatsapp': false,
      'recepcao_cadastro': false,
      'consultoria_diario': false,
      'consultoria_simulacao': false,
      'mentorado_tarefa': false,
      'mentorado_anexo': false,
      'coordenacao_meta8h': false,
      'coordenacao_csv': false,
      'admin_perfis': false
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('conexo_blind_test_checklist', JSON.stringify(checklist));
    } catch {}
  }, [checklist]);

  if (!isOpen) return null;

  const toggleCheck = (id) => {
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalChecks = Object.keys(checklist).length;
  const completedChecks = Object.values(checklist).filter(Boolean).length;
  const progressPercent = Math.round((completedChecks / totalChecks) * 100);

  const roles = [
    {
      id: 'max',
      nome: 'Max Ferreira',
      cargo: 'Recepção & Operação',
      roleLabel: 'Recepção',
      badge: 'Grade & Atendimentos',
      icon: Building2,
      color: 'bg-blue-600',
      textColor: 'text-blue-700',
      bgLight: 'bg-blue-50',
      borderColor: 'border-blue-200',
      email: 'max.operacao@sp.senac.br',
      dicas: [
        'Clique em qualquer card de horário para abrir opções de presença ou encaixe rápido.',
        'Use o botão "+ Novo Mentorado" para cadastrar um novo empreendedor.',
        'Observe a régua de 8h diárias de ocupação sem intervalos ociosos.'
      ]
    },
    {
      id: 'aline',
      nome: 'Aline Ferreira',
      cargo: 'Consultora de Negócios',
      roleLabel: 'Consultora',
      badge: 'Prontuário & Trilha',
      icon: GraduationCap,
      color: 'bg-amber-600',
      textColor: 'text-amber-700',
      bgLight: 'bg-amber-50',
      borderColor: 'border-amber-200',
      email: 'aline.consultora@sp.senac.br',
      dicas: [
        'Abra o "Prontuário" de um mentorado para preencher o diário de bordo.',
        'Use a "Simulação de Custos & CMV" para calcular preço ideal de venda.',
        'Acompanhe o checklist de bancada e o plano prático acordado.'
      ]
    },
    {
      id: 'arthur',
      nome: 'Arthur Silva',
      cargo: 'Empreendedor (Tempero do Arthur)',
      roleLabel: 'Mentorado',
      badge: 'Portal do Aluno',
      icon: UserCheck,
      color: 'bg-emerald-600',
      textColor: 'text-emerald-700',
      bgLight: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      email: 'arthur.silva@sp.senac.br',
      dicas: [
        'Marque compromissos de bancada como concluídos com um clique.',
        'Clique em "Anexar Documento Respondido" para simular o upload de tarefas práticas em PDF/DOC.',
        'Confirme sua presença no WhatsApp para a próxima mentoria.'
      ]
    },
    {
      id: 'regis',
      nome: 'Regis Moreira',
      cargo: 'Coordenação Geral',
      roleLabel: 'Diretoria',
      badge: 'Auditoria & Contas',
      icon: BarChart3,
      color: 'bg-purple-600',
      textColor: 'text-purple-700',
      bgLight: 'bg-purple-50',
      borderColor: 'border-purple-200',
      email: 'regis.coordenacao@sp.senac.br',
      dicas: [
        'Audite as metas de 8h diárias dos docentes (4h Manhã + 4h Tarde).',
        'Analise a taxa de no-show e a taxa de conversão em MEI formalizado.',
        'Clique em "Exportar Prestação CSV" para baixar o relatório oficial seguro (CWE-1236).'
      ]
    },
    {
      id: 'admin',
      nome: 'Admin Supremo',
      cargo: 'Governança Master & TI',
      roleLabel: 'Admin Supremo',
      badge: 'Governança TI',
      icon: ShieldCheck,
      color: 'bg-slate-900',
      textColor: 'text-slate-800',
      bgLight: 'bg-slate-100',
      borderColor: 'border-slate-300',
      email: 'admin@conexo.senac.br',
      dicas: [
        'Painel raiz responsável pelo provisionamento e governança de acessos.',
        'Gerencie a equipe institucional e ative novos perfis sob demanda.',
        'Acesse os utilitários de banco de dados e restauração.'
      ]
    }
  ];

  const currentRoleObj = roles.find(r => r.id === currentPersona) || roles[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-white rounded-[32px] shadow-[0_25px_70px_rgba(0,0,0,0.25)] border border-white/80 max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh] text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Topo / Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#004A8D] via-[#00386C] to-[#171b26] text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#84BD00]/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-3.5 relative z-10">
            <div className="h-11 w-11 rounded-2xl bg-[#84BD00] text-slate-950 flex items-center justify-center font-black text-sm shadow-md shadow-[#84BD00]/30 shrink-0">
              🧪
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">
                  Guia Interativo de Avaliação • Teste às Cegas
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-950 shadow-xs">
                  Oficial SENAC Hub
                </span>
              </div>
              <p className="text-xs text-blue-100 font-medium">
                Roteiro passo a passo para testar fluxos, personas e funcionalidades em tempo real
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer relative z-10 shrink-0"
            title="Fechar Guia"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Progresso do Teste */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Progresso da sua Avaliação:</span>
            <span className="font-bold text-[#004A8D] bg-blue-100/70 px-2 py-0.5 rounded-full">
              {completedChecks} de {totalChecks} fluxos testados ({progressPercent}%)
            </span>
          </div>
          <div className="w-full sm:w-48 bg-slate-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#004A8D] to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Abas Superiores */}
        <div className="px-6 pt-3 border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('roteiro')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'roteiro'
                ? 'bg-white text-[#004A8D] border-b-2 border-[#004A8D] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Roteiro de Teste (Checklist)</span>
          </button>

          <button
            onClick={() => setActiveTab('perfis')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'perfis'
                ? 'bg-white text-[#004A8D] border-b-2 border-[#004A8D] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#84BD00]" />
            <span>Alternar Perfil Instantâneo</span>
          </button>

          <button
            onClick={() => setActiveTab('senac')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'senac'
                ? 'bg-white text-[#004A8D] border-b-2 border-[#004A8D] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Info className="w-4 h-4 text-purple-600" />
            <span>Objetivos do Projeto Co.Nexo</span>
          </button>
        </div>

        {/* Corpo com Scroll */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">

          {/* ABA 1: ROTEIRO PRÁTICO (CHECKLIST) */}
          {activeTab === 'roteiro' && (
            <div className="space-y-5 animate-fade-in">
              {/* Dica da Persona Atual */}
              <div className={`p-4 rounded-2xl ${currentRoleObj.bgLight} border ${currentRoleObj.borderColor} flex items-start gap-3`}>
                <div className={`p-2 rounded-xl ${currentRoleObj.color} text-white shrink-0`}>
                  <currentRoleObj.icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full bg-white text-slate-800 border border-slate-200">
                      Você está em: {currentRoleObj.nome} ({currentRoleObj.roleLabel})
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">
                    O que você pode testar agora nesta tela:
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1 pt-1 list-disc list-inside">
                    {currentRoleObj.dicas.map((dica, idx) => (
                      <li key={idx}>{dica}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Lista dos 10 Fluxos Essenciais */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Checklist de Avaliação Prática
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Clique nas caixas para registrar seu progresso
                  </span>
                </div>

                {/* 1. Recepção */}
                <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      1. Módulo Recepção (Max)
                    </span>
                    {onSwitchPersona && (
                      <button
                        onClick={() => { onSwitchPersona('max'); onClose(); }}
                        className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        Ir para Recepção →
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <label className="flex items-start gap-2.5 cursor-pointer hover:bg-white/60 p-1.5 rounded-lg transition">
                      <input 
                        type="checkbox" 
                        checked={checklist.recepcao_encaixe} 
                        onChange={() => toggleCheck('recepcao_encaixe')}
                        className="mt-0.5 rounded text-blue-600 focus:ring-blue-500" 
                      />
                      <span>
                        <strong>Encaixe Rápido na Grade:</strong> Clicar em um slot "Horário Livre (Encaixe)" e preencher com aluno da lista de espera.
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer hover:bg-white/60 p-1.5 rounded-lg transition">
                      <input 
                        type="checkbox" 
                        checked={checklist.recepcao_whatsapp} 
                        onChange={() => toggleCheck('recepcao_whatsapp')}
                        className="mt-0.5 rounded text-blue-600 focus:ring-blue-500" 
                      />
                      <span>
                        <strong>Confirmação de Presença WhatsApp:</strong> Abrir "Opções" em um card e alternar status para "Confirmado".
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer hover:bg-white/60 p-1.5 rounded-lg transition">
                      <input 
                        type="checkbox" 
                        checked={checklist.recepcao_cadastro} 
                        onChange={() => toggleCheck('recepcao_cadastro')}
                        className="mt-0.5 rounded text-blue-600 focus:ring-blue-500" 
                      />
                      <span>
                        <strong>Novo Mentorado:</strong> Clicar no botão "+ Novo Mentorado" e cadastrar um novo empreendedor com dados iniciais.
                      </span>
                    </label>
                  </div>
                </div>

                {/* 2. Consultoria */}
                <div className="p-4 rounded-2xl border border-amber-100 bg-amber-50/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-amber-600" />
                      2. Módulo Consultoria Docente (Aline / Laíse)
                    </span>
                    {onSwitchPersona && (
                      <button
                        onClick={() => { onSwitchPersona('aline'); onClose(); }}
                        className="text-[11px] font-bold text-amber-600 hover:underline cursor-pointer"
                      >
                        Ir para Consultoria →
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <label className="flex items-start gap-2.5 cursor-pointer hover:bg-white/60 p-1.5 rounded-lg transition">
                      <input 
                        type="checkbox" 
                        checked={checklist.consultoria_diario} 
                        onChange={() => toggleCheck('consultoria_diario')}
                        className="mt-0.5 rounded text-amber-600 focus:ring-amber-500" 
                      />
                      <span>
                        <strong>Prontuário & Diário de Bordo:</strong> Clicar em "Abrir Prontuário" e registrar anotações pedagógicas da mentoria.
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer hover:bg-white/60 p-1.5 rounded-lg transition">
                      <input 
                        type="checkbox" 
                        checked={checklist.consultoria_simulacao} 
                        onChange={() => toggleCheck('consultoria_simulacao')}
                        className="mt-0.5 rounded text-amber-600 focus:ring-amber-500" 
                      />
                      <span>
                        <strong>Simulação de Custos & CMV:</strong> Preencher custos de insumos na ferramenta de cálculo e salvar a meta financeira.
                      </span>
                    </label>
                  </div>
                </div>

                {/* 3. Mentorado */}
                <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      3. Portal do Mentorado (Arthur Silva)
                    </span>
                    {onSwitchPersona && (
                      <button
                        onClick={() => { onSwitchPersona('arthur'); onClose(); }}
                        className="text-[11px] font-bold text-emerald-600 hover:underline cursor-pointer"
                      >
                        Ir para Mentorado →
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <label className="flex items-start gap-2.5 cursor-pointer hover:bg-white/60 p-1.5 rounded-lg transition">
                      <input 
                        type="checkbox" 
                        checked={checklist.mentorado_tarefa} 
                        onChange={() => toggleCheck('mentorado_tarefa')}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500" 
                      />
                      <span>
                        <strong>Plano Prático de Bancada:</strong> Marcar tarefas como concluídas ou adicionar uma nova tarefa personalizada.
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer hover:bg-white/60 p-1.5 rounded-lg transition">
                      <input 
                        type="checkbox" 
                        checked={checklist.mentorado_anexo} 
                        onChange={() => toggleCheck('mentorado_anexo')}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500" 
                      />
                      <span>
                        <strong>Anexar Documento Respondido:</strong> Clicar no botão de anexar documento para enviar ficha de pesagem ou comprovante em PDF/Word.
                      </span>
                    </label>
                  </div>
                </div>

                {/* 4. Coordenação & Admin */}
                <div className="p-4 rounded-2xl border border-purple-100 bg-purple-50/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4 text-purple-600" />
                      4. Governança, Coordenação & Auditoria (Regis / Admin)
                    </span>
                    {onSwitchPersona && (
                      <button
                        onClick={() => { onSwitchPersona('regis'); onClose(); }}
                        className="text-[11px] font-bold text-purple-600 hover:underline cursor-pointer"
                      >
                        Ir para Coordenação →
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <label className="flex items-start gap-2.5 cursor-pointer hover:bg-white/60 p-1.5 rounded-lg transition">
                      <input 
                        type="checkbox" 
                        checked={checklist.coordenacao_meta8h} 
                        onChange={() => toggleCheck('coordenacao_meta8h')}
                        className="mt-0.5 rounded text-purple-600 focus:ring-purple-500" 
                      />
                      <span>
                        <strong>Auditoria de 8h/dia:</strong> Verificar os cards de carga horária docente (4h Manhã + 4h Tarde com zero ociosidade).
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer hover:bg-white/60 p-1.5 rounded-lg transition">
                      <input 
                        type="checkbox" 
                        checked={checklist.coordenacao_csv} 
                        onChange={() => toggleCheck('coordenacao_csv')}
                        className="mt-0.5 rounded text-purple-600 focus:ring-purple-500" 
                      />
                      <span>
                        <strong>Exportar Prestação CSV:</strong> Baixar o arquivo com relatório auditável homologado para diretoria.
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer hover:bg-white/60 p-1.5 rounded-lg transition">
                      <input 
                        type="checkbox" 
                        checked={checklist.admin_perfis} 
                        onChange={() => toggleCheck('admin_perfis')}
                        className="mt-0.5 rounded text-purple-600 focus:ring-purple-500" 
                      />
                      <span>
                        <strong>Governança de Usuários:</strong> Acessar o Admin Supremo para gerenciar perfis e permissões da equipe.
                      </span>
                    </label>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ABA 2: ALTERNAR PERFIL INSTANTÂNEO */}
          {activeTab === 'perfis' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                💡 <strong>Facilitador de Avaliação:</strong> No teste às cegas, você não precisa fazer logout para avaliar outro papel. Basta clicar em <strong>"Acessar Este Perfil"</strong> abaixo.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {roles.map((r) => {
                  const isCurrent = currentPersona === r.id;
                  const Icon = r.icon;

                  return (
                    <div
                      key={r.id}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        isCurrent 
                          ? 'border-[#004A8D] bg-blue-50/60 ring-2 ring-[#004A8D]/20 shadow-md' 
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-xl ${r.color} text-white shrink-0`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-900">{r.nome}</h4>
                              <p className="text-[11px] text-slate-500">{r.cargo}</p>
                            </div>
                          </div>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${r.bgLight} ${r.textColor} border ${r.borderColor}`}>
                            {r.roleLabel}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 space-y-1 pt-1">
                          <p><strong>E-mail:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px]">{r.email}</code></p>
                          <p><strong>Módulo:</strong> {r.badge}</p>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                        {isCurrent ? (
                          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Perfil Ativo Agora
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              if (onSwitchPersona) {
                                onSwitchPersona(r.id);
                                onClose();
                              }
                            }}
                            className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-[#004A8D] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs active:scale-98"
                          >
                            <span>Acessar Este Perfil</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#84BD00]" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ABA 3: OBJETIVOS DO PROJETO SENAC */}
          {activeTab === 'senac' && (
            <div className="space-y-4 animate-fade-in text-xs text-slate-700">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                <h4 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#84BD00]" />
                  Propósito Oficial do Sistema Co.Nexo
                </h4>
                <p className="leading-relaxed">
                  O <strong>Co.Nexo</strong> é o Hub Integrado de Empreendedorismo & Gestão de Mentorias do SENAC São Paulo. Ele foi construído para profissionalizar o acompanhamento de microempreendedores e solucionar ineficiências históricas de operação em programas sociais e de fomento.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1">
                  <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                    ⏱️ Meta de 8 Horas Diárias (Zero Ociosidade)
                  </h5>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Cada sala opera 8h por dia divididas em 4h matutinas e 4h vespertinas. Janelas vagas são preenchidas automaticamente por encaixes de 1h ou 2h da fila de espera.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1">
                  <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                    📲 Combate Rigoroso ao No-Show
                  </h5>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Confirmação ativa D-1 via WhatsApp. Alunos com 2 faltas consecutivas são automaticamente desligados, liberando vagas públicas para quem está na lista.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1">
                  <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                    📈 Trilha Prática de Formalização MEI
                  </h5>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Foco na transição do comércio informal para MEI regularizado, com acompanhamento de faturamento, cálculo de CMV e segregação de contas bancárias.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1">
                  <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                    🛡️ Governança & Auditoria Transparente
                  </h5>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Exportação de relatórios em CSV sanitizado contra injeção de fórmulas (CWE-1236) e controle rigoroso de papéis institucionais.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2 pt-3">
                <span className="font-bold text-slate-800">Controles de Demonstração & Base:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (confirm('Deseja recarregar o banco de demonstração oficial (14 alunos, grade de 8h)?')) {
                        if (onResetDemo) onResetDemo();
                        onClose();
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-100 text-[#004A8D] font-bold text-xs hover:bg-blue-200 transition cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Recarregar Demo SENAC</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onExportBackup) onExportBackup();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300 transition cursor-pointer flex items-center gap-1"
                  >
                    <DownloadCloud className="w-3.5 h-3.5" />
                    <span>Exportar Backup JSON</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Rodapé do Modal */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[11px] text-slate-500 hidden sm:block">
            Ambiente 100% interativo e responsivo • Teste às Cegas SENAC Hub
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#004A8D] hover:bg-[#00386C] text-white font-bold text-xs transition cursor-pointer ml-auto shadow-xs active:scale-98"
          >
            Continuar Avaliando
          </button>
        </div>

      </div>
    </div>
  );
}
