// src/services/mockData.js
// Dados iniciais realistas para o Hub Co.Nexo SENAC
// REGRAS DE GOVERNANÇA:
// 1. Total diário: exatamente 8 horas de atendimento no Hub (4h de Aline + 4h de Jamile).
// 2. Duração: Mentoria = 2 horas | Primeiro Encontro / Diagnóstico = 1 hora.
// 3. Bloco de 4h de cada mentor sem horário vazio (zero ociosidade):
//    - Opção A: 2 Mentorias (2h + 2h = 4h)
//    - Opção B: 4 Diagnósticos (1h + 1h + 1h + 1h = 4h)
//    - Opção C: 1 Mentoria e 2 Diagnósticos (2h + 1h + 1h = 4h)

export const INITIAL_CONSULTORS = [
  {
    id: 'cons-1',
    nome: 'Aline Ferreira',
    email: 'aline.consultora@sp.senac.br',
    especialidade: 'Finanças, Custos (CMV) & Precificação',
    sala: 'Sala 01 Presencial',
    periodoPadrao: 'Manhã (08:00 às 12:00 • 4h)',
    horariosTurno: ['08:00', '09:00', '10:00', '11:00'],
    turnos: [
      {
        id: 'turno-ali-seg',
        diaSemana: 'Segunda-feira',
        data: '2026-10-19',
        horarioInicio: '08:00',
        horarioFim: '12:00',
        capacidadeHoras: 4,
        ocupacaoPercentual: 100
      },
      {
        id: 'turno-ali-ter',
        diaSemana: 'Terça-feira',
        data: '2026-10-20',
        horarioInicio: '08:00',
        horarioFim: '12:00',
        capacidadeHoras: 4,
        ocupacaoPercentual: 100
      },
      {
        id: 'turno-ali-qua',
        diaSemana: 'Quarta-feira',
        data: '2026-10-21',
        horarioInicio: '08:00',
        horarioFim: '12:00',
        capacidadeHoras: 4,
        ocupacaoPercentual: 100
      },
      {
        id: 'turno-ali-qui',
        diaSemana: 'Quinta-feira',
        data: '2026-10-22',
        horarioInicio: '08:00',
        horarioFim: '12:00',
        capacidadeHoras: 4,
        ocupacaoPercentual: 100
      },
      {
        id: 'turno-ali-sex',
        diaSemana: 'Sexta-feira',
        data: '2026-10-23',
        horarioInicio: '08:00',
        horarioFim: '12:00',
        capacidadeHoras: 4,
        ocupacaoPercentual: 100
      },
      {
        id: 'turno-ali-sab',
        diaSemana: 'Sábado',
        data: '2026-10-24',
        horarioInicio: '08:00',
        horarioFim: '12:00',
        capacidadeHoras: 4,
        ocupacaoPercentual: 100
      }
    ]
  },
  {
    id: 'cons-2',
    nome: 'Jamile Mendes',
    email: 'jamile.consultora@sp.senac.br',
    especialidade: 'Estratégia de Vendas, Mercado & Formalização MEI',
    sala: 'Sala 02 Presencial',
    periodoPadrao: 'Tarde (14:00 às 18:00 • 4h)',
    horariosTurno: ['14:00', '15:00', '16:00', '17:00'],
    turnos: [
      {
        id: 'turno-jam-seg',
        diaSemana: 'Segunda-feira',
        data: '2026-10-19',
        horarioInicio: '14:00',
        horarioFim: '18:00',
        capacidadeHoras: 4,
        ocupacaoPercentual: 100
      },
      {
        id: 'turno-jam-ter',
        diaSemana: 'Terça-feira',
        data: '2026-10-20',
        horarioInicio: '14:00',
        horarioFim: '18:00',
        capacidadeHoras: 4,
        ocupacaoPercentual: 100
      },
      {
        id: 'turno-jam-qua',
        diaSemana: 'Quarta-feira',
        data: '2026-10-21',
        horarioInicio: '14:00',
        horarioFim: '18:00',
        capacidadeHoras: 4,
        ocupacaoPercentual: 100
      },
      {
        id: 'turno-jam-qui',
        diaSemana: 'Quinta-feira',
        data: '2026-10-22',
        horarioInicio: '14:00',
        horarioFim: '18:00',
        capacidadeHoras: 4,
        ocupacaoPercentual: 75
      },
      {
        id: 'turno-jam-sex',
        diaSemana: 'Sexta-feira',
        data: '2026-10-23',
        horarioInicio: '14:00',
        horarioFim: '18:00',
        capacidadeHoras: 4,
        ocupacaoPercentual: 100
      },
      {
        id: 'turno-jam-sab',
        diaSemana: 'Sábado',
        data: '2026-10-24',
        horarioInicio: '14:00',
        horarioFim: '18:00',
        capacidadeHoras: 4,
        ocupacaoPercentual: 50
      }
    ]
  }
];

export const INITIAL_STUDENTS = [
  {
    id: 'aluno-1',
    nome: 'Arthur Silva',
    negocio: 'Tempero do Arthur (Alimentação)',
    segmento: 'Alimentação & Gastronomia',
    whatsapp: '(11) 98765-4321',
    documento: '432.198.765-00',
    statusNegocio: 'Informal',
    cnpj: '',
    etapaPrograma: 'Trilha', // 'Inscrito' | 'Diagnostico' | 'Trilha' | 'Concluido' | 'Desligado'
    sessaoAtual: 3,
    totalFaltas: 1,
    totalReagendamentos: 1,
    motivoDesligamento: null,
    statusFormalizacaoMei: 'Em Processo (Meta D+30)',
    dataConclusao: null,
    avatar: '👨‍🍳',
    metricasEvolucao: {
      faturamentoAntes: 'R$ 3.200/mês',
      faturamentoDepois: 'R$ 5.100/mês (+59%)',
      margemAntes: '4% (prejuízo oculto)',
      margemDepois: '28% (preço corte R$ 22)',
      segregacaoContas: '100% Segregada (Conta PJ ativa)'
    }
  },
  {
    id: 'aluno-2',
    nome: 'Mariana Costa',
    negocio: 'Ateliê Criativo (Moda & Artesanato)',
    segmento: 'Artesanato & Moda',
    whatsapp: '(11) 97654-3210',
    documento: '321.654.987-11',
    statusNegocio: 'MEI',
    cnpj: '45.123.789/0001-90',
    etapaPrograma: 'Concluido',
    sessaoAtual: 5,
    totalFaltas: 0,
    totalReagendamentos: 0,
    motivoDesligamento: null,
    statusFormalizacaoMei: 'Formalizado',
    dataConclusao: '2026-09-30',
    avatar: '🎨'
  },
  {
    id: 'aluno-3',
    nome: 'Carlos Eduardo',
    negocio: 'Oficina Rápida Express',
    segmento: 'Serviços Automotivos',
    whatsapp: '(11) 96543-2109',
    documento: '567.890.123-22',
    statusNegocio: 'Informal',
    cnpj: '',
    etapaPrograma: 'Desligado',
    sessaoAtual: 1,
    totalFaltas: 2,
    totalReagendamentos: 1,
    motivoDesligamento: 'Excedeu limite de faltas (2 faltas consecutivas sem justificativa prévia de 24h)',
    statusFormalizacaoMei: 'Não Iniciado',
    dataConclusao: null,
    avatar: '🔧'
  },
  {
    id: 'aluno-4',
    nome: 'Juliana Mendes',
    negocio: 'Doce Sonho Confeitaria',
    segmento: 'Alimentação & Doces Finos',
    whatsapp: '(11) 95432-1098',
    documento: '678.901.234-33',
    statusNegocio: 'Informal',
    cnpj: '',
    etapaPrograma: 'Diagnostico',
    sessaoAtual: 1,
    totalFaltas: 0,
    totalReagendamentos: 0,
    motivoDesligamento: null,
    statusFormalizacaoMei: 'Não Iniciado',
    dataConclusao: null,
    avatar: '🧁'
  },
  {
    id: 'aluno-5',
    nome: 'Pedro Henrique',
    negocio: 'PH Elétrica & Manutenção',
    segmento: 'Serviços Prediais',
    whatsapp: '(11) 94321-0987',
    documento: '789.012.345-44',
    statusNegocio: 'Informal',
    cnpj: '',
    etapaPrograma: 'Concluido',
    sessaoAtual: 5,
    totalFaltas: 1,
    totalReagendamentos: 2,
    motivoDesligamento: null,
    statusFormalizacaoMei: 'Aguardando D+30',
    dataConclusao: '2026-10-05',
    avatar: '⚡'
  }
];

// Fila de Espera para encaixe rápido de 1h
export const INITIAL_WAITING_LIST = [
  {
    id: 'espera-1',
    nome: 'Marcos Paulo Oliveira',
    negocio: 'Barbearia Navalha de Ouro',
    segmento: 'Beleza & Estética',
    whatsapp: '(11) 98111-2233',
    documento: '123.456.789-99',
    tempoEsperaDias: 3,
    tipoDesejado: 'Diagnostico_1h',
    status: 'Aguardando Encaixe'
  },
  {
    id: 'espera-2',
    nome: 'Camila Rocha',
    negocio: 'Doces Artesanais da Vila',
    segmento: 'Alimentação',
    whatsapp: '(11) 97222-3344',
    documento: '234.567.890-88',
    tempoEsperaDias: 1,
    tipoDesejado: 'Diagnostico_1h',
    status: 'Aguardando Encaixe'
  }
];

export const INITIAL_APPOINTMENTS = [
  // ==========================================================================
  // SEGUNDA-FEIRA (19/10/2026) - TOTAL: 8 HORAS (4h Aline + 4h Jamile)
  // ==========================================================================
  // Aline Ferreira (08:00 - 12:00 • 4h) -> Combinação C: 1 Mentoria (2h) + 2 Diagnósticos (1h + 1h)
  {
    id: 'agend-seg-ali-1',
    turnoId: 'turno-ali-seg',
    consultorId: 'cons-1',
    alunoId: 'aluno-5', // Pedro Henrique
    diaSemana: 'Segunda',
    tipo: 'Mentoria_2h',
    data: '2026-10-19',
    horarioInicio: '08:00',
    horarioFim: '10:00',
    status: 'Confirmado',
    sessaoNumero: 4,
    observacao: 'Sessão 4: Gestão Financeira e Capital de Giro',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 01 Presencial'
  },
  {
    id: 'agend-seg-ali-2',
    turnoId: 'turno-ali-seg',
    consultorId: 'cons-1',
    alunoId: 'aluno-2', // Mariana Costa
    diaSemana: 'Segunda',
    tipo: 'Diagnostico_1h',
    data: '2026-10-19',
    horarioInicio: '10:00',
    horarioFim: '11:00',
    status: 'Confirmado',
    sessaoNumero: 1,
    observacao: '1º Encontro: Diagnóstico Inicial e Precificação',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 01 Presencial'
  },
  {
    id: 'agend-seg-ali-3',
    turnoId: 'turno-ali-seg',
    consultorId: 'cons-1',
    alunoId: 'aluno-4', // Juliana Mendes
    diaSemana: 'Segunda',
    tipo: 'Diagnostico_1h',
    data: '2026-10-19',
    horarioInicio: '11:00',
    horarioFim: '12:00',
    status: 'Confirmado',
    sessaoNumero: 1,
    observacao: '1º Encontro: Mapeamento de Custos e Ficha Técnica',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 01 Presencial'
  },

  // Jamile Mendes (14:00 - 18:00 • 4h) -> Combinação A: 2 Mentorias (2h + 2h)
  {
    id: 'agend-seg-jam-1',
    turnoId: 'turno-jam-seg',
    consultorId: 'cons-2',
    alunoId: 'aluno-1', // Arthur Silva
    diaSemana: 'Segunda',
    tipo: 'Mentoria_2h',
    data: '2026-10-19',
    horarioInicio: '14:00',
    horarioFim: '16:00',
    status: 'Confirmado',
    sessaoNumero: 2,
    observacao: 'Sessão 2: Estratégia Comercial & Canais de Venda',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 02 Presencial'
  },
  {
    id: 'agend-seg-jam-2',
    turnoId: 'turno-jam-seg',
    consultorId: 'cons-2',
    alunoId: 'aluno-5', // Pedro Henrique
    diaSemana: 'Segunda',
    tipo: 'Mentoria_2h',
    data: '2026-10-19',
    horarioInicio: '16:00',
    horarioFim: '18:00',
    status: 'Confirmado',
    sessaoNumero: 3,
    observacao: 'Sessão 3: Fechamento de Propostas & Formalização',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 02 Presencial'
  },

  // ==========================================================================
  // TERÇA-FEIRA (20/10/2026) - TOTAL: 8 HORAS (4h Aline + 4h Jamile)
  // ==========================================================================
  // Aline Ferreira (08:00 - 12:00 • 4h) -> Combinação A: 2 Mentorias (2h + 2h)
  {
    id: 'agend-ter-ali-1',
    turnoId: 'turno-ali-ter',
    consultorId: 'cons-1',
    alunoId: 'aluno-4', // Juliana Mendes
    diaSemana: 'Terça',
    tipo: 'Mentoria_2h',
    data: '2026-10-20',
    horarioInicio: '08:00',
    horarioFim: '10:00',
    status: 'Confirmado',
    sessaoNumero: 2,
    observacao: 'Sessão 2: Ficha Técnica e Custos de Produção',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 01 Presencial'
  },
  {
    id: 'agend-ter-ali-2',
    turnoId: 'turno-ali-ter',
    consultorId: 'cons-1',
    alunoId: 'aluno-1', // Arthur Silva
    diaSemana: 'Terça',
    tipo: 'Mentoria_2h',
    data: '2026-10-20',
    horarioInicio: '10:00',
    horarioFim: '12:00',
    status: 'Confirmado',
    sessaoNumero: 2,
    observacao: 'Sessão 2: Formação de Preço de Venda e Margem',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 01 Presencial'
  },

  // Jamile Mendes (14:00 - 18:00 • 4h) -> Combinação B: 4 Diagnósticos de 1h (1h + 1h + 1h + 1h)
  {
    id: 'agend-ter-jam-1',
    turnoId: 'turno-jam-ter',
    consultorId: 'cons-2',
    alunoId: 'aluno-2', // Mariana Costa
    diaSemana: 'Terça',
    tipo: 'Diagnostico_1h',
    data: '2026-10-20',
    horarioInicio: '14:00',
    horarioFim: '15:00',
    status: 'Confirmado',
    sessaoNumero: 1,
    observacao: '1º Encontro: Diagnóstico de Posicionamento e Marca',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 02 Presencial'
  },
  {
    id: 'agend-ter-jam-2',
    turnoId: 'turno-jam-ter',
    consultorId: 'cons-2',
    alunoId: 'aluno-5', // Pedro Henrique
    diaSemana: 'Terça',
    tipo: 'Diagnostico_1h',
    data: '2026-10-20',
    horarioInicio: '15:00',
    horarioFim: '16:00',
    status: 'Confirmado',
    sessaoNumero: 1,
    observacao: '1º Encontro: Diagnóstico de Demanda e Clientes',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 02 Presencial'
  },
  {
    id: 'agend-ter-jam-3',
    turnoId: 'turno-jam-ter',
    consultorId: 'cons-2',
    alunoId: 'aluno-1', // Arthur Silva
    diaSemana: 'Terça',
    tipo: 'Diagnostico_1h',
    data: '2026-10-20',
    horarioInicio: '16:00',
    horarioFim: '17:00',
    status: 'Confirmado',
    sessaoNumero: 1,
    observacao: '1º Encontro: Diagnóstico de Delivery e Cardápio',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 02 Presencial'
  },
  {
    id: 'agend-ter-jam-4',
    turnoId: 'turno-jam-ter',
    consultorId: 'cons-2',
    alunoId: 'aluno-4', // Juliana Mendes
    diaSemana: 'Terça',
    tipo: 'Diagnostico_1h',
    data: '2026-10-20',
    horarioInicio: '17:00',
    horarioFim: '18:00',
    status: 'Confirmado',
    sessaoNumero: 1,
    observacao: '1º Encontro: Diagnóstico de Embalagens e Venda Direta',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 02 Presencial'
  },

  // ==========================================================================
  // QUARTA-FEIRA (21/10/2026 - HOJE) - TOTAL: 8 HORAS (4h Aline + 4h Jamile)
  // ==========================================================================
  // Aline Ferreira (08:00 - 12:00 • 4h) -> Combinação A: 2 Mentorias (2h + 2h = 4h)
  {
    id: 'agend-qua-ali-1',
    turnoId: 'turno-ali-qua',
    consultorId: 'cons-1',
    alunoId: 'aluno-1', // Arthur Silva
    diaSemana: 'Quarta',
    tipo: 'Mentoria_2h',
    data: '2026-10-21',
    horarioInicio: '08:00',
    horarioFim: '10:00',
    status: 'Confirmado',
    sessaoNumero: 3,
    observacao: 'Sessão 3: Precificação, CMV e Margem de Contribuição',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 01 Presencial'
  },
  {
    id: 'agend-qua-ali-2',
    turnoId: 'turno-ali-qua',
    consultorId: 'cons-1',
    alunoId: 'aluno-2', // Mariana Costa
    diaSemana: 'Quarta',
    tipo: 'Mentoria_2h',
    data: '2026-10-21',
    horarioInicio: '10:00',
    horarioFim: '12:00',
    status: 'Confirmado',
    sessaoNumero: 5,
    observacao: 'Sessão 5: Emissão de Nota Fiscal & Acompanhamento MEI',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 01 Presencial'
  },

  // Jamile Mendes (14:00 - 18:00 • 4h) -> Combinação C: 1 Mentoria (2h) + 2 Diagnósticos (1h + 1h)
  {
    id: 'agend-qua-jam-1',
    turnoId: 'turno-jam-qua',
    consultorId: 'cons-2',
    alunoId: 'aluno-4', // Juliana Mendes
    diaSemana: 'Quarta',
    tipo: 'Diagnostico_1h',
    data: '2026-10-21',
    horarioInicio: '14:00',
    horarioFim: '15:00',
    status: 'Confirmado',
    sessaoNumero: 1,
    observacao: '1º Encontro: Diagnóstico de Mercado e Público-Alvo',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 02 Presencial'
  },
  {
    id: 'agend-qua-jam-2',
    turnoId: 'turno-jam-qua',
    consultorId: 'cons-2',
    alunoId: 'aluno-5', // Pedro Henrique
    diaSemana: 'Quarta',
    tipo: 'Diagnostico_1h',
    data: '2026-10-21',
    horarioInicio: '15:00',
    horarioFim: '16:00',
    status: 'Confirmado',
    sessaoNumero: 1,
    observacao: '1º Encontro: Diagnóstico de Contratos e Serviços',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 02 Presencial'
  },
  {
    id: 'agend-qua-jam-3',
    turnoId: 'turno-jam-qua',
    consultorId: 'cons-2',
    alunoId: 'aluno-1', // Arthur Silva
    diaSemana: 'Quarta',
    tipo: 'Mentoria_2h',
    data: '2026-10-21',
    horarioInicio: '16:00',
    horarioFim: '18:00',
    status: 'Confirmado',
    sessaoNumero: 3,
    observacao: 'Sessão 3: Canais Digitais e Fechamento com Clientes B2B',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 02 Presencial'
  },

  // ==========================================================================
  // QUINTA-FEIRA (22/10/2026) - TOTAL: 8 HORAS (4h Aline + 4h Jamile)
  // ==========================================================================
  // Aline Ferreira (08:00 - 12:00 • 4h) -> Combinação C: 1 Mentoria (2h) + 2 Diagnósticos (1h + 1h)
  {
    id: 'agend-qui-ali-1',
    turnoId: 'turno-ali-qui',
    consultorId: 'cons-1',
    alunoId: 'aluno-5', // Pedro Henrique
    diaSemana: 'Quinta',
    tipo: 'Mentoria_2h',
    data: '2026-10-22',
    horarioInicio: '08:00',
    horarioFim: '10:00',
    status: 'Confirmado',
    sessaoNumero: 5,
    observacao: 'Sessão 5: Formalização MEI & Pós-Ciclo',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 01 Presencial'
  },
  {
    id: 'agend-qui-ali-2',
    turnoId: 'turno-ali-qui',
    consultorId: 'cons-1',
    alunoId: 'aluno-2', // Mariana Costa
    diaSemana: 'Quinta',
    tipo: 'Diagnostico_1h',
    data: '2026-10-22',
    horarioInicio: '10:00',
    horarioFim: '11:00',
    status: 'Confirmado',
    sessaoNumero: 1,
    observacao: '1º Encontro: Diagnóstico de Custo Fixo e Variável',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 01 Presencial'
  },
  {
    id: 'agend-qui-ali-3',
    turnoId: 'turno-ali-qui',
    consultorId: 'cons-1',
    alunoId: 'aluno-4', // Juliana Mendes
    diaSemana: 'Quinta',
    tipo: 'Diagnostico_1h',
    data: '2026-10-22',
    horarioInicio: '11:00',
    horarioFim: '12:00',
    status: 'Confirmado',
    sessaoNumero: 1,
    observacao: '1º Encontro: Custos de Insumos da Confeitaria',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 01 Presencial'
  },

  // Jamile Mendes (14:00 - 18:00 • 4h) -> Combinação A: 2 Mentorias (2h + 2h)
  {
    id: 'agend-qui-jam-1',
    turnoId: 'turno-jam-qui',
    consultorId: 'cons-2',
    alunoId: 'aluno-1', // Arthur Silva
    diaSemana: 'Quinta',
    tipo: 'Mentoria_2h',
    data: '2026-10-22',
    horarioInicio: '14:00',
    horarioFim: '16:00',
    status: 'Confirmado',
    sessaoNumero: 4,
    observacao: 'Sessão 4: Pitch de Vendas e Negociação com Empresas',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 02 Presencial'
  },
  {
    id: 'agend-qui-jam-2',
    turnoId: 'turno-jam-qui',
    consultorId: 'cons-2',
    alunoId: null, // Vaga de 2h aberta para encaixe sem ociosidade
    diaSemana: 'Quinta',
    tipo: 'Mentoria_2h',
    data: '2026-10-22',
    horarioInicio: '16:00',
    horarioFim: '18:00',
    status: 'Disponivel',
    sessaoNumero: 1,
    observacao: 'Horário de 2h livre reservado para nova mentoria sem ociosidade',
    whatsappStatus: 'Vaga Aberta',
    sala: 'Sala 02 Presencial'
  },

  // ==========================================================================
  // SEXTA-FEIRA (23/10/2026) - TOTAL: 8 HORAS (4h Aline + 4h Jamile)
  // ==========================================================================
  // Aline Ferreira (08:00 - 12:00 • 4h) -> Combinação A: 2 Mentorias (2h + 2h)
  {
    id: 'agend-sex-ali-1',
    turnoId: 'turno-ali-sex',
    consultorId: 'cons-1',
    alunoId: 'aluno-1', // Arthur Silva
    diaSemana: 'Sexta',
    tipo: 'Mentoria_2h',
    data: '2026-10-23',
    horarioInicio: '08:00',
    horarioFim: '10:00',
    status: 'Confirmado',
    sessaoNumero: 4,
    observacao: 'Sessão 4: Gestão de Contas PJ e Capital de Giro',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 01 Presencial'
  },
  {
    id: 'agend-sex-ali-2',
    turnoId: 'turno-ali-sex',
    consultorId: 'cons-1',
    alunoId: 'aluno-2', // Mariana Costa
    diaSemana: 'Sexta',
    tipo: 'Mentoria_2h',
    data: '2026-10-23',
    horarioInicio: '10:00',
    horarioFim: '12:00',
    status: 'Confirmado',
    sessaoNumero: 5,
    observacao: 'Sessão 5: Emissão de Nota Fiscal & Acompanhamento MEI',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 01 Presencial'
  },

  // Jamile Mendes (14:00 - 18:00 • 4h) -> Combinação A: 2 Mentorias (2h + 2h)
  {
    id: 'agend-sex-jam-1',
    turnoId: 'turno-jam-sex',
    consultorId: 'cons-2',
    alunoId: 'aluno-4', // Juliana Mendes
    diaSemana: 'Sexta',
    tipo: 'Mentoria_2h',
    data: '2026-10-23',
    horarioInicio: '14:00',
    horarioFim: '16:00',
    status: 'Confirmado',
    sessaoNumero: 3,
    observacao: 'Sessão 3: Parcerias Comerciais e Divulgação',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 02 Presencial'
  },
  {
    id: 'agend-sex-jam-2',
    turnoId: 'turno-jam-sex',
    consultorId: 'cons-2',
    alunoId: 'aluno-5', // Pedro Henrique
    diaSemana: 'Sexta',
    tipo: 'Mentoria_2h',
    data: '2026-10-23',
    horarioInicio: '16:00',
    horarioFim: '18:00',
    status: 'Confirmado',
    sessaoNumero: 4,
    observacao: 'Sessão 4: Contratos e Documentação de Serviços',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 02 Presencial'
  },

  // ==========================================================================
  // SÁBADO (24/10/2026) - TOTAL: 8 HORAS (4h Aline + 4h Jamile)
  // ==========================================================================
  // Aline Ferreira (08:00 - 12:00 • 4h) -> Combinação A: 2 Mentorias (2h + 2h)
  {
    id: 'agend-sab-ali-1',
    turnoId: 'turno-ali-sab',
    consultorId: 'cons-1',
    alunoId: 'aluno-4', // Juliana Mendes
    diaSemana: 'Sábado',
    tipo: 'Mentoria_2h',
    data: '2026-10-24',
    horarioInicio: '08:00',
    horarioFim: '10:00',
    status: 'Confirmado',
    sessaoNumero: 3,
    observacao: 'Sessão 3: Organização de Estoque & Perdas',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 01 Presencial'
  },
  {
    id: 'agend-sab-ali-2',
    turnoId: 'turno-ali-sab',
    consultorId: 'cons-1',
    alunoId: 'aluno-1', // Arthur Silva
    diaSemana: 'Sábado',
    tipo: 'Mentoria_2h',
    data: '2026-10-24',
    horarioInicio: '10:00',
    horarioFim: '12:00',
    status: 'Confirmado',
    sessaoNumero: 5,
    observacao: 'Sessão 5: Conclusão do Plano de Negócio e Metas',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 01 Presencial'
  },

  // Jamile Mendes (14:00 - 18:00 • 4h) -> Combinação C: 1 Mentoria (2h) + 2 Diagnósticos (1h + 1h)
  {
    id: 'agend-sab-jam-1',
    turnoId: 'turno-jam-sab',
    consultorId: 'cons-2',
    alunoId: 'aluno-2', // Mariana Costa
    diaSemana: 'Sábado',
    tipo: 'Mentoria_2h',
    data: '2026-10-24',
    horarioInicio: '14:00',
    horarioFim: '16:00',
    status: 'Confirmado',
    sessaoNumero: 4,
    observacao: 'Sessão 4: Gestão de Vendas em Feiras e E-commerce',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 02 Presencial'
  },
  {
    id: 'agend-sab-jam-2',
    turnoId: 'turno-jam-sab',
    consultorId: 'cons-2',
    alunoId: null,
    diaSemana: 'Sábado',
    tipo: 'Diagnostico_1h',
    data: '2026-10-24',
    horarioInicio: '16:00',
    horarioFim: '17:00',
    status: 'Disponivel',
    sessaoNumero: 1,
    observacao: 'Vaga de 1h aberta para 1º Encontro / Diagnóstico',
    whatsappStatus: 'Vaga Aberta',
    sala: 'Sala 02 Presencial'
  },
  {
    id: 'agend-sab-jam-3',
    turnoId: 'turno-jam-sab',
    consultorId: 'cons-2',
    alunoId: null,
    diaSemana: 'Sábado',
    tipo: 'Diagnostico_1h',
    data: '2026-10-24',
    horarioInicio: '17:00',
    horarioFim: '18:00',
    status: 'Disponivel',
    sessaoNumero: 1,
    observacao: 'Vaga de 1h aberta para 1º Encontro / Diagnóstico',
    whatsappStatus: 'Vaga Aberta',
    sala: 'Sala 02 Presencial'
  }
];

export const INITIAL_DIARIOS = [
  {
    id: 'diario-1',
    alunoId: 'aluno-1',
    consultorId: 'cons-1',
    sessaoNumero: 1,
    dataRegistro: '2026-09-24',
    tipo: 'Diagnostico_1h',
    diagnostico: 'Negócio de marmitas delivery. Não possui controle de custos, mistura conta física e jurídica. Alta demanda mas margem incerta.',
    tarefasProximoEncontro: '1. Separar contas pessoais e do negócio\n2. Anotar todos os gastos de insumos da semana em planilha',
    linksMateriais: 'https://drive.google.com/exemplo-planilha-gastos-senac',
    statusMei: 'Informal',
    consultorNome: 'Aline Ferreira'
  },
  {
    id: 'diario-2',
    alunoId: 'aluno-1',
    consultorId: 'cons-1',
    sessaoNumero: 2,
    dataRegistro: '2026-10-08',
    tipo: 'Mentoria_2h',
    diagnostico: 'Arthur trouxe a relação de despesas. Identificamos que a embalagem custava 18% do preço de venda. Ajustamos cardápio.',
    tarefasProximoEncontro: '1. Orçar fornecedores alternativos de embalagens sustentáveis\n2. Fazer ficha técnica dos 3 pratos mais vendidos',
    linksMateriais: 'https://drive.google.com/exemplo-ficha-tecnica-culinaria',
    statusMei: 'Informal (estudando viabilidade de MEI)',
    consultorNome: 'Aline Ferreira'
  },
  {
    id: 'diario-3',
    alunoId: 'aluno-2', // Mariana
    consultorId: 'cons-1',
    sessaoNumero: 5,
    dataRegistro: '2026-09-30',
    tipo: 'Mentoria_2h',
    diagnostico: 'Ciclo finalizado com êxito! Ateliê registrou MEI na 4ª sessão. Margem de lucro subiu para 32%. Emitiu primeira NF.',
    tarefasProximoEncontro: 'Manter controle mensal de faturamento para declaração anual DASN-SIMEI.',
    linksMateriais: 'https://gov.br/empresas-e-negocios/mei-guia-pratico',
    statusMei: 'Formalizado (CNPJ 45.123.789/0001-90)',
    consultorNome: 'Aline Ferreira'
  }
];
