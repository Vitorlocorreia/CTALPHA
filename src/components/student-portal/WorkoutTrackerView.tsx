import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  ArrowLeft, 
  Dumbbell, 
  Check, 
  CheckCircle2, 
  Clock, 
  Timer, 
  Flame, 
  TrendingUp, 
  Plus, 
  Minus, 
  Play, 
  Pause, 
  RotateCcw, 
  Award, 
  Sparkles,
  Info,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity,
  X
} from 'lucide-react';
import { WorkoutRoutine, Exercise, WorkoutLetter } from '@/types';

interface SetRecord {
  setNumber: number;
  type: 'aquecimento' | 'normal' | 'drop';
  previousWeight: number;
  weight: number;
  reps: number;
  targetReps: string;
  completed: boolean;
}

interface ExerciseTrackerState {
  exerciseId: string;
  name: string;
  category: string;
  restSeconds: number;
  coachNote?: string;
  sets: SetRecord[];
}

interface WorkoutTrackerViewProps {
  routine: WorkoutRoutine;
  initialGroupLetter?: WorkoutLetter;
  onClose: () => void;
  onFinish?: (summary: { duration: string; totalVolumeKg: number; completedSets: number }) => void;
}

export const WorkoutTrackerView: React.FC<WorkoutTrackerViewProps> = ({
  routine,
  initialGroupLetter = 'A',
  onClose,
  onFinish
}) => {
  const { showNotification } = useApp();

  const [activeGroupLetter, setActiveGroupLetter] = useState<WorkoutLetter>(initialGroupLetter);
  const activeGroup = routine.groups?.find(g => g.letter === activeGroupLetter) || routine.groups?.[0];

  // Workout Session Timer
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Rest Interval Timer
  const [restTimeRemaining, setRestTimeRemaining] = useState<number | null>(null);
  const [activeRestExercise, setActiveRestExercise] = useState<string | null>(null);

  // Completed workout summary modal
  const [isFinishedModalOpen, setIsFinishedModalOpen] = useState(false);

  // Initialize interactive exercises state with sets, weights, and reps
  const [exercisesState, setExercisesState] = useState<ExerciseTrackerState[]>([]);

  useEffect(() => {
    if (activeGroup?.exercises) {
      const initialExercises: ExerciseTrackerState[] = activeGroup.exercises.map((ex, idx) => {
        const baseWeight = 20 + idx * 5;
        const totalSets = ex.sets || 4;
        const defaultReps = parseInt(ex.reps) || 10;

        const setsList: SetRecord[] = Array.from({ length: totalSets }).map((_, sIdx) => ({
          setNumber: sIdx + 1,
          type: sIdx === 0 ? 'aquecimento' : 'normal',
          previousWeight: baseWeight,
          weight: baseWeight,
          reps: defaultReps,
          targetReps: ex.reps || '10-12',
          completed: false,
        }));

        return {
          exerciseId: ex.id,
          name: ex.name,
          category: ex.category,
          restSeconds: ex.restSeconds || 60,
          coachNote: idx === 0 
            ? 'Manter escápulas travadas e cadência 3010 controlada.' 
            : 'Foco na contração de pico no topo do movimento.',
          sets: setsList,
        };
      });

      setExercisesState(initialExercises);
    }
  }, [activeGroup]);

  // Main timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Rest countdown interval
  useEffect(() => {
    let restInterval: NodeJS.Timeout;
    if (restTimeRemaining !== null && restTimeRemaining > 0) {
      restInterval = setInterval(() => {
        setRestTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            showNotification('Descanso finalizado! Próxima série.');
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(restInterval);
  }, [restTimeRemaining]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Toggle set completion and trigger rest timer
  const handleToggleSet = (exerciseIndex: number, setIndex: number) => {
    const updated = [...exercisesState];
    const targetSet = updated[exerciseIndex].sets[setIndex];
    const wasCompleted = targetSet.completed;

    targetSet.completed = !wasCompleted;
    setExercisesState(updated);

    if (!wasCompleted) {
      // Trigger rest timer
      const restSec = updated[exerciseIndex].restSeconds || 60;
      setRestTimeRemaining(restSec);
      setActiveRestExercise(updated[exerciseIndex].name);
      showNotification(`Série ${setIndex + 1} concluída! Descanso de ${restSec}s iniciado.`);
    }
  };

  const handleUpdateSetWeight = (exerciseIndex: number, setIndex: number, val: number) => {
    const updated = [...exercisesState];
    updated[exerciseIndex].sets[setIndex].weight = Math.max(0, val);
    setExercisesState(updated);
  };

  const handleUpdateSetReps = (exerciseIndex: number, setIndex: number, val: number) => {
    const updated = [...exercisesState];
    updated[exerciseIndex].sets[setIndex].reps = Math.max(0, val);
    setExercisesState(updated);
  };

  const handleAddSet = (exerciseIndex: number) => {
    const updated = [...exercisesState];
    const lastSet = updated[exerciseIndex].sets[updated[exerciseIndex].sets.length - 1];
    updated[exerciseIndex].sets.push({
      setNumber: updated[exerciseIndex].sets.length + 1,
      type: 'normal',
      previousWeight: lastSet?.weight || 20,
      weight: lastSet?.weight || 20,
      reps: lastSet?.reps || 10,
      targetReps: lastSet?.targetReps || '10',
      completed: false
    });
    setExercisesState(updated);
    showNotification('Nova série adicionada ao exercício.');
  };

  // Calculate workout statistics
  const totalSetsCount = exercisesState.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSetsCount = exercisesState.reduce(
    (acc, ex) => acc + ex.sets.filter(s => s.completed).length, 
    0
  );
  const progressPercent = totalSetsCount > 0 ? Math.round((completedSetsCount / totalSetsCount) * 100) : 0;
  
  const totalVolumeKg = exercisesState.reduce((acc, ex) => {
    return acc + ex.sets.filter(s => s.completed).reduce((sAcc, s) => sAcc + (s.weight * s.reps), 0);
  }, 0);

  const handleFinishWorkout = () => {
    setIsTimerRunning(false);
    setIsFinishedModalOpen(true);
  };

  const confirmFinishWorkout = () => {
    if (onFinish) {
      onFinish({
        duration: formatTime(secondsElapsed),
        totalVolumeKg,
        completedSets: completedSetsCount
      });
    }
    showNotification('Treino concluído com sucesso e gravado no histórico!');
    onClose();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-alpha-500 selection:text-white pb-20">
      
      {/* 1. Header Fixo do App de Treino (Padrão MFit / Strong) */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between shadow-md">
        
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Voltar ao portal"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-alpha-400 uppercase tracking-wider">
                Em Execução • {routine.divisionName || 'ABC'}
              </span>
              <span className="text-[9px] bg-slate-800 text-slate-300 font-semibold px-2 py-0.2 rounded">
                Coach Diego
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-black text-white leading-tight">
              Treino {activeGroup?.letter}: {activeGroup?.title}
            </h1>
          </div>
        </div>

        {/* Stopwatch & Finish CTA */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 font-mono text-xs font-bold text-slate-200">
            <Timer className="w-3.5 h-3.5 text-alpha-400 animate-pulse" />
            <span>{formatTime(secondsElapsed)}</span>
          </div>

          <button
            onClick={handleFinishWorkout}
            className="bg-alpha-500 hover:bg-alpha-600 text-white font-black text-xs uppercase tracking-wider px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-alpha-500/25"
          >
            Finalizar
          </button>
        </div>

      </header>

      {/* 2. Global Progress Bar & Group Switcher */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 space-y-4">
        
        {/* Progress Bar Ribbon */}
        <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-slate-300">Progresso do Treino</span>
              <span className="text-alpha-400">{progressPercent}% Concluído</span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="text-right border-l border-slate-700 pl-4 shrink-0">
            <span className="text-[10px] text-slate-400 block font-medium">Volume Total</span>
            <span className="text-sm font-black font-mono text-white">{totalVolumeKg.toLocaleString('pt-BR')} kg</span>
          </div>
        </div>

        {/* Division Selector (A, B, C, D) */}
        <div className="flex gap-2">
          {routine.groups?.map((grp) => (
            <button
              key={grp.letter}
              onClick={() => setActiveGroupLetter(grp.letter)}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activeGroupLetter === grp.letter
                  ? 'bg-alpha-500 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              <span>Treino {grp.letter}</span>
            </button>
          ))}
        </div>

        {/* Rest Interval Active Banner (Float) */}
        {restTimeRemaining !== null && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xl border border-orange-400 flex items-center justify-between animate-slideUp">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-white animate-spin" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-black text-amber-200 block">Tempo de Descanso</span>
                <span className="text-xs font-bold">{activeRestExercise || 'Próxima série'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl font-black font-mono tracking-tight">{restTimeRemaining}s</span>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setRestTimeRemaining(prev => prev ? prev + 30 : 30)}
                  className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-[10px] font-bold"
                >
                  +30s
                </button>
                <button
                  onClick={() => setRestTimeRemaining(null)}
                  className="p-1 bg-white/20 hover:bg-white/30 rounded-lg text-[10px] font-bold"
                  title="Pular descanso"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. Interactive Exercises List (Padrão MFit / Strong App) */}
        <div className="space-y-4 pt-1">
          {exercisesState.map((exercise, exIdx) => {
            const completedSetsInExercise = exercise.sets.filter(s => s.completed).length;

            return (
              <div
                key={exercise.exerciseId}
                className="rounded-2xl bg-[#141A26] border border-slate-800 overflow-hidden shadow-sm space-y-3 p-4 sm:p-5"
              >
                {/* Exercise Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-alpha-400 text-xs shrink-0 mt-0.5">
                      {exIdx + 1}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-white leading-tight">
                        {exercise.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                        <span className="capitalize font-medium">{exercise.category}</span>
                        <span>•</span>
                        <span className="font-mono">Descanso: {exercise.restSeconds}s</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                    {completedSetsInExercise}/{exercise.sets.length} séries
                  </span>
                </div>

                {/* Coach Note / Biomechanical Tip */}
                {exercise.coachNote && (
                  <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60 text-[11px] text-slate-300 flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-alpha-400 shrink-0 mt-0.5" />
                    <span><strong>Orientação do Coach:</strong> {exercise.coachNote}</span>
                  </div>
                )}

                {/* Sets Grid Table (Exact MFit / Strong Table) */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800/60">
                        <th className="pb-2 text-center w-12">Série</th>
                        <th className="pb-2 w-20 text-center">Anterior</th>
                        <th className="pb-2 text-center">Carga (kg)</th>
                        <th className="pb-2 text-center">Reps</th>
                        <th className="pb-2 text-right w-14">Check</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {exercise.sets.map((set, sIdx) => (
                        <tr
                          key={set.setNumber}
                          className={`transition-colors ${
                            set.completed ? 'bg-emerald-950/20' : 'hover:bg-slate-800/30'
                          }`}
                        >
                          {/* Set Number & Type */}
                          <td className="py-2.5 text-center">
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold ${
                              set.completed 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                : 'bg-slate-800 text-slate-300'
                            }`}>
                              {set.setNumber}
                            </span>
                          </td>

                          {/* Previous weight reference */}
                          <td className="py-2.5 text-center font-mono text-[11px] text-slate-500">
                            {set.previousWeight} kg
                          </td>

                          {/* Editable Current Weight */}
                          <td className="py-2.5 text-center">
                            <div className="inline-flex items-center justify-center gap-1 bg-slate-800 border border-slate-700 rounded-xl px-2 py-1">
                              <input
                                type="number"
                                step="0.5"
                                value={set.weight}
                                onChange={(e) => handleUpdateSetWeight(exIdx, sIdx, parseFloat(e.target.value) || 0)}
                                className="w-12 bg-transparent text-center font-mono font-bold text-xs text-white focus:outline-none"
                              />
                              <span className="text-[10px] text-slate-400">kg</span>
                            </div>
                          </td>

                          {/* Editable Current Reps */}
                          <td className="py-2.5 text-center">
                            <div className="inline-flex items-center justify-center gap-1 bg-slate-800 border border-slate-700 rounded-xl px-2 py-1">
                              <input
                                type="number"
                                value={set.reps}
                                onChange={(e) => handleUpdateSetReps(exIdx, sIdx, parseInt(e.target.value) || 0)}
                                className="w-10 bg-transparent text-center font-mono font-bold text-xs text-white focus:outline-none"
                              />
                              <span className="text-[10px] text-slate-400">reps</span>
                            </div>
                          </td>

                          {/* Set Completion Check Button */}
                          <td className="py-2.5 text-right">
                            <button
                              onClick={() => handleToggleSet(exIdx, sIdx)}
                              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-xs ${
                                set.completed
                                  ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600'
                              }`}
                            >
                              <Check className="w-4 h-4 stroke-[2.5]" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add Set Button */}
                <div className="pt-2 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => handleAddSet(exIdx)}
                    className="text-[11px] font-bold text-alpha-400 hover:text-alpha-300 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Série</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Floating Finish Bar */}
        <div className="pt-6">
          <button
            onClick={handleFinishWorkout}
            className="w-full bg-alpha-500 hover:bg-alpha-600 text-white font-black text-sm uppercase tracking-wider py-4 rounded-2xl transition-all shadow-xl hover:shadow-alpha-500/30 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Concluir Treino de Hoje</span>
          </button>
        </div>

      </div>

      {/* 4. Workout Completed Victory Modal */}
      {isFinishedModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#141A26] rounded-3xl p-7 border border-slate-700 shadow-2xl text-center space-y-6 text-white animate-scaleUp">
            
            <div className="w-16 h-16 rounded-full bg-alpha-500/20 border border-alpha-500/40 text-alpha-500 flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-8 h-8 text-alpha-400" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-alpha-400 tracking-wider">Treino Finalizado</span>
              <h2 className="text-2xl font-black text-white uppercase">Excelente Trabalho!</h2>
              <p className="text-xs text-slate-400">
                Sua sessão do <strong>Treino {activeGroup?.letter}</strong> foi gravada no histórico.
              </p>
            </div>

            {/* Session Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] text-slate-400 block font-medium">Tempo</span>
                <span className="text-base font-black font-mono text-white mt-0.5 block">{formatTime(secondsElapsed)}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] text-slate-400 block font-medium">Volume</span>
                <span className="text-base font-black font-mono text-alpha-400 mt-0.5 block">{totalVolumeKg} kg</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] text-slate-400 block font-medium">Séries</span>
                <span className="text-base font-black font-mono text-emerald-400 mt-0.5 block">{completedSetsCount}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Frequência semanal atualizada: +1 dia de treino</span>
            </div>

            <button
              onClick={confirmFinishWorkout}
              className="w-full bg-alpha-500 hover:bg-alpha-600 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-full transition-all shadow-md"
            >
              Salvar e Voltar ao Painel
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
