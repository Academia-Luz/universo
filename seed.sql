-- Academia de Luz - Datos iniciales

-- Usuarios de prueba (contraseña: "luz123" - hash simple para demo)
INSERT OR IGNORE INTO users (email, password_hash, name, bio, avatar, role, level, points, location, is_online) VALUES
  ('aurora@academiadeduz.com', 'e10adc3949ba59abbe56e057f20f883e', 'Maestra Aurora', 'Guardiana de los Registros Akáshicos y maestra espiritual con más de 20 años de experiencia.', '🌅', 'maestro', 9, 2450, 'México', 1),
  ('orion@academiadeduz.com', 'e10adc3949ba59abbe56e057f20f883e', 'Maestro Orión', 'Experto en Tarot y Numerología. Canalizador de mensajes celestiales.', '🌟', 'maestro', 9, 2280, 'España', 1),
  ('luz@academiadeduz.com', 'e10adc3949ba59abbe56e057f20f883e', 'Maestra Luz', 'Maestra de Reiki Usui Shiki Ryoho. Sanadora energética certificada.', '✨', 'maestro', 9, 2100, 'Argentina', 0),
  ('carlos@email.com', 'e10adc3949ba59abbe56e057f20f883e', 'Carlos Mendoza', 'Buscador espiritual apasionado por el Tarot y la meditación.', '🙏', 'alumno', 3, 450, 'Colombia', 1),
  ('maria@email.com', 'e10adc3949ba59abbe56e057f20f883e', 'María Luz Esperanza', 'Practicante de Reiki y estudiante de los Registros Akáshicos.', '💫', 'alumno', 4, 680, 'Chile', 1),
  ('roberto@email.com', 'e10adc3949ba59abbe56e057f20f883e', 'Roberto Arcángel', 'Dedicado al camino espiritual y la sanación energética.', '🌙', 'alumno', 5, 890, 'Perú', 0),
  ('ana@email.com', 'e10adc3949ba59abbe56e057f20f883e', 'Ana Cristal', 'Iniciándome en el mundo de la radiestesia y el péndulo.', '💎', 'alumno', 2, 220, 'Ecuador', 1),
  ('fernando@email.com', 'e10adc3949ba59abbe56e057f20f883e', 'Fernando Luz', 'Estudiante avanzado de numerología y canalización.', '🔮', 'alumno', 6, 1120, 'Uruguay', 1);

-- Cursos espirituales
INSERT OR IGNORE INTO courses (title, description, image, category, level_required, duration, lessons, teacher_id, is_published) VALUES
  ('Iniciación a los Registros Akáshicos', 'Aprende a acceder a la biblioteca universal del alma. Descubre tu propósito de vida y sana memorias ancestrales.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop', 'akashicos', 1, '8 semanas', 12, 1, 1),
  ('Tarot Espiritual Avanzado', 'Domina la lectura intuitiva del Tarot. Conecta con arquetipos universales y desarrolla tu clarividencia.', 'https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?w=400&h=250&fit=crop', 'tarot', 1, '12 semanas', 24, 2, 1),
  ('Reiki Nivel I - Usui Shiki Ryoho', 'Primera sintonización de Reiki. Aprende a canalizar energía universal para sanación propia y de otros.', 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=250&fit=crop', 'reiki', 1, '4 semanas', 8, 3, 1),
  ('Numerología Sagrada', 'Descifra el lenguaje de los números. Calcula tu número de vida, expresión y destino para autoconocimiento profundo.', 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=400&h=250&fit=crop', 'numerologia', 1, '6 semanas', 10, 2, 1),
  ('Radiestesia y Péndulo', 'Aprende a usar el péndulo como herramienta de diagnóstico energético y comunicación con tu ser superior.', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop', 'radiestesia', 2, '5 semanas', 10, 1, 1),
  ('Radiónica Cuántica', 'Tecnología espiritual para equilibrar campos energéticos. Aprende a usar gráficos y dispositivos radiónicos.', 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=250&fit=crop', 'radionica', 3, '10 semanas', 15, 1, 1),
  ('Reiki Nivel II - Símbolos Sagrados', 'Segunda iniciación. Aprende los símbolos Cho Ku Rei, Sei He Ki y Hon Sha Ze Sho Nen para sanación a distancia.', 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=400&h=250&fit=crop', 'reiki', 2, '6 semanas', 10, 3, 1),
  ('Meditación y Chakras', 'Equilibra tus centros energéticos. Técnicas de meditación guiada para despertar la kundalini de forma segura.', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=250&fit=crop', 'meditacion', 1, '8 semanas', 16, 3, 1),
  ('Canalización y Mediumnidad', 'Desarrolla tu capacidad de recibir mensajes del plano espiritual. Comunicación con guías y seres de luz.', 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=400&h=250&fit=crop', 'canalizacion', 3, '12 semanas', 20, 1, 1);

-- Lecciones de ejemplo para el primer curso (Registros Akáshicos)
INSERT OR IGNORE INTO lessons (course_id, title, content, order_num, duration_minutes) VALUES
  (1, 'Introducción a los Registros Akáshicos', 'Bienvenido a este viaje sagrado. En esta lección aprenderás qué son los Registros Akáshicos, su origen y cómo pueden transformar tu vida.', 1, 45),
  (1, 'Historia y Tradiciones', 'Exploraremos las diferentes culturas que han trabajado con los Registros: desde la antigua India hasta Edgar Cayce.', 2, 40),
  (1, 'Preparación Energética', 'Técnicas de meditación y limpieza áurica para prepararte antes de acceder a los Registros.', 3, 50),
  (1, 'La Oración de Apertura', 'Aprenderás la oración sagrada que abre el portal a los Registros Akáshicos de forma segura.', 4, 35),
  (1, 'Primera Lectura Guiada', 'Realizaremos juntos tu primera lectura de Registros con guía paso a paso.', 5, 60),
  (1, 'Interpretación de Mensajes', 'Cómo interpretar correctamente la información recibida de los Registros.', 6, 45);

-- Posts de comunidad
INSERT OR IGNORE INTO posts (user_id, title, content, category, likes) VALUES
  (1, '¡Bienvenidos a la Academia de Luz!', 'Querida familia espiritual, es un honor darles la bienvenida a este espacio sagrado de aprendizaje y crecimiento. Aquí encontrarán herramientas para su evolución espiritual. ¡Namaste! 🙏✨', 'anuncios', 42),
  (4, 'Mi primera lectura de Tarot', '¡Acabo de realizar mi primera lectura completa! Los arquetipos se revelaron con tanta claridad. El Maestro Orión es increíble explicando cada carta. ¿Alguien más está en el curso de Tarot?', 'general', 18),
  (5, '¡Completé Reiki Nivel I!', '✨ ¡Lo logré! Hoy recibí mi primera sintonización de Reiki con la Maestra Luz. Sentí una energía cálida recorriendo mis manos. Gracias a todos por su apoyo en este camino. 🙌', 'logros', 56),
  (2, 'Tirada Especial para Luna Llena', 'Mañana realizaré una tirada colectiva de Tarot durante la Luna Llena. Todos los estudiantes del curso están invitados. Preparen sus preguntas y un espacio tranquilo. 🌕🃏', 'tarot', 89);

-- Comentarios
INSERT OR IGNORE INTO comments (post_id, user_id, content) VALUES
  (1, 4, '¡Gracias Maestra Aurora! Estoy muy emocionado de formar parte de esta comunidad.'),
  (1, 5, '¡Bendiciones para todos! Este espacio es maravilloso.'),
  (3, 1, '¡Felicitaciones María! Tu luz brilla cada vez más fuerte. 💫'),
  (3, 4, '¡Wow, qué logro! Pronto estaré ahí también.');

-- Eventos
INSERT OR IGNORE INTO events (title, description, event_date, event_type, color, host_id, max_attendees) VALUES
  ('Meditación Grupal Luna Llena', 'Conectemos nuestras energías bajo la luz de la luna llena. Meditación guiada para manifestación.', '2026-01-28 21:00:00', 'meditation', 'purple', 1, 50),
  ('Clase en Vivo: Tarot', 'Profundizaremos en los Arcanos Mayores: El Loco y El Mago.', '2026-01-30 19:00:00', 'class', 'amber', 2, 30),
  ('Sintonización Reiki Nivel I', 'Ceremonia de iniciación para nuevos practicantes de Reiki.', '2026-02-01 10:00:00', 'ceremony', 'green', 3, 15),
  ('Círculo de Lectura Akáshica', 'Práctica grupal de lectura de Registros Akáshicos.', '2026-02-05 18:00:00', 'workshop', 'indigo', 1, 20);

-- Inscripciones a eventos
INSERT OR IGNORE INTO event_attendees (event_id, user_id) VALUES
  (1, 4), (1, 5), (1, 6), (1, 7), (1, 8),
  (2, 4), (2, 5),
  (3, 5), (3, 7),
  (4, 5), (4, 6);

-- Progreso de alumnos
INSERT OR IGNORE INTO course_progress (user_id, course_id, progress, completed) VALUES
  (4, 1, 35, 0),
  (4, 2, 50, 0),
  (5, 1, 75, 0),
  (5, 3, 100, 1),
  (6, 1, 90, 0),
  (6, 4, 60, 0),
  (7, 8, 25, 0),
  (8, 2, 80, 0),
  (8, 4, 100, 1);

-- Notificaciones de ejemplo
INSERT OR IGNORE INTO notifications (user_id, type, title, message, link) VALUES
  (4, 'course', 'Nueva lección disponible', 'La lección 5 de Registros Akáshicos ya está disponible.', '/courses/1'),
  (5, 'achievement', '¡Felicitaciones!', 'Has completado el curso de Reiki Nivel I.', '/courses/3'),
  (4, 'event', 'Recordatorio de evento', 'Meditación Grupal Luna Llena mañana a las 21:00.', '/calendar');

-- Historial de chat de ejemplo
INSERT OR IGNORE INTO chat_history (user_id, guide_id, message, response) VALUES
  (4, 'lumina', '¿Cómo puedo elevar mi vibración?', 'Querido buscador, elevar tu vibración comienza con la gratitud. Cada mañana, dedica 5 minutos a agradecer las bendiciones en tu vida. La meditación regular y la conexión con la naturaleza también son poderosas herramientas.'),
  (5, 'akasha', '¿Qué son los Registros Akáshicos?', 'Los Registros Akáshicos son la biblioteca universal del alma, donde se almacena toda la información de tus vidas pasadas, presente y potenciales futuros. Son accesibles a través de una frecuencia elevada de consciencia.');

-- Inscripciones de alumnos con maestros
INSERT OR IGNORE INTO enrollments (student_id, teacher_id) VALUES
  (4, 1), (4, 2),
  (5, 1), (5, 3),
  (6, 1), (6, 2),
  (7, 3),
  (8, 2);
