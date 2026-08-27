import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Search, 
  Filter, 
  Plus, 
  Dumbbell, 
  Layers, 
  Info, 
  X, 
  Check, 
  Trash2, 
  Edit3, 
  Play, 
  AlertTriangle, 
  Tag, 
  ShieldAlert, 
  Video, 
  ExternalLink,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { ExerciseLibraryItem, MuscleGroup, EquipmentType, WorkoutLevel, MovementPattern } from '@/types';

const MUSCLE_GROUPS: { id: MuscleGroup | 'todos'; label: string }[] = [
  { id: 'todos', label: 'Todos os Músculos' },
  { id: 'peito', label: 'Peito' },
  { id: 'costas', label: 'Costas' },
  { id: 'ombros', label: 'Ombros' },
  { id: 'biceps', label: 'Bíceps' },
  { id: 'triceps', label: 'Tríceps' },
  { id: 'quadriceps', label: 'Quadríceps' },
  { id: 'posterior', label: 'Posterior' },
  { id: 'gluteos', label: 'Glúteos' },
  { id: 'panturrilha', label: 'Panturrilha' },
  { id: 'core', label: 'Core / Abdômen' },
  { id: 'fullbody', label: 'Full Body' },
];

const EQUIPMENTS: { id: EquipmentType | 'todos'; label: string }[] = [
  { id: 'todos', label: 'Todos Equipamentos' },
  { id: 'barra', label: 'Barra' },
  { id: 'halteres', label: 'Halteres' },
  { id: 'maquina', label: 'Máquina' },
  { id: 'cabo', label: 'Cabo / Polia' },
  { id: 'peso_corporal', label: 'Peso Corporal' },
  { id: 'kettlebell', label: 'Kettlebell' },
  { id: 'elastico', label: 'Elástico' },
  { id: 'outros', label: 'Outros' },
];

const MOVEMENT_PATTERNS: { id: MovementPattern | 'todos'; label: string }[] = [
  { id: 'todos', label: 'Todos os Padrões' },
  { id: 'empurrar_horizontal', label: 'Empurrar Horizontal' },
  { id: 'empurrar_vertical', label: 'Empurrar Vertical' },
  { id: 'puxar_horizontal', label: 'Puxar Horizontal' },
  { id: 'puxar_vertical', label: 'Puxar Vertical' },
  { id: 'agachamento', label: 'Padrão Agachamento' },
  { id: 'dobradica_quadril', label: 'Dobradiça de Quadril (Hinge)' },
  { id: 'avanco', label: 'Avanço / Passada' },
  { id: 'isolado', label: 'Isolado / Articulação Única' },
  { id: 'core_estabilidade', label: 'Core / Anti-Movimento' },
];

export const ExerciseLibraryView: React.FC = () => {
  const { exerciseLibrary, addExerciseToLibrary, updateExerciseInLibrary, deleteExerciseFromLibrary, showNotification } = useApp();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'todos'>('todos');
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | 'todos'>('todos');
  const [selectedLevel, setSelectedLevel] = useState<WorkoutLevel | 'todos'>('todos');
  const [selectedPattern, setSelectedPattern] = useState<MovementPattern | 'todos'>('todos');
  const [selectedModality, setSelectedModality] = useState<string>('todos');

  // Drawer / Inspection state
  const [inspectedExercise, setInspectedExercise] = useState<ExerciseLibraryItem | null>(null);

  // New / Edit Exercise Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formAltName, setFormAltName] = useState('');
  const [formPrimaryMuscle, setFormPrimaryMuscle] = useState<MuscleGroup>('peito');
  const [formSecondaryMuscles, setFormSecondaryMuscles] = useState('');
  const [formEquipment, setFormEquipment] = useState<EquipmentType>('halteres');
  const [formPattern, setFormPattern] = useState<MovementPattern>('empurrar_horizontal');
  const [formLevel, setFormLevel] = useState<WorkoutLevel>('intermediario');
  const [formModality, setFormModality] = useState<'musculacao' | 'crossfit' | 'lutas' | 'funcional'>('musculacao');
  const [formInstructions, setFormInstructions] = useState('');
  const [formObservations, setFormObservations] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formContraindications, setFormContraindications] = useState('');
  const [formTags, setFormTags] = useState('');

  // Filter exercises
  const filteredExercises = exerciseLibrary.filter((ex) => {
    const matchesSearch = 
      ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ex.alternateName && ex.alternateName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ex.tags && ex.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesMuscle = selectedMuscle === 'todos' || ex.primaryMuscle === selectedMuscle;
    const matchesEquip = selectedEquipment === 'todos' || ex.equipment === selectedEquipment;
    const matchesLevel = selectedLevel === 'todos' || ex.level === selectedLevel;
    const matchesPattern = selectedPattern === 'todos' || ex.movementPattern === selectedPattern;
    const matchesModality = selectedModality === 'todos' || ex.modality === selectedModality;

    return matchesSearch && matchesMuscle && matchesEquip && matchesLevel && matchesPattern && matchesModality;
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormName('');
    setFormAltName('');
    setFormPrimaryMuscle('peito');
    setFormSecondaryMuscles('Tríceps Braquial, Deltoide Anterior');
    setFormEquipment('halteres');
    setFormPattern('empurrar_horizontal');
    setFormLevel('intermediario');
    setFormModality('musculacao');
    setFormInstructions('');
    setFormObservations('');
    setFormVideoUrl('');
    setFormImageUrl('');
    setFormContraindications('Nenhuma relatada');
    setFormTags('#hipertrofia, #halteres');
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (ex: ExerciseLibraryItem) => {
    setEditingId(ex.id);
    setFormName(ex.name);
    setFormAltName(ex.alternateName || '');
    setFormPrimaryMuscle(ex.primaryMuscle);
    setFormSecondaryMuscles(ex.secondaryMuscles?.join(', ') || '');
    setFormEquipment(ex.equipment);
    setFormPattern(ex.movementPattern || 'isolado');
    setFormLevel(ex.level);
    setFormModality(ex.modality);
    setFormInstructions(ex.instructions || '');
    setFormObservations(ex.observations || '');
    setFormVideoUrl(ex.videoUrl || '');
    setFormImageUrl(ex.imageUrl || '');
    setFormContraindications(ex.contraindications?.join(', ') || '');
    setFormTags(ex.tags?.join(', ') || '');
    setIsFormModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const secondaryArray = formSecondaryMuscles ? formSecondaryMuscles.split(',').map(s => s.trim()).filter(Boolean) : [];
    const contraindicationsArray = formContraindications ? formContraindications.split(',').map(s => s.trim()).filter(Boolean) : [];
    const tagsArray = formTags ? formTags.split(',').map(s => s.trim()).filter(Boolean) : [];

    const defaultThumbs: Record<string, string> = {
      peito: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&auto=format&fit=crop&q=80',
      costas: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&auto=format&fit=crop&q=80',
      ombros: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=400&auto=format&fit=crop&q=80',
      quadriceps: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&auto=format&fit=crop&q=80',
      posterior: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80',
      gluteos: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80',
      biceps: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=80',
      triceps: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80',
      core: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=80',
      fullbody: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&auto=format&fit=crop&q=80',
    };

    const item: ExerciseLibraryItem = {
      id: editingId || `ex-lib-${Date.now()}`,
      name: formName,
      alternateName: formAltName,
      primaryMuscle: formPrimaryMuscle,
      secondaryMuscles: secondaryArray,
      equipment: formEquipment,
      movementPattern: formPattern,
      level: formLevel,
      modality: formModality,
      instructions: formInstructions,
      observations: formObservations,
      videoUrl: formVideoUrl,
      imageUrl: formImageUrl || defaultThumbs[formPrimaryMuscle] || defaultThumbs.peito,
      videoThumb: formImageUrl || defaultThumbs[formPrimaryMuscle] || defaultThumbs.peito,
      contraindications: contraindicationsArray,
      tags: tagsArray,
      createdAt: new Date().toISOString().split('T')[0],
      authorCoach: 'Coach Diego'
    };

    if (editingId) {
      updateExerciseInLibrary(editingId, item);
    } else {
      addExerciseToLibrary(item);
    }

    setIsFormModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Biblioteca Central de Exercícios
            </h1>
            <span className="text-[10px] font-bold text-alpha-600 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 px-2.5 py-0.5 rounded-full uppercase">
              Catálogo Biomecânico
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Acervo técnico de exercícios com grupo muscular, equipamento, padrão de movimento, contraindicações e vídeos.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-alpha-500 hover:bg-alpha-600 text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-2xl transition-all shadow-md hover:shadow-alpha-500/25 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Exercício</span>
        </button>
      </div>

      {/* Painel de Busca e Filtros Rápidos */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        
        {/* Barra de Pesquisa Principal */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar por nome do exercício, nome em inglês, músculo ou tag (ex: Supino, Lat Pulldown, #glúteos)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-alpha-500"
          />
        </div>

        {/* Filtros em Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Grupo Muscular:</label>
            <select
              value={selectedMuscle}
              onChange={(e) => setSelectedMuscle(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-semibold"
            >
              {MUSCLE_GROUPS.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Equipamento:</label>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-semibold"
            >
              {EQUIPMENTS.map(eq => (
                <option key={eq.id} value={eq.id}>{eq.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Padrão de Movimento:</label>
            <select
              value={selectedPattern}
              onChange={(e) => setSelectedPattern(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-semibold"
            >
              {MOVEMENT_PATTERNS.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Nível de Dificuldade:</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-semibold"
            >
              <option value="todos">Todos os Níveis</option>
              <option value="iniciante">Iniciante</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
            </select>
          </div>
        </div>

        {/* Status Count */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
          <span>Mostrando <strong>{filteredExercises.length}</strong> de {exerciseLibrary.length} exercícios cadastrados</span>
          {(searchTerm || selectedMuscle !== 'todos' || selectedEquipment !== 'todos' || selectedPattern !== 'todos' || selectedLevel !== 'todos') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedMuscle('todos');
                setSelectedEquipment('todos');
                setSelectedPattern('todos');
                setSelectedLevel('todos');
              }}
              className="text-alpha-600 hover:underline font-bold"
            >
              Limpar Filtros
            </button>
          )}
        </div>

      </div>

      {/* Grid de Cards dos Exercícios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExercises.map((ex) => (
          <div
            key={ex.id}
            className="rounded-3xl bg-white dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-alpha-500/80 transition-all flex flex-col justify-between overflow-hidden group"
          >
            {/* Exercise Image / Header */}
            <div className="relative h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <img
                src={ex.imageUrl || ex.videoThumb || 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80'}
                alt={ex.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

              {/* Badges on image */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-black text-white bg-alpha-500 px-2.5 py-0.5 rounded-full uppercase shadow-xs">
                  {ex.primaryMuscle}
                </span>
                <span className="text-[10px] font-bold text-slate-200 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md uppercase">
                  {ex.equipment}
                </span>
              </div>

              <div className="absolute top-3 right-3 flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(ex)}
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-black text-white transition-colors"
                  title="Editar Exercício"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteExerciseFromLibrary(ex.id)}
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-white transition-colors"
                  title="Excluir Exercício"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="text-sm font-black tracking-tight leading-snug">
                  {ex.name}
                </h3>
                {ex.alternateName && (
                  <p className="text-[10px] text-slate-300 font-medium truncate">
                    {ex.alternateName}
                  </p>
                )}
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
              
              <div className="space-y-2">
                {/* Secondary Muscles */}
                {ex.secondaryMuscles && ex.secondaryMuscles.length > 0 && (
                  <div>
                    <span className="text-[9px] font-bold uppercase text-slate-400 block mb-0.5">Músculos Secundários:</span>
                    <div className="flex flex-wrap gap-1">
                      {ex.secondaryMuscles.map((sec, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-medium">
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Movement pattern & Level */}
                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                  <span>Padrão: <strong className="text-slate-800 dark:text-slate-200 capitalize">{ex.movementPattern?.replace('_', ' ') || 'Isolado'}</strong></span>
                  <span>Nível: <strong className="capitalize text-slate-800 dark:text-slate-200">{ex.level}</strong></span>
                </div>

                {/* Contraindications pill if any */}
                {ex.contraindications && ex.contraindications.length > 0 && ex.contraindications[0] !== 'Nenhuma' && ex.contraindications[0] !== 'Nenhuma relatada' && (
                  <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-[10px] font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Cuidado: {ex.contraindications.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Action */}
              <button
                onClick={() => setInspectedExercise(ex)}
                className="w-full mt-2 bg-slate-100 hover:bg-slate-900 hover:text-white dark:bg-slate-800 dark:hover:bg-alpha-500 text-slate-800 dark:text-slate-200 font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Ver Ficha Técnica Biomecânica</span>
              </button>

            </div>

          </div>
        ))}
      </div>

      {/* =========================================================================
          DRAWER / MODAL: FICHA TÉCNICA BIOMECÂNICA DO EXERCÍCIO
         ========================================================================= */}
      {inspectedExercise && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white dark:bg-[#0D121D] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 animate-scaleUp text-xs max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-alpha-600 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight">{inspectedExercise.name}</h3>
                  <span className="text-[11px] text-slate-500">{inspectedExercise.alternateName || 'Ficha Técnica de Execução'}</span>
                </div>
              </div>

              <button
                onClick={() => setInspectedExercise(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Image Banner */}
            <div className="h-52 rounded-2xl overflow-hidden relative">
              <img
                src={inspectedExercise.imageUrl || inspectedExercise.videoThumb || 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80'}
                alt={inspectedExercise.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 flex gap-2">
                <span className="px-3 py-1 rounded-full bg-alpha-500 text-white font-black text-[10px] uppercase">
                  {inspectedExercise.primaryMuscle}
                </span>
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white font-bold text-[10px] uppercase">
                  {inspectedExercise.equipment}
                </span>
              </div>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Padrão Motor:</span>
                <strong className="capitalize">{inspectedExercise.movementPattern?.replace('_', ' ') || 'Isolado'}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Nível:</span>
                <strong className="capitalize">{inspectedExercise.level}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Modalidade:</span>
                <strong className="capitalize">{inspectedExercise.modality}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Treinador Autor:</span>
                <strong>{inspectedExercise.authorCoach || 'Coach Diego'}</strong>
              </div>
            </div>

            {/* Muscles Worked */}
            {inspectedExercise.secondaryMuscles && inspectedExercise.secondaryMuscles.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Músculos Ativados em Sinergia:</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 text-alpha-600 font-bold text-[11px]">
                    Primário: {inspectedExercise.primaryMuscle}
                  </span>
                  {inspectedExercise.secondaryMuscles.map((m, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            {inspectedExercise.instructions && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Instruções Biomecânicas:</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{inspectedExercise.instructions}</p>
              </div>
            )}

            {/* Observations */}
            {inspectedExercise.observations && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Observações do Coach:</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{inspectedExercise.observations}</p>
              </div>
            )}

            {/* Contraindications */}
            {inspectedExercise.contraindications && inspectedExercise.contraindications.length > 0 && inspectedExercise.contraindications[0] !== 'Nenhuma' && inspectedExercise.contraindications[0] !== 'Nenhuma relatada' && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-xs">
                  <ShieldAlert className="w-4 h-4" />
                  Contraindicações Médicas / Articulares:
                </span>
                <p className="text-[11px] leading-relaxed">{inspectedExercise.contraindications.join(', ')}</p>
              </div>
            )}

            {/* Tags */}
            {inspectedExercise.tags && inspectedExercise.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {inspectedExercise.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-mono">
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectedExercise(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Fechar Ficha
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CADASTRO / EDIÇÃO DE EXERCÍCIO
         ========================================================================= */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveForm} className="max-w-2xl w-full bg-white dark:bg-[#0D121D] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 animate-scaleUp text-xs max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-alpha-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase">{editingId ? 'Editar Exercício' : 'Cadastrar Exercício na Biblioteca'}</h4>
                  <span className="text-[10px] text-slate-500">Catálogo oficial da academia CT ALPHA</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nome Oficial do Exercício *:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Supino Inclinado com Halteres..."
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nome Alternativo / Inglês:</label>
                  <input
                    type="text"
                    placeholder="Ex: Incline Dumbbell Bench Press..."
                    value={formAltName}
                    onChange={(e) => setFormAltName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Grupo Principal *:</label>
                  <select
                    value={formPrimaryMuscle}
                    onChange={(e) => setFormPrimaryMuscle(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                  >
                    {MUSCLE_GROUPS.filter(m => m.id !== 'todos').map(m => (
                      <option key={m.id} value={m.id}>{m.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Equipamento *:</label>
                  <select
                    value={formEquipment}
                    onChange={(e) => setFormEquipment(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                  >
                    {EQUIPMENTS.filter(eq => eq.id !== 'todos').map(eq => (
                      <option key={eq.id} value={eq.id}>{eq.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Padrão Motor:</label>
                  <select
                    value={formPattern}
                    onChange={(e) => setFormPattern(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                  >
                    {MOVEMENT_PATTERNS.filter(p => p.id !== 'todos').map(p => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nível de Dificuldade:</label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <option value="iniciante">Iniciante</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Modalidade:</label>
                  <select
                    value={formModality}
                    onChange={(e) => setFormModality(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <option value="musculacao">Musculação</option>
                    <option value="crossfit">Crossfit</option>
                    <option value="lutas">Lutas</option>
                    <option value="funcional">Funcional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Músculos Secundários (separados por vírgula):</label>
                <input
                  type="text"
                  placeholder="Ex: Tríceps Braquial, Deltoide Anterior, Serrátil..."
                  value={formSecondaryMuscles}
                  onChange={(e) => setFormSecondaryMuscles(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Instruções Biomecânicas de Execução:</label>
                <textarea
                  rows={2}
                  placeholder="Explique a posição inicial, trajetória, respiração e cadência..."
                  value={formInstructions}
                  onChange={(e) => setFormInstructions(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Contraindicações / Cuidados Médicos:</label>
                  <input
                    type="text"
                    placeholder="Ex: Impacto subacromial, Condromalácia..."
                    value={formContraindications}
                    onChange={(e) => setFormContraindications(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tags (separadas por vírgula):</label>
                  <input
                    type="text"
                    placeholder="Ex: #hipertrofia, #halteres, #push..."
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="flex-1 bg-alpha-500 hover:bg-alpha-600 text-white font-black uppercase tracking-wider py-3 rounded-xl transition-all shadow-md"
              >
                {editingId ? 'Salvar Alterações' : 'Adicionar à Biblioteca'}
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
};
