# ✨ Academia de Luz - Escuela Espiritual

## Descripción del Proyecto

**Academia de Luz** es una plataforma educativa espiritual inspirada en SaaS Factory, diseñada para conectar maestros y alumnos en el camino del despertar espiritual. Ofrece formación en diversas artes espirituales incluyendo Registros Akáshicos, Tarot, Reiki, Numerología, Radiónica, Radiestesia y más.

## 🌟 URL de Acceso

- **Desarrollo**: https://3000-il53pogmbnlllslncuifj-5185f4aa.sandbox.novita.ai
- **Producción**: Pendiente de despliegue en Cloudflare Pages

## ✅ Funcionalidades Implementadas

### 1. Sistema de Onboarding
- **Pantalla de bienvenida** con efecto "click para despertar tu luz"
- **Registro de perfil** con nombre, apellido, bio y selección de rol (Maestro/Alumno)
- **Tour de funcionalidades** mostrando todas las secciones disponibles
- **Presentación de Guías Espirituales IA** con sistema de desbloqueo por niveles

### 2. Comunidad
- **Feed de posts** con categorías (Todas, General, Logros, Tarot, Reiki, Registros)
- **Sistema de likes y comentarios**
- **Badges para maestros**
- **Indicador de posts nuevos**
- **Sidebar con estadísticas** de la academia

### 3. Cursos Espirituales
- **Grid de cursos** con imágenes, descripciones y progreso
- **Sistema de niveles** para cursos avanzados
- **Cursos bloqueados** por tiempo (días para desbloqueo)
- **Categorías**: Registros Akáshicos, Tarot, Reiki, Numerología, Radiestesia, Radiónica, Meditación, Canalización

### 4. Calendario
- **Vista mensual** con navegación
- **Eventos espirituales** (meditaciones, clases, ceremonias, talleres)
- **Indicador del día actual**
- **Lista de próximos eventos** con botón de unirse

### 5. Miembros
- **Directorio de miembros** con avatares
- **Filtros**: Todos, Maestros, Online
- **Buscador de miembros**
- **Indicador de estado online**
- **Información de ubicación y nivel**

### 6. Leaderboard
- **Rankings**: 7 días, 30 días, Todo el tiempo
- **Sistema de 9 niveles**: Iniciado → Ascendido
- **Estadísticas del usuario actual**
- **Guía de cómo ganar puntos de luz**
- **Distribución de niveles en la comunidad**

### 7. Guías Espirituales IA
- **4 guías disponibles**:
  - 🔮 **Lumina** - Guardiana de la Sabiduría (Disponible)
  - 📖 **Akasha** - Guardiana de los Registros (Disponible)
  - 🃏 **Arcano** - Maestro del Tarot (Nivel 2)
  - 🙌 **Sanador** - Maestro de Energía (Nivel 3)
- **Chat interactivo** con respuestas contextuales
- **Sistema de desbloqueo por niveles**

## 🎨 Diseño Visual

- **Tema oscuro** con gradientes púrpura/magenta
- **Estrellas animadas** en el fondo
- **Tipografía Cinzel** para títulos (elegante/espiritual)
- **Tipografía Quicksand** para contenido (moderna/legible)
- **Bordes con gradiente** en tarjetas
- **Efectos glow** en textos y tarjetas
- **Animaciones suaves** (floating, pulse, fade)

## 📁 Estructura del Proyecto

```
webapp/
├── src/
│   └── index.tsx          # Aplicación Hono completa (backend + frontend)
├── public/
│   └── static/            # Archivos estáticos
├── dist/                  # Build de producción
├── ecosystem.config.cjs   # Configuración PM2
├── package.json           # Dependencias
├── wrangler.jsonc         # Configuración Cloudflare
├── vite.config.ts         # Configuración Vite
└── tsconfig.json          # Configuración TypeScript
```

## 🔌 API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Página principal de la aplicación |
| GET | `/api/courses` | Lista de cursos espirituales |
| GET | `/api/posts` | Posts de la comunidad |
| GET | `/api/guides` | Guías espirituales IA disponibles |
| GET | `/api/events` | Eventos del calendario |
| GET | `/api/members` | Lista de miembros |
| GET | `/api/leaderboard` | Rankings y niveles |
| POST | `/api/chat` | Chat con guías espirituales IA |

## 🚀 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Compilar para producción
npm run build

# Ejecutar en sandbox
pm2 start ecosystem.config.cjs

# Ver logs
pm2 logs --nostream

# Desplegar a Cloudflare Pages
npm run deploy:prod
```

## 🔮 Funcionalidades Pendientes

1. **Persistencia de datos** con Cloudflare D1
2. **Sistema de autenticación** real
3. **Subida de avatares** personalizados
4. **Creación de cursos** por maestros
5. **Sistema de pagos/suscripciones**
6. **Notificaciones push**
7. **Chat grupal** en la comunidad
8. **Integración con OpenAI** para guías IA más avanzados
9. **Mapa interactivo** de miembros
10. **Sistema de certificaciones** digitales

## 📝 Próximos Pasos Recomendados

1. Configurar **Cloudflare D1** para almacenar usuarios, posts, cursos
2. Implementar **autenticación** con JWT o Cloudflare Access
3. Conectar **OpenAI API** para respuestas más inteligentes de los guías
4. Agregar **sistema de pagos** con Stripe para cursos premium
5. Implementar **WebRTC** para videollamadas grupales
6. Crear **panel de administración** para maestros

## 🛠️ Stack Tecnológico

- **Framework**: Hono (Edge-first)
- **Runtime**: Cloudflare Workers/Pages
- **Frontend**: Vanilla JS + TailwindCSS (CDN)
- **Tipografías**: Google Fonts (Cinzel, Quicksand)
- **Iconos**: Font Awesome
- **Build**: Vite
- **Gestión de procesos**: PM2

## 📄 Licencia

Proyecto privado - Academia de Luz © 2026

---

*"La luz que buscas ya habita en tu interior" ✨*
