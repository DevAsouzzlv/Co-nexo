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
  ChevronRight
} from 'lucide-react';
import { 
  getStoredAccounts, 
  saveStoredAccounts, 
  addStoredAccount,
  MASTER_ADMIN_ACCOUNT,
  DEFAULT_ACCOUNTS
} from '../services/storage';

export default function AdminCleanView({
  students = [],
  consultors = [],
  appointments = [],
  onResetClean,
  onResetDemo,
  onExportBackup,
  currentTab = 'usuarios',
  setCurrentTab
}) {
  const [accounts, setAccounts] = useState(() => getStoredAccounts());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newNome, setNewNome] = useState('');
  const [newRoleType, setNewRoleType] = useState('regis'); // Padrão 'regis' para provisionar coordenação
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

  // Criação de perfil manual
  const handleCreateAccount = (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    if (!newNome.trim() || newNome.trim().length < 3) {
      setFormError('Informe o nome completo (mínimo 3 caracteres).');
      return;
    }

    if (!newEmail.trim() || !newEmail.includes('@')) {
      setFormError('Informe um e-mail institucional válido.');
      return;
    }

    if (!newPassword || newPassword.length < 3) {
      setFormError('A senha corporativa deve conter no mínimo 3 dígitos.');
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
      color: newRoleType === 'regis' ? '#7C3AED' : newRoleType === 'max' ? '#004A8D' : newRoleType === 'aline' ? '#F29100' : '#10B981',
      aliases: [newNome.trim().toLowerCase().split(' ')[0], newEmail.trim().toLowerCase()]
    };

    const updated = addStoredAccount(newAcc);
    setAccounts(updated);
    setSuccessMsg(`✓ Perfil de ${newNome} criado com sucesso!`);
    
    // Limpa formulário
    setNewNome('');
    setNewCargo('');
    setNewEmail('');
    setNewPassword('senac123');

    setTimeout(() => {
      setIsModalOpen(false);
      setSuccessMsg('');
    }, 1200);
  };

  // Provisionamento Rápido em 1 Clique da Coordenação Geral (Regis)
  const handleProvisionRegis = () => {
    if (accounts.some(a => a.id === 'regis' || a.email === 'regis.coordenacao@sp.senac.br')) {
      alert('O perfil de Coordenação Geral (Regis Moreira) já está ativo no sistema.');
      return;
    }
    const regisAcc = {
      id: 'regis',
      nome: 'Regis Moreira',
      cargo: 'Coordenação Geral SENAC Hub',
      roleLabel: 'Diretoria',
      roleType: 'regis',
      email: 'regis.coordenacao@sp.senac.br',
      password: 'senac123',
      badge: 'Auditoria & Contas',
      gradient: 'from-purple-600 to-violet-800',
      color: '#7C3AED',
      aliases: ['regis', 'regis.coordenacao', 'regis@senac.br', 'diretoria@sp.senac.br']
    };
    const updated = addStoredAccount(regisAcc);
    setAccounts(updated);
    alert('✓ Perfil de Coordenação Geral (Regis Moreira) provisionado com sucesso!\n\nAgora o Coordenador Regis pode acessar o sistema com:\nE-mail: regis.coordenacao@sp.senac.br\nSenha: senac123\ne criar/gerenciar as outras contas do Hub.');
  };

  // Provisionamento Rápido em 1 Clique da Recepção (Max)
  const handleProvisionMax = () => {
    if (accounts.some(a => a.id === 'max' || a.email === 'max.operacao@sp.senac.br')) {
      alert('O perfil de Recepção (Max Ferreira) já está ativo.');
      return;
    }
    const maxAcc = {
      id: 'max',
      nome: 'Max Ferreira',
      cargo: 'Recepção & Operação do Hub',
      roleLabel: 'Recepção',
      roleType: 'max',
      email: 'max.operacao@sp.senac.br',
      password: 'senac123',
      badge: 'Grade & Atendimentos',
      gradient: 'from-blue-600 to-indigo-700',
      color: '#004A8D',
      aliases: ['max', 'max.operacao', 'max@senac.br', 'recepcao@sp.senac.br']
    };
    const updated = addStoredAccount(maxAcc);
    setAccounts(updated);
    alert('✓ Perfil de Recepção (Max Ferreira) provisionado com sucesso!\n\nE-mail: max.operacao@sp.senac.br\nSenha: senac123');
  };

  // Provisionamento Rápido das Consultoras (Aline & Laíse)
  const handleProvisionConsultorias = () => {
    let added = 0;
    let updated = [...accounts];

    if (!updated.some(a => a.email === 'aline.consultora@sp.senac.br')) {
      const aline = {
        id: 'aline',
        nome: 'Aline Ferreira',
        cargo: 'Consultora de Negócios (Manhã 08h-12h)',
        roleLabel: 'Consultora',
        roleType: 'aline',
        email: 'aline.consultora@sp.senac.br',
        password: 'senac123',
        badge: 'Turno Matutino 4h',
        gradient: 'from-amber-500 to-orange-600',
        color: '#F29100',
        aliases: ['aline', 'aline.consultora', 'aline@senac.br']
      };
      updated = addStoredAccount(aline);
      added++;
    }

    if (!updated.some(a => a.email === 'laise.consultora@sp.senac.br')) {
      const laise = {
        id: 'laise',
        nome: 'Laíse Mendes',
        cargo: 'Consultora de Negócios (Tarde/Noite 14h-18h)',
        roleLabel: 'Consultora',
        roleType: 'aline',
        email: 'laise.consultora@sp.senac.br',
        password: 'senac123',
        badge: 'Turno Vespertino 4h',
        gradient: 'from-amber-600 to-orange-700',
        color: '#EA580C',
        aliases: ['laise', 'laise.consultora', 'laise@senac.br']
      };
      updated = addStoredAccount(laise);
      added++;
    }

    setAccounts(updated);
    if (added > 0) {
      alert(`✓ ${added} perfis de consultoras adicionados (Aline Ferreira 08h-12h e Laíse Mendes 14h-18h)!`);
    } else {
      alert('As consultoras Aline e Laíse já estão ativas no sistema.');
    }
  };

  // Provisionamento Rápido do Mentorado Arthur
  const handleProvisionArthur = () => {
    if (accounts.some(a => a.email === 'arthur.silva@sp.senac.br')) {
      alert('O perfil de Mentorado (Arthur Silva) já está ativo.');
      return;
    }
    const arthur = {
      id: 'arthur',
      nome: 'Arthur Silva',
      cargo: 'Empreendedor (Tempero do Arthur)',
      roleLabel: 'Mentorado',
      roleType: 'arthur',
      email: 'arthur.silva@sp.senac.br',
      password: 'senac123',
      badge: 'Portal do Aluno',
      gradient: 'from-emerald-500 to-teal-700',
      color: '#10B981',
      aliases: ['arthur', 'arthur.silva', 'arthur@tempero.com']
    };
    const updated = addStoredAccount(arthur);
    setAccounts(updated);
    alert('✓ Perfil de Mentorado (Arthur Silva) provisionado com sucesso!\n\nE-mail: arthur.silva@sp.senac.br\nSenha: senac123');
  };

  // Excluir Perfil (exceto o próprio Admin Supremo)
  const handleDeleteAccount = (accId) => {
    if (accId === 'admin' || accId === 'super-admin') {
      alert('O perfil do Admin Supremo é a raiz do sistema e não pode ser excluído.');
      return;
    }
    const target = accounts.find(a => a.id === accId || a.email === accId);
    if (confirm(`Deseja realmente remover o perfil de ${target?.nome || 'usuário'}?`)) {
      const updated = accounts.filter(a => a.id !== accId && a.email !== accId);
      setAccounts(updated);
      saveStoredAccounts(updated);
    }
  };

  const hasRegis = accounts.some(a => a.roleType === 'regis' && a.id !== 'admin' && a.id !== 'super-admin');

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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner Principal do Admin Supremo com Estilo Apple */}
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-blue-100 border border-white/20 inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F29100]" />
              Painel do Admin Supremo • Acesso Raiz Master
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
              Controle Total & TI
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Centro de Governança & Gestão de Perfis
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/80 max-w-2xl font-normal leading-relaxed">
            Como <strong>Admin Supremo</strong>, seu papel principal é <strong>provisionar o perfil de Coordenação Geral (Regis)</strong>, que gerencia os turnos e cadastra a equipe no dia a dia, e manter a governança dos dados do Hub.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-[#F29100] hover:bg-[#E08500] active:scale-95 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#F29100]/25 transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Cadastrar Novo Perfil</span>
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
          {/* Card Destaque: Provisionamento em 1-Clique */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F29100]" />
                <h3 className="text-base font-black text-slate-900">
                  Provisionamento Rápido em 1-Clique
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">Ativação instantânea com e-mail institucional</span>
            </div>

            <p className="text-xs text-slate-500">
              O fluxo oficial começa criando o perfil da <strong>Coordenação Geral (Regis)</strong>, que ganha autonomia para gerenciar a Recepção e as Consultorias.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {/* Regis */}
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                      Diretoria
                    </span>
                    {hasRegis ? (
                      <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Ativo
                      </span>
                    ) : (
                      <span className="text-amber-600 text-xs font-bold">Pendente</span>
                    )}
                  </div>
                  <h4 className="text-sm font-black text-purple-950 mt-2">Coordenação Geral</h4>
                  <p className="text-xs text-purple-800 font-medium">Regis Moreira</p>
                  <p className="text-[10px] text-purple-600 font-mono mt-0.5">regis.coordenacao@sp.senac.br</p>
                </div>
                <button
                  onClick={handleProvisionRegis}
                  disabled={hasRegis}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    hasRegis
                      ? 'bg-purple-100 text-purple-400 cursor-not-allowed'
                      : 'bg-purple-700 hover:bg-purple-800 text-white shadow-xs'
                  }`}
                >
                  {hasRegis ? '✓ Coordenação Ativa' : '+ Ativar Regis'}
                </button>
              </div>

              {/* Max */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#004A8D] bg-blue-100 px-2 py-0.5 rounded-md">
                      Recepção
                    </span>
                    {accounts.some(a => a.email === 'max.operacao@sp.senac.br') ? (
                      <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Ativo
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs font-bold">Não criado</span>
                    )}
                  </div>
                  <h4 className="text-sm font-black text-slate-900 mt-2">Recepção & Grade</h4>
                  <p className="text-xs text-slate-700 font-medium">Max Ferreira</p>
                  <p className="text-[10px] text-blue-600 font-mono mt-0.5">max.operacao@sp.senac.br</p>
                </div>
                <button
                  onClick={handleProvisionMax}
                  disabled={accounts.some(a => a.email === 'max.operacao@sp.senac.br')}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    accounts.some(a => a.email === 'max.operacao@sp.senac.br')
                      ? 'bg-blue-100 text-blue-400 cursor-not-allowed'
                      : 'bg-[#004A8D] hover:bg-[#00386B] text-white shadow-xs'
                  }`}
                >
                  {accounts.some(a => a.email === 'max.operacao@sp.senac.br') ? '✓ Recepção Ativa' : '+ Ativar Max'}
                </button>
              </div>

              {/* Consultorias */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                      Docência 8h
                    </span>
                    {accounts.some(a => a.email === 'aline.consultora@sp.senac.br') && accounts.some(a => a.email === 'laise.consultora@sp.senac.br') ? (
                      <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Ativas
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs font-bold">Incompleto</span>
                    )}
                  </div>
                  <h4 className="text-sm font-black text-slate-900 mt-2">Consultorias SENAC</h4>
                  <p className="text-xs text-slate-700 font-medium">Aline (Manhã) & Laíse (Tarde)</p>
                  <p className="text-[10px] text-amber-700 font-mono mt-0.5">4h Manhã + 4h Tarde/Noite</p>
                </div>
                <button
                  onClick={handleProvisionConsultorias}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-[#F29100] hover:bg-[#E08500] text-slate-950 transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  + Ativar Aline & Laíse
                </button>
              </div>

              {/* Arthur */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Empreendedor
                    </span>
                    {accounts.some(a => a.email === 'arthur.silva@sp.senac.br') ? (
                      <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Ativo
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs font-bold">Não criado</span>
                    )}
                  </div>
                  <h4 className="text-sm font-black text-slate-900 mt-2">Mentorado Exemplo</h4>
                  <p className="text-xs text-slate-700 font-medium">Arthur Silva (Tempero)</p>
                  <p className="text-[10px] text-emerald-700 font-mono mt-0.5">arthur.silva@sp.senac.br</p>
                </div>
                <button
                  onClick={handleProvisionArthur}
                  disabled={accounts.some(a => a.email === 'arthur.silva@sp.senac.br')}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    accounts.some(a => a.email === 'arthur.silva@sp.senac.br')
                      ? 'bg-emerald-100 text-emerald-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  }`}
                >
                  {accounts.some(a => a.email === 'arthur.silva@sp.senac.br') ? '✓ Mentorado Ativo' : '+ Ativar Arthur'}
                </button>
              </div>
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
                  onClick={() => setIsModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#004A8D] hover:bg-[#00386B] text-white text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#F29100]" />
                  <span>Novo Perfil</span>
                </button>
              </div>
            </div>

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
                <Clock className="w-5 h-5 text-[#F29100]" />
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
                  A consultora <strong>Aline Ferreira</strong> atua das <strong>08:00 às 12:00</strong> (manhã) e a consultora <strong>Laíse Mendes</strong> atua das <strong>14:00 às 18:00</strong> (tarde e início da noite).
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
                    <DownloadCloud className="w-4 h-4 text-[#F29100]" />
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
                    if (confirm('Deseja restaurar a base oficial de demonstração do SENAC (14 alunos, grade 8h com Aline e Laíse)?')) {
                      if (onResetDemo) onResetDemo();
                    }
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-between transition cursor-pointer border border-slate-200"
                >
                  <span className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-slate-500" />
                    Restaurar Demonstração SENAC Completa (14 Alunos)
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
                  <span className="text-slate-500 block text-[11px]">Consultoras Ativas</span>
                  <span className="text-xl font-black text-slate-900 mt-1 block">{consultors.length || 2}</span>
                  <span className="text-[10px] text-amber-600 font-semibold">Aline & Laíse</span>
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

      {/* Modal de Cadastro de Novo Perfil */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-slide-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#F29100] text-slate-950 flex items-center justify-center font-bold">
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
                <label className="block text-xs font-bold text-slate-700">Nome Completo *</label>
                <input
                  type="text"
                  placeholder="Ex: Regis Moreira ou Carlos Lima"
                  value={newNome}
                  onChange={(e) => setNewNome(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:outline-none focus:border-[#004A8D]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Papel / Função no Hub *</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { type: 'regis', label: 'Coordenação', desc: 'Gerencia o Hub' },
                    { type: 'max', label: 'Recepção', desc: 'Grade & Alunos' },
                    { type: 'aline', label: 'Consultoria', desc: 'Aline & Laíse' },
                    { type: 'arthur', label: 'Mentorado', desc: 'Empreendedor' }
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
                <label className="block text-xs font-bold text-slate-700">Cargo / Título Oficial</label>
                <input
                  type="text"
                  placeholder="Ex: Coordenador de Empreendedorismo"
                  value={newCargo}
                  onChange={(e) => setNewCargo(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:outline-none focus:border-[#004A8D]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">E-mail Institucional *</label>
                <input
                  type="email"
                  placeholder="Ex: regis.coordenacao@sp.senac.br"
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
                  <UserPlus className="w-4 h-4 text-[#F29100]" />
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
