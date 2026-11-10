// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Trash2,
  Sparkles,
  Building2,
  GraduationCap,
  UserCheck,
  BarChart3,
  HelpCircle,
  Zap
} from 'lucide-react';
import logoConexo from '../assets/logo-conexo.png';
import { 
  getStoredAccounts, 
  DEMO_ACCOUNTS,
  MASTER_ADMIN_ACCOUNT 
} from '../services/storage';
import BlindTestGuideModal from './BlindTestGuideModal';

export default function LoginPage({ onLogin, onResetClean, onResetDemo }) {
  const [accounts] = useState(() => getStoredAccounts());
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Estado do formulário de login
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Localiza perfil pelo e-mail
  const detectAccountByEmail = (email) => {
    const clean = email.toLowerCase().trim();
    if (!clean) return null;
    return accounts.find((acc) => 
      acc.email.toLowerCase() === clean || 
      (acc.aliases && acc.aliases.some(alias => clean.includes(alias)))
    ) || DEMO_ACCOUNTS.find((acc) =>
      acc.email.toLowerCase() === clean || 
      (acc.aliases && acc.aliases.some(alias => clean.includes(alias)))
    );
  };

  const handleLoginSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    const cleanEmail = emailInput.trim();
    if (!cleanEmail) {
      setErrorMessage('Por favor, informe seu e-mail institucional ou selecione um perfil de teste.');
      return;
    }

    if (!passwordInput || passwordInput.length < 3) {
      setErrorMessage('A senha deve conter no mínimo 3 caracteres (ex: senac123).');
      return;
    }

    const matchedAccount = detectAccountByEmail(cleanEmail);

    if (!matchedAccount) {
      setErrorMessage('Credenciais não localizadas. Utilize um dos atalhos de teste às cegas abaixo ou solicite cadastro à Coordenação.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(matchedAccount.roleType || matchedAccount.id, matchedAccount);
    }, 200);
  };

  const handleQuickFillAndLogin = (account) => {
    setEmailInput(account.email);
    setPasswordInput(account.password || (account.id === 'admin' ? 'admin123' : 'senac123'));
    setErrorMessage('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(account.roleType || account.id, account);
    }, 250);
  };

  // 5 Perfis Oficiais do SENAC Hub para Teste às Cegas
  const quickTestRoles = [
    {
      id: 'max',
      label: 'Recepção',
      nome: 'Max Ferreira',
      email: 'max.operacao@sp.senac.br',
      color: 'bg-blue-600 text-white',
      badge: 'Grade & Encaixes',
      icon: Building2
    },
    {
      id: 'aline',
      label: 'Consultora',
      nome: 'Aline Ferreira',
      email: 'aline.consultora@sp.senac.br',
      color: 'bg-amber-600 text-white',
      badge: 'Prontuário & Custos',
      icon: GraduationCap
    },
    {
      id: 'arthur',
      label: 'Mentorado',
      nome: 'Arthur Silva',
      email: 'arthur.silva@sp.senac.br',
      color: 'bg-emerald-600 text-white',
      badge: 'Tarefas & Anexos',
      icon: UserCheck
    },
    {
      id: 'regis',
      label: 'Coordenação',
      nome: 'Regis Moreira',
      email: 'regis.coordenacao@sp.senac.br',
      color: 'bg-purple-600 text-white',
      badge: 'Metas 8h & CSV',
      icon: BarChart3
    },
    {
      id: 'admin',
      label: 'Admin Supremo',
      nome: 'Admin Supremo',
      email: 'admin@conexo.senac.br',
      color: 'bg-slate-900 text-white',
      badge: 'Governança & TI',
      icon: ShieldCheck
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#F5F7FB] text-slate-800 flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Luz ambiente suave Apple HIG */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#004A8D]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#84BD00]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Cartão Central Apple HIG */}
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-[36px] border border-white/80 shadow-[0_20px_60px_-15px_rgba(0,40,90,0.08)] p-6 sm:p-8 relative z-10 space-y-5">
        
        {/* Topo: Marca Oficial co.nexo Senac */}
        <div className="text-center space-y-2 flex flex-col items-center">
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

        {/* Banner de Aviso: Teste às Cegas Habilitado */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-extrabold text-amber-950 uppercase tracking-wider text-[11px]">
              <Sparkles className="w-4 h-4 text-[#84BD00]" />
              <span>Aviso: Teste às Cegas Ativo</span>
            </div>
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#004A8D] hover:underline cursor-pointer bg-white px-2.5 py-1 rounded-full border border-blue-200 shadow-2xs"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#004A8D]" />
              <span>Ver Guia & Roteiro</span>
            </button>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Ambiente 100% interativo para avaliação. Escolha um dos perfis abaixo para <strong>entrar com 1 clique</strong> ou digite suas credenciais.
          </p>
        </div>

        {/* Seletor de Perfis para Teste às Cegas */}
        <div className="space-y-2 pt-1">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
            Acesso Rápido de Avaliação (1 Clique):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {quickTestRoles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleQuickFillAndLogin(role)}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-[#004A8D] bg-slate-50/70 hover:bg-blue-50/50 text-left transition flex flex-col justify-between group cursor-pointer active:scale-97 shadow-2xs"
                  title={`Acessar como ${role.nome} (${role.label})`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className={`p-1 rounded-lg ${role.color}`}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 group-hover:text-[#004A8D]">
                      Entrar →
                    </span>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-800 leading-tight">
                      {role.label}
                    </h4>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {role.nome.split(' ')[0]}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Divisor Visual */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider shrink-0">
            Ou acesse com credenciais
          </span>
        </div>

        {/* Formulário de Login com E-mail e Senha */}
        <form onSubmit={handleLoginSubmit} className="space-y-3.5">
          {/* E-mail */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider px-1">
              E-mail Institucional
            </label>
            <div className="relative">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="usuario@sp.senac.br"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:outline-none focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/15 transition"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Senha */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Senha Corporativa
              </label>
              <span className="text-[10px] text-slate-400">
                Padrão: <code className="font-mono text-[#004A8D]">senac123</code>
              </span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Digite sua senha"
                className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:outline-none focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/15 transition"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Erro */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Botão de Login */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#004A8D] to-[#00386C] hover:opacity-95 active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-[#004A8D]/20 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isLoading ? 'Autenticando...' : 'Acessar Painel'}</span>
            <ArrowRight className="w-4 h-4 text-[#84BD00]" />
          </button>
        </form>

        {/* Rodapé: Controles de Base */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>SENAC Hub São Paulo</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (confirm('ATENÇÃO: Deseja ZERAR TODO o banco de dados (0 alunos, 0 agendamentos)?')) {
                  if (onResetClean) onResetClean();
                }
              }}
              className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 font-bold hover:underline cursor-pointer"
              title="Apaga todos os dados para teste do zero"
            >
              <Trash2 className="w-3 h-3" />
              <span>Zerar Banco</span>
            </button>

            <span className="text-slate-300">•</span>

            <button
              type="button"
              onClick={() => {
                if (confirm('Deseja recarregar o banco de demonstração oficial do SENAC (14 alunos, grade de 8h)?')) {
                  if (onResetDemo) onResetDemo();
                }
              }}
              className="inline-flex items-center gap-1 text-[#004A8D] hover:text-[#00386C] font-semibold hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Carregar Demo</span>
            </button>
          </div>
        </div>

      </div>

      {/* Modal do Guia de Teste às Cegas */}
      <BlindTestGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        currentPersona="max"
        onSwitchPersona={(personaId) => {
          const acc = quickTestRoles.find(r => r.id === personaId) || quickTestRoles[0];
          handleQuickFillAndLogin(acc);
        }}
        onResetDemo={onResetDemo}
        onResetClean={onResetClean}
      />
    </div>
  );
}
