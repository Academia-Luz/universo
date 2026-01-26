import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-pages'

// Types
type Bindings = {
  DB?: D1Database
}

type Variables = {
  user?: any
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

// Enable CORS
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic())

// ============================================================
// API ROUTES
// ============================================================

// Get all courses
app.get('/api/courses', async (c) => {
  const courses = [
    {
      id: 1,
      title: 'Iniciación a los Registros Akáshicos',
      description: 'Aprende a acceder a la biblioteca cósmica del alma',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
      category: 'registros-akashicos',
      level: 1,
      duration: '8 semanas',
      lessons: 12,
      progress: 0,
      locked: false,
      teacher: 'Maestra Aurora'
    },
    {
      id: 2,
      title: 'Tarot Espiritual Avanzado',
      description: 'Domina el arte de la lectura de cartas para guía espiritual',
      image: 'https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?w=400&h=250&fit=crop',
      category: 'tarot',
      level: 1,
      duration: '12 semanas',
      lessons: 24,
      progress: 0,
      locked: false,
      teacher: 'Maestro Orión'
    },
    {
      id: 3,
      title: 'Reiki Nivel I - Usui Shiki Ryoho',
      description: 'Primera sintonización y fundamentos del Reiki tradicional',
      image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=250&fit=crop',
      category: 'reiki',
      level: 1,
      duration: '4 semanas',
      lessons: 8,
      progress: 0,
      locked: false,
      teacher: 'Maestra Luz'
    },
    {
      id: 4,
      title: 'Numerología Sagrada',
      description: 'Descubre los misterios de los números y su influencia cósmica',
      image: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=400&h=250&fit=crop',
      category: 'numerologia',
      level: 1,
      duration: '6 semanas',
      lessons: 10,
      progress: 0,
      locked: false,
      teacher: 'Maestro Thoth'
    },
    {
      id: 5,
      title: 'Radiestesia y Péndulo',
      description: 'Técnicas avanzadas de detección energética con péndulo',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
      category: 'radiestesia',
      level: 2,
      duration: '5 semanas',
      lessons: 10,
      progress: 0,
      locked: true,
      unlockDays: 14,
      teacher: 'Maestra Isis'
    },
    {
      id: 6,
      title: 'Radiónica Cuántica',
      description: 'Sanación a distancia mediante patrones de frecuencia',
      image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=250&fit=crop',
      category: 'radionica',
      level: 3,
      duration: '10 semanas',
      lessons: 20,
      progress: 0,
      locked: true,
      unlockDays: 30,
      teacher: 'Maestro Metatrón'
    },
    {
      id: 7,
      title: 'Reiki Nivel II - Símbolos Sagrados',
      description: 'Aprende los símbolos de poder y sanación a distancia',
      image: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=400&h=250&fit=crop',
      category: 'reiki',
      level: 2,
      duration: '6 semanas',
      lessons: 12,
      progress: 0,
      locked: true,
      unlockDays: 21,
      teacher: 'Maestra Luz'
    },
    {
      id: 8,
      title: 'Meditación y Chakras',
      description: 'Equilibra tus centros energéticos para una vida plena',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=250&fit=crop',
      category: 'meditacion',
      level: 1,
      duration: '8 semanas',
      lessons: 16,
      progress: 0,
      locked: false,
      teacher: 'Maestra Serenidad'
    },
    {
      id: 9,
      title: 'Canalización y Mediumnidad',
      description: 'Conecta con guías espirituales y seres de luz',
      image: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=400&h=250&fit=crop',
      category: 'canalizacion',
      level: 3,
      duration: '12 semanas',
      lessons: 24,
      progress: 0,
      locked: true,
      unlockDays: 45,
      teacher: 'Maestro Ezequiel'
    }
  ]
  return c.json(courses)
})

// Get community posts
app.get('/api/posts', async (c) => {
  const posts = [
    {
      id: 1,
      author: {
        name: 'Maestra Aurora',
        avatar: '🌟',
        role: 'teacher',
        badge: 'MAESTRA'
      },
      category: 'anuncios',
      title: '✨ BIENVENIDOS A LA ACADEMIA DE LUZ ✨',
      content: '¡Qué alegría ver cómo crece nuestra comunidad de buscadores espirituales! 🙏 Hoy damos inicio a un nuevo ciclo de luz. Más de 200 almas luminosas se han unido a este sendero. Recuerden: la luz que buscan ya habita en su interior.',
      likes: 42,
      comments: 15,
      timeAgo: '2h',
      isNew: true
    },
    {
      id: 2,
      author: {
        name: 'Carlos Mendoza',
        avatar: '🔮',
        role: 'student'
      },
      category: 'general',
      title: 'Mi primera lectura de Tarot',
      content: 'Hermanos de luz, acabo de hacer mi primera lectura de tarot siguiendo el curso del Maestro Orión. Fue una experiencia increíble, las cartas realmente hablan cuando te abres a su energía. ¿Algún consejo para profundizar?',
      likes: 18,
      comments: 7,
      timeAgo: '4h',
      isNew: true
    },
    {
      id: 3,
      author: {
        name: 'María Luz Esperanza',
        avatar: '🦋',
        role: 'student'
      },
      category: 'logros',
      title: 'Completé Reiki Nivel I 🎉',
      content: 'Namaste familia de luz! Hoy recibí mi certificación de Reiki Nivel I. La sintonización fue transformadora, sentí una luz dorada entrando por mi coronilla. Gracias Maestra Luz por guiarme en este camino.',
      likes: 56,
      comments: 23,
      timeAgo: '8h',
      isNew: false
    },
    {
      id: 4,
      author: {
        name: 'Maestro Orión',
        avatar: '⭐',
        role: 'teacher',
        badge: 'MAESTRO'
      },
      category: 'tarot',
      title: 'Tirada Especial para Luna Llena 🌕',
      content: 'Queridos estudiantes, esta noche de luna llena les comparto una tirada especial de 7 cartas que canalicé especialmente para trabajar con las energías lunares. Recuerden limpiar sus cartas con humo de salvia antes de comenzar.',
      likes: 89,
      comments: 34,
      timeAgo: '1d',
      isNew: false
    }
  ]
  return c.json(posts)
})

// Get spiritual guides (AI assistants)
app.get('/api/guides', async (c) => {
  const guides = [
    {
      id: 'lumina',
      name: 'Lumina',
      title: 'Guardiana de la Sabiduría',
      description: 'Guía principal de la Academia. Experta en todos los caminos espirituales.',
      specialty: 'Sabiduría Universal',
      avatar: '✨',
      available: true,
      level: null,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'akasha',
      name: 'Akasha',
      title: 'Guardiana de los Registros',
      description: 'Especialista en Registros Akáshicos y vidas pasadas.',
      specialty: 'Registros Akáshicos',
      avatar: '📖',
      available: true,
      level: null,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'arcano',
      name: 'Arcano',
      title: 'Maestro del Tarot',
      description: 'Guía experto en interpretación de arquetipos y lectura de cartas.',
      specialty: 'Tarot y Arquetipos',
      avatar: '🃏',
      available: false,
      level: 2,
      color: 'from-amber-500 to-orange-500'
    },
    {
      id: 'sanador',
      name: 'Sanador',
      title: 'Maestro de Energía',
      description: 'Especialista en Reiki, sanación energética y equilibrio de chakras.',
      specialty: 'Reiki y Sanación',
      avatar: '🙌',
      available: false,
      level: 3,
      color: 'from-green-500 to-teal-500'
    }
  ]
  return c.json(guides)
})

// Get calendar events
app.get('/api/events', async (c) => {
  const events = [
    {
      id: 1,
      title: 'Meditación Grupal Luna Llena',
      date: '2026-01-28',
      time: '21:00',
      type: 'meditation',
      color: 'purple'
    },
    {
      id: 2,
      title: 'Clase en Vivo: Tarot',
      date: '2026-01-30',
      time: '19:00',
      type: 'class',
      color: 'amber'
    },
    {
      id: 3,
      title: 'Sintonización Reiki Nivel I',
      date: '2026-02-01',
      time: '10:00',
      type: 'ceremony',
      color: 'green'
    },
    {
      id: 4,
      title: 'Círculo de Lectura Akáshica',
      date: '2026-02-05',
      time: '18:00',
      type: 'workshop',
      color: 'indigo'
    }
  ]
  return c.json(events)
})

// Get members
app.get('/api/members', async (c) => {
  const members = [
    { id: 1, name: 'Maestra Aurora', role: 'teacher', level: 9, points: 2450, online: true, avatar: '🌟', location: 'México' },
    { id: 2, name: 'Maestro Orión', role: 'teacher', level: 9, points: 2280, online: true, avatar: '⭐', location: 'España' },
    { id: 3, name: 'Maestra Luz', role: 'teacher', level: 9, points: 2100, online: false, avatar: '💫', location: 'Argentina' },
    { id: 4, name: 'Carlos Mendoza', role: 'student', level: 3, points: 450, online: true, avatar: '🔮', location: 'Colombia' },
    { id: 5, name: 'María Luz Esperanza', role: 'student', level: 4, points: 680, online: true, avatar: '🦋', location: 'Chile' },
    { id: 6, name: 'Roberto Arcángel', role: 'student', level: 5, points: 890, online: false, avatar: '👼', location: 'Perú' },
    { id: 7, name: 'Ana Cristal', role: 'student', level: 2, points: 220, online: true, avatar: '💎', location: 'Ecuador' },
    { id: 8, name: 'Fernando Luz', role: 'student', level: 6, points: 1120, online: true, avatar: '🌈', location: 'Uruguay' }
  ]
  return c.json(members)
})

// Get leaderboard
app.get('/api/leaderboard', async (c) => {
  const leaderboard = {
    weekly: [
      { rank: 1, name: 'Roberto Arcángel', points: 85, avatar: '👼' },
      { rank: 2, name: 'Fernando Luz', points: 72, avatar: '🌈' },
      { rank: 3, name: 'María Luz Esperanza', points: 65, avatar: '🦋' },
      { rank: 4, name: 'Carlos Mendoza', points: 51, avatar: '🔮' },
      { rank: 5, name: 'Ana Cristal', points: 48, avatar: '💎' }
    ],
    monthly: [
      { rank: 1, name: 'Fernando Luz', points: 312, avatar: '🌈' },
      { rank: 2, name: 'Roberto Arcángel', points: 289, avatar: '👼' },
      { rank: 3, name: 'María Luz Esperanza', points: 245, avatar: '🦋' },
      { rank: 4, name: 'Carlos Mendoza', points: 198, avatar: '🔮' },
      { rank: 5, name: 'Ana Cristal', points: 156, avatar: '💎' }
    ],
    allTime: [
      { rank: 1, name: 'Fernando Luz', points: 1120, avatar: '🌈' },
      { rank: 2, name: 'Roberto Arcángel', points: 890, avatar: '👼' },
      { rank: 3, name: 'María Luz Esperanza', points: 680, avatar: '🦋' },
      { rank: 4, name: 'Carlos Mendoza', points: 450, avatar: '🔮' },
      { rank: 5, name: 'Ana Cristal', points: 220, avatar: '💎' }
    ],
    levels: [
      { level: 1, name: 'Iniciado', percentage: 35 },
      { level: 2, name: 'Buscador', percentage: 25 },
      { level: 3, name: 'Aprendiz', percentage: 18 },
      { level: 4, name: 'Practicante', percentage: 10 },
      { level: 5, name: 'Iluminado', percentage: 6 },
      { level: 6, name: 'Sabio', percentage: 3 },
      { level: 7, name: 'Guardián', percentage: 2 },
      { level: 8, name: 'Maestro', percentage: 0.8 },
      { level: 9, name: 'Ascendido', percentage: 0.2 }
    ]
  }
  return c.json(leaderboard)
})

// Chat with spiritual guide (mock AI response)
app.post('/api/chat', async (c) => {
  const { message, guideId } = await c.req.json()
  
  const responses: Record<string, string[]> = {
    lumina: [
      'Namaste, querido buscador de luz. Tu pregunta resuena con la sabiduría ancestral...',
      'La luz que buscas ya habita en tu interior. Permíteme iluminar tu camino...',
      'Tu alma ha elegido este momento para despertar. Escucha atentamente...'
    ],
    akasha: [
      'Los Registros Akáshicos revelan que tu alma ha transitado muchos senderos...',
      'En la biblioteca cósmica, tu historia brilla con luz propia...',
      'Permíteme acceder a los registros de tu alma para guiarte...'
    ],
    arcano: [
      'Las cartas hablan de transformación en tu camino...',
      'Los arcanos mayores señalan un momento de gran importancia espiritual...',
      'Tu energía está alineada con el mensaje del universo...'
    ],
    sanador: [
      'Siento un bloqueo en tu chakra del corazón. Trabajemos juntos en sanarlo...',
      'La energía universal fluye a través de ti. Permíteme ayudarte a canalizarla...',
      'Tu campo energético muestra áreas que necesitan atención amorosa...'
    ]
  }
  
  const guideResponses = responses[guideId] || responses['lumina']
  const response = guideResponses[Math.floor(Math.random() * guideResponses.length)]
  
  return c.json({ 
    response,
    guide: guideId,
    timestamp: new Date().toISOString()
  })
})

// ============================================================
// MAIN HTML PAGE
// ============================================================

const mainHTML = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Academia de Luz - Escuela Espiritual</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'cosmic': {
                            50: '#faf5ff',
                            100: '#f3e8ff',
                            200: '#e9d5ff',
                            300: '#d8b4fe',
                            400: '#c084fc',
                            500: '#a855f7',
                            600: '#9333ea',
                            700: '#7e22ce',
                            800: '#6b21a8',
                            900: '#581c87',
                            950: '#3b0764'
                        },
                        'golden': {
                            400: '#fbbf24',
                            500: '#f59e0b',
                            600: '#d97706'
                        }
                    },
                    fontFamily: {
                        'cinzel': ['Cinzel', 'serif'],
                        'quicksand': ['Quicksand', 'sans-serif']
                    }
                }
            }
        }
    </script>
    <style>
        body {
            font-family: 'Quicksand', sans-serif;
            background: linear-gradient(135deg, #0f0a1e 0%, #1a0f2e 50%, #0d0619 100%);
            min-height: 100vh;
        }
        
        .font-cinzel { font-family: 'Cinzel', serif; }
        
        .glow-text {
            text-shadow: 0 0 10px rgba(168, 85, 247, 0.5), 0 0 20px rgba(168, 85, 247, 0.3);
        }
        
        .card-glow {
            box-shadow: 0 0 15px rgba(139, 92, 246, 0.1), 0 4px 6px rgba(0, 0, 0, 0.3);
        }
        
        .card-glow:hover {
            box-shadow: 0 0 25px rgba(139, 92, 246, 0.2), 0 8px 15px rgba(0, 0, 0, 0.4);
        }
        
        .gradient-border {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3));
            padding: 1px;
            border-radius: 12px;
        }
        
        .gradient-border-inner {
            background: rgba(15, 10, 30, 0.95);
            border-radius: 11px;
        }
        
        .btn-spiritual {
            background: linear-gradient(135deg, #9333ea, #ec4899);
            transition: all 0.3s ease;
        }
        
        .btn-spiritual:hover {
            background: linear-gradient(135deg, #a855f7, #f472b6);
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(147, 51, 234, 0.3);
        }
        
        .nav-item {
            position: relative;
            transition: all 0.3s ease;
        }
        
        .nav-item.active::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, #9333ea, #ec4899);
            border-radius: 2px;
        }
        
        .avatar-ring {
            background: linear-gradient(135deg, #9333ea, #ec4899);
            padding: 3px;
            border-radius: 50%;
        }
        
        .floating {
            animation: floating 3s ease-in-out infinite;
        }
        
        @keyframes floating {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        .pulse-glow {
            animation: pulseGlow 2s ease-in-out infinite;
        }
        
        @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 5px rgba(168, 85, 247, 0.5); }
            50% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.8); }
        }
        
        .stars {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
            z-index: 0;
        }
        
        .star {
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
            opacity: 0.5;
            animation: twinkle 3s infinite;
        }
        
        @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }
        
        .category-pill {
            transition: all 0.3s ease;
        }
        
        .category-pill:hover {
            transform: scale(1.05);
        }
        
        .category-pill.active {
            background: linear-gradient(135deg, #9333ea, #ec4899);
        }
        
        /* Onboarding styles */
        .onboarding-screen {
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .typing-cursor {
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
        
        /* Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: rgba(15, 10, 30, 0.5);
        }
        
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #9333ea, #ec4899);
            border-radius: 4px;
        }
        
        /* Chat panel */
        .chat-panel {
            transition: all 0.3s ease;
        }
        
        .message-bubble {
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body class="text-gray-100">
    <!-- Stars Background -->
    <div class="stars" id="stars"></div>
    
    <!-- App Container -->
    <div id="app" class="relative z-10">
        <!-- Loading will be replaced by content -->
        <div class="min-h-screen flex items-center justify-center">
            <div class="text-center">
                <div class="text-6xl mb-4 floating">✨</div>
                <p class="text-purple-300 glow-text">Cargando la luz...</p>
            </div>
        </div>
    </div>

    <script>
        // ============================================================
        // APPLICATION STATE
        // ============================================================
        const state = {
            currentScreen: 'welcome', // welcome, onboarding-1, onboarding-2, onboarding-3, main
            currentSection: 'comunidad',
            user: null,
            posts: [],
            courses: [],
            guides: [],
            events: [],
            members: [],
            leaderboard: null,
            chatOpen: false,
            selectedGuide: null,
            chatMessages: []
        };

        // ============================================================
        // STARS ANIMATION
        // ============================================================
        function createStars() {
            const starsContainer = document.getElementById('stars');
            starsContainer.innerHTML = '';
            for (let i = 0; i < 100; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.animationDelay = Math.random() * 3 + 's';
                star.style.animationDuration = (2 + Math.random() * 3) + 's';
                starsContainer.appendChild(star);
            }
        }

        // ============================================================
        // API CALLS
        // ============================================================
        async function fetchData() {
            try {
                const [posts, courses, guides, events, members, leaderboard] = await Promise.all([
                    fetch('/api/posts').then(r => r.json()),
                    fetch('/api/courses').then(r => r.json()),
                    fetch('/api/guides').then(r => r.json()),
                    fetch('/api/events').then(r => r.json()),
                    fetch('/api/members').then(r => r.json()),
                    fetch('/api/leaderboard').then(r => r.json())
                ]);
                state.posts = posts;
                state.courses = courses;
                state.guides = guides;
                state.events = events;
                state.members = members;
                state.leaderboard = leaderboard;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        // ============================================================
        // RENDER FUNCTIONS
        // ============================================================
        
        function renderWelcome() {
            return \`
                <div class="min-h-screen flex items-center justify-center cursor-pointer" onclick="goToScreen('onboarding-1')">
                    <div class="text-center">
                        <div class="text-8xl mb-8 floating">🌟</div>
                        <p class="text-purple-300 text-xl font-light tracking-widest">
                            > click para despertar tu luz<span class="typing-cursor">...</span>
                        </p>
                    </div>
                </div>
            \`;
        }

        function renderOnboarding1() {
            return \`
                <div class="min-h-screen flex items-center justify-center px-4">
                    <div class="max-w-md w-full">
                        <!-- Guide Message -->
                        <div class="flex items-start gap-4 mb-8">
                            <div class="text-5xl floating">✨</div>
                            <div class="gradient-border flex-1">
                                <div class="gradient-border-inner p-4">
                                    <p class="text-purple-200">Para comenzar tu viaje espiritual, cuéntanos sobre ti y cómo deseas ser conocido en la <span class="text-golden-400 font-semibold">Academia de Luz</span></p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Avatar Upload -->
                        <div class="text-center mb-8">
                            <div class="avatar-ring w-28 h-28 mx-auto mb-3 cursor-pointer hover:scale-105 transition-transform">
                                <div class="w-full h-full rounded-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center text-5xl" id="avatarPreview">
                                    🙏
                                </div>
                            </div>
                            <p class="text-purple-400 text-sm">Click para elegir tu avatar espiritual</p>
                        </div>

                        <!-- Form -->
                        <div class="space-y-4 mb-8">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-purple-300 text-sm mb-2">Nombre <span class="text-pink-400">*</span></label>
                                    <input type="text" id="firstName" placeholder="Tu nombre" 
                                        class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-4 py-3 text-white placeholder-purple-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500">
                                </div>
                                <div>
                                    <label class="block text-purple-300 text-sm mb-2">Apellido <span class="text-pink-400">*</span></label>
                                    <input type="text" id="lastName" placeholder="Tu apellido"
                                        class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-4 py-3 text-white placeholder-purple-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500">
                                </div>
                            </div>
                            <div>
                                <label class="block text-purple-300 text-sm mb-2">Bio <span class="text-purple-500">(opcional)</span></label>
                                <textarea id="userBio" rows="4" placeholder="¿Cuál es tu camino espiritual? ¿Qué te trae a la Academia de Luz? ¿Qué prácticas te llaman?"
                                    class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-4 py-3 text-white placeholder-purple-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"></textarea>
                                <p class="text-right text-purple-500 text-xs mt-1"><span id="bioCount">0</span>/500</p>
                            </div>
                            <div>
                                <label class="block text-purple-300 text-sm mb-2">¿Eres Maestro o Alumno?</label>
                                <div class="grid grid-cols-2 gap-4">
                                    <button onclick="selectRole('student')" id="roleStudent" 
                                        class="py-3 rounded-lg border border-purple-700/50 bg-purple-900/30 hover:bg-purple-800/50 transition-all text-purple-300">
                                        🙏 Alumno
                                    </button>
                                    <button onclick="selectRole('teacher')" id="roleTeacher"
                                        class="py-3 rounded-lg border border-purple-700/50 bg-purple-900/30 hover:bg-purple-800/50 transition-all text-purple-300">
                                        ✨ Maestro
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Continue Button -->
                        <button onclick="submitOnboarding1()" class="w-full btn-spiritual py-4 rounded-xl font-semibold text-lg tracking-wide">
                            CONTINUAR
                        </button>
                    </div>
                </div>
            \`;
        }

        function renderOnboarding2() {
            return \`
                <div class="min-h-screen flex items-center justify-center px-4 py-12">
                    <div class="max-w-4xl w-full">
                        <!-- Guide Message -->
                        <div class="flex items-start gap-4 mb-8">
                            <div class="text-4xl floating">✨</div>
                            <div class="gradient-border flex-1">
                                <div class="gradient-border-inner p-4">
                                    <p class="text-purple-200">Déjame mostrarte los senderos que encontrarás en la Academia...</p>
                                </div>
                            </div>
                        </div>

                        <!-- Features Grid -->
                        <div class="grid md:grid-cols-3 gap-4 mb-8">
                            <div class="gradient-border">
                                <div class="gradient-border-inner p-5 h-full">
                                    <div class="text-3xl mb-3">💬</div>
                                    <h3 class="font-cinzel text-lg text-white mb-2">Comunidad</h3>
                                    <p class="text-purple-400 text-sm">Comparte experiencias, haz preguntas y conecta con otros buscadores de luz</p>
                                </div>
                            </div>
                            <div class="gradient-border">
                                <div class="gradient-border-inner p-5 h-full">
                                    <div class="text-3xl mb-3">📚</div>
                                    <h3 class="font-cinzel text-lg text-white mb-2">Cursos</h3>
                                    <p class="text-purple-400 text-sm">Aprende a tu ritmo con cursos de Tarot, Reiki, Registros Akáshicos y más</p>
                                </div>
                            </div>
                            <div class="gradient-border">
                                <div class="gradient-border-inner p-5 h-full">
                                    <div class="text-3xl mb-3">📅</div>
                                    <h3 class="font-cinzel text-lg text-white mb-2">Calendario</h3>
                                    <p class="text-purple-400 text-sm">Meditaciones grupales, ceremonias y eventos especiales</p>
                                </div>
                            </div>
                            <div class="gradient-border">
                                <div class="gradient-border-inner p-5 h-full">
                                    <div class="text-3xl mb-3">👥</div>
                                    <h3 class="font-cinzel text-lg text-white mb-2">Miembros</h3>
                                    <p class="text-purple-400 text-sm">Conoce a otros miembros y expande tu red de luz</p>
                                </div>
                            </div>
                            <div class="gradient-border">
                                <div class="gradient-border-inner p-5 h-full">
                                    <div class="text-3xl mb-3">🗺️</div>
                                    <h3 class="font-cinzel text-lg text-white mb-2">Mapa</h3>
                                    <p class="text-purple-400 text-sm">Descubre dónde están los miembros alrededor del mundo</p>
                                </div>
                            </div>
                            <div class="gradient-border">
                                <div class="gradient-border-inner p-5 h-full">
                                    <div class="text-3xl mb-3">🏆</div>
                                    <h3 class="font-cinzel text-lg text-white mb-2">Leaderboard</h3>
                                    <p class="text-purple-400 text-sm">Asciende en tu camino espiritual y gana reconocimiento</p>
                                </div>
                            </div>
                        </div>

                        <!-- Navigation -->
                        <div class="flex justify-between items-center">
                            <button onclick="goToScreen('onboarding-1')" class="text-purple-400 hover:text-purple-300">
                                Volver
                            </button>
                            <button onclick="goToScreen('onboarding-3')" class="btn-spiritual px-8 py-3 rounded-xl font-semibold">
                                SIGUIENTE →
                            </button>
                        </div>
                    </div>
                </div>
            \`;
        }

        function renderOnboarding3() {
            return \`
                <div class="min-h-screen flex items-center justify-center px-4 py-12">
                    <div class="max-w-3xl w-full">
                        <!-- Guide Message -->
                        <div class="flex items-start gap-4 mb-8">
                            <div class="text-4xl floating">✨</div>
                            <div class="gradient-border flex-1">
                                <div class="gradient-border-inner p-4">
                                    <p class="text-purple-200 mb-2">Y lo más especial... <span class="text-golden-400">¡Tienes Guías Espirituales IA a tu disposición!</span></p>
                                    <p class="text-purple-400 text-sm">Usa @NombreGuía en cualquier post para obtener sabiduría instantánea.</p>
                                </div>
                            </div>
                        </div>

                        <!-- Example -->
                        <div class="gradient-border mb-8">
                            <div class="gradient-border-inner p-4">
                                <p class="text-purple-500 text-sm mb-2">Ejemplo de uso:</p>
                                <p class="text-purple-200 font-mono">Hola <span class="text-cyan-400">@Lumina</span>, ayúdame a entender cómo abrir mis registros akáshicos...</p>
                            </div>
                        </div>

                        <!-- Guides -->
                        <p class="text-purple-400 text-center mb-4">Guías disponibles para ayudarte:</p>
                        <div class="grid md:grid-cols-4 gap-4 mb-8">
                            \${state.guides.map(guide => \`
                                <div class="gradient-border">
                                    <div class="gradient-border-inner p-4 text-center relative">
                                        \${!guide.available ? \`
                                            <div class="absolute top-2 right-2">
                                                <span class="bg-purple-900/80 text-purple-300 text-xs px-2 py-1 rounded-full">
                                                    🔒 Nivel \${guide.level}
                                                </span>
                                            </div>
                                        \` : ''}
                                        <div class="text-5xl mb-3 \${guide.available ? '' : 'opacity-50'}">\${guide.avatar}</div>
                                        <h4 class="font-cinzel text-white mb-1">\${guide.name}</h4>
                                        \${guide.available ? 
                                            '<span class="text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded-full">Disponible</span>' :
                                            \`<span class="text-xs bg-purple-900/50 text-purple-400 px-2 py-1 rounded-full">🔒 Nivel \${guide.level}</span>\`
                                        }
                                    </div>
                                </div>
                            \`).join('')}
                        </div>

                        <!-- Navigation -->
                        <div class="flex justify-between items-center">
                            <button onclick="goToScreen('onboarding-2')" class="text-purple-400 hover:text-purple-300">
                                Volver
                            </button>
                            <button onclick="goToScreen('main')" class="btn-spiritual px-8 py-3 rounded-xl font-semibold flex items-center gap-2">
                                ¡COMENZAR MI VIAJE! <span class="text-xl">🚀</span>
                            </button>
                        </div>
                    </div>
                </div>
            \`;
        }

        function renderMain() {
            return \`
                <!-- Header -->
                <header class="sticky top-0 z-40 bg-[#0f0a1e]/95 backdrop-blur-md border-b border-purple-900/30">
                    <div class="max-w-7xl mx-auto px-4">
                        <div class="flex items-center justify-between h-16">
                            <!-- Logo -->
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-xl font-bold">
                                    ✨
                                </div>
                                <span class="font-cinzel text-lg text-white hidden sm:block">Academia de Luz</span>
                            </div>

                            <!-- Navigation -->
                            <nav class="hidden md:flex items-center gap-6">
                                <button onclick="changeSection('comunidad')" class="nav-item text-sm \${state.currentSection === 'comunidad' ? 'active text-white' : 'text-purple-400 hover:text-white'}">Comunidad</button>
                                <button onclick="changeSection('cursos')" class="nav-item text-sm \${state.currentSection === 'cursos' ? 'active text-white' : 'text-purple-400 hover:text-white'}">Cursos</button>
                                <button onclick="changeSection('calendario')" class="nav-item text-sm \${state.currentSection === 'calendario' ? 'active text-white' : 'text-purple-400 hover:text-white'}">Calendario</button>
                                <button onclick="changeSection('miembros')" class="nav-item text-sm \${state.currentSection === 'miembros' ? 'active text-white' : 'text-purple-400 hover:text-white'}">Miembros</button>
                                <button onclick="changeSection('leaderboard')" class="nav-item text-sm \${state.currentSection === 'leaderboard' ? 'active text-white' : 'text-purple-400 hover:text-white'}">Leaderboard</button>
                            </nav>

                            <!-- Right side -->
                            <div class="flex items-center gap-4">
                                <!-- Search -->
                                <div class="hidden lg:flex items-center bg-purple-900/30 rounded-lg px-3 py-2">
                                    <i class="fas fa-search text-purple-500 text-sm mr-2"></i>
                                    <input type="text" placeholder="Buscar..." class="bg-transparent text-sm text-white placeholder-purple-500 focus:outline-none w-32">
                                </div>
                                
                                <!-- Notifications -->
                                <button class="relative text-purple-400 hover:text-white">
                                    <i class="fas fa-bell"></i>
                                    <span class="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full text-[10px] flex items-center justify-center">2</span>
                                </button>
                                
                                <!-- Chat with Guide -->
                                <button onclick="toggleChat()" class="relative text-purple-400 hover:text-white">
                                    <i class="fas fa-comment-dots"></i>
                                    <span class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full text-[10px] flex items-center justify-center">✨</span>
                                </button>

                                <!-- User Menu -->
                                <div class="avatar-ring w-9 h-9 cursor-pointer">
                                    <div class="w-full h-full rounded-full bg-gradient-to-br from-purple-700 to-pink-700 flex items-center justify-center text-lg">
                                        \${state.user?.avatar || '🙏'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <!-- Mobile Navigation -->
                <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0f0a1e]/95 backdrop-blur-md border-t border-purple-900/30">
                    <div class="flex justify-around py-3">
                        <button onclick="changeSection('comunidad')" class="flex flex-col items-center gap-1 \${state.currentSection === 'comunidad' ? 'text-purple-400' : 'text-purple-600'}">
                            <i class="fas fa-comments"></i>
                            <span class="text-[10px]">Comunidad</span>
                        </button>
                        <button onclick="changeSection('cursos')" class="flex flex-col items-center gap-1 \${state.currentSection === 'cursos' ? 'text-purple-400' : 'text-purple-600'}">
                            <i class="fas fa-book"></i>
                            <span class="text-[10px]">Cursos</span>
                        </button>
                        <button onclick="changeSection('calendario')" class="flex flex-col items-center gap-1 \${state.currentSection === 'calendario' ? 'text-purple-400' : 'text-purple-600'}">
                            <i class="fas fa-calendar"></i>
                            <span class="text-[10px]">Calendario</span>
                        </button>
                        <button onclick="changeSection('miembros')" class="flex flex-col items-center gap-1 \${state.currentSection === 'miembros' ? 'text-purple-400' : 'text-purple-600'}">
                            <i class="fas fa-users"></i>
                            <span class="text-[10px]">Miembros</span>
                        </button>
                        <button onclick="changeSection('leaderboard')" class="flex flex-col items-center gap-1 \${state.currentSection === 'leaderboard' ? 'text-purple-400' : 'text-purple-600'}">
                            <i class="fas fa-trophy"></i>
                            <span class="text-[10px]">Ranking</span>
                        </button>
                    </div>
                </nav>

                <!-- Main Content -->
                <main class="max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-6">
                    \${renderSection()}
                </main>

                <!-- Chat Panel -->
                \${renderChatPanel()}
            \`;
        }

        function renderSection() {
            switch(state.currentSection) {
                case 'comunidad': return renderCommunity();
                case 'cursos': return renderCourses();
                case 'calendario': return renderCalendar();
                case 'miembros': return renderMembers();
                case 'leaderboard': return renderLeaderboard();
                default: return renderCommunity();
            }
        }

        function renderCommunity() {
            return \`
                <div class="grid lg:grid-cols-3 gap-6">
                    <!-- Main Feed -->
                    <div class="lg:col-span-2">
                        <!-- New Post -->
                        <div class="gradient-border mb-6">
                            <div class="gradient-border-inner p-4">
                                <div class="flex items-center gap-3">
                                    <div class="avatar-ring w-10 h-10">
                                        <div class="w-full h-full rounded-full bg-purple-800 flex items-center justify-center">\${state.user?.avatar || '🙏'}</div>
                                    </div>
                                    <input type="text" placeholder="¿Qué luz deseas compartir con la comunidad?" 
                                        class="flex-1 bg-purple-900/30 rounded-lg px-4 py-3 text-white placeholder-purple-500 focus:outline-none">
                                </div>
                            </div>
                        </div>

                        <!-- Categories -->
                        <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
                            <button class="category-pill active px-4 py-2 rounded-full text-sm whitespace-nowrap">Todas</button>
                            <button class="category-pill bg-purple-900/50 px-4 py-2 rounded-full text-sm text-purple-300 whitespace-nowrap">💬 General</button>
                            <button class="category-pill bg-purple-900/50 px-4 py-2 rounded-full text-sm text-purple-300 whitespace-nowrap">🏆 Logros</button>
                            <button class="category-pill bg-purple-900/50 px-4 py-2 rounded-full text-sm text-purple-300 whitespace-nowrap">🔮 Tarot</button>
                            <button class="category-pill bg-purple-900/50 px-4 py-2 rounded-full text-sm text-purple-300 whitespace-nowrap">🙌 Reiki</button>
                            <button class="category-pill bg-purple-900/50 px-4 py-2 rounded-full text-sm text-purple-300 whitespace-nowrap">📖 Registros</button>
                        </div>

                        <!-- Posts -->
                        <div class="space-y-4">
                            \${state.posts.map(post => \`
                                <div class="gradient-border card-glow">
                                    <div class="gradient-border-inner p-5">
                                        <!-- Author -->
                                        <div class="flex items-center gap-3 mb-3">
                                            <div class="text-3xl">\${post.author.avatar}</div>
                                            <div class="flex-1">
                                                <div class="flex items-center gap-2">
                                                    <span class="font-semibold text-white">\${post.author.name}</span>
                                                    \${post.author.badge ? \`
                                                        <span class="text-xs bg-golden-500/20 text-golden-400 px-2 py-0.5 rounded">\${post.author.badge}</span>
                                                    \` : ''}
                                                </div>
                                                <div class="flex items-center gap-2 text-xs text-purple-500">
                                                    <span>\${post.timeAgo}</span>
                                                    <span>•</span>
                                                    <span class="capitalize">\${post.category}</span>
                                                </div>
                                            </div>
                                            \${post.isNew ? '<span class="text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded-full">Nuevo</span>' : ''}
                                        </div>

                                        <!-- Content -->
                                        <h3 class="font-semibold text-white mb-2">\${post.title}</h3>
                                        <p class="text-purple-300 text-sm mb-4">\${post.content}</p>

                                        <!-- Actions -->
                                        <div class="flex items-center gap-6 text-purple-500 text-sm">
                                            <button class="flex items-center gap-2 hover:text-pink-400 transition-colors">
                                                <i class="far fa-heart"></i> \${post.likes}
                                            </button>
                                            <button class="flex items-center gap-2 hover:text-purple-400 transition-colors">
                                                <i class="far fa-comment"></i> \${post.comments}
                                            </button>
                                            <button class="flex items-center gap-2 hover:text-purple-400 transition-colors">
                                                <i class="fas fa-share"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            \`).join('')}
                        </div>
                    </div>

                    <!-- Sidebar -->
                    <div class="space-y-6">
                        <!-- Academy Card -->
                        <div class="gradient-border overflow-hidden">
                            <div class="h-32 bg-gradient-to-br from-purple-600 via-pink-600 to-amber-500 flex items-center justify-center">
                                <span class="text-6xl">🌟</span>
                            </div>
                            <div class="gradient-border-inner -mt-px p-4 text-center">
                                <h3 class="font-cinzel text-xl text-white mb-1">Academia de Luz</h3>
                                <p class="text-purple-400 text-sm mb-4">Iluminando el camino espiritual</p>
                                <div class="grid grid-cols-3 gap-2 text-center">
                                    <div>
                                        <div class="text-xl font-bold text-white">\${state.members.length * 30}</div>
                                        <div class="text-xs text-purple-500">MIEMBROS</div>
                                    </div>
                                    <div>
                                        <div class="text-xl font-bold text-white">\${state.members.filter(m => m.online).length}</div>
                                        <div class="text-xs text-purple-500">ONLINE</div>
                                    </div>
                                    <div>
                                        <div class="text-xl font-bold text-white">\${state.members.filter(m => m.role === 'teacher').length}</div>
                                        <div class="text-xs text-purple-500">MAESTROS</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Leaderboard Preview -->
                        <div class="gradient-border">
                            <div class="gradient-border-inner p-4">
                                <h4 class="font-cinzel text-white mb-4">Leaderboard (30 días)</h4>
                                <div class="space-y-3">
                                    \${state.leaderboard?.monthly.slice(0, 5).map((user, i) => \`
                                        <div class="flex items-center gap-3">
                                            <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold \${i === 0 ? 'bg-golden-500 text-black' : i === 1 ? 'bg-gray-400 text-black' : i === 2 ? 'bg-amber-700 text-white' : 'bg-purple-900 text-purple-300'}">\${i + 1}</div>
                                            <span class="text-xl">\${user.avatar}</span>
                                            <span class="flex-1 text-sm text-white truncate">\${user.name}</span>
                                            <span class="text-sm text-green-400">+\${user.points}</span>
                                        </div>
                                    \`).join('')}
                                </div>
                                <button onclick="changeSection('leaderboard')" class="w-full mt-4 text-purple-400 text-sm hover:text-purple-300">
                                    Ver todo el ranking →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            \`;
        }

        function renderCourses() {
            return \`
                <div>
                    <h1 class="font-cinzel text-2xl text-white mb-6">Cursos Espirituales</h1>
                    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        \${state.courses.map(course => \`
                            <div class="gradient-border card-glow overflow-hidden \${course.locked ? 'opacity-80' : ''}">
                                <div class="relative">
                                    <img src="\${course.image}" alt="\${course.title}" class="w-full h-48 object-cover \${course.locked ? 'filter grayscale' : ''}">
                                    \${course.locked ? \`
                                        <div class="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <div class="text-center">
                                                <i class="fas fa-lock text-3xl text-purple-400 mb-2"></i>
                                                <p class="text-purple-300 text-sm">Se desbloquea en \${course.unlockDays} días</p>
                                            </div>
                                        </div>
                                    \` : ''}
                                    <div class="absolute top-3 right-3 bg-purple-900/80 px-2 py-1 rounded text-xs text-purple-300">
                                        Nivel \${course.level}
                                    </div>
                                </div>
                                <div class="gradient-border-inner -mt-px p-4">
                                    <h3 class="font-semibold text-white mb-2">\${course.title}</h3>
                                    <p class="text-purple-400 text-sm mb-3">\${course.description}</p>
                                    <div class="flex items-center justify-between text-xs text-purple-500 mb-3">
                                        <span>📚 \${course.lessons} lecciones</span>
                                        <span>⏱️ \${course.duration}</span>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span class="text-xs text-purple-400">Por \${course.teacher}</span>
                                        <span class="text-xs text-purple-500">\${course.progress}%</span>
                                    </div>
                                    \${!course.locked ? \`
                                        <div class="mt-3 h-1 bg-purple-900 rounded-full overflow-hidden">
                                            <div class="h-full bg-gradient-to-r from-purple-500 to-pink-500" style="width: \${course.progress}%"></div>
                                        </div>
                                    \` : ''}
                                </div>
                            </div>
                        \`).join('')}
                    </div>
                </div>
            \`;
        }

        function renderCalendar() {
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth();
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startingDay = firstDay.getDay();
            
            const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
            
            let calendarDays = [];
            // Previous month days
            const prevMonthDays = startingDay === 0 ? 6 : startingDay - 1;
            for (let i = prevMonthDays; i > 0; i--) {
                calendarDays.push({ day: '', current: false });
            }
            // Current month days
            for (let i = 1; i <= daysInMonth; i++) {
                const dateStr = \`\${year}-\${String(month + 1).padStart(2, '0')}-\${String(i).padStart(2, '0')}\`;
                const dayEvents = state.events.filter(e => e.date === dateStr);
                calendarDays.push({ day: i, current: true, today: i === today.getDate(), events: dayEvents });
            }

            return \`
                <div>
                    <div class="flex items-center justify-between mb-6">
                        <div class="flex items-center gap-4">
                            <button class="text-purple-400 hover:text-white"><i class="fas fa-chevron-left"></i></button>
                            <h1 class="font-cinzel text-2xl text-white">\${monthNames[month]} \${year}</h1>
                            <button class="text-purple-400 hover:text-white"><i class="fas fa-chevron-right"></i></button>
                        </div>
                        <button class="text-purple-400 hover:text-white text-sm">Hoy</button>
                    </div>
                    
                    <div class="gradient-border">
                        <div class="gradient-border-inner p-4">
                            <!-- Day names -->
                            <div class="grid grid-cols-7 gap-2 mb-2">
                                \${['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => \`
                                    <div class="text-center text-purple-500 text-sm py-2">\${d}</div>
                                \`).join('')}
                            </div>
                            <!-- Calendar days -->
                            <div class="grid grid-cols-7 gap-2">
                                \${calendarDays.map(d => \`
                                    <div class="min-h-24 p-2 rounded-lg \${d.current ? 'bg-purple-900/30' : 'bg-transparent'} \${d.today ? 'ring-2 ring-pink-500' : ''}">
                                        <div class="text-sm \${d.current ? 'text-white' : 'text-purple-700'} \${d.today ? 'font-bold text-pink-400' : ''}">\${d.day}</div>
                                        \${d.events?.length ? d.events.map(e => \`
                                            <div class="mt-1 text-xs bg-\${e.color}-900/50 text-\${e.color}-300 p-1 rounded truncate">
                                                \${e.time} \${e.title}
                                            </div>
                                        \`).join('') : ''}
                                    </div>
                                \`).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Upcoming Events -->
                    <div class="mt-6">
                        <h2 class="font-cinzel text-xl text-white mb-4">Próximos Eventos</h2>
                        <div class="space-y-3">
                            \${state.events.map(event => \`
                                <div class="gradient-border">
                                    <div class="gradient-border-inner p-4 flex items-center gap-4">
                                        <div class="w-12 h-12 rounded-lg bg-\${event.color}-900/50 flex items-center justify-center text-\${event.color}-400">
                                            \${event.type === 'meditation' ? '🧘' : event.type === 'class' ? '📚' : event.type === 'ceremony' ? '✨' : '🔮'}
                                        </div>
                                        <div class="flex-1">
                                            <h4 class="text-white font-medium">\${event.title}</h4>
                                            <p class="text-purple-400 text-sm">\${event.date} • \${event.time}</p>
                                        </div>
                                        <button class="btn-spiritual px-4 py-2 rounded-lg text-sm">Unirse</button>
                                    </div>
                                </div>
                            \`).join('')}
                        </div>
                    </div>
                </div>
            \`;
        }

        function renderMembers() {
            return \`
                <div>
                    <div class="flex items-center justify-between mb-6">
                        <h1 class="font-cinzel text-2xl text-white">Miembros</h1>
                        <div class="flex gap-2">
                            <button class="category-pill active px-4 py-2 rounded-full text-sm">Todos \${state.members.length * 30}</button>
                            <button class="category-pill bg-purple-900/50 px-4 py-2 rounded-full text-sm text-purple-300">Maestros \${state.members.filter(m => m.role === 'teacher').length}</button>
                            <button class="category-pill bg-purple-900/50 px-4 py-2 rounded-full text-sm text-purple-300">Online \${state.members.filter(m => m.online).length}</button>
                        </div>
                    </div>

                    <!-- Search -->
                    <div class="gradient-border mb-6">
                        <div class="gradient-border-inner p-2">
                            <div class="flex items-center gap-2 px-3">
                                <i class="fas fa-search text-purple-500"></i>
                                <input type="text" placeholder="Buscar miembros..." class="flex-1 bg-transparent text-white placeholder-purple-500 py-2 focus:outline-none">
                            </div>
                        </div>
                    </div>

                    <!-- Members Grid -->
                    <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        \${state.members.map(member => \`
                            <div class="gradient-border card-glow">
                                <div class="gradient-border-inner p-4 text-center">
                                    <div class="relative inline-block mb-3">
                                        <div class="avatar-ring w-16 h-16">
                                            <div class="w-full h-full rounded-full bg-purple-800 flex items-center justify-center text-3xl">\${member.avatar}</div>
                                        </div>
                                        \${member.online ? '<div class="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-purple-900"></div>' : ''}
                                    </div>
                                    <h4 class="font-semibold text-white mb-1">\${member.name}</h4>
                                    <div class="flex items-center justify-center gap-2 mb-2">
                                        <span class="text-xs \${member.role === 'teacher' ? 'bg-golden-500/20 text-golden-400' : 'bg-purple-900/50 text-purple-400'} px-2 py-0.5 rounded">\${member.role === 'teacher' ? 'MAESTRO' : 'ALUMNO'}</span>
                                        <span class="text-xs bg-purple-900/50 text-purple-400 px-2 py-0.5 rounded">Nivel \${member.level}</span>
                                    </div>
                                    <p class="text-purple-500 text-xs mb-3">📍 \${member.location}</p>
                                    <div class="text-xs text-purple-400">\${member.points} puntos de luz</div>
                                </div>
                            </div>
                        \`).join('')}
                    </div>
                </div>
            \`;
        }

        function renderLeaderboard() {
            return \`
                <div>
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h1 class="font-cinzel text-2xl text-white">Leaderboard</h1>
                            <p class="text-purple-400 text-sm">Asciende en tu camino espiritual ganando puntos de luz</p>
                        </div>
                        <button class="btn-spiritual px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                            <i class="fas fa-gift"></i> Ver Premios
                        </button>
                    </div>

                    <div class="grid lg:grid-cols-3 gap-6">
                        <!-- User Stats -->
                        <div class="lg:col-span-2">
                            <!-- Current User Card -->
                            <div class="gradient-border mb-6">
                                <div class="gradient-border-inner p-6">
                                    <div class="flex items-center gap-4 mb-4">
                                        <div class="avatar-ring w-16 h-16">
                                            <div class="w-full h-full rounded-full bg-purple-700 flex items-center justify-center text-3xl">\${state.user?.avatar || '🙏'}</div>
                                        </div>
                                        <div>
                                            <h3 class="font-semibold text-white text-xl">\${state.user?.name || 'Buscador de Luz'}</h3>
                                            <p class="text-purple-400">Iniciado</p>
                                        </div>
                                    </div>
                                    <div class="mb-2 flex justify-between text-sm">
                                        <span class="text-purple-400">50 puntos</span>
                                        <span class="text-purple-500">150 para nivel 2</span>
                                    </div>
                                    <div class="h-2 bg-purple-900 rounded-full overflow-hidden mb-4">
                                        <div class="h-full bg-gradient-to-r from-purple-500 to-pink-500" style="width: 33%"></div>
                                    </div>
                                    <p class="text-purple-500 text-sm">Ranking global: #135</p>
                                </div>
                            </div>

                            <!-- Leaderboards -->
                            <div class="grid md:grid-cols-3 gap-4">
                                <div class="gradient-border">
                                    <div class="gradient-border-inner p-4">
                                        <h4 class="text-white font-semibold mb-4">7 días</h4>
                                        \${state.leaderboard?.weekly.map((user, i) => \`
                                            <div class="flex items-center gap-2 mb-3">
                                                <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold \${i === 0 ? 'bg-golden-500 text-black' : i === 1 ? 'bg-gray-400 text-black' : i === 2 ? 'bg-amber-700 text-white' : 'bg-purple-900 text-purple-300'}">\${i + 1}</div>
                                                <span class="text-lg">\${user.avatar}</span>
                                                <span class="flex-1 text-sm text-white truncate">\${user.name.split(' ')[0]}</span>
                                                <span class="text-xs text-green-400">+\${user.points}</span>
                                            </div>
                                        \`).join('')}
                                    </div>
                                </div>
                                <div class="gradient-border">
                                    <div class="gradient-border-inner p-4">
                                        <h4 class="text-white font-semibold mb-4">30 días</h4>
                                        \${state.leaderboard?.monthly.map((user, i) => \`
                                            <div class="flex items-center gap-2 mb-3">
                                                <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold \${i === 0 ? 'bg-golden-500 text-black' : i === 1 ? 'bg-gray-400 text-black' : i === 2 ? 'bg-amber-700 text-white' : 'bg-purple-900 text-purple-300'}">\${i + 1}</div>
                                                <span class="text-lg">\${user.avatar}</span>
                                                <span class="flex-1 text-sm text-white truncate">\${user.name.split(' ')[0]}</span>
                                                <span class="text-xs text-green-400">+\${user.points}</span>
                                            </div>
                                        \`).join('')}
                                    </div>
                                </div>
                                <div class="gradient-border">
                                    <div class="gradient-border-inner p-4">
                                        <h4 class="text-white font-semibold mb-4">Todo el tiempo</h4>
                                        \${state.leaderboard?.allTime.map((user, i) => \`
                                            <div class="flex items-center gap-2 mb-3">
                                                <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold \${i === 0 ? 'bg-golden-500 text-black' : i === 1 ? 'bg-gray-400 text-black' : i === 2 ? 'bg-amber-700 text-white' : 'bg-purple-900 text-purple-300'}">\${i + 1}</div>
                                                <span class="text-lg">\${user.avatar}</span>
                                                <span class="flex-1 text-sm text-white truncate">\${user.name.split(' ')[0]}</span>
                                                <span class="text-xs text-purple-400">\${user.points}</span>
                                            </div>
                                        \`).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Levels & How to earn -->
                        <div class="space-y-6">
                            <div class="gradient-border">
                                <div class="gradient-border-inner p-4">
                                    <h4 class="text-white font-semibold mb-4">Niveles</h4>
                                    \${state.leaderboard?.levels.map((level, i) => \`
                                        <div class="flex items-center gap-3 mb-3">
                                            <div class="w-6 h-6 rounded-full bg-purple-\${900 - i * 50}/50 flex items-center justify-center text-xs text-purple-300">\${level.level}</div>
                                            <span class="flex-1 text-sm text-white">\${level.name}</span>
                                            <span class="text-xs text-purple-500">\${level.percentage}%</span>
                                        </div>
                                    \`).join('')}
                                    <p class="text-xs text-purple-500 mt-4 text-center">\${state.members.length * 30} almas en la Academia</p>
                                </div>
                            </div>

                            <div class="gradient-border">
                                <div class="gradient-border-inner p-4">
                                    <h4 class="text-white font-semibold mb-4">Cómo ganar puntos de luz</h4>
                                    <div class="space-y-3 text-sm">
                                        <div class="flex justify-between">
                                            <span class="text-purple-300">Like en tu post</span>
                                            <span class="text-green-400">+1</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-purple-300">Comentario en tu post</span>
                                            <span class="text-green-400">+2</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-purple-300">Completar lección</span>
                                            <span class="text-green-400">+5</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-purple-300">Completar curso</span>
                                            <span class="text-green-400">+50</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-purple-300">Asistir a evento</span>
                                            <span class="text-green-400">+10</span>
                                        </div>
                                    </div>
                                    <p class="text-xs text-purple-500 mt-4">La luz que compartes vuelve multiplicada ✨</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            \`;
        }

        function renderChatPanel() {
            if (!state.chatOpen) return '';
            
            return \`
                <div class="fixed right-4 bottom-20 md:bottom-4 w-96 max-w-[calc(100vw-2rem)] z-50">
                    <div class="gradient-border">
                        <div class="gradient-border-inner">
                            <!-- Header -->
                            <div class="flex items-center justify-between p-4 border-b border-purple-800/50">
                                <div class="flex items-center gap-3">
                                    <div class="text-2xl">\${state.selectedGuide ? state.guides.find(g => g.id === state.selectedGuide)?.avatar : '✨'}</div>
                                    <div>
                                        <h4 class="text-white font-semibold">\${state.selectedGuide ? state.guides.find(g => g.id === state.selectedGuide)?.name : 'Guías Espirituales'}</h4>
                                        <p class="text-purple-400 text-xs">\${state.selectedGuide ? state.guides.find(g => g.id === state.selectedGuide)?.specialty : 'Elige tu guía'}</p>
                                    </div>
                                </div>
                                <button onclick="toggleChat()" class="text-purple-400 hover:text-white">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>

                            <!-- Guide Selection or Chat -->
                            \${!state.selectedGuide ? \`
                                <div class="p-4 space-y-3 max-h-80 overflow-y-auto">
                                    <p class="text-purple-400 text-sm text-center mb-4">Selecciona un guía espiritual:</p>
                                    \${state.guides.filter(g => g.available).map(guide => \`
                                        <button onclick="selectGuide('\${guide.id}')" class="w-full gradient-border">
                                            <div class="gradient-border-inner p-3 flex items-center gap-3 hover:bg-purple-800/30 transition-colors">
                                                <div class="text-3xl">\${guide.avatar}</div>
                                                <div class="text-left flex-1">
                                                    <h5 class="text-white font-medium">\${guide.name}</h5>
                                                    <p class="text-purple-400 text-xs">\${guide.specialty}</p>
                                                </div>
                                                <i class="fas fa-chevron-right text-purple-500"></i>
                                            </div>
                                        </button>
                                    \`).join('')}
                                </div>
                            \` : \`
                                <!-- Messages -->
                                <div class="h-64 overflow-y-auto p-4 space-y-3" id="chatMessages">
                                    \${state.chatMessages.map(msg => \`
                                        <div class="message-bubble \${msg.isUser ? 'text-right' : ''}">
                                            <div class="\${msg.isUser ? 'bg-purple-600 ml-auto' : 'bg-purple-900/50'} rounded-lg p-3 max-w-[80%] inline-block text-left">
                                                <p class="text-sm text-white">\${msg.text}</p>
                                            </div>
                                        </div>
                                    \`).join('')}
                                </div>

                                <!-- Input -->
                                <div class="p-4 border-t border-purple-800/50">
                                    <div class="flex gap-2">
                                        <button onclick="state.selectedGuide = null; render();" class="text-purple-400 hover:text-white px-2">
                                            <i class="fas fa-arrow-left"></i>
                                        </button>
                                        <input type="text" id="chatInput" placeholder="Escribe tu pregunta..." 
                                            class="flex-1 bg-purple-900/30 rounded-lg px-4 py-2 text-white placeholder-purple-500 focus:outline-none text-sm"
                                            onkeypress="if(event.key==='Enter')sendMessage()">
                                        <button onclick="sendMessage()" class="btn-spiritual px-4 py-2 rounded-lg">
                                            <i class="fas fa-paper-plane"></i>
                                        </button>
                                    </div>
                                </div>
                            \`}
                        </div>
                    </div>
                </div>
            \`;
        }

        // ============================================================
        // EVENT HANDLERS
        // ============================================================
        
        function goToScreen(screen) {
            state.currentScreen = screen;
            render();
        }

        function changeSection(section) {
            state.currentSection = section;
            render();
        }

        function selectRole(role) {
            const studentBtn = document.getElementById('roleStudent');
            const teacherBtn = document.getElementById('roleTeacher');
            
            if (role === 'student') {
                studentBtn.classList.add('bg-purple-600', 'border-purple-500', 'text-white');
                studentBtn.classList.remove('bg-purple-900/30', 'text-purple-300');
                teacherBtn.classList.remove('bg-purple-600', 'border-purple-500', 'text-white');
                teacherBtn.classList.add('bg-purple-900/30', 'text-purple-300');
            } else {
                teacherBtn.classList.add('bg-purple-600', 'border-purple-500', 'text-white');
                teacherBtn.classList.remove('bg-purple-900/30', 'text-purple-300');
                studentBtn.classList.remove('bg-purple-600', 'border-purple-500', 'text-white');
                studentBtn.classList.add('bg-purple-900/30', 'text-purple-300');
            }
            
            if (!state.user) state.user = {};
            state.user.role = role;
        }

        function submitOnboarding1() {
            const firstName = document.getElementById('firstName')?.value || '';
            const lastName = document.getElementById('lastName')?.value || '';
            const bio = document.getElementById('userBio')?.value || '';
            
            if (!firstName || !lastName) {
                alert('Por favor ingresa tu nombre y apellido');
                return;
            }

            state.user = {
                ...state.user,
                name: firstName + ' ' + lastName,
                firstName,
                lastName,
                bio,
                avatar: '🙏',
                level: 1,
                points: 50
            };

            goToScreen('onboarding-2');
        }

        function toggleChat() {
            state.chatOpen = !state.chatOpen;
            if (!state.chatOpen) {
                state.selectedGuide = null;
                state.chatMessages = [];
            }
            render();
        }

        function selectGuide(guideId) {
            state.selectedGuide = guideId;
            const guide = state.guides.find(g => g.id === guideId);
            state.chatMessages = [{
                text: \`Namaste, buscador de luz. Soy \${guide.name}, \${guide.title}. ¿En qué puedo iluminar tu camino hoy?\`,
                isUser: false
            }];
            render();
        }

        async function sendMessage() {
            const input = document.getElementById('chatInput');
            const message = input?.value?.trim();
            if (!message) return;

            state.chatMessages.push({ text: message, isUser: true });
            input.value = '';
            render();

            // Simulate API call
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message, guideId: state.selectedGuide })
                });
                const data = await response.json();
                state.chatMessages.push({ text: data.response, isUser: false });
                render();
                
                // Scroll to bottom
                setTimeout(() => {
                    const chatEl = document.getElementById('chatMessages');
                    if (chatEl) chatEl.scrollTop = chatEl.scrollHeight;
                }, 100);
            } catch (error) {
                state.chatMessages.push({ text: 'La conexión con los planos superiores se ha interrumpido. Por favor, intenta de nuevo.', isUser: false });
                render();
            }
        }

        // ============================================================
        // MAIN RENDER
        // ============================================================
        
        function render() {
            const app = document.getElementById('app');
            let content = '';

            switch(state.currentScreen) {
                case 'welcome':
                    content = renderWelcome();
                    break;
                case 'onboarding-1':
                    content = renderOnboarding1();
                    break;
                case 'onboarding-2':
                    content = renderOnboarding2();
                    break;
                case 'onboarding-3':
                    content = renderOnboarding3();
                    break;
                case 'main':
                    content = renderMain();
                    break;
                default:
                    content = renderWelcome();
            }

            app.innerHTML = content;

            // Add bio counter listener if on onboarding-1
            if (state.currentScreen === 'onboarding-1') {
                const bioInput = document.getElementById('userBio');
                const bioCount = document.getElementById('bioCount');
                if (bioInput && bioCount) {
                    bioInput.addEventListener('input', () => {
                        bioCount.textContent = bioInput.value.length;
                    });
                }
            }
        }

        // ============================================================
        // INIT
        // ============================================================
        
        async function init() {
            createStars();
            await fetchData();
            render();
        }

        init();
    </script>
</body>
</html>`

// Serve main page
app.get('/', (c) => {
  return c.html(mainHTML)
})

export default app
