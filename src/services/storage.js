// src/services/storage.js
/**
 * CO.NEXO - CAMADA DE REPOSITÓRIO E INTEGRIDADE DE DADOS
 * 
 * PADRÕES APLICADOS:
 * 1. Data Sanitization & Neutralização de Formula/CSV Injection (CWE-1236).
 * 2. Repository Pattern (abstração e isolamento do mecanismo de persistência).
 * 3. Safe Schema Parsing & Validação defensiva de integridade.
 * 4. Gestão dinâmica de Contas/Perfis e Reset Total (Banco Limpo vs Demo).
 */

import {
  INITIAL_STUDENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_DIARIOS,
  INITIAL_CONSULTORS,
  INITIAL_WAITING_LIST
} from './mockData';

const STORAGE_KEYS = {
  ACCOUNTS: 'conexo_accounts_v5',
  STUDENTS: 'conexo_students_v5',
  APPOINTMENTS: 'conexo_appointments_v5',
  DIARIOS: 'conexo_diarios_v5',
  CONSULTORS: 'conexo_consultors_v5',
  WAITING_LIST: 'conexo_waiting_list_v5',
  LAST_BACKUP: 'conexo_last_backup_v5'
};

// Conta Mestra Raiz do Sistema (Admin Supremo)
export const MASTER_ADMIN_ACCOUNT = {
  id: 'admin',
  nome: 'Admin Supremo',
  cargo: 'Governança Master & Gestão de Perfis',
  roleLabel: 'Admin Supremo',
  roleType: 'admin',
  email: 'admin@conexo.senac.br',
  password: 'admin123',
  badge: 'Admin Supremo',
  gradient: 'from-slate-900 via-indigo-950 to-slate-900',
  color: '#004A8D',
  aliases: ['admin', 'admin@conexo.senac.br', 'admin@senac.br', 'superadmin', 'root', 'master']
};

// Contas e Perfis Padrão do Hub SENAC (Apenas o Admin Supremo Raiz, sem perfis pré-setados estáticos)
export const DEFAULT_ACCOUNTS = [
  MASTER_ADMIN_ACCOUNT
];

export const DEMO_ACCOUNTS = [
  MASTER_ADMIN_ACCOUNT,
  {
    id: 'regis',
    nome: 'Regis Moreira',
    cargo: 'Coordenação Geral',
    roleLabel: 'Diretoria',
    roleType: 'regis',
    email: 'regis.coordenacao@sp.senac.br',
    badge: 'Auditoria & Contas',
    gradient: 'from-purple-600 to-violet-800',
    color: '#7C3AED',
    aliases: ['regis', 'regis.coordenacao', 'regis@senac.br', 'diretoria@sp.senac.br']
  },
  {
    id: 'max',
    nome: 'Max Ferreira',
    cargo: 'Recepção & Operação',
    roleLabel: 'Recepção',
    roleType: 'max',
    email: 'max.operacao@sp.senac.br',
    badge: 'Grade & Atendimentos',
    gradient: 'from-blue-600 to-indigo-700',
    color: '#004A8D',
    aliases: ['max', 'max.operacao', 'max@senac.br', 'recepcao@sp.senac.br']
  },
  {
    id: 'aline',
    nome: 'Aline Ferreira',
    cargo: 'Consultora de Negócios',
    roleLabel: 'Consultora',
    roleType: 'aline',
    email: 'aline.consultora@sp.senac.br',
    badge: 'Prontuário & Trilha',
    gradient: 'from-amber-500 to-orange-600',
    color: '#F29100',
    aliases: ['aline', 'aline.consultora', 'aline@senac.br', 'consultoria@sp.senac.br', 'Laíse', 'Laíse.consultora', 'Laíse@senac.br']
  },
  {
    id: 'arthur',
    nome: 'Arthur Silva',
    cargo: 'Empreendedor (Tempero)',
    roleLabel: 'Mentorado',
    roleType: 'arthur',
    email: 'arthur.silva@sp.senac.br',
    badge: 'Portal do Aluno',
    gradient: 'from-emerald-500 to-teal-700',
    color: '#10B981',
    aliases: ['arthur', 'arthur.silva', 'arthur@tempero.com', 'arthur@senac.br', 'tempero']
  }
];

/**
 * Sanitiza valores textuais para prevenir execução de fórmulas maliciosas (CSV/Formula Injection - CWE-1236).
 */
export function sanitizeForCsv(value) {
  if (value === null || value === undefined) return '""';
  const str = String(value).trim();
  const dangerousPrefixes = ['=', '+', '-', '@', '\t', '\r'];
  const startsWithDangerous = dangerousPrefixes.some((p) => str.startsWith(p));
  const sanitized = startsWithDangerous ? `'${str}` : str;
  return `"${sanitized.replace(/"/g, '""')}"`;
}

/**
 * Parser seguro de JSON com fallback defensivo
 */
function safeJsonParse(rawString, fallback) {
  if (!rawString) return fallback;
  try {
    const parsed = JSON.parse(rawString);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (err) {
    console.error('[Storage Error] Falha de integridade ao decodificar JSON:', err);
    return fallback;
  }
}

/**
 * Repositório Central de Dados Co.Nexo
 */
export const StorageRepository = {
  // Limpa chaves obsoletas de versões anteriores
  purgeLegacyKeys() {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('conexo_') && !Object.values(STORAGE_KEYS).includes(k) && k !== 'conexo_auth_persona') {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch {
      // Ignora erro em ambientes sem window.localStorage
    }
  },

  // Gerenciamento de Contas e Perfis
  getAccounts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      let list = [];
      if (!raw) {
        list = DEFAULT_ACCOUNTS;
        localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(list));
        return list;
      }
      const parsed = safeJsonParse(raw, DEFAULT_ACCOUNTS);
      list = Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ACCOUNTS;
      // Garante que o Admin Supremo sempre esteja disponível com roleType: 'admin'
      list = list.map(a => (a.email === 'admin@conexo.senac.br' || a.id === 'super-admin' || a.id === 'admin') ? MASTER_ADMIN_ACCOUNT : a);
      if (!list.some(a => a.email === 'admin@conexo.senac.br')) {
        list = [MASTER_ADMIN_ACCOUNT, ...list];
      }
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(list));
      return list;
    } catch {
      return DEFAULT_ACCOUNTS;
    }
  },

  saveAccounts(accounts) {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    } catch (e) {
      console.error('[Repository Error] Erro ao salvar contas:', e);
    }
  },

  addAccount(account) {
    const accounts = this.getAccounts();
    const updated = [...accounts, account];
    this.saveAccounts(updated);
    return updated;
  },

  getData() {
    try {
      this.purgeLegacyKeys();

      const studentsRaw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      // Se não houver nada inicializado, carrega o banco de demonstração inicial
      if (studentsRaw === null) {
        return this.resetDemo();
      }

      const appointmentsRaw = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      const diariosRaw = localStorage.getItem(STORAGE_KEYS.DIARIOS);
      const consultorsRaw = localStorage.getItem(STORAGE_KEYS.CONSULTORS);
      const waitingListRaw = localStorage.getItem(STORAGE_KEYS.WAITING_LIST);

      let consultors = safeJsonParse(consultorsRaw, INITIAL_CONSULTORS);
      if (!Array.isArray(consultors) || consultors.length === 0) {
        consultors = INITIAL_CONSULTORS;
      }

      return {
        students: safeJsonParse(studentsRaw, []),
        appointments: safeJsonParse(appointmentsRaw, []),
        diarios: safeJsonParse(diariosRaw, []),
        consultors,
        waitingList: safeJsonParse(waitingListRaw, [])
      };
    } catch (error) {
      console.error('[Repository Error] Não foi possível ler os dados armazenados:', error);
      return {
        students: [],
        appointments: [],
        diarios: [],
        consultors: INITIAL_CONSULTORS,
        waitingList: []
      };
    }
  },

  saveData(data) {
    try {
      if (data.students !== undefined) localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(data.students));
      if (data.appointments !== undefined) localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(data.appointments));
      if (data.diarios !== undefined) localStorage.setItem(STORAGE_KEYS.DIARIOS, JSON.stringify(data.diarios));
      if (data.consultors !== undefined) localStorage.setItem(STORAGE_KEYS.CONSULTORS, JSON.stringify(data.consultors));
      if (data.waitingList !== undefined) localStorage.setItem(STORAGE_KEYS.WAITING_LIST, JSON.stringify(data.waitingList));
      localStorage.setItem(STORAGE_KEYS.LAST_BACKUP, new Date().toISOString());
    } catch (error) {
      console.error('[Repository Error] Erro ao persistir dados:', error);
    }
  },

  // RESET TOTAL LIMPO: Zera todos os alunos, agendamentos, diários e mantém apenas o Admin Supremo para provisionar Coordenação
  resetCleanEmpty() {
    this.purgeLegacyKeys();
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify([MASTER_ADMIN_ACCOUNT]));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.DIARIOS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.CONSULTORS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.WAITING_LIST, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.LAST_BACKUP, new Date().toISOString());
    return {
      students: [],
      appointments: [],
      diarios: [],
      consultors: [],
      waitingList: []
    };
  },

  // RESET PARA DADOS DE DEMONSTRAÇÃO SENAC
  resetDemo() {
    this.purgeLegacyKeys();
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(DEMO_ACCOUNTS));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
    localStorage.setItem(STORAGE_KEYS.DIARIOS, JSON.stringify(INITIAL_DIARIOS));
    localStorage.setItem(STORAGE_KEYS.CONSULTORS, JSON.stringify(INITIAL_CONSULTORS));
    localStorage.setItem(STORAGE_KEYS.WAITING_LIST, JSON.stringify(INITIAL_WAITING_LIST));
    localStorage.setItem(STORAGE_KEYS.LAST_BACKUP, new Date().toISOString());
    return {
      students: INITIAL_STUDENTS,
      appointments: INITIAL_APPOINTMENTS,
      diarios: INITIAL_DIARIOS,
      consultors: INITIAL_CONSULTORS,
      waitingList: INITIAL_WAITING_LIST
    };
  },

  exportBackupJSON(data) {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    downloadAnchor.setAttribute('download', `backup_conexo_senac_${timestamp}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
};

// Funções de compatibilidade exportadas diretamente
export const getStoredData = () => StorageRepository.getData();
export const saveStoredData = (data) => StorageRepository.saveData(data);
export const resetToInitial = () => StorageRepository.resetDemo();
export const resetCleanEmpty = () => StorageRepository.resetCleanEmpty();
export const getStoredAccounts = () => StorageRepository.getAccounts();
export const saveStoredAccounts = (accs) => StorageRepository.saveAccounts(accs);
export const addStoredAccount = (acc) => StorageRepository.addAccount(acc);
export const exportBackupJSON = (data) => StorageRepository.exportBackupJSON(data);

// Regra de Validação de Desligamento Automático
export const checkStudentStatus = (student) => {
  if ((student.totalFaltas || 0) >= 2 || (student.totalReagendamentos || 0) >= 3) {
    return {
      ...student,
      etapaPrograma: 'Desligado',
      motivoDesligamento: (student.totalFaltas || 0) >= 2
        ? `Desligado automaticamente: Atingiu ${student.totalFaltas} faltas (limite é 2).`
        : `Desligado automaticamente: Atingiu ${student.totalReagendamentos} reagendamentos (limite é 3).`
    };
  }
  return student;
};

