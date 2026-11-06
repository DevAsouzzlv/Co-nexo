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
  CheckCircle2,
  KeyRound,
  Sparkles
} from 'lucide-react';
import logoConexo from '../assets/logo-conexo.png';

// Contas oficiais institucionais para acesso
export const ACCOUNTS_DIRECTORY = [
  {
    id: 'max',
    nome: 'Max Ferreira',
    cargo: 'Recepção & Operação do Hub',
    roleLabel: 'Recepção',
    email: 'max.operacao@sp.senac.br',
    badge: 'Grade & Atendimentos',
    icon: Building2,
    aliases: ['max', 'max.operacao', 'max@senac.br', 'recepcao@sp.senac.br']
  },
  {
    id: 'aline',
    nome: 'Aline Ferreira',
    cargo: 'Consultora de Negócios & Finanças',
    roleLabel: 'Consultora',
    email: 'aline.consultora@sp.senac.br',
    badge: 'Prontuário & Trilha',
    icon: GraduationCap,
    aliases: ['aline', 'aline.consultora', 'aline@senac.br', 'consultoria@sp.senac.br']
  },
  {
    id: 'arthur',
    nome: 'Arthur Silva',
    cargo: 'Empreendedor (Tempero do Arthur)',
    roleLabel: 'Mentorado',
    email: 'arthur.silva@sp.senac.br',
    badge: 'Portal do Empreendedor',
    icon: UserCheck,
    aliases: ['arthur', 'arthur.silva', 'arthur@tempero.com', 'arthur@senac.br', 'tempero']
  },
  {
    id: 'regis',
    nome: 'Regis Moreira',
    cargo: 'Coordenação Geral SENAC Hub',
    roleLabel: 'Diretoria',
    email: 'regis.coordenacao@sp.senac.br',
    badge: 'Prestação de Contas',
    icon: BarChart3,
    aliases: ['regis', 'regis.coordenacao', 'regis@senac.br', 'diretoria@sp.senac.br']
  }
];

export default function LoginPage({ onLogin }) {
  const [emailInput, setEmailInput] = useState('max.operacao@sp.senac.br');
  const [passwordInput, setPasswordInput] = useState('senac123');
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
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = emailInput.trim();
    if (!cleanEmail) {
      setErrorMessage('Por favor, digite seu e-mail institucional.');
      return;
    }

    if (!passwordInput || passwordInput.length < 3) {
      setErrorMessage('A senha deve conter no mínimo 3 caracteres.');
      return;
    }

    // Valida se o e-mail corresponde a um perfil cadastrado
    const matchedAccount = detectAccountByEmail(cleanEmail);

    if (!matchedAccount) {
      setErrorMessage('E-mail institucional não cadastrado. Utilize um dos e-mails listados nas contas de demonstração.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(matchedAccount.id);
    }, 250);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#EBF1F8] via-[#F4F7FB] to-[#E5EDF6] text-slate-800 flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Contêiner Principal Super Arredondado (Design Redondo & Clean) */}
      <div className="w-full max-w-5xl bg-white rounded-[36px] border border-slate-200/90 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        
        {/* Painel Esquerdo Institucional - Azul SENAC Homologado */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#00386C] via-[#004A8D] to-[#00264A] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Efeitos de iluminação suaves */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#F29100]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-3xl bg-white p-2.5 flex items-center justify-center shadow-lg">
                <img 
                  src={logoConexo} 
                  alt="Co.Nexo SENAC" 
                  className="h-full w-auto object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight text-white">Co.Nexo</h1>
                  <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-[#F29100] text-slate-950 shadow-xs">
                    SENAC
                  </span>
                </div>
                <p className="text-xs text-blue-100 font-medium">Hub de Empreendedorismo</p>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/15 text-blue-100 border border-white/20 inline-block">
                Acesso Autenticado
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                Portal Integrado de Mentorias & Gestão
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal">
                Faça login com seu <strong>e-mail institucional</strong> e <strong>senha corporativa</strong> para carregar o seu painel de trabalho com regras de negócio 100% integradas.
              </p>
            </div>
          </div>

          {/* Destaques Institucionais Redondos */}
          <div className="relative z-10 pt-8 border-t border-white/15 space-y-3 text-xs text-blue-100">
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-6 rounded-full bg-[#F29100]/20 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F29100]" />
              </div>
              <span>Sessão corporativa segura com controle de acesso por papel</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-6 rounded-full bg-[#F29100]/20 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#F29100]" />
              </div>
              <span>Padrão visual homologado SENAC São Paulo</span>
            </div>
          </div>
        </div>

        {/* Painel Direito - Formulário Real de E-mail & Senha */}
        <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-between bg-white">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#004A8D] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Login por Credenciais
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 tracking-tight">
                Entrar com E-mail e Senha
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Digite suas credenciais institucionais ou clique em uma das contas demonstrativas abaixo.
              </p>
            </div>

            {/* Atalhos Rápidos das 4 Contas (Preenchimento em 1 Clique) */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Contas do Sistema (Clique para Preencher Automaticamente):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ACCOUNTS_DIRECTORY.map((acc) => {
                  const isCur = activeAccount?.id === acc.id;
                  const Icon = acc.icon;

                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleSelectQuickAccount(acc)}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isCur
                          ? 'border-[#004A8D] bg-blue-50/70 text-[#004A8D] ring-2 ring-[#004A8D]/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <Icon className={`w-4 h-4 ${isCur ? 'text-[#F29100]' : 'text-slate-400'}`} />
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${
                          isCur ? 'bg-[#004A8D] text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {acc.roleLabel}
                        </span>
                      </div>
                      <span className="text-xs font-bold truncate block">{acc.nome.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Formulário Real */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  E-mail Institucional
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={emailInput}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder="ex: max.operacao@sp.senac.br"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/20 transition"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Senha de Acesso
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setErrorMessage('');
                    }}
                    placeholder="Digite sua senha"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/20 transition"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Indicador do Perfil Detectado */}
              {activeAccount && (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs animate-fade-in">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Perfil Detectado:</span>
                    <strong className="text-[#004A8D]">{activeAccount.nome}</strong>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#F29100]/20 text-[#9A5B00]">
                    {activeAccount.cargo}
                  </span>
                </div>
              )}

              {/* Mensagem de Erro */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Botão de Envio Principal Super Arredondado */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-[#004A8D] hover:bg-[#00386C] active:scale-[0.99] text-white font-black text-xs shadow-md shadow-[#004A8D]/25 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{isLoading ? 'Autenticando...' : `Acessar Painel como ${activeAccount ? activeAccount.nome : 'Usuário'}`}</span>
                <ArrowRight className="w-4 h-4 text-[#F29100]" />
              </button>
            </form>
          </div>

          {/* Rodapé */}
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>SENAC São Paulo • Hub Empreendedor</span>
            <span>Versão 2.5 Homologada</span>
          </div>
        </div>
      </div>
    </div>
  );
}
