// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  BookOpen, 
  BarChart3, 
  LogOut,
  Layers,
  Clock,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Building2,
  GraduationCap,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { getStoredAccounts, DEFAULT_ACCOUNTS } from '../services/storage';
import logoConexo from '../assets/logo-conexo.png';

export default function Sidebar({
  currentPersona,
  currentUser,
  onLogout,
  currentTab,
  setCurrentTab,
  onOpenNovoMentorado
}) {
  const [isHovered, setIsHovered] = useState(false);
  const accounts = getStoredAccounts();
  const currentProfile = currentUser || 
    accounts.find((p) => p.id === currentPersona || p.roleType === currentPersona) || 
    DEFAULT_ACCOUNTS.find((p) => p.id === currentPersona || p.roleType === currentPersona) || 
    accounts[0] || DEFAULT_ACCOUNTS[0];

  // Menus contextuais por perfil com nomes profissionais
  const getMenuItems = () => {
    switch (currentPersona) {
      case 'max':
        return [
          { id: 'dashboard', label: 'Visão Geral', icon: BarChart3 },
          { id: 'grade', label: 'Turnos de Hoje (8h)', icon: Clock, badge: 'Hoje' },
          { id: 'agenda', label: 'Agenda & Calendário', icon: Calendar },
          { id: 'mentorados', label: 'Gestão de Alunos', icon: Users, badge: '14' },
          { id: 'antilimbo', label: 'Pós-Ciclo & MEI', icon: CheckCircle2 },
          { id: 'espera', label: 'Fila & Encaixes', icon: Layers, badge: '2' }
        ];
      case 'aline':
        return [
          { id: 'minha-agenda', label: 'Atendimentos de Hoje', icon: Calendar, badge: 'Hoje' },
          { id: 'prontuario', label: 'Prontuário Pedagógico', icon: BookOpen },
          { id: 'trilha', label: 'Trilha de Formação', icon: Layers },
          { id: 'calculadora', label: 'Simulador Custos & CMV', icon: BarChart3 },
          { id: 'alunos-mentora', label: 'Meus Mentorados', icon: Users, badge: '8' }
        ];
      case 'arthur':
        return [
          { id: 'portal', label: 'Meu Painel', icon: BookOpen, badge: '60%' },
          { id: 'metas', label: 'Plano de Ação & Metas', icon: CheckCircle2 },
          { id: 'metricas', label: 'Evolução & Finanças', icon: BarChart3 },
          { id: 'materiais', label: 'Fichas & Materiais', icon: Layers },
          { id: 'formalizacao', label: 'Formalização MEI', icon: CheckCircle2 }
        ];
      case 'admin':
        return [
          { id: 'usuarios', label: 'Gestão de Perfis', icon: UserCheck, badge: 'Master' },
          { id: 'governanca', label: 'Regras do Hub (8h)', icon: Clock },
          { id: 'banco-dados', label: 'Banco de Dados', icon: Layers }
        ];
      case 'regis':
        return [
          { id: 'indicadores', label: 'Painel Executivo', icon: BarChart3 },
          { id: 'auditoria', label: 'Auditoria de Assiduidade', icon: CheckCircle2 },
          { id: 'prestacao', label: 'Prestação de Contas', icon: Layers },
          { id: 'corpo-docente', label: 'Desempenho Docente', icon: Users },
          { id: 'usuarios', label: 'Cadastrar & Gerenciar Perfis', icon: UserCheck, badge: 'Exclusivo Regis' }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`apple-glass rounded-[28px] p-3 flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/80 shrink-0 hidden lg:flex h-[calc(100vh-2.5rem)] sticky top-4 z-30 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isHovered ? 'w-64' : 'w-20'
      }`}
    >
      {/* Topo: macOS Window Dots & Logo */}
      <div className="space-y-4">
        {/* macOS Traffic Lights Simbólicos */}
        <div className={`flex items-center gap-1.5 px-2 pt-1 transition-all duration-300 ${isHovered ? 'justify-start' : 'justify-center'}`}>
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/80" />
        </div>

        {/* Logo & Marca co.nexo Senac */}
        <div className={`flex items-center px-1 transition-all duration-300 ${isHovered ? 'justify-start gap-2.5' : 'justify-center'}`}>
          <div className="h-10 w-10 rounded-2xl bg-white/95 p-1 flex items-center justify-center shadow-xs border border-black/[0.04] shrink-0">
            <img 
              src={logoConexo} 
              alt="co.nexo Senac" 
              className="h-full w-full object-contain"
            />
          </div>
          {isHovered && (
            <div className="overflow-hidden transition-all duration-300 animate-fade-in whitespace-nowrap min-w-0">
              <img 
                src={logoConexo} 
                alt="co.nexo Senac" 
                className="h-7 w-auto object-contain"
              />
            </div>
          )}
        </div>

        {/* Card do Usuário Autenticado */}
        <div className={`p-2 rounded-2xl bg-black/[0.02] border border-black/[0.04] transition-all duration-300 ${
          isHovered ? 'p-2.5' : 'flex flex-col items-center'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-b from-[#0055A5] to-[#004A8D] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {currentProfile.nome.substring(0, 2).toUpperCase()}
            </div>
            {isHovered && (
              <div className="text-left overflow-hidden whitespace-nowrap animate-fade-in min-w-0">
                <p className="text-xs font-semibold text-[#1D1D1F] truncate">
                  {currentProfile.nome}
                </p>
                <p className="text-[10px] text-[#86868B] truncate">
                  {currentProfile.cargo}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Menu de Navegação Estilo macOS Sidebar */}
        <div className="space-y-1">
          {isHovered && (
            <p className="text-[10px] font-semibold text-[#86868B] uppercase tracking-wider px-2 pt-1 animate-fade-in whitespace-nowrap">
              Menu Principal
            </p>
          )}

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id || (!currentTab && item === menuItems[0]);

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    if (item.id === 'mentorados') {
                      const el = document.getElementById('secao-mentorados');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    } else if (item.id === 'grade') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  title={!isHovered ? item.label : undefined}
                  className={`w-full flex items-center rounded-2xl text-xs font-semibold transition-all duration-200 cursor-pointer relative group ${
                    isHovered ? 'px-3 py-2.5 justify-between' : 'h-11 w-11 mx-auto justify-center'
                  } ${
                    isActive
                      ? 'bg-[#004A8D] text-white shadow-md shadow-[#004A8D]/20'
                      : 'text-[#1D1D1F]/80 hover:text-[#1D1D1F] hover:bg-black/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-[#F29100] scale-110' : 'text-[#86868B] group-hover:text-[#004A8D]'
                    }`} />
                    {isHovered && (
                      <span className="whitespace-nowrap animate-fade-in font-medium">{item.label}</span>
                    )}
                  </div>

                  {/* Badge */}
                  {item.badge && (
                    <>
                      {isHovered ? (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap animate-fade-in ${
                          isActive 
                            ? 'bg-white/20 text-white' 
                            : 'bg-black/[0.05] text-[#86868B]'
                        }`}>
                          {item.badge}
                        </span>
                      ) : (
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F29100] ring-2 ring-white" />
                      )}
                    </>
                  )}

                  {/* Tooltip Apple Style quando a barra está retraída */}
                  {!isHovered && (
                    <div className="absolute left-full ml-3 px-2.5 py-1 apple-glass text-[#1D1D1F] text-[11px] font-semibold rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 shadow-lg whitespace-nowrap z-50 border border-black/[0.06]">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Base: Logout */}
      <div className="pt-3 border-t border-black/[0.05]">
        <button
          onClick={onLogout}
          title={!isHovered ? 'Sair do Sistema' : undefined}
          className={`w-full flex items-center rounded-2xl text-xs font-semibold text-rose-600 hover:bg-rose-50/80 active:scale-95 transition cursor-pointer ${
            isHovered ? 'px-3 py-2 justify-start gap-2.5' : 'h-11 w-11 mx-auto justify-center'
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0 text-rose-500" />
          {isHovered && <span className="whitespace-nowrap animate-fade-in">Encerrar Sessão</span>}
        </button>
      </div>
    </aside>
  );
}
