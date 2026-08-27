import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Search, 
  Clock, 
  Menu, 
  X,
  Building2,
  Moon,
  Sun,
  LogOut,
  Layers,
  Users,
  LayoutDashboard,
  Receipt,
  Kanban,
  Dumbbell,
  BookOpen,
  Database,
  Globe
} from 'lucide-react';

export const Header: React.FC = () => {
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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const viewTitles: Record<string, { group: string; title: string }> = {
    dashboard: { group: 'OPERAÇÃO', title: 'Visão Geral' },
    students: { group: 'OPERAÇÃO', title: 'Cadastro de Alunos' },
    workout_builder: { group: 'TREINAMENTO', title: 'Construtor de Treino & Anamnese' },
    workouts: { group: 'TREINAMENTO', title: 'Construtor de Treino & Anamnese' },
    exercise_library: { group: 'TREINAMENTO', title: 'Biblioteca de Exercícios' },
    workout_library: { group: 'TREINAMENTO', title: 'Biblioteca de Fichas Base' },
    commercial: { group: 'RELACIONAMENTO', title: 'CRM & Pipeline' },
    financial: { group: 'FINANCEIRO', title: 'Receitas & Cobrança' },
    migration: { group: 'SISTEMA', title: 'Migrador de Dados G3' },
  };

  const currentMeta = viewTitles[currentView] || { group: 'CT ALPHA', title: 'Painel' };

  const menuItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'students', label: 'Alunos', icon: Users },
    { id: 'workout_builder', label: 'Construtor de Treino', icon: Layers },
    { id: 'exercise_library', label: 'Biblioteca de Exercícios', icon: Dumbbell },
    { id: 'commercial', label: 'CRM & Pipeline', icon: Kanban },
    { id: 'financial', label: 'Financeiro & PIX', icon: Receipt },
    { id: 'migration', label: 'Migração G3', icon: Database },
  ];

  return (
    <>
      <header className="h-14 bg-white dark:bg-[#0D121D] border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20 transition-colors">
        
        {/* Left: Mobile Menu Toggle + Breadcrumbs */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Abrir menu de navegação"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 text-xs truncate">
            <span className="font-bold text-alpha-500 uppercase tracking-wider text-[10px] hidden sm:inline">
              {currentMeta.group}
            </span>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">/</span>
            <span className="font-bold text-slate-900 dark:text-white truncate text-xs sm:text-sm">
              {currentMeta.title}
            </span>
          </div>
        </div>

        {/* Center/Right: Fast Global Search + Context Meta */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Search */}
          <div className="relative hidden md:block w-48 lg:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar aluno, CPF..."
              className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-alpha-500"
            />
          </div>

          {/* Unit Selector Compact */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 p-1 rounded-lg text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-slate-400 ml-1 hidden sm:inline" />
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value as any)}
              className="bg-transparent text-slate-800 dark:text-slate-200 text-[11px] font-bold focus:outline-none cursor-pointer pr-1"
            >
              <option value="todas">Todas Unidades</option>
              <option value="unidade-1">Matriz (Centro)</option>
              <option value="unidade-2">Unidade 2</option>
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#101522] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            aria-label="Alternar tema claro/escuro"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Supabase Live DB Status */}
          <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] text-slate-400 font-mono">Postgres Cloud</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">Online</span>
          </div>

        </div>

      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex lg:hidden">
          <div className="w-72 bg-white dark:bg-[#0D121D] h-full flex flex-col p-4 shadow-2xl animate-slideLeft border-r border-slate-200 dark:border-slate-800">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-alpha-500 flex items-center justify-center text-white font-black text-sm">
                  α
                </div>
                <span className="font-bold text-sm text-slate-900 dark:text-white">CT ALPHA Hub</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-3 flex-1 space-y-1 overflow-y-auto">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2 py-1">
                Navegação Principal
              </span>

              {menuItems.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id || (item.id === 'workout_builder' && currentView === 'workouts');

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-alpha-500 text-white font-bold shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2 text-xs">
              <button
                onClick={() => {
                  setCurrentView('login');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair da Sessão</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
