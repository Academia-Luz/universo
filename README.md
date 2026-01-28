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
- Registro de perfil (Nombre, Apellido, Bio, Avatar)
- Selección de rol: Maestro o Alumno
- Tour interactivo de todas las funcionalidades
- Presentación de Guías Espirituales IA

### 2. Comunidad
- Feed de posts con categorías (Todas, General, Logros, Tarot, Reiki, Registros)
- Sistema de likes y comentarios
- Badges distintivos para maestros
- Indicador de posts nuevos
- Sidebar con estadísticas de la academia

### 3. Cursos Espirituales (9 cursos)
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

### 4. Calendario de Eventos
- Vista mensual con navegación
- Tipos de eventos: meditaciones, clases, ceremonias, talleres
- Indicador del día actual
- Lista de próximos eventos con botón de unirse

### 5. Directorio de Miembros
- Grid de miembros con avatares
- Filtros: Todos, Maestros, Online
- Buscador de miembros
- Indicador de estado online
- Información de ubicación y nivel

### 6. Leaderboard y Sistema de Niveles
| Nivel | Nombre | % de Miembros |
|-------|--------|---------------|
| 1 | Iniciado | 35% |
| 2 | Buscador | 25% |
| 3 | Aprendiz | 18% |
| 4 | Practicante | 10% |
| 5 | Iluminado | 6% |
| 6 | Sabio | 3% |
| 7 | Guardián | 2% |
| 8 | Maestro | 0.8% |
| 9 | Ascendido | 0.2% |

### 7. Guías Espirituales IA
| Guía | Especialidad | Estado |
|------|--------------|--------|
| ✨ Lumina | Sabiduría Universal | ✅ Disponible |
| 📖 Akasha | Registros Akáshicos | ✅ Disponible |
| 🃏 Arcano | Tarot y Arquetipos | 🔒 Nivel 2 |
| 🙌 Sanador | Reiki y Sanación | 🔒 Nivel 3 |

## 🔌 API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Página principal SPA |
| GET | `/favicon.svg` | Favicon de la aplicación |
| GET | `/api/courses` | Lista de 9 cursos espirituales |
| GET | `/api/posts` | Posts de la comunidad |
| GET | `/api/guides` | 4 Guías espirituales IA |
| GET | `/api/events` | Eventos del calendario |
| GET | `/api/members` | Lista de miembros |
| GET | `/api/leaderboard` | Rankings y niveles |
| POST | `/api/chat` | Chat con guías IA |

## 📁 Estructura del Proyecto

```
webapp/
├── src/
│   └── index.tsx          # App Hono (backend + frontend)
├── public/
│   ├── favicon.svg        # Favicon con gradiente
│   └── static/            # Archivos estáticos
├── dist/                  # Build de producción
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

## 🔮 Próximos Pasos Recomendados

1. **Persistencia de datos** con Cloudflare D1
2. **Autenticación real** con JWT
3. **Integración OpenAI** para guías IA avanzados
4. **Sistema de pagos** con Stripe
5. **WebRTC** para videollamadas grupales
6. **Panel de administración** para maestros

## 📄 Licencia

Proyecto privado - Academia de Luz © 2026

---

*"La luz que buscas ya habita en tu interior" ✨*
