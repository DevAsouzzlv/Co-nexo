// src/components/TopNavbar.jsx
import React from 'react';
import { 
  RotateCcw, 
  DownloadCloud, 
  LogOut, 
  ShieldCheck,
  Calendar,
  Sparkles,
  Search,
  Bell
} from 'lucide-react';
import { USER_PROFILES } from './LoginModal';

export default function TopNavbar({
  currentPersona,
  onLogout,
  onResetData,
  onExportBackup
}) {
  const currentProfile = USER_PROFILES.find((p) => p.id === currentPersona) || USER_PROFILES[0];
  const today = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short' 
  });

  return (
    <header className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Título & Boas-Vindas Dinâmico */}
      <div className="flex items-center gap-3">
        <div className="lg:hidden h-10 w-10 rounded-2xl bg-[#004A8D] text-white flex items-center justify-center font-black text-sm shadow-sm">
          CN
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Olá, {currentProfile.nome.split(' ')[0]}</span>
              <span className="text-xl">👋</span>
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F29100]/15 text-[#C87500] border border-[#F29100]/30">
              <Sparkles className="w-3 h-3 text-[#F29100]" />
              {today}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Painel da {currentProfile.roleLabel}: {currentProfile.cargo} • SENAC Hub
          </p>
        </div>
      </div>

      {/* Ações Direitas */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Badge do Perfil Logado com Azul SENAC */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#004A8D]/10 border border-[#004A8D]/20 text-[#004A8D] text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-[#004A8D]" />
          <span>{currentProfile.nome}</span>
          <span className="bg-[#004A8D] text-white text-[10px] px-2 py-0.5 rounded-full font-extrabold shadow-2xs">
            {currentProfile.badge}
          </span>
        </div>

        {/* Backup */}
        <button
          onClick={onExportBackup}
          title="Backup de Dados JSON"
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-2xl border border-slate-200/80 transition cursor-pointer"
        >
          <DownloadCloud className="w-4 h-4" />
        </button>

        {/* Resetar Demo */}
        <button
          onClick={onResetData}
          title="Restaurar dados iniciais para demonstração"
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl border border-slate-200/80 transition cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Botão Sair / Logout */}
        <button
          onClick={onLogout}
          title="Fazer logout e voltar para a tela de login"
          className="px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-2xl transition cursor-pointer flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sair</span>
        </button>
      </div>
    </header>
  );
}
