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

// Serve favicon
app.get('/favicon.svg', serveStatic({ path: './favicon.svg' }))
app.get('/favicon.ico', (c) => c.redirect('/favicon.svg'))

// ============================================================
// IN-MEMORY DATA STORE
// ============================================================

const dataStore = {
  users: new Map<string, any>(),
  sessions: new Map<string, any>(),
  posts: [
    {
      id: '1',
      authorId: 'teacher-1',
      author: { id: 'teacher-1', name: 'Maestra Aurora', avatar: '🌟', role: 'teacher', badge: 'MAESTRA' },
      category: 'anuncios',
      title: '✨ BIENVENIDOS A LA ACADEMIA DE LUZ ✨',
      content: '¡Qué alegría ver cómo crece nuestra comunidad de buscadores espirituales! 🙏 Hoy damos inicio a un nuevo ciclo de luz. Más de 200 almas luminosas se han unido a este sendero. Recuerden: la luz que buscan ya habita en su interior.',
      likes: ['user-1', 'user-2', 'user-3'],
      comments: [
        { id: 'c1', authorId: 'user-1', author: { name: 'Carlos', avatar: '🔮' }, content: 'Gracias Maestra! Feliz de estar aquí', createdAt: new Date().toISOString() }
      ],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      authorId: 'user-1',
      author: { id: 'user-1', name: 'Carlos Mendoza', avatar: '🔮', role: 'student' },
      category: 'general',
      title: 'Mi primera lectura de Tarot',
      content: 'Hermanos de luz, acabo de hacer mi primera lectura de tarot siguiendo el curso del Maestro Orión. Fue una experiencia increíble, las cartas realmente hablan cuando te abres a su energía. ¿Algún consejo para profundizar?',
      likes: ['user-2', 'teacher-2'],
      comments: [],
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      authorId: 'user-2',
      author: { id: 'user-2', name: 'María Luz Esperanza', avatar: '🦋', role: 'student' },
      category: 'logros',
      title: 'Completé Reiki Nivel I 🎉',
      content: 'Namaste familia de luz! Hoy recibí mi certificación de Reiki Nivel I. La sintonización fue transformadora, sentí una luz dorada entrando por mi coronilla. Gracias Maestra Luz por guiarme en este camino.',
      likes: ['user-1', 'user-3', 'teacher-1', 'teacher-3'],
      comments: [],
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '4',
      authorId: 'teacher-2',
      author: { id: 'teacher-2', name: 'Maestro Orión', avatar: '⭐', role: 'teacher', badge: 'MAESTRO' },
      category: 'tarot',
      title: '🔮 Tirada especial Luna Llena',
      content: 'Queridos alumnos, esta noche de Luna Llena es perfecta para hacer tiradas de claridad. Les comparto una tirada de 3 cartas: 1) Lo que debes soltar, 2) Tu poder actual, 3) Lo que viene. ¡Compartan sus experiencias!',
      likes: ['user-1', 'user-2', 'user-3', 'user-4'],
      comments: [],
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    }
  ] as any[],
  courses: [
    { 
      id: '1', 
      title: 'Iniciación a los Registros Akáshicos', 
      description: 'Aprende a acceder a la biblioteca cósmica del alma. Descubre tu propósito de vida y sana memorias ancestrales.', 
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop', 
      category: 'registros-akashicos', 
      level: 1, 
      duration: '8 semanas',
      progress: 0,
      lessons: [
        { 
          id: 'l1-1', 
          title: '📖 Introducción a los Registros Akáshicos', 
          type: 'video',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content: `<div class="video-container mb-6">
  <iframe src="https://www.youtube.com/embed/ZbZSe6N_BXs" frameborder="0" allowfullscreen class="w-full aspect-video rounded-lg"></iframe>
</div>

<h2>📖 INTRODUCCIÓN A LOS REGISTROS AKÁSHICOS</h2>
<p>Bienvenido a este viaje sagrado hacia la biblioteca universal del alma.</p>

<h3>📖 ¿Qué son los Registros Akáshicos?</h3>
<p>Los Registros Akáshicos son la <strong>biblioteca cósmica</strong> donde se almacena toda la información de cada alma: pasado, presente y potenciales futuros. El término "Akasha" proviene del sánscrito y significa "éter" o "espacio".</p>

<p>Imagina una biblioteca infinita donde cada libro representa la historia de un alma, con todos sus:</p>
<ul>
<li>✨ Pensamientos y emociones</li>
<li>✨ Acciones y decisiones</li>
<li>✨ Contratos kármicos</li>
<li>✨ Lecciones de vida</li>
<li>✨ Potenciales futuros</li>
</ul>

<h3>🌟 Beneficios de acceder a los Registros</h3>
<ul>
<li>Comprensión profunda de tu propósito de vida</li>
<li>Sanación de memorias y patrones ancestrales</li>
<li>Claridad en relaciones y decisiones importantes</li>
<li>Conexión con tu sabiduría interior</li>
</ul>

<div class="note-box">
<p class="note-title">💡 NOTA IMPORTANTE:</p>
<p>Los Registros no predicen el futuro de forma fija, sino que muestran potenciales basados en tu vibración actual.</p>
</div>`,
          duration: '45min', 
          order: 1
        },
        { 
          id: 'l1-2', 
          title: '🧘 Preparación Energética', 
          type: 'lesson',
          content: `<h2>🧘 PREPARACIÓN ENERGÉTICA</h2>
<p>Antes de acceder a los Registros Akáshicos, es esencial preparar tu campo energético.</p>

<h3>⚡ Limpieza Áurica</h3>
<p>Tu aura es tu campo electromagnético personal. Para una lectura clara, necesitas:</p>

<ol>
<li><strong>Baño de sal marina:</strong> Añade 1 taza de sal marina a tu baño antes de la práctica</li>
<li><strong>Sahumerio:</strong> Quema salvia blanca o palo santo en tu espacio</li>
<li><strong>Visualización:</strong> Imagina luz violeta limpiando tu campo energético</li>
</ol>

<h3>🕯️ Creación del Espacio Sagrado</h3>
<ul>
<li>Elige un lugar tranquilo donde no serás interrumpido</li>
<li>Enciende una vela blanca o violeta</li>
<li>Coloca cristales de cuarzo o amatista cerca</li>
<li>Utiliza incienso de sándalo o lavanda</li>
</ul>

<h3>🧘 Meditación Preparatoria</h3>
<p>Realiza esta meditación de 10 minutos antes de cada sesión:</p>
<ol>
<li>Siéntate cómodamente con la columna recta</li>
<li>Cierra los ojos y respira profundamente 3 veces</li>
<li>Visualiza raíces de luz bajando de tu base hacia el centro de la Tierra</li>
<li>Siente cómo la energía de la Tierra sube por tu columna</li>
<li>Visualiza luz dorada entrando por tu coronilla</li>
<li>Permite que ambas energías se fusionen en tu corazón</li>
</ol>

<div class="practice-box">
<p class="practice-title">🎯 EJERCICIO PRÁCTICO</p>
<p>Practica esta meditación diariamente durante una semana antes de intentar tu primera lectura de Registros.</p>
</div>`,
          duration: '30min', 
          order: 2
        },
        { 
          id: 'l1-3', 
          title: '🙏 La Oración de Apertura', 
          type: 'lesson',
          content: `<h2>🙏 LA ORACIÓN DE APERTURA</h2>
<p>La oración sagrada es la llave que abre el portal a los Registros Akáshicos.</p>

<h3>📜 Oración Tradicional de Apertura</h3>
<div class="prayer-box">
<p class="prayer-text">
"Yo (di tu nombre completo) solicito permiso para acceder a los Registros Akáshicos de mi alma.<br><br>
Pido a los Señores, Maestros y Guardianes de los Registros que me guíen con amor, sabiduría y verdad.<br><br>
Que toda la información que reciba sea para mi mayor bien y el mayor bien de todos los involucrados.<br><br>
Abro mi corazón y mi mente para recibir la luz y sabiduría de los Registros.<br><br>
Que así sea. Que así sea. Que así sea."
</p>
</div>

<h3>🔑 Claves para una apertura exitosa</h3>
<ul>
<li><strong>Intención pura:</strong> Accede con humildad y deseo genuino de aprender</li>
<li><strong>Corazón abierto:</strong> Deja a un lado expectativas y juicios</li>
<li><strong>Repetición:</strong> Di la oración 3 veces, sintiendo cada palabra</li>
<li><strong>Paciencia:</strong> Puede tomar unos minutos sentir la conexión</li>
</ul>

<h3>✨ Señales de que los Registros están abiertos</h3>
<ul>
<li>Sensación de expansión o ligereza</li>
<li>Hormigueo en la coronilla o tercer ojo</li>
<li>Visión interior de luz o colores</li>
<li>Sensación de presencia amorosa</li>
<li>Paz profunda y claridad mental</li>
</ul>`,
          duration: '60min', 
          order: 3
        },
        { 
          id: 'l1-4', 
          title: '✨ Tu Primera Lectura Guiada', 
          type: 'practice',
          videoUrl: 'https://www.youtube.com/embed/inpok4MKVLM',
          content: `<div class="video-container mb-6">
  <iframe src="https://www.youtube.com/embed/inpok4MKVLM" frameborder="0" allowfullscreen class="w-full aspect-video rounded-lg"></iframe>
</div>

<h2>✨ TU PRIMERA LECTURA GUIADA</h2>
<p>Ha llegado el momento de realizar tu primera lectura de Registros Akáshicos.</p>

<h3>📋 Preparación</h3>
<ol>
<li>Escribe 3-5 preguntas claras y abiertas (evita preguntas de sí/no)</li>
<li>Realiza tu preparación energética</li>
<li>Ten papel y lápiz para tomar notas</li>
<li>Dispón de 30-60 minutos sin interrupciones</li>
</ol>

<h3>🎯 Ejemplos de buenas preguntas</h3>
<ul>
<li>"¿Cuál es mi propósito principal en esta vida?"</li>
<li>"¿Qué necesito saber sobre mi relación con [nombre]?"</li>
<li>"¿Qué bloqueo me impide avanzar en [área]?"</li>
<li>"¿Qué lección estoy aprendiendo actualmente?"</li>
</ul>

<h3>📖 Proceso de la Lectura</h3>
<ol>
<li>Recita la oración de apertura 3 veces</li>
<li>Espera hasta sentir la conexión (1-3 minutos)</li>
<li>Formula tu primera pregunta en voz alta o mentalmente</li>
<li>Permanece receptivo - la información puede venir como imágenes, palabras, sensaciones o conocimiento directo</li>
<li>Anota todo lo que recibas sin juzgar</li>
<li>Continúa con las siguientes preguntas</li>
<li>Cuando termines, agradece y cierra con la oración de cierre</li>
</ol>

<h3>🔚 Oración de Cierre</h3>
<div class="prayer-box">
<p class="prayer-text">
"Agradezco a los Señores, Maestros y Guardianes de los Registros Akáshicos por la sabiduría y amor recibidos. Cierro estos Registros con gratitud y honro la información recibida. Que así sea."
</p>
</div>`,
          duration: '90min', 
          order: 4
        }
      ],
      locked: false, 
      teacherId: 'teacher-1', 
      teacher: 'Maestra Aurora',
      enrolledStudents: ['user-1', 'user-2']
    },
    { 
      id: '2', 
      title: 'Tarot Espiritual Avanzado', 
      description: 'Domina el arte de la lectura de cartas para guía espiritual. Aprende a conectar con la energía de los Arcanos.', 
      image: 'https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?w=400&h=250&fit=crop', 
      category: 'tarot', 
      level: 1, 
      duration: '12 semanas',
      progress: 0,
      lessons: [
        { id: 'l2-1', title: '🃏 Los Arcanos Mayores', type: 'video', videoUrl: 'https://www.youtube.com/embed/ZbZSe6N_BXs', content: '<div class="video-container mb-6"><iframe src="https://www.youtube.com/embed/ZbZSe6N_BXs" frameborder="0" allowfullscreen class="w-full aspect-video rounded-lg"></iframe></div><h2>🃏 LOS ARCANOS MAYORES</h2><p>Los 22 Arcanos Mayores representan el viaje del alma a través de las grandes experiencias de la vida...</p><h3>El Viaje del Loco</h3><p>El Loco (0) inicia su viaje espiritual, pasando por cada arcano hasta llegar al Mundo (XXI).</p>', duration: '60min', order: 1 },
        { id: 'l2-2', title: '🎴 Los Arcanos Menores', type: 'lesson', content: '<h2>🎴 LOS ARCANOS MENORES</h2><p>Los 56 Arcanos Menores representan las experiencias cotidianas de la vida...</p><h3>Los Cuatro Palos</h3><ul><li><strong>Bastos:</strong> Fuego, creatividad, acción</li><li><strong>Copas:</strong> Agua, emociones, relaciones</li><li><strong>Espadas:</strong> Aire, mente, conflictos</li><li><strong>Oros:</strong> Tierra, material, trabajo</li></ul>', duration: '60min', order: 2 },
        { id: 'l2-3', title: '🔮 Tiradas Básicas', type: 'practice', content: '<h2>🔮 TIRADAS BÁSICAS</h2><p>Aprende las tiradas fundamentales para comenzar a leer...</p><h3>Tirada de 3 Cartas</h3><ol><li>Pasado</li><li>Presente</li><li>Futuro</li></ol><h3>Cruz Celta</h3><p>La tirada más completa con 10 cartas...</p>', duration: '45min', order: 3 },
        { id: 'l2-4', title: '✨ Conexión Intuitiva', type: 'lesson', content: '<h2>✨ CONEXIÓN INTUITIVA</h2><p>Desarrolla tu intuición para lecturas más profundas...</p>', duration: '50min', order: 4 }
      ], 
      locked: false, 
      teacherId: 'teacher-2', 
      teacher: 'Maestro Orión',
      enrolledStudents: ['user-1']
    },
    { 
      id: '3', 
      title: 'Reiki Nivel I - Usui Shiki Ryoho', 
      description: 'Primera sintonización y fundamentos del Reiki tradicional. Aprende a canalizar la energía universal.', 
      image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=250&fit=crop', 
      category: 'reiki', 
      level: 1, 
      duration: '4 semanas',
      progress: 0,
      lessons: [
        { id: 'l3-1', title: '📜 Historia del Reiki', type: 'video', videoUrl: 'https://www.youtube.com/embed/inpok4MKVLM', content: '<div class="video-container mb-6"><iframe src="https://www.youtube.com/embed/inpok4MKVLM" frameborder="0" allowfullscreen class="w-full aspect-video rounded-lg"></iframe></div><h2>📜 HISTORIA DEL REIKI</h2><p>El Reiki fue redescubierto por Mikao Usui en Japón a principios del siglo XX...</p>', duration: '30min', order: 1 },
        { id: 'l3-2', title: '🙏 Los 5 Principios', type: 'lesson', content: '<h2>🙏 LOS 5 PRINCIPIOS DEL REIKI</h2><div class="prayer-box"><p class="prayer-text">Solo por hoy, no te preocupes<br>Solo por hoy, no te enojes<br>Honra a tus padres, maestros y mayores<br>Gana tu vida honestamente<br>Muestra gratitud a todo ser viviente</p></div>', duration: '45min', order: 2 },
        { id: 'l3-3', title: '🤲 Posiciones de Manos', type: 'practice', content: '<h2>🤲 POSICIONES DE MANOS</h2><p>Aprende las 12 posiciones tradicionales para auto-tratamiento...</p>', duration: '60min', order: 3 },
        { id: 'l3-4', title: '✨ Auto-sanación', type: 'practice', content: '<h2>✨ PRÁCTICA DE AUTO-SANACIÓN</h2><p>La auto-sanación es fundamental en tu práctica de Reiki...</p>', duration: '90min', order: 4 }
      ], 
      locked: false, 
      teacherId: 'teacher-3', 
      teacher: 'Maestra Luz',
      enrolledStudents: ['user-2']
    },
    { id: '4', title: 'Numerología Sagrada', description: 'Descubre los misterios de los números y su influencia cósmica en tu vida', image: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=400&h=250&fit=crop', category: 'numerologia', level: 1, duration: '6 semanas', lessons: [
      { id: 'l4-1', title: '🔢 Introducción a los Números', type: 'lesson', content: '<h2>🔢 INTRODUCCIÓN A LOS NÚMEROS</h2><p>Cada número tiene una vibración única...</p>', duration: '40min', order: 1 },
      { id: 'l4-2', title: '✨ Tu Número de Vida', type: 'lesson', content: '<h2>✨ TU NÚMERO DE VIDA</h2><p>Aprende a calcular tu número de vida...</p>', duration: '45min', order: 2 }
    ], locked: false, teacherId: 'teacher-2', teacher: 'Maestro Orión', enrolledStudents: [] },
    { id: '5', title: 'Radiestesia y Péndulo', description: 'Técnicas avanzadas de detección energética con péndulo', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop', category: 'radiestesia', level: 2, duration: '5 semanas', lessons: [], locked: true, unlockDays: 14, teacherId: 'teacher-1', teacher: 'Maestra Aurora', enrolledStudents: [] },
    { id: '6', title: 'Radiónica Cuántica', description: 'Sanación a distancia mediante patrones de frecuencia', image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=250&fit=crop', category: 'radionica', level: 3, duration: '10 semanas', lessons: [], locked: true, unlockDays: 30, teacherId: 'teacher-1', teacher: 'Maestra Aurora', enrolledStudents: [] },
    { id: '7', title: 'Meditación y Chakras', description: 'Equilibra tus centros energéticos para una vida plena', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=250&fit=crop', category: 'meditacion', level: 1, duration: '8 semanas', lessons: [
      { id: 'l7-1', title: '🧘 Fundamentos de Meditación', type: 'video', content: '<h2>🧘 FUNDAMENTOS DE MEDITACIÓN</h2><p>La meditación es la práctica de entrenar la mente...</p>', duration: '30min', order: 1 },
      { id: 'l7-2', title: '🌈 Los 7 Chakras', type: 'lesson', content: '<h2>🌈 LOS 7 CHAKRAS</h2><p>Los chakras son centros de energía en tu cuerpo...</p>', duration: '60min', order: 2 }
    ], locked: false, teacherId: 'teacher-3', teacher: 'Maestra Luz', enrolledStudents: [] },
    { id: '8', title: 'Reiki Nivel II - Símbolos Sagrados', description: 'Segundo nivel de Reiki con símbolos de poder y sanación a distancia', image: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=400&h=250&fit=crop', category: 'reiki', level: 2, duration: '6 semanas', lessons: [], locked: true, unlockDays: 21, teacherId: 'teacher-3', teacher: 'Maestra Luz', enrolledStudents: [] },
    { id: '9', title: 'Canalización y Mediumnidad', description: 'Desarrolla tu capacidad de conectar con guías espirituales', image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=400&h=250&fit=crop', category: 'canalizacion', level: 3, duration: '12 semanas', lessons: [], locked: true, unlockDays: 45, teacherId: 'teacher-1', teacher: 'Maestra Aurora', enrolledStudents: [] }
  ],
  members: [
    { id: 'teacher-1', name: 'Maestra Aurora', email: 'aurora@academiadeduz.com', role: 'teacher', level: 9, points: 2450, online: true, avatar: '🌟', location: 'México', bio: 'Guardiana de los Registros Akáshicos. 15 años de experiencia.', students: ['user-1', 'user-2'] },
    { id: 'teacher-2', name: 'Maestro Orión', email: 'orion@academiadeduz.com', role: 'teacher', level: 9, points: 2280, online: true, avatar: '⭐', location: 'España', bio: 'Tarotista y astrólogo. Conecto con las estrellas.', students: ['user-1'] },
    { id: 'teacher-3', name: 'Maestra Luz', email: 'luz@academiadeduz.com', role: 'teacher', level: 9, points: 2100, online: false, avatar: '💫', location: 'Argentina', bio: 'Maestra Reiki Usui/Karuna. Sanación con amor.', students: ['user-2'] },
    { id: 'user-1', name: 'Carlos Mendoza', email: 'carlos@email.com', role: 'student', level: 3, points: 450, online: true, avatar: '🔮', location: 'Colombia', bio: 'Buscador espiritual, aprendiendo Tarot.', teacherId: 'teacher-1' },
    { id: 'user-2', name: 'María Luz Esperanza', email: 'maria@email.com', role: 'student', level: 4, points: 680, online: true, avatar: '🦋', location: 'Chile', bio: 'Amante de la meditación y el Reiki.', teacherId: 'teacher-1' },
    { id: 'user-3', name: 'Roberto Arcángel', email: 'roberto@email.com', role: 'student', level: 5, points: 890, online: false, avatar: '👼', location: 'Perú', bio: 'Conectando con los ángeles.', teacherId: 'teacher-2' },
    { id: 'user-4', name: 'Ana Cristal', email: 'ana@email.com', role: 'student', level: 2, points: 220, online: true, avatar: '💎', location: 'Ecuador', bio: 'Nueva en el camino espiritual.', teacherId: 'teacher-3' },
    { id: 'user-5', name: 'Fernando Luz', email: 'fernando@email.com', role: 'student', level: 6, points: 1120, online: true, avatar: '🌈', location: 'Uruguay', bio: 'Practicante de múltiples artes espirituales.', teacherId: 'teacher-1' }
  ],
  events: [
    { id: '1', title: 'Meditación Grupal Luna Llena', date: '2026-02-05', time: '21:00', type: 'meditation', color: 'purple', description: 'Meditación grupal para conectar con las energías lunares', attendees: ['user-1', 'user-2'] },
    { id: '2', title: 'Clase en Vivo: Tarot', date: '2026-02-08', time: '19:00', type: 'class', color: 'amber', description: 'Clase especial de interpretación de tiradas complejas', attendees: ['user-1'] },
    { id: '3', title: 'Sintonización Reiki Nivel I', date: '2026-02-12', time: '10:00', type: 'ceremony', color: 'green', description: 'Ceremonia de sintonización para nuevos iniciados', attendees: [] },
    { id: '4', title: 'Círculo de Lectura Akáshica', date: '2026-02-15', time: '18:00', type: 'workshop', color: 'indigo', description: 'Práctica grupal de lecturas de Registros Akáshicos', attendees: ['user-2'] }
  ],
  guides: [
    { id: 'lumina', name: 'Lumina', title: 'Guardiana de la Sabiduría', description: 'Guía principal de la Academia. Experta en todos los caminos espirituales.', specialty: 'Sabiduría Universal', avatar: '✨', available: true, level: null },
    { id: 'akasha', name: 'Akasha', title: 'Guardiana de los Registros', description: 'Especialista en Registros Akáshicos y vidas pasadas.', specialty: 'Registros Akáshicos', avatar: '📖', available: true, level: null },
    { id: 'arcano', name: 'Arcano', title: 'Maestro del Tarot', description: 'Guía experto en interpretación de arquetipos y lectura de cartas.', specialty: 'Tarot y Arquetipos', avatar: '🃏', available: false, level: 2 },
    { id: 'sanador', name: 'Sanador', title: 'Maestro de Energía', description: 'Especialista en Reiki, sanación energética y equilibrio de chakras.', specialty: 'Reiki y Sanación', avatar: '🙌', available: false, level: 3 },
    { id: 'creador', name: 'Creador de Cursos', title: 'Asistente IA para Maestros', description: 'Te ayudo a estructurar y crear cursos profesionales a partir de tus materiales.', specialty: 'Creación de Cursos', avatar: '🎓', available: true, level: null, forTeachers: true }
  ],
  userProgress: new Map<string, any>(),
  notifications: new Map<string, any[]>(),
  pendingCourses: new Map<string, any>(),
  chatHistory: new Map<string, any[]>(),
  uploadedFiles: new Map<string, any>()
}

// Helper functions
function getTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 60) return `${diffMins}m`
  if (diffHours < 24) return `${diffHours}h`
  return `${diffDays}d`
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function calculateLevel(points: number): { level: number; name: string; nextLevel: number } {
  const levels = [
    { level: 1, name: 'Iniciado', minPoints: 0 },
    { level: 2, name: 'Buscador', minPoints: 100 },
    { level: 3, name: 'Aprendiz', minPoints: 300 },
    { level: 4, name: 'Practicante', minPoints: 600 },
    { level: 5, name: 'Iluminado', minPoints: 1000 },
    { level: 6, name: 'Sabio', minPoints: 1500 },
    { level: 7, name: 'Guardián', minPoints: 2200 },
    { level: 8, name: 'Maestro', minPoints: 3000 },
    { level: 9, name: 'Ascendido', minPoints: 4000 }
  ]
  
  let currentLevel = levels[0]
  let nextLevel = levels[1]?.minPoints || 0
  
  for (let i = levels.length - 1; i >= 0; i--) {
    if (points >= levels[i].minPoints) {
      currentLevel = levels[i]
      nextLevel = levels[i + 1]?.minPoints || levels[i].minPoints
      break
    }
  }
  
  return { level: currentLevel.level, name: currentLevel.name, nextLevel }
}

// ============================================================
// API ROUTES
// ============================================================

// Auth - Register/Login
app.post('/api/auth/register', async (c) => {
  const body = await c.req.json()
  const { firstName, lastName, bio, role, avatar, email, password } = body
  
  // Check if email exists
  const existingUser = dataStore.members.find(m => m.email === email)
  if (existingUser) {
    return c.json({ success: false, error: 'El email ya está registrado' }, 400)
  }
  
  const userId = generateId()
  const user = {
    id: userId,
    name: `${firstName} ${lastName}`,
    firstName,
    lastName,
    email: email || '',
    bio: bio || '',
    role: role || 'student',
    avatar: avatar || '🙏',
    level: 1,
    points: 50,
    online: true,
    location: 'Mundo',
    createdAt: new Date().toISOString(),
    students: role === 'teacher' ? [] : undefined,
    teacherId: role === 'student' ? null : undefined
  }
  
  dataStore.users.set(userId, { ...user, password })
  dataStore.members.push(user)
  dataStore.notifications.set(userId, [
    { id: generateId(), type: 'welcome', message: '¡Bienvenido a la Academia de Luz! Tu viaje espiritual comienza ahora. ✨', read: false, createdAt: new Date().toISOString() }
  ])
  
  // Create session
  const sessionToken = generateId()
  dataStore.sessions.set(sessionToken, { userId, createdAt: new Date().toISOString() })
  
  return c.json({ success: true, user: { ...user, password: undefined }, token: sessionToken })
})

app.post('/api/auth/login', async (c) => {
  const { email, password, userId } = await c.req.json()
  
  // Support both email/password and userId login
  let user
  if (email && password) {
    user = Array.from(dataStore.users.values()).find(u => u.email === email && u.password === password)
  } else if (userId) {
    user = dataStore.users.get(userId) || dataStore.members.find(m => m.id === userId)
  }
  
  if (!user) return c.json({ success: false, error: 'Credenciales inválidas' }, 401)
  
  const sessionToken = generateId()
  dataStore.sessions.set(sessionToken, { userId: user.id, createdAt: new Date().toISOString() })
  
  return c.json({ success: true, user: { ...user, password: undefined }, token: sessionToken })
})

// Posts CRUD
app.get('/api/posts', async (c) => {
  const category = c.req.query('category')
  let posts = dataStore.posts
  
  if (category && category !== 'todas') {
    posts = posts.filter(p => p.category === category)
  }
  
  return c.json(posts.map(p => ({
    ...p,
    timeAgo: getTimeAgo(p.createdAt),
    likesCount: p.likes.length,
    commentsCount: p.comments.length,
    isNew: (Date.now() - new Date(p.createdAt).getTime()) < 12 * 60 * 60 * 1000
  })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
})

app.post('/api/posts', async (c) => {
  const body = await c.req.json()
  const { title, content, category, author } = body
  
  const post = {
    id: generateId(),
    authorId: author.id,
    author,
    category: category || 'general',
    title,
    content,
    likes: [],
    comments: [],
    createdAt: new Date().toISOString()
  }
  
  dataStore.posts.unshift(post)
  
  // Add points to author
  const member = dataStore.members.find(m => m.id === author.id)
  if (member) {
    member.points += 5
    const levelInfo = calculateLevel(member.points)
    member.level = levelInfo.level
  }
  
  return c.json({ success: true, post: { ...post, timeAgo: 'ahora', likesCount: 0, commentsCount: 0, isNew: true } })
})

app.post('/api/posts/:id/like', async (c) => {
  const postId = c.req.param('id')
  const { userId } = await c.req.json()
  
  const post = dataStore.posts.find(p => p.id === postId)
  if (!post) return c.json({ success: false, error: 'Post no encontrado' }, 404)
  
  const likeIndex = post.likes.indexOf(userId)
  if (likeIndex === -1) {
    post.likes.push(userId)
    const author = dataStore.members.find(m => m.id === post.authorId)
    if (author && author.id !== userId) author.points += 1
  } else {
    post.likes.splice(likeIndex, 1)
  }
  
  return c.json({ success: true, liked: likeIndex === -1, likesCount: post.likes.length })
})

app.post('/api/posts/:id/comment', async (c) => {
  const postId = c.req.param('id')
  const { content, author } = await c.req.json()
  
  const post = dataStore.posts.find(p => p.id === postId)
  if (!post) return c.json({ success: false, error: 'Post no encontrado' }, 404)
  
  const comment = {
    id: generateId(),
    authorId: author.id,
    author: { name: author.name, avatar: author.avatar },
    content,
    createdAt: new Date().toISOString()
  }
  
  post.comments.push(comment)
  
  const postAuthor = dataStore.members.find(m => m.id === post.authorId)
  if (postAuthor && postAuthor.id !== author.id) postAuthor.points += 2
  
  return c.json({ success: true, comment })
})

// Courses
app.get('/api/courses', async (c) => {
  const userId = c.req.query('userId')
  const teacherId = c.req.query('teacherId')
  const userProgress = userId ? dataStore.userProgress.get(userId) || {} : {}
  
  let courses = dataStore.courses
  
  // Filter by teacher if requested
  if (teacherId) {
    courses = courses.filter(course => course.teacherId === teacherId)
  }
  
  return c.json(courses.map(course => {
    const progress = userProgress[course.id] || { completedLessons: [], enrolled: false }
    const totalLessons = course.lessons?.length || 0
    const completedCount = progress.completedLessons?.length || 0
    
    return {
      ...course,
      progress: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0,
      enrolled: progress.enrolled || course.enrolledStudents?.includes(userId),
      completedLessons: progress.completedLessons || [],
      studentsCount: course.enrolledStudents?.length || 0
    }
  }))
})

app.get('/api/courses/:id', async (c) => {
  const courseId = c.req.param('id')
  const userId = c.req.query('userId')
  
  const course = dataStore.courses.find(c => c.id === courseId)
  if (!course) return c.json({ error: 'Curso no encontrado' }, 404)
  
  const userProgress = userId ? dataStore.userProgress.get(userId)?.[courseId] || {} : {}
  
  return c.json({
    ...course,
    enrolled: userProgress.enrolled || course.enrolledStudents?.includes(userId),
    completedLessons: userProgress.completedLessons || [],
    studentsCount: course.enrolledStudents?.length || 0
  })
})

app.get('/api/courses/:id/lessons/:lessonId', async (c) => {
  const { id: courseId, lessonId } = c.req.param()
  
  const course = dataStore.courses.find(c => c.id === courseId)
  if (!course) return c.json({ error: 'Curso no encontrado' }, 404)
  
  const lesson = course.lessons?.find((l: any) => l.id === lessonId)
  if (!lesson) return c.json({ error: 'Lección no encontrada' }, 404)
  
  const lessonIndex = course.lessons.findIndex((l: any) => l.id === lessonId)
  const prevLesson = lessonIndex > 0 ? course.lessons[lessonIndex - 1] : null
  const nextLesson = lessonIndex < course.lessons.length - 1 ? course.lessons[lessonIndex + 1] : null
  
  return c.json({
    ...lesson,
    courseId,
    courseTitle: course.title,
    totalLessons: course.lessons.length,
    currentLessonNumber: lessonIndex + 1,
    prevLesson: prevLesson ? { id: prevLesson.id, title: prevLesson.title } : null,
    nextLesson: nextLesson ? { id: nextLesson.id, title: nextLesson.title } : null
  })
})

app.post('/api/courses/:id/enroll', async (c) => {
  const courseId = c.req.param('id')
  const { userId } = await c.req.json()
  
  const course = dataStore.courses.find(c => c.id === courseId)
  if (!course) return c.json({ success: false, error: 'Curso no encontrado' }, 404)
  if (course.locked) return c.json({ success: false, error: 'Curso bloqueado' }, 403)
  
  let userProgress = dataStore.userProgress.get(userId)
  if (!userProgress) {
    userProgress = {}
    dataStore.userProgress.set(userId, userProgress)
  }
  
  userProgress[courseId] = { enrolled: true, completedLessons: [], enrolledAt: new Date().toISOString() }
  
  // Add to enrolled students
  if (!course.enrolledStudents) course.enrolledStudents = []
  if (!course.enrolledStudents.includes(userId)) {
    course.enrolledStudents.push(userId)
  }
  
  const member = dataStore.members.find(m => m.id === userId)
  if (member) member.points += 10
  
  return c.json({ success: true })
})

app.post('/api/courses/:courseId/lessons/:lessonId/complete', async (c) => {
  const { courseId, lessonId } = c.req.param()
  const { userId } = await c.req.json()
  
  let userProgress = dataStore.userProgress.get(userId)
  if (!userProgress?.[courseId]) return c.json({ success: false, error: 'No inscrito en el curso' }, 403)
  
  if (!userProgress[courseId].completedLessons.includes(lessonId)) {
    userProgress[courseId].completedLessons.push(lessonId)
    
    const member = dataStore.members.find(m => m.id === userId)
    if (member) {
      member.points += 5
      
      const course = dataStore.courses.find(c => c.id === courseId)
      if (course && userProgress[courseId].completedLessons.length === course.lessons.length) {
        member.points += 50
        // Add notification for course completion
        const notifications = dataStore.notifications.get(userId) || []
        notifications.unshift({
          id: generateId(),
          type: 'achievement',
          message: `🎉 ¡Felicidades! Has completado el curso "${course.title}"`,
          read: false,
          createdAt: new Date().toISOString()
        })
        dataStore.notifications.set(userId, notifications)
      }
    }
  }
  
  return c.json({ success: true, completedLessons: userProgress[courseId].completedLessons })
})

// Teacher: Create Course
app.post('/api/courses', async (c) => {
  const body = await c.req.json()
  const { title, description, category, duration, lessons, teacherId, image } = body
  
  const teacher = dataStore.members.find(m => m.id === teacherId && m.role === 'teacher')
  if (!teacher) return c.json({ success: false, error: 'Solo los maestros pueden crear cursos' }, 403)
  
  const course = {
    id: generateId(),
    title,
    description,
    image: image || 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=400&h=250&fit=crop',
    category: category || 'general',
    level: 1,
    duration: duration || '4 semanas',
    progress: 0,
    lessons: lessons || [],
    locked: false,
    teacherId,
    teacher: teacher.name,
    enrolledStudents: []
  }
  
  dataStore.courses.push(course)
  
  return c.json({ success: true, course })
})

// Teacher: Update Course
app.put('/api/courses/:id', async (c) => {
  const courseId = c.req.param('id')
  const updates = await c.req.json()
  
  const courseIndex = dataStore.courses.findIndex(c => c.id === courseId)
  if (courseIndex === -1) return c.json({ error: 'Curso no encontrado' }, 404)
  
  // Verify teacher owns the course
  if (dataStore.courses[courseIndex].teacherId !== updates.teacherId) {
    return c.json({ error: 'No autorizado' }, 403)
  }
  
  dataStore.courses[courseIndex] = { ...dataStore.courses[courseIndex], ...updates }
  
  return c.json({ success: true, course: dataStore.courses[courseIndex] })
})

// Teacher: Add Lesson to Course
app.post('/api/courses/:id/lessons', async (c) => {
  const courseId = c.req.param('id')
  const { lesson, teacherId } = await c.req.json()
  
  const course = dataStore.courses.find(c => c.id === courseId)
  if (!course) return c.json({ error: 'Curso no encontrado' }, 404)
  if (course.teacherId !== teacherId) return c.json({ error: 'No autorizado' }, 403)
  
  const newLesson = {
    id: generateId(),
    ...lesson,
    order: course.lessons.length + 1
  }
  
  course.lessons.push(newLesson)
  
  return c.json({ success: true, lesson: newLesson })
})

// Teacher: Get Students
app.get('/api/teacher/:teacherId/students', async (c) => {
  const teacherId = c.req.param('teacherId')
  
  const teacher = dataStore.members.find(m => m.id === teacherId && m.role === 'teacher')
  if (!teacher) return c.json({ error: 'Maestro no encontrado' }, 404)
  
  const students = dataStore.members.filter(m => m.role === 'student' && m.teacherId === teacherId)
  
  // Get course progress for each student
  const studentsWithProgress = students.map(student => {
    const progress = dataStore.userProgress.get(student.id) || {}
    const enrolledCourses = dataStore.courses.filter(c => 
      c.teacherId === teacherId && c.enrolledStudents?.includes(student.id)
    ).map(c => {
      const courseProgress = progress[c.id] || { completedLessons: [] }
      return {
        id: c.id,
        title: c.title,
        progress: c.lessons.length > 0 
          ? Math.round((courseProgress.completedLessons.length / c.lessons.length) * 100) 
          : 0
      }
    })
    
    return {
      ...student,
      enrolledCourses
    }
  })
  
  return c.json(studentsWithProgress)
})

// Teacher: Add Student
app.post('/api/teacher/:teacherId/students', async (c) => {
  const teacherId = c.req.param('teacherId')
  const { email, name, avatar } = await c.req.json()
  
  const teacher = dataStore.members.find(m => m.id === teacherId && m.role === 'teacher')
  if (!teacher) return c.json({ error: 'Maestro no encontrado' }, 404)
  
  // Check if student already exists
  let student = dataStore.members.find(m => m.email === email)
  
  if (student) {
    // Update existing student's teacher
    student.teacherId = teacherId
    if (!teacher.students) teacher.students = []
    if (!teacher.students.includes(student.id)) teacher.students.push(student.id)
    return c.json({ success: true, student, isNew: false })
  }
  
  // Create new student
  const studentId = generateId()
  student = {
    id: studentId,
    name: name || 'Nuevo Alumno',
    email,
    role: 'student',
    level: 1,
    points: 50,
    online: false,
    avatar: avatar || '🙏',
    location: 'Mundo',
    bio: 'Nuevo estudiante',
    teacherId
  }
  
  dataStore.members.push(student)
  dataStore.users.set(studentId, { ...student, password: 'luz123' })
  
  if (!teacher.students) teacher.students = []
  teacher.students.push(studentId)
  
  // Notify student
  dataStore.notifications.set(studentId, [
    { id: generateId(), type: 'enrollment', message: `¡${teacher.name} te ha agregado como estudiante! Bienvenido a la Academia de Luz.`, read: false, createdAt: new Date().toISOString() }
  ])
  
  return c.json({ success: true, student, isNew: true })
})

// Teacher: Remove Student
app.delete('/api/teacher/:teacherId/students/:studentId', async (c) => {
  const { teacherId, studentId } = c.req.param()
  
  const teacher = dataStore.members.find(m => m.id === teacherId && m.role === 'teacher')
  if (!teacher) return c.json({ error: 'Maestro no encontrado' }, 404)
  
  const student = dataStore.members.find(m => m.id === studentId)
  if (!student) return c.json({ error: 'Estudiante no encontrado' }, 404)
  
  // Remove teacher assignment
  student.teacherId = null
  
  // Remove from teacher's students list
  if (teacher.students) {
    teacher.students = teacher.students.filter((id: string) => id !== studentId)
  }
  
  return c.json({ success: true })
})

// ============================================================
// AI COURSE CREATION SYSTEM
// ============================================================

// AI Course Creator - Generate course structure
app.post('/api/ai/create-course', async (c) => {
  const { teacherId, topic, description, level, duration, numLessons } = await c.req.json()
  
  const teacher = dataStore.members.find(m => m.id === teacherId && m.role === 'teacher')
  if (!teacher) return c.json({ error: 'Solo los maestros pueden crear cursos' }, 403)
  
  // Generate comprehensive course structure
  const generatedCourse = generateAdvancedCourseStructure(topic, description, teacher.name, level || 1, duration || '4 semanas', numLessons || 4)
  
  // Store as pending course for review
  const pendingId = generateId()
  dataStore.pendingCourses.set(pendingId, {
    ...generatedCourse,
    teacherId,
    status: 'pending',
    createdAt: new Date().toISOString()
  })
  
  return c.json({ 
    success: true, 
    pendingId,
    course: generatedCourse,
    message: 'Curso generado exitosamente. Revisa el contenido antes de publicar.'
  })
})

// AI: Confirm and publish course
app.post('/api/ai/publish-course/:pendingId', async (c) => {
  const pendingId = c.req.param('pendingId')
  const { modifications } = await c.req.json()
  
  const pendingCourse = dataStore.pendingCourses.get(pendingId)
  if (!pendingCourse) return c.json({ error: 'Curso pendiente no encontrado' }, 404)
  
  // Apply any modifications
  const finalCourse = {
    id: generateId(),
    ...pendingCourse,
    ...modifications,
    status: undefined,
    enrolledStudents: []
  }
  
  dataStore.courses.push(finalCourse)
  dataStore.pendingCourses.delete(pendingId)
  
  return c.json({ success: true, course: finalCourse })
})

// AI Chat for course creation assistance
app.post('/api/ai/chat', async (c) => {
  const { message, context, teacherId } = await c.req.json()
  
  // AI responses for course creation
  const response = generateAICourseAssistantResponse(message, context)
  
  return c.json({ response, timestamp: new Date().toISOString() })
})

// AI: Process uploaded file content
app.post('/api/ai/process-file', async (c) => {
  const { fileContent, fileName, fileType, teacherId, topic } = await c.req.json()
  
  const teacher = dataStore.members.find(m => m.id === teacherId && m.role === 'teacher')
  if (!teacher) return c.json({ error: 'Solo los maestros pueden procesar archivos' }, 403)
  
  // Process file content and convert to lessons
  const lessons = processFileToLessons(fileContent, fileName, fileType)
  
  // Generate course from processed content
  const course = {
    title: topic || `Curso de ${fileName.replace(/\.[^/.]+$/, '')}`,
    description: `Curso creado a partir del material "${fileName}"`,
    image: getCourseImage(topic || fileName),
    category: detectCategory(topic || fileName),
    level: 1,
    duration: `${Math.ceil(lessons.length * 1.5)} semanas`,
    lessons,
    teacher: teacher.name
  }
  
  const pendingId = generateId()
  dataStore.pendingCourses.set(pendingId, {
    ...course,
    teacherId,
    status: 'pending',
    createdAt: new Date().toISOString()
  })
  
  return c.json({ 
    success: true, 
    pendingId,
    course,
    lessonsGenerated: lessons.length,
    message: `Se generaron ${lessons.length} lecciones a partir del archivo.`
  })
})

// AI: Generate presentation/slides for a lesson
app.post('/api/ai/generate-presentation', async (c) => {
  const { lessonId, courseId, teacherId, topic, content } = await c.req.json()
  
  const teacher = dataStore.members.find(m => m.id === teacherId && m.role === 'teacher')
  if (!teacher) return c.json({ error: 'Solo los maestros pueden generar presentaciones' }, 403)
  
  // Generate slides from content
  const slides = generateSlidesFromContent(topic, content)
  
  return c.json({ 
    success: true, 
    slides,
    message: `Se generaron ${slides.length} slides para la presentación.`
  })
})

// AI: Update lesson with video URL
app.post('/api/courses/:courseId/lessons/:lessonId/video', async (c) => {
  const { courseId, lessonId } = c.req.param()
  const { videoUrl, teacherId } = await c.req.json()
  
  const course = dataStore.courses.find(c => c.id === courseId)
  if (!course) return c.json({ error: 'Curso no encontrado' }, 404)
  if (course.teacherId !== teacherId) return c.json({ error: 'No autorizado' }, 403)
  
  const lesson = course.lessons?.find((l: any) => l.id === lessonId)
  if (!lesson) return c.json({ error: 'Lección no encontrada' }, 404)
  
  // Extract YouTube embed URL
  const embedUrl = convertToYouTubeEmbed(videoUrl)
  lesson.videoUrl = embedUrl
  lesson.type = 'video'
  
  // Update lesson content to include video
  if (!lesson.content.includes('video-container')) {
    lesson.content = `<div class="video-container mb-6">
  <iframe src="${embedUrl}" frameborder="0" allowfullscreen class="w-full aspect-video rounded-lg"></iframe>
</div>
${lesson.content}`
  }
  
  return c.json({ success: true, lesson })
})

// AI: Update lesson content
app.put('/api/courses/:courseId/lessons/:lessonId', async (c) => {
  const { courseId, lessonId } = c.req.param()
  const { title, content, type, duration, videoUrl, slides, teacherId } = await c.req.json()
  
  const course = dataStore.courses.find(c => c.id === courseId)
  if (!course) return c.json({ error: 'Curso no encontrado' }, 404)
  if (course.teacherId !== teacherId) return c.json({ error: 'No autorizado' }, 403)
  
  const lessonIndex = course.lessons?.findIndex((l: any) => l.id === lessonId)
  if (lessonIndex === -1 || lessonIndex === undefined) return c.json({ error: 'Lección no encontrada' }, 404)
  
  course.lessons[lessonIndex] = {
    ...course.lessons[lessonIndex],
    title: title || course.lessons[lessonIndex].title,
    content: content || course.lessons[lessonIndex].content,
    type: type || course.lessons[lessonIndex].type,
    duration: duration || course.lessons[lessonIndex].duration,
    videoUrl: videoUrl !== undefined ? convertToYouTubeEmbed(videoUrl) : course.lessons[lessonIndex].videoUrl,
    slides: slides || course.lessons[lessonIndex].slides
  }
  
  return c.json({ success: true, lesson: course.lessons[lessonIndex] })
})

// AI: Delete lesson
app.delete('/api/courses/:courseId/lessons/:lessonId', async (c) => {
  const { courseId, lessonId } = c.req.param()
  const { teacherId } = await c.req.json()
  
  const course = dataStore.courses.find(c => c.id === courseId)
  if (!course) return c.json({ error: 'Curso no encontrado' }, 404)
  if (course.teacherId !== teacherId) return c.json({ error: 'No autorizado' }, 403)
  
  course.lessons = course.lessons?.filter((l: any) => l.id !== lessonId) || []
  
  // Reorder lessons
  course.lessons.forEach((l: any, i: number) => { l.order = i + 1 })
  
  return c.json({ success: true })
})

// Helper: Convert YouTube URL to embed format
function convertToYouTubeEmbed(url: string): string {
  if (!url) return ''
  if (url.includes('/embed/')) return url
  
  let videoId = ''
  
  // Handle youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/[?&]v=([^&]+)/)
  if (watchMatch) videoId = watchMatch[1]
  
  // Handle youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/)
  if (shortMatch) videoId = shortMatch[1]
  
  // Handle youtube.com/v/VIDEO_ID
  const vMatch = url.match(/youtube\.com\/v\/([^?&]+)/)
  if (vMatch) videoId = vMatch[1]
  
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`
  }
  
  return url
}

// Helper: Generate slides from content
function generateSlidesFromContent(topic: string, content: string): any[] {
  // Parse content and create slides
  const slides: any[] = []
  
  // Title slide
  slides.push({
    id: generateId(),
    type: 'title',
    title: topic,
    subtitle: 'Academia de Luz',
    background: 'gradient-cosmic'
  })
  
  // Extract sections from content
  const sections = content.split(/(?=<h[23]>)/gi).filter(s => s.trim())
  
  sections.forEach((section, index) => {
    const titleMatch = section.match(/<h[23]>(.+?)<\/h[23]>/i)
    const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '') : `Sección ${index + 1}`
    
    // Extract bullet points
    const listMatch = section.match(/<li>(.+?)<\/li>/gi)
    const points = listMatch ? listMatch.map(li => li.replace(/<[^>]*>/g, '').trim()).slice(0, 5) : []
    
    // Extract paragraph content
    const paraMatch = section.match(/<p>(.+?)<\/p>/gi)
    const paragraphs = paraMatch ? paraMatch.map(p => p.replace(/<[^>]*>/g, '').trim()).slice(0, 2) : []
    
    if (points.length > 0) {
      slides.push({
        id: generateId(),
        type: 'bullets',
        title: title,
        points: points,
        background: index % 2 === 0 ? 'gradient-purple' : 'gradient-pink'
      })
    } else if (paragraphs.length > 0) {
      slides.push({
        id: generateId(),
        type: 'text',
        title: title,
        content: paragraphs[0].substring(0, 200) + (paragraphs[0].length > 200 ? '...' : ''),
        background: index % 2 === 0 ? 'gradient-purple' : 'gradient-pink'
      })
    }
  })
  
  // Closing slide
  slides.push({
    id: generateId(),
    type: 'closing',
    title: '¡Gracias!',
    subtitle: `Continúa tu camino de luz`,
    background: 'gradient-golden'
  })
  
  return slides
}

// Helper function to generate advanced course structure
function generateAdvancedCourseStructure(topic: string, description: string, teacherName: string, level: number, duration: string, numLessons: number) {
  const topicLower = topic.toLowerCase()
  
  let category = 'general'
  let image = 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=400&h=250&fit=crop'
  let lessonTemplates: any[] = []
  
  // Determine category and get specialized templates
  if (topicLower.includes('tarot') || topicLower.includes('carta')) {
    category = 'tarot'
    image = 'https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?w=400&h=250&fit=crop'
    lessonTemplates = [
      { title: '🃏 Introducción al Tarot', type: 'video', content: generateTarotLessonContent('intro') },
      { title: '✨ Los Arcanos Mayores', type: 'lesson', content: generateTarotLessonContent('mayores') },
      { title: '🎴 Los Arcanos Menores', type: 'lesson', content: generateTarotLessonContent('menores') },
      { title: '🔮 Tiradas y Spreads', type: 'practice', content: generateTarotLessonContent('tiradas') },
      { title: '💫 Interpretación Intuitiva', type: 'lesson', content: generateTarotLessonContent('intuicion') },
      { title: '🌟 Práctica Avanzada', type: 'practice', content: generateTarotLessonContent('avanzado') }
    ]
  } else if (topicLower.includes('reiki') || topicLower.includes('energía') || topicLower.includes('sanación')) {
    category = 'reiki'
    image = 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=250&fit=crop'
    lessonTemplates = [
      { title: '🙏 Fundamentos del Reiki', type: 'video', content: generateReikiLessonContent('fundamentos') },
      { title: '✨ Los 5 Principios', type: 'lesson', content: generateReikiLessonContent('principios') },
      { title: '🤲 Posiciones de Manos', type: 'practice', content: generateReikiLessonContent('posiciones') },
      { title: '💫 Auto-sanación', type: 'practice', content: generateReikiLessonContent('autosanacion') },
      { title: '🌟 Sanación a Otros', type: 'lesson', content: generateReikiLessonContent('otros') },
      { title: '⚡ Técnicas Avanzadas', type: 'practice', content: generateReikiLessonContent('avanzado') }
    ]
  } else if (topicLower.includes('akash') || topicLower.includes('registro')) {
    category = 'registros-akashicos'
    image = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop'
    lessonTemplates = [
      { title: '📖 ¿Qué son los Registros?', type: 'video', content: generateAkashicLessonContent('intro') },
      { title: '🧘 Preparación Energética', type: 'lesson', content: generateAkashicLessonContent('preparacion') },
      { title: '🙏 La Oración de Apertura', type: 'lesson', content: generateAkashicLessonContent('oracion') },
      { title: '✨ Tu Primera Lectura', type: 'practice', content: generateAkashicLessonContent('lectura') },
      { title: '🔮 Preguntas Efectivas', type: 'lesson', content: generateAkashicLessonContent('preguntas') },
      { title: '💫 Lecturas para Otros', type: 'practice', content: generateAkashicLessonContent('otros') }
    ]
  } else if (topicLower.includes('medita') || topicLower.includes('chakra')) {
    category = 'meditacion'
    image = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=250&fit=crop'
    lessonTemplates = [
      { title: '🧘 Fundamentos de Meditación', type: 'video', content: generateMeditationLessonContent('fundamentos') },
      { title: '🌬️ Técnicas de Respiración', type: 'practice', content: generateMeditationLessonContent('respiracion') },
      { title: '🌈 Los 7 Chakras', type: 'lesson', content: generateMeditationLessonContent('chakras') },
      { title: '✨ Meditación Guiada', type: 'practice', content: generateMeditationLessonContent('guiada') },
      { title: '💫 Visualización Creativa', type: 'lesson', content: generateMeditationLessonContent('visualizacion') },
      { title: '🌟 Práctica Diaria', type: 'practice', content: generateMeditationLessonContent('diaria') }
    ]
  } else if (topicLower.includes('numerolog')) {
    category = 'numerologia'
    image = 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=400&h=250&fit=crop'
    lessonTemplates = [
      { title: '🔢 Introducción a la Numerología', type: 'video', content: generateGenericLessonContent('Numerología', 'introduccion') },
      { title: '✨ Los Números del 1 al 9', type: 'lesson', content: generateGenericLessonContent('Numerología', 'numeros') },
      { title: '💫 Número de Vida', type: 'lesson', content: generateGenericLessonContent('Numerología', 'vida') },
      { title: '🌟 Número de Expresión', type: 'practice', content: generateGenericLessonContent('Numerología', 'expresion') }
    ]
  } else {
    // Generic spiritual course
    lessonTemplates = [
      { title: `📚 Introducción a ${topic}`, type: 'video', content: generateGenericLessonContent(topic, 'introduccion') },
      { title: `✨ Conceptos Fundamentales`, type: 'lesson', content: generateGenericLessonContent(topic, 'fundamentos') },
      { title: `🙏 Práctica Inicial`, type: 'practice', content: generateGenericLessonContent(topic, 'practica') },
      { title: `💫 Técnicas Avanzadas`, type: 'lesson', content: generateGenericLessonContent(topic, 'avanzado') },
      { title: `🌟 Integración`, type: 'practice', content: generateGenericLessonContent(topic, 'integracion') }
    ]
  }
  
  // Select lessons based on numLessons parameter
  const selectedLessons = lessonTemplates.slice(0, Math.min(numLessons, lessonTemplates.length))
  
  const lessons = selectedLessons.map((template, index) => ({
    id: generateId(),
    title: template.title,
    type: template.type,
    content: template.content,
    duration: template.type === 'video' ? '45min' : template.type === 'practice' ? '60min' : '30min',
    order: index + 1,
    videoUrl: template.type === 'video' ? 'https://www.youtube.com/embed/ZbZSe6N_BXs' : undefined
  }))
  
  return {
    title: topic,
    description: description || `Curso completo de ${topic} para tu desarrollo espiritual. Aprende con ${teacherName} las técnicas y conocimientos esenciales.`,
    image,
    category,
    level,
    duration,
    lessons,
    teacher: teacherName
  }
}

// Specialized content generators
function generateTarotLessonContent(section: string): string {
  const contents: Record<string, string> = {
    intro: `<div class="video-container mb-6"><iframe src="https://www.youtube.com/embed/ZbZSe6N_BXs" frameborder="0" allowfullscreen class="w-full aspect-video rounded-lg"></iframe></div>
<h2>🃏 INTRODUCCIÓN AL TAROT</h2>
<p>El Tarot es un antiguo sistema de sabiduría que utiliza 78 cartas para conectar con el inconsciente y recibir guía espiritual.</p>
<h3>📜 Historia y Orígenes</h3>
<p>El Tarot tiene sus raíces en el siglo XV en Europa, aunque su simbolismo conecta con tradiciones mucho más antiguas...</p>
<h3>🎯 Estructura del Mazo</h3>
<ul><li><strong>22 Arcanos Mayores:</strong> El viaje del alma</li><li><strong>56 Arcanos Menores:</strong> La vida cotidiana</li></ul>`,
    mayores: `<h2>✨ LOS ARCANOS MAYORES</h2>
<p>Los 22 Arcanos Mayores representan el viaje arquetípico del alma, desde El Loco hasta El Mundo.</p>
<h3>El Viaje del Héroe</h3>
<ol><li><strong>El Loco (0):</strong> El inicio del viaje, inocencia, potencial</li><li><strong>El Mago (I):</strong> Voluntad, creatividad, manifestación</li><li><strong>La Sacerdotisa (II):</strong> Intuición, misterio, sabiduría interior</li></ol>
<div class="note-box"><p class="note-title">💡 CONSEJO</p><p>Estudia cada arcano mayor durante una semana completa antes de pasar al siguiente.</p></div>`,
    menores: `<h2>🎴 LOS ARCANOS MENORES</h2>
<p>Los 56 Arcanos Menores se dividen en cuatro palos, cada uno asociado a un elemento.</p>
<h3>Los Cuatro Palos</h3>
<ul><li>🔥 <strong>Bastos (Fuego):</strong> Creatividad, pasión, acción</li><li>💧 <strong>Copas (Agua):</strong> Emociones, amor, relaciones</li><li>💨 <strong>Espadas (Aire):</strong> Mente, conflictos, verdad</li><li>🌍 <strong>Oros (Tierra):</strong> Material, trabajo, abundancia</li></ul>`,
    tiradas: `<h2>🔮 TIRADAS Y SPREADS</h2>
<h3>Tirada de 3 Cartas</h3>
<ol><li><strong>Pasado:</strong> Lo que ha influido en la situación</li><li><strong>Presente:</strong> La energía actual</li><li><strong>Futuro:</strong> Hacia dónde se dirige</li></ol>
<h3>Cruz Celta</h3>
<p>La tirada más completa y tradicional con 10 posiciones...</p>
<div class="practice-box"><p class="practice-title">🎯 EJERCICIO</p><p>Practica la tirada de 3 cartas diariamente durante una semana.</p></div>`,
    intuicion: `<h2>💫 INTERPRETACIÓN INTUITIVA</h2>
<p>Más allá de los significados tradicionales, desarrolla tu conexión intuitiva con las cartas.</p>
<h3>Técnicas para Desarrollar la Intuición</h3>
<ul><li>Meditación diaria con una carta</li><li>Journaling de tus impresiones</li><li>Observación de colores, símbolos y sensaciones</li></ul>`,
    avanzado: `<h2>🌟 PRÁCTICA AVANZADA</h2>
<p>Técnicas avanzadas para profundizar tus lecturas.</p>
<h3>Lecturas Temáticas</h3>
<ul><li>Lecturas de amor y relaciones</li><li>Lecturas de carrera y propósito</li><li>Lecturas espirituales y de crecimiento</li></ul>`
  }
  return contents[section] || contents.intro
}

function generateReikiLessonContent(section: string): string {
  const contents: Record<string, string> = {
    fundamentos: `<div class="video-container mb-6"><iframe src="https://www.youtube.com/embed/inpok4MKVLM" frameborder="0" allowfullscreen class="w-full aspect-video rounded-lg"></iframe></div>
<h2>🙏 FUNDAMENTOS DEL REIKI</h2>
<p>Reiki es un sistema de sanación energética que utiliza la energía universal para promover el equilibrio y el bienestar.</p>
<h3>¿Qué es el Reiki?</h3>
<p><strong>REI</strong> = Energía Universal | <strong>KI</strong> = Fuerza Vital</p>
<p>El Reiki canaliza la energía universal a través del practicante hacia quien la recibe.</p>`,
    principios: `<h2>✨ LOS 5 PRINCIPIOS DEL REIKI</h2>
<div class="prayer-box"><p class="prayer-text">Solo por hoy, no te preocupes<br>Solo por hoy, no te enojes<br>Honra a tus padres, maestros y mayores<br>Gana tu vida honestamente<br>Muestra gratitud a todo ser viviente</p></div>
<p>Estos principios, establecidos por Mikao Usui, son la base ética y espiritual del Reiki.</p>`,
    posiciones: `<h2>🤲 POSICIONES DE MANOS</h2>
<h3>Las 12 Posiciones Tradicionales</h3>
<p>Aprende las posiciones básicas para auto-tratamiento:</p>
<ol><li>Corona de la cabeza</li><li>Ojos y tercer ojo</li><li>Sienes</li><li>Base del cráneo</li><li>Garganta</li><li>Corazón</li><li>Plexo solar</li><li>Ombligo</li><li>Bajo vientre</li><li>Rodillas</li><li>Tobillos</li><li>Plantas de los pies</li></ol>`,
    autosanacion: `<h2>💫 AUTO-SANACIÓN</h2>
<p>La práctica diaria de auto-Reiki es fundamental para tu desarrollo.</p>
<h3>Protocolo de Auto-tratamiento</h3>
<ol><li>Centrar y conectar con la energía</li><li>3-5 minutos en cada posición</li><li>Seguir el flujo intuitivo</li><li>Cerrar con gratitud</li></ol>
<div class="practice-box"><p class="practice-title">🎯 PRÁCTICA DIARIA</p><p>Dedica 21 días consecutivos a tu auto-tratamiento para establecer el hábito.</p></div>`,
    otros: `<h2>🌟 SANACIÓN A OTROS</h2>
<p>Una vez dominado el auto-tratamiento, puedes comenzar a practicar con otros.</p>
<h3>Preparación de la Sesión</h3>
<ul><li>Espacio limpio y tranquilo</li><li>Intención clara</li><li>Consentimiento del receptor</li><li>Protección energética</li></ul>`,
    avanzado: `<h2>⚡ TÉCNICAS AVANZADAS</h2>
<p>Técnicas complementarias para potenciar tu práctica.</p>
<ul><li>Byosen - Escaneo energético</li><li>Kenyoku - Limpieza áurica</li><li>Nentatsu - Técnica de deprogramación</li></ul>`
  }
  return contents[section] || contents.fundamentos
}

function generateAkashicLessonContent(section: string): string {
  const contents: Record<string, string> = {
    intro: `<div class="video-container mb-6"><iframe src="https://www.youtube.com/embed/ZbZSe6N_BXs" frameborder="0" allowfullscreen class="w-full aspect-video rounded-lg"></iframe></div>
<h2>📖 ¿QUÉ SON LOS REGISTROS AKÁSHICOS?</h2>
<p>Los Registros Akáshicos son la biblioteca cósmica donde se almacena toda la información de cada alma.</p>
<h3>La Biblioteca Universal</h3>
<p>Imagina una biblioteca infinita donde cada libro representa la historia completa de un alma...</p>`,
    preparacion: `<h2>🧘 PREPARACIÓN ENERGÉTICA</h2>
<p>Antes de acceder a los Registros, es esencial preparar tu campo energético.</p>
<h3>Pasos de Preparación</h3>
<ol><li>Limpieza del espacio físico</li><li>Meditación de centrado</li><li>Protección energética</li><li>Elevación de la vibración</li></ol>`,
    oracion: `<h2>🙏 LA ORACIÓN DE APERTURA</h2>
<div class="prayer-box"><p class="prayer-text">"Yo [tu nombre] solicito permiso para acceder a los Registros Akáshicos de mi alma.<br><br>Pido a los Señores, Maestros y Guardianes de los Registros que me guíen con amor, sabiduría y verdad.<br><br>Que así sea. Que así sea. Que así sea."</p></div>`,
    lectura: `<h2>✨ TU PRIMERA LECTURA</h2>
<p>Guía paso a paso para realizar tu primera lectura de Registros Akáshicos.</p>
<ol><li>Prepara 3-5 preguntas claras</li><li>Realiza la preparación energética</li><li>Recita la oración de apertura 3 veces</li><li>Espera la conexión (1-3 minutos)</li><li>Formula tus preguntas</li><li>Anota todo lo que recibas</li><li>Cierra con gratitud</li></ol>`,
    preguntas: `<h2>🔮 PREGUNTAS EFECTIVAS</h2>
<h3>Ejemplos de Buenas Preguntas</h3>
<ul><li>"¿Cuál es mi propósito de vida?"</li><li>"¿Qué lección estoy aprendiendo?"</li><li>"¿Qué necesito saber sobre...?"</li><li>"¿Cómo puedo sanar...?"</li></ul>
<h3>Preguntas a Evitar</h3>
<ul><li>Preguntas de sí/no</li><li>Predicciones de fechas exactas</li><li>Preguntas sobre terceros sin permiso</li></ul>`,
    otros: `<h2>💫 LECTURAS PARA OTROS</h2>
<p>Una vez que domines tus propias lecturas, puedes comenzar a leer para otros.</p>
<h3>Protocolo Ético</h3>
<ul><li>Siempre pedir permiso del alma</li><li>Mantener confidencialidad</li><li>No dar consejos médicos o legales</li><li>Empoderar, nunca crear dependencia</li></ul>`
  }
  return contents[section] || contents.intro
}

function generateMeditationLessonContent(section: string): string {
  const contents: Record<string, string> = {
    fundamentos: `<div class="video-container mb-6"><iframe src="https://www.youtube.com/embed/inpok4MKVLM" frameborder="0" allowfullscreen class="w-full aspect-video rounded-lg"></iframe></div>
<h2>🧘 FUNDAMENTOS DE LA MEDITACIÓN</h2>
<p>La meditación es la práctica de entrenar la mente para lograr claridad, calma y conexión interior.</p>
<h3>Beneficios de la Meditación</h3>
<ul><li>Reducción del estrés</li><li>Mayor claridad mental</li><li>Conexión espiritual</li><li>Mejor salud física</li></ul>`,
    respiracion: `<h2>🌬️ TÉCNICAS DE RESPIRACIÓN</h2>
<h3>Pranayama Básico</h3>
<p>La respiración es la puerta de entrada a la meditación.</p>
<ol><li><strong>Respiración 4-7-8:</strong> Inhala 4, retén 7, exhala 8</li><li><strong>Respiración cuadrada:</strong> 4-4-4-4</li><li><strong>Nadi Shodhana:</strong> Respiración alterna</li></ol>`,
    chakras: `<h2>🌈 LOS 7 CHAKRAS</h2>
<ol><li>🔴 <strong>Raíz (Muladhara):</strong> Seguridad, supervivencia</li><li>🟠 <strong>Sacro (Svadhisthana):</strong> Creatividad, emociones</li><li>🟡 <strong>Plexo Solar (Manipura):</strong> Poder personal</li><li>💚 <strong>Corazón (Anahata):</strong> Amor, compasión</li><li>🔵 <strong>Garganta (Vishuddha):</strong> Comunicación, verdad</li><li>💜 <strong>Tercer Ojo (Ajna):</strong> Intuición, visión</li><li>⚪ <strong>Corona (Sahasrara):</strong> Conexión divina</li></ol>`,
    guiada: `<h2>✨ MEDITACIÓN GUIADA</h2>
<p>Sigue esta meditación de 10 minutos:</p>
<ol><li>Siéntate cómodamente</li><li>Cierra los ojos</li><li>Respira profundo 3 veces</li><li>Visualiza luz dorada entrando por tu coronilla</li><li>Siente la luz llenando cada célula</li><li>Permanece en este estado de paz</li><li>Regresa gradualmente</li></ol>`,
    visualizacion: `<h2>💫 VISUALIZACIÓN CREATIVA</h2>
<p>La visualización es una herramienta poderosa para manifestar y sanar.</p>
<h3>Técnicas de Visualización</h3>
<ul><li>Visualización de sanación</li><li>Visualización de metas</li><li>Visualización de protección</li></ul>`,
    diaria: `<h2>🌟 PRÁCTICA DIARIA</h2>
<p>Establece una rutina de meditación diaria.</p>
<h3>Rutina Sugerida</h3>
<ul><li><strong>Mañana:</strong> 10 min de intención del día</li><li><strong>Mediodía:</strong> 5 min de reconexión</li><li><strong>Noche:</strong> 10 min de gratitud y liberación</li></ul>`
  }
  return contents[section] || contents.fundamentos
}

function generateGenericLessonContent(topic: string, section: string): string {
  return `<h2>✨ ${topic.toUpperCase()} - ${section.toUpperCase()}</h2>
<p>Bienvenido a esta lección sobre ${topic}.</p>

<h3>📋 Objetivos de la Lección</h3>
<ul>
<li>Comprender los conceptos fundamentales de ${topic}</li>
<li>Desarrollar habilidades prácticas</li>
<li>Integrar el conocimiento en tu vida diaria</li>
</ul>

<h3>📖 Contenido Principal</h3>
<p>En esta lección exploraremos los aspectos más importantes de ${topic}, proporcionándote las herramientas necesarias para tu desarrollo espiritual.</p>

<div class="note-box">
<p class="note-title">💡 CONSEJO IMPORTANTE</p>
<p>Practica diariamente lo aprendido para mejores resultados. La constancia es clave en el camino espiritual.</p>
</div>

<h3>🎯 Ejercicio Práctico</h3>
<ol>
<li>Lee todo el contenido con atención plena</li>
<li>Toma notas de los puntos que más resuenen contigo</li>
<li>Realiza los ejercicios propuestos</li>
<li>Reflexiona sobre tu experiencia</li>
</ol>

<div class="practice-box">
<p class="practice-title">🌟 PRÁCTICA SUGERIDA</p>
<p>Dedica al menos 15 minutos diarios a practicar lo aprendido en esta lección.</p>
</div>`
}

function processFileToLessons(content: string, fileName: string, fileType: string): any[] {
  // Split content into sections based on headers or page breaks
  const sections = content.split(/\n(?=#{1,3}\s)|(?:\r?\n){3,}/).filter(s => s.trim().length > 100)
  
  return sections.map((section, index) => {
    const lines = section.trim().split('\n')
    let title = lines[0]?.replace(/^#+\s*/, '').trim() || `Lección ${index + 1}`
    
    // Clean up title
    if (title.length > 50) title = title.substring(0, 47) + '...'
    
    // Format content as HTML
    const formattedContent = formatContentAsLesson(section, title)
    
    return {
      id: generateId(),
      title: `${getEmojiForIndex(index)} ${title}`,
      type: index === 0 ? 'video' : index % 3 === 0 ? 'practice' : 'lesson',
      content: formattedContent,
      duration: `${30 + (index * 10)}min`,
      order: index + 1
    }
  }).slice(0, 10) // Max 10 lessons
}

function formatContentAsLesson(content: string, title: string): string {
  let formatted = content
    .replace(/^#\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^##\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^###\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^\*\s+(.+)$/gm, '<li>$1</li>')
    .replace(/^-\s+(.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
  
  // Wrap consecutive list items in ul
  formatted = formatted.replace(/(<li>.+<\/li>\s*)+/g, '<ul>$&</ul>')
  
  return `<h2>✨ ${title}</h2><p>${formatted}</p>`
}

function getEmojiForIndex(index: number): string {
  const emojis = ['📖', '✨', '🙏', '💫', '🌟', '🔮', '💎', '🌈', '⚡', '🎯']
  return emojis[index % emojis.length]
}

function getCourseImage(topic: string): string {
  const topicLower = topic.toLowerCase()
  if (topicLower.includes('tarot')) return 'https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?w=400&h=250&fit=crop'
  if (topicLower.includes('reiki')) return 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=250&fit=crop'
  if (topicLower.includes('akash') || topicLower.includes('registro')) return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop'
  if (topicLower.includes('medita')) return 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=250&fit=crop'
  if (topicLower.includes('numerol')) return 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=400&h=250&fit=crop'
  return 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=400&h=250&fit=crop'
}

function detectCategory(topic: string): string {
  const topicLower = topic.toLowerCase()
  if (topicLower.includes('tarot')) return 'tarot'
  if (topicLower.includes('reiki')) return 'reiki'
  if (topicLower.includes('akash') || topicLower.includes('registro')) return 'registros-akashicos'
  if (topicLower.includes('medita') || topicLower.includes('chakra')) return 'meditacion'
  if (topicLower.includes('numerol')) return 'numerologia'
  if (topicLower.includes('radiest')) return 'radiestesia'
  if (topicLower.includes('radion')) return 'radionica'
  return 'general'
}

function generateAICourseAssistantResponse(message: string, context: any): string {
  const msgLower = message.toLowerCase()
  
  if (msgLower.includes('crear') && msgLower.includes('curso')) {
    return `¡Excelente! Te ayudaré a crear un curso profesional. 🎓

**Para generar tu curso necesito:**
1. 📝 **Tema del curso** - ¿Sobre qué será?
2. 📊 **Nivel** - Principiante, intermedio o avanzado
3. ⏱️ **Duración** - ¿Cuántas semanas?
4. 📚 **Número de lecciones** - Recomiendo 4-8

**También puedes:**
- 📄 Subir un archivo (Word, PDF, PowerPoint) y lo convertiré en lecciones estructuradas
- ✏️ Escribirme el contenido y lo formateo profesionalmente

¿Cómo prefieres empezar?`
  }
  
  if (msgLower.includes('lección') || msgLower.includes('leccion')) {
    return `Para crear lecciones efectivas, usa esta estructura: 📖

**Estructura Ideal:**
1. 🎬 **Video introductorio** (si tienes)
2. 📝 **Contenido teórico** con subtítulos claros
3. 💡 **Notas importantes** (cajas destacadas)
4. 🎯 **Ejercicio práctico** al final
5. ⏱️ **Duración:** 30-90 min por lección

**Tipos de lección:**
- 🎬 **Video** - Con video embebido
- 📖 **Lesson** - Contenido teórico
- 🎯 **Practice** - Ejercicios prácticos

¿Quieres que te ayude a estructurar una lección específica?`
  }
  
  if (msgLower.includes('alumno') || msgLower.includes('estudiante')) {
    return `Para gestionar alumnos puedes: 👥

**Agregar alumnos:**
- Por email: se les envía invitación automática
- Manualmente: creas su cuenta con contraseña temporal

**Seguimiento:**
- Ver progreso en cada curso
- Lecciones completadas
- Puntos y nivel alcanzado
- Tiempo de actividad

**Comunicación:**
- Anuncios en la comunidad
- Crear eventos para tus estudiantes
- Notificaciones automáticas

¿Qué deseas hacer?`
  }
  
  if (msgLower.includes('archivo') || msgLower.includes('word') || msgLower.includes('powerpoint') || msgLower.includes('pdf')) {
    return `¡Perfecto! Puedo transformar tu material en un curso estructurado. 📄

**Formatos soportados:**
- 📝 Microsoft Word (.docx)
- 📊 PowerPoint (.pptx)  
- 📄 PDF (.pdf)
- 📋 Texto plano (.txt)

**El proceso:**
1. Sube tu archivo usando "Subir Material"
2. Analizo el contenido automáticamente
3. Genero lecciones con:
   - Títulos y subtítulos formateados
   - Contenido estructurado con HTML
   - Notas destacadas
   - Ejercicios prácticos

4. Revisas y editas antes de publicar

**¿Listo para subir tu material?**`
  }
  
  if (msgLower.includes('video')) {
    return `Para agregar videos a tus lecciones: 🎬

**Videos de YouTube:**
Solo necesitas el link de YouTube y lo embebo automáticamente en la lección.

**Estructura con video:**
\`\`\`
1. Video introductorio (embebido)
2. Resumen del video
3. Contenido complementario
4. Ejercicio práctico
\`\`\`

**Tips:**
- Videos de 5-15 min son ideales
- Incluye siempre un resumen escrito
- Agrega ejercicios relacionados

¿Tienes un video de YouTube para agregar?`
  }
  
  // Default response
  return `Soy tu asistente para crear cursos en la Academia de Luz. 🎓✨

**Puedo ayudarte con:**

🎓 **Crear cursos:**
- Generar estructura completa desde un tema
- Transformar archivos (Word, PDF, PowerPoint) en lecciones
- Agregar videos de YouTube

👥 **Gestionar alumnos:**
- Agregar nuevos estudiantes
- Ver su progreso detallado
- Enviar comunicaciones

📚 **Mejorar contenido:**
- Formatear lecciones profesionalmente
- Crear ejercicios prácticos
- Organizar estructura del curso

**Comandos rápidos:**
- "Crear curso de [tema]"
- "Agregar lección sobre [tema]"
- "Subir archivo"
- "Ver mis alumnos"

¿En qué puedo ayudarte hoy?`
}

// Members
app.get('/api/members', async (c) => {
  const filter = c.req.query('filter')
  let members = dataStore.members
  
  if (filter === 'teachers') members = members.filter(m => m.role === 'teacher')
  else if (filter === 'online') members = members.filter(m => m.online)
  
  return c.json(members.map(m => {
    const levelInfo = calculateLevel(m.points)
    return { ...m, level: levelInfo.level, levelName: levelInfo.name }
  }))
})

app.get('/api/members/:id', async (c) => {
  const memberId = c.req.param('id')
  const member = dataStore.members.find(m => m.id === memberId)
  if (!member) return c.json({ error: 'Miembro no encontrado' }, 404)
  
  const levelInfo = calculateLevel(member.points)
  return c.json({ ...member, level: levelInfo.level, levelName: levelInfo.name, nextLevel: levelInfo.nextLevel })
})

app.put('/api/members/:id', async (c) => {
  const memberId = c.req.param('id')
  const updates = await c.req.json()
  
  const memberIndex = dataStore.members.findIndex(m => m.id === memberId)
  if (memberIndex === -1) return c.json({ error: 'Miembro no encontrado' }, 404)
  
  dataStore.members[memberIndex] = { ...dataStore.members[memberIndex], ...updates }
  return c.json({ success: true, member: dataStore.members[memberIndex] })
})

// Events
app.get('/api/events', async (c) => {
  return c.json(dataStore.events)
})

app.post('/api/events/:id/join', async (c) => {
  const eventId = c.req.param('id')
  const { userId } = await c.req.json()
  
  const event = dataStore.events.find(e => e.id === eventId)
  if (!event) return c.json({ success: false, error: 'Evento no encontrado' }, 404)
  
  if (!event.attendees.includes(userId)) {
    event.attendees.push(userId)
    const member = dataStore.members.find(m => m.id === userId)
    if (member) member.points += 10
  }
  
  return c.json({ success: true, attendees: event.attendees.length })
})

app.post('/api/events', async (c) => {
  const body = await c.req.json()
  const { title, description, date, time, type, creatorId } = body
  
  const creator = dataStore.members.find(m => m.id === creatorId)
  if (!creator || creator.role !== 'teacher') {
    return c.json({ success: false, error: 'Solo los maestros pueden crear eventos' }, 403)
  }
  
  const event = {
    id: generateId(),
    title,
    description,
    date,
    time,
    type: type || 'class',
    color: type === 'meditation' ? 'purple' : type === 'ceremony' ? 'green' : type === 'workshop' ? 'indigo' : 'amber',
    attendees: [],
    creatorId
  }
  
  dataStore.events.push(event)
  return c.json({ success: true, event })
})

// Leaderboard
app.get('/api/leaderboard', async (c) => {
  const sortedMembers = [...dataStore.members].sort((a, b) => b.points - a.points)
  
  return c.json({
    weekly: sortedMembers.slice(0, 5).map((m, i) => ({ rank: i + 1, name: m.name, points: Math.floor(m.points * 0.1), avatar: m.avatar, id: m.id })),
    monthly: sortedMembers.slice(0, 5).map((m, i) => ({ rank: i + 1, name: m.name, points: Math.floor(m.points * 0.3), avatar: m.avatar, id: m.id })),
    allTime: sortedMembers.slice(0, 5).map((m, i) => ({ rank: i + 1, name: m.name, points: m.points, avatar: m.avatar, id: m.id })),
    levels: [
      { level: 1, name: 'Iniciado', percentage: 35, minPoints: 0 },
      { level: 2, name: 'Buscador', percentage: 25, minPoints: 100 },
      { level: 3, name: 'Aprendiz', percentage: 18, minPoints: 300 },
      { level: 4, name: 'Practicante', percentage: 10, minPoints: 600 },
      { level: 5, name: 'Iluminado', percentage: 6, minPoints: 1000 },
      { level: 6, name: 'Sabio', percentage: 3, minPoints: 1500 },
      { level: 7, name: 'Guardián', percentage: 2, minPoints: 2200 },
      { level: 8, name: 'Maestro', percentage: 0.8, minPoints: 3000 },
      { level: 9, name: 'Ascendido', percentage: 0.2, minPoints: 4000 }
    ],
    totalMembers: dataStore.members.length
  })
})

// Guides
app.get('/api/guides', async (c) => {
  const forTeachers = c.req.query('forTeachers') === 'true'
  let guides = dataStore.guides
  
  if (forTeachers) {
    guides = guides.filter(g => g.forTeachers)
  } else {
    guides = guides.filter(g => !g.forTeachers)
  }
  
  return c.json(guides)
})

// Chat with AI Guide
app.post('/api/chat', async (c) => {
  const { message, guideId, userId, history } = await c.req.json()
  
  const guide = dataStore.guides.find(g => g.id === guideId)
  if (!guide) return c.json({ error: 'Guía no encontrado' }, 404)
  
  // Store chat history
  if (userId) {
    const userHistory = dataStore.chatHistory.get(userId) || []
    userHistory.push({ guideId, message, timestamp: new Date().toISOString(), isUser: true })
    dataStore.chatHistory.set(userId, userHistory)
  }
  
  // Generate contextual response based on guide and message
  const response = generateGuideResponse(guideId, message, history)
  
  // Store AI response
  if (userId) {
    const userHistory = dataStore.chatHistory.get(userId) || []
    userHistory.push({ guideId, message: response, timestamp: new Date().toISOString(), isUser: false })
    dataStore.chatHistory.set(userId, userHistory)
  }
  
  return c.json({ response, guide: guideId, guideName: guide.name, timestamp: new Date().toISOString() })
})

function generateGuideResponse(guideId: string, message: string, history: any[]): string {
  const msgLower = message.toLowerCase()
  
  const responses: Record<string, Record<string, string[]>> = {
    lumina: {
      default: [
        'Namaste, querido buscador de luz. Tu pregunta resuena con la sabiduría ancestral. La respuesta que buscas ya está dentro de ti, solo necesitas silenciar la mente para escucharla. 🙏',
        'La luz que buscas ya habita en tu interior. Permíteme iluminar tu camino con una reflexión: cada desafío es una oportunidad de crecimiento espiritual. ✨',
        'Tu alma ha elegido este momento para despertar. Escucha atentamente los mensajes que el universo te envía a través de las sincronías. 🌟'
      ],
      meditacion: ['Te recomiendo comenzar con 10 minutos de meditación diaria. Siéntate cómodamente, cierra los ojos y enfoca tu atención en la respiración. Con cada inhalación, visualiza luz dorada entrando en tu cuerpo. 🧘'],
      energia: ['Tu campo energético es único y precioso. Para mantenerlo equilibrado, visualiza luz dorada entrando por tu coronilla cada mañana y luz de la tierra subiendo por tus pies. ⚡'],
      proposito: ['Tu propósito de vida es único y sagrado. Reflexiona sobre lo que te hace sentir más vivo, aquello que harías aunque nadie te pagara. Ahí está la pista de tu misión. 🌟'],
      ayuda: ['Estoy aquí para guiarte en tu camino espiritual. Puedo ayudarte con meditación, energía, propósito de vida, y cualquier pregunta espiritual que tengas. ¿Qué te gustaría explorar? ✨']
    },
    akasha: {
      default: [
        'Los Registros Akáshicos revelan que tu alma ha transitado muchos senderos. Cada experiencia ha sido perfectamente diseñada para tu evolución. 📖',
        'En la biblioteca cósmica, tu historia brilla con luz propia. Has vivido vidas como sanador, maestro y buscador de verdad. 🌌',
        'Permíteme acceder a los registros de tu alma... Veo que estás en un momento de transición importante. Los Guardianes te apoyan en este proceso. ✨'
      ],
      vidas_pasadas: ['Tus vidas pasadas han dejado huellas en tu alma. La sanación viene al reconocer y liberar esos patrones. ¿Te gustaría explorar alguna vida específica? 🔮'],
      proposito: ['Tu propósito de vida está escrito en los Registros. Siento que tu misión involucra ayudar a otros a encontrar su propia luz. Has sido guía espiritual en muchas encarnaciones. 📖'],
      karma: ['El karma no es castigo, es aprendizaje. Los Registros muestran que estás en proceso de equilibrar energías de vidas pasadas. La clave está en el perdón y la compasión. 🙏']
    },
    arcano: {
      default: [
        'Las cartas hablan de transformación en tu camino. El arcano que siento para ti hoy es La Estrella: esperanza y renovación espiritual. ⭐',
        'Los arcanos mayores señalan un momento de gran importancia espiritual. La Torre ha caído, pero de sus cenizas surge una nueva versión de ti. 🗼',
        'Tu energía está alineada con el mensaje del universo. El Mago te recuerda que tienes todos los elementos necesarios para crear tu realidad. 🎭'
      ],
      amor: ['En temas del corazón, los arcanos muestran una energía de renovación. Los Enamorados te invitan a tomar decisiones desde el amor, no desde el miedo. 💕'],
      trabajo: ['Para tu carrera, el arcano de La Rueda de la Fortuna indica que los ciclos están cambiando a tu favor. Es momento de tomar acción. ⚙️'],
      tirada: ['Te haré una tirada de 3 cartas... Pasado: El Ermitaño (reflexión necesaria). Presente: La Fuerza (momento de actuar con coraje). Futuro: El Sol (éxito y claridad). 🔮']
    },
    sanador: {
      default: [
        'Siento un bloqueo en tu chakra del corazón. Coloca tu mano derecha sobre el pecho y visualiza luz verde esmeralda sanando esa área. 💚',
        'La energía universal fluye a través de ti. Respira profundo tres veces y siente la energía de sanación entrando por tu coronilla. 🌟',
        'Tu campo energético muestra áreas que necesitan atención amorosa. El primer paso hacia la sanación es el auto-perdón. 🙌'
      ],
      dolor: ['El dolor físico a menudo tiene raíces emocionales. Te guiaré en una técnica de sanación: visualiza luz dorada en el área afectada mientras repites "me permito sanar". 💫'],
      chakras: ['Tus chakras necesitan equilibrio. Comienza por el chakra raíz: visualiza luz roja en la base de tu columna. Respira y siente la conexión con la tierra. 🌈'],
      reiki: ['La energía Reiki está siempre disponible para ti. Coloca tus manos sobre tu corazón, establece la intención de sanación, y permite que la energía fluya. 🙏']
    }
  }
  
  // Detect topic from message
  let topic = 'default'
  if (msgLower.includes('medita') || msgLower.includes('respirar') || msgLower.includes('calma')) topic = 'meditacion'
  else if (msgLower.includes('energía') || msgLower.includes('energia') || msgLower.includes('aura')) topic = 'energia'
  else if (msgLower.includes('vida pasada') || msgLower.includes('vidas pasadas') || msgLower.includes('anterior')) topic = 'vidas_pasadas'
  else if (msgLower.includes('propósito') || msgLower.includes('proposito') || msgLower.includes('misión') || msgLower.includes('mision')) topic = 'proposito'
  else if (msgLower.includes('amor') || msgLower.includes('relación') || msgLower.includes('pareja')) topic = 'amor'
  else if (msgLower.includes('trabajo') || msgLower.includes('carrera') || msgLower.includes('profesión')) topic = 'trabajo'
  else if (msgLower.includes('tirada') || msgLower.includes('carta')) topic = 'tirada'
  else if (msgLower.includes('dolor') || msgLower.includes('enferm') || msgLower.includes('sanar')) topic = 'dolor'
  else if (msgLower.includes('chakra')) topic = 'chakras'
  else if (msgLower.includes('reiki') || msgLower.includes('sanación') || msgLower.includes('sanacion')) topic = 'reiki'
  else if (msgLower.includes('karma')) topic = 'karma'
  else if (msgLower.includes('ayuda') || msgLower.includes('puedes hacer')) topic = 'ayuda'
  
  const guideResponses = responses[guideId] || responses.lumina
  const topicResponses = guideResponses[topic] || guideResponses.default
  
  return topicResponses[Math.floor(Math.random() * topicResponses.length)]
}

// Notifications
app.get('/api/notifications/:userId', async (c) => {
  const userId = c.req.param('userId')
  return c.json(dataStore.notifications.get(userId) || [])
})

app.post('/api/notifications/:userId/read', async (c) => {
  const userId = c.req.param('userId')
  const notifications = dataStore.notifications.get(userId) || []
  notifications.forEach(n => n.read = true)
  return c.json({ success: true })
})

// Search
app.get('/api/search', async (c) => {
  const query = c.req.query('q')?.toLowerCase() || ''
  
  if (!query) return c.json({ posts: [], courses: [], members: [] })
  
  const posts = dataStore.posts.filter(p => 
    p.title.toLowerCase().includes(query) || p.content.toLowerCase().includes(query)
  ).slice(0, 5)
  
  const courses = dataStore.courses.filter(c => 
    c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query)
  ).slice(0, 5)
  
  const members = dataStore.members.filter(m => 
    m.name.toLowerCase().includes(query)
  ).slice(0, 5)
  
  return c.json({ posts, courses, members })
})

// Stats
app.get('/api/stats', async (c) => {
  return c.json({
    totalMembers: dataStore.members.length,
    onlineMembers: dataStore.members.filter(m => m.online).length,
    totalTeachers: dataStore.members.filter(m => m.role === 'teacher').length,
    totalCourses: dataStore.courses.length,
    totalPosts: dataStore.posts.length,
    totalEvents: dataStore.events.length,
    totalLessons: dataStore.courses.reduce((acc, c) => acc + (c.lessons?.length || 0), 0)
  })
})

// Chat history
app.get('/api/chat/history/:userId', async (c) => {
  const userId = c.req.param('userId')
  return c.json(dataStore.chatHistory.get(userId) || [])
})

// ============================================================
// SUPER AGENTE - SISTEMA DE CREACIÓN DE CLASES PROFESIONALES
// ============================================================

// Store for generated exams and presentations
const superAgentStore = {
  exams: new Map<string, any>(),
  presentations: new Map<string, any>(),
  lessonDrafts: new Map<string, any>()
}

// Types for Super Agent
interface ExamQuestion {
  id: string
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'matching' | 'short_answer' | 'essay'
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  points: number
  topic: string
}

interface Exam {
  id: string
  title: string
  description: string
  courseId?: string
  lessonId?: string
  questions: ExamQuestion[]
  totalPoints: number
  timeLimit: number // minutes
  passingScore: number // percentage
  createdAt: string
  teacherId: string
}

interface ProfessionalSlide {
  id: string
  type: 'title' | 'content' | 'two_column' | 'image_text' | 'bullets' | 'quote' | 'code' | 'diagram' | 'video' | 'quiz' | 'summary'
  title?: string
  subtitle?: string
  content?: string
  bullets?: string[]
  leftContent?: string
  rightContent?: string
  imageUrl?: string
  imagePosition?: 'left' | 'right' | 'center' | 'background'
  quote?: string
  quoteAuthor?: string
  code?: string
  codeLanguage?: string
  diagramCode?: string // Mermaid diagram
  videoUrl?: string
  quizQuestion?: string
  quizOptions?: string[]
  quizAnswer?: number
  background: string
  transition?: string
  notes?: string
  animations?: string[]
}

// SUPER AGENTE: Generar Lección Profesional Completa
app.post('/api/super-agent/generate-lesson', async (c) => {
  const { teacherId, topic, lessonType, duration, objectives, targetAudience, includeExercises, includeQuiz } = await c.req.json()
  
  const teacher = dataStore.members.find(m => m.id === teacherId && m.role === 'teacher')
  if (!teacher) return c.json({ error: 'Solo los maestros pueden usar el Super Agente' }, 403)
  
  // Generate professional lesson content
  const lesson = generateProfessionalLesson(topic, lessonType, duration, objectives, targetAudience, includeExercises, includeQuiz)
  
  // Store draft for review
  const draftId = generateId()
  superAgentStore.lessonDrafts.set(draftId, {
    ...lesson,
    teacherId,
    status: 'draft',
    createdAt: new Date().toISOString()
  })
  
  return c.json({
    success: true,
    draftId,
    lesson,
    message: 'Lección profesional generada. Revisa y personaliza antes de publicar.'
  })
})

// SUPER AGENTE: Generar Examen Profesional
app.post('/api/super-agent/generate-exam', async (c) => {
  const { 
    teacherId, 
    title,
    topic, 
    courseId, 
    lessonId,
    numQuestions, 
    questionTypes,
    difficulty,
    timeLimit,
    passingScore,
    includeExplanations
  } = await c.req.json()
  
  const teacher = dataStore.members.find(m => m.id === teacherId && m.role === 'teacher')
  if (!teacher) return c.json({ error: 'Solo los maestros pueden crear exámenes' }, 403)
  
  // Generate professional exam
  const exam = generateProfessionalExam(
    title || `Examen: ${topic}`,
    topic,
    numQuestions || 10,
    questionTypes || ['multiple_choice', 'true_false', 'fill_blank'],
    difficulty || 'medium',
    timeLimit || 30,
    passingScore || 70,
    includeExplanations !== false
  )
  
  exam.teacherId = teacherId
  exam.courseId = courseId
  exam.lessonId = lessonId
  
  // Store exam
  superAgentStore.exams.set(exam.id, exam)
  
  return c.json({
    success: true,
    exam,
    message: `Examen generado con ${exam.questions.length} preguntas profesionales.`
  })
})

// SUPER AGENTE: Generar Presentación Profesional con Reveal.js
app.post('/api/super-agent/generate-presentation', async (c) => {
  const { 
    teacherId, 
    topic, 
    content,
    lessonId,
    courseId,
    style,
    numSlides,
    includeAnimations,
    includeDiagrams,
    includeQuizSlides
  } = await c.req.json()
  
  const teacher = dataStore.members.find(m => m.id === teacherId && m.role === 'teacher')
  if (!teacher) return c.json({ error: 'Solo los maestros pueden generar presentaciones' }, 403)
  
  // Generate professional presentation
  const presentation = generateProfessionalPresentation(
    topic,
    content,
    style || 'spiritual',
    numSlides || 10,
    includeAnimations !== false,
    includeDiagrams !== false,
    includeQuizSlides !== false
  )
  
  const presentationId = generateId()
  const fullPresentation = {
    id: presentationId,
    ...presentation,
    teacherId,
    lessonId,
    courseId,
    createdAt: new Date().toISOString()
  }
  
  superAgentStore.presentations.set(presentationId, fullPresentation)
  
  return c.json({
    success: true,
    presentationId,
    presentation: fullPresentation,
    revealHtml: generateRevealJsHtml(fullPresentation),
    message: `Presentación generada con ${presentation.slides.length} slides profesionales.`
  })
})

// SUPER AGENTE: Obtener Examen
app.get('/api/super-agent/exams/:examId', async (c) => {
  const examId = c.req.param('examId')
  const exam = superAgentStore.exams.get(examId)
  
  if (!exam) return c.json({ error: 'Examen no encontrado' }, 404)
  return c.json(exam)
})

// SUPER AGENTE: Enviar Respuestas de Examen
app.post('/api/super-agent/exams/:examId/submit', async (c) => {
  const examId = c.req.param('examId')
  const { userId, answers } = await c.req.json()
  
  const exam = superAgentStore.exams.get(examId)
  if (!exam) return c.json({ error: 'Examen no encontrado' }, 404)
  
  // Grade the exam
  let correctCount = 0
  let totalPoints = 0
  let earnedPoints = 0
  const results: any[] = []
  
  exam.questions.forEach((q: ExamQuestion, index: number) => {
    const userAnswer = answers[index]
    const isCorrect = checkAnswer(q, userAnswer)
    
    totalPoints += q.points
    if (isCorrect) {
      correctCount++
      earnedPoints += q.points
    }
    
    results.push({
      questionId: q.id,
      question: q.question,
      userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      points: isCorrect ? q.points : 0,
      explanation: q.explanation
    })
  })
  
  const percentage = Math.round((earnedPoints / totalPoints) * 100)
  const passed = percentage >= exam.passingScore
  
  // Update user progress
  const member = dataStore.members.find(m => m.id === userId)
  if (member) {
    member.points += earnedPoints
    if (passed) {
      member.points += 25 // Bonus for passing
    }
  }
  
  return c.json({
    success: true,
    score: {
      correct: correctCount,
      total: exam.questions.length,
      earnedPoints,
      totalPoints,
      percentage,
      passed,
      passingScore: exam.passingScore
    },
    results,
    feedback: passed 
      ? '¡Felicidades! Has aprobado el examen. Tu conocimiento brilla con luz propia. ✨'
      : 'Continúa practicando. Cada intento es un paso más hacia la maestría. 🙏'
  })
})

// SUPER AGENTE: Obtener Presentación
app.get('/api/super-agent/presentations/:presentationId', async (c) => {
  const presentationId = c.req.param('presentationId')
  const presentation = superAgentStore.presentations.get(presentationId)
  
  if (!presentation) return c.json({ error: 'Presentación no encontrada' }, 404)
  return c.json({
    ...presentation,
    revealHtml: generateRevealJsHtml(presentation)
  })
})

// SUPER AGENTE: Listar exámenes de un curso
app.get('/api/super-agent/courses/:courseId/exams', async (c) => {
  const courseId = c.req.param('courseId')
  const exams = Array.from(superAgentStore.exams.values())
    .filter(e => e.courseId === courseId)
  
  return c.json(exams)
})

// Helper: Check if answer is correct
function checkAnswer(question: ExamQuestion, userAnswer: any): boolean {
  if (!userAnswer) return false
  
  switch (question.type) {
    case 'multiple_choice':
    case 'true_false':
      return userAnswer.toString().toLowerCase() === question.correctAnswer.toString().toLowerCase()
    case 'fill_blank':
      return userAnswer.toString().toLowerCase().trim() === question.correctAnswer.toString().toLowerCase().trim()
    case 'matching':
      if (Array.isArray(question.correctAnswer) && Array.isArray(userAnswer)) {
        return question.correctAnswer.every((ans, i) => ans === userAnswer[i])
      }
      return false
    case 'short_answer':
    case 'essay':
      // For short answers and essays, we'd need AI grading - for now accept if not empty
      return userAnswer.toString().trim().length > 10
    default:
      return false
  }
}

// Helper: Generate Professional Lesson Content
function generateProfessionalLesson(
  topic: string, 
  lessonType: string, 
  duration: string, 
  objectives: string[], 
  targetAudience: string,
  includeExercises: boolean,
  includeQuiz: boolean
): any {
  const topicLower = topic.toLowerCase()
  let category = detectCategory(topic)
  
  // Generate rich HTML content
  let content = `<div class="lesson-professional">
  
  <div class="learning-objectives">
    <h3>🎯 Objetivos de Aprendizaje</h3>
    <ul>
      ${(objectives || ['Comprender los fundamentos', 'Aplicar técnicas básicas', 'Desarrollar práctica personal']).map(obj => `<li>${obj}</li>`).join('\n      ')}
    </ul>
  </div>
  
  <h2>✨ ${topic}</h2>
  <p class="intro-text">Bienvenido a esta lección transformadora donde exploraremos los misterios y prácticas de ${topic}. Esta enseñanza está diseñada para ${targetAudience || 'buscadores espirituales de todos los niveles'}.</p>
  
  <div class="section-divider"></div>
  
  <h3>📖 Fundamentos Esenciales</h3>
  <p>Para comprender verdaderamente ${topic}, debemos primero establecer una base sólida de conocimiento. Los principios fundamentales que guiarán nuestro aprendizaje son:</p>
  
  <div class="key-concept-box">
    <h4>💡 Concepto Clave</h4>
    <p>El verdadero aprendizaje espiritual no es solo intelectual, sino experiencial. Cada práctica que compartimos está diseñada para ser vivida, no solo comprendida.</p>
  </div>
  
  <h3>🌟 Desarrollo del Tema</h3>
  <p>A medida que profundizamos en ${topic}, descubriremos capas de significado que enriquecerán nuestra práctica. Es importante mantener una mente abierta y un corazón receptivo.</p>
  
  <div class="two-column-layout">
    <div class="column">
      <h4>Aspectos Teóricos</h4>
      <ul>
        <li>Historia y orígenes</li>
        <li>Principios fundamentales</li>
        <li>Marco conceptual</li>
        <li>Conexiones con otras tradiciones</li>
      </ul>
    </div>
    <div class="column">
      <h4>Aspectos Prácticos</h4>
      <ul>
        <li>Técnicas básicas</li>
        <li>Ejercicios guiados</li>
        <li>Aplicación diaria</li>
        <li>Desarrollo progresivo</li>
      </ul>
    </div>
  </div>`

  if (includeExercises) {
    content += `
  
  <div class="practice-section">
    <h3>🎯 Ejercicio Práctico</h3>
    <div class="exercise-box">
      <h4>Ejercicio 1: Preparación y Centrado</h4>
      <ol>
        <li>Encuentra un espacio tranquilo donde no serás interrumpido</li>
        <li>Siéntate cómodamente con la columna recta</li>
        <li>Cierra los ojos y realiza 3 respiraciones profundas</li>
        <li>Establece tu intención para esta práctica</li>
        <li>Permanece en este estado receptivo por 5 minutos</li>
      </ol>
      <p class="exercise-note">⏱️ Tiempo estimado: 10 minutos</p>
    </div>
    
    <div class="exercise-box">
      <h4>Ejercicio 2: Aplicación del Conocimiento</h4>
      <ol>
        <li>Revisa los conceptos principales de esta lección</li>
        <li>Identifica cómo aplicarlos en tu vida diaria</li>
        <li>Escribe 3 formas concretas de integrar este aprendizaje</li>
        <li>Comparte tu reflexión en la comunidad</li>
      </ol>
      <p class="exercise-note">⏱️ Tiempo estimado: 15 minutos</p>
    </div>
  </div>`
  }

  if (includeQuiz) {
    content += `
  
  <div class="self-assessment">
    <h3>📝 Autoevaluación</h3>
    <p>Responde estas preguntas para verificar tu comprensión:</p>
    
    <div class="quiz-question">
      <p><strong>1.</strong> ¿Cuáles son los principios fundamentales de ${topic}?</p>
    </div>
    
    <div class="quiz-question">
      <p><strong>2.</strong> ¿Cómo aplicarías estos conceptos en tu práctica diaria?</p>
    </div>
    
    <div class="quiz-question">
      <p><strong>3.</strong> ¿Qué aspectos te gustaría profundizar más?</p>
    </div>
  </div>`
  }

  content += `
  
  <div class="summary-box">
    <h3>📋 Resumen de la Lección</h3>
    <ul>
      <li>Exploramos los fundamentos de ${topic}</li>
      <li>Aprendimos técnicas prácticas para aplicar en nuestra vida</li>
      <li>Desarrollamos una comprensión más profunda del tema</li>
    </ul>
  </div>
  
  <div class="next-steps">
    <h3>➡️ Próximos Pasos</h3>
    <p>Para continuar tu desarrollo:</p>
    <ol>
      <li>Practica los ejercicios diariamente durante una semana</li>
      <li>Lleva un diario de tus experiencias</li>
      <li>Comparte tus descubrimientos en la comunidad</li>
      <li>Avanza a la siguiente lección cuando te sientas preparado</li>
    </ol>
  </div>
  
  <div class="closing-blessing">
    <p>🙏 Que la luz guíe tu camino y que este conocimiento florezca en tu corazón.</p>
  </div>
  
</div>`

  return {
    title: `✨ ${topic}`,
    type: lessonType || 'lesson',
    content,
    duration: duration || '45min',
    objectives: objectives || ['Comprender los fundamentos', 'Aplicar técnicas básicas', 'Desarrollar práctica personal'],
    targetAudience: targetAudience || 'Todos los niveles',
    category,
    hasExercises: includeExercises,
    hasQuiz: includeQuiz
  }
}

// Helper: Generate Professional Exam
function generateProfessionalExam(
  title: string,
  topic: string,
  numQuestions: number,
  questionTypes: string[],
  difficulty: string,
  timeLimit: number,
  passingScore: number,
  includeExplanations: boolean
): Exam {
  const examId = generateId()
  const questions: ExamQuestion[] = []
  const topicLower = topic.toLowerCase()
  
  // Question templates based on topic
  const questionBank = getQuestionBankForTopic(topic)
  
  // Generate questions based on types requested
  let questionsPerType = Math.ceil(numQuestions / questionTypes.length)
  
  questionTypes.forEach(type => {
    const typeQuestions = questionBank
      .filter(q => q.type === type)
      .slice(0, questionsPerType)
    questions.push(...typeQuestions)
  })
  
  // Trim to exact number requested and assign IDs
  const finalQuestions = questions.slice(0, numQuestions).map((q, index) => ({
    ...q,
    id: `q-${examId}-${index}`,
    difficulty: difficulty as 'easy' | 'medium' | 'hard',
    points: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15,
    topic,
    explanation: includeExplanations ? q.explanation : ''
  }))
  
  return {
    id: examId,
    title,
    description: `Examen profesional sobre ${topic}. Este examen evaluará tu comprensión y dominio del tema.`,
    questions: finalQuestions,
    totalPoints: finalQuestions.reduce((sum, q) => sum + q.points, 0),
    timeLimit,
    passingScore,
    createdAt: new Date().toISOString(),
    teacherId: ''
  }
}

// Helper: Get question bank for topic
function getQuestionBankForTopic(topic: string): Partial<ExamQuestion>[] {
  const topicLower = topic.toLowerCase()
  
  // Generic spiritual questions that can apply to many topics
  const genericQuestions: Partial<ExamQuestion>[] = [
    // Multiple Choice
    {
      type: 'multiple_choice',
      question: `¿Cuál es el principio fundamental de ${topic}?`,
      options: ['La conexión con la energía universal', 'El control de la mente', 'La acumulación de conocimiento', 'La competencia espiritual'],
      correctAnswer: 'La conexión con la energía universal',
      explanation: `En ${topic}, el principio fundamental es establecer una conexión auténtica con la energía universal, permitiendo que fluya a través de nosotros para nuestro mayor bien.`
    },
    {
      type: 'multiple_choice',
      question: `¿Qué actitud es más importante al practicar ${topic}?`,
      options: ['Impaciencia por ver resultados', 'Mente abierta y corazón receptivo', 'Escepticismo constante', 'Expectativas altas'],
      correctAnswer: 'Mente abierta y corazón receptivo',
      explanation: 'Una mente abierta y un corazón receptivo son esenciales para cualquier práctica espiritual, permitiendo que la sabiduría fluya sin resistencia.'
    },
    {
      type: 'multiple_choice',
      question: `¿Cuánto tiempo se recomienda practicar ${topic} diariamente para ver resultados?`,
      options: ['5 segundos', 'Al menos 15-30 minutos', '8 horas continuas', 'Solo los fines de semana'],
      correctAnswer: 'Al menos 15-30 minutos',
      explanation: 'La práctica constante de 15-30 minutos diarios permite establecer una rutina que facilita el desarrollo espiritual sostenido.'
    },
    
    // True/False
    {
      type: 'true_false',
      question: `La práctica de ${topic} requiere años de estudio antes de poder experimentar beneficios.`,
      correctAnswer: 'Falso',
      explanation: 'Aunque la maestría requiere tiempo, los beneficios de la práctica pueden sentirse desde las primeras sesiones cuando se aborda con sinceridad y apertura.'
    },
    {
      type: 'true_false',
      question: `En ${topic}, la intención es más importante que la técnica perfecta.`,
      correctAnswer: 'Verdadero',
      explanation: 'La intención pura y sincera es el motor de toda práctica espiritual. La técnica se perfecciona con el tiempo, pero la intención debe estar presente desde el inicio.'
    },
    {
      type: 'true_false',
      question: `Es necesario tener "dones especiales" para practicar ${topic}.`,
      correctAnswer: 'Falso',
      explanation: 'Todas las personas tienen la capacidad innata de conectar con su espiritualidad. Los "dones" son simplemente habilidades que se desarrollan con la práctica constante.'
    },
    
    // Fill in the blank
    {
      type: 'fill_blank',
      question: `El primer paso antes de cualquier práctica espiritual es la _______ del espacio y de uno mismo.`,
      correctAnswer: 'preparación',
      explanation: 'La preparación adecuada del espacio físico y del estado mental es fundamental para una práctica efectiva.'
    },
    {
      type: 'fill_blank',
      question: `La _______ es esencial para mantener una práctica espiritual consistente.`,
      correctAnswer: 'disciplina',
      explanation: 'La disciplina, entendida como compromiso amoroso con la práctica, es lo que permite el crecimiento espiritual sostenido.'
    },
    
    // Short Answer
    {
      type: 'short_answer',
      question: `Describe en tus propias palabras qué significa ${topic} para ti y cómo lo aplicarías en tu vida diaria.`,
      correctAnswer: 'Respuesta personal del estudiante',
      explanation: 'Esta pregunta busca que el estudiante integre el conocimiento de manera personal y significativa.'
    },
    {
      type: 'short_answer',
      question: `¿Cuáles son los tres beneficios principales que esperas obtener de la práctica de ${topic}?`,
      correctAnswer: 'Respuesta personal del estudiante',
      explanation: 'Identificar beneficios personales ayuda a mantener la motivación y el compromiso con la práctica.'
    },
    
    // Matching (simplified format)
    {
      type: 'matching',
      question: `Relaciona los siguientes conceptos con sus definiciones correctas:
1. Energía Universal
2. Intención
3. Práctica diaria
4. Conexión espiritual`,
      options: ['A. Propósito claro al realizar una acción', 'B. Fuerza vital que anima todo el universo', 'C. Vínculo con lo trascendente', 'D. Ejercicio regular y constante'],
      correctAnswer: ['B', 'A', 'D', 'C'],
      explanation: 'Estos conceptos fundamentales son pilares de cualquier práctica espiritual y es importante comprenderlos claramente.'
    }
  ]
  
  // Add topic-specific questions
  if (topicLower.includes('tarot')) {
    genericQuestions.push(
      {
        type: 'multiple_choice',
        question: '¿Cuántos Arcanos Mayores tiene el Tarot?',
        options: ['21', '22', '56', '78'],
        correctAnswer: '22',
        explanation: 'El Tarot tiene 22 Arcanos Mayores que representan el viaje arquetípico del alma.'
      },
      {
        type: 'multiple_choice',
        question: '¿Qué elemento representa el palo de Copas?',
        options: ['Fuego', 'Tierra', 'Aire', 'Agua'],
        correctAnswer: 'Agua',
        explanation: 'Las Copas representan el elemento Agua, asociado con las emociones, el amor y las relaciones.'
      },
      {
        type: 'true_false',
        question: 'El Tarot puede predecir el futuro de forma absoluta y fija.',
        correctAnswer: 'Falso',
        explanation: 'El Tarot muestra potenciales y tendencias basadas en la energía actual, pero el futuro siempre puede cambiar con nuestras decisiones.'
      }
    )
  }
  
  if (topicLower.includes('reiki')) {
    genericQuestions.push(
      {
        type: 'multiple_choice',
        question: '¿Quién redescubrió el sistema Reiki moderno?',
        options: ['Buda Gautama', 'Mikao Usui', 'Jesus de Nazaret', 'Lao Tse'],
        correctAnswer: 'Mikao Usui',
        explanation: 'Mikao Usui redescubrió el Reiki en Japón a principios del siglo XX tras una experiencia mística en el Monte Kurama.'
      },
      {
        type: 'multiple_choice',
        question: '¿Cuántos principios del Reiki existen?',
        options: ['3', '5', '7', '10'],
        correctAnswer: '5',
        explanation: 'Los 5 principios del Reiki son guías éticas para vivir una vida plena y consciente.'
      },
      {
        type: 'fill_blank',
        question: 'REI significa energía _______ y KI significa fuerza _______.',
        correctAnswer: 'universal, vital',
        explanation: 'Reiki combina dos conceptos japoneses: REI (energía universal) y KI (fuerza vital personal).'
      }
    )
  }
  
  if (topicLower.includes('akash') || topicLower.includes('registro')) {
    genericQuestions.push(
      {
        type: 'multiple_choice',
        question: '¿De qué idioma proviene la palabra "Akasha"?',
        options: ['Latín', 'Griego', 'Sánscrito', 'Hebreo'],
        correctAnswer: 'Sánscrito',
        explanation: 'Akasha proviene del sánscrito y significa "éter" o "espacio", refiriéndose al elemento que contiene toda la información.'
      },
      {
        type: 'true_false',
        question: 'Los Registros Akáshicos contienen información solo de esta vida presente.',
        correctAnswer: 'Falso',
        explanation: 'Los Registros Akáshicos contienen información de todas las vidas del alma: pasadas, presente y potenciales futuros.'
      },
      {
        type: 'multiple_choice',
        question: '¿Qué se necesita para abrir los Registros Akáshicos?',
        options: ['Poderes sobrenaturales', 'Una oración sagrada e intención pura', 'Equipos especiales', 'Permiso gubernamental'],
        correctAnswer: 'Una oración sagrada e intención pura',
        explanation: 'El acceso a los Registros se logra mediante una oración de apertura recitada con intención pura y corazón abierto.'
      }
    )
  }
  
  if (topicLower.includes('medita') || topicLower.includes('chakra')) {
    genericQuestions.push(
      {
        type: 'multiple_choice',
        question: '¿Cuántos chakras principales tiene el cuerpo según la tradición hindú?',
        options: ['5', '7', '9', '12'],
        correctAnswer: '7',
        explanation: 'El sistema tradicional reconoce 7 chakras principales desde la base de la columna hasta la coronilla.'
      },
      {
        type: 'multiple_choice',
        question: '¿Qué color se asocia con el chakra del corazón?',
        options: ['Rojo', 'Amarillo', 'Verde', 'Violeta'],
        correctAnswer: 'Verde',
        explanation: 'El chakra del corazón (Anahata) se asocia con el color verde, representando el amor, la compasión y la sanación.'
      },
      {
        type: 'fill_blank',
        question: 'La meditación ayuda a calmar la _______ y conectar con nuestro ser interior.',
        correctAnswer: 'mente',
        explanation: 'Uno de los principales beneficios de la meditación es calmar la mente inquieta, permitiendo una conexión más profunda con nuestra esencia.'
      }
    )
  }
  
  return genericQuestions
}

// Helper: Generate Professional Presentation
function generateProfessionalPresentation(
  topic: string,
  content: string,
  style: string,
  numSlides: number,
  includeAnimations: boolean,
  includeDiagrams: boolean,
  includeQuizSlides: boolean
): { slides: ProfessionalSlide[], title: string, style: string } {
  const slides: ProfessionalSlide[] = []
  const backgrounds = getBackgroundsForStyle(style)
  
  // Title Slide
  slides.push({
    id: generateId(),
    type: 'title',
    title: topic,
    subtitle: 'Academia de Luz - Tu Escuela Espiritual',
    background: backgrounds.title,
    transition: 'zoom',
    animations: includeAnimations ? ['fadeIn', 'pulse'] : []
  })
  
  // Introduction Slide
  slides.push({
    id: generateId(),
    type: 'content',
    title: '🌟 Bienvenidos',
    content: `En esta sesión exploraremos los misterios de ${topic}. Prepara tu corazón y mente para recibir esta sabiduría ancestral.`,
    background: backgrounds.content,
    transition: 'slide',
    animations: includeAnimations ? ['fadeInUp'] : []
  })
  
  // Objectives Slide
  slides.push({
    id: generateId(),
    type: 'bullets',
    title: '🎯 Objetivos de la Sesión',
    bullets: [
      'Comprender los fundamentos de ' + topic,
      'Aprender técnicas prácticas aplicables',
      'Desarrollar tu conexión personal',
      'Integrar el conocimiento en tu vida diaria'
    ],
    background: backgrounds.bullets,
    transition: 'convex',
    animations: includeAnimations ? ['fadeInLeft', 'stagger'] : []
  })
  
  // Parse content for additional slides
  const sections = content ? content.split(/(?=<h[23]>)/gi).filter(s => s.trim()) : []
  
  sections.forEach((section, index) => {
    if (slides.length >= numSlides - 2) return // Leave room for quiz and closing
    
    const titleMatch = section.match(/<h[23]>(.+?)<\/h[23]>/i)
    const sectionTitle = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '') : `Sección ${index + 1}`
    
    // Extract bullet points
    const listMatch = section.match(/<li>(.+?)<\/li>/gi)
    const points = listMatch ? listMatch.map(li => li.replace(/<[^>]*>/g, '').trim()).slice(0, 5) : []
    
    // Extract paragraphs
    const paraMatch = section.match(/<p>(.+?)<\/p>/gi)
    const paragraphs = paraMatch ? paraMatch.map(p => p.replace(/<[^>]*>/g, '').trim()) : []
    
    if (points.length > 0) {
      slides.push({
        id: generateId(),
        type: 'bullets',
        title: sectionTitle,
        bullets: points,
        background: backgrounds.bullets,
        transition: index % 2 === 0 ? 'slide' : 'convex',
        animations: includeAnimations ? ['fadeInRight', 'stagger'] : []
      })
    } else if (paragraphs.length > 0) {
      slides.push({
        id: generateId(),
        type: 'content',
        title: sectionTitle,
        content: paragraphs[0].substring(0, 300) + (paragraphs[0].length > 300 ? '...' : ''),
        background: backgrounds.content,
        transition: 'fade',
        animations: includeAnimations ? ['fadeIn'] : []
      })
    }
  })
  
  // Add diagram slide if requested
  if (includeDiagrams && slides.length < numSlides - 1) {
    slides.push({
      id: generateId(),
      type: 'diagram',
      title: '📊 Visualización del Proceso',
      diagramCode: generateMermaidDiagram(topic),
      background: backgrounds.diagram,
      transition: 'zoom',
      notes: 'Este diagrama ilustra el flujo de energía y conocimiento en la práctica.'
    })
  }
  
  // Add quiz slide if requested
  if (includeQuizSlides && slides.length < numSlides - 1) {
    slides.push({
      id: generateId(),
      type: 'quiz',
      title: '🧠 Momento de Reflexión',
      quizQuestion: `¿Cuál es el principio más importante que has aprendido sobre ${topic}?`,
      quizOptions: [
        'La conexión con la energía universal',
        'La importancia de la práctica constante',
        'El desarrollo de la intuición',
        'Todas las anteriores'
      ],
      quizAnswer: 3,
      background: backgrounds.quiz,
      transition: 'concave'
    })
  }
  
  // Quote Slide
  slides.push({
    id: generateId(),
    type: 'quote',
    quote: 'La luz que buscas ya habita en tu interior. Solo necesitas recordar cómo brillar.',
    quoteAuthor: 'Sabiduría de la Academia de Luz',
    background: backgrounds.quote,
    transition: 'fade',
    animations: includeAnimations ? ['fadeIn', 'glow'] : []
  })
  
  // Summary Slide
  slides.push({
    id: generateId(),
    type: 'summary',
    title: '📋 Resumen',
    bullets: [
      'Hemos explorado los fundamentos de ' + topic,
      'Aprendimos técnicas prácticas aplicables',
      'Recuerda practicar diariamente',
      '¡Tu camino espiritual continúa!'
    ],
    background: backgrounds.summary,
    transition: 'slide',
    animations: includeAnimations ? ['fadeInUp', 'stagger'] : []
  })
  
  // Closing Slide
  slides.push({
    id: generateId(),
    type: 'title',
    title: '🙏 Namaste',
    subtitle: 'La luz en mí honra la luz en ti',
    background: backgrounds.closing,
    transition: 'zoom',
    animations: includeAnimations ? ['fadeIn', 'pulse'] : []
  })
  
  return {
    slides: slides.slice(0, numSlides),
    title: topic,
    style
  }
}

// Helper: Get backgrounds for style
function getBackgroundsForStyle(style: string): Record<string, string> {
  const styles: Record<string, Record<string, string>> = {
    spiritual: {
      title: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #1a0a2e 100%)',
      content: 'linear-gradient(135deg, #0f0a1e 0%, #1a0f2e 100%)',
      bullets: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)',
      diagram: 'linear-gradient(135deg, #0d0619 0%, #1a0a2e 100%)',
      quiz: 'linear-gradient(135deg, #2d1b4e 0%, #3d2b5e 100%)',
      quote: 'linear-gradient(135deg, #1a0a2e 0%, #0d0619 100%)',
      summary: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)',
      closing: 'linear-gradient(135deg, #2d1b4e 0%, #9333ea 50%, #ec4899 100%)'
    },
    modern: {
      title: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      content: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      bullets: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      diagram: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)',
      quiz: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      quote: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      summary: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      closing: 'linear-gradient(135deg, #0f172a 0%, #3b82f6 50%, #8b5cf6 100%)'
    },
    nature: {
      title: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
      content: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
      bullets: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
      diagram: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)',
      quiz: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
      quote: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
      summary: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
      closing: 'linear-gradient(135deg, #064e3b 0%, #10b981 50%, #34d399 100%)'
    }
  }
  
  return styles[style] || styles.spiritual
}

// Helper: Generate Mermaid diagram
function generateMermaidDiagram(topic: string): string {
  const topicLower = topic.toLowerCase()
  
  if (topicLower.includes('reiki')) {
    return `graph TB
    A[🙏 Conexión Universal] --> B[⚡ Canalización]
    B --> C[🤲 Posición de Manos]
    C --> D[💫 Flujo de Energía]
    D --> E[✨ Sanación]
    E --> F[🌟 Equilibrio]
    style A fill:#9333ea,color:#fff
    style F fill:#ec4899,color:#fff`
  }
  
  if (topicLower.includes('tarot')) {
    return `graph LR
    A[🃏 Preparación] --> B[🔮 Conexión]
    B --> C[✨ Pregunta]
    C --> D[🎴 Tirada]
    D --> E[📖 Interpretación]
    E --> F[💫 Guía]
    style A fill:#9333ea,color:#fff
    style F fill:#ec4899,color:#fff`
  }
  
  if (topicLower.includes('chakra') || topicLower.includes('medita')) {
    return `graph TB
    A[🔴 Raíz] --> B[🟠 Sacro]
    B --> C[🟡 Plexo Solar]
    C --> D[💚 Corazón]
    D --> E[🔵 Garganta]
    E --> F[💜 Tercer Ojo]
    F --> G[⚪ Corona]
    style A fill:#dc2626,color:#fff
    style G fill:#9333ea,color:#fff`
  }
  
  // Default spiritual journey diagram
  return `graph TB
    A[🌱 Iniciación] --> B[📚 Aprendizaje]
    B --> C[🧘 Práctica]
    C --> D[✨ Transformación]
    D --> E[🌟 Maestría]
    E --> F[🙏 Servicio]
    style A fill:#9333ea,color:#fff
    style F fill:#ec4899,color:#fff`
}

// Helper: Generate Reveal.js HTML
function generateRevealJsHtml(presentation: any): string {
  const slidesHtml = presentation.slides.map((slide: ProfessionalSlide) => {
    let slideContent = ''
    const bgStyle = `background: ${slide.background};`
    const transitionAttr = slide.transition ? `data-transition="${slide.transition}"` : ''
    
    switch (slide.type) {
      case 'title':
        slideContent = `
          <section ${transitionAttr} style="${bgStyle}">
            <h1 class="text-5xl font-bold mb-4 glow-text">${slide.title || ''}</h1>
            ${slide.subtitle ? `<h3 class="text-2xl text-purple-300">${slide.subtitle}</h3>` : ''}
          </section>`
        break
        
      case 'content':
        slideContent = `
          <section ${transitionAttr} style="${bgStyle}">
            <h2 class="text-4xl font-bold mb-6">${slide.title || ''}</h2>
            <p class="text-xl leading-relaxed max-w-3xl mx-auto">${slide.content || ''}</p>
          </section>`
        break
        
      case 'bullets':
        slideContent = `
          <section ${transitionAttr} style="${bgStyle}">
            <h2 class="text-4xl font-bold mb-6">${slide.title || ''}</h2>
            <ul class="text-left text-xl space-y-4 max-w-2xl mx-auto">
              ${(slide.bullets || []).map(b => `<li class="fragment fade-in-then-semi-out">${b}</li>`).join('\n              ')}
            </ul>
          </section>`
        break
        
      case 'two_column':
        slideContent = `
          <section ${transitionAttr} style="${bgStyle}">
            <h2 class="text-4xl font-bold mb-6">${slide.title || ''}</h2>
            <div class="flex gap-8">
              <div class="flex-1">${slide.leftContent || ''}</div>
              <div class="flex-1">${slide.rightContent || ''}</div>
            </div>
          </section>`
        break
        
      case 'quote':
        slideContent = `
          <section ${transitionAttr} style="${bgStyle}">
            <blockquote class="text-3xl italic text-purple-200 max-w-3xl mx-auto">
              "${slide.quote || ''}"
            </blockquote>
            ${slide.quoteAuthor ? `<p class="text-xl text-pink-300 mt-4">— ${slide.quoteAuthor}</p>` : ''}
          </section>`
        break
        
      case 'diagram':
        slideContent = `
          <section ${transitionAttr} style="${bgStyle}">
            <h2 class="text-4xl font-bold mb-6">${slide.title || ''}</h2>
            <div class="mermaid">
              ${slide.diagramCode || ''}
            </div>
          </section>`
        break
        
      case 'quiz':
        slideContent = `
          <section ${transitionAttr} style="${bgStyle}">
            <h2 class="text-4xl font-bold mb-6">${slide.title || ''}</h2>
            <p class="text-2xl mb-8">${slide.quizQuestion || ''}</p>
            <div class="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              ${(slide.quizOptions || []).map((opt, i) => `
                <button class="quiz-option p-4 rounded-lg bg-purple-900/50 hover:bg-purple-700/50 transition text-lg" data-answer="${i}">
                  ${String.fromCharCode(65 + i)}. ${opt}
                </button>
              `).join('')}
            </div>
          </section>`
        break
        
      case 'summary':
        slideContent = `
          <section ${transitionAttr} style="${bgStyle}">
            <h2 class="text-4xl font-bold mb-6">${slide.title || ''}</h2>
            <ul class="text-left text-xl space-y-3 max-w-2xl mx-auto">
              ${(slide.bullets || []).map(b => `<li class="fragment">${b}</li>`).join('\n              ')}
            </ul>
          </section>`
        break
        
      default:
        slideContent = `
          <section ${transitionAttr} style="${bgStyle}">
            <h2 class="text-4xl font-bold">${slide.title || ''}</h2>
            <p class="text-xl">${slide.content || ''}</p>
          </section>`
    }
    
    return slideContent
  }).join('\n')
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${presentation.title} - Academia de Luz</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/dist/reveal.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/dist/theme/black.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
  <style>
    .reveal { font-family: 'Quicksand', sans-serif; }
    .reveal h1, .reveal h2, .reveal h3 { font-family: 'Cinzel', serif; color: #e9d5ff; }
    .glow-text { text-shadow: 0 0 20px rgba(168,85,247,0.5), 0 0 40px rgba(168,85,247,0.3); }
    .reveal ul { list-style: none; }
    .reveal ul li::before { content: "✨ "; }
    .quiz-option:hover { transform: scale(1.05); }
    .mermaid { background: transparent !important; }
  </style>
</head>
<body>
  <div class="reveal">
    <div class="slides">
      ${slidesHtml}
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/dist/reveal.js"></script>
  <script>
    Reveal.initialize({
      hash: true,
      transition: 'slide',
      backgroundTransition: 'fade'
    });
    mermaid.initialize({ startOnLoad: true, theme: 'dark' });
  </script>
</body>
</html>`
}

// ============================================================
// MAIN HTML PAGE
// ============================================================

app.get('/', (c) => c.html(getMainHTML()))

function getMainHTML() {
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Academia de Luz - Escuela Espiritual</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <meta name="description" content="Academia de Luz - Plataforma educativa espiritual con cursos de Tarot, Reiki, Registros Akáshicos y más">
    <meta name="theme-color" content="#9333ea">
    <meta property="og:title" content="Academia de Luz">
    <meta property="og:description" content="Tu escuela espiritual online">
    <meta property="og:image" content="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1200">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script>tailwind.config={theme:{extend:{colors:{'cosmic':{500:'#a855f7',600:'#9333ea',700:'#7e22ce',800:'#6b21a8',900:'#581c87'},'golden':{400:'#fbbf24',500:'#f59e0b'}}}}}</script>
    <style>
        body{font-family:'Quicksand',sans-serif;background:linear-gradient(135deg,#0f0a1e 0%,#1a0f2e 50%,#0d0619 100%);min-height:100vh}
        .font-cinzel{font-family:'Cinzel',serif}
        .glow-text{text-shadow:0 0 10px rgba(168,85,247,0.5),0 0 20px rgba(168,85,247,0.3)}
        .card-glow{box-shadow:0 0 15px rgba(139,92,246,0.1),0 4px 6px rgba(0,0,0,0.3);transition:all 0.3s}
        .card-glow:hover{box-shadow:0 0 25px rgba(139,92,246,0.2),0 8px 15px rgba(0,0,0,0.4);transform:translateY(-2px)}
        .gradient-border{background:linear-gradient(135deg,rgba(139,92,246,0.3),rgba(236,72,153,0.3));padding:1px;border-radius:12px}
        .gradient-border-inner{background:rgba(15,10,30,0.95);border-radius:11px}
        .btn-spiritual{background:linear-gradient(135deg,#9333ea,#ec4899);transition:all 0.3s}
        .btn-spiritual:hover{background:linear-gradient(135deg,#a855f7,#f472b6);transform:translateY(-2px);box-shadow:0 10px 20px rgba(147,51,234,0.3)}
        .btn-secondary{background:rgba(147,51,234,0.2);border:1px solid rgba(147,51,234,0.4);transition:all 0.3s}
        .btn-secondary:hover{background:rgba(147,51,234,0.3)}
        .avatar-ring{background:linear-gradient(135deg,#9333ea,#ec4899);padding:3px;border-radius:50%}
        .floating{animation:floating 3s ease-in-out infinite}
        @keyframes floating{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        .nav-item{position:relative;transition:all 0.3s}
        .nav-item.active::after{content:'';position:absolute;bottom:-8px;left:0;right:0;height:2px;background:linear-gradient(90deg,#9333ea,#ec4899);border-radius:2px}
        .stars{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:hidden;z-index:0}
        .star{position:absolute;width:2px;height:2px;background:white;border-radius:50%;opacity:0.5;animation:twinkle 3s infinite}
        @keyframes twinkle{0%,100%{opacity:0.3}50%{opacity:1}}
        .typing-cursor{animation:blink 1s infinite}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        .category-pill{transition:all 0.3s;cursor:pointer}
        .category-pill:hover{transform:scale(1.05)}
        .category-pill.active{background:linear-gradient(135deg,#9333ea,#ec4899)}
        ::-webkit-scrollbar{width:8px}
        ::-webkit-scrollbar-track{background:rgba(15,10,30,0.5)}
        ::-webkit-scrollbar-thumb{background:linear-gradient(135deg,#9333ea,#ec4899);border-radius:4px}
        .modal-overlay{background:rgba(0,0,0,0.8);backdrop-filter:blur(4px)}
        .fade-in{animation:fadeIn 0.3s ease}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .slide-up{animation:slideUp 0.3s ease}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .liked{color:#ec4899!important}
        .liked i{font-weight:900}
        .toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:100;animation:toastIn 0.3s ease}
        @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
        .lesson-content h2{font-size:1.5rem;font-weight:700;color:#fff;margin:1.5rem 0 1rem;font-family:'Cinzel',serif}
        .lesson-content h3{font-size:1.25rem;font-weight:600;color:#c4b5fd;margin:1.25rem 0 0.75rem}
        .lesson-content h4{font-size:1rem;font-weight:600;color:#a78bfa;margin:1rem 0 0.5rem}
        .lesson-content p{color:#d1d5db;line-height:1.75;margin:0.75rem 0}
        .lesson-content ul,.lesson-content ol{margin:0.75rem 0;padding-left:1.5rem;color:#d1d5db}
        .lesson-content li{margin:0.5rem 0}
        .lesson-content strong{color:#f472b6}
        .lesson-content em{color:#c4b5fd}
        .lesson-content .video-container{margin:1.5rem 0}
        .lesson-content .video-container iframe{width:100%;aspect-ratio:16/9;border-radius:12px}
        .lesson-content .note-box{background:linear-gradient(135deg,rgba(139,92,246,0.2),rgba(236,72,153,0.1));border:1px solid rgba(139,92,246,0.3);border-radius:12px;padding:1rem;margin:1rem 0}
        .lesson-content .note-title{color:#fbbf24;font-weight:600;margin-bottom:0.5rem}
        .lesson-content .practice-box{background:linear-gradient(135deg,rgba(34,197,94,0.2),rgba(16,185,129,0.1));border:1px solid rgba(34,197,94,0.3);border-radius:12px;padding:1rem;margin:1rem 0}
        .lesson-content .practice-title{color:#4ade80;font-weight:600;margin-bottom:0.5rem}
        .lesson-content .prayer-box{background:linear-gradient(135deg,rgba(139,92,246,0.3),rgba(236,72,153,0.2));border:1px solid rgba(139,92,246,0.4);border-radius:12px;padding:1.5rem;margin:1.5rem 0}
        .lesson-content .prayer-text{color:#e9d5ff;font-style:italic;line-height:1.8;text-align:center}
        .tab-btn{transition:all 0.2s}
        .tab-btn.active{background:linear-gradient(135deg,#9333ea,#ec4899);color:white}
        .progress-ring{transform:rotate(-90deg)}
    </style>
</head>
<body class="text-gray-100">
    <div class="stars" id="stars"></div>
    <div id="app" class="relative z-10">
        <div class="min-h-screen flex items-center justify-center">
            <div class="text-center">
                <div class="text-6xl mb-4 floating">✨</div>
                <p class="text-purple-300 glow-text">Cargando la luz...</p>
            </div>
        </div>
    </div>
    <div id="toast-container"></div>
    <script src="/static/app.js"></script>
</body>
</html>`
}

export default app
