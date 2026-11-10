// src/components/AdminCleanView.jsx
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserPlus, 
  Trash2, 
  Building2, 
  GraduationCap, 
  UserCheck, 
  BarChart3, 
  KeyRound, 
  Lock, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  Database, 
  DownloadCloud, 
  RotateCcw, 
  AlertTriangle,
  Clock,
  Settings,
  Layers,
  Search,
  Check,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import { 
  getStoredAccounts, 
  saveStoredAccounts, 
  addStoredAccount,
  MASTER_ADMIN_ACCOUNT
} from '../services/storage';

export default function AdminCleanView({
  students = [],
  consultors = [],
  appointments = [],
  onResetClean,
  onResetDemo,
  onExportBackup,
  currentTab = 'usuarios',
  setCurrentTab,
  currentUser
}) {
  const [accounts, setAccounts] = useState(() => getStoredAccounts());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newNome, setNewNome] = useState('');
  const [newRoleType, setNewRoleType] = useState('regis');
  const [newCargo, setNewCargo] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('senac123');
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const activeTab = currentTab || 'usuarios';

  const getProfileIcon = (roleType) => {
    switch (roleType) {
      case 'admin': return ShieldCheck;
      case 'regis': return BarChart3;
      case 'max': return Building2;
      case 'aline': return GraduationCap;
      case 'arthur': return UserCheck;
      default: return Building2;
    }
  };

  const getProfileGradient = (roleType) => {
    switch (roleType) {
      case 'admin': return 'from-slate-900 to-indigo-950';
      case 'regis': return 'from-purple-600 to-violet-800';
      case 'max': return 'from-blue-600 to-indigo-700';
      case 'aline': return 'from-amber-500 to-orange-600';
      case 'arthur': return 'from-emerald-500 to-teal-700';
      default: return 'from-blue-600 to-indigo-700';
    }
  };

  const openModalForRole = (roleType, defaultCargo = '') => {
    setNewRoleType(roleType);
    setNewCargo(defaultCargo);
    setNewNome('');
    setNewEmail('');
    setNewPassword('senac123');
    setFormError('');
    setSuccessMsg('');
    setIsModalOpen(true);
  };

  // Criação de perfil 100% dinâmico
  const handleCreateAccount = (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    if (!newNome.trim() || newNome.trim().length < 3) {
      setFormError('Informe o nome completo do titular (mínimo 3 caracteres).');
      return;
    }

    if (!newEmail.trim() || !newEmail.includes('@')) {
      setFormError('Informe um e-mail institucional válido.');
      return;
    }

    if (!newPassword || newPassword.length < 3) {
      setFormError('A senha de acesso deve conter no mínimo 3 dígitos.');
      return;
    }

    if (accounts.some(a => a.email.toLowerCase() === newEmail.trim().toLowerCase())) {
      setFormError('Já existe um perfil cadastrado com este e-mail.');
      return;
    }

    const roleLabels = {
      regis: 'Coordenação Geral',
      max: 'Recepção & Operação',
      aline: 'Consultoria de Negócios',
      arthur: 'Mentorado Empreendedor',
      admin: 'Admin Supremo'
    };

    const newAcc = {
      id: `acc-${Date.now()}`,
      nome: newNome.trim(),
      cargo: newCargo.trim() || roleLabels[newRoleType],
      roleLabel: roleLabels[newRoleType],
      roleType: newRoleType,
      email: newEmail.trim().toLowerCase(),
      password: newPassword,
      badge: roleLabels[newRoleType],
      gradient: getProfileGradient(newRoleType),
      color: newRoleType === 'regis' ? '#7C3AED' : newRoleType === 'max' ? '#004A8D' : newRoleType === 'aline' ? '#84BD00' : '#10B981',
      aliases: [newNome.trim().toLowerCase().split(' ')[0], newEmail.trim().toLowerCase()]
    };

    const updated = addStoredAccount(newAcc);
    setAccounts(updated);
    setSuccessMsg(`✓ Perfil de "${newNome}" cadastrado com sucesso!`);
    
    // Limpa formulário
    setNewNome('');
    setNewCargo('');
    setNewEmail('');
    setNewPassword('senac123');

    setTimeout(() => {
      setIsModalOpen(false);
      setSuccessMsg('');
    }, 1000);
  };

  // Excluir Perfil (exceto o próprio Admin Supremo)
  const handleDeleteAccount = (accId) => {
    if (accId === 'admin' || accId === 'super-admin') {
      alert('O perfil do Admin Supremo é a raiz do sistema e não pode ser excluído.');
      return;
    }
    const target = accounts.find(a => a.id === accId || a.email === accId);
    if (confirm(`Deseja realmente remover o perfil de "${target?.nome || 'usuário'}" do sistema?`)) {
      const updated = accounts.filter(a => a.id !== accId && a.email !== accId);
      setAccounts(updated);
      saveStoredAccounts(updated);
    }
  };

  const filteredAccounts = accounts.filter(a => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      a.nome?.toLowerCase().includes(term) ||
      a.email?.toLowerCase().includes(term) ||
      a.cargo?.toLowerCase().includes(term) ||
      a.roleLabel?.toLowerCase().includes(term)
    );
  });

  const teamAccounts = accounts.filter(a => a.roleType !== 'admin' && a.id !== 'admin' && a.id !== 'super-admin');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner Principal do Admin Supremo com Estilo Apple */}
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-blue-100 border border-white/20 inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#84BD00]" />
              Painel do Admin Supremo • Acesso Raiz Master
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
              Controle Total
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Centro de Governança & Gestão de Perfis
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/80 max-w-2xl font-normal leading-relaxed">
            Como <strong>Admin Supremo</strong>, seu papel principal é <strong>cadastrar o perfil de Coordenação Geral</strong>, que por sua vez gerencia a equipe, turnos de atendimento e mentorados do Hub.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => openModalForRole('regis', 'Coordenação Geral')}
            className="px-5 py-2.5 rounded-full bg-[#84BD00] hover:bg-[#72A600] active:scale-95 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#84BD00]/25 transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Cadastrar Perfil</span>
          </button>
        </div>
      </div>

      {/* Navegação por Abas Estilo Apple Segmented Controls */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs max-w-fit">
        {[
          { id: 'usuarios', label: 'Gestão de Perfis', icon: UserCheck, count: accounts.length },
          { id: 'governanca', label: 'Regras do Hub (8h)', icon: Clock },
          { id: 'banco-dados', label: 'Banco de Dados & Backup', icon: Database }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab && setCurrentTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-[#004A8D] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ABA 1: GESTÃO & CADASTRO DE PERFIS */}
      {activeTab === 'usuarios' && (
        <div className="space-y-6">
          {/* Ações Rápidas por Função (Sem Nomes Estáticos) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#84BD00]" />
                <h3 className="text-base font-black text-slate-900">
                  Cadastrar Perfil por Função
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">Escolha a função e informe os dados do colaborador</span>
            </div>

            <p className="text-xs text-slate-500">
              Clique em uma das funções abaixo para cadastrar um novo usuário com nome, cargo e e-mail institucional:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {/* Coordenação */}
              <button
                type="button"
                onClick={() => openModalForRole('regis', 'Coordenação Geral')}
                className="p-4 rounded-2xl bg-purple-50/70 hover:bg-purple-100/70 border border-purple-200/80 text-left transition flex flex-col justify-between space-y-3 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                    Diretoria
                  </span>
                  <UserPlus className="w-4 h-4 text-purple-600 group-hover:scale-110 transition" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-purple-950">Coordenação Geral</h4>
                  <p className="text-xs text-purple-800 font-medium">Gestão macro e autorizações</p>
                </div>
                <div className="pt-2 border-t border-purple-200/60 text-xs font-bold text-purple-700 flex items-center justify-between">
                  <span>+ Cadastrar Titular</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* Recepção */}
              <button
                type="button"
                onClick={() => openModalForRole('max', 'Recepção & Operação do Hub')}
                className="p-4 rounded-2xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/80 text-left transition flex flex-col justify-between space-y-3 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#004A8D] bg-blue-100 px-2 py-0.5 rounded-md">
                    Operação
                  </span>
                  <UserPlus className="w-4 h-4 text-[#004A8D] group-hover:scale-110 transition" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Recepção & Grade</h4>
                  <p className="text-xs text-slate-700 font-medium">Controle de turnos e presenças</p>
                </div>
                <div className="pt-2 border-t border-blue-200/60 text-xs font-bold text-[#004A8D] flex items-center justify-between">
                  <span>+ Cadastrar Titular</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* Consultoria */}
              <button
                type="button"
                onClick={() => openModalForRole('aline', 'Consultoria de Negócios')}
                className="p-4 rounded-2xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200/80 text-left transition flex flex-col justify-between space-y-3 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    Docência
                  </span>
                  <UserPlus className="w-4 h-4 text-[#84BD00] group-hover:scale-110 transition" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Consultoria de Negócios</h4>
                  <p className="text-xs text-slate-700 font-medium">Atendimentos, prontuários e trilhas</p>
                </div>
                <div className="pt-2 border-t border-amber-200/60 text-xs font-bold text-amber-900 flex items-center justify-between">
                  <span>+ Cadastrar Titular</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* Mentorado */}
              <button
                type="button"
                onClick={() => openModalForRole('arthur', 'Empreendedor')}
                className="p-4 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/80 text-left transition flex flex-col justify-between space-y-3 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Empreendedor
                  </span>
                  <UserPlus className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Mentorado</h4>
                  <p className="text-xs text-slate-700 font-medium">Acesso ao portal do aluno</p>
                </div>
                <div className="pt-2 border-t border-emerald-200/60 text-xs font-bold text-emerald-800 flex items-center justify-between">
                  <span>+ Cadastrar Titular</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>
          </div>

          {/* Diretório Geral de Perfis Cadastrados */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">Perfis & Contas Ativas no Sistema</h3>
                <p className="text-xs text-slate-500">
                  Total de {accounts.length} contas cadastradas com credenciais no banco local
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou e-mail..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:border-[#004A8D] w-56"
                  />
                </div>

                <button
                  onClick={() => openModalForRole('regis', 'Coordenação Geral')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#004A8D] hover:bg-[#00386B] text-white text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#84BD00]" />
                  <span>Novo Perfil</span>
                </button>
              </div>
            </div>

            {teamAccounts.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 text-center space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-blue-100 text-[#004A8D] flex items-center justify-center mx-auto">
                  <UserPlus className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black text-slate-800">Nenhum perfil de equipe cadastrado ainda</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  O banco está limpo. Comece cadastrando o perfil de <strong>Coordenação Geral</strong> clicando no botão abaixo ou nas opções acima.
                </p>
                <button
                  type="button"
                  onClick={() => openModalForRole('regis', 'Coordenação Geral')}
                  className="px-4 py-2 rounded-xl bg-[#004A8D] text-white font-bold text-xs shadow-xs hover:bg-[#00386B] transition cursor-pointer"
                >
                  + Cadastrar Coordenação Geral
                </button>
              </div>
            ) : null}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAccounts.map((acc) => {
                const Icon = getProfileIcon(acc.roleType);
                const isSuper = acc.roleType === 'admin' || acc.id === 'admin';

                return (
                  <div
                    key={acc.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 relative group ${
                      isSuper
                        ? 'bg-gradient-to-b from-slate-900 to-indigo-950 text-white border-slate-800 shadow-md ring-1 ring-white/10'
                        : 'bg-slate-50/80 border-slate-200/90 hover:border-slate-300 hover:shadow-xs text-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className={`h-10 w-10 rounded-2xl flex items-center justify-center text-white shadow-xs bg-gradient-to-br ${acc.gradient || 'from-blue-600 to-indigo-700'}`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      {!isSuper && (
                        <button
                          onClick={() => handleDeleteAccount(acc.id)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50 transition opacity-0 group-hover:opacity-100 cursor-pointer"
                          title="Excluir perfil de usuário"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      {isSuper && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/15 text-blue-200 border border-white/20">
                          Root
                        </span>
                      )}
                    </div>

                    <div>
                      <span className={`text-xs font-bold block truncate leading-tight ${isSuper ? 'text-white' : 'text-slate-900'}`}>
                        {acc.nome}
                      </span>
                      <span className={`text-[11px] font-medium block truncate mt-0.5 ${isSuper ? 'text-slate-300' : 'text-slate-500'}`}>
                        {acc.cargo}
                      </span>
                      <span className={`text-[10px] font-mono block truncate mt-1 ${isSuper ? 'text-blue-200/70' : 'text-slate-400'}`}>
                        {acc.email}
                      </span>
                    </div>

                    <div className={`pt-2 border-t flex items-center justify-between text-[10px] ${isSuper ? 'border-white/10' : 'border-slate-200/70'}`}>
                      <span className={`font-bold uppercase px-2 py-0.5 rounded-md ${
                        isSuper 
                          ? 'bg-white/10 text-white border border-white/10' 
                          : 'bg-white border border-slate-200 text-slate-700'
                      }`}>
                        {acc.roleLabel}
                      </span>
                      <span className="text-emerald-500 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Ativo
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: REGRAS DO HUB (8H) */}
      {activeTab === 'governanca' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="h-10 w-10 rounded-2xl bg-[#004A8D] text-white flex items-center justify-center font-bold">
                <Clock className="w-5 h-5 text-[#84BD00]" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Parâmetros de Governança Institucional do Co.Nexo Hub
                </h3>
                <p className="text-xs text-slate-500">
                  Regras oficiais de jornada docente, assiduidade e anti-ociosidade homologadas pelo SENAC São Paulo
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1 */}
              <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004A8D] uppercase tracking-wider">Jornada 8 Horas/Dia</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h4 className="text-base font-bold text-slate-900">4h Manhã + 4h Tarde</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Turno matutino (<strong>08:00 às 12:00</strong>) e turno vespertino/início da noite (<strong>14:00 às 18:00</strong>) cobrindo a grade completa de atendimentos.
                </p>
                <div className="pt-2 text-[11px] font-semibold text-[#004A8D]">
                  Meta: 100% de ocupação dos turnos docentes.
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Anti-No Show & Faltas</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-200 text-amber-900">Rigor</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">Limite de 2 Faltas Sem Aviso</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cancelamentos com menos de 24h contam como falta. Ao acumular <strong>2 faltas consecutivas</strong>, o mentorado é automaticamente desligado para liberar vaga para a fila de espera.
                </p>
                <div className="pt-2 text-[11px] font-semibold text-amber-800">
                  Notificação via WhatsApp gerada automaticamente.
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Formato das Sessões</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900">Zero Ociosidade</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">2h Mentoria / 1h Diagnóstico</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Primeiro atendimento: <strong>Diagnóstico de 1 hora</strong> para nivelamento. Encontros de trilha e modelagem: <strong>2 horas de mentoria prática</strong> em bancada ou gestão.
                </p>
                <div className="pt-2 text-[11px] font-semibold text-emerald-800">
                  Salas 01 e 02 dedicadas com rotação contínua.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: BANCO DE DADOS & BACKUP */}
      {activeTab === 'banco-dados' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Painel de Gestão da Base */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Database className="w-4 h-4 text-[#004A8D]" />
                <h3 className="text-base font-black text-slate-900">Manutenção do Banco Local (LocalStorage)</h3>
              </div>

              <p className="text-xs text-slate-500">
                Operações de integridade, exportação e redefinição dos dados do Co.Nexo Hub.
              </p>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={onExportBackup}
                  className="w-full py-3 px-4 rounded-2xl bg-blue-50 hover:bg-blue-100 text-[#004A8D] font-bold text-xs flex items-center justify-between transition cursor-pointer border border-blue-200"
                >
                  <span className="flex items-center gap-2">
                    <DownloadCloud className="w-4 h-4 text-[#84BD00]" />
                    Exportar Backup Geral Completo (JSON)
                  </span>
                  <span className="text-[10px] bg-[#004A8D] text-white px-2 py-0.5 rounded-full font-bold">
                    Download
                  </span>
                </button>

                <button
                  onClick={() => {
                    if (confirm('Deseja zerar todo o banco de dados (0 alunos/mentorados, 0 agendamentos)? Apenas o Admin Supremo será mantido para você configurar o sistema do zero.')) {
                      if (onResetClean) onResetClean();
                    }
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-between transition cursor-pointer border border-rose-200"
                >
                  <span className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-rose-600" />
                    Zerar Banco de Dados (0 Alunos, 0 Agendamentos)
                  </span>
                  <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold">
                    Zerar
                  </span>
                </button>

                <button
                  onClick={() => {
                    if (confirm('Deseja restaurar a base oficial de demonstração do SENAC?')) {
                      if (onResetDemo) onResetDemo();
                    }
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-between transition cursor-pointer border border-slate-200"
                >
                  <span className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-slate-500" />
                    Restaurar Demonstração SENAC Completa
                  </span>
                  <span className="text-[10px] bg-slate-700 text-white px-2 py-0.5 rounded-full font-bold">
                    Restaurar
                  </span>
                </button>
              </div>
            </div>

            {/* Diagnóstico de Integridade */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">Estatísticas do Banco Atual</h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-500 block text-[11px]">Contas Cadastradas</span>
                  <span className="text-xl font-black text-slate-900 mt-1 block">{accounts.length}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Admin + Equipe</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-500 block text-[11px]">Mentorados na Base</span>
                  <span className="text-xl font-black text-slate-900 mt-1 block">{students.length}</span>
                  <span className="text-[10px] text-blue-600 font-semibold">Empreendedores</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-500 block text-[11px]">Agendamentos</span>
                  <span className="text-xl font-black text-slate-900 mt-1 block">{appointments.length}</span>
                  <span className="text-[10px] text-purple-600 font-semibold">Grade 8h</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-500 block text-[11px]">Consultorias Ativas</span>
                  <span className="text-xl font-black text-slate-900 mt-1 block">{consultors.length || 2}</span>
                  <span className="text-[10px] text-amber-600 font-semibold">Corpo Docente</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Banco de dados local operando normalmente com tolerância a falhas.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cadastro de Novo Perfil (Totalmente Dinâmico) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-slide-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#84BD00] text-slate-950 flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black">Cadastrar Novo Perfil</h3>
                  <p className="text-xs text-blue-100">Painel do Admin Supremo</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setFormError('');
                }}
                className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateAccount} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Nome Completo do Titular *</label>
                <input
                  type="text"
                  placeholder="Informe o nome completo..."
                  value={newNome}
                  onChange={(e) => setNewNome(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:outline-none focus:border-[#004A8D]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Função / Papel no Hub *</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { type: 'regis', label: 'Coordenação', desc: 'Diretoria e governança' },
                    { type: 'max', label: 'Recepção', desc: 'Turnos e presenças' },
                    { type: 'aline', label: 'Consultoria', desc: 'Atendimentos e trilha' },
                    { type: 'arthur', label: 'Mentorado', desc: 'Empreendedor do Hub' }
                  ].map((item) => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setNewRoleType(item.type)}
                      className={`p-2.5 rounded-2xl border text-left transition cursor-pointer ${
                        newRoleType === item.type
                          ? 'border-[#004A8D] bg-blue-50/80 text-[#004A8D] ring-2 ring-[#004A8D]/20 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="font-bold text-xs block">{item.label}</span>
                      <span className="text-[10px] text-slate-500 block">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Cargo / Título Institucional</label>
                <input
                  type="text"
                  placeholder="Ex: Coordenador de Empreendedorismo ou Consultor"
                  value={newCargo}
                  onChange={(e) => setNewCargo(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:outline-none focus:border-[#004A8D]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">E-mail Institucional *</label>
                <input
                  type="email"
                  placeholder="Ex: usuario@sp.senac.br"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:outline-none focus:border-[#004A8D]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Senha Corporativa de Acesso *</label>
                <input
                  type="text"
                  placeholder="Senha de acesso"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:outline-none focus:border-[#004A8D]"
                />
                <p className="text-[10px] text-slate-400">Padrão sugerido: senac123</p>
              </div>

              {formError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-[#004A8D] hover:bg-[#00386B] text-white text-xs font-bold transition shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4 text-[#84BD00]" />
                  <span>Salvar Perfil</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
