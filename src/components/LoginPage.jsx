// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  Building2, 
  GraduationCap, 
  UserCheck, 
  BarChart3, 
  Eye, 
  EyeOff, 
  RotateCcw,
  UserPlus,
  Trash2,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import logoConexo from '../assets/logo-conexo.png';
import { 
  getStoredAccounts, 
  addStoredAccount, 
  saveStoredAccounts,
  DEFAULT_ACCOUNTS 
} from '../services/storage';

export default function LoginPage({ onLogin, onResetClean, onResetDemo }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [accounts, setAccounts] = useState(() => getStoredAccounts());

  // Estado do formulário de login
  const [emailInput, setEmailInput] = useState('max.operacao@sp.senac.br');
  const [passwordInput, setPasswordInput] = useState('senac123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeAccount, setActiveAccount] = useState(() => accounts[0] || DEFAULT_ACCOUNTS[0]);

  // Estado do formulário de cadastro de novo perfil
  const [regNome, setRegNome] = useState('');
  const [regRoleType, setRegRoleType] = useState('max'); // 'max' | 'aline' | 'arthur' | 'regis'
  const [regCargo, setRegCargo] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regError, setRegError] = useState('');

  // Ícone correspondente ao perfil
  const getProfileIcon = (roleType) => {
    switch (roleType) {
      case 'max': return Building2;
      case 'aline': return GraduationCap;
      case 'arthur': return UserCheck;
      case 'regis': return BarChart3;
      default: return Building2;
    }
  };

  const getProfileGradient = (roleType) => {
    switch (roleType) {
      case 'max': return 'from-blue-600 to-indigo-700';
      case 'aline': return 'from-amber-500 to-orange-600';
      case 'arthur': return 'from-emerald-500 to-teal-700';
      case 'regis': return 'from-purple-600 to-violet-800';
      default: return 'from-blue-600 to-indigo-700';
    }
  };

  // Localiza perfil pelo e-mail
  const detectAccountByEmail = (email) => {
    const clean = email.toLowerCase().trim();
    if (!clean) return null;
    return accounts.find((acc) => 
      acc.email.toLowerCase() === clean || 
      (acc.aliases && acc.aliases.some(alias => clean.includes(alias)))
    );
  };

  const handleEmailChange = (val) => {
    setEmailInput(val);
    setErrorMessage('');
    const detected = detectAccountByEmail(val);
    if (detected) {
      setActiveAccount(detected);
    }
  };

  const handleSelectQuickAccount = (acc) => {
    setEmailInput(acc.email);
    setPasswordInput('senac123');
    setActiveAccount(acc);
    setErrorMessage('');
  };

  const handleDirectAccess = (acc) => {
    handleSelectQuickAccount(acc);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(acc.roleType || acc.id);
    }, 150);
  };

  const handleLoginSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    const cleanEmail = emailInput.trim();
    if (!cleanEmail) {
      setErrorMessage('Por favor, informe seu e-mail cadastrado.');
      return;
    }

    if (!passwordInput || passwordInput.length < 3) {
      setErrorMessage('A senha deve conter no mínimo 3 caracteres.');
      return;
    }

    const matchedAccount = detectAccountByEmail(cleanEmail);

    if (!matchedAccount) {
      setErrorMessage('E-mail não localizado na lista de contas. Cadastre um novo perfil ou selecione um abaixo.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(matchedAccount.roleType || matchedAccount.id);
    }, 200);
  };

  // Submissão do Cadastro de Novo Perfil
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regNome.trim() || regNome.trim().length < 3) {
      setRegError('Informe o nome completo (mínimo 3 caracteres).');
      return;
    }

    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegError('Informe um e-mail válido com @.');
      return;
    }

    if (!regPassword || regPassword.length < 3) {
      setRegError('A senha deve ter no mínimo 3 caracteres.');
      return;
    }

    // Verifica duplicação de e-mail
    if (accounts.some(a => a.email.toLowerCase() === regEmail.trim().toLowerCase())) {
      setRegError('Já existe um perfil cadastrado com este e-mail.');
      return;
    }

    const roleLabels = {
      max: 'Recepção',
      aline: 'Consultora',
      arthur: 'Mentorado',
      regis: 'Diretoria'
    };

    const newAccount = {
      id: `acc-${Date.now()}`,
      nome: regNome.trim(),
      cargo: regCargo.trim() || `${roleLabels[regRoleType]} do Hub`,
      roleLabel: roleLabels[regRoleType],
      roleType: regRoleType,
      email: regEmail.trim().toLowerCase(),
      badge: 'Perfil Cadastrado',
      gradient: getProfileGradient(regRoleType),
      color: '#004A8D',
      aliases: [regNome.toLowerCase().split(' ')[0]]
    };

    const updatedAccounts = addStoredAccount(newAccount);
    setAccounts(updatedAccounts);
    setActiveAccount(newAccount);
    setEmailInput(newAccount.email);
    setPasswordInput(regPassword);

    setRegSuccess(`✓ Perfil de ${newAccount.nome} cadastrado com sucesso!`);
    
    setTimeout(() => {
      onLogin(newAccount.roleType);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F7FB] text-slate-800 flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Luz ambiente suave Apple HIG */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#004A8D]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#F29100]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Cartão Central Apple HIG */}
      <div className="w-full max-w-xl bg-white/95 backdrop-blur-2xl rounded-[36px] border border-white/80 shadow-[0_20px_60px_-15px_rgba(0,40,90,0.08)] p-6 sm:p-9 relative z-10 space-y-5">
        
        {/* Topo: Marca Oficial co.nexo Senac */}
        <div className="text-center space-y-1.5 flex flex-col items-center">
          <div className="py-1 px-4 flex items-center justify-center">
            <img 
              src={logoConexo} 
              alt="co.nexo Senac" 
              className="h-14 sm:h-16 w-auto object-contain transition-transform hover:scale-105"
            />
          </div>
          <p className="text-xs text-slate-500 font-medium tracking-wide">
            Hub Integrado de Empreendedorismo & Gestão de Mentorias
          </p>
        </div>

        {/* Alternador de Abas Apple: Entrar ou Cadastrar Novo Perfil */}
        <div className="p-1 rounded-2xl bg-slate-100/80 border border-slate-200/80 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-[#004A8D]" />
            <span>Acessar Conta</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-[#F29100]" />
            <span>Cadastrar Perfil</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* ABA 1: LOGIN (ACESSAR CONTA COM PERFIS E CREDENCIAIS)           */}
        {/* ============================================================== */}
        {activeTab === 'login' && (
          <div className="space-y-4 animate-fade-in">
            {/* Seletor de Perfis Salvos no Sistema */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Selecione o Perfil ({accounts.length} cadastrados):
                </label>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-[10px] font-bold text-[#004A8D] hover:underline cursor-pointer"
                >
                  + Novo Perfil
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {accounts.map((acc) => {
                  const isSelected = activeAccount?.id === acc.id || activeAccount?.email === acc.email;
                  const Icon = getProfileIcon(acc.roleType);

                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleSelectQuickAccount(acc)}
                      onDoubleClick={() => handleDirectAccess(acc)}
                      className={`p-2.5 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between group relative ${
                        isSelected
                          ? 'bg-blue-50/80 border-[#004A8D] shadow-xs ring-2 ring-[#004A8D]/20'
                          : 'bg-slate-50/60 border-slate-200/80 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <div className={`h-7 w-7 rounded-xl flex items-center justify-center text-white shadow-xs bg-gradient-to-br ${acc.gradient || 'from-blue-600 to-indigo-700'}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#004A8D] ring-2 ring-blue-200" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block truncate leading-tight">
                          {acc.nome.split(' ')[0]}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium block truncate">
                          {acc.roleLabel}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Formulário de Login */}
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              {/* E-mail */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider px-1">
                  E-mail
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder="ex: usuario@sp.senac.br"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:outline-none focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/15 transition"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider px-1">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setErrorMessage('');
                    }}
                    placeholder="Digite sua senha"
                    className="w-full pl-10 pr-10 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:outline-none focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/15 transition"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Perfil Selecionado */}
              {activeAccount && (
                <div className="px-3.5 py-2 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-[#004A8D]">Perfil:</span>
                    <strong className="text-slate-900">{activeAccount.nome}</strong>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#004A8D] shadow-xs border border-blue-100">
                    {activeAccount.cargo}
                  </span>
                </div>
              )}

              {/* Erro */}
              {errorMessage && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Botão de Login */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#004A8D] to-[#00386C] hover:opacity-95 active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-[#004A8D]/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isLoading ? 'Acessando...' : `Entrar no Painel como ${activeAccount ? activeAccount.nome : 'Usuário'}`}</span>
                <ArrowRight className="w-4 h-4 text-[#F29100]" />
              </button>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* ABA 2: CADASTRO DE NOVO PERFIL / CONTA (CADASTRAR PERFIS)       */}
        {/* ============================================================== */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 animate-fade-in">
            <div className="px-1">
              <h3 className="text-sm font-black text-slate-900">Cadastrar Novo Perfil</h3>
              <p className="text-xs text-slate-500">Crie um usuário com permissões de acesso ao Hub</p>
            </div>

            {/* Nome Completo */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider px-1">
                Nome Completo *
              </label>
              <input
                type="text"
                placeholder="Ex: Gabriela Souza"
                value={regNome}
                onChange={(e) => setRegNome(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:outline-none focus:border-[#004A8D] transition"
              />
            </div>

            {/* Tipo de Função / Painel */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider px-1">
                Função de Acesso *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { type: 'max', label: 'Recepção', desc: 'Grade & Alunos' },
                  { type: 'aline', label: 'Consultora', desc: 'Diários & Trilha' },
                  { type: 'arthur', label: 'Mentorado', desc: 'Empreendedor' },
                  { type: 'regis', label: 'Diretoria', desc: 'Coordenação' }
                ].map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setRegRoleType(item.type)}
                    className={`p-2.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      regRoleType === item.type
                        ? 'border-[#004A8D] bg-blue-50/80 text-[#004A8D] ring-2 ring-[#004A8D]/20 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold block">{item.label}</span>
                    <span className="text-[10px] text-slate-500">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cargo / Empreendimento */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider px-1">
                Cargo / Empreendimento (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: Consultora de Marketing ou Salão Bella"
                value={regCargo}
                onChange={(e) => setRegCargo(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:outline-none focus:border-[#004A8D] transition"
              />
            </div>

            {/* E-mail e Senha */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider px-1">
                  E-mail *
                </label>
                <input
                  type="email"
                  placeholder="usuario@sp.senac.br"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:outline-none focus:border-[#004A8D] transition"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider px-1">
                  Senha *
                </label>
                <input
                  type="password"
                  placeholder="Mínimo 3 dígitos"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:outline-none focus:border-[#004A8D] transition"
                />
              </div>
            </div>

            {/* Erros e Sucessos */}
            {regError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            {regSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{regSuccess}</span>
              </div>
            )}

            {/* Botão de Cadastrar */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#F29100] hover:bg-[#E08500] active:scale-[0.99] text-slate-950 font-bold text-xs shadow-md shadow-[#F29100]/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Salvar Novo Perfil e Acessar Painel</span>
            </button>
          </form>
        )}

        {/* Rodapé: Reset do Banco & Gestão de Dados */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>SENAC Hub São Paulo</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Botão Reset Limpo do Zero */}
            <button
              type="button"
              onClick={() => {
                if (confirm('ATENÇÃO: Deseja ZERAR TODO o banco de dados (0 alunos/mentorados, 0 agendamentos)? Isso deixará o sistema 100% limpo para você cadastrar seus mentorados e perfis do zero.')) {
                  if (onResetClean) onResetClean();
                }
              }}
              className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 font-bold hover:underline cursor-pointer"
              title="Apaga todos os mentorados e agendamentos, deixando a base vazia"
            >
              <Trash2 className="w-3 h-3" />
              <span>Zerar Banco (0 Alunos)</span>
            </button>

            <span className="text-slate-300">•</span>

            {/* Botão Carregar Demo Oficial SENAC */}
            <button
              type="button"
              onClick={() => {
                if (confirm('Deseja carregar os dados de demonstração oficiais do SENAC (14 alunos, grade de 8h e diários preenchidos)?')) {
                  if (onResetDemo) onResetDemo();
                }
              }}
              className="inline-flex items-center gap-1 text-[#004A8D] hover:text-[#00386C] font-semibold hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Carregar Demo SENAC</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
