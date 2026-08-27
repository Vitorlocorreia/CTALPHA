import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Building2, 
  Lock, 
  User, 
  ArrowRight, 
  Sun,
  Moon,
  ShieldCheck,
  Dumbbell,
  Users,
  Smartphone,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { GYM_INFO } from '@/data/mockData';
import { UserRole, UnitId } from '@/types';

export const LoginView: React.FC = () => {
  const { setCurrentView, setUserRole, setSelectedUnit, theme, toggleTheme } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('gestor');
  const [unit, setUnit] = useState<UnitId>('todas');

  const handleLoginAs = (role: UserRole) => {
    setUserRole(role);
    setSelectedUnit(unit);

    if (role === 'gestor') {
      setCurrentView('dashboard');
    } else if (role === 'recepcao') {
      setCurrentView('students');
    } else if (role === 'personal') {
      setCurrentView('workouts');
    } else if (role === 'aluno') {
      setCurrentView('student_portal');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative bg-slate-50 dark:bg-[#0A0D14] select-none">
      
      {/* Absolute theme toggle on login screen */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101522] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#161D2E] transition-all text-xs font-semibold shadow-xs"
      >
        {theme === 'dark' ? (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Modo Claro</span>
          </>
        ) : (
          <>
            <Moon className="w-3.5 h-3.5 text-slate-700" />
            <span>Modo Escuro</span>
          </>
        )}
      </button>

      <div className="max-w-md w-full bg-white dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800 rounded-2xl p-7 shadow-xl space-y-5">
        
        {/* Brand Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-white/10 border border-slate-800 dark:border-slate-700 p-1 mx-auto mb-2.5 flex items-center justify-center shadow-xs">
            <img src="/logo.png" alt="CT ALPHA" className="w-full h-full object-contain" />
          </div>

          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-wider uppercase font-sans">
            CT <span className="text-alpha-500">ALPHA</span> Hub
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Sistema de Gestão Empresarial • Aliança/PE</p>
        </div>

        {/* Demo Fast Switcher (Cards com destinação real e específica) */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            Selecione o perfil para entrar:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            
            {/* Gestor */}
            <button
              onClick={() => handleLoginAs('gestor')}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#101522] hover:border-alpha-500 text-left transition-all group shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-alpha-500">Abílio Alves</span>
                <ShieldCheck className="w-3.5 h-3.5 text-alpha-500" />
              </div>
              <span className="text-[10px] text-slate-500 block">Diretor Geral</span>
              <span className="text-[9px] text-emerald-600 font-semibold block mt-1">→ Visão Geral & ERP</span>
            </button>

            {/* Recepção */}
            <button
              onClick={() => handleLoginAs('recepcao')}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#101522] hover:border-alpha-500 text-left transition-all group shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-alpha-500">Recepção</span>
                <Users className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <span className="text-[10px] text-slate-500 block">Frente de Caixa</span>
              <span className="text-[9px] text-emerald-600 font-semibold block mt-1">→ Alunos & Catraca</span>
            </button>

            {/* Treinador */}
            <button
              onClick={() => handleLoginAs('personal')}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#101522] hover:border-alpha-500 text-left transition-all group shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-alpha-500">Coach Diego</span>
                <Dumbbell className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <span className="text-[10px] text-slate-500 block">Treinador</span>
              <span className="text-[9px] text-emerald-600 font-semibold block mt-1">→ Prescrição Técnica</span>
            </button>

            {/* Aluno */}
            <button
              onClick={() => handleLoginAs('aluno')}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#101522] hover:border-alpha-500 text-left transition-all group shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-alpha-500">Carlos Henrique</span>
                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <span className="text-[10px] text-slate-500 block">Aluno VIP</span>
              <span className="text-[9px] text-emerald-600 font-semibold block mt-1">→ App / Treino do Aluno</span>
            </button>

          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => handleLoginAs('gestor')}
          className="w-full bg-slate-900 dark:bg-alpha-500 hover:bg-slate-800 dark:hover:bg-alpha-600 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          Acessar Painel Principal (Gestor)
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Public Landing Link */}
        <button
          onClick={() => setCurrentView('landing')}
          className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5"
        >
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <span>Ver Site Oficial (Landing Page B2C)</span>
        </button>

        <div className="pt-2 text-center">
          <span className="text-[10px] text-slate-400">
            Postgres Cloud • Supabase Conectado
          </span>
        </div>

      </div>
    </div>
  );
};
