import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  Dumbbell, 
  MessageSquare, 
  Receipt, 
  Database, 
  Building2, 
  Sun,
  Moon,
  ChevronDown,
  User,
  ShieldCheck,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { GYM_INFO } from '@/data/mockData';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    selectedUnit, 
    setSelectedUnit, 
    userRole, 
    setUserRole,
    theme,
    toggleTheme,
    migrationCompleted 
  } = useApp();

  const allNavItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'students', label: 'Alunos & Cadastros', icon: Users },
    { id: 'workout_builder', label: 'Construtor de Treino', icon: Dumbbell },
    { id: 'exercise_library', label: 'Biblioteca de Exercícios', icon: BookOpen },
    { id: 'workout_library', label: 'Biblioteca de Fichas Base', icon: BookOpen },
    { id: 'commercial', label: 'Atendimento & Leads', icon: MessageSquare },
    { id: 'financial', label: 'Financeiro & Recorrência', icon: Receipt },
    { 
      id: 'migration', 
      label: 'Migração G3', 
      icon: Database,
      badge: migrationCompleted ? 'Concluído' : 'Pendente',
      badgeColor: migrationCompleted 
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
        : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
    },
  ];

  const navItems = allNavItems.filter(item => {
    if (userRole === 'recepcao') return item.id === 'students';
    if (userRole === 'personal' || (userRole as string) === 'treinador') return item.id === 'workout_builder' || item.id === 'exercise_library' || item.id === 'workout_library' || item.id === 'students';
    return true;
  });

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0A0D14]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#1E2638] transition-colors">
      {/* Top Meta Bar */}
      <div className="bg-slate-50 dark:bg-[#0D121D] px-4 sm:px-6 py-1.5 border-b border-slate-200/80 dark:border-[#1A2234] text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            CT ALPHA • Gestão de Academia & Treinamento
          </span>
          <span className="text-slate-300 dark:text-slate-600 hidden md:inline">|</span>
          <span className="hidden md:inline text-slate-600 dark:text-slate-400">{GYM_INFO.addressUnit1}</span>
          <span className="text-slate-300 dark:text-slate-600 hidden lg:inline">|</span>
          <span className="hidden lg:inline text-slate-600 dark:text-slate-400">Tel: {GYM_INFO.phone}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Unit Selector */}
          <div className="flex items-center gap-1 bg-white dark:bg-[#101522] p-0.5 rounded-lg border border-slate-200 dark:border-[#1E2638] shadow-xs">
            <Building2 className="w-3 h-3 text-slate-400 ml-1.5" />
            <button
              onClick={() => setSelectedUnit('todas')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-all ${
                selectedUnit === 'todas'
                  ? 'bg-alpha-500 text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Consolidado
            </button>
            <button
              onClick={() => setSelectedUnit('unidade-1')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-all ${
                selectedUnit === 'unidade-1'
                  ? 'bg-alpha-500 text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Matriz
            </button>
            <button
              onClick={() => setSelectedUnit('unidade-2')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-all ${
                selectedUnit === 'unidade-2'
                  ? 'bg-alpha-500 text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Unidade 2
            </button>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#101522] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#161D2E] transition-all text-[11px] font-medium shadow-xs"
            title="Alternar entre modo claro e escuro"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Modo Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-700" />
                <span className="hidden sm:inline">Modo Escuro</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Nav Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-[#1E2638] p-1 flex items-center justify-center shadow-xs">
              <img src="/logo.png" alt="CT ALPHA" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-slate-900 dark:text-white font-sans uppercase">
                  CT <span className="text-alpha-500">ALPHA</span>
                </span>
                <span className="bg-alpha-50 dark:bg-alpha-500/10 text-alpha-600 dark:text-alpha-400 border border-alpha-200 dark:border-alpha-500/30 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                  Hub
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-none">Centro de Treinamento • Aliança/PE</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-alpha-500 text-white shadow-sm shadow-alpha-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#101522]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                      isActive 
                        ? 'bg-white/20 text-white border-white/30' 
                        : item.badgeColor
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Profile Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('login')}
              className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 dark:bg-[#101522] dark:hover:bg-[#161D2E] border border-slate-200 dark:border-[#1E2638] px-3 py-1.5 rounded-xl text-xs transition-colors shadow-xs"
            >
              <div className="w-5 h-5 rounded-full bg-alpha-500 text-white flex items-center justify-center font-bold text-[10px]">
                A
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block leading-tight">Abílio Alves</span>
                <span className="text-[10px] text-slate-500 block leading-none">Gestor Geral</span>
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Tabbar */}
      <div className="md:hidden flex items-center overflow-x-auto px-2 py-1.5 gap-1 border-t border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#0D121D]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium transition-all ${
                isActive
                  ? 'bg-alpha-500 text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
