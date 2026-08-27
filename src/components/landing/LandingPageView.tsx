import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Dumbbell, 
  Flame, 
  Swords, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Instagram, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  User,
  Calendar,
  Send,
  Building2,
  ChevronRight,
  ChevronDown,
  CreditCard,
  QrCode,
  LogIn,
  Search,
  Check,
  ChevronLeft,
  Smartphone,
  Award,
  Zap,
  Activity,
  HeartPulse,
  Info,
  X,
  MessageCircle,
  HelpCircle,
  Bot
} from 'lucide-react';
import { GYM_INFO } from '@/data/mockData';

interface FAQItem {
  question: string;
  answer: string;
  category: 'planos' | 'modalidades' | 'horarios' | 'matricula';
}

const FAQ_DATA: FAQItem[] = [
  {
    category: 'planos',
    question: 'Quais são os planos disponíveis e como funciona o pagamento?',
    answer: 'Trabalhamos com o Plano Alpha VIP (acesso livre à Musculação, Crossfit e Lutas nas 2 unidades por R$ 139,90/mês), Plano Crossfit + Musculação (R$ 119,90/mês) e Plano Musculação Tradicional (R$ 89,90/mês). Aceitamos PIX, Cartão de Crédito e Débito Recorrente sem travar o limite do seu cartão.'
  },
  {
    category: 'matricula',
    question: 'Como funciona a primeira aula experimental gratuita?',
    answer: 'Você pode agendar sua aula experimental grátis diretamente pelo nosso site ou WhatsApp. Não cobramos taxa de matrícula e você terá acompanhamento de um professor durante toda a sessão para conhecer a estrutura do CT.'
  },
  {
    category: 'modalidades',
    question: 'Quais modalidades o CT ALPHA oferece em Aliança/PE?',
    answer: 'Oferecemos Musculação completa de alta performance com maquinário moderno, Box oficial de Crossfit / Treinamento Funcional e Tatame especializado com aulas de Muay Thai e Jiu-Jitsu para iniciantes e avançados.'
  },
  {
    category: 'horarios',
    question: 'Qual o horário de funcionamento das unidades?',
    answer: 'Unidade 1 (Matriz): Segunda a Sexta das 05:00 às 22:00 e Sábados das 06:00 às 14:00. Unidade 2 (Expansão): Segunda a Sexta das 05:30 às 21:30 e Sábados das 07:00 às 12:00.'
  },
  {
    category: 'planos',
    question: 'Posso treinar nas duas unidades com a mesma matrícula?',
    answer: 'Sim! Com o Plano Alpha VIP ou Plano Crossfit você tem livre circulação tanto na Unidade 1 (Centro) quanto na Unidade 2 (Expansão) utilizando o mesmo token ou reconhecimento biométrico.'
  },
  {
    category: 'modalidades',
    question: 'Como recebo minha ficha de treino personalizada?',
    answer: 'Ao se matricular, nosso treinador realiza uma avaliação inicial e monta sua ficha de treino diretamente no aplicativo exclusivo do CT ALPHA, com vídeos demonstrativos de cada exercício, contagem de séries, descanso e acompanhamento de cargas.'
  }
];

export const LandingPageView: React.FC = () => {
  const { setCurrentView, setUserRole, addLeadFromAI, showNotification } = useApp();

  const [selectedUnitFilter, setSelectedUnitFilter] = useState<'unidade-1' | 'unidade-2'>('unidade-1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadInterest, setLeadInterest] = useState<'crossfit' | 'luta' | 'musculacao' | 'completo'>('completo');
  const [leadUnit, setLeadUnit] = useState<'unidade-1' | 'unidade-2'>('unidade-1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // FAQ Accordion State
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(0);

  // Floating AI Chat Assistant State
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'bot' | 'user'; text: string; time: string }[]>([
    {
      sender: 'bot',
      text: 'Olá! Sou a assistente virtual da CT ALPHA. Como posso te ajudar hoje? Tire dúvidas sobre planos, horários ou agende sua aula grátis!',
      time: 'Agora'
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendChatMessage = (textToSend?: string) => {
    const query = textToSend || userInput;
    if (!query.trim()) return;

    const newMsg = { sender: 'user' as const, text: query, time: 'Agora' };
    setChatMessages(prev => [...prev, newMsg]);
    if (!textToSend) setUserInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let responseText = '';
      const lower = query.toLowerCase();

      if (lower.includes('plano') || lower.includes('valor') || lower.includes('preço') || lower.includes('quanto custa')) {
        responseText = 'Nossos planos começam em R$ 89,90/mês (Musculação). O Plano Alpha VIP custa R$ 139,90/mês e inclui Musculação, Crossfit e Lutas nas 2 unidades de Aliança/PE, sem taxa de adesão!';
      } else if (lower.includes('aula') || lower.includes('gratis') || lower.includes('experimental') || lower.includes('grátis') || lower.includes('agendar')) {
        responseText = 'Você pode fazer uma aula experimental gratuita sem compromisso! Basta clicar no botão "MATRICULE-SE JÁ" ou me enviar seu nome e telefone por aqui.';
      } else if (lower.includes('horario') || lower.includes('horário') || lower.includes('abre') || lower.includes('fecha')) {
        responseText = 'A Unidade 1 (Centro) abre de Seg a Sex das 05:00 às 22:00 e Sábado das 06:00 às 14:00. A Unidade 2 abre das 05:30 às 21:30!';
      } else if (lower.includes('onde') || lower.includes('endereco') || lower.includes('endereço') || lower.includes('local')) {
        responseText = 'Ficamos em Aliança/PE! Unidade 1: Rua Marechal Deodoro da Fonseca, 150 (Centro). Unidade 2: Av. Gen. Antônio Coelho, 420.';
      } else if (lower.includes('luta') || lower.includes('muay thai') || lower.includes('jiu') || lower.includes('crossfit')) {
        responseText = 'Temos turmas diárias de Muay Thai, Jiu-Jitsu e Box de Crossfit com professores dedicados tanto para iniciantes quanto atletas!';
      } else {
        responseText = 'Temos planos a partir de R$ 89,90, 2 unidades em Aliança/PE e aulas de Musculação, Crossfit e Lutas. Deseja agendar uma visita ou aula experimental gratuita?';
      }

      setChatMessages(prev => [...prev, {
        sender: 'bot',
        text: responseText,
        time: 'Agora'
      }]);
    }, 700);
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;

    setIsSubmitting(true);
    await addLeadFromAI({
      name: leadName,
      phone: leadPhone,
      interest: leadInterest,
      unit: leadUnit,
      status: 'experimental_agendada',
      notes: `Solicitação de matrícula/aula experimental pelo site oficial.`,
      source: 'Landing Page Oficial (B2C)'
    });

    setIsSubmitting(false);
    setSubmitted(true);
    showNotification('Solicitação recebida! Nossa equipe entrará em contato via WhatsApp.');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-alpha-500 selection:text-white">
      
      {/* 1. Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 p-1.5 flex items-center justify-center shadow-xs">
            <img src="/logo.png" alt="CT ALPHA" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-base font-black tracking-wider uppercase font-sans text-slate-900 leading-none block">
              CT <span className="text-alpha-500">ALPHA</span>
            </span>
            <span className="text-[10px] text-slate-500 font-semibold tracking-tight">Centro de Treinamento</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-700">
          <a href="#unidades" className="hover:text-alpha-500 transition-colors">Unidades</a>
          <a href="#planos" className="hover:text-alpha-500 transition-colors">Planos & Preços</a>
          <a href="#experiencia" className="hover:text-alpha-500 transition-colors">Aulas & Treinos</a>
          <a href="#faq" className="hover:text-alpha-500 transition-colors">Dúvidas Frequentes</a>
          <button 
            onClick={() => setCurrentView('student_login')} 
            className="hover:text-alpha-500 transition-colors font-bold text-xs"
          >
            Espaço do Aluno
          </button>
          <a 
            href="https://www.instagram.com/academiactalpha" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-alpha-500 transition-colors flex items-center gap-1 text-slate-500"
          >
            <Instagram className="w-3.5 h-3.5" /> @academiactalpha
          </a>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentView('student_login')} 
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-full border border-slate-200 hover:bg-slate-50 transition-all"
          >
            <User className="w-3.5 h-3.5" /> Já sou aluno
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-alpha-500 hover:bg-alpha-600 text-white font-extrabold text-xs px-5 py-2.5 rounded-full uppercase tracking-wider transition-all shadow-sm hover:shadow-alpha-500/20 active:scale-95"
          >
            MATRICULE-SE JÁ
          </button>

          <button
            onClick={() => setCurrentView('login')}
            className="p-2 text-slate-400 hover:text-slate-900 rounded-full border border-slate-200 hover:bg-slate-50 transition-all"
            title="Acesso Administrativo"
          >
            <LogIn className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Hero Section — 80/20 Rounded Banner com margem branca e foto do CT ALPHA */}
      <section className="px-3 sm:px-6 md:px-8 pt-3 pb-8 max-w-[1440px] mx-auto">
        <div className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-950 text-white min-h-[500px] sm:min-h-[580px] flex items-center p-6 sm:p-12 md:p-16 border border-slate-800">
          
          {/* Hero Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/hero_bg.jpg" 
              alt="CT ALPHA Musculação e Crossfit" 
              className="w-full h-full object-cover object-center scale-105"
            />
            {/* Dark & Orange Atmospheric Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-2xl space-y-6">
            
            {/* Region Badge */}
            <div className="inline-flex items-center gap-2 bg-alpha-500 text-white px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>O Maior Centro de Treinamento da Região</span>
            </div>

            {/* Main Title */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter leading-none font-sans drop-shadow-md">
                TRANSFORME
              </h1>
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter leading-none font-sans text-amber-400 drop-shadow-md">
                SEU CORPO
              </h2>
            </div>

            {/* Description */}
            <p className="text-slate-200 text-sm sm:text-base font-medium max-w-xl leading-relaxed drop-shadow-sm">
              Musculação de alta performance, Box de Crossfit oficial e Tatame de Lutas. Treine em 2 unidades completas em Aliança/PE com acompanhamento de treinador e treinos personalizados.
            </p>

            {/* Features Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="bg-black/60 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full text-xs font-bold text-slate-200">
                ✓ 2 Unidades em Aliança
              </span>
              <span className="bg-black/60 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full text-xs font-bold text-slate-200">
                ✓ Ficha Digital no App
              </span>
              <span className="bg-black/60 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full text-xs font-bold text-slate-200">
                ✓ Aulas Coletivas Inclusas
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-alpha-500 hover:bg-alpha-600 text-white font-black text-xs sm:text-sm px-8 py-3.5 rounded-full uppercase tracking-wider transition-all shadow-xl hover:scale-105 active:scale-95"
              >
                MATRICULE-SE JÁ
              </button>

              <button
                onClick={() => setCurrentView('student_login')}
                className="bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full transition-all flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Espaço do Aluno</span>
              </button>
            </div>

            {/* Status Footer Pill */}
            <div className="pt-2">
              <span className="text-[11px] font-black tracking-widest text-amber-400 uppercase">
                /// VAGAS ABERTAS PARA NOVOS ALUNOS
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Section: Encontre a Academia Mais Próxima */}
      <section id="unidades" className="py-12 px-4 sm:px-8 max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 tracking-tight">
            ENCONTRE A ACADEMIA <span className="text-alpha-500">MAIS PRÓXIMA</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">Duas unidades estratégicas em Aliança/PE para você treinar onde for melhor</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Unidade 1 */}
          <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-md hover:border-alpha-500 transition-all">
            <div className="h-52 relative">
              <img src="/facade.jpg" alt="Unidade 1 Matriz" className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                Unidade 1 • Matriz (Centro)
              </div>
            </div>
            <div className="p-6 space-y-3 text-xs">
              <h3 className="text-base font-black uppercase text-slate-900">CT ALPHA Matriz</h3>
              <p className="text-slate-600 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-alpha-500 shrink-0 mt-0.5" />
                <span>Rua Marechal Deodoro da Fonseca, 150 • Centro, Aliança - PE</span>
              </p>
              <p className="text-slate-600 flex items-center gap-2">
                <Clock className="w-4 h-4 text-alpha-500 shrink-0" />
                <span>Seg a Sex: 05h às 22h | Sáb: 06h às 14h</span>
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="font-bold text-emerald-600">● Aberto Agora</span>
                <button
                  onClick={() => {
                    setLeadUnit('unidade-1');
                    setIsModalOpen(true);
                  }}
                  className="text-alpha-500 font-bold hover:underline"
                >
                  Agendar Aula Grátis &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Unidade 2 */}
          <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-md hover:border-alpha-500 transition-all">
            <div className="h-52 relative">
              <img src="/combat_bg.jpg" alt="Unidade 2 Expansão" className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                Unidade 2 • Expansão & Tatame
              </div>
            </div>
            <div className="p-6 space-y-3 text-xs">
              <h3 className="text-base font-black uppercase text-slate-900">CT ALPHA Expansão</h3>
              <p className="text-slate-600 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-alpha-500 shrink-0 mt-0.5" />
                <span>Av. Gen. Antônio Coelho, 420 • Aliança - PE</span>
              </p>
              <p className="text-slate-600 flex items-center gap-2">
                <Clock className="w-4 h-4 text-alpha-500 shrink-0" />
                <span>Seg a Sex: 05h30 às 21h30 | Sáb: 07h às 12h</span>
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="font-bold text-emerald-600">● Aberto Agora</span>
                <button
                  onClick={() => {
                    setLeadUnit('unidade-2');
                    setIsModalOpen(true);
                  }}
                  className="text-alpha-500 font-bold hover:underline"
                >
                  Agendar Aula Grátis &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section: Modalidades */}
      <section id="experiencia" className="py-14 px-4 sm:px-8 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-black text-alpha-500 uppercase tracking-widest">Modalidades Oficiais</span>
          <h2 className="text-2xl sm:text-4xl font-black uppercase text-slate-900">
            Tudo o que você precisa em um só lugar
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Treine musculação, crossfit e lutas com estrutura profissional e metodologia comprovada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl border border-slate-200 bg-slate-50/50 hover:border-alpha-500 transition-all space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black uppercase text-slate-900">Musculação de Alta Performance</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Equipamentos biomecanicamente calibrados, área ampla de pesos livres, halteres até 40kg e fichas digitais no aplicativo.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 font-medium">
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Acompanhamento de instrutores</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Treinos adaptados para qualquer objetivo</li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 bg-slate-50/50 hover:border-alpha-500 transition-all space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black uppercase text-slate-900">Box de Crossfit & Funcional</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Treinos intensos em grupo com cordas, pneus, kettlebells, barras olímpicas e remos para queima calórica extrema.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 font-medium">
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> WODs diários dinâmicos</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Comunidade motivadora e acolhedora</li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 bg-slate-50/50 hover:border-alpha-500 transition-all space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
              <Swords className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black uppercase text-slate-900">Tatame: Muay Thai & Jiu-Jitsu</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Aprenda defesa pessoal, ganhe disciplina e queime calorias com nossos mestres graduados em tatame de alta densidade.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 font-medium">
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Turmas femininas e masculinas</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Do básico ao avançado</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Section: Planos & Preços */}
      <section id="planos" className="py-16 px-4 sm:px-8 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-black text-alpha-500 uppercase tracking-widest">Planos Flexíveis</span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-slate-900">
              Escolha o plano ideal para sua rotina
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Sem taxa de matrícula abusiva. Cancele quando quiser no débito recorrente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Plano Básico */}
            <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase">Tradicional</span>
                <h3 className="text-xl font-black text-slate-900">Musculação</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">R$ 89,90</span>
                  <span className="text-xs text-slate-500">/mês</span>
                </div>
                <p className="text-xs text-slate-500">Acesso ilimitado ao salão de musculação em 1 unidade.</p>
                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Musculação livre todos os dias</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Ficha de treino no celular</div>
                  <div className="flex items-center gap-2 text-slate-400"><X className="w-3.5 h-3.5" /> Sem Crossfit e Lutas</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setLeadInterest('musculacao');
                  setIsModalOpen(true);
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs py-3 rounded-full uppercase transition-all"
              >
                Escolher Musculação
              </button>
            </div>

            {/* Plano VIP - Destaque */}
            <div className="p-7 rounded-3xl bg-slate-900 text-white border-2 border-alpha-500 shadow-xl flex flex-col justify-between space-y-6 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-alpha-500 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                Mais Escolhido • Acesso Total
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-alpha-400 uppercase">Livre Total</span>
                <h3 className="text-xl font-black text-white">Alpha VIP Completo</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">R$ 139,90</span>
                  <span className="text-xs text-slate-400">/mês</span>
                </div>
                <p className="text-xs text-slate-300">Acesso ilimitado a todas as modalidades e unidades.</p>
                <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-200">
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Musculação + Crossfit + Lutas</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Livre acesso na Unidade 1 e Unidade 2</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Anamnese & Ficha no App</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Sem taxa de matrícula</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setLeadInterest('completo');
                  setIsModalOpen(true);
                }}
                className="w-full bg-alpha-500 hover:bg-alpha-600 text-white font-black text-xs py-3 rounded-full uppercase tracking-wider transition-all shadow-md"
              >
                Garantir Plano VIP
              </button>
            </div>

            {/* Plano Crossfit */}
            <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase">Potência</span>
                <h3 className="text-xl font-black text-slate-900">Crossfit + Musculação</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">R$ 119,90</span>
                  <span className="text-xs text-slate-500">/mês</span>
                </div>
                <p className="text-xs text-slate-500">Aulas diárias de Box Crossfit + Musculação inclusa.</p>
                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> WODs de Crossfit todos os dias</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Musculação completa liberada</div>
                  <div className="flex items-center gap-2 text-slate-400"><X className="w-3.5 h-3.5" /> Sem aulas de Tatame</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setLeadInterest('crossfit');
                  setIsModalOpen(true);
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs py-3 rounded-full uppercase transition-all"
              >
                Escolher Crossfit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Section: FAQ & Dúvidas Frequentes */}
      <section id="faq" className="py-16 px-4 sm:px-8 max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-alpha-500/10 text-alpha-600 text-xs font-bold border border-alpha-500/20">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tire Suas Dúvidas</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase text-slate-900">
            Perguntas Frequentes (FAQ)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Confira as principais dúvidas sobre matrículas, horários e funcionamento da CT ALPHA.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_DATA.map((item, index) => {
            const isOpen = openFAQIndex === index;

            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenFAQIndex(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {item.question}
                  </span>
                  <div className={`p-1 rounded-full transition-transform duration-200 ${isOpen ? 'bg-alpha-500 text-white rotate-180' : 'bg-slate-100 text-slate-500'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 bg-slate-50/50 leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* FAQ Assistance CTA Box */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-alpha-500 flex items-center justify-center shrink-0">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Não encontrou o que procurava?</h4>
              <p className="text-xs text-slate-300">Converse agora mesmo com nossa Assistente Virtual ou no WhatsApp.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsAIChatOpen(true)}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-alpha-500 hover:bg-alpha-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              Falar com a IA
            </button>
            <a
              href="https://wa.me/5581998929667?text=Ol%C3%A1%2C%20gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20o%20CT%20ALPHA!"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl text-center transition-all"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* 7. Modal de Matrícula / Aula Experimental Grátis */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-7 shadow-2xl relative animate-scaleUp text-slate-900 border border-slate-200">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSubmitted(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4 text-center">
              <span className="text-[10px] font-black text-alpha-500 uppercase tracking-wider">
                Garantir Vaga • Sem Compromisso
              </span>
              <h3 className="text-xl font-black uppercase text-slate-900 mt-0.5">Matrícula & Aula Grátis</h3>
              <p className="text-xs text-slate-500">Venha treinar no CT ALPHA de Aliança/PE</p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-900">Vaga Registrada no Sistema!</h4>
                <p className="text-xs text-emerald-800">
                  Nossa recepção já recebeu seus dados no CT ALPHA Hub e entrará em contato via WhatsApp.
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-slate-900 text-white font-bold text-xs py-2.5 rounded-xl mt-2"
                >
                  Concluir
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitLead} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome Completo:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Henrique Bezerra"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-alpha-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp com DDD:</label>
                  <input
                    type="text"
                    required
                    placeholder="(81) 99892-9667"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-alpha-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Interesse:</label>
                    <select
                      value={leadInterest}
                      onChange={(e) => setLeadInterest(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-alpha-500"
                    >
                      <option value="completo">Plano VIP (Todos)</option>
                      <option value="crossfit">Crossfit Box</option>
                      <option value="musculacao">Musculação</option>
                      <option value="luta">Tatame Lutas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Unidade:</label>
                    <select
                      value={leadUnit}
                      onChange={(e) => setLeadUnit(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-alpha-500"
                    >
                      <option value="unidade-1">Matriz (Centro)</option>
                      <option value="unidade-2">Unidade 2</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-alpha-500 hover:bg-alpha-600 text-white font-black uppercase text-xs tracking-wider py-3.5 rounded-full transition-all shadow-md mt-2"
                >
                  {isSubmitting ? 'Gravando no banco...' : 'Confirmar Solicitação'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 8. FLOATING INTERACTIVE AI FAQ CHATBOT WIDGET */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isAIChatOpen ? (
          <button
            onClick={() => setIsAIChatOpen(true)}
            className="flex items-center gap-2.5 bg-slate-900 hover:bg-black text-white px-4 py-3 rounded-full shadow-2xl border border-slate-700 transition-all hover:scale-105 active:scale-95 group"
          >
            <div className="w-8 h-8 rounded-full bg-alpha-500 flex items-center justify-center text-white shadow-xs">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-[11px] font-bold block leading-none">Assistente FAQ</span>
              <span className="text-[9px] text-slate-400">Tire dúvidas com IA</span>
            </div>
          </button>
        ) : (
          <div className="w-[340px] sm:w-[380px] h-[480px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-scaleUp text-xs">
            {/* Chat Header */}
            <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-alpha-500 flex items-center justify-center text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs">Assistente Virtual CT ALPHA</h4>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Online • Responde instantaneamente</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsAIChatOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5 bg-slate-50">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-alpha-500 text-white rounded-br-none shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <span className="text-[9px] opacity-60 block mt-1 text-right">{msg.time}</span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 p-2.5 rounded-2xl rounded-bl-none flex items-center gap-1.5 text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[10px]">
              <button
                onClick={() => handleSendChatMessage('Qual o valor do Plano VIP?')}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 shrink-0 font-medium transition-all"
              >
                ⚡ Quanto custa o VIP?
              </button>
              <button
                onClick={() => handleSendChatMessage('Como agendar aula grátis?')}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 shrink-0 font-medium transition-all"
              >
                🆓 Aula grátis
              </button>
              <button
                onClick={() => handleSendChatMessage('Onde fica a academia?')}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 shrink-0 font-medium transition-all"
              >
                📍 Onde fica?
              </button>
            </div>

            {/* Chat Input Bar */}
            <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                placeholder="Digite sua dúvida aqui..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-alpha-500"
              />
              <button
                onClick={() => handleSendChatMessage()}
                className="p-2 bg-alpha-500 hover:bg-alpha-600 text-white rounded-xl shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 9. Comprehensive Footer */}
      <footer className="bg-[#0B0E14] text-slate-400 py-12 px-4 sm:px-8 border-t border-slate-800 text-xs">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 p-1 flex items-center justify-center">
                <img src="/logo.png" alt="CT ALPHA" className="w-full h-full object-contain" />
              </div>
              <span className="text-white font-black text-base uppercase">CT ALPHA • Centro de Treinamento</span>
            </div>

            <div className="flex items-center gap-4 text-slate-300">
              <a href="https://www.instagram.com/academiactalpha" target="_blank" rel="noopener noreferrer" className="hover:text-alpha-400 flex items-center gap-1">
                <Instagram className="w-4 h-4" /> Instagram
              </a>
              <span>•</span>
              <a href="tel:81998929667" className="hover:text-alpha-400 flex items-center gap-1">
                <Phone className="w-4 h-4" /> (81) 99892-9667
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-[11px]">
            <div>
              <h5 className="font-bold text-white uppercase mb-2">Unidade 1 (Matriz)</h5>
              <p>Rua Marechal Deodoro da Fonseca, 150</p>
              <p>Aliança - PE • CEP 55890-000</p>
              <p className="mt-1">Seg a Sex das 05:00 às 22:00 | Sáb 06:00 às 14:00</p>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase mb-2">Unidade 2 (Expansão)</h5>
              <p>Av. Gen. Antônio Coelho, 420</p>
              <p>Aliança - PE</p>
              <p className="mt-1">Seg a Sex das 05:30 às 21:30 | Sáb 07:00 às 12:00</p>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase mb-2">Modalidades Oficiais</h5>
              <p>• Musculação de Alta Performance</p>
              <p>• Box de Crossfit Oficial</p>
              <p>• Tatame de Muay Thai & Jiu-Jitsu</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 text-center text-[10px] text-slate-500">
            © 2026 CT ALPHA. Todos os direitos reservados. Aliança - Pernambuco.
          </div>
        </div>
      </footer>

    </div>
  );
};
