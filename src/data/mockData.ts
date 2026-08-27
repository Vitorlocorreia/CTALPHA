import { Student, WorkoutRoutine, WorkoutTemplate, CheckInLog, Lead, FinancialMetric } from '../types';

export const GYM_INFO = {
  name: 'ALPHA Centro de Treinamento',
  tagline: 'Musculação • Crossfit • Lutas • Treinamento Funcional',
  addressUnit1: 'Rua Marechal Deodoro da Fonseca, 150 - Centro, Aliança - PE',
  addressUnit2: 'Av. Gen. Antônio Coelho, 420 - Unidade 2, Aliança - PE',
  phone: '(81) 99892-9667',
  hours: 'Seg a Sex: 05:00 às 22:00 | Sáb: 06:00 às 16:00 | Dom: 08:00 às 12:00',
  instagram: '@academiactalpha',
  monthlyPlanCostG3: 300,
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    name: 'Carlos Henrique Bezerra',
    cpf: '042.891.234-55',
    phone: '(81) 99812-4411',
    email: 'carlos.bezerra@email.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    unit: 'unidade-1',
    planName: 'Plano Alpha VIP Recorrente (Livre)',
    planValue: 149.90,
    paymentStatus: 'adimplente',
    dueDate: '2026-09-05',
    modalities: ['musculacao', 'crossfit'],
    lastCheckIn: 'Hoje às 06:45',
    biotype: 'mesomorfo',
    goal: 'hipertrofia',
    height: 178,
    weight: 82,
    restrictions: ['Nenhuma'],
    createdAt: '2023-03-12',
    source: 'G3 (Importado)'
  },
  {
    id: 'std-2',
    name: 'Beatriz Vasconcelos Melo',
    cpf: '071.233.987-10',
    phone: '(81) 99745-8822',
    email: 'beatriz.melo@email.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    unit: 'unidade-1',
    planName: 'Plano Crossfit + Musculação',
    planValue: 129.90,
    paymentStatus: 'vencendo',
    dueDate: '2026-08-28',
    modalities: ['crossfit', 'musculacao'],
    lastCheckIn: 'Hoje às 07:15',
    biotype: 'ectomorfo',
    goal: 'condicionamento',
    height: 165,
    weight: 58,
    restrictions: ['Condromalácia Patelar (Joelho Leve)'],
    createdAt: '2024-01-15',
    source: 'G3 (Importado)'
  },
  {
    id: 'std-3',
    name: 'Marcos Vinícius Santana',
    cpf: '088.456.123-99',
    phone: '(81) 98833-1100',
    email: 'marcos.santana@email.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    unit: 'unidade-2',
    planName: 'Plano Lutas (Muay Thai & Jiu-Jitsu)',
    planValue: 119.90,
    paymentStatus: 'atrasado',
    daysLate: 4,
    dueDate: '2026-08-22',
    modalities: ['luta'],
    lastCheckIn: 'Ontem às 19:30',
    biotype: 'endomorfo',
    goal: 'performance_luta',
    height: 181,
    weight: 94,
    restrictions: ['Lombalgia Leve'],
    createdAt: '2023-08-20',
    source: 'G3 (Importado)'
  },
  {
    id: 'std-4',
    name: 'Juliana Paes Cavalcanti',
    cpf: '095.344.890-44',
    phone: '(81) 99654-3321',
    email: 'juliana.cavalcanti@email.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    unit: 'unidade-1',
    planName: 'Plano Musculação Prime',
    planValue: 99.90,
    paymentStatus: 'adimplente',
    dueDate: '2026-09-10',
    modalities: ['musculacao'],
    lastCheckIn: 'Hoje às 08:30',
    biotype: 'mesomorfo',
    goal: 'emagrecimento',
    height: 160,
    weight: 62,
    restrictions: ['Nenhuma'],
    createdAt: '2025-02-10',
    source: 'Novo Cadastro'
  },
  {
    id: 'std-5',
    name: 'Rodrigo Alencar Lima',
    cpf: '066.789.012-33',
    phone: '(81) 99122-8765',
    email: 'rodrigo.alencar@email.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    unit: 'unidade-2',
    planName: 'Plano Alpha VIP Recorrente',
    planValue: 149.90,
    paymentStatus: 'adimplente',
    dueDate: '2026-09-02',
    modalities: ['musculacao', 'crossfit', 'luta'],
    lastCheckIn: 'Hoje às 06:10',
    biotype: 'mesomorfo',
    goal: 'hipertrofia',
    height: 175,
    weight: 79,
    restrictions: ['Ombro Direito (Evitar Elevação Lateral Pesada)'],
    createdAt: '2023-11-05',
    source: 'G3 (Importado)',
  },
  {
    id: 'std-6',
    name: 'Larissa Manoela Farias',
    cpf: '053.678.990-21',
    phone: '(81) 99433-2211',
    email: 'larissa.farias@email.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    unit: 'unidade-1',
    planName: 'Plano Crossfit Box Matriz',
    planValue: 139.90,
    paymentStatus: 'atrasado',
    daysLate: 6,
    dueDate: '2026-08-20',
    modalities: ['crossfit'],
    lastCheckIn: 'Há 3 dias',
    biotype: 'ectomorfo',
    goal: 'condicionamento',
    height: 168,
    weight: 59,
    restrictions: ['Nenhuma'],
    createdAt: '2024-06-18',
    source: 'G3 (Importado)',
  }
];

export const INITIAL_CHECKINS: CheckInLog[] = [
  {
    id: 'chk-1',
    studentId: 'std-1',
    studentName: 'Carlos Henrique Bezerra',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    unit: 'unidade-1',
    modality: 'crossfit',
    timestamp: 'Há 5 minutos (06:45)',
    status: 'liberado',
  },
  {
    id: 'chk-2',
    studentId: 'std-5',
    studentName: 'Rodrigo Alencar Lima',
    studentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    unit: 'unidade-2',
    modality: 'musculacao',
    timestamp: 'Há 12 minutos (06:38)',
    status: 'liberado',
  },
  {
    id: 'chk-3',
    studentId: 'std-2',
    studentName: 'Beatriz Vasconcelos Melo',
    studentAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    unit: 'unidade-1',
    modality: 'musculacao',
    timestamp: 'Há 25 minutos (06:25)',
    status: 'aviso',
  },
  {
    id: 'chk-4',
    studentId: 'std-4',
    studentName: 'Juliana Paes Cavalcanti',
    studentAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    unit: 'unidade-1',
    modality: 'musculacao',
    timestamp: 'Há 40 minutos (06:10)',
    status: 'liberado',
  },
  {
    id: 'chk-5',
    studentId: 'std-3',
    studentName: 'Marcos Vinícius Santana',
    studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    unit: 'unidade-2',
    modality: 'luta',
    timestamp: 'Tentativa de Acesso',
    status: 'bloqueado',
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Mateus Albuquerque',
    phone: '(81) 99877-6655',
    interest: 'crossfit',
    unit: 'unidade-1',
    status: 'experimental_agendada',
    source: 'IA Comercial (Site)',
    createdAt: 'Hoje às 00:15',
    notes: 'Quer fazer aula experimental de Crossfit no Box Unidade 1 amanhã às 19h.',
  },
  {
    id: 'lead-2',
    name: 'Camila Fernandes',
    phone: '(81) 98711-2233',
    interest: 'luta',
    unit: 'unidade-1',
    status: 'novo',
    source: 'WhatsApp IA',
    createdAt: 'Hoje às 00:30',
    notes: 'Perguntou horários de Muay Thai feminino.',
  },
  {
    id: 'lead-3',
    name: 'Gabriel Tavares',
    phone: '(81) 99234-8899',
    interest: 'completo',
    unit: 'unidade-2',
    status: 'contatado',
    source: 'IA Comercial (Site)',
    createdAt: 'Ontem às 21:40',
    notes: 'Interessado no Plano VIP com livre acesso às duas unidades.',
  }
];

export const SAMPLE_WORKOUT_ROUTINES: WorkoutRoutine[] = [
  {
    id: 'wkt-1',
    studentId: 'std-1',
    studentName: 'Carlos Henrique Bezerra',
    biotype: 'mesomorfo',
    goal: 'hipertrofia',
    status: 'aprovado_coach',
    coachName: 'Coach Diego (Head Coach Alpha)',
    divisionName: 'Divisão ABC (Hipertrofia & Potência)',
    generatedAt: '2026-08-20',
    approvedAt: '2026-08-20 14:30',
    groups: [
      {
        letter: 'A',
        title: 'Treino A: Peitoral, Tríceps & Ombro Anterior',
        targetMuscles: 'Peito, Deltoide Anterior e Tríceps',
        exercises: [
          { id: 'ex-1', name: 'Supino Reto com Barra', category: 'peito', sets: 4, reps: '8 a 10', restSeconds: 90, notes: 'Progressão de carga com cadência 2-0-2' },
          { id: 'ex-2', name: 'Supino Inclinado com Halteres', category: 'peito', sets: 4, reps: '10 a 12', restSeconds: 75, notes: 'Banco a 30 graus, amplitude máxima' },
          { id: 'ex-3', name: 'Crucifixo na Polia Média', category: 'peito', sets: 3, reps: '12 a 15', restSeconds: 60, notes: 'Pico de contração de 1s no centro' },
          { id: 'ex-4', name: 'Desenvolvimento Militar com Halteres', category: 'ombros', sets: 4, reps: '10', restSeconds: 75 },
          { id: 'ex-5', name: 'Tríceps Corda na Polia Alta', category: 'bracos', sets: 4, reps: '12 a 15', restSeconds: 60, notes: 'Abertura final na extensão' }
        ]
      },
      {
        letter: 'B',
        title: 'Treino B: Dorsal, Bíceps & Deltoide Posterior',
        targetMuscles: 'Costas, Trapézio, Bíceps e Antebraço',
        exercises: [
          { id: 'ex-6', name: 'Puxada Alta Pronada', category: 'costas', sets: 4, reps: '10 a 12', restSeconds: 75 },
          { id: 'ex-7', name: 'Remada Baixa Triângulo', category: 'costas', sets: 4, reps: '10', restSeconds: 75 },
          { id: 'ex-8', name: 'Crucifixo Inverso no Peck Deck', category: 'ombros', sets: 3, reps: '15', restSeconds: 60 },
          { id: 'ex-9', name: 'Rosca Direta com Barra W', category: 'bracos', sets: 4, reps: '10 a 12', restSeconds: 60 }
        ]
      },
      {
        letter: 'C',
        title: 'Treino C: Membros Inferiores & Core',
        targetMuscles: 'Quadríceps, Isquiotibiais, Glúteos e Panturrilha',
        exercises: [
          { id: 'ex-10', name: 'Agachamento Livre com Barra', category: 'pernas', sets: 4, reps: '8 a 10', restSeconds: 120, notes: 'Base firme, descida controlada' },
          { id: 'ex-11', name: 'Leg Press 45º', category: 'pernas', sets: 4, reps: '12', restSeconds: 90 },
          { id: 'ex-12', name: 'Cadeira Extensora', category: 'pernas', sets: 3, reps: '12 + Drop-set', restSeconds: 60 },
          { id: 'ex-13', name: 'Mesa Flexora', category: 'pernas', sets: 4, reps: '10 a 12', restSeconds: 60 },
          { id: 'ex-14', name: 'Panturrilha Sentado', category: 'pernas', sets: 4, reps: '15 a 20', restSeconds: 45 }
        ]
      }
    ]
  }
];

export const INITIAL_WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Periodização Hipertrofia Estrutural Base (ABCD)',
    description: 'Divisão clássica de alta tensão mecânica com descanso otimizado por grupo muscular. Foco em ganhos sólidos de massa magra.',
    goal: 'hipertrofia',
    level: 'intermediario',
    frequencyDays: 4,
    divisionName: 'ABCD',
    targetBiotype: 'todos',
    restrictionsSafe: ['Nenhuma'],
    coachAuthor: 'Coach Diego',
    createdAt: '2026-08-15',
    usageCount: 28,
    groups: [
      {
        letter: 'A',
        title: 'Treino A: Peitoral, Deltoide Anterior & Tríceps (Push)',
        targetMuscles: 'Peitoral Maior, Deltoide Anterior, Deltoide Lateral, Tríceps Braquial',
        exercises: [
          { id: 'ex-t1', name: 'Supino Reto com Barra', category: 'peito', sets: 4, reps: '8 a 10', restSeconds: 90, notes: 'Progressão gradual de carga' },
          { id: 'ex-t2', name: 'Supino Inclinado com Halteres', category: 'peito', sets: 4, reps: '10 a 12', restSeconds: 75, notes: 'Banco a 30 graus, amplitude máxima' },
          { id: 'ex-t3', name: 'Crossover na Polia Média', category: 'peito', sets: 3, reps: '12 a 15', restSeconds: 60, notes: 'Pico de contração de 1s' },
          { id: 'ex-t4', name: 'Desenvolvimento Militar com Halteres', category: 'ombros', sets: 4, reps: '10', restSeconds: 75 },
          { id: 'ex-t5', name: 'Elevação Lateral com Halteres', category: 'ombros', sets: 4, reps: '12 a 15', restSeconds: 45 },
          { id: 'ex-t6', name: 'Tríceps Pulley na Corda', category: 'bracos', sets: 4, reps: '12', restSeconds: 60 }
        ]
      },
      {
        letter: 'B',
        title: 'Treino B: Dorsal, Trapézio & Bíceps (Pull)',
        targetMuscles: 'Latíssimo do Dorso, Romboide, Trapézio, Bíceps Braquial',
        exercises: [
          { id: 'ex-t7', name: 'Puxada Frontal na Barra Aberta', category: 'costas', sets: 4, reps: '10 a 12', restSeconds: 75 },
          { id: 'ex-t8', name: 'Remada Curvada com Barra', category: 'costas', sets: 4, reps: '10', restSeconds: 75 },
          { id: 'ex-t9', name: 'Remada Baixa no Triângulo', category: 'costas', sets: 3, reps: '12', restSeconds: 60 },
          { id: 'ex-t10', name: 'Crucifixo Invertido no Voador', category: 'ombros', sets: 3, reps: '15', restSeconds: 45 },
          { id: 'ex-t11', name: 'Rosca Direta com Barra W', category: 'bracos', sets: 4, reps: '10 a 12', restSeconds: 60 },
          { id: 'ex-t12', name: 'Rosca Martelo com Halteres', category: 'bracos', sets: 3, reps: '12', restSeconds: 45 }
        ]
      },
      {
        letter: 'C',
        title: 'Treino C: Membros Inferiores Completo (Legs)',
        targetMuscles: 'Quadríceps, Isquiotibiais, Glúteos, Panturrilhas',
        exercises: [
          { id: 'ex-t13', name: 'Agachamento Livre com Barra', category: 'pernas', sets: 4, reps: '8 a 10', restSeconds: 120 },
          { id: 'ex-t14', name: 'Leg Press 45º Articulado', category: 'pernas', sets: 4, reps: '12', restSeconds: 90 },
          { id: 'ex-t15', name: 'Cadeira Extensora', category: 'pernas', sets: 4, reps: '12 a 15', restSeconds: 60 },
          { id: 'ex-t16', name: 'Mesa Flexora Deitada', category: 'pernas', sets: 4, reps: '10 a 12', restSeconds: 60 },
          { id: 'ex-t17', name: 'Stiff com Halteres', category: 'pernas', sets: 3, reps: '12', restSeconds: 60 },
          { id: 'ex-t18', name: 'Gêmeos Sentado (Panturrilhas)', category: 'pernas', sets: 4, reps: '15 a 20', restSeconds: 45 }
        ]
      },
      {
        letter: 'D',
        title: 'Treino D: Deltoides Completo, Trapézio & Core',
        targetMuscles: 'Deltoides Completo, Trapézio Superior, Abdômen Reto & Oblíquos',
        exercises: [
          { id: 'ex-t19', name: 'Desenvolvimento Arnold Halteres', category: 'ombros', sets: 4, reps: '10', restSeconds: 75 },
          { id: 'ex-t20', name: 'Elevação Frontal na Polia', category: 'ombros', sets: 3, reps: '12', restSeconds: 45 },
          { id: 'ex-t21', name: 'Encolhimento com Barra', category: 'ombros', sets: 4, reps: '15', restSeconds: 45 },
          { id: 'ex-t22', name: 'Abdominal Supra na Polia', category: 'core', sets: 4, reps: '20', restSeconds: 45 }
        ]
      }
    ]
  },
  {
    id: 'tpl-2',
    name: 'Adaptação Anatômica & Iniciação Guiada (ABC)',
    description: 'Indicado para alunos iniciantes ou em retorno aos treinos. Foco em aparelhos articulados/guiados, aprendizado motor e zero sobrecarga articular.',
    goal: 'hipertrofia',
    level: 'iniciante',
    frequencyDays: 3,
    divisionName: 'ABC',
    targetBiotype: 'todos',
    restrictionsSafe: ['Proteção Articular Total', 'Proteção Lombar'],
    coachAuthor: 'Coach Diego',
    createdAt: '2026-08-10',
    usageCount: 42,
    groups: [
      {
        letter: 'A',
        title: 'Treino A: Peitoral, Deltoides & Tríceps (Máquinas)',
        targetMuscles: 'Peito, Ombro e Tríceps',
        exercises: [
          { id: 'ex-a1', name: 'Supino Máquina Sentado', category: 'peito', sets: 3, reps: '12 a 15', restSeconds: 60, notes: 'Foco na postura e cadência' },
          { id: 'ex-a2', name: 'Voador / Peck Deck', category: 'peito', sets: 3, reps: '12 a 15', restSeconds: 60 },
          { id: 'ex-a3', name: 'Desenvolvimento Máquina Articulada', category: 'ombros', sets: 3, reps: '12', restSeconds: 60 },
          { id: 'ex-a4', name: 'Tríceps no Graviton / Pulley', category: 'bracos', sets: 3, reps: '15', restSeconds: 45 }
        ]
      },
      {
        letter: 'B',
        title: 'Treino B: Costas, Bíceps & Lombar Segura',
        targetMuscles: 'Dorsal e Bíceps',
        exercises: [
          { id: 'ex-a5', name: 'Puxada Aberta na Polia com Apoio', category: 'costas', sets: 3, reps: '12 a 15', restSeconds: 60 },
          { id: 'ex-a6', name: 'Remada Sentada Máquina com Apoio Torácico', category: 'costas', sets: 3, reps: '12', restSeconds: 60 },
          { id: 'ex-a7', name: 'Rosca Scott Máquina', category: 'bracos', sets: 3, reps: '12', restSeconds: 45 }
        ]
      },
      {
        letter: 'C',
        title: 'Treino C: Pernas Guiadas & Abdômen',
        targetMuscles: 'Membros Inferiores e Core',
        exercises: [
          { id: 'ex-a8', name: 'Leg Press Horizontal Guiado', category: 'pernas', sets: 3, reps: '12 a 15', restSeconds: 60 },
          { id: 'ex-a9', name: 'Cadeira Extensora', category: 'pernas', sets: 3, reps: '15', restSeconds: 60 },
          { id: 'ex-a10', name: 'Cadeira Flexora Sentada', category: 'pernas', sets: 3, reps: '12 a 15', restSeconds: 60 },
          { id: 'ex-a11', name: 'Abdominal no Solo / Máquina', category: 'core', sets: 3, reps: '15 a 20', restSeconds: 45 }
        ]
      }
    ]
  },
  {
    id: 'tpl-3',
    name: 'Queima Metabólica & Alta Densidade (PPL 2x)',
    description: 'Rotina de 6 dias com alta densidade, descansos curtos e bi-sets. Máximo gasto calórico e preservação muscular para emagrecimento.',
    goal: 'emagrecimento',
    level: 'avancado',
    frequencyDays: 6,
    divisionName: 'PPL',
    targetBiotype: 'endomorfo',
    restrictionsSafe: ['Nenhuma'],
    coachAuthor: 'Coach Diego',
    createdAt: '2026-08-18',
    usageCount: 19,
    groups: [
      {
        letter: 'A',
        title: 'Treino A: Push (Peito, Ombro, Tríceps + HIIT)',
        targetMuscles: 'Peito, Ombros e Tríceps',
        exercises: [
          { id: 'ex-q1', name: 'Supino Inclinado com Halteres + Flexão Solo', category: 'peito', sets: 4, reps: '12 + Max', restSeconds: 45, notes: 'Bi-set sem descanso entre os 2' },
          { id: 'ex-q2', name: 'Crucifixo Máquina', category: 'peito', sets: 4, reps: '15', restSeconds: 30 },
          { id: 'ex-q3', name: 'Elevação Lateral Drop-set', category: 'ombros', sets: 4, reps: '12+12+12', restSeconds: 45 },
          { id: 'ex-q4', name: 'Tríceps Testa com Halteres', category: 'bracos', sets: 4, reps: '12', restSeconds: 30 }
        ]
      },
      {
        letter: 'B',
        title: 'Treino B: Pull (Costas, Posterior Ombro, Bíceps)',
        targetMuscles: 'Costas e Bíceps',
        exercises: [
          { id: 'ex-q5', name: 'Puxada Alta Triângulo + Remada Curvada', category: 'costas', sets: 4, reps: '10 + 12', restSeconds: 45 },
          { id: 'ex-q6', name: 'Remada Unilateral com Halter (Serrote)', category: 'costas', sets: 3, reps: '12', restSeconds: 30 },
          { id: 'ex-q7', name: 'Rosca Direta + Rosca Martelo', category: 'bracos', sets: 4, reps: '10 + 10', restSeconds: 45 }
        ]
      },
      {
        letter: 'C',
        title: 'Treino C: Legs (Pernas Completo + Glúteos)',
        targetMuscles: 'Quadríceps, Posterior e Panturrilhas',
        exercises: [
          { id: 'ex-q8', name: 'Agachamento Globet + Passada com Halteres', category: 'pernas', sets: 4, reps: '12 + 20 passos', restSeconds: 60 },
          { id: 'ex-q9', name: 'Leg Press 45º Drop-set', category: 'pernas', sets: 4, reps: '15 + 15', restSeconds: 45 },
          { id: 'ex-q10', name: 'Mesa Flexora + Cadeira Flexora', category: 'pernas', sets: 4, reps: '12 + 12', restSeconds: 45 }
        ]
      }
    ]
  },
  {
    id: 'tpl-4',
    name: 'Reabilitação & Proteção Patelar / Joelho Sensível (ABC)',
    description: 'Protocolo seguro desenvolvido especificamente para alunos com queixa de condromalácia ou dores no joelho. Elimina agachamento profundo e prioriza cadeia posterior e isometria.',
    goal: 'hipertrofia',
    level: 'intermediario',
    frequencyDays: 3,
    divisionName: 'ABC',
    targetBiotype: 'todos',
    restrictionsSafe: ['Proteção Patelar (Joelho)', 'Condromalácia'],
    coachAuthor: 'Coach Diego',
    createdAt: '2026-08-12',
    usageCount: 15,
    groups: [
      {
        letter: 'A',
        title: 'Treino A: Membros Superiores (Peito & Costas)',
        targetMuscles: 'Peito e Costas',
        exercises: [
          { id: 'ex-r1', name: 'Supino Reto com Halteres', category: 'peito', sets: 4, reps: '10 a 12', restSeconds: 60 },
          { id: 'ex-r2', name: 'Puxada Alta Pronada', category: 'costas', sets: 4, reps: '10 a 12', restSeconds: 60 },
          { id: 'ex-r3', name: 'Remada Baixa Sentada', category: 'costas', sets: 3, reps: '12', restSeconds: 60 }
        ]
      },
      {
        letter: 'B',
        title: 'Treino B: Membros Inferiores com Proteção Patelar',
        targetMuscles: 'Posteriores, Glúteos e Isometria Quadríceps',
        exercises: [
          { id: 'ex-r4', name: 'Cadeira Extensora Isométrica (Ângulo 45º)', category: 'pernas', sets: 4, reps: '12 reps (3s pausa no topo)', restSeconds: 60, notes: 'Zero impacto articular patelar' },
          { id: 'ex-r5', name: 'Mesa Flexora Deitada', category: 'pernas', sets: 4, reps: '12', restSeconds: 60 },
          { id: 'ex-r6', name: 'Elevação Pélvica com Barra no Banco', category: 'pernas', sets: 4, reps: '12 a 15', restSeconds: 60 },
          { id: 'ex-r7', name: 'Cadeira Abdutora e Adutora', category: 'pernas', sets: 3, reps: '15', restSeconds: 45 }
        ]
      },
      {
        letter: 'C',
        title: 'Treino C: Ombros, Braços & Core',
        targetMuscles: 'Deltoides, Bíceps, Tríceps e Core',
        exercises: [
          { id: 'ex-r8', name: 'Desenvolvimento com Halteres', category: 'ombros', sets: 4, reps: '10', restSeconds: 60 },
          { id: 'ex-r9', name: 'Elevação Lateral no Cabo', category: 'ombros', sets: 3, reps: '12', restSeconds: 45 },
          { id: 'ex-r10', name: 'Rosca Alternada + Tríceps Corda', category: 'bracos', sets: 3, reps: '12 + 12', restSeconds: 60 }
        ]
      }
    ]
  }
];

export const FINANCIAL_DATA: FinancialMetric = {
  totalRevenue: 54980.00,
  activeStudents: 418,
  occupancyRate: 72,
  latePaymentsCount: 14,
  latePaymentsAmount: 1890.00,
  revenueByUnit: {
    unit1: 34200.00, // Matriz (Aliança Centro)
    unit2: 20780.00, // Unidade 2
  },
  monthlyGrowth: 18.4,
  mrr: 52400.00,
  delinquencyRate: 3.4,
  activeSubscriptions: 418,
  pixRevenue: 28540.00,
  cardRevenue: 22100.00,
  cashRevenue: 4340.00
};

export const INITIAL_STUDENT_ASSESSMENTS: any[] = [
  {
    id: 'asm-std-1-v1',
    studentId: 'std-1',
    unit: 'unidade-1',
    assessmentDate: '2026-08-20',
    assessorName: 'Coach Diego',
    isCurrent: true,
    age: 28,
    gender: 'masculino',
    heightCm: 178,
    weightKg: 82.5,
    primaryGoal: 'Hipertrofia',
    secondaryGoals: ['Ganho de força', 'Definição muscular'],
    experienceLevel: 'intermediario',
    trainingYears: 2.5,
    currentlyTraining: true,
    currentFrequencyDays: 4,
    otherSports: ['Futebol de final de semana'],
    machineExperience: 'boa',
    freeWeightsExperience: 'boa',
    complexLiftsExperience: 'moderada',
    daysPerWeek: 4,
    sessionDurationMinutes: 60,
    preferredTimeOfDay: 'noite',
    preferredDays: ['Seg', 'Ter', 'Qui', 'Sex'],
    hasPain: true,
    painDetails: {
      hasPain: true,
      location: 'Joelho direito',
      side: 'direito',
      intensity: 3,
      whenAppears: 'Durante agachamento livre profundo',
      triggerMovements: 'Agachamento profundo com carga alta',
      safeMovements: 'Leg press 45 com boa amplitude, Cadeira Extensora controlada',
      notes: 'Leve estalo sem edema.'
    },
    pastInjuries: 'Entorse de tornozelo em 2022',
    avoidMovements: ['Agachamento livre profundo com carga máxima'],
    prescriptionAlerts: ['Desconforto no joelho direito em flexão profunda', 'Priorizar cadência controlada em membros inferiores'],
    medicalClearance: true,
    sleepHoursAvg: 7.5,
    sleepQuality: 'boa',
    stressLevel: 'moderado',
    workRoutine: 'sentado',
    dailyStepsEstimate: 7500,
    favoriteExercises: ['Supino Reto com Barra', 'Puxada Alta Pronada', 'Elevação Lateral'],
    dislikedExercises: ['Agachamento Búlgaro'],
    preferredEquipment: ['Halteres', 'Cabos', 'Máquinas'],
    preferenceWeightsVsMachines: 'misto',
    preferenceIntensity: 'moderada_alta'
  },
  {
    id: 'asm-std-2-v1',
    studentId: 'std-2',
    unit: 'unidade-1',
    assessmentDate: '2026-08-15',
    assessorName: 'Coach Diego',
    isCurrent: true,
    age: 26,
    gender: 'feminino',
    heightCm: 165,
    weightKg: 58.0,
    primaryGoal: 'Condicionamento',
    secondaryGoals: ['Hipertrofia', 'Ganho de força'],
    experienceLevel: 'avancado',
    trainingYears: 4.0,
    currentlyTraining: true,
    currentFrequencyDays: 5,
    otherSports: ['CrossFit', 'Corrida de rua'],
    machineExperience: 'boa',
    freeWeightsExperience: 'boa',
    complexLiftsExperience: 'boa',
    daysPerWeek: 5,
    sessionDurationMinutes: 60,
    preferredTimeOfDay: 'manha',
    preferredDays: ['Seg', 'Ter', 'Qua', 'Sex', 'Sab'],
    hasPain: false,
    painDetails: { hasPain: false },
    prescriptionAlerts: ['Sem restrições declaradas. Liberada para alta intensidade.'],
    avoidMovements: [],
    medicalClearance: true,
    sleepHoursAvg: 8.0,
    sleepQuality: 'excelente',
    stressLevel: 'baixo',
    workRoutine: 'misto',
    dailyStepsEstimate: 11000,
    favoriteExercises: ['Thruster', 'Bar Muscle-up', 'Levantamento Terra'],
    dislikedExercises: [],
    preferredEquipment: ['Barra Olímpica', 'Kettlebell', 'Argolas'],
    preferenceWeightsVsMachines: 'pesos_livres',
    preferenceIntensity: 'alta'
  },
  {
    id: 'asm-std-3-v1',
    studentId: 'std-3',
    unit: 'unidade-2',
    assessmentDate: '2026-08-18',
    assessorName: 'Prof. Lucas',
    isCurrent: true,
    age: 34,
    gender: 'masculino',
    heightCm: 172,
    weightKg: 74.5,
    primaryGoal: 'Reabilitação/retorno',
    secondaryGoals: ['Saúde/qualidade de vida', 'Hipertrofia'],
    experienceLevel: 'iniciante',
    trainingYears: 0.5,
    currentlyTraining: true,
    currentFrequencyDays: 3,
    otherSports: [],
    machineExperience: 'moderada',
    freeWeightsExperience: 'pouca',
    complexLiftsExperience: 'pouca',
    daysPerWeek: 3,
    sessionDurationMinutes: 50,
    preferredTimeOfDay: 'noite',
    preferredDays: ['Seg', 'Qua', 'Sex'],
    hasPain: true,
    painDetails: {
      hasPain: true,
      location: 'Ombro esquerdo',
      side: 'esquerdo',
      intensity: 4,
      whenAppears: 'Elevação acima da linha dos olhos',
      triggerMovements: 'Elevação acima de 90 graus',
      safeMovements: 'Remadas neutras, Supino com pegada neutra',
      notes: 'Impacto subacromial em fase final de fortalecimento.'
    },
    prescriptionAlerts: ['Evitar desenvolvimento militar pesado acima da cabeça', 'Priorizar manguito rotador e estabilização escapular'],
    avoidMovements: ['Desenvolvimento Militar com Barra atrás da nuca'],
    medicalClearance: true,
    sleepHoursAvg: 6.5,
    sleepQuality: 'regular',
    stressLevel: 'alto',
    workRoutine: 'sentado',
    dailyStepsEstimate: 5000,
    favoriteExercises: ['Remada Baixa', 'Leg Press', 'Puxada Triângulo'],
    dislikedExercises: ['Supino Inclinado Barra'],
    preferredEquipment: ['Máquinas Guiadas', 'Polias'],
    preferenceWeightsVsMachines: 'maquinas',
    preferenceIntensity: 'moderada'
  }
];

