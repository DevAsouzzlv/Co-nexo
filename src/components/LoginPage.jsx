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
  Trash2 
} from 'lucide-react';
import logoConexo from '../assets/logo-conexo.png';
import { 
  getStoredAccounts, 
  DEFAULT_ACCOUNTS 
} from '../services/storage';

export default function LoginPage({ onLogin, onResetClean, onResetDemo }) {
  const [accounts] = useState(() => getStoredAccounts());

  // Estado do formulário de login (sem nenhum perfil pré-setado)
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
    );
  };

  const handleLoginSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    const cleanEmail = emailInput.trim();
    if (!cleanEmail) {
      setErrorMessage('Por favor, informe seu e-mail institucional.');
      return;
    }

    if (!passwordInput || passwordInput.length < 3) {
      setErrorMessage('A senha deve conter no mínimo 3 caracteres.');
      return;
    }

    const matchedAccount = detectAccountByEmail(cleanEmail);

    if (!matchedAccount) {
      setErrorMessage('Credenciais não localizadas. Solicite o cadastro do seu perfil à Coordenação Geral (Regis).');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(matchedAccount.roleType || matchedAccount.id);
    }, 200);
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F7FB] text-slate-800 flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Luz ambiente suave Apple HIG */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#004A8D]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#F29100]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Cartão Central Apple HIG */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-[36px] border border-white/80 shadow-[0_20px_60px_-15px_rgba(0,40,90,0.08)] p-7 sm:p-10 relative z-10 space-y-6">
        
        {/* Topo: Marca Oficial co.nexo Senac */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <div className="py-2 px-4 flex items-center justify-center">
            <img 
              src={logoConexo} 
              alt="co.nexo Senac" 
              className="h-16 w-auto object-contain transition-transform hover:scale-105"
            />
          </div>
          <p className="text-xs text-slate-500 font-medium tracking-wide">
            Hub Integrado de Empreendedorismo & Gestão de Mentorias
          </p>
        </div>

        {/* Formulário de Login Limpo (Apenas Credenciais) */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
          {/* E-mail */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
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
                className="w-full pl-10 pr-4 py-3 text-xs rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:outline-none focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/15 transition"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Senha */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
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
                className="w-full pl-10 pr-10 py-3 text-xs rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:outline-none focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/15 transition"
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

          {/* Erro */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Botão de Login */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#004A8D] to-[#00386C] hover:opacity-95 active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-[#004A8D]/20 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>{isLoading ? 'Autenticando...' : 'Acessar Sistema'}</span>
            <ArrowRight className="w-4 h-4 text-[#F29100]" />
          </button>
        </form>

        {/* Rodapé: Reset do Banco & Gestão de Dados */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>SENAC Hub São Paulo</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Botão Reset Limpo do Zero */}
            <button
              type="button"
              onClick={() => {
                if (confirm('ATENÇÃO: Deseja ZERAR TODO o banco de dados (0 alunos/mentorados, 0 agendamentos)? Isso deixará o sistema 100% limpo para cadastros do zero.')) {
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
                if (confirm('Deseja carregar os dados de demonstração oficiais do SENAC (14 alunos, grade de 8h com Aline e Laíse)?')) {
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
    </div>
  );
}
