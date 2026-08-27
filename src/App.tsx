import React, { Suspense } from 'react';
import { useApp } from '@/context/AppContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CheckCircle2, Loader2 } from 'lucide-react';

// Core Management Views
import { DashboardView } from '@/components/dashboard/DashboardView';
import { StudentsView } from '@/components/students/StudentsView';
import { WorkoutBuilderView } from '@/components/workouts/WorkoutBuilderView';
import { ExerciseLibraryView } from '@/components/workouts/ExerciseLibraryView';
import { FinancialView } from '@/components/financial/FinancialView';
import { CommercialAIView } from '@/components/commercial/CommercialAIView';
import { LandingPageView } from '@/components/landing/LandingPageView';
import { CheckoutView } from '@/components/checkout/CheckoutView';

// Code-Splitting: External / Secondary Views
const WorkoutEngineView = React.lazy(() => import('@/components/workouts/WorkoutEngineView').then(m => ({ default: m.WorkoutEngineView })));
const MigrationView = React.lazy(() => import('@/components/migration/MigrationView').then(m => ({ default: m.MigrationView })));
const LoginView = React.lazy(() => import('@/components/login/LoginView').then(m => ({ default: m.LoginView })));
const StudentPortalView = React.lazy(() => import('@/components/student-portal/StudentPortalView').then(m => ({ default: m.StudentPortalView })));
const StudentLoginView = React.lazy(() => import('@/components/student-portal/StudentLoginView').then(m => ({ default: m.StudentLoginView })));
const WorkoutTrackerView = React.lazy(() => import('@/components/student-portal/WorkoutTrackerView').then(m => ({ default: m.WorkoutTrackerView })));
const WorkoutHubView = React.lazy(() => import('@/components/student-portal/WorkoutHubView').then(m => ({ default: m.WorkoutHubView })));

const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px] w-full">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="w-8 h-8 text-alpha-500 animate-spin" />
      <span className="text-xs font-semibold text-slate-500 animate-pulse">Carregando módulo CT ALPHA...</span>
    </div>
  </div>
);

export const App: React.FC = () => {
  const { currentView, setCurrentView, workouts, notification, showNotification } = useApp();

  // Public Landing Page (B2C)
  if (currentView === 'landing') {
    return (
      <Suspense fallback={<PageLoader />}>
        <LandingPageView />
      </Suspense>
    );
  }

  // Split-screen Checkout & Enrollment Flow
  if (currentView === 'checkout') {
    return (
      <Suspense fallback={<PageLoader />}>
        <CheckoutView />
      </Suspense>
    );
  }

  // Fullscreen Login Screen (Management)
  if (currentView === 'login') {
    return (
      <Suspense fallback={<PageLoader />}>
        <LoginView />
      </Suspense>
    );
  }

  // Student Portal Dedicated Login
  if (currentView === 'student_login') {
    return (
      <Suspense fallback={<PageLoader />}>
        <StudentLoginView />
      </Suspense>
    );
  }

  // Dedicated MFit-style Workout Tracker Session App
  if (currentView === 'workout_tracker') {
    return (
      <Suspense fallback={<PageLoader />}>
        <WorkoutTrackerView
          routine={workouts[0]}
          initialGroupLetter="A"
          onClose={() => setCurrentView('student_portal')}
          onFinish={(summary) => {
            showNotification(`Treino concluído em ${summary.duration}! Volume: ${summary.totalVolumeKg} kg.`);
            setCurrentView('student_portal');
          }}
        />
      </Suspense>
    );
  }

  // Dedicated Workout Hub (Pastas, Rotinas e Treinos do Dia)
  if (currentView === 'workout_hub') {
    return (
      <Suspense fallback={<PageLoader />}>
        <WorkoutHubView
          routine={workouts[0]}
          studentName="Vitor Luiz Correia"
          onBack={() => setCurrentView('student_portal')}
          onOpenGenerator={() => setCurrentView('student_portal')}
        />
      </Suspense>
    );
  }

  // Student Full Portal View (Meus Treinos, Agenda, Financeiro, Dados Cadastrais, Token)
  if (currentView === 'student_portal') {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900">
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 bg-white border border-slate-200 text-slate-900 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slideUp">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-semibold">{notification}</span>
          </div>
        )}
        <Suspense fallback={<PageLoader />}>
          <StudentPortalView />
        </Suspense>
      </div>
    );
  }

  // Standard Enterprise ERP Shell (Gestor / Recepção / Treinador)
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0D14] text-slate-900 dark:text-slate-100 flex font-sans selection:bg-alpha-500 selection:text-white transition-colors duration-200">
      
      {/* Toast Notification Alert */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slideUp">
          <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold">{notification}</span>
        </div>
      )}

      {/* Enterprise Sidebar */}
      <Sidebar />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'students' && <StudentsView />}
          {currentView === 'workouts' && <WorkoutBuilderView />}
          {currentView === 'workout_builder' && <WorkoutBuilderView />}
          {currentView === 'exercise_library' && <ExerciseLibraryView />}
          {currentView === 'commercial' && <CommercialAIView />}
          {currentView === 'financial' && <FinancialView />}
          {currentView === 'workout_library' && (
            <Suspense fallback={<PageLoader />}>
              <WorkoutEngineView initialMode="biblioteca" />
            </Suspense>
          )}
          {currentView === 'migration' && (
            <Suspense fallback={<PageLoader />}>
              <MigrationView />
            </Suspense>
          )}
        </main>

        <footer className="border-t border-slate-200 dark:border-slate-800/80 py-4 text-center text-[11px] text-slate-400 dark:text-slate-500 bg-white dark:bg-[#0D121D] transition-colors mt-8 pb-20 lg:pb-4">
          <p className="font-semibold text-slate-600 dark:text-slate-400">CT ALPHA Hub • Sistema de Gestão Empresarial</p>
          <p className="mt-0.5">Rua Marechal Deodoro da Fonseca, 150 • Aliança - PE • Musculação, Crossfit & Lutas</p>
        </footer>

        {/* Mobile Persistent Bottom Navigation Bar */}
        <nav 
          aria-label="Navegação móvel inferior"
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0D121D]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 lg:hidden px-1 py-1 grid grid-cols-5 items-center justify-items-center pb-[max(0.5rem,env(safe-area-inset-bottom))]"
        >
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex flex-col items-center gap-0.5 py-1 text-[9px] sm:text-[10px] font-semibold transition-all ${
              currentView === 'dashboard' 
                ? 'text-alpha-500 font-bold' 
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <div className={`p-1 rounded-md ${currentView === 'dashboard' ? 'bg-alpha-500/10' : ''}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
            </div>
            <span className="truncate">Início</span>
          </button>

          <button
            onClick={() => setCurrentView('students')}
            className={`w-full flex flex-col items-center gap-0.5 py-1 text-[9px] sm:text-[10px] font-semibold transition-all ${
              currentView === 'students' 
                ? 'text-alpha-500 font-bold' 
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <div className={`p-1 rounded-md ${currentView === 'students' ? 'bg-alpha-500/10' : ''}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span className="truncate">Alunos</span>
          </button>

          <button
            onClick={() => setCurrentView('workout_builder')}
            className={`w-full flex flex-col items-center gap-0.5 py-1 text-[9px] sm:text-[10px] font-semibold transition-all ${
              currentView === 'workout_builder' || currentView === 'workouts'
                ? 'text-alpha-500 font-bold' 
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <div className={`p-1 rounded-md ${currentView === 'workout_builder' || currentView === 'workouts' ? 'bg-alpha-500/10' : ''}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="m6.5 6.5 11 11" />
                <path d="m21 21-1-1" />
                <path d="m3 3 1 1" />
                <path d="m18 22 4-4" />
                <path d="m2 6 4-4" />
                <path d="m3 10 7-7" />
                <path d="m14 21 7-7" />
              </svg>
            </div>
            <span className="truncate">Treinos</span>
          </button>

          <button
            onClick={() => setCurrentView('commercial')}
            className={`w-full flex flex-col items-center gap-0.5 py-1 text-[9px] sm:text-[10px] font-semibold transition-all ${
              currentView === 'commercial' 
                ? 'text-alpha-500 font-bold' 
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <div className={`p-1 rounded-md ${currentView === 'commercial' ? 'bg-alpha-500/10' : ''}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M8 7v7" />
                <path d="M12 7v4" />
                <path d="M16 7v9" />
              </svg>
            </div>
            <span className="truncate">CRM</span>
          </button>

          <button
            onClick={() => setCurrentView('financial')}
            className={`w-full flex flex-col items-center gap-0.5 py-1 text-[9px] sm:text-[10px] font-semibold transition-all ${
              currentView === 'financial' 
                ? 'text-alpha-500 font-bold' 
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <div className={`p-1 rounded-md ${currentView === 'financial' ? 'bg-alpha-500/10' : ''}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                <path d="M12 17V7" />
              </svg>
            </div>
            <span className="truncate">Financeiro</span>
          </button>
        </nav>
      </div>

    </div>
  );
};
