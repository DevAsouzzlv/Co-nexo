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
  RotateCcw 
} from 'lucide-react';
import logoConexo from '../assets/logo-conexo.png';

// Contas oficiais institucionais para acesso
const ACCOUNTS_DIRECTORY = [
  {
    id: 'max',
    nome: 'Max Ferreira',
    cargo: 'Recepção & Operação',
    roleLabel: 'Recepção',
    email: 'max.operacao@sp.senac.br',
    badge: 'Grade & Atendimentos',
    icon: Building2,
    gradient: 'from-blue-600 to-indigo-700',
    color: '#004A8D',
    aliases: ['max', 'max.operacao', 'max@senac.br', 'recepcao@sp.senac.br']
  },
  {
    id: 'aline',
    nome: 'Aline Ferreira',
    cargo: 'Consultora de Negócios',
    roleLabel: 'Consultora',
    email: 'aline.consultora@sp.senac.br',
    badge: 'Prontuário & Trilha',
    icon: GraduationCap,
    gradient: 'from-amber-500 to-orange-600',
    color: '#F29100',
    aliases: ['aline', 'aline.consultora', 'aline@senac.br', 'consultoria@sp.senac.br', 'jamile', 'jamile.consultora', 'jamile@senac.br']
  },
  {
    id: 'arthur',
    nome: 'Arthur Silva',
    cargo: 'Empreendedor (Tempero)',
    roleLabel: 'Mentorado',
    email: 'arthur.silva@sp.senac.br',
    badge: 'Portal do Aluno',
    icon: UserCheck,
    gradient: 'from-emerald-500 to-teal-700',
    color: '#10B981',
    aliases: ['arthur', 'arthur.silva', 'arthur@tempero.com', 'arthur@senac.br', 'tempero']
  },
  {
    id: 'regis',
    nome: 'Regis Moreira',
    cargo: 'Coordenação Geral',
    roleLabel: 'Diretoria',
    email: 'regis.coordenacao@sp.senac.br',
    badge: 'Auditoria & Contas',
    icon: BarChart3,
    gradient: 'from-purple-600 to-violet-800',
    color: '#7C3AED',
    aliases: ['regis', 'regis.coordenacao', 'regis@senac.br', 'diretoria@sp.senac.br']
  }
];

export default function LoginPage({ onLogin, onResetData }) {
  const [emailInput, setEmailInput] = useState('max.operacao@sp.senac.br');
  const [passwordInput, setPasswordInput] = useState('senac123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeAccount, setActiveAccount] = useState(ACCOUNTS_DIRECTORY[0]);

  // Atualiza o perfil ativo detectado conforme o e-mail digitado
  const detectAccountByEmail = (email) => {
    const clean = email.toLowerCase().trim();
    if (!clean) return null;
    return ACCOUNTS_DIRECTORY.find((acc) => 
      acc.email.toLowerCase() === clean || 
      acc.aliases.some(alias => clean.includes(alias))
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

  // Preenchimento rápido ao clicar em uma das contas demonstrativas
  const handleSelectQuickAccount = (acc) => {
    setEmailInput(acc.email);
    setPasswordInput('senac123');
    setActiveAccount(acc);
    setErrorMessage('');
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    const cleanEmail = emailInput.trim();
    if (!cleanEmail) {
      setErrorMessage('Por favor, informe seu e-mail institucional.');
      return;
    }

    if (!passwordInput || passwordInput.length < 3) {
      setErrorMessage('A senha corporativa deve conter no mínimo 3 caracteres.');
      return;
    }

    const matchedAccount = detectAccountByEmail(cleanEmail);

    if (!matchedAccount) {
      setErrorMessage('E-mail institucional não localizado. Escolha um dos perfis oficiais abaixo.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(matchedAccount.id);
    }, 200);
  };

  // Acesso direto com 1 clique (ex: duplo-clique no card do perfil)
  const handleDirectAccess = (acc) => {
    handleSelectQuickAccount(acc);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(acc.id);
    }, 150);
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F7FB] text-slate-800 flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Luz ambiente suave estilo Apple macOS */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#004A8D]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#F29100]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Cartão Central Apple HIG Unificado */}
      <div className="w-full max-w-xl bg-white/95 backdrop-blur-2xl rounded-[36px] border border-white/80 shadow-[0_20px_60px_-15px_rgba(0,40,90,0.08)] p-6 sm:p-9 relative z-10 space-y-6">
        
        {/* Topo: Marca & Identidade Co.Nexo SENAC */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-white shadow-sm border border-slate-100 mb-1">
            <img 
              src={logoConexo} 
              alt="Co.Nexo SENAC" 
              className="h-12 w-auto object-contain"
            />
          </div>
          <div>
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-slate-900">Co.Nexo</h1>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F29100] text-slate-950 shadow-xs">
                SENAC
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Hub Integrado de Empreendedorismo & Mentorias
            </p>
          </div>
        </div>

        {/* Seletor de Perfis macOS Style (Squircle Avatars) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Selecione o Perfil de Atuação:
            </label>
            <span className="text-[10px] font-semibold text-[#004A8D] bg-blue-50 px-2 py-0.5 rounded-full">
              4 Perfis Homologados
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {ACCOUNTS_DIRECTORY.map((acc) => {
              const isSelected = activeAccount?.id === acc.id;
              const Icon = acc.icon;

              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleSelectQuickAccount(acc)}
                  onDoubleClick={() => handleDirectAccess(acc)}
                  className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group relative ${
                    isSelected
                      ? 'bg-blue-50/80 border-[#004A8D] shadow-sm ring-2 ring-[#004A8D]/20'
                      : 'bg-slate-50/60 border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105 bg-gradient-to-br ${acc.gradient}`}>
                      <Icon className="w-4 h-4" />
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

        {/* Formulário de Login Apple-Style */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Campo E-mail */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider px-1">
              E-mail Institucional
            </label>
            <div className="relative">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="nome.sobrenome@sp.senac.br"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/15 transition"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Campo Senha */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider px-1">
              Senha Corporativa
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
                className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/15 transition"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Perfil Selecionado Informações */}
          {activeAccount && (
            <div className="px-3.5 py-2.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-[#004A8D]">Acessando como:</span>
                <strong className="text-slate-900">{activeAccount.nome}</strong>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#004A8D] shadow-xs border border-blue-100">
                {activeAccount.cargo}
              </span>
            </div>
          )}

          {/* Erro de Validação */}
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Botão de Ação Principal */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#004A8D] to-[#00386C] hover:opacity-95 active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-[#004A8D]/20 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isLoading ? 'Conectando...' : `Acessar Painel como ${activeAccount ? activeAccount.nome : 'Usuário'}`}</span>
            <ArrowRight className="w-4 h-4 text-[#F29100]" />
          </button>
        </form>

        {/* Rodapé Apple Clean com Reset */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>SENAC Hub São Paulo</span>
          </div>

          {onResetData && (
            <button
              type="button"
              onClick={() => {
                if (confirm('Deseja resetar todos os perfis e dados locais para o estado inicial de fábrica?')) {
                  onResetData();
                }
              }}
              className="inline-flex items-center gap-1 text-[#004A8D] hover:text-[#00386C] font-semibold hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restaurar Banco Local</span>
            </button>
          )}

          <span>v2.5</span>
        </div>

      </div>
    </div>
  );
}
