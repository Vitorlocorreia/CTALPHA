import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Database, 
  ShieldCheck, 
  UploadCloud, 
  CheckCircle2, 
  Users, 
  DollarSign, 
  RotateCcw, 
  Building2, 
  Lock,
  AlertCircle,
  FileCheck,
  ChevronRight,
  ShieldAlert,
  Server
} from 'lucide-react';
import { GYM_INFO } from '@/data/mockData';

export const MigrationView: React.FC = () => {
  const { 
    migrationCompleted, 
    migrationProgress, 
    isMigrating, 
    startMigration,
    setCurrentView 
  } = useApp();

  const [showReviewModal, setShowReviewModal] = useState(false);

  return (
    <div className="space-y-5 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Migração do G3 & Governança de Dados</h1>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold px-2 py-0.5 rounded">
              Preparação • Validação • Importação • Homologação
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ambiente seguro de transição de dados para assegurar 100% de integridade dos contratos e cadastros.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold">
            <Server className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Base G3 Conectada (26/08/2026 às 00:42)
          </span>
        </div>
      </div>

      {/* Main Validation Console Card */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        
        {/* Status Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0D121D] border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-500 font-semibold block">1. Cadastros de Alunos</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white">640 alunos</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              640 registros mapeados
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0D121D] border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-500 font-semibold block">2. Contratos & Recebíveis</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white">R$ 84.320,00</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Planos e vencimentos espelhados
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0D121D] border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-500 font-semibold block">3. Unidades & Modalidades</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white">2 Unidades</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Crossfit, Tatame e Musculação
            </div>
          </div>

        </div>

        {/* Audit Notification Banner (Pendências para Revisão) */}
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-900 dark:text-amber-200 block">3 registros de alunos antigos precisam de conferência de CPF</span>
              <p className="text-amber-800 dark:text-amber-300 text-[11px] mt-0.5">
                Alunos matriculados no G3 em 2022 sem documento completo preenchido na época.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowReviewModal(true)}
            className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-amber-900 dark:text-amber-200 font-semibold px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-600 transition-colors shrink-0 shadow-xs"
          >
            Revisar 3 Pendências
          </button>
        </div>

        {/* Action Center: Controlled Staging Execution */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0D121D]/50 text-center space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {migrationCompleted 
              ? 'Homologação Concluída com Sucesso no CT ALPHA Hub' 
              : 'Execução Controlada da Homologação (Ambiente Staging)'}
          </h4>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            {migrationCompleted 
              ? 'Todos os dados foram validados e estão sincronizados. O sistema está pronto para a operação diária.'
              : 'A importação definitiva só é confirmada após a validação da base pela equipe do CT ALPHA, garantindo zero impacto no atendimento.'}
          </p>

          {isMigrating ? (
            <div className="max-w-md mx-auto space-y-2 py-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1 text-alpha-500">
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  Validando integridade dos registros...
                </span>
                <span>{migrationProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-alpha-500 h-full transition-all duration-300" style={{ width: `${migrationProgress}%` }}></div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                onClick={startMigration}
                className="bg-alpha-500 hover:bg-alpha-600 text-white font-semibold text-xs px-5 py-2 rounded-lg transition-colors shadow-xs flex items-center gap-2"
              >
                <FileCheck className="w-3.5 h-3.5" />
                {migrationCompleted ? 'Revalidar Base G3' : 'Executar Homologação da Base'}
              </button>

              {migrationCompleted && (
                <button
                  onClick={() => setCurrentView('students')}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs px-4 py-2 rounded-lg transition-colors shadow-xs"
                >
                  Conferir Alunos Importados
                </button>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Audit Modal for Pending Records */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Auditoria de Cadastros Antigos (G3)</h3>
              <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block">José Pereira de Souza</span>
                <span className="text-[11px] text-slate-500">Matrícula 2022 • CPF não cadastrado no G3</span>
                <span className="text-[10px] text-emerald-600 block mt-1">✓ Identificado por Telefone e Biometria</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block">Ana Cecília Lins</span>
                <span className="text-[11px] text-slate-500">Matrícula 2023 • Contrato Anual encerrado</span>
                <span className="text-[10px] text-slate-500 block mt-1">Sugerir migração para Plano Alpha VIP Recorrente</span>
              </div>
            </div>

            <button
              onClick={() => setShowReviewModal(false)}
              className="w-full bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold py-2 rounded-lg"
            >
              Concluir Revisão
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
