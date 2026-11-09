// src/components/BottomMobileNav.jsx
import React from 'react';
import { 
  Clock, 
  Calendar, 
  Users, 
  CheckCircle2, 
  BookOpen, 
  Layers, 
  BarChart3, 
  LogOut 
} from 'lucide-react';

export default function BottomMobileNav({
  currentPersona,
  currentTab,
  setCurrentTab,
  onLogout
}) {
  const getTabs = () => {
    switch (currentPersona) {
      case 'max':
        return [
          { id: 'dashboard', label: 'Início', icon: BarChart3 },
          { id: 'grade', label: 'Turno 4h', icon: Clock },
          { id: 'agenda', label: 'Agenda', icon: Calendar },
          { id: 'mentorados', label: 'Alunos', icon: Users },
          { id: 'antilimbo', label: 'MEI', icon: CheckCircle2 }
        ];
      case 'aline':
        return [
          { id: 'minha-agenda', label: 'Hoje', icon: Calendar },
          { id: 'prontuario', label: 'Prontuário', icon: BookOpen },
          { id: 'trilha', label: 'Trilha', icon: Layers },
          { id: 'calculadora', label: 'CMV', icon: BarChart3 },
          { id: 'alunos-mentora', label: 'Alunos', icon: Users }
        ];
      case 'arthur':
        return [
          { id: 'portal', label: 'Início', icon: BookOpen },
          { id: 'metas', label: 'Metas', icon: CheckCircle2 },
          { id: 'metricas', label: 'Finanças', icon: BarChart3 },
          { id: 'materiais', label: 'Fichas', icon: Layers }
        ];
      case 'admin':
        return [
          { id: 'usuarios', label: 'Perfis', icon: Users },
          { id: 'governanca', label: 'Regras 8h', icon: Clock },
          { id: 'banco-dados', label: 'Banco', icon: Layers }
        ];
      case 'regis':
        return [
          { id: 'indicadores', label: 'Painel', icon: BarChart3 },
          { id: 'auditoria', label: 'Assiduidade', icon: CheckCircle2 },
          { id: 'prestacao', label: 'Contas', icon: Layers },
          { id: 'corpo-docente', label: 'Docentes', icon: Users }
        ];
      default:
        return [];
    }
  };

  const tabs = getTabs();

  return (
    <div className="lg:hidden fixed bottom-3 left-3 right-3 z-40">
      <nav className="bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl rounded-2xl px-2 py-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 transition cursor-pointer min-h-[46px] ${
                isActive
                  ? 'bg-[#004A8D] text-white font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#F29100]' : 'text-slate-400'}`} />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={onLogout}
          title="Sair"
          className="py-1 px-2 rounded-xl text-rose-600 hover:bg-rose-50 flex flex-col items-center justify-center gap-0.5 min-h-[46px] cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span className="text-[10px] font-bold">Sair</span>
        </button>
      </nav>
    </div>
  );
}
