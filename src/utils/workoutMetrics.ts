import { Exercise } from '@/types';

export interface WorkoutMetrics {
  totalExercises: number;
  totalSets: number;
  totalRestSeconds: number;
  totalRestMinutes: number;
  executionMinutes: number;
  warmupMinutes: number;
  estimatedMinutes: number;
  intensity: 'moderada' | 'alta' | 'extrema';
  intensityLabel: string;
}

export const calculateWorkoutMetrics = (exercises: Exercise[] = []): WorkoutMetrics => {
  if (!exercises || exercises.length === 0) {
    return {
      totalExercises: 0,
      totalSets: 0,
      totalRestSeconds: 0,
      totalRestMinutes: 0,
      executionMinutes: 0,
      warmupMinutes: 5,
      estimatedMinutes: 0,
      intensity: 'moderada',
      intensityLabel: 'Leve / Aquecimento'
    };
  }

  const totalExercises = exercises.length;
  
  // Total sets calculation
  const totalSets = exercises.reduce((acc, ex) => acc + (Number(ex.sets) || 3), 0);

  // Total rest time in seconds (sets * restSeconds per exercise)
  const totalRestSeconds = exercises.reduce((acc, ex) => {
    const sets = Number(ex.sets) || 3;
    const rest = Number(ex.restSeconds) || 60;
    return acc + (sets * rest);
  }, 0);

  // Estimated execution time under tension (avg 40s per set)
  const totalExecutionSeconds = totalSets * 40;

  const totalRestMinutes = Math.round(totalRestSeconds / 60);
  const executionMinutes = Math.round(totalExecutionSeconds / 60);
  const warmupMinutes = 6; // Aquecimento articular inicial padrão

  const totalMinutes = Math.round((totalExecutionSeconds + totalRestSeconds) / 60) + warmupMinutes;

  let intensity: 'moderada' | 'alta' | 'extrema' = 'moderada';
  let intensityLabel = 'Moderada (Hipertrofia Base)';

  if (totalSets >= 24 || totalMinutes >= 65) {
    intensity = 'extrema';
    intensityLabel = 'Alta Densidade / Avançado';
  } else if (totalSets >= 16 || totalMinutes >= 45) {
    intensity = 'alta';
    intensityLabel = 'Intensidade Otimizada';
  }

  return {
    totalExercises,
    totalSets,
    totalRestSeconds,
    totalRestMinutes,
    executionMinutes,
    warmupMinutes,
    estimatedMinutes: totalMinutes,
    intensity,
    intensityLabel
  };
};
