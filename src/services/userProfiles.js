// src/services/userProfiles.js
import { 
  Building2, 
  GraduationCap, 
  UserCheck, 
  BarChart3 
} from 'lucide-react';

export const USER_PROFILES = [
  {
    id: 'max',
    nome: 'Max Ferreira',
    cargo: 'Recepção & Operação do Hub',
    roleLabel: 'Recepção',
    badge: 'Grade & Atendimentos',
    descricao: 'Gestão de turnos docentes de 4 horas, confirmação de presenças, encaixes e acompanhamento pós-ciclo.',
    icon: Building2,
    color: 'blue',
    accentBg: 'bg-blue-50 text-[#004A8D] border-blue-200'
  },
  {
    id: 'aline',
    nome: 'Aline Ferreira',
    cargo: 'Consultora de Negócios & Finanças',
    roleLabel: 'Consultora',
    badge: 'Prontuário & Diagnóstico',
    descricao: 'Prontuário digital único, evolução pedagógica em 5 encontros, calibragem de CMV e plano de ação.',
    icon: GraduationCap,
    color: 'blue',
    accentBg: 'bg-blue-50 text-[#004A8D] border-blue-200'
  },
  {
    id: 'arthur',
    nome: 'Arthur Silva',
    cargo: 'Empreendedor (Tempero do Arthur)',
    roleLabel: 'Mentorado',
    badge: 'Portal do Empreendedor',
    descricao: 'Acompanhamento do ciclo de capacitação, compromissos práticos, documentação técnica e formalização.',
    icon: UserCheck,
    color: 'orange',
    accentBg: 'bg-[#84BD00]/15 text-[#4E7100] border-[#84BD00]/30'
  },
  {
    id: 'regis',
    nome: 'Regis Moreira',
    cargo: 'Coordenação Geral SENAC Hub',
    roleLabel: 'Diretoria',
    badge: 'Prestação de Contas',
    descricao: 'Auditoria de horas executadas, taxa de assiduidade, índice de formalização e relatórios executivos.',
    icon: BarChart3,
    color: 'slate',
    accentBg: 'bg-slate-100 text-slate-900 border-slate-300'
  }
];
