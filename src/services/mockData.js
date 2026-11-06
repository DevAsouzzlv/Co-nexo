// src/services/mockData.js
// Dados iniciais realistas para o MVP do Co.Nexo SENAC

export const INITIAL_CONSULTORS = [
  {
    id: 'cons-1',
    nome: 'Aline Ferreira',
    email: 'aline.consultora@sp.senac.br',
    especialidade: 'Finanças & Gestão Operacional',
    sala: 'Sala 02 Presencial',
    turnos: [
      {
        id: 'turno-seg',
        diaSemana: 'Segunda-feira',
        data: '2026-10-19',
        horarioInicio: '14:00',
        horarioFim: '18:00',
        capacidadeHoras: 4,
        ocupacaoPercentual: 75
      },
      {
        id: 'turno-ter',
        diaSemana: 'Terça-feira',
        data: '2026-10-20',
        horarioInicio: '14:00',
        horarioFim: '18:00',
        capacidadeHoras: 4,
        ocupacaoPercentual: 100
      },
      {
        id: 'turno-1',
        diaSemana: 'Quarta-feira',
        data: '2026-10-21',
        horarioInicio: '14:00',
        horarioFim: '18:00',
        capacidadeHoras: 4,
        ocupacaoPercentual: 100
      },
      {
        id: 'turno-qui',
        diaSemana: 'Quinta-feira',
        data: '2026-10-22',
        horarioInicio: '14:00',
        horarioFim: '18:00',
        capacidadeHoras: 4,
        ocupacaoPercentual: 50
      },
      {
        id: 'turno-2',
        diaSemana: 'Sexta-feira',
        data: '2026-10-23',
        horarioInicio: '08:00',
        horarioFim: '12:00',
        capacidadeHoras: 4,
        ocupacaoPercentual: 100
      },
      {
        id: 'turno-sab',
        diaSemana: 'Sábado',
        data: '2026-10-24',
        horarioInicio: '08:00',
        horarioFim: '12:00',
        capacidadeHoras: 4,
        ocupacaoPercentual: 0
      }
    ]
  },
  {
    id: 'cons-2',
    nome: 'Roberto Souza',
    email: 'roberto.souza@sp.senac.br',
    especialidade: 'Vendas & Estratégia de Mercado',
    sala: 'Sala 03 Presencial',
    turnos: [
      {
        id: 'turno-rob-1',
        diaSemana: 'Terça-feira',
        data: '2026-10-20',
        horarioInicio: '08:00',
        horarioFim: '12:00',
        capacidadeHoras: 4,
        ocupacaoPercentual: 100
      },
      {
        id: 'turno-rob-2',
        diaSemana: 'Quinta-feira',
        data: '2026-10-22',
        horarioInicio: '14:00',
        horarioFim: '18:00',
        capacidadeHoras: 4,
        ocupacaoPercentual: 100
      }
    ]
  },
  {
    id: 'cons-3',
    nome: 'Camila Santos',
    email: 'camila.santos@sp.senac.br',
    especialidade: 'Formalização MEI & Alvarás',
    sala: 'Balcão do Empreendedor',
    turnos: [
      {
        id: 'turno-cam-1',
        diaSemana: 'Quarta-feira',
        data: '2026-10-21',
        horarioInicio: '08:00',
        horarioFim: '12:00',
        capacidadeHoras: 4,
        ocupacaoPercentual: 100
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
  // Segunda-feira (14h-18h)
  {
    id: 'agend-seg-1',
    turnoId: 'turno-seg',
    consultorId: 'cons-1',
    alunoId: 'aluno-5', // Pedro Henrique
    diaSemana: 'Segunda',
    tipo: 'Mentoria_2h',
    data: '2026-10-19',
    horarioInicio: '14:00',
    horarioFim: '16:00',
    status: 'Confirmado',
    sessaoNumero: 4,
    observacao: 'Sessão 4: Fluxo de Caixa e Capital de Giro',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 02 Presencial'
  },
  {
    id: 'agend-seg-2',
    turnoId: 'turno-seg',
    consultorId: 'cons-1',
    alunoId: 'aluno-2', // Mariana Costa
    diaSemana: 'Segunda',
    tipo: 'Diagnostico_1h',
    data: '2026-10-19',
    horarioInicio: '16:00',
    horarioFim: '17:00',
    status: 'Confirmado',
    sessaoNumero: 1,
    observacao: 'Diagnóstico e Precificação',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 02 Presencial'
  },
  {
    id: 'agend-seg-3',
    turnoId: 'turno-seg',
    consultorId: 'cons-1',
    alunoId: null, // Vaga aberta
    diaSemana: 'Segunda',
    tipo: 'Diagnostico_1h',
    data: '2026-10-19',
    horarioInicio: '17:00',
    horarioFim: '18:00',
    status: 'Disponivel',
    sessaoNumero: 1,
    observacao: 'Horário vago disponível para encaixe imediato',
    whatsappStatus: 'Vaga Aberta',
    sala: 'Sala 02 Presencial'
  },

  // Terça-feira (14h-18h)
  {
    id: 'agend-ter-1',
    turnoId: 'turno-ter',
    consultorId: 'cons-1',
    alunoId: 'aluno-4', // Juliana Mendes
    diaSemana: 'Terça',
    tipo: 'Mentoria_2h',
    data: '2026-10-20',
    horarioInicio: '14:00',
    horarioFim: '16:00',
    status: 'Confirmado',
    sessaoNumero: 2,
    observacao: 'Sessão 2: Ficha Técnica e Custos de Produção',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 02 Presencial'
  },
  {
    id: 'agend-ter-2',
    turnoId: 'turno-ter',
    consultorId: 'cons-1',
    alunoId: 'aluno-1', // Arthur Silva
    diaSemana: 'Terça',
    tipo: 'Mentoria_2h',
    data: '2026-10-20',
    horarioInicio: '16:00',
    horarioFim: '18:00',
    status: 'Confirmado',
    sessaoNumero: 2,
    observacao: 'Sessão 2: Formação de Preço de Venda',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 02 Presencial'
  },

  // Quarta-feira (14h-18h - Hoje)
  {
    id: 'agend-1',
    turnoId: 'turno-1',
    consultorId: 'cons-1',
    alunoId: 'aluno-4', // Juliana Mendes
    diaSemana: 'Quarta',
    tipo: 'Diagnostico_1h',
    data: '2026-10-21',
    horarioInicio: '14:00',
    horarioFim: '15:00',
    status: 'Confirmado',
    sessaoNumero: 1,
    observacao: 'Primeiro diagnóstico de negócios',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 02 Presencial'
  },
  {
    id: 'agend-2',
    turnoId: 'turno-1',
    consultorId: 'cons-1',
    alunoId: null, // Vaga disponível
    diaSemana: 'Quarta',
    tipo: 'Diagnostico_1h',
    data: '2026-10-21',
    horarioInicio: '15:00',
    horarioFim: '16:00',
    status: 'Disponivel',
    sessaoNumero: 1,
    observacao: 'Vaga reservada pelo algoritmo anti-ociosidade (Par de 1h)',
    whatsappStatus: 'Vaga Aberta',
    sala: 'Sala 02 Presencial'
  },
  {
    id: 'agend-3',
    turnoId: 'turno-1',
    consultorId: 'cons-1',
    alunoId: 'aluno-1', // Arthur Silva
    diaSemana: 'Quarta',
    tipo: 'Mentoria_2h',
    data: '2026-10-21',
    horarioInicio: '16:00',
    horarioFim: '18:00',
    status: 'Confirmado',
    sessaoNumero: 3,
    observacao: 'Sessão 3: Precificação e Margem de Contribuição',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 02 Presencial'
  },

  // Quinta-feira (14h-18h)
  {
    id: 'agend-qui-1',
    turnoId: 'turno-qui',
    consultorId: 'cons-1',
    alunoId: 'aluno-5', // Pedro Henrique
    diaSemana: 'Quinta',
    tipo: 'Mentoria_2h',
    data: '2026-10-22',
    horarioInicio: '14:00',
    horarioFim: '16:00',
    status: 'Confirmado',
    sessaoNumero: 5,
    observacao: 'Sessão 5: Formalização MEI & Pós-Ciclo',
    whatsappStatus: 'Confirmado via WhatsApp',
    sala: 'Sala 02 Presencial'
  },
  {
    id: 'agend-qui-2',
    turnoId: 'turno-qui',
    consultorId: 'cons-1',
    alunoId: null,
    diaSemana: 'Quinta',
    tipo: 'Mentoria_2h',
    data: '2026-10-22',
    horarioInicio: '16:00',
    horarioFim: '18:00',
    status: 'Disponivel',
    sessaoNumero: 1,
    observacao: 'Horário de 2h livre para novo mentorado',
    whatsappStatus: 'Vaga Aberta',
    sala: 'Sala 02 Presencial'
  },

  // Sexta-feira (08h-12h)
  {
    id: 'agend-sex-1',
    turnoId: 'turno-2',
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
    sala: 'Sala 02 Presencial'
  },
  {
    id: 'agend-sex-2',
    turnoId: 'turno-2',
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
    sala: 'Sala 02 Presencial'
  },

  // Sábado (08h-12h)
  {
    id: 'agend-sab-1',
    turnoId: 'turno-sab',
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
    sala: 'Sala 02 Presencial'
  },
  {
    id: 'agend-sab-2',
    turnoId: 'turno-sab',
    consultorId: 'cons-1',
    alunoId: null,
    diaSemana: 'Sábado',
    tipo: 'Mentoria_2h',
    data: '2026-10-24',
    horarioInicio: '10:00',
    horarioFim: '12:00',
    status: 'Disponivel',
    sessaoNumero: 1,
    observacao: 'Vaga livre para atendimento de sábado',
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
