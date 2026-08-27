import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Lock, 
  User, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface StudentLoginViewProps {
  onBack?: () => void;
}

export const StudentLoginView: React.FC<StudentLoginViewProps> = ({ onBack }) => {
  const { setCurrentView, setUserRole, students, setActiveStudentId, showNotification } = useApp();

  const [identifier, setIdentifier] = useState('123.456.789-00');
  const [password, setPassword] = useState('••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const cleanInput = identifier.replace(/\D/g, '');
      const foundStudent = students.find(s => 
        s.cpf.replace(/\D/g, '') === cleanInput || 
        s.email?.toLowerCase() === identifier.toLowerCase() ||
        s.name.toLowerCase().includes(identifier.toLowerCase())
      ) || students[0];

      if (foundStudent) {
        setActiveStudentId(foundStudent.id);
      }

      setUserRole('aluno');
      setCurrentView('student_portal');
      showNotification(`Bem-vindo ao Portal, ${foundStudent?.name || 'Aluno'}!`);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-alpha-500 selection:text-white font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onBack ? onBack() : setCurrentView('landing')}
            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao site</span>
          </button>

          <span className="text-[10px] font-bold text-alpha-600 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Espaço do Aluno
          </span>
        </div>

        {/* Brand Logo */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 p-2 flex items-center justify-center mx-auto shadow-md">
            <img src="/logo.png" alt="CT ALPHA" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
            CT <span className="text-alpha-500">ALPHA</span> Portal
          </h2>
          <p className="text-xs text-slate-500">
            Acesse seus treinos, horários de aulas e financeiro
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">CPF ou E-mail:</label>
            <div className="relative">
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="000.000.000-00 ou email@exemplo.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-3 text-slate-900 pl-10 focus:outline-none focus:border-alpha-500 font-medium"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-slate-700">Senha de Acesso:</label>
              <button
                type="button"
                onClick={() => showNotification('Link de recuperação enviado para seu WhatsApp!')}
                className="text-[11px] font-bold text-alpha-600 hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-3 text-slate-900 pl-10 focus:outline-none focus:border-alpha-500 font-medium"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-alpha-500 hover:bg-alpha-600 text-white font-black uppercase tracking-wider py-3.5 rounded-full transition-all shadow-md flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? 'Acessando portal...' : 'Entrar no Portal do Aluno'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Access Pill */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
          <span className="text-[10px] text-slate-500 block">Demonstração com Aluno Cadastrado:</span>
          <button
            type="button"
            onClick={() => {
              const firstStudent = students[0];
              if (firstStudent) setActiveStudentId(firstStudent.id);
              setUserRole('aluno');
              setCurrentView('student_portal');
            }}
            className="text-xs font-bold text-slate-800 hover:text-alpha-600 transition-colors"
          >
            Entrar como <strong>{students[0]?.name || 'Carlos Henrique'}</strong> ({students[0]?.unit === 'unidade-1' ? 'Matriz' : 'Unidade 2'})
          </button>
        </div>

        {/* New Member Link */}
        <div className="pt-2 border-t border-slate-200 text-center text-xs text-slate-500">
          Ainda não é aluno CT ALPHA?{' '}
          <button
            onClick={() => setCurrentView('checkout')}
            className="font-bold text-alpha-600 hover:underline"
          >
            Matricule-se agora
          </button>
        </div>

      </div>
    </div>
  );
};
