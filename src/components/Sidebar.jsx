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
  UserCheck
} from 'lucide-react';
import { USER_PROFILES } from './LoginModal';
import logoConexo from '../assets/logo-conexo.png';

export default function Sidebar({
  currentPersona,
  onLogout,
  currentTab,
  setCurrentTab,
  onOpenNovoMentorado
}) {
  const [isHovered, setIsHovered] = useState(false);
  const currentProfile = USER_PROFILES.find((p) => p.id === currentPersona) || USER_PROFILES[0];

  // Menus contextuais por perfil com nomes profissionais
  const getMenuItems = () => {
    switch (currentPersona) {
      case 'max':
        return [
          { id: 'dashboard', label: 'Visão Geral', icon: BarChart3 },
          { id: 'grade', label: 'Turno de Hoje (4h)', icon: Clock, badge: 'Hoje' },
          { id: 'agenda', label: 'Agenda Semanal', icon: Calendar },
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
      case 'regis':
        return [
          { id: 'indicadores', label: 'Painel Executivo', icon: BarChart3 },
          { id: 'auditoria', label: 'Auditoria de Assiduidade', icon: CheckCircle2 },
          { id: 'prestacao', label: 'Prestação de Contas', icon: Layers },
          { id: 'corpo-docente', label: 'Desempenho Docente', icon: Users }
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
      className={`bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-3.5 flex flex-col justify-between shadow-sm shrink-0 hidden lg:flex h-[calc(100vh-2rem)] sticky top-4 z-30 transition-all duration-300 ease-in-out ${
        isHovered ? 'w-64 shadow-xl' : 'w-20'
      }`}
    >
      {/* Topo: Logo & Identidade Co.Nexo SENAC */}
      <div className="space-y-5">
        <div className={`flex items-center gap-3 px-1 transition-all duration-300 ${isHovered ? 'justify-start' : 'justify-center'}`}>
          <img 
            src={logoConexo} 
            alt="Co.Nexo SENAC" 
            className="h-10 w-10 object-contain shrink-0 drop-shadow-xs"
          />
          {isHovered && (
            <div className="overflow-hidden transition-all duration-300 animate-fade-in whitespace-nowrap">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-[#004A8D] text-lg tracking-tight">Co.Nexo</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-[#F29100]/15 text-[#C87500] border border-[#F29100]/30">
                  SENAC
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500">Hub Empreendedor</p>
            </div>
          )}
        </div>

        {/* Card do Usuário Autenticado */}
        <div className={`p-2 rounded-2xl bg-slate-50 border border-slate-200/80 transition-all duration-300 ${
          isHovered ? 'p-3' : 'flex flex-col items-center'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-[#004A8D] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
              {currentProfile.nome.substring(0, 2).toUpperCase()}
            </div>
            {isHovered && (
              <div className="text-left overflow-hidden whitespace-nowrap animate-fade-in">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {currentProfile.nome}
                </p>
                <p className="text-[10px] text-slate-500 font-medium truncate">
                  {currentProfile.cargo}
                </p>
              </div>
            )}
          </div>

          {isHovered && (
            <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-[#004A8D] font-bold animate-fade-in whitespace-nowrap">
              <span>Módulo</span>
              <span className="bg-[#004A8D]/10 text-[#004A8D] px-2 py-0.5 rounded-full">{currentProfile.roleLabel}</span>
            </div>
          )}
        </div>

        {/* Menu de Navegação */}
        <div className="space-y-1.5">
          {isHovered && (
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 animate-fade-in whitespace-nowrap">
              Navegação
            </p>
          )}

          <nav className="space-y-1.5">
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
                  className={`w-full flex items-center rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer relative group ${
                    isHovered ? 'px-3.5 py-2.5 justify-between' : 'h-12 w-12 mx-auto justify-center'
                  } ${
                    isActive
                      ? 'bg-[#004A8D] text-white shadow-md shadow-[#004A8D]/25 ring-2 ring-[#004A8D]/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 shrink-0 transition-transform ${
                      isActive ? 'text-[#F29100] scale-110' : 'text-slate-400 group-hover:text-[#004A8D]'
                    }`} />
                    {isHovered && (
                      <span className="whitespace-nowrap animate-fade-in">{item.label}</span>
                    )}
                  </div>

                  {/* Badge */}
                  {item.badge && (
                    <>
                      {isHovered ? (
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap animate-fade-in ${
                          isActive 
                            ? 'bg-[#F29100] text-slate-950 font-black' 
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {item.badge}
                        </span>
                      ) : (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F29100] ring-2 ring-white" />
                      )}
                    </>
                  )}

                  {/* Tooltip quando a barra está retraída */}
                  {!isHovered && (
                    <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-semibold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 shadow-lg whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Base: Ações Adicionais e Logout */}
      <div className="space-y-2 pt-4 border-t border-slate-100">
        <button
          onClick={onLogout}
          title={!isHovered ? 'Sair do Sistema' : undefined}
          className={`w-full flex items-center rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer ${
            isHovered ? 'px-3.5 py-2.5 justify-start gap-3' : 'h-12 w-12 mx-auto justify-center'
          }`}
        >
          <LogOut className="w-5 h-5 shrink-0 text-rose-500" />
          {isHovered && <span className="whitespace-nowrap animate-fade-in">Sair da Sessão</span>}
        </button>
      </div>
    </aside>
  );
}
