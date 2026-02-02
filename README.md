# ✨ Academia de Luz - Escuela Espiritual

## Descripción del Proyecto

**Academia de Luz** es una plataforma educativa espiritual completa, diseñada para conectar maestros y alumnos en el camino del despertar espiritual. Ofrece formación en diversas artes espirituales incluyendo Registros Akáshicos, Tarot, Reiki, Numerología, Radiónica, Radiestesia y más.

## 🌟 URLs de Acceso

| Entorno | URL |
|---------|-----|
| **Producción** | https://academia-de-luz.pages.dev |
| **Desarrollo** | http://localhost:3000 |

## ✅ Funcionalidades Implementadas

### 1. Sistema de Onboarding Completo
- Pantalla de bienvenida mística con "click para despertar tu luz"
- Registro de perfil (Nombre, Apellido, Email, Contraseña, Bio, Avatar)
- Selección de rol: **Maestro** o **Alumno**
- Tour interactivo de todas las funcionalidades
- Presentación de Guías Espirituales IA

### 2. Comunidad (estilo SaaS Factory)
- Feed de posts con categorías (Todas, General, Logros, Tarot, Reiki, Registros)
- Sistema de likes y comentarios
- Badges distintivos para maestros
- Indicador de posts nuevos
- Sidebar con estadísticas de la academia

### 3. 🎓 Sistema de Cursos Avanzado

#### Generación de Cursos con IA
- **Generación automática**: Crea cursos completos a partir de un tema
- **Subida de archivos**: Convierte Word, PDF, PowerPoint a lecciones estructuradas
- **Creación manual**: Control total sobre el contenido

#### Tipos de Lecciones
| Tipo | Icono | Descripción |
|------|-------|-------------|
| Video | 🎬 | Lección con video embebido de YouTube |
| Lesson | 📖 | Contenido teórico formateado |
| Practice | 🎯 | Ejercicios prácticos |

#### Catálogo de Cursos (9 cursos)
| Curso | Nivel | Estado |
|-------|-------|--------|
| Iniciación a los Registros Akáshicos | 1 | ✅ Disponible |
| Tarot Espiritual Avanzado | 1 | ✅ Disponible |
| Reiki Nivel I - Usui Shiki Ryoho | 1 | ✅ Disponible |
| Numerología Sagrada | 1 | ✅ Disponible |
| Meditación y Chakras | 1 | ✅ Disponible |
| Radiestesia y Péndulo | 2 | 🔒 Bloqueado |
| Reiki Nivel II - Símbolos Sagrados | 2 | 🔒 Bloqueado |
| Radiónica Cuántica | 3 | 🔒 Bloqueado |
| Canalización y Mediumnidad | 3 | 🔒 Bloqueado |

### 4. 📊 Presentaciones y Slides
- **Generación automática de presentaciones** a partir de contenido de lecciones
- Slides con diseño espiritual (gradientes púrpura/rosa/dorado)
- Tipos de slides: título, bullets, texto, cierre
- Navegación entre slides con indicadores visuales

### 5. 👨‍🏫 Panel de Maestros ("Mi Escuela")

#### Gestión de Cursos
- Ver todos mis cursos con estadísticas
- **Agregar/editar lecciones** con editor HTML
- **Agregar videos de YouTube** a cualquier lección
- **Generar presentaciones** para cada lección
- Eliminar lecciones

#### Gestión de Alumnos
- **Agregar nuevos alumnos** por email
- Ver progreso de cada alumno por curso
- **Inscribir alumnos en cursos** directamente
- Remover alumnos de la escuela
- Estadísticas de la escuela

### 6. 📅 Calendario de Eventos
- Vista mensual con navegación
- Tipos de eventos: meditaciones, clases, ceremonias, talleres
- Indicador del día actual
- Lista de próximos eventos con botón de unirse

### 7. 👥 Directorio de Miembros
- Grid de miembros con avatares
- Filtros: Todos, Maestros, Online
- Indicador de estado online
- Información de ubicación y nivel

### 8. 🏆 Leaderboard y Sistema de Niveles
| Nivel | Nombre | Puntos Mínimos |
|-------|--------|----------------|
| 1 | Iniciado | 0 |
| 2 | Buscador | 100 |
| 3 | Aprendiz | 300 |
| 4 | Practicante | 600 |
| 5 | Iluminado | 1000 |
| 6 | Sabio | 1500 |
| 7 | Guardián | 2200 |
| 8 | Maestro | 3000 |
| 9 | Ascendido | 4000 |

### 9. 🤖 Guías Espirituales IA
| Guía | Especialidad | Estado |
|------|--------------|--------|
| ✨ Lumina | Sabiduría Universal | ✅ Disponible |
| 📖 Akasha | Registros Akáshicos | ✅ Disponible |
| 🃏 Arcano | Tarot y Arquetipos | 🔒 Nivel 2 |
| 🙌 Sanador | Reiki y Sanación | 🔒 Nivel 3 |
| 🎓 Creador | Asistente IA para Maestros | ✅ Para Maestros |

## 🔌 API Endpoints

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Inicio de sesión |

### Cursos y Lecciones
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/courses` | Lista de cursos |
| GET | `/api/courses/:id` | Detalle de curso |
| POST | `/api/courses` | Crear curso (maestro) |
| PUT | `/api/courses/:id` | Actualizar curso |
| POST | `/api/courses/:id/enroll` | Inscribirse en curso |
| POST | `/api/courses/:id/lessons` | Agregar lección |
| PUT | `/api/courses/:id/lessons/:lessonId` | Editar lección |
| DELETE | `/api/courses/:id/lessons/:lessonId` | Eliminar lección |
| POST | `/api/courses/:id/lessons/:lessonId/video` | Agregar video |
| POST | `/api/courses/:id/lessons/:lessonId/complete` | Completar lección |

### IA y Generación de Contenido
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/ai/create-course` | Generar curso con IA |
| POST | `/api/ai/publish-course/:pendingId` | Publicar curso generado |
| POST | `/api/ai/process-file` | Procesar archivo (Word/PDF/PPT) |
| POST | `/api/ai/generate-presentation` | Generar presentación |
| POST | `/api/ai/chat` | Chat con asistente IA |

### Maestros y Alumnos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/teacher/:id/students` | Lista de alumnos |
| POST | `/api/teacher/:id/students` | Agregar alumno |
| DELETE | `/api/teacher/:id/students/:studentId` | Remover alumno |

### Comunidad
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/posts` | Posts de la comunidad |
| POST | `/api/posts` | Crear post |
| POST | `/api/posts/:id/like` | Dar like |
| POST | `/api/posts/:id/comment` | Comentar |

### Otros
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/events` | Eventos del calendario |
| GET | `/api/members` | Lista de miembros |
| GET | `/api/leaderboard` | Rankings y niveles |
| GET | `/api/guides` | Guías espirituales IA |
| POST | `/api/chat` | Chat con guías |
| GET | `/api/notifications/:userId` | Notificaciones |
| GET | `/api/stats` | Estadísticas generales |

## 📁 Estructura del Proyecto

```
webapp/
├── src/
│   └── index.tsx          # App Hono (backend + frontend)
├── public/
│   ├── favicon.svg        # Favicon con gradiente
│   └── static/
│       └── app.js         # Frontend SPA completo
├── dist/                  # Build de producción
├── reference/             # Imágenes de referencia
├── ecosystem.config.cjs   # Configuración PM2
├── package.json           # Dependencias
├── wrangler.jsonc         # Config Cloudflare
├── vite.config.ts         # Config Vite
└── tsconfig.json          # Config TypeScript
```

## 🚀 Comandos

```bash
# Desarrollo local
npm run dev

# Compilar
npm run build

# Ejecutar en sandbox con PM2
pm2 start ecosystem.config.cjs

# Desplegar a Cloudflare Pages
npm run deploy:prod

# Ver logs
pm2 logs --nostream
```

## 🎨 Stack Tecnológico

- **Framework**: Hono (Edge-first)
- **Runtime**: Cloudflare Pages/Workers
- **Frontend**: Vanilla JS + TailwindCSS (CDN)
- **Tipografías**: Cinzel (títulos), Quicksand (contenido)
- **Iconos**: Font Awesome 6
- **Build**: Vite
- **Deploy**: Cloudflare Pages

## 🎯 Guía de Uso

### Login Rápido (Cuentas Demo)
En la pantalla de bienvenida puedes ingresar con cuentas demo para probar:

| Cuenta | Rol | Especialidad |
|--------|-----|--------------|
| 🌟 Maestra Aurora | Maestro | Registros Akáshicos |
| ⭐ Maestro Orión | Maestro | Tarot Espiritual |
| 🔮 Carlos Mendoza | Alumno | Nivel 3 |

### Para Alumnos
1. **Registrarse** o usar **login rápido** seleccionando un alumno
2. **Explorar cursos** disponibles en la sección "Cursos"
3. **Inscribirse** en un curso (botón "Inscribirme")
4. **Ver lecciones** con videos y contenido formateado
5. **Marcar lecciones** como completadas (+5 puntos)
6. **Chatear** con guías espirituales IA
7. **Participar** en la comunidad con posts

### Para Maestros
1. **Registrarse** seleccionando el rol "Maestro"
2. **Ir a "Mi Escuela"** en el menú principal
3. **Crear cursos** usando:
   - 🪄 **IA**: Ingresa un tema y genera automáticamente
   - 📄 **Archivo**: Sube Word/PDF/PowerPoint
   - ✏️ **Manual**: Crea desde cero
4. **Gestionar lecciones**:
   - Agregar nuevas lecciones
   - Editar contenido con HTML
   - Agregar videos de YouTube
   - Generar presentaciones/slides
5. **Gestionar alumnos**:
   - Agregar alumnos por email
   - Inscribirlos en cursos
   - Ver su progreso

## 🔮 Próximos Pasos Recomendados

1. **Persistencia de datos** con Cloudflare D1 (ya configurado)
2. **Autenticación real** con JWT
3. **Integración OpenAI** para guías IA avanzados
4. **Sistema de pagos** con Stripe
5. **WebRTC** para videollamadas grupales
6. **Notificaciones push** para eventos y actualizaciones

## 📄 Licencia

Proyecto privado - Academia de Luz © 2026

---

*"La luz que buscas ya habita en tu interior" ✨*
