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
  Bell,
  Clock,
  Zap
} from 'lucide-react';
import { getStoredAccounts, DEFAULT_ACCOUNTS } from '../services/storage';

export default function TopNavbar({
  currentPersona,
  currentUser,
  onLogout,
  onResetData,
  onExportBackup,
  onOpenBlindTestGuide
}) {
  const accounts = getStoredAccounts();
  const currentProfile = currentUser || 
    accounts.find((p) => p.id === currentPersona || p.roleType === currentPersona) || 
    DEFAULT_ACCOUNTS.find((p) => p.id === currentPersona || p.roleType === currentPersona) || 
    accounts[0] || DEFAULT_ACCOUNTS[0];
  const today = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'short' 
  });

  return (
    <header className="apple-glass rounded-[28px] p-3.5 sm:p-4 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-white/80 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-4 z-20 transition-all">
      {/* Título & Boas-Vindas Estilo Apple HIG */}
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-gradient-to-b from-[#0055A5] to-[#004A8D] text-white flex items-center justify-center font-black text-xs shadow-md shadow-[#004A8D]/20 shrink-0">
          {currentProfile.nome.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-xl font-bold text-[#1D1D1F] tracking-tight flex items-center gap-1.5">
              <span>Olá, {currentProfile.nome.split(' ')[0]}</span>
              <span className="text-base">👋</span>
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-black/[0.04] text-[#86868B]">
              <Sparkles className="w-3 h-3 text-[#F29100]" />
              <span className="capitalize">{today}</span>
            </span>
          </div>
          <p className="text-xs text-[#86868B] font-medium">
            {currentProfile.roleLabel}: {currentProfile.cargo} • Co.Nexo Hub SENAC
          </p>
        </div>
      </div>

      {/* Dynamic Pill Central / Direita: Status da Governança de 8 Horas */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Dynamic Island Style Capsule: 8h Totais */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/[0.04] border border-black/[0.05] text-xs font-semibold text-[#1D1D1F]">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 animate-pulse" />
          <span>Meta: <strong>8h/dia</strong> (4h Manhã + 4h Tarde)</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            Zero Ociosidade
          </span>
        </div>

        {/* Botão Especial do Teste às Cegas */}
        <button
          onClick={onOpenBlindTestGuide}
          title="Abrir Roteiro & Guia Interativo do Teste às Cegas"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-950 text-xs font-bold hover:brightness-105 active:scale-95 transition cursor-pointer shadow-xs"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600" />
          </span>
          <span className="font-extrabold tracking-tight">🧪 Guia do Teste</span>
        </button>

        {/* Badge do Perfil Logado com Estilo Apple Squircle */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#004A8D]/10 text-[#004A8D] text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-[#004A8D]" />
          <span className="truncate max-w-[120px]">{currentProfile.nome}</span>
          <span className="bg-[#004A8D] text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-xs">
            {currentProfile.badge}
          </span>
        </div>

        {/* Botões Utilitários com Visual macOS */}
        <div className="flex items-center gap-1.5 apple-segmented-container">
          <button
            onClick={onExportBackup}
            title="Backup de Dados JSON"
            className="p-1.5 text-[#1D1D1F] hover:bg-white rounded-lg transition active:scale-95 cursor-pointer"
          >
            <DownloadCloud className="w-4 h-4 text-[#86868B] hover:text-[#1D1D1F]" />
          </button>

          <button
            onClick={onResetData}
            title="Restaurar dados de demonstração"
            className="p-1.5 text-[#86868B] hover:text-rose-600 hover:bg-white rounded-lg transition active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Botão Sair com Estilo Apple Pill */}
        <button
          onClick={onLogout}
          title="Encerrar sessão corporativa"
          className="px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50/80 hover:bg-rose-100/90 active:scale-95 rounded-full transition cursor-pointer flex items-center gap-1.5 border border-rose-200/50"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sair</span>
        </button>
      </div>
    </header>
  );
}

