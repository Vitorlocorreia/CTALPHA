import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  ArrowLeft, 
  Dumbbell, 
  Play, 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Folder, 
  FolderOpen, 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  Award, 
  Info,
  Flame,
  Plus,
  Layers,
  ChevronDown
} from 'lucide-react';
import { WorkoutRoutine, Goal, Biotype } from '@/types';
import { WorkoutTrackerView } from './WorkoutTrackerView';

interface Program {
  id: string;
  code: string;
  title: string;
  divisionType: 'PPL' | 'ABCD' | 'ABC' | 'ABCDE';
  status: 'ativa' | 'historico' | 'complementar';
  coach: string;
  validity: string;
  description: string;
  days: {
    letter: 'A' | 'B' | 'C' | 'D';
    name: string;
    targetMuscles: string[];
    suggestedDay: string;
    estimatedMinutes: number;
    exercises: {
      id: string;
      name: string;
      category: string;
      sets: number;
      reps: string;
      restSeconds: number;
      previousWeight: number;
    }[];
  }[];
}

interface WorkoutHubViewProps {
  routine: WorkoutRoutine;
  studentName: string;
  studentGoal?: Goal;
  onBack: () => void;
  onOpenGenerator: () => void;
}

export const WorkoutHubView: React.FC<WorkoutHubViewProps> = ({
  routine,
  studentName,
  studentGoal,
  onBack,
  onOpenGenerator
}) => {
  const { showNotification } = useApp();

  // Navigation steps: 'programs' (Nível 2) -> 'days' (Nível 3) -> 'day_details' (Nível 4)
  const [currentStep, setCurrentStep] = useState<'programs' | 'days' | 'day_details'>('days');
  const [selectedProgramId, setSelectedProgramId] = useState<string>('prog-1');
  const [selectedDayLetter, setSelectedDayLetter] = useState<'A' | 'B' | 'C' | 'D'>('A');

  // Live Execution Mode (MFit Session)
  const [isExecutingLive, setIsExecutingLive] = useState(false);

  // Programs / Fichas Catalog
  const programs: Program[] = [
    {
      id: 'prog-1',
      code: 'Treino 1',
      title: 'Periodização Hipertrofia Estrutural (Fase 1)',
      divisionType: 'ABCD',
      status: 'ativa',
      coach: routine.coachName || 'Coach Diego',
      validity: 'Válido até 30/10/2026',
      description: 'Foco em tensão mecânica, densidade muscular e progressão gradual de cargas nas articulações principais.',
      days: [
        {
          letter: 'A',
          name: 'Treino A: Peitoral, Deltoides & Tríceps (Push)',
          targetMuscles: ['Peitoral Maior', 'Deltoide Anterior', 'Deltoide Lateral', 'Tríceps Braquial'],
          suggestedDay: 'Segunda-feira / Quinta-feira',
          estimatedMinutes: 50,
          exercises: [
            { id: 'ex-a1', name: 'Supino Reto com Barra', category: 'peito', sets: 4, reps: '10-12', restSeconds: 60, previousWeight: 32.5 },
            { id: 'ex-a2', name: 'Supino Inclinado com Halteres', category: 'peito', sets: 4, reps: '10-12', restSeconds: 60, previousWeight: 24.0 },
            { id: 'ex-a3', name: 'Crossover na Polia Média', category: 'peito', sets: 3, reps: '12-15', restSeconds: 45, previousWeight: 17.5 },
            { id: 'ex-a4', name: 'Desenvolvimento Militar Halteres', category: 'ombros', sets: 4, reps: '10', restSeconds: 60, previousWeight: 18.0 },
            { id: 'ex-a5', name: 'Elevação Lateral com Halteres', category: 'ombros', sets: 4, reps: '12-15', restSeconds: 45, previousWeight: 10.0 },
            { id: 'ex-a6', name: 'Tríceps Pulley na Corda', category: 'triceps', sets: 4, reps: '12', restSeconds: 45, previousWeight: 22.5 }
          ]
        },
        {
          letter: 'B',
          name: 'Treino B: Dorsal, Trapézio & Bíceps (Pull)',
          targetMuscles: ['Latíssimo do Dorso', 'Romboide', 'Trapézio', 'Bíceps Braquial', 'Antebraço'],
          suggestedDay: 'Terça-feira / Sexta-feira',
          estimatedMinutes: 50,
          exercises: [
            { id: 'ex-b1', name: 'Puxada Frontal na Barra Aberta', category: 'costas', sets: 4, reps: '10-12', restSeconds: 60, previousWeight: 50.0 },
            { id: 'ex-b2', name: 'Remada Curvada com Barra', category: 'costas', sets: 4, reps: '10', restSeconds: 60, previousWeight: 40.0 },
            { id: 'ex-b3', name: 'Remada Baixa no Triângulo', category: 'costas', sets: 3, reps: '12', restSeconds: 45, previousWeight: 45.0 },
            { id: 'ex-b4', name: 'Crucifixo Invertido no Voador', category: 'ombros', sets: 3, reps: '15', restSeconds: 45, previousWeight: 35.0 },
            { id: 'ex-b5', name: 'Rosca Direta com Barra W', category: 'biceps', sets: 4, reps: '10', restSeconds: 60, previousWeight: 15.0 },
            { id: 'ex-b6', name: 'Rosca Martelo com Halteres', category: 'biceps', sets: 3, reps: '12', restSeconds: 45, previousWeight: 14.0 }
          ]
        },
        {
          letter: 'C',
          name: 'Treino C: Membros Inferiores Completo (Legs)',
          targetMuscles: ['Quadríceps', 'Isquiotibiais', 'Glúteos', 'Panturrilhas'],
          suggestedDay: 'Quarta-feira / Sábado',
          estimatedMinutes: 55,
          exercises: [
            { id: 'ex-c1', name: 'Agachamento Livre com Barra', category: 'pernas', sets: 4, reps: '8-10', restSeconds: 90, previousWeight: 60.0 },
            { id: 'ex-c2', name: 'Leg Press 45º Articulado', category: 'pernas', sets: 4, reps: '12', restSeconds: 90, previousWeight: 160.0 },
            { id: 'ex-c3', name: 'Cadeira Extensora', category: 'pernas', sets: 4, reps: '15', restSeconds: 60, previousWeight: 45.0 },
            { id: 'ex-c4', name: 'Mesa Flexora Deitada', category: 'pernas', sets: 4, reps: '12', restSeconds: 60, previousWeight: 40.0 },
            { id: 'ex-c5', name: 'Stiff com Halteres', category: 'pernas', sets: 3, reps: '12', restSeconds: 60, previousWeight: 20.0 },
            { id: 'ex-c6', name: 'Gêmeos Sentado (Panturrilhas)', category: 'pernas', sets: 4, reps: '15', restSeconds: 45, previousWeight: 40.0 }
          ]
        },
        {
          letter: 'D',
          name: 'Treino D: Ombros Completo, Trapézio & Core',
          targetMuscles: ['Deltoides Completo', 'Trapézio Superior', 'Abdômen Reto & Oblíquos'],
          suggestedDay: 'Sábado / Complementar',
          estimatedMinutes: 45,
          exercises: [
            { id: 'ex-d1', name: 'Desenvolvimento Arnold com Halteres', category: 'ombros', sets: 4, reps: '10', restSeconds: 60, previousWeight: 16.0 },
            { id: 'ex-d2', name: 'Elevação Frontal na Polia Baixa', category: 'ombros', sets: 3, reps: '12', restSeconds: 45, previousWeight: 12.5 },
            { id: 'ex-d3', name: 'Encolhimento com Barra', category: 'trapezio', sets: 4, reps: '15', restSeconds: 45, previousWeight: 50.0 },
            { id: 'ex-d4', name: 'Abdominal Supra na Polia', category: 'core', sets: 4, reps: '20', restSeconds: 45, previousWeight: 30.0 },
            { id: 'ex-d5', name: 'Prancha Isométrica', category: 'core', sets: 3, reps: '45s', restSeconds: 45, previousWeight: 0 }
          ]
        }
      ]
    },
    {
      id: 'prog-2',
      code: 'Treino 2',
      title: 'Rotina de Condicionamento & Queima Metabólica (PPL)',
      divisionType: 'PPL',
      status: 'complementar',
      coach: 'Coach Diego',
      validity: 'Fase de Definição',
      description: 'Estrutura Push / Pull / Legs com intervalos curtos para alta densidade e aceleração metabólica.',
      days: [
        {
          letter: 'A',
          name: 'Dia 1: Push (Peito, Ombros e Tríceps)',
          targetMuscles: ['Peitoral', 'Ombros', 'Tríceps'],
          suggestedDay: 'Segunda / Quinta',
          estimatedMinutes: 45,
          exercises: [
            { id: 'ex-p1', name: 'Supino Reto Halteres', category: 'peito', sets: 4, reps: '12', restSeconds: 45, previousWeight: 22 },
            { id: 'ex-p2', name: 'Flexão de Braços no Solo', category: 'peito', sets: 3, reps: 'Falha', restSeconds: 45, previousWeight: 0 }
          ]
        },
        {
          letter: 'B',
          name: 'Dia 2: Pull (Costas, Trapézio e Bíceps)',
          targetMuscles: ['Dorsal', 'Bíceps'],
          suggestedDay: 'Terça / Sexta',
          estimatedMinutes: 45,
          exercises: [
            { id: 'ex-p3', name: 'Puxada Triângulo', category: 'costas', sets: 4, reps: '12', restSeconds: 45, previousWeight: 45 }
          ]
        },
        {
          letter: 'C',
          name: 'Dia 3: Legs (Pernas Completo e Panturrilhas)',
          targetMuscles: ['Quadríceps', 'Glúteos'],
          suggestedDay: 'Quarta / Sábado',
          estimatedMinutes: 45,
          exercises: [
            { id: 'ex-p4', name: 'Agachamento Goblet com Halter', category: 'pernas', sets: 4, reps: '15', restSeconds: 45, previousWeight: 24 }
          ]
        }
      ]
    }
  ];

  const activeProgram = programs.find(p => p.id === selectedProgramId) || programs[0];
  const activeDay = activeProgram.days.find(d => d.letter === selectedDayLetter) || activeProgram.days[0];

  // Helper navigation handlers
  const handleGoBack = () => {
    if (currentStep === 'day_details') {
      setCurrentStep('days');
    } else if (currentStep === 'days') {
      setCurrentStep('programs');
    } else {
      onBack();
    }
  };

  // Convert current selected day into full WorkoutRoutine to execute in WorkoutTrackerView
  const routineToExecute: WorkoutRoutine = {
    ...routine,
    divisionName: activeProgram.divisionType,
    coachName: activeProgram.coach,
    groups: [
      {
        letter: activeDay.letter,
        title: activeDay.name,
        targetMuscles: activeDay.targetMuscles.join(', '),
        exercises: activeDay.exercises.map(ex => ({
          id: ex.id,
          name: ex.name,
          category: ex.category as any,
          sets: ex.sets,
          reps: ex.reps,
          restSeconds: ex.restSeconds
        }))
      }
    ]
  };

  if (isExecutingLive) {
    return (
      <WorkoutTrackerView
        routine={routineToExecute}
        initialGroupLetter={activeDay.letter}
        onClose={() => setIsExecutingLive(false)}
        onFinish={(summary) => {
          setIsExecutingLive(false);
          showNotification(`Treino ${activeDay.letter} concluído com sucesso! Duração: ${summary.duration}.`);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 selection:bg-alpha-500 selection:text-white pb-20">
      
      {/* 1. Header do Hub de Treinos */}
      <header className="bg-[#212631] text-white px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-slate-700 shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={handleGoBack}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Voltar ao nível anterior"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            {/* Breadcrumb de Navegação */}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span 
                onClick={() => setCurrentStep('programs')}
                className="hover:text-alpha-400 cursor-pointer"
              >
                Fichas
              </span>
              <span>/</span>
              <span 
                onClick={() => setCurrentStep('days')}
                className={`cursor-pointer ${currentStep === 'days' ? 'text-alpha-400 font-black' : 'hover:text-alpha-400'}`}
              >
                {activeProgram.code}
              </span>
              {currentStep === 'day_details' && (
                <>
                  <span>/</span>
                  <span className="text-white font-black">
                    Pasta {activeDay.letter}
                  </span>
                </>
              )}
            </div>

            <h1 className="text-base sm:text-lg font-black text-white leading-tight">
              {currentStep === 'programs' && 'Minhas Fichas de Treino'}
              {currentStep === 'days' && `${activeProgram.code}: Pastas dos Dias (${activeProgram.divisionType})`}
              {currentStep === 'day_details' && activeDay.name}
            </h1>
          </div>
        </div>

        <button
          onClick={onOpenGenerator}
          className="bg-alpha-500 hover:bg-alpha-600 text-white text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Gerar Ficha com IA</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* =========================================================================
            NÍVEL 2: LISTA DE FICHAS / PROGRAMAS DE TREINO (Treino 1, Treino 2)
           ========================================================================= */}
        {currentStep === 'programs' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Fichas & Programas Prescritos</h2>
                <p className="text-xs text-slate-500">Selecione o programa de treino que deseja acessar</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {programs.map((prog) => (
                <div
                  key={prog.id}
                  onClick={() => {
                    setSelectedProgramId(prog.id);
                    setCurrentStep('days');
                  }}
                  className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-alpha-500 hover:shadow-lg transition-all cursor-pointer space-y-4 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 text-alpha-600 border border-orange-200 flex items-center justify-center font-black text-sm">
                        <Folder className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-alpha-500 block">
                          {prog.code} • Divisão {prog.divisionType}
                        </span>
                        <h3 className="text-base font-black text-slate-900 group-hover:text-alpha-600 transition-colors">
                          {prog.title}
                        </h3>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                      prog.status === 'ativa' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {prog.status === 'ativa' ? 'Ficha Ativa' : 'Complementar'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {prog.description}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      <strong>{prog.days.length} pastas de dias</strong> • {prog.validity}
                    </span>
                    <span className="font-bold text-alpha-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Abrir Pastas <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            NÍVEL 3: PASTAS DOS DIAS DENTRO DA FICHA (Treino A, Treino B, Treino C, etc.)
           ========================================================================= */}
        {currentStep === 'days' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Header da Ficha Selecionada */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase">
                    {activeProgram.code} Ativo • {activeProgram.divisionType}
                  </span>
                  <span className="text-xs text-slate-400">
                    Prescrito por <strong>{activeProgram.coach}</strong>
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900">{activeProgram.title}</h2>
                <p className="text-xs text-slate-500">{activeProgram.description}</p>
              </div>

              <button
                onClick={() => setCurrentStep('programs')}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-300 px-4 py-2 rounded-xl self-start sm:self-auto"
              >
                Trocar de Ficha
              </button>
            </div>

            {/* Pastas dos Dias da Semana */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  Pastas dos Dias de Treino ({activeProgram.days.length})
                </h3>
                <span className="text-xs text-slate-400">Clique na pasta para abrir o treino do dia</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                {activeProgram.days.map((day, idx) => (
                  <div
                    key={day.letter}
                    onClick={() => {
                      setSelectedDayLetter(day.letter);
                      setCurrentStep('day_details');
                    }}
                    className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-alpha-500 hover:shadow-lg transition-all cursor-pointer space-y-4 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white group-hover:bg-alpha-500 transition-colors flex items-center justify-center font-black text-lg shadow-sm">
                          {day.letter}
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                            Pasta do Dia • {day.suggestedDay}
                          </span>
                          <h4 className="text-base font-black text-slate-900 group-hover:text-alpha-600 transition-colors">
                            {day.name}
                          </h4>
                        </div>
                      </div>

                      {idx === 0 && (
                        <span className="bg-amber-400/20 text-amber-700 border border-amber-400/40 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                          Sugerido Hoje
                        </span>
                      )}
                    </div>

                    {/* Músculos Alvo Tags */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] text-slate-400 font-bold block">Músculos Trabalhados:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {day.targetMuscles.map((muscle) => (
                          <span key={muscle} className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-500">
                        {day.exercises.length} exercícios • {day.estimatedMinutes} min
                      </span>
                      <span className="text-alpha-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Abrir Treino do Dia <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            NÍVEL 4: O TREINO DO DIA (MÚSCULOS ALVO, EXERCÍCIOS, SÉRIES & EXECUTAR)
           ========================================================================= */}
        {currentStep === 'day_details' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Header do Treino do Dia com Botão de Iniciar */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-alpha-500 text-white font-black text-sm flex items-center justify-center">
                      {activeDay.letter}
                    </span>
                    <span className="text-xs font-bold text-alpha-600 uppercase tracking-wider">
                      {activeProgram.code} • Pasta do Dia ({activeDay.suggestedDay})
                    </span>
                  </div>

                  <h2 className="text-2xl font-black text-slate-900">{activeDay.name}</h2>
                  <p className="text-xs text-slate-500">
                    Duração estimada: <strong>{activeDay.estimatedMinutes} minutos</strong> • {activeDay.exercises.length} exercícios
                  </p>
                </div>

                {/* Big Action CTA to launch MFit Live Execution */}
                <button
                  onClick={() => setIsExecutingLive(true)}
                  className="bg-alpha-500 hover:bg-alpha-600 text-white font-black text-sm uppercase tracking-wider px-8 py-4 rounded-2xl transition-all shadow-xl hover:shadow-alpha-500/25 flex items-center justify-center gap-2.5 transform hover:scale-[1.02]"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Iniciar Sessão de Hoje no App</span>
                </button>
              </div>

              {/* Músculos Alvo Destaque */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  Músculos Alvo Trabalhados Nesta Sessão:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeDay.targetMuscles.map((m) => (
                    <span key={m} className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 shadow-xs">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Lista dos Exercícios do Dia */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  Lista de Exercícios do Treino ({activeDay.exercises.length})
                </h3>
                <span className="text-xs text-slate-400">Prescrição técnica detalhada</span>
              </div>

              <div className="space-y-3">
                {activeDay.exercises.map((ex, index) => (
                  <div
                    key={ex.id}
                    className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 font-black text-sm flex items-center justify-center shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900 leading-tight">{ex.name}</h4>
                        <span className="text-xs text-slate-500 capitalize">
                          Grupo: <strong>{ex.category}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-0 border-slate-200 text-slate-700">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Séries</span>
                        <span className="font-mono font-black text-slate-900 text-sm">{ex.sets} séries</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Reps</span>
                        <span className="font-mono font-black text-slate-900 text-sm">{ex.reps}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Descanso</span>
                        <span className="font-mono font-bold text-slate-700 text-sm">{ex.restSeconds}s</span>
                      </div>

                      <div className="border-l border-slate-200 pl-4">
                        <span className="text-[10px] text-slate-400 block font-medium">Última Carga</span>
                        <span className="font-mono font-black text-alpha-600 text-sm">{ex.previousWeight} kg</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Orientações do Treinador */}
            <div className="p-5 rounded-3xl bg-orange-50 border border-orange-200 text-xs text-slate-700 space-y-1.5">
              <div className="flex items-center gap-2 text-alpha-700 font-bold">
                <Info className="w-4 h-4 text-alpha-600" />
                <span>Orientações do Coach Diego para o Treino {activeDay.letter}:</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                Concentre-se na cadência excêntrica de 3 segundos em todos os exercícios compostos. Clique no botão de iniciar acima para abrir o cronômetro e registrar os quilos levantados em cada série.
              </p>
            </div>

            {/* Bottom Sticky Button */}
            <div className="pt-4">
              <button
                onClick={() => setIsExecutingLive(true)}
                className="w-full bg-alpha-500 hover:bg-alpha-600 text-white font-black text-sm uppercase tracking-wider py-4 rounded-2xl transition-all shadow-xl hover:shadow-alpha-500/25 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Iniciar Treino {activeDay.letter} Agora</span>
              </button>
            </div>

          </div>
        )}

      </main>

    </div>
  );
};
