// src/services/storage.js
/**
 * CO.NEXO - CAMADA DE REPOSITÓRIO E INTEGRIDADE DE DADOS
 * 
 * PADRÕES APLICADOS:
 * 1. Data Sanitization & Neutralização de Formula/CSV Injection (CWE-1236).
 * 2. Repository Pattern (abstração e isolamento do mecanismo de persistência).
 * 3. Safe Schema Parsing & Validação defensiva de integridade.
 */

import {
  INITIAL_STUDENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_DIARIOS,
  INITIAL_CONSULTORS,
  INITIAL_WAITING_LIST
} from './mockData';

const STORAGE_KEYS = {
  STUDENTS: 'conexo_students_v4',
  APPOINTMENTS: 'conexo_appointments_v4',
  DIARIOS: 'conexo_diarios_v4',
  CONSULTORS: 'conexo_consultors_v4',
  WAITING_LIST: 'conexo_waiting_list_v4',
  LAST_BACKUP: 'conexo_last_backup_v4'
};

/**
 * Sanitiza valores textuais para prevenir execução de fórmulas maliciosas (CSV/Formula Injection - CWE-1236).
 * Se o valor iniciar com =, +, -, @ ou caracteres de controle (\t, \r), neutraliza prefixando com apóstrofo (')
 * e formata conforme a RFC 4180.
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

  getData() {
    try {
      this.purgeLegacyKeys();

      const studentsRaw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (!studentsRaw) {
        return this.resetDemo();
      }

      const appointmentsRaw = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      const diariosRaw = localStorage.getItem(STORAGE_KEYS.DIARIOS);
      const consultorsRaw = localStorage.getItem(STORAGE_KEYS.CONSULTORS);
      const waitingListRaw = localStorage.getItem(STORAGE_KEYS.WAITING_LIST);

      let consultors = safeJsonParse(consultorsRaw, INITIAL_CONSULTORS);
      if (!Array.isArray(consultors) || consultors.length < INITIAL_CONSULTORS.length) {
        consultors = INITIAL_CONSULTORS;
        localStorage.setItem(STORAGE_KEYS.CONSULTORS, JSON.stringify(INITIAL_CONSULTORS));
      }

      let appointments = safeJsonParse(appointmentsRaw, INITIAL_APPOINTMENTS);
      if (!Array.isArray(appointments) || appointments.length < 6) {
        appointments = INITIAL_APPOINTMENTS;
        localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
      }

      return {
        students: safeJsonParse(studentsRaw, INITIAL_STUDENTS),
        appointments,
        diarios: safeJsonParse(diariosRaw, INITIAL_DIARIOS),
        consultors,
        waitingList: safeJsonParse(waitingListRaw, INITIAL_WAITING_LIST)
      };
    } catch (error) {
      console.error('[Repository Error] Não foi possível ler os dados armazenados:', error);
      return {
        students: INITIAL_STUDENTS,
        appointments: INITIAL_APPOINTMENTS,
        diarios: INITIAL_DIARIOS,
        consultors: INITIAL_CONSULTORS,
        waitingList: INITIAL_WAITING_LIST
      };
    }
  },

  saveData(data) {
    try {
      if (data.students) localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(data.students));
      if (data.appointments) localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(data.appointments));
      if (data.diarios) localStorage.setItem(STORAGE_KEYS.DIARIOS, JSON.stringify(data.diarios));
      if (data.consultors) localStorage.setItem(STORAGE_KEYS.CONSULTORS, JSON.stringify(data.consultors));
      if (data.waitingList) localStorage.setItem(STORAGE_KEYS.WAITING_LIST, JSON.stringify(data.waitingList));
      localStorage.setItem(STORAGE_KEYS.LAST_BACKUP, new Date().toISOString());
    } catch (error) {
      console.error('[Repository Error] Erro ao persistir dados:', error);
    }
  },

  resetDemo() {
    this.purgeLegacyKeys();
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
