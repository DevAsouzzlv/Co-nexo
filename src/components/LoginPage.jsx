// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  ArrowRight,
  AlertCircle,
  Building2,
  GraduationCap,
  UserCheck,
  BarChart3,
  CheckCircle2
} from 'lucide-react';
import { USER_PROFILES } from './LoginModal';
import logoConexo from '../assets/logo-conexo.png';

export default function LoginPage({ onLogin }) {
  const [selectedPersona, setSelectedPersona] = useState('max');
  const [credentials, setCredentials] = useState({ 
    username: 'max.operacao@sp.senac.br', 
    password: '••••••••' 
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectRole = (roleId) => {
    setSelectedPersona(roleId);
    setErrorMessage('');
    const emailPrefix = roleId === 'max' ? 'max.operacao' :
                         roleId === 'aline' ? 'aline.consultora' :
                         roleId === 'arthur' ? 'arthur.negocios' : 'regis.coordenacao';
    setCredentials((prev) => ({ 
      ...prev, 
      username: `${emailPrefix}@sp.senac.br`,
      password: '••••••••'
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!credentials.password || credentials.password.length < 3) {
      setErrorMessage('Por favor, informe a senha de acesso institucional.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(selectedPersona);
    }, 250);
  };

  const currentSelected = USER_PROFILES.find((p) => p.id === selectedPersona) || USER_PROFILES[0];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#EDF2F7] via-[#F4F6FA] to-[#E9EFF6] text-slate-800 flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Contêiner Principal - Design moderno, limpo e profissional */}
      <div className="w-full max-w-5xl bg-white rounded-[32px] border border-slate-200/90 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        
        {/* Painel Esquerdo Institucional - Azul SENAC Homologado */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#00386C] via-[#004A8D] to-[#00264A] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Efeitos de iluminação suaves */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#F29100]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white p-2 flex items-center justify-center shadow-md">
                <img 
                  src={logoConexo} 
                  alt="Co.Nexo SENAC" 
                  className="h-full w-auto object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black tracking-tight text-white">Co.Nexo</h1>
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-[#F29100] text-slate-950">
                    SENAC
                  </span>
                </div>
                <p className="text-xs text-blue-100 font-medium">Hub de Empreendedorismo</p>
              </div>
            </div>

            <div className="space-y-3 pt-3">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Portal Integrado de Consultoria & Gestão
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal">
                Plataforma oficial para recepção com turnos de 4h sem ociosidade, consultores com prontuário digital e empreendedores com plano de ação prático.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/15 space-y-2.5 text-xs text-blue-100">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#F29100] shrink-0" />
              <span>Ambiente institucional protegido e auditado</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#F29100] shrink-0" />
              <span>Padrão visual oficial SENAC São Paulo</span>
            </div>
          </div>
        </div>

        {/* Painel Direito - Seleção Clara de Perfil & Acesso */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#004A8D] bg-[#004A8D]/10 px-3 py-1 rounded-full border border-[#004A8D]/20">
                Acesso por Perfil
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 tracking-tight">
                Selecione o seu perfil de atuação
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Escolha o perfil para carregar as permissões e telas do seu módulo de trabalho.
              </p>
            </div>

            {/* Grid dos 4 Perfis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {USER_PROFILES.map((profile) => {
                const isSelected = selectedPersona === profile.id;
                const Icon = profile.icon;

                return (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => handleSelectRole(profile.id)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#004A8D] bg-blue-50/50 shadow-md ring-2 ring-[#004A8D]/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? 'bg-[#004A8D] text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{profile.nome}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isSelected ? 'bg-[#F29100] text-slate-950 font-black' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {profile.roleLabel}
                          </span>
                        </div>
                      </div>

                      <div className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#004A8D] text-white' : 'border border-slate-300'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {profile.descricao}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Campos de Login */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Identificação Institucional
                </label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/15 transition"
                  placeholder="usuario@sp.senac.br"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Senha Corporativa
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/15 transition"
                    placeholder="Digite sua senha"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Botão de Entrada */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-[#004A8D] hover:bg-[#00386C] active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-[#004A8D]/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isLoading ? 'Autenticando...' : `Acessar Painel como ${currentSelected.nome}`}</span>
              <ArrowRight className="w-4 h-4 text-[#F29100]" />
            </button>
          </form>

          {/* Rodapé do Login */}
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>SENAC São Paulo • Sistema de Gestão</span>
            <span>Versão 2.4 Homologada</span>
          </div>
        </div>
      </div>
    </div>
  );
}
