// ============================================================
// ACADEMIA DE LUZ - FRONTEND APPLICATION
// ============================================================

// State Management
const state = {
    screen: 'welcome',
    section: 'comunidad',
    user: JSON.parse(localStorage.getItem('academia_user') || 'null'),
    posts: [],
    courses: [],
    guides: [],
    events: [],
    members: [],
    leaderboard: null,
    stats: null,
    chatOpen: false,
    selectedGuide: null,
    chatMessages: [],
    selectedCourse: null,
    selectedLesson: null,
    selectedPost: null,
    searchQuery: '',
    searchResults: null,
    notifications: [],
    showProfileMenu: false,
    postCategory: 'todas',
    memberFilter: 'all',
    loading: false,
    // Teacher-specific state
    teacherTab: 'courses',
    myStudents: [],
    aiChatMessages: [],
    pendingCourse: null,
    showAddStudent: false,
    showCreateCourse: false,
    createCourseTab: 'ai',
    editingLesson: null,
    showLessonEditor: false,
    // Presentation state
    showPresentation: false,
    presentationSlides: [],
    currentSlide: 0,
    // New course detail editing
    showCourseEditor: false,
    editingCourse: null,
    // Enroll student modal
    showEnrollStudent: false,
    enrollingCourse: null
};

// Utilities
function $(id) { return document.getElementById(id); }

function showToast(message, type = 'success') {
    const container = $('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast gradient-border';
    toast.innerHTML = `<div class="gradient-border-inner px-6 py-3 flex items-center gap-3">
        <span class="${type === 'success' ? 'text-green-400' : type === 'error' ? 'text-red-400' : 'text-purple-400'}">${type === 'success' ? '✨' : type === 'error' ? '❌' : 'ℹ️'}</span>
        <span class="text-white">${message}</span>
    </div>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function saveUser() {
    localStorage.setItem('academia_user', JSON.stringify(state.user));
}

function createStars() {
    const container = $('stars');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 80; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*3}s;animation-duration:${2+Math.random()*3}s`;
        container.appendChild(star);
    }
}

// API Calls
async function api(endpoint, options = {}) {
    try {
        const res = await fetch(`/api${endpoint}`, {
            headers: { 'Content-Type': 'application/json' },
            ...options,
            body: options.body ? JSON.stringify(options.body) : undefined
        });
        return await res.json();
    } catch (e) {
        console.error('API Error:', e);
        return null;
    }
}

async function fetchData() {
    state.loading = true;
    const [posts, courses, guides, events, members, leaderboard, stats] = await Promise.all([
        api('/posts'),
        api(`/courses${state.user ? '?userId=' + state.user.id : ''}`),
        api('/guides'),
        api('/events'),
        api('/members'),
        api('/leaderboard'),
        api('/stats')
    ]);
    
    state.posts = posts || [];
    state.courses = courses || [];
    state.guides = guides || [];
    state.events = events || [];
    state.members = members || [];
    state.leaderboard = leaderboard;
    state.stats = stats;
    
    if (state.user) {
        state.notifications = await api(`/notifications/${state.user.id}`) || [];
        if (state.user.role === 'teacher') {
            state.myStudents = await api(`/teacher/${state.user.id}/students`) || [];
        }
    }
    
    state.loading = false;
}

// Navigation Actions
function goTo(screen) {
    state.screen = screen;
    render();
}

function setSection(section) {
    state.section = section;
    state.selectedCourse = null;
    state.selectedLesson = null;
    render();
}

// Auth Actions
async function register() {
    const firstName = $('firstName')?.value?.trim();
    const lastName = $('lastName')?.value?.trim();
    const email = $('userEmail')?.value?.trim();
    const password = $('userPassword')?.value?.trim();
    const bio = $('userBio')?.value?.trim() || '';
    const role = state.user?.role || 'student';
    
    if (!firstName || !lastName) {
        showToast('Por favor ingresa tu nombre y apellido', 'error');
        return;
    }
    
    const result = await api('/auth/register', {
        method: 'POST',
        body: { firstName, lastName, email, password, bio, role, avatar: '🙏' }
    });
    
    if (result?.success) {
        state.user = result.user;
        saveUser();
        showToast('¡Bienvenido a la Academia de Luz! ✨');
        goTo('onboarding-2');
    } else {
        showToast(result?.error || 'Error al registrarse', 'error');
    }
}

function selectRole(role) {
    if (!state.user) state.user = {};
    state.user.role = role;
    render();
}

function logout() {
    state.user = null;
    localStorage.removeItem('academia_user');
    state.screen = 'welcome';
    state.showProfileMenu = false;
    showToast('¡Hasta pronto, buscador de luz! ✨');
    render();
}

// Post Actions
async function createPost() {
    const title = $('newPostTitle')?.value?.trim();
    const content = $('newPostContent')?.value?.trim();
    const category = $('newPostCategory')?.value || 'general';
    
    if (!title || !content) {
        showToast('Por favor completa el título y contenido', 'error');
        return;
    }
    
    const result = await api('/posts', {
        method: 'POST',
        body: { title, content, category, author: { id: state.user.id, name: state.user.name, avatar: state.user.avatar, role: state.user.role } }
    });
    
    if (result?.success) {
        state.posts.unshift(result.post);
        state.selectedPost = null;
        showToast('¡Post publicado con luz! ✨');
        render();
    }
}

async function toggleLike(postId) {
    if (!state.user) return showToast('Inicia sesión para dar like', 'error');
    
    const result = await api(`/posts/${postId}/like`, {
        method: 'POST',
        body: { userId: state.user.id }
    });
    
    if (result?.success) {
        const post = state.posts.find(p => p.id === postId);
        if (post) {
            if (result.liked) post.likes.push(state.user.id);
            else post.likes = post.likes.filter(id => id !== state.user.id);
            post.likesCount = result.likesCount;
        }
        render();
    }
}

async function addComment(postId) {
    const input = $(`comment-${postId}`);
    const content = input?.value?.trim();
    if (!content) return;
    
    const result = await api(`/posts/${postId}/comment`, {
        method: 'POST',
        body: { content, author: { id: state.user.id, name: state.user.name, avatar: state.user.avatar } }
    });
    
    if (result?.success) {
        const post = state.posts.find(p => p.id === postId);
        if (post) {
            post.comments.push(result.comment);
            post.commentsCount = post.comments.length;
        }
        input.value = '';
        showToast('Comentario agregado ✨');
        render();
    }
}

function filterPosts(category) {
    state.postCategory = category;
    render();
}

// Course Actions
async function enrollCourse(courseId) {
    if (!state.user) return showToast('Inicia sesión para inscribirte', 'error');
    
    const result = await api(`/courses/${courseId}/enroll`, {
        method: 'POST',
        body: { userId: state.user.id }
    });
    
    if (result?.success) {
        const course = state.courses.find(c => c.id === courseId);
        if (course) course.enrolled = true;
        showToast('¡Te has inscrito en el curso! ✨');
        render();
    }
}

async function viewCourse(courseId) {
    state.selectedCourse = courseId;
    state.selectedLesson = null;
    render();
}

async function viewLesson(courseId, lessonId) {
    const result = await api(`/courses/${courseId}/lessons/${lessonId}?userId=${state.user?.id || ''}`);
    if (result) {
        state.selectedLesson = result;
        render();
        window.scrollTo(0, 0);
    }
}

async function completeLesson(courseId, lessonId) {
    if (!state.user) return;
    
    const result = await api(`/courses/${courseId}/lessons/${lessonId}/complete`, {
        method: 'POST',
        body: { userId: state.user.id }
    });
    
    if (result?.success) {
        const course = state.courses.find(c => c.id === courseId);
        if (course) course.completedLessons = result.completedLessons;
        showToast('¡Lección completada! +5 puntos ✨');
        
        // Go to next lesson if available
        if (state.selectedLesson?.nextLesson) {
            viewLesson(courseId, state.selectedLesson.nextLesson.id);
        } else {
            state.selectedLesson = null;
            render();
        }
    }
}

function goBackFromLesson() {
    state.selectedLesson = null;
    render();
}

// Event Actions
async function joinEvent(eventId) {
    if (!state.user) return showToast('Inicia sesión para unirte', 'error');
    
    const result = await api(`/events/${eventId}/join`, {
        method: 'POST',
        body: { userId: state.user.id }
    });
    
    if (result?.success) {
        showToast('¡Te has unido al evento! +10 puntos ✨');
    }
}

// Member Actions
function filterMembers(filter) {
    state.memberFilter = filter;
    render();
}

// Chat Actions
function toggleChat() {
    state.chatOpen = !state.chatOpen;
    if (!state.chatOpen) {
        state.selectedGuide = null;
        state.chatMessages = [];
    }
    render();
}

function selectGuide(guideId) {
    const guide = state.guides.find(g => g.id === guideId);
    state.selectedGuide = guideId;
    state.chatMessages = [{
        text: `Namaste, buscador de luz. Soy ${guide.name}, ${guide.title}. ¿En qué puedo iluminar tu camino hoy?`,
        isUser: false
    }];
    render();
}

async function sendChatMessage() {
    const input = $('chatInput');
    const message = input?.value?.trim();
    if (!message) return;
    
    state.chatMessages.push({ text: message, isUser: true });
    input.value = '';
    render();
    
    // Scroll immediately after user message
    scrollChat();
    
    const result = await api('/chat', {
        method: 'POST',
        body: { message, guideId: state.selectedGuide, userId: state.user?.id, history: state.chatMessages }
    });
    
    if (result?.response) {
        state.chatMessages.push({ text: result.response, isUser: false });
        render();
        setTimeout(scrollChat, 100);
    }
}

function scrollChat() {
    const el = $('chatMessages');
    if (el) el.scrollTop = el.scrollHeight;
}

// Search
async function search() {
    const query = $('searchInput')?.value?.trim();
    if (!query) {
        state.searchResults = null;
        render();
        return;
    }
    
    state.searchResults = await api(`/search?q=${encodeURIComponent(query)}`);
    render();
}

// ============================================================
// TEACHER FUNCTIONS
// ============================================================

function setTeacherTab(tab) {
    state.teacherTab = tab;
    render();
}

async function addStudent() {
    const email = $('newStudentEmail')?.value?.trim();
    const name = $('newStudentName')?.value?.trim();
    
    if (!email) {
        showToast('Por favor ingresa el email del alumno', 'error');
        return;
    }
    
    const result = await api(`/teacher/${state.user.id}/students`, {
        method: 'POST',
        body: { email, name }
    });
    
    if (result?.success) {
        state.myStudents.push(result.student);
        state.showAddStudent = false;
        showToast(result.isNew ? '¡Nuevo alumno creado! ✨' : '¡Alumno agregado! ✨');
        render();
    } else {
        showToast(result?.error || 'Error al agregar alumno', 'error');
    }
}

async function removeStudent(studentId) {
    if (!confirm('¿Estás seguro de remover este alumno?')) return;
    
    const result = await api(`/teacher/${state.user.id}/students/${studentId}`, {
        method: 'DELETE'
    });
    
    if (result?.success) {
        state.myStudents = state.myStudents.filter(s => s.id !== studentId);
        showToast('Alumno removido');
        render();
    }
}

// AI Course Creator
function toggleAICourseCreator() {
    state.showCreateCourse = !state.showCreateCourse;
    if (state.showCreateCourse) {
        state.createCourseTab = 'ai';
        state.aiChatMessages = [{
            text: `¡Hola ${state.user.name}! 🎓 Soy tu asistente para crear cursos.

**Puedo ayudarte a:**
• 🪄 **Generar cursos automáticamente** - Dame un tema y creo toda la estructura
• 📄 **Convertir archivos** - Sube Word, PDF o PowerPoint
• ✏️ **Mejorar contenido** - Formateo y estructuro tus materiales

¿Cómo te gustaría empezar?`,
            isUser: false
        }];
        state.pendingCourse = null;
    }
    render();
}

function setCreateCourseTab(tab) {
    state.createCourseTab = tab;
    render();
}

async function sendAIMessage() {
    const input = $('aiChatInput');
    const message = input?.value?.trim();
    if (!message) return;
    
    state.aiChatMessages.push({ text: message, isUser: true });
    input.value = '';
    render();
    
    // Scroll immediately after user message
    scrollAIChat();
    
    const result = await api('/ai/chat', {
        method: 'POST',
        body: { message, context: state.pendingCourse, teacherId: state.user.id }
    });
    
    if (result?.response) {
        state.aiChatMessages.push({ text: result.response, isUser: false });
        render();
        setTimeout(scrollAIChat, 100);
    }
}

function scrollAIChat() {
    const el = $('aiChatMessages');
    if (el) el.scrollTop = el.scrollHeight;
}

async function generateCourse() {
    const topic = $('courseTopic')?.value?.trim();
    const description = $('courseDescription')?.value?.trim();
    const level = parseInt($('courseLevel')?.value || '1');
    const duration = $('courseDuration')?.value?.trim() || '4 semanas';
    const numLessons = parseInt($('courseNumLessons')?.value || '4');
    
    if (!topic) {
        showToast('Por favor ingresa el tema del curso', 'error');
        return;
    }
    
    showToast('Generando curso con IA... ✨', 'info');
    
    const result = await api('/ai/create-course', {
        method: 'POST',
        body: { teacherId: state.user.id, topic, description, level, duration, numLessons }
    });
    
    if (result?.success) {
        state.pendingCourse = { pendingId: result.pendingId, ...result.course };
        showToast('¡Curso generado! Revisa el contenido.');
        render();
    } else {
        showToast(result?.error || 'Error al generar curso', 'error');
    }
}

async function publishCourse() {
    if (!state.pendingCourse) return;
    
    const result = await api(`/ai/publish-course/${state.pendingCourse.pendingId}`, {
        method: 'POST',
        body: { modifications: {} }
    });
    
    if (result?.success) {
        state.courses.push(result.course);
        state.pendingCourse = null;
        state.showCreateCourse = false;
        showToast('¡Curso publicado exitosamente! ✨');
        await fetchData();
        render();
    }
}

async function createManualCourse() {
    const title = $('manualCourseTitle')?.value?.trim();
    const description = $('manualCourseDesc')?.value?.trim();
    const category = $('manualCourseCategory')?.value;
    const duration = $('manualCourseDuration')?.value?.trim();
    
    if (!title || !description) {
        showToast('Por favor completa título y descripción', 'error');
        return;
    }
    
    const result = await api('/courses', {
        method: 'POST',
        body: { 
            title, 
            description, 
            category, 
            duration,
            teacherId: state.user.id,
            lessons: []
        }
    });
    
    if (result?.success) {
        state.courses.push(result.course);
        state.showCreateCourse = false;
        showToast('¡Curso creado! Ahora agrega lecciones.');
        render();
    }
}

// File upload simulation (in a real app, this would use FormData)
async function handleFileUpload() {
    const fileInput = $('fileUpload');
    if (!fileInput?.files?.length) {
        showToast('Selecciona un archivo primero', 'error');
        return;
    }
    
    const file = fileInput.files[0];
    const topic = $('fileCourseTopic')?.value?.trim() || file.name.replace(/\.[^/.]+$/, '');
    
    // Read file content (simplified - in production use proper parsing)
    const reader = new FileReader();
    reader.onload = async function(e) {
        const content = e.target.result;
        
        showToast('Procesando archivo... ✨', 'info');
        
        const result = await api('/ai/process-file', {
            method: 'POST',
            body: { 
                fileContent: content.substring(0, 50000), // Limit content size
                fileName: file.name,
                fileType: file.type,
                teacherId: state.user.id,
                topic
            }
        });
        
        if (result?.success) {
            state.pendingCourse = { pendingId: result.pendingId, ...result.course };
            showToast(`¡${result.lessonsGenerated} lecciones generadas! Revisa el contenido.`);
            render();
        } else {
            showToast(result?.error || 'Error al procesar archivo', 'error');
        }
    };
    reader.readAsText(file);
}

// ============================================================
// LESSON MANAGEMENT FUNCTIONS (TEACHER)
// ============================================================

function editLesson(courseId, lessonId) {
    const course = state.courses.find(c => c.id === courseId);
    if (!course) return;
    const lesson = course.lessons?.find(l => l.id === lessonId);
    if (!lesson) return;
    
    state.editingLesson = { courseId, lessonId, ...lesson };
    state.showLessonEditor = true;
    render();
}

function closeLessonEditor() {
    state.editingLesson = null;
    state.showLessonEditor = false;
    render();
}

async function saveLessonChanges() {
    if (!state.editingLesson) return;
    
    const title = $('editLessonTitle')?.value?.trim();
    const content = $('editLessonContent')?.value?.trim();
    const duration = $('editLessonDuration')?.value?.trim();
    const videoUrl = $('editLessonVideoUrl')?.value?.trim();
    const type = $('editLessonType')?.value;
    
    if (!title) {
        showToast('El título es requerido', 'error');
        return;
    }
    
    const result = await api(`/courses/${state.editingLesson.courseId}/lessons/${state.editingLesson.lessonId}`, {
        method: 'PUT',
        body: { title, content, duration, videoUrl, type, teacherId: state.user.id }
    });
    
    if (result?.success) {
        await fetchData();
        closeLessonEditor();
        showToast('Lección actualizada ✨');
    } else {
        showToast(result?.error || 'Error al guardar', 'error');
    }
}

async function deleteLesson(courseId, lessonId) {
    if (!confirm('¿Estás seguro de eliminar esta lección?')) return;
    
    const result = await api(`/courses/${courseId}/lessons/${lessonId}`, {
        method: 'DELETE',
        body: { teacherId: state.user.id }
    });
    
    if (result?.success) {
        await fetchData();
        showToast('Lección eliminada');
        render();
    }
}

async function addNewLesson(courseId) {
    const course = state.courses.find(c => c.id === courseId);
    if (!course) return;
    
    const newLesson = {
        title: `Nueva Lección ${(course.lessons?.length || 0) + 1}`,
        type: 'lesson',
        content: '<h2>Nueva Lección</h2><p>Contenido de la lección...</p>',
        duration: '30min'
    };
    
    const result = await api(`/courses/${courseId}/lessons`, {
        method: 'POST',
        body: { lesson: newLesson, teacherId: state.user.id }
    });
    
    if (result?.success) {
        await fetchData();
        showToast('Lección agregada ✨');
        editLesson(courseId, result.lesson.id);
    }
}

async function addVideoToLesson(courseId, lessonId) {
    const videoUrl = prompt('Ingresa el URL del video de YouTube:');
    if (!videoUrl) return;
    
    const result = await api(`/courses/${courseId}/lessons/${lessonId}/video`, {
        method: 'POST',
        body: { videoUrl, teacherId: state.user.id }
    });
    
    if (result?.success) {
        await fetchData();
        showToast('Video agregado ✨');
        render();
    }
}

async function generatePresentation(courseId, lessonId) {
    const course = state.courses.find(c => c.id === courseId);
    if (!course) return;
    const lesson = course.lessons?.find(l => l.id === lessonId);
    if (!lesson) return;
    
    showToast('Generando presentación... ✨', 'info');
    
    const result = await api('/ai/generate-presentation', {
        method: 'POST',
        body: { 
            lessonId, 
            courseId, 
            teacherId: state.user.id,
            topic: lesson.title,
            content: lesson.content
        }
    });
    
    if (result?.success) {
        // Show presentation modal
        state.presentationSlides = result.slides;
        state.currentSlide = 0;
        state.showPresentation = true;
        render();
    } else {
        showToast(result?.error || 'Error al generar presentación', 'error');
    }
}

function closePresentation() {
    state.showPresentation = false;
    state.presentationSlides = [];
    state.currentSlide = 0;
    render();
}

function nextSlide() {
    if (state.currentSlide < state.presentationSlides.length - 1) {
        state.currentSlide++;
        render();
    }
}

function prevSlide() {
    if (state.currentSlide > 0) {
        state.currentSlide--;
        render();
    }
}

function goToSlide(index) {
    state.currentSlide = index;
    render();
}

// Enroll student in course
async function enrollStudentInCourse(studentId, courseId) {
    const result = await api(`/courses/${courseId}/enroll`, {
        method: 'POST',
        body: { userId: studentId }
    });
    
    if (result?.success) {
        await fetchData();
        showToast('Alumno inscrito en el curso ✨');
        render();
    }
}

// ============================================================
// RENDER FUNCTIONS
// ============================================================

// Quick Login with demo accounts
async function quickLogin(userId) {
    const result = await api('/auth/login', {
        method: 'POST',
        body: { userId }
    });
    
    if (result?.success) {
        state.user = result.user;
        saveUser();
        showToast('¡Bienvenido ' + result.user.name + '! ✨');
        await fetchData();
        state.screen = 'main';
        render();
    } else {
        showToast('Error al iniciar sesión', 'error');
    }
}

function renderWelcome() {
    return `<div class="min-h-screen flex items-center justify-center p-4">
        <div class="text-center max-w-lg w-full">
            <div class="text-8xl mb-8 floating">🌟</div>
            <h1 class="font-cinzel text-4xl md:text-5xl text-white mb-4 glow-text">Academia de Luz</h1>
            <p class="text-purple-300 text-xl font-light tracking-widest mb-8">Escuela Espiritual Online</p>
            
            <button onclick="goTo('onboarding-1')" class="btn-spiritual px-8 py-4 rounded-xl font-semibold text-lg mb-8 w-full">
                ✨ Crear Nueva Cuenta
            </button>
            
            <div class="gradient-border">
                <div class="gradient-border-inner p-4">
                    <p class="text-purple-300 text-sm mb-4">O ingresa con una cuenta demo:</p>
                    <div class="space-y-2">
                        <button onclick="quickLogin('teacher-1')" class="w-full bg-purple-900/50 hover:bg-purple-800/50 text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3">
                            <span class="text-2xl">🌟</span>
                            <div>
                                <p class="text-white font-medium">Maestra Aurora</p>
                                <p class="text-purple-400 text-xs">Maestro • Registros Akáshicos</p>
                            </div>
                        </button>
                        <button onclick="quickLogin('teacher-2')" class="w-full bg-purple-900/50 hover:bg-purple-800/50 text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3">
                            <span class="text-2xl">⭐</span>
                            <div>
                                <p class="text-white font-medium">Maestro Orión</p>
                                <p class="text-purple-400 text-xs">Maestro • Tarot Espiritual</p>
                            </div>
                        </button>
                        <button onclick="quickLogin('user-1')" class="w-full bg-purple-900/50 hover:bg-purple-800/50 text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3">
                            <span class="text-2xl">🔮</span>
                            <div>
                                <p class="text-white font-medium">Carlos Mendoza</p>
                                <p class="text-purple-400 text-xs">Alumno • Nivel 3</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

function renderOnboarding1() {
    return `<div class="min-h-screen flex items-center justify-center px-4 py-8">
        <div class="max-w-md w-full">
            <div class="flex items-start gap-4 mb-8">
                <div class="text-5xl floating">✨</div>
                <div class="gradient-border flex-1">
                    <div class="gradient-border-inner p-4">
                        <p class="text-purple-200">Para comenzar tu viaje espiritual, cuéntanos sobre ti</p>
                    </div>
                </div>
            </div>
            
            <div class="text-center mb-6">
                <div class="avatar-ring w-24 h-24 mx-auto mb-2">
                    <div class="w-full h-full rounded-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center text-4xl">🙏</div>
                </div>
            </div>

            <div class="space-y-4 mb-6">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-purple-300 text-sm mb-2">Nombre *</label>
                        <input type="text" id="firstName" placeholder="Tu nombre" class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-4 py-3 text-white placeholder-purple-500 focus:border-purple-500 focus:outline-none">
                    </div>
                    <div>
                        <label class="block text-purple-300 text-sm mb-2">Apellido *</label>
                        <input type="text" id="lastName" placeholder="Tu apellido" class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-4 py-3 text-white placeholder-purple-500 focus:border-purple-500 focus:outline-none">
                    </div>
                </div>
                <div>
                    <label class="block text-purple-300 text-sm mb-2">Email</label>
                    <input type="email" id="userEmail" placeholder="tu@email.com" class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-4 py-3 text-white placeholder-purple-500 focus:border-purple-500 focus:outline-none">
                </div>
                <div>
                    <label class="block text-purple-300 text-sm mb-2">Contraseña</label>
                    <input type="password" id="userPassword" placeholder="••••••••" class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-4 py-3 text-white placeholder-purple-500 focus:border-purple-500 focus:outline-none">
                </div>
                <div>
                    <label class="block text-purple-300 text-sm mb-2">Bio (opcional)</label>
                    <textarea id="userBio" rows="2" placeholder="¿Cuál es tu camino espiritual?" class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-4 py-3 text-white placeholder-purple-500 focus:border-purple-500 focus:outline-none resize-none"></textarea>
                </div>
                <div>
                    <label class="block text-purple-300 text-sm mb-2">¿Eres Maestro o Alumno?</label>
                    <div class="grid grid-cols-2 gap-4">
                        <button onclick="selectRole('student')" class="py-3 rounded-lg border transition-all ${state.user?.role === 'student' ? 'bg-purple-600 border-purple-500 text-white' : 'border-purple-700/50 bg-purple-900/30 text-purple-300 hover:bg-purple-800/50'}">🙏 Alumno</button>
                        <button onclick="selectRole('teacher')" class="py-3 rounded-lg border transition-all ${state.user?.role === 'teacher' ? 'bg-purple-600 border-purple-500 text-white' : 'border-purple-700/50 bg-purple-900/30 text-purple-300 hover:bg-purple-800/50'}">✨ Maestro</button>
                    </div>
                </div>
            </div>

            <button onclick="register()" class="w-full btn-spiritual py-4 rounded-xl font-semibold text-lg">CONTINUAR</button>
        </div>
    </div>`;
}

function renderOnboarding2() {
    const features = state.user?.role === 'teacher' ? [
        { icon: '🎓', title: 'Crear Cursos con IA', desc: 'Genera contenido automáticamente' },
        { icon: '👥', title: 'Gestionar Alumnos', desc: 'Agrega y sigue el progreso' },
        { icon: '📊', title: 'Estadísticas', desc: 'Ve el avance de tu escuela' },
        { icon: '💬', title: 'Comunidad', desc: 'Conecta con estudiantes' },
        { icon: '📅', title: 'Eventos', desc: 'Programa clases y ceremonias' },
        { icon: '📄', title: 'Subir Archivos', desc: 'Convierte Word/PDF en cursos' }
    ] : [
        { icon: '💬', title: 'Comunidad', desc: 'Conecta con buscadores de luz' },
        { icon: '📚', title: 'Cursos', desc: 'Tarot, Reiki, Akáshicos y más' },
        { icon: '📅', title: 'Calendario', desc: 'Meditaciones y ceremonias' },
        { icon: '👥', title: 'Miembros', desc: 'Expande tu red espiritual' },
        { icon: '🏆', title: 'Leaderboard', desc: 'Asciende en tu camino' },
        { icon: '🔮', title: 'Guías IA', desc: 'Sabiduría instantánea' }
    ];
    
    return `<div class="min-h-screen flex items-center justify-center px-4 py-8">
        <div class="max-w-4xl w-full">
            <div class="flex items-start gap-4 mb-8">
                <div class="text-4xl floating">✨</div>
                <div class="gradient-border flex-1">
                    <div class="gradient-border-inner p-4">
                        <p class="text-purple-200">${state.user?.role === 'teacher' ? '¡Bienvenido Maestro! Estas son tus herramientas...' : 'Déjame mostrarte los senderos de la Academia...'}</p>
                    </div>
                </div>
            </div>

            <div class="grid md:grid-cols-3 gap-4 mb-8">
                ${features.map(f => `
                    <div class="gradient-border card-glow">
                        <div class="gradient-border-inner p-5">
                            <div class="text-3xl mb-3">${f.icon}</div>
                            <h3 class="font-cinzel text-lg text-white mb-2">${f.title}</h3>
                            <p class="text-purple-400 text-sm">${f.desc}</p>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="flex justify-between items-center">
                <button onclick="goTo('onboarding-1')" class="text-purple-400 hover:text-purple-300">← Volver</button>
                <button onclick="goTo('main')" class="btn-spiritual px-8 py-3 rounded-xl font-semibold">¡COMENZAR! 🚀</button>
            </div>
        </div>
    </div>`;
}

function renderHeader() {
    const unreadNotifications = state.notifications.filter(n => !n.read).length;
    const isTeacher = state.user?.role === 'teacher';
    
    const navItems = isTeacher 
        ? ['comunidad', 'cursos', 'mi-escuela', 'calendario', 'miembros']
        : ['comunidad', 'cursos', 'calendario', 'miembros', 'leaderboard'];
    
    return `<header class="sticky top-0 z-40 bg-[#0f0a1e]/95 backdrop-blur-md border-b border-purple-900/30">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex items-center justify-between h-16">
                <div class="flex items-center gap-3 cursor-pointer" onclick="setSection('comunidad')">
                    <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-xl">✨</div>
                    <span class="font-cinzel text-lg text-white hidden sm:block">Academia de Luz</span>
                </div>

                <nav class="hidden md:flex items-center gap-6">
                    ${navItems.map(s => `
                        <button onclick="setSection('${s}')" class="nav-item text-sm ${state.section === s ? 'active text-white' : 'text-purple-400 hover:text-white'}">
                            ${s === 'mi-escuela' ? '🎓 Mi Escuela' : s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    `).join('')}
                </nav>

                <div class="flex items-center gap-4">
                    <div class="hidden lg:flex items-center bg-purple-900/30 rounded-lg px-3 py-2">
                        <i class="fas fa-search text-purple-500 text-sm mr-2"></i>
                        <input type="text" id="searchInput" placeholder="Buscar..." class="bg-transparent text-sm text-white placeholder-purple-500 focus:outline-none w-32" onkeyup="if(event.key==='Enter')search()">
                    </div>
                    
                    <button class="relative text-purple-400 hover:text-white">
                        <i class="fas fa-bell"></i>
                        ${unreadNotifications > 0 ? `<span class="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full text-[10px] flex items-center justify-center">${unreadNotifications}</span>` : ''}
                    </button>
                    
                    <button onclick="toggleChat()" class="relative text-purple-400 hover:text-white">
                        <i class="fas fa-comment-dots"></i>
                        <span class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full text-[10px] flex items-center justify-center">✨</span>
                    </button>

                    <div class="relative">
                        <div class="avatar-ring w-9 h-9 cursor-pointer" onclick="state.showProfileMenu=!state.showProfileMenu;render()">
                            <div class="w-full h-full rounded-full bg-gradient-to-br from-purple-700 to-pink-700 flex items-center justify-center text-lg">${state.user?.avatar || '🙏'}</div>
                        </div>
                        ${state.showProfileMenu ? `
                            <div class="absolute right-0 top-12 w-48 gradient-border z-50 fade-in">
                                <div class="gradient-border-inner py-2">
                                    <div class="px-4 py-2 border-b border-purple-800/50">
                                        <p class="text-white font-medium truncate">${state.user?.name}</p>
                                        <p class="text-purple-400 text-xs">${state.user?.role === 'teacher' ? 'Maestro' : 'Alumno'} • Nivel ${state.user?.level || 1}</p>
                                    </div>
                                    <button class="w-full px-4 py-2 text-left text-purple-300 hover:bg-purple-800/30 text-sm" onclick="setSection('perfil');state.showProfileMenu=false">
                                        <i class="fas fa-user mr-2"></i> Mi Perfil
                                    </button>
                                    <button class="w-full px-4 py-2 text-left text-red-400 hover:bg-purple-800/30 text-sm" onclick="logout()">
                                        <i class="fas fa-sign-out-alt mr-2"></i> Cerrar Sesión
                                    </button>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    </header>`;
}

function renderMobileNav() {
    const isTeacher = state.user?.role === 'teacher';
    const items = isTeacher ? [
        { id: 'comunidad', icon: 'fa-comments', label: 'Comunidad' },
        { id: 'cursos', icon: 'fa-book', label: 'Cursos' },
        { id: 'mi-escuela', icon: 'fa-graduation-cap', label: 'Mi Escuela' },
        { id: 'calendario', icon: 'fa-calendar', label: 'Calendario' },
        { id: 'miembros', icon: 'fa-users', label: 'Miembros' }
    ] : [
        { id: 'comunidad', icon: 'fa-comments', label: 'Comunidad' },
        { id: 'cursos', icon: 'fa-book', label: 'Cursos' },
        { id: 'calendario', icon: 'fa-calendar', label: 'Calendario' },
        { id: 'miembros', icon: 'fa-users', label: 'Miembros' },
        { id: 'leaderboard', icon: 'fa-trophy', label: 'Ranking' }
    ];
    
    return `<nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0f0a1e]/95 backdrop-blur-md border-t border-purple-900/30">
        <div class="flex justify-around py-3">
            ${items.map(i => `
                <button onclick="setSection('${i.id}')" class="flex flex-col items-center gap-1 ${state.section === i.id ? 'text-purple-400' : 'text-purple-600'}">
                    <i class="fas ${i.icon}"></i>
                    <span class="text-[10px]">${i.label}</span>
                </button>
            `).join('')}
        </div>
    </nav>`;
}

function renderCommunity() {
    const categories = ['todas', 'general', 'logros', 'tarot', 'reiki', 'registros', 'anuncios'];
    const filteredPosts = state.postCategory === 'todas' ? state.posts : state.posts.filter(p => p.category === state.postCategory);
    
    return `<div class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
            <div class="gradient-border mb-6 card-glow cursor-pointer" onclick="state.selectedPost='new';render()">
                <div class="gradient-border-inner p-4">
                    <div class="flex items-center gap-3">
                        <div class="avatar-ring w-10 h-10">
                            <div class="w-full h-full rounded-full bg-purple-800 flex items-center justify-center">${state.user?.avatar || '🙏'}</div>
                        </div>
                        <span class="text-purple-400">¿Qué luz deseas compartir con la comunidad?</span>
                    </div>
                </div>
            </div>

            <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
                ${categories.map(c => `
                    <button onclick="filterPosts('${c}')" class="category-pill ${state.postCategory === c ? 'active' : 'bg-purple-900/50 text-purple-300'} px-4 py-2 rounded-full text-sm whitespace-nowrap">${c === 'todas' ? 'Todas' : c.charAt(0).toUpperCase() + c.slice(1)}</button>
                `).join('')}
            </div>

            <div class="space-y-4">
                ${filteredPosts.length === 0 ? '<p class="text-center text-purple-400 py-8">No hay posts en esta categoría</p>' : ''}
                ${filteredPosts.map(post => {
                    const isLiked = post.likes?.includes(state.user?.id);
                    return `
                    <div class="gradient-border card-glow fade-in">
                        <div class="gradient-border-inner p-5">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="text-3xl">${post.author.avatar}</div>
                                <div class="flex-1">
                                    <div class="flex items-center gap-2">
                                        <span class="font-semibold text-white">${post.author.name}</span>
                                        ${post.author.badge ? `<span class="text-xs bg-golden-500/20 text-golden-400 px-2 py-0.5 rounded">${post.author.badge}</span>` : ''}
                                    </div>
                                    <div class="flex items-center gap-2 text-xs text-purple-500">
                                        <span>${post.timeAgo}</span>
                                        <span>•</span>
                                        <span class="capitalize">${post.category}</span>
                                    </div>
                                </div>
                                ${post.isNew ? '<span class="text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded-full">Nuevo</span>' : ''}
                            </div>

                            <h3 class="font-semibold text-white mb-2">${post.title}</h3>
                            <p class="text-purple-300 text-sm mb-4">${post.content}</p>

                            <div class="flex items-center gap-6 text-purple-500 text-sm">
                                <button onclick="toggleLike('${post.id}')" class="flex items-center gap-2 hover:text-pink-400 transition-colors ${isLiked ? 'liked' : ''}">
                                    <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i> ${post.likesCount || post.likes?.length || 0}
                                </button>
                                <button class="flex items-center gap-2 hover:text-purple-400">
                                    <i class="far fa-comment"></i> ${post.commentsCount || post.comments?.length || 0}
                                </button>
                            </div>
                            
                            ${post.comments?.length > 0 ? `
                                <div class="mt-4 pt-4 border-t border-purple-800/30 space-y-3">
                                    ${post.comments.slice(-2).map(c => `
                                        <div class="flex gap-2">
                                            <span class="text-lg">${c.author.avatar}</span>
                                            <div class="flex-1 bg-purple-900/30 rounded-lg p-2">
                                                <span class="text-white text-sm font-medium">${c.author.name}</span>
                                                <p class="text-purple-300 text-sm">${c.content}</p>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                            
                            <div class="mt-3 flex gap-2">
                                <input type="text" id="comment-${post.id}" placeholder="Agregar comentario..." class="flex-1 bg-purple-900/30 rounded-lg px-3 py-2 text-sm text-white placeholder-purple-500 focus:outline-none" onkeypress="if(event.key==='Enter')addComment('${post.id}')">
                                <button onclick="addComment('${post.id}')" class="btn-secondary px-3 py-2 rounded-lg text-sm text-purple-300">
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `}).join('')}
            </div>
        </div>

        <div class="space-y-6">
            <div class="gradient-border overflow-hidden">
                <div class="h-32 bg-gradient-to-br from-purple-600 via-pink-600 to-amber-500 flex items-center justify-center">
                    <span class="text-6xl">🌟</span>
                </div>
                <div class="gradient-border-inner -mt-px p-4 text-center">
                    <h3 class="font-cinzel text-xl text-white mb-1">Academia de Luz</h3>
                    <p class="text-purple-400 text-sm mb-4">Iluminando el camino espiritual</p>
                    <div class="grid grid-cols-3 gap-2 text-center">
                        <div>
                            <div class="text-xl font-bold text-white">${state.stats?.totalMembers || state.members.length}</div>
                            <div class="text-xs text-purple-500">MIEMBROS</div>
                        </div>
                        <div>
                            <div class="text-xl font-bold text-white">${state.stats?.onlineMembers || state.members.filter(m => m.online).length}</div>
                            <div class="text-xs text-purple-500">ONLINE</div>
                        </div>
                        <div>
                            <div class="text-xl font-bold text-white">${state.stats?.totalCourses || state.courses.length}</div>
                            <div class="text-xs text-purple-500">CURSOS</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="gradient-border">
                <div class="gradient-border-inner p-4">
                    <h4 class="font-cinzel text-white mb-4">🏆 Top Performers (30 días)</h4>
                    <div class="space-y-3">
                        ${state.leaderboard?.monthly?.slice(0, 5).map((user, i) => `
                            <div class="flex items-center gap-3">
                                <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-golden-500 text-black' : i === 1 ? 'bg-gray-400 text-black' : i === 2 ? 'bg-amber-700 text-white' : 'bg-purple-900 text-purple-300'}">${i + 1}</div>
                                <span class="text-xl">${user.avatar}</span>
                                <span class="flex-1 text-sm text-white truncate">${user.name}</span>
                                <span class="text-sm text-green-400">+${user.points}</span>
                            </div>
                        `).join('')}
                    </div>
                    <button onclick="setSection('leaderboard')" class="w-full mt-4 text-purple-400 text-sm hover:text-purple-300">Ver ranking completo →</button>
                </div>
            </div>
        </div>
    </div>
    
    ${state.selectedPost === 'new' ? renderNewPostModal() : ''}`;
}

function renderNewPostModal() {
    return `<div class="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4" onclick="if(event.target===this){state.selectedPost=null;render()}">
        <div class="gradient-border w-full max-w-lg slide-up">
            <div class="gradient-border-inner p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-cinzel text-xl text-white">Compartir tu luz</h3>
                    <button onclick="state.selectedPost=null;render()" class="text-purple-400 hover:text-white"><i class="fas fa-times"></i></button>
                </div>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-purple-300 text-sm mb-2">Título</label>
                        <input type="text" id="newPostTitle" placeholder="Título de tu post" class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-4 py-3 text-white placeholder-purple-500 focus:outline-none">
                    </div>
                    <div>
                        <label class="block text-purple-300 text-sm mb-2">Contenido</label>
                        <textarea id="newPostContent" rows="4" placeholder="Comparte tu experiencia, pregunta o reflexión..." class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-4 py-3 text-white placeholder-purple-500 focus:outline-none resize-none"></textarea>
                    </div>
                    <div>
                        <label class="block text-purple-300 text-sm mb-2">Categoría</label>
                        <select id="newPostCategory" class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-4 py-3 text-white focus:outline-none">
                            <option value="general">💬 General</option>
                            <option value="logros">🏆 Logros</option>
                            <option value="tarot">🔮 Tarot</option>
                            <option value="reiki">🙌 Reiki</option>
                            <option value="registros">📖 Registros</option>
                        </select>
                    </div>
                </div>
                
                <button onclick="createPost()" class="w-full btn-spiritual py-3 rounded-xl font-semibold mt-6">Publicar ✨</button>
            </div>
        </div>
    </div>`;
}

function renderCourses() {
    if (state.selectedLesson) {
        return renderLessonView();
    }
    
    if (state.selectedCourse) {
        return renderCourseDetail();
    }
    
    return `<div>
        <div class="flex items-center justify-between mb-6">
            <h1 class="font-cinzel text-2xl text-white">Cursos Espirituales</h1>
            <div class="text-purple-400 text-sm">${state.courses.length} cursos disponibles</div>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${state.courses.map(course => `
                <div class="gradient-border card-glow overflow-hidden ${course.locked ? 'opacity-80' : ''} cursor-pointer" onclick="${!course.locked ? `viewCourse('${course.id}')` : ''}">
                    <div class="relative">
                        <img src="${course.image}" alt="${course.title}" class="w-full h-48 object-cover ${course.locked ? 'filter grayscale' : ''}">
                        ${course.locked ? `
                            <div class="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <div class="text-center">
                                    <i class="fas fa-lock text-3xl text-purple-400 mb-2"></i>
                                    <p class="text-purple-300 text-sm">Se desbloquea en ${course.unlockDays} días</p>
                                </div>
                            </div>
                        ` : ''}
                        <div class="absolute top-3 right-3 bg-purple-900/80 px-2 py-1 rounded text-xs text-purple-300">Nivel ${course.level}</div>
                        ${course.enrolled ? '<div class="absolute top-3 left-3 bg-green-900/80 px-2 py-1 rounded text-xs text-green-300">✓ Inscrito</div>' : ''}
                    </div>
                    <div class="gradient-border-inner -mt-px p-4">
                        <h3 class="font-semibold text-white mb-2">${course.title}</h3>
                        <p class="text-purple-400 text-sm mb-3 line-clamp-2">${course.description}</p>
                        <div class="flex items-center justify-between text-xs text-purple-500 mb-3">
                            <span>📚 ${course.lessons?.length || 0} lecciones</span>
                            <span>⏱️ ${course.duration}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-xs text-purple-400">Por ${course.teacher}</span>
                            ${course.enrolled ? `<span class="text-xs text-green-400">${course.progress || 0}%</span>` : `<span class="text-xs text-purple-500">${course.studentsCount || 0} estudiantes</span>`}
                        </div>
                        ${!course.locked && course.lessons?.length > 0 && course.enrolled ? `
                            <div class="mt-3 h-1 bg-purple-900 rounded-full overflow-hidden">
                                <div class="h-full bg-gradient-to-r from-purple-500 to-pink-500" style="width: ${course.progress || 0}%"></div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    </div>`;
}

function renderCourseDetail() {
    const course = state.courses.find(c => c.id === state.selectedCourse);
    if (!course) return '';
    
    return `<div class="max-w-5xl mx-auto">
        <button onclick="state.selectedCourse=null;render()" class="text-purple-400 hover:text-white mb-4">
            <i class="fas fa-arrow-left mr-2"></i> Volver a Cursos
        </button>
        
        <div class="gradient-border overflow-hidden mb-6">
            <div class="relative">
                <img src="${course.image}" alt="${course.title}" class="w-full h-64 object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-[#0f0a1e] via-transparent to-transparent"></div>
                <div class="absolute bottom-6 left-6 right-6">
                    <h1 class="font-cinzel text-3xl text-white mb-2">${course.title}</h1>
                    <p class="text-purple-300">${course.description}</p>
                </div>
            </div>
        </div>
        
        <div class="grid lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2">
                <div class="gradient-border mb-6">
                    <div class="gradient-border-inner p-4">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="font-cinzel text-xl text-white">📚 Lecciones</h2>
                            <span class="text-purple-400 text-sm">${course.lessons?.length || 0} lecciones</span>
                        </div>
                        
                        ${!course.enrolled ? `
                            <div class="text-center py-8">
                                <p class="text-purple-400 mb-4">Inscríbete para acceder a las lecciones</p>
                                <button onclick="enrollCourse('${course.id}')" class="btn-spiritual px-8 py-3 rounded-xl font-semibold">Inscribirme ✨</button>
                            </div>
                        ` : `
                            <div class="space-y-3">
                                ${course.lessons?.map((lesson, i) => {
                                    const isCompleted = course.completedLessons?.includes(lesson.id);
                                    const prevCompleted = i === 0 || course.completedLessons?.includes(course.lessons[i-1]?.id);
                                    const canAccess = prevCompleted;
                                    
                                    return `
                                    <div class="gradient-border ${canAccess ? 'card-glow cursor-pointer' : 'opacity-50'}" ${canAccess ? `onclick="viewLesson('${course.id}', '${lesson.id}')"` : ''}>
                                        <div class="gradient-border-inner p-4 flex items-center gap-4">
                                            <div class="w-12 h-12 rounded-full ${isCompleted ? 'bg-green-600' : canAccess ? 'bg-purple-600' : 'bg-purple-900'} flex items-center justify-center text-lg">
                                                ${isCompleted ? '<i class="fas fa-check text-white"></i>' : `<span class="text-white">${i + 1}</span>`}
                                            </div>
                                            <div class="flex-1">
                                                <div class="flex items-center gap-2">
                                                    <h4 class="text-white font-medium">${lesson.title}</h4>
                                                    ${lesson.type === 'video' ? '<span class="text-xs bg-red-900/50 text-red-400 px-2 py-0.5 rounded">🎬 Video</span>' : ''}
                                                    ${lesson.type === 'practice' ? '<span class="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded">🎯 Práctica</span>' : ''}
                                                </div>
                                                <p class="text-purple-400 text-sm">${lesson.duration}</p>
                                            </div>
                                            ${canAccess && !isCompleted ? '<i class="fas fa-play text-purple-400"></i>' : ''}
                                            ${!canAccess ? '<i class="fas fa-lock text-purple-600"></i>' : ''}
                                        </div>
                                    </div>
                                `}).join('') || '<p class="text-purple-400 text-center py-4">Próximamente más lecciones...</p>'}
                            </div>
                        `}
                    </div>
                </div>
            </div>
            
            <div class="space-y-6">
                <div class="gradient-border">
                    <div class="gradient-border-inner p-4">
                        <h3 class="font-cinzel text-white mb-4">ℹ️ Información</h3>
                        <div class="space-y-3 text-sm">
                            <div class="flex justify-between">
                                <span class="text-purple-400">Maestro</span>
                                <span class="text-white">${course.teacher}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-purple-400">Duración</span>
                                <span class="text-white">${course.duration}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-purple-400">Nivel</span>
                                <span class="text-white">${course.level}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-purple-400">Estudiantes</span>
                                <span class="text-white">${course.studentsCount || 0}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-purple-400">Categoría</span>
                                <span class="text-white capitalize">${course.category}</span>
                            </div>
                        </div>
                        
                        ${course.enrolled ? `
                            <div class="mt-4 pt-4 border-t border-purple-800/30">
                                <div class="flex justify-between text-sm mb-2">
                                    <span class="text-purple-400">Tu progreso</span>
                                    <span class="text-white">${course.progress || 0}%</span>
                                </div>
                                <div class="h-2 bg-purple-900 rounded-full overflow-hidden">
                                    <div class="h-full bg-gradient-to-r from-purple-500 to-pink-500" style="width: ${course.progress || 0}%"></div>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

function renderLessonView() {
    const lesson = state.selectedLesson;
    if (!lesson) return '';
    
    const course = state.courses.find(c => c.id === lesson.courseId);
    const isCompleted = course?.completedLessons?.includes(lesson.id);
    
    return `<div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <button onclick="goBackFromLesson()" class="text-purple-400 hover:text-white flex items-center gap-2">
                <i class="fas fa-arrow-left"></i>
                <span class="hidden sm:inline">${lesson.courseTitle}</span>
            </button>
            <div class="flex items-center gap-4">
                <span class="text-purple-400 text-sm">Lección ${lesson.currentLessonNumber}/${lesson.totalLessons}</span>
                ${!isCompleted ? `
                    <button onclick="completeLesson('${lesson.courseId}', '${lesson.id}')" class="btn-spiritual px-4 py-2 rounded-lg text-sm">
                        <i class="fas fa-check mr-2"></i>Completar
                    </button>
                ` : `
                    <span class="text-green-400 text-sm"><i class="fas fa-check-circle mr-1"></i> Completada</span>
                `}
            </div>
        </div>
        
        <div class="grid lg:grid-cols-4 gap-6">
            <!-- Sidebar with lessons -->
            <div class="hidden lg:block">
                <div class="gradient-border sticky top-20">
                    <div class="gradient-border-inner p-4 max-h-[70vh] overflow-y-auto">
                        <h4 class="text-white font-semibold mb-2 text-sm">${lesson.courseTitle}</h4>
                        <div class="h-1 bg-purple-900 rounded-full mb-4 overflow-hidden">
                            <div class="h-full bg-gradient-to-r from-purple-500 to-pink-500" style="width: ${(lesson.currentLessonNumber / lesson.totalLessons) * 100}%"></div>
                        </div>
                        <div class="space-y-2">
                            ${course?.lessons?.map((l, i) => {
                                const isActive = l.id === lesson.id;
                                const isLessonCompleted = course.completedLessons?.includes(l.id);
                                return `
                                <div class="flex items-start gap-2 p-2 rounded-lg ${isActive ? 'bg-purple-800/50 border border-purple-600/50' : 'hover:bg-purple-900/30'} cursor-pointer" onclick="viewLesson('${lesson.courseId}', '${l.id}')">
                                    <div class="w-6 h-6 rounded-full flex-shrink-0 ${isLessonCompleted ? 'bg-green-600' : isActive ? 'bg-purple-600' : 'bg-purple-900'} flex items-center justify-center text-xs">
                                        ${isLessonCompleted ? '<i class="fas fa-check text-white text-[10px]"></i>' : i + 1}
                                    </div>
                                    <span class="text-xs ${isActive ? 'text-white' : 'text-purple-400'} leading-tight">${l.title}</span>
                                </div>
                            `}).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Main content -->
            <div class="lg:col-span-3">
                <div class="gradient-border">
                    <div class="gradient-border-inner p-6 lg:p-8">
                        <!-- Lesson type badge -->
                        <div class="flex items-center gap-2 mb-4">
                            ${lesson.type === 'video' ? '<span class="text-xs bg-red-900/50 text-red-400 px-3 py-1 rounded-full"><i class="fas fa-play-circle mr-1"></i> Video Lección</span>' : ''}
                            ${lesson.type === 'practice' ? '<span class="text-xs bg-green-900/50 text-green-400 px-3 py-1 rounded-full"><i class="fas fa-hands mr-1"></i> Práctica</span>' : ''}
                            ${lesson.type === 'lesson' ? '<span class="text-xs bg-purple-900/50 text-purple-400 px-3 py-1 rounded-full"><i class="fas fa-book mr-1"></i> Lección</span>' : ''}
                            <span class="text-xs text-purple-500"><i class="fas fa-clock mr-1"></i> ${lesson.duration}</span>
                        </div>
                        
                        <div class="lesson-content">
                            ${lesson.content || '<p>Contenido no disponible</p>'}
                        </div>
                        
                        <!-- Navigation -->
                        <div class="mt-8 pt-6 border-t border-purple-800/30">
                            <div class="grid grid-cols-2 gap-4">
                                ${lesson.prevLesson ? `
                                    <button onclick="viewLesson('${lesson.courseId}', '${lesson.prevLesson.id}')" class="gradient-border card-glow text-left">
                                        <div class="gradient-border-inner p-4">
                                            <span class="text-purple-500 text-xs flex items-center gap-1"><i class="fas fa-arrow-left"></i> ANTERIOR</span>
                                            <p class="text-white text-sm mt-1 truncate">${lesson.prevLesson.title}</p>
                                        </div>
                                    </button>
                                ` : '<div></div>'}
                                ${lesson.nextLesson ? `
                                    <button onclick="viewLesson('${lesson.courseId}', '${lesson.nextLesson.id}')" class="gradient-border card-glow text-right">
                                        <div class="gradient-border-inner p-4">
                                            <span class="text-purple-500 text-xs flex items-center justify-end gap-1">SIGUIENTE <i class="fas fa-arrow-right"></i></span>
                                            <p class="text-white text-sm mt-1 truncate">${lesson.nextLesson.title}</p>
                                        </div>
                                    </button>
                                ` : '<div></div>'}
                            </div>
                        </div>
                        
                        ${!isCompleted ? `
                            <button onclick="completeLesson('${lesson.courseId}', '${lesson.id}')" class="w-full btn-spiritual py-4 rounded-xl font-semibold mt-6">
                                <i class="fas fa-check-circle mr-2"></i> Marcar como Completada
                            </button>
                        ` : `
                            <div class="w-full bg-green-900/30 border border-green-700/50 py-4 rounded-xl text-center text-green-400 mt-6">
                                <i class="fas fa-check-circle mr-2"></i> ¡Lección Completada! +5 puntos
                            </div>
                        `}
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

function renderCalendar() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    let days = [];
    const startDay = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < startDay; i++) days.push({ day: '', current: false });
    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const dayEvents = state.events.filter(e => e.date === dateStr);
        days.push({ day: i, current: true, today: i === today.getDate(), events: dayEvents });
    }
    
    return `<div>
        <div class="flex items-center justify-between mb-6">
            <h1 class="font-cinzel text-2xl text-white">📅 ${monthNames[month]} ${year}</h1>
        </div>
        
        <div class="gradient-border mb-6">
            <div class="gradient-border-inner p-4">
                <div class="grid grid-cols-7 gap-2 mb-2">
                    ${['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => `<div class="text-center text-purple-500 text-sm py-2">${d}</div>`).join('')}
                </div>
                <div class="grid grid-cols-7 gap-2">
                    ${days.map(d => `
                        <div class="min-h-20 p-2 rounded-lg ${d.current ? 'bg-purple-900/30' : ''} ${d.today ? 'ring-2 ring-pink-500' : ''}">
                            <div class="text-sm ${d.current ? d.today ? 'font-bold text-pink-400' : 'text-white' : 'text-purple-700'}">${d.day}</div>
                            ${d.events?.slice(0, 2).map(e => `
                                <div class="mt-1 text-xs bg-purple-800/50 text-purple-300 p-1 rounded truncate">${e.time?.slice(0, 5)} ${e.title?.slice(0, 10)}...</div>
                            `).join('') || ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <h2 class="font-cinzel text-xl text-white mb-4">🔮 Próximos Eventos</h2>
        <div class="space-y-3">
            ${state.events.map(event => `
                <div class="gradient-border card-glow">
                    <div class="gradient-border-inner p-4 flex items-center gap-4">
                        <div class="w-12 h-12 rounded-lg bg-purple-900/50 flex items-center justify-center text-2xl">
                            ${event.type === 'meditation' ? '🧘' : event.type === 'class' ? '📚' : event.type === 'ceremony' ? '✨' : '🔮'}
                        </div>
                        <div class="flex-1">
                            <h4 class="text-white font-medium">${event.title}</h4>
                            <p class="text-purple-400 text-sm">${event.date} • ${event.time}</p>
                            <p class="text-purple-500 text-xs mt-1">${event.description || ''}</p>
                        </div>
                        <button onclick="joinEvent('${event.id}')" class="btn-spiritual px-4 py-2 rounded-lg text-sm">Unirse</button>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>`;
}

function renderMembers() {
    const filters = [
        { id: 'all', label: `Todos ${state.members.length}` },
        { id: 'teachers', label: `Maestros ${state.members.filter(m => m.role === 'teacher').length}` },
        { id: 'online', label: `Online ${state.members.filter(m => m.online).length}` }
    ];
    
    let filteredMembers = state.members;
    if (state.memberFilter === 'teachers') filteredMembers = state.members.filter(m => m.role === 'teacher');
    else if (state.memberFilter === 'online') filteredMembers = state.members.filter(m => m.online);
    
    return `<div>
        <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h1 class="font-cinzel text-2xl text-white">👥 Miembros</h1>
            <div class="flex gap-2">
                ${filters.map(f => `
                    <button onclick="filterMembers('${f.id}')" class="category-pill ${state.memberFilter === f.id ? 'active' : 'bg-purple-900/50 text-purple-300'} px-4 py-2 rounded-full text-sm">${f.label}</button>
                `).join('')}
            </div>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            ${filteredMembers.map(member => `
                <div class="gradient-border card-glow">
                    <div class="gradient-border-inner p-4 text-center">
                        <div class="relative inline-block mb-3">
                            <div class="avatar-ring w-16 h-16">
                                <div class="w-full h-full rounded-full bg-purple-800 flex items-center justify-center text-3xl">${member.avatar}</div>
                            </div>
                            ${member.online ? '<div class="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-purple-900"></div>' : ''}
                        </div>
                        <h4 class="font-semibold text-white mb-1">${member.name}</h4>
                        <div class="flex items-center justify-center gap-2 mb-2">
                            <span class="text-xs ${member.role === 'teacher' ? 'bg-golden-500/20 text-golden-400' : 'bg-purple-900/50 text-purple-400'} px-2 py-0.5 rounded">${member.role === 'teacher' ? 'MAESTRO' : 'ALUMNO'}</span>
                            <span class="text-xs bg-purple-900/50 text-purple-400 px-2 py-0.5 rounded">Nivel ${member.level}</span>
                        </div>
                        <p class="text-purple-500 text-xs mb-2">📍 ${member.location}</p>
                        <p class="text-purple-400 text-xs">${member.points} puntos de luz</p>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>`;
}

function renderLeaderboard() {
    const lb = state.leaderboard;
    if (!lb) return '<p class="text-center text-purple-400">Cargando...</p>';
    
    return `<div>
        <h1 class="font-cinzel text-2xl text-white mb-6">🏆 Leaderboard</h1>

        <div class="grid lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2">
                <div class="gradient-border mb-6">
                    <div class="gradient-border-inner p-6">
                        <div class="flex items-center gap-4 mb-4">
                            <div class="avatar-ring w-16 h-16">
                                <div class="w-full h-full rounded-full bg-purple-700 flex items-center justify-center text-3xl">${state.user?.avatar || '🙏'}</div>
                            </div>
                            <div>
                                <h3 class="font-semibold text-white text-xl">${state.user?.name || 'Buscador'}</h3>
                                <p class="text-purple-400">Nivel ${state.user?.level || 1}</p>
                            </div>
                        </div>
                        <div class="mb-2 flex justify-between text-sm">
                            <span class="text-purple-400">${state.user?.points || 50} puntos</span>
                            <span class="text-purple-500">100 para nivel 2</span>
                        </div>
                        <div class="h-2 bg-purple-900 rounded-full overflow-hidden">
                            <div class="h-full bg-gradient-to-r from-purple-500 to-pink-500" style="width: ${Math.min(100, ((state.user?.points || 50) / 100) * 100)}%"></div>
                        </div>
                    </div>
                </div>

                <div class="grid md:grid-cols-3 gap-4">
                    ${[{ title: '7 días', data: lb.weekly }, { title: '30 días', data: lb.monthly }, { title: 'Todo el tiempo', data: lb.allTime }].map(section => `
                        <div class="gradient-border">
                            <div class="gradient-border-inner p-4">
                                <h4 class="text-white font-semibold mb-4">${section.title}</h4>
                                ${section.data?.map((user, i) => `
                                    <div class="flex items-center gap-2 mb-3">
                                        <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-golden-500 text-black' : i === 1 ? 'bg-gray-400 text-black' : i === 2 ? 'bg-amber-700 text-white' : 'bg-purple-900 text-purple-300'}">${i + 1}</div>
                                        <span class="text-lg">${user.avatar}</span>
                                        <span class="flex-1 text-sm text-white truncate">${user.name?.split(' ')[0]}</span>
                                        <span class="text-xs ${section.title !== 'Todo el tiempo' ? 'text-green-400' : 'text-purple-400'}">${section.title !== 'Todo el tiempo' ? '+' : ''}${user.points}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="space-y-6">
                <div class="gradient-border">
                    <div class="gradient-border-inner p-4">
                        <h4 class="text-white font-semibold mb-4">📊 Niveles</h4>
                        ${lb.levels?.map(level => `
                            <div class="flex items-center gap-3 mb-3">
                                <div class="w-6 h-6 rounded-full bg-purple-900/50 flex items-center justify-center text-xs text-purple-300">${level.level}</div>
                                <span class="flex-1 text-sm text-white">${level.name}</span>
                                <span class="text-xs text-purple-500">${level.minPoints}+</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="gradient-border">
                    <div class="gradient-border-inner p-4">
                        <h4 class="text-white font-semibold mb-4">⭐ Cómo ganar puntos</h4>
                        <div class="space-y-3 text-sm">
                            <div class="flex justify-between"><span class="text-purple-300">Publicar post</span><span class="text-green-400">+5</span></div>
                            <div class="flex justify-between"><span class="text-purple-300">Completar lección</span><span class="text-green-400">+5</span></div>
                            <div class="flex justify-between"><span class="text-purple-300">Inscribirse a curso</span><span class="text-green-400">+10</span></div>
                            <div class="flex justify-between"><span class="text-purple-300">Unirse a evento</span><span class="text-green-400">+10</span></div>
                            <div class="flex justify-between"><span class="text-purple-300">Completar curso</span><span class="text-green-400">+50</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

// ============================================================
// TEACHER: MY SCHOOL SECTION
// ============================================================

function renderMySchool() {
    return `<div>
        <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h1 class="font-cinzel text-2xl text-white">🎓 Mi Escuela</h1>
            <button onclick="toggleAICourseCreator()" class="btn-spiritual px-4 py-2 rounded-lg">
                <i class="fas fa-magic mr-2"></i> Crear Curso con IA
            </button>
        </div>
        
        <!-- Tabs -->
        <div class="flex gap-2 mb-6 overflow-x-auto">
            <button onclick="setTeacherTab('courses')" class="tab-btn px-4 py-2 rounded-lg whitespace-nowrap ${state.teacherTab === 'courses' ? 'active' : 'bg-purple-900/50 text-purple-300'}">
                📚 Mis Cursos
            </button>
            <button onclick="setTeacherTab('students')" class="tab-btn px-4 py-2 rounded-lg whitespace-nowrap ${state.teacherTab === 'students' ? 'active' : 'bg-purple-900/50 text-purple-300'}">
                👥 Mis Alumnos
            </button>
            <button onclick="setTeacherTab('stats')" class="tab-btn px-4 py-2 rounded-lg whitespace-nowrap ${state.teacherTab === 'stats' ? 'active' : 'bg-purple-900/50 text-purple-300'}">
                📊 Estadísticas
            </button>
        </div>
        
        ${state.teacherTab === 'courses' ? renderTeacherCourses() : ''}
        ${state.teacherTab === 'students' ? renderTeacherStudents() : ''}
        ${state.teacherTab === 'stats' ? renderTeacherStats() : ''}
        
        ${state.showCreateCourse ? renderAICourseCreatorModal() : ''}
        ${state.showAddStudent ? renderAddStudentModal() : ''}
    </div>`;
}

function renderTeacherCourses() {
    const myCourses = state.courses.filter(c => c.teacherId === state.user.id);
    
    return `<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${myCourses.length === 0 ? `
            <div class="col-span-full gradient-border">
                <div class="gradient-border-inner p-8 text-center">
                    <div class="text-6xl mb-4">📚</div>
                    <p class="text-purple-400 mb-4">Aún no has creado ningún curso</p>
                    <button onclick="toggleAICourseCreator()" class="btn-spiritual px-6 py-2 rounded-lg">
                        <i class="fas fa-magic mr-2"></i> Crear mi primer curso
                    </button>
                </div>
            </div>
        ` : ''}
        ${myCourses.map(course => `
            <div class="gradient-border card-glow overflow-hidden">
                <img src="${course.image}" alt="${course.title}" class="w-full h-40 object-cover">
                <div class="gradient-border-inner -mt-px p-4">
                    <h3 class="font-semibold text-white mb-2">${course.title}</h3>
                    <p class="text-purple-400 text-xs mb-2 line-clamp-2">${course.description || ''}</p>
                    <div class="flex items-center justify-between text-xs text-purple-500 mb-3">
                        <span>📚 ${course.lessons?.length || 0} lecciones</span>
                        <span>👥 ${course.studentsCount || 0} estudiantes</span>
                    </div>
                    
                    <!-- Lesson Management -->
                    ${course.lessons?.length > 0 ? `
                        <div class="mb-3 max-h-32 overflow-y-auto space-y-1">
                            ${course.lessons.map((lesson, i) => `
                                <div class="flex items-center gap-2 bg-purple-900/30 rounded p-2 group">
                                    <span class="w-5 h-5 rounded-full ${lesson.type === 'video' ? 'bg-red-800' : lesson.type === 'practice' ? 'bg-green-800' : 'bg-purple-800'} flex items-center justify-center text-[10px] text-white">${i+1}</span>
                                    <span class="text-xs text-purple-300 flex-1 truncate">${lesson.title}</span>
                                    <div class="hidden group-hover:flex gap-1">
                                        ${lesson.type === 'video' || lesson.videoUrl ? '' : `<button onclick="addVideoToLesson('${course.id}', '${lesson.id}')" class="text-[10px] text-blue-400 hover:text-blue-300" title="Agregar video"><i class="fas fa-video"></i></button>`}
                                        <button onclick="generatePresentation('${course.id}', '${lesson.id}')" class="text-[10px] text-amber-400 hover:text-amber-300" title="Generar presentación"><i class="fas fa-file-powerpoint"></i></button>
                                        <button onclick="editLesson('${course.id}', '${lesson.id}')" class="text-[10px] text-purple-400 hover:text-white" title="Editar"><i class="fas fa-edit"></i></button>
                                        <button onclick="deleteLesson('${course.id}', '${lesson.id}')" class="text-[10px] text-red-400 hover:text-red-300" title="Eliminar"><i class="fas fa-trash"></i></button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    <div class="flex gap-2">
                        <button onclick="viewCourse('${course.id}')" class="flex-1 btn-secondary py-2 rounded-lg text-sm text-purple-300">
                            <i class="fas fa-eye mr-1"></i> Ver
                        </button>
                        <button onclick="addNewLesson('${course.id}')" class="flex-1 btn-spiritual py-2 rounded-lg text-sm" title="Agregar lección">
                            <i class="fas fa-plus mr-1"></i> Lección
                        </button>
                        <button onclick="state.enrollingCourse='${course.id}';state.showEnrollStudent=true;render()" class="btn-secondary py-2 px-3 rounded-lg text-purple-300" title="Inscribir alumno">
                            <i class="fas fa-user-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('')}
    </div>`;
}

function renderTeacherStudents() {
    const myCourses = state.courses.filter(c => c.teacherId === state.user.id);
    
    return `<div>
        <div class="flex justify-between items-center mb-4 flex-wrap gap-4">
            <div class="text-purple-400 text-sm">
                <i class="fas fa-users mr-1"></i> ${state.myStudents.length} alumnos en tu escuela
            </div>
            <button onclick="state.showAddStudent=true;render()" class="btn-spiritual px-4 py-2 rounded-lg text-sm">
                <i class="fas fa-user-plus mr-2"></i> Agregar Alumno
            </button>
        </div>
        
        ${state.myStudents.length === 0 ? `
            <div class="gradient-border">
                <div class="gradient-border-inner p-8 text-center">
                    <div class="text-6xl mb-4">👥</div>
                    <p class="text-purple-400 mb-4">Aún no tienes alumnos registrados</p>
                    <button onclick="state.showAddStudent=true;render()" class="btn-spiritual px-6 py-2 rounded-lg">Agregar primer alumno</button>
                </div>
            </div>
        ` : `
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${state.myStudents.map(student => `
                    <div class="gradient-border card-glow">
                        <div class="gradient-border-inner p-4">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="avatar-ring w-12 h-12">
                                    <div class="w-full h-full rounded-full bg-purple-800 flex items-center justify-center text-2xl">${student.avatar}</div>
                                </div>
                                <div class="flex-1">
                                    <h4 class="text-white font-medium">${student.name}</h4>
                                    <p class="text-purple-400 text-sm">Nivel ${student.level} • ${student.points} pts</p>
                                    <p class="text-purple-500 text-xs">${student.email || ''}</p>
                                </div>
                                <div class="flex flex-col gap-1">
                                    <button onclick="removeStudent('${student.id}')" class="text-red-400 hover:text-red-300 text-sm" title="Remover alumno">
                                        <i class="fas fa-user-minus"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Enrolled courses progress -->
                            ${student.enrolledCourses?.length > 0 ? `
                                <div class="space-y-2 mb-3">
                                    ${student.enrolledCourses.map(c => `
                                        <div class="bg-purple-900/30 rounded-lg p-2">
                                            <div class="flex justify-between text-sm mb-1">
                                                <span class="text-purple-300 truncate flex-1">${c.title}</span>
                                                <span class="text-purple-400 ml-2">${c.progress}%</span>
                                            </div>
                                            <div class="h-1.5 bg-purple-900 rounded-full overflow-hidden">
                                                <div class="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all" style="width: ${c.progress}%"></div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : `
                                <p class="text-purple-500 text-sm text-center mb-3">Sin cursos inscritos</p>
                            `}
                            
                            <!-- Quick enroll dropdown -->
                            ${myCourses.length > 0 ? `
                                <div class="relative">
                                    <select onchange="if(this.value)enrollStudentInCourse('${student.id}', this.value);this.value=''" class="w-full bg-purple-900/50 border border-purple-700/50 rounded-lg px-3 py-2 text-sm text-purple-300 focus:outline-none appearance-none cursor-pointer">
                                        <option value="">📚 Inscribir en curso...</option>
                                        ${myCourses.filter(c => !student.enrolledCourses?.find(ec => ec.id === c.id)).map(c => `
                                            <option value="${c.id}">${c.title}</option>
                                        `).join('')}
                                    </select>
                                    <i class="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 text-xs pointer-events-none"></i>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `}
    </div>`;
}

function renderTeacherStats() {
    const myCourses = state.courses.filter(c => c.teacherId === state.user.id);
    const totalStudents = state.myStudents.length;
    const totalLessons = myCourses.reduce((acc, c) => acc + (c.lessons?.length || 0), 0);
    const totalEnrollments = myCourses.reduce((acc, c) => acc + (c.studentsCount || 0), 0);
    
    return `<div class="grid md:grid-cols-4 gap-6">
        <div class="gradient-border card-glow">
            <div class="gradient-border-inner p-6 text-center">
                <div class="text-4xl font-bold text-white mb-2">${myCourses.length}</div>
                <p class="text-purple-400">Cursos Creados</p>
            </div>
        </div>
        <div class="gradient-border card-glow">
            <div class="gradient-border-inner p-6 text-center">
                <div class="text-4xl font-bold text-white mb-2">${totalLessons}</div>
                <p class="text-purple-400">Lecciones Totales</p>
            </div>
        </div>
        <div class="gradient-border card-glow">
            <div class="gradient-border-inner p-6 text-center">
                <div class="text-4xl font-bold text-white mb-2">${totalStudents}</div>
                <p class="text-purple-400">Alumnos Directos</p>
            </div>
        </div>
        <div class="gradient-border card-glow">
            <div class="gradient-border-inner p-6 text-center">
                <div class="text-4xl font-bold text-white mb-2">${totalEnrollments}</div>
                <p class="text-purple-400">Inscripciones</p>
            </div>
        </div>
    </div>`;
}

function renderAddStudentModal() {
    return `<div class="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4" onclick="if(event.target===this){state.showAddStudent=false;render()}">
        <div class="gradient-border w-full max-w-md slide-up">
            <div class="gradient-border-inner p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-cinzel text-xl text-white">👤 Agregar Alumno</h3>
                    <button onclick="state.showAddStudent=false;render()" class="text-purple-400 hover:text-white"><i class="fas fa-times"></i></button>
                </div>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-purple-300 text-sm mb-2">Email del alumno *</label>
                        <input type="email" id="newStudentEmail" placeholder="alumno@email.com" class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-4 py-3 text-white placeholder-purple-500 focus:outline-none">
                    </div>
                    <div>
                        <label class="block text-purple-300 text-sm mb-2">Nombre (si es nuevo)</label>
                        <input type="text" id="newStudentName" placeholder="Nombre del alumno" class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-4 py-3 text-white placeholder-purple-500 focus:outline-none">
                    </div>
                </div>
                
                <p class="text-purple-500 text-xs mt-4">Si el alumno ya existe, será asignado a tu escuela. Si no existe, se creará una cuenta nueva con contraseña "luz123".</p>
                
                <button onclick="addStudent()" class="w-full btn-spiritual py-3 rounded-xl font-semibold mt-6">Agregar Alumno ✨</button>
            </div>
        </div>
    </div>`;
}

function renderAICourseCreatorModal() {
    return `<div class="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4" onclick="if(event.target===this){state.showCreateCourse=false;state.pendingCourse=null;render()}">
        <div class="gradient-border w-full max-w-5xl max-h-[90vh] overflow-y-auto slide-up">
            <div class="gradient-border-inner">
                <div class="flex justify-between items-center p-6 border-b border-purple-800/30">
                    <h3 class="font-cinzel text-xl text-white">🤖 Crear Curso con IA</h3>
                    <button onclick="state.showCreateCourse=false;state.pendingCourse=null;render()" class="text-purple-400 hover:text-white"><i class="fas fa-times text-xl"></i></button>
                </div>
                
                <!-- Tabs -->
                <div class="flex gap-2 p-4 border-b border-purple-800/30">
                    <button onclick="setCreateCourseTab('ai')" class="tab-btn px-4 py-2 rounded-lg text-sm ${state.createCourseTab === 'ai' ? 'active' : 'bg-purple-900/50 text-purple-300'}">
                        🪄 Generar con IA
                    </button>
                    <button onclick="setCreateCourseTab('upload')" class="tab-btn px-4 py-2 rounded-lg text-sm ${state.createCourseTab === 'upload' ? 'active' : 'bg-purple-900/50 text-purple-300'}">
                        📄 Subir Archivo
                    </button>
                    <button onclick="setCreateCourseTab('manual')" class="tab-btn px-4 py-2 rounded-lg text-sm ${state.createCourseTab === 'manual' ? 'active' : 'bg-purple-900/50 text-purple-300'}">
                        ✏️ Crear Manual
                    </button>
                </div>
                
                <div class="grid lg:grid-cols-2 gap-6 p-6">
                    <!-- AI Chat Panel -->
                    <div class="gradient-border">
                        <div class="gradient-border-inner">
                            <div class="flex items-center gap-3 p-4 border-b border-purple-800/30">
                                <div class="text-2xl">🎓</div>
                                <div>
                                    <h4 class="text-white font-semibold">Asistente de Cursos</h4>
                                    <p class="text-purple-400 text-xs">Te ayudo a crear contenido profesional</p>
                                </div>
                            </div>
                            
                            <div class="h-64 overflow-y-auto p-4 space-y-3" id="aiChatMessages">
                                ${state.aiChatMessages.map(msg => `
                                    <div class="fade-in ${msg.isUser ? 'text-right' : ''}">
                                        <div class="${msg.isUser ? 'bg-purple-600 ml-auto' : 'bg-purple-900/50'} rounded-lg p-3 max-w-[90%] inline-block text-left">
                                            <p class="text-sm text-white whitespace-pre-line">${msg.text.replace(/\*\*(.+?)\*\*/g, '<strong class="text-pink-400">$1</strong>').replace(/•/g, '<br>•')}</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                            
                            <div class="p-4 border-t border-purple-800/30">
                                <div class="flex gap-2">
                                    <input type="text" id="aiChatInput" placeholder="Escribe tu mensaje..." class="flex-1 bg-purple-900/30 rounded-lg px-4 py-2 text-white placeholder-purple-500 focus:outline-none text-sm" onkeypress="if(event.key==='Enter')sendAIMessage()">
                                    <button onclick="sendAIMessage()" class="btn-spiritual px-4 py-2 rounded-lg"><i class="fas fa-paper-plane"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Form Panel -->
                    <div class="space-y-4">
                        ${state.createCourseTab === 'ai' ? `
                            <div class="gradient-border">
                                <div class="gradient-border-inner p-4">
                                    <h4 class="text-white font-semibold mb-4">🪄 Generar Curso Automáticamente</h4>
                                    <div class="space-y-4">
                                        <div>
                                            <label class="block text-purple-300 text-sm mb-2">Tema del curso *</label>
                                            <input type="text" id="courseTopic" placeholder="ej: Tarot para principiantes" class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-4 py-3 text-white placeholder-purple-500 focus:outline-none">
                                        </div>
                                        <div>
                                            <label class="block text-purple-300 text-sm mb-2">Descripción</label>
                                            <textarea id="courseDescription" rows="2" placeholder="Describe brevemente el contenido..." class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-4 py-3 text-white placeholder-purple-500 focus:outline-none resize-none"></textarea>
                                        </div>
                                        <div class="grid grid-cols-3 gap-3">
                                            <div>
                                                <label class="block text-purple-300 text-xs mb-1">Nivel</label>
                                                <select id="courseLevel" class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
                                                    <option value="1">Principiante</option>
                                                    <option value="2">Intermedio</option>
                                                    <option value="3">Avanzado</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label class="block text-purple-300 text-xs mb-1">Duración</label>
                                                <input type="text" id="courseDuration" value="4 semanas" class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
                                            </div>
                                            <div>
                                                <label class="block text-purple-300 text-xs mb-1">Lecciones</label>
                                                <input type="number" id="courseNumLessons" value="4" min="2" max="10" class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
                                            </div>
                                        </div>
                                        <button onclick="generateCourse()" class="w-full btn-spiritual py-3 rounded-xl font-semibold">
                                            <i class="fas fa-magic mr-2"></i> Generar con IA
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                        
                        ${state.createCourseTab === 'upload' ? `
                            <div class="gradient-border">
                                <div class="gradient-border-inner p-4">
                                    <h4 class="text-white font-semibold mb-4">📄 Subir Material</h4>
                                    <div class="space-y-4">
                                        <div>
                                            <label class="block text-purple-300 text-sm mb-2">Título del curso</label>
                                            <input type="text" id="fileCourseTopic" placeholder="Nombre del curso" class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-4 py-3 text-white placeholder-purple-500 focus:outline-none">
                                        </div>
                                        <div>
                                            <label class="block text-purple-300 text-sm mb-2">Archivo (Word, PDF, PowerPoint, TXT)</label>
                                            <input type="file" id="fileUpload" accept=".doc,.docx,.pdf,.ppt,.pptx,.txt" class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-4 py-3 text-white focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-purple-700 file:text-white hover:file:bg-purple-600">
                                        </div>
                                        <div class="bg-purple-900/30 rounded-lg p-4 text-sm">
                                            <p class="text-purple-300 mb-2">📋 El archivo será procesado y convertido en:</p>
                                            <ul class="text-purple-400 space-y-1">
                                                <li>• Lecciones estructuradas con títulos</li>
                                                <li>• Contenido formateado con HTML</li>
                                                <li>• Notas y ejercicios destacados</li>
                                            </ul>
                                        </div>
                                        <button onclick="handleFileUpload()" class="w-full btn-spiritual py-3 rounded-xl font-semibold">
                                            <i class="fas fa-upload mr-2"></i> Procesar Archivo
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                        
                        ${state.createCourseTab === 'manual' ? `
                            <div class="gradient-border">
                                <div class="gradient-border-inner p-4">
                                    <h4 class="text-white font-semibold mb-4">✏️ Crear Curso Manual</h4>
                                    <div class="space-y-4">
                                        <div>
                                            <label class="block text-purple-300 text-sm mb-2">Título *</label>
                                            <input type="text" id="manualCourseTitle" placeholder="Título del curso" class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-4 py-3 text-white placeholder-purple-500 focus:outline-none">
                                        </div>
                                        <div>
                                            <label class="block text-purple-300 text-sm mb-2">Descripción *</label>
                                            <textarea id="manualCourseDesc" rows="3" placeholder="Descripción del curso..." class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-4 py-3 text-white placeholder-purple-500 focus:outline-none resize-none"></textarea>
                                        </div>
                                        <div class="grid grid-cols-2 gap-3">
                                            <div>
                                                <label class="block text-purple-300 text-xs mb-1">Categoría</label>
                                                <select id="manualCourseCategory" class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
                                                    <option value="tarot">🔮 Tarot</option>
                                                    <option value="reiki">🙌 Reiki</option>
                                                    <option value="registros-akashicos">📖 Registros Akáshicos</option>
                                                    <option value="meditacion">🧘 Meditación</option>
                                                    <option value="numerologia">🔢 Numerología</option>
                                                    <option value="general">✨ General</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label class="block text-purple-300 text-xs mb-1">Duración</label>
                                                <input type="text" id="manualCourseDuration" value="4 semanas" class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
                                            </div>
                                        </div>
                                        <button onclick="createManualCourse()" class="w-full btn-spiritual py-3 rounded-xl font-semibold">
                                            <i class="fas fa-plus mr-2"></i> Crear Curso
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                        
                        ${state.pendingCourse ? `
                            <div class="gradient-border">
                                <div class="gradient-border-inner p-4">
                                    <h4 class="text-white font-semibold mb-4">✨ Curso Generado</h4>
                                    <div class="space-y-3">
                                        <div>
                                            <span class="text-purple-400 text-sm">Título:</span>
                                            <p class="text-white font-medium">${state.pendingCourse.title}</p>
                                        </div>
                                        <div>
                                            <span class="text-purple-400 text-sm">Categoría:</span>
                                            <p class="text-white capitalize">${state.pendingCourse.category}</p>
                                        </div>
                                        <div>
                                            <span class="text-purple-400 text-sm">Lecciones (${state.pendingCourse.lessons?.length || 0}):</span>
                                            <ul class="mt-2 space-y-1 max-h-40 overflow-y-auto">
                                                ${state.pendingCourse.lessons?.map((l, i) => `
                                                    <li class="text-purple-300 text-sm flex items-center gap-2">
                                                        <span class="w-5 h-5 rounded-full ${l.type === 'video' ? 'bg-red-900' : l.type === 'practice' ? 'bg-green-900' : 'bg-purple-900'} flex items-center justify-center text-xs">${i+1}</span>
                                                        <span class="truncate">${l.title}</span>
                                                    </li>
                                                `).join('')}
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="flex gap-2 mt-4">
                                        <button onclick="state.pendingCourse=null;render()" class="flex-1 btn-secondary py-2 rounded-lg text-purple-300">Descartar</button>
                                        <button onclick="publishCourse()" class="flex-1 btn-spiritual py-2 rounded-lg">Publicar ✨</button>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

function renderProfile() {
    if (!state.user) return '<p class="text-center text-purple-400">Cargando...</p>';
    
    const enrolledCourses = state.courses.filter(c => c.enrolled);
    
    return `<div class="max-w-4xl mx-auto">
        <div class="gradient-border mb-6">
            <div class="gradient-border-inner p-6">
                <div class="flex items-start gap-6">
                    <div class="avatar-ring w-24 h-24">
                        <div class="w-full h-full rounded-full bg-purple-700 flex items-center justify-center text-5xl">${state.user.avatar}</div>
                    </div>
                    <div class="flex-1">
                        <h1 class="font-cinzel text-2xl text-white mb-1">${state.user.name}</h1>
                        <p class="text-purple-400 mb-2">${state.user.role === 'teacher' ? '✨ Maestro' : '🙏 Alumno'} • Nivel ${state.user.level || 1}</p>
                        <p class="text-purple-300 text-sm mb-4">${state.user.bio || 'Sin biografía'}</p>
                        <div class="flex gap-4 text-sm">
                            <span class="text-purple-400"><strong class="text-white">${state.user.points || 50}</strong> puntos</span>
                            <span class="text-purple-400"><strong class="text-white">${enrolledCourses.length}</strong> cursos</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <h2 class="font-cinzel text-xl text-white mb-4">📚 Mis Cursos</h2>
        ${enrolledCourses.length === 0 ? `
            <div class="gradient-border">
                <div class="gradient-border-inner p-8 text-center">
                    <p class="text-purple-400 mb-4">Aún no te has inscrito en ningún curso</p>
                    <button onclick="setSection('cursos')" class="btn-spiritual px-6 py-2 rounded-lg">Explorar Cursos</button>
                </div>
            </div>
        ` : `
            <div class="grid md:grid-cols-2 gap-4">
                ${enrolledCourses.map(course => `
                    <div class="gradient-border card-glow cursor-pointer" onclick="viewCourse('${course.id}')">
                        <div class="gradient-border-inner p-4 flex gap-4">
                            <img src="${course.image}" alt="${course.title}" class="w-20 h-20 object-cover rounded-lg">
                            <div class="flex-1">
                                <h3 class="text-white font-medium mb-1">${course.title}</h3>
                                <p class="text-purple-400 text-sm mb-2">${course.progress || 0}% completado</p>
                                <div class="h-1 bg-purple-900 rounded-full overflow-hidden">
                                    <div class="h-full bg-gradient-to-r from-purple-500 to-pink-500" style="width: ${course.progress || 0}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `}
    </div>`;
}

function renderChatPanel() {
    if (!state.chatOpen) return '';
    
    const availableGuides = state.guides.filter(g => !g.forTeachers);
    
    return `<div class="fixed right-4 bottom-20 md:bottom-4 w-96 max-w-[calc(100vw-2rem)] z-50">
        <div class="gradient-border">
            <div class="gradient-border-inner">
                <div class="flex items-center justify-between p-4 border-b border-purple-800/50">
                    <div class="flex items-center gap-3">
                        <div class="text-2xl">${state.selectedGuide ? availableGuides.find(g => g.id === state.selectedGuide)?.avatar : '✨'}</div>
                        <div>
                            <h4 class="text-white font-semibold">${state.selectedGuide ? availableGuides.find(g => g.id === state.selectedGuide)?.name : 'Guías Espirituales'}</h4>
                            <p class="text-purple-400 text-xs">${state.selectedGuide ? availableGuides.find(g => g.id === state.selectedGuide)?.specialty : 'Elige tu guía'}</p>
                        </div>
                    </div>
                    <button onclick="toggleChat()" class="text-purple-400 hover:text-white"><i class="fas fa-times"></i></button>
                </div>

                ${!state.selectedGuide ? `
                    <div class="p-4 space-y-3 max-h-80 overflow-y-auto">
                        <p class="text-purple-400 text-sm text-center mb-4">Selecciona un guía espiritual:</p>
                        ${availableGuides.filter(g => g.available).map(guide => `
                            <button onclick="selectGuide('${guide.id}')" class="w-full gradient-border">
                                <div class="gradient-border-inner p-3 flex items-center gap-3 hover:bg-purple-800/30 transition-colors">
                                    <div class="text-3xl">${guide.avatar}</div>
                                    <div class="text-left flex-1">
                                        <h5 class="text-white font-medium">${guide.name}</h5>
                                        <p class="text-purple-400 text-xs">${guide.specialty}</p>
                                    </div>
                                    <i class="fas fa-chevron-right text-purple-500"></i>
                                </div>
                            </button>
                        `).join('')}
                        ${availableGuides.filter(g => !g.available).map(guide => `
                            <div class="gradient-border opacity-50">
                                <div class="gradient-border-inner p-3 flex items-center gap-3">
                                    <div class="text-3xl">${guide.avatar}</div>
                                    <div class="text-left flex-1">
                                        <h5 class="text-white font-medium">${guide.name}</h5>
                                        <p class="text-purple-400 text-xs">🔒 Nivel ${guide.level} requerido</p>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="h-64 overflow-y-auto p-4 space-y-3" id="chatMessages">
                        ${state.chatMessages.map(msg => `
                            <div class="fade-in ${msg.isUser ? 'text-right' : ''}">
                                <div class="${msg.isUser ? 'bg-purple-600 ml-auto' : 'bg-purple-900/50'} rounded-lg p-3 max-w-[80%] inline-block text-left">
                                    <p class="text-sm text-white">${msg.text}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="p-4 border-t border-purple-800/50">
                        <div class="flex gap-2">
                            <button onclick="state.selectedGuide=null;render()" class="text-purple-400 hover:text-white px-2"><i class="fas fa-arrow-left"></i></button>
                            <input type="text" id="chatInput" placeholder="Escribe tu pregunta..." class="flex-1 bg-purple-900/30 rounded-lg px-4 py-2 text-white placeholder-purple-500 focus:outline-none text-sm" onkeypress="if(event.key==='Enter')sendChatMessage()">
                            <button onclick="sendChatMessage()" class="btn-spiritual px-4 py-2 rounded-lg"><i class="fas fa-paper-plane"></i></button>
                        </div>
                    </div>
                `}
            </div>
        </div>
    </div>`;
}

function renderMain() {
    let sectionContent = '';
    switch(state.section) {
        case 'comunidad': sectionContent = renderCommunity(); break;
        case 'cursos': sectionContent = renderCourses(); break;
        case 'mi-escuela': sectionContent = renderMySchool(); break;
        case 'calendario': sectionContent = renderCalendar(); break;
        case 'miembros': sectionContent = renderMembers(); break;
        case 'leaderboard': sectionContent = renderLeaderboard(); break;
        case 'perfil': sectionContent = renderProfile(); break;
        default: sectionContent = renderCommunity();
    }
    
    return `
        ${renderHeader()}
        ${renderMobileNav()}
        <main class="max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-6">${sectionContent}</main>
        ${renderChatPanel()}
    `;
}

// Main Render
function render() {
    const app = $('app');
    if (!app) return;
    
    let content = '';
    
    if (state.user && state.screen !== 'welcome' && state.screen !== 'onboarding-1' && state.screen !== 'onboarding-2') {
        state.screen = 'main';
    }
    
    switch(state.screen) {
        case 'welcome': content = renderWelcome(); break;
        case 'onboarding-1': content = renderOnboarding1(); break;
        case 'onboarding-2': content = renderOnboarding2(); break;
        case 'main': content = renderMain(); break;
        default: content = state.user ? renderMain() : renderWelcome();
    }
    
    // Add modals
    if (state.showLessonEditor && state.editingLesson) {
        content += renderLessonEditorModal();
    }
    if (state.showPresentation && state.presentationSlides.length > 0) {
        content += renderPresentationModal();
    }
    if (state.showEnrollStudent && state.enrollingCourse) {
        content += renderEnrollStudentModal();
    }
    
    app.innerHTML = content;
}

// Lesson Editor Modal
function renderLessonEditorModal() {
    const lesson = state.editingLesson;
    return `<div class="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4" onclick="if(event.target===this)closeLessonEditor()">
        <div class="gradient-border w-full max-w-4xl max-h-[90vh] overflow-y-auto slide-up">
            <div class="gradient-border-inner p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="font-cinzel text-xl text-white">✏️ Editar Lección</h3>
                    <button onclick="closeLessonEditor()" class="text-purple-400 hover:text-white"><i class="fas fa-times text-xl"></i></button>
                </div>
                
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-purple-300 text-sm mb-2">Título *</label>
                            <input type="text" id="editLessonTitle" value="${lesson.title || ''}" class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-4 py-3 text-white focus:outline-none">
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-purple-300 text-sm mb-2">Tipo</label>
                                <select id="editLessonType" class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-4 py-3 text-white focus:outline-none">
                                    <option value="video" ${lesson.type === 'video' ? 'selected' : ''}>🎬 Video</option>
                                    <option value="lesson" ${lesson.type === 'lesson' ? 'selected' : ''}>📖 Lección</option>
                                    <option value="practice" ${lesson.type === 'practice' ? 'selected' : ''}>🎯 Práctica</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-purple-300 text-sm mb-2">Duración</label>
                                <input type="text" id="editLessonDuration" value="${lesson.duration || '30min'}" class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-4 py-3 text-white focus:outline-none">
                            </div>
                        </div>
                        <div>
                            <label class="block text-purple-300 text-sm mb-2">URL Video YouTube (opcional)</label>
                            <input type="text" id="editLessonVideoUrl" value="${lesson.videoUrl || ''}" placeholder="https://youtube.com/watch?v=..." class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-4 py-3 text-white placeholder-purple-500 focus:outline-none">
                            <p class="text-purple-500 text-xs mt-1">El video se embebera automáticamente</p>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-purple-300 text-sm mb-2">Contenido HTML</label>
                        <textarea id="editLessonContent" rows="12" class="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none resize-none">${escapeHtml(lesson.content || '')}</textarea>
                        <div class="mt-2 flex gap-2 flex-wrap">
                            <button onclick="insertTag('h2')" class="text-xs px-2 py-1 bg-purple-900/50 rounded text-purple-300 hover:bg-purple-800/50">&lt;h2&gt;</button>
                            <button onclick="insertTag('h3')" class="text-xs px-2 py-1 bg-purple-900/50 rounded text-purple-300 hover:bg-purple-800/50">&lt;h3&gt;</button>
                            <button onclick="insertTag('p')" class="text-xs px-2 py-1 bg-purple-900/50 rounded text-purple-300 hover:bg-purple-800/50">&lt;p&gt;</button>
                            <button onclick="insertTag('ul')" class="text-xs px-2 py-1 bg-purple-900/50 rounded text-purple-300 hover:bg-purple-800/50">&lt;ul&gt;</button>
                            <button onclick="insertTag('li')" class="text-xs px-2 py-1 bg-purple-900/50 rounded text-purple-300 hover:bg-purple-800/50">&lt;li&gt;</button>
                            <button onclick="insertTag('strong')" class="text-xs px-2 py-1 bg-purple-900/50 rounded text-purple-300 hover:bg-purple-800/50">&lt;strong&gt;</button>
                            <button onclick="insertNoteBox()" class="text-xs px-2 py-1 bg-purple-900/50 rounded text-purple-300 hover:bg-purple-800/50">📋 Nota</button>
                            <button onclick="insertPracticeBox()" class="text-xs px-2 py-1 bg-purple-900/50 rounded text-purple-300 hover:bg-purple-800/50">🎯 Práctica</button>
                        </div>
                    </div>
                </div>
                
                <div class="flex gap-3 mt-6">
                    <button onclick="closeLessonEditor()" class="flex-1 btn-secondary py-3 rounded-xl">Cancelar</button>
                    <button onclick="saveLessonChanges()" class="flex-1 btn-spiritual py-3 rounded-xl font-semibold">Guardar Cambios ✨</button>
                </div>
            </div>
        </div>
    </div>`;
}

// Presentation Modal
function renderPresentationModal() {
    const slides = state.presentationSlides;
    const current = slides[state.currentSlide];
    
    const bgClasses = {
        'gradient-cosmic': 'bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800',
        'gradient-purple': 'bg-gradient-to-br from-purple-800 to-pink-900',
        'gradient-pink': 'bg-gradient-to-br from-pink-800 to-purple-900',
        'gradient-golden': 'bg-gradient-to-br from-amber-700 to-orange-900'
    };
    
    return `<div class="fixed inset-0 bg-black z-50 flex flex-col" onclick="if(event.target===this)closePresentation()">
        <!-- Slide Content -->
        <div class="flex-1 flex items-center justify-center p-8 ${bgClasses[current?.background] || bgClasses['gradient-cosmic']}">
            <div class="max-w-4xl w-full text-center fade-in">
                ${current?.type === 'title' ? `
                    <h1 class="font-cinzel text-5xl md:text-7xl text-white mb-6 glow-text">${current.title}</h1>
                    <p class="text-purple-200 text-2xl">${current.subtitle}</p>
                ` : current?.type === 'bullets' ? `
                    <h2 class="font-cinzel text-3xl md:text-5xl text-white mb-8">${current.title}</h2>
                    <ul class="text-left max-w-2xl mx-auto space-y-4">
                        ${current.points?.map(p => `<li class="text-xl md:text-2xl text-purple-100 flex items-start gap-4"><span class="text-pink-400 mt-1">✨</span><span>${p}</span></li>`).join('')}
                    </ul>
                ` : current?.type === 'text' ? `
                    <h2 class="font-cinzel text-3xl md:text-5xl text-white mb-8">${current.title}</h2>
                    <p class="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed">${current.content}</p>
                ` : current?.type === 'closing' ? `
                    <h1 class="font-cinzel text-5xl md:text-7xl text-white mb-6 glow-text">${current.title}</h1>
                    <p class="text-purple-200 text-2xl">${current.subtitle}</p>
                    <div class="mt-12 text-6xl floating">🙏</div>
                ` : ''}
            </div>
        </div>
        
        <!-- Controls -->
        <div class="bg-black/80 p-4 flex items-center justify-between">
            <button onclick="closePresentation()" class="text-purple-400 hover:text-white px-4 py-2">
                <i class="fas fa-times mr-2"></i>Cerrar
            </button>
            
            <div class="flex items-center gap-2">
                ${slides.map((_, i) => `
                    <button onclick="goToSlide(${i})" class="w-3 h-3 rounded-full transition-all ${i === state.currentSlide ? 'bg-pink-500 scale-125' : 'bg-purple-600 hover:bg-purple-500'}"></button>
                `).join('')}
            </div>
            
            <div class="flex gap-2">
                <button onclick="prevSlide()" class="btn-secondary px-4 py-2 rounded-lg ${state.currentSlide === 0 ? 'opacity-50' : ''}" ${state.currentSlide === 0 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left mr-2"></i>Anterior
                </button>
                <button onclick="nextSlide()" class="btn-spiritual px-4 py-2 rounded-lg ${state.currentSlide === slides.length - 1 ? 'opacity-50' : ''}" ${state.currentSlide === slides.length - 1 ? 'disabled' : ''}>
                    Siguiente<i class="fas fa-chevron-right ml-2"></i>
                </button>
            </div>
        </div>
    </div>`;
}

// Enroll Student Modal
function renderEnrollStudentModal() {
    const course = state.courses.find(c => c.id === state.enrollingCourse);
    return `<div class="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4" onclick="if(event.target===this){state.showEnrollStudent=false;state.enrollingCourse=null;render()}">
        <div class="gradient-border w-full max-w-md slide-up">
            <div class="gradient-border-inner p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-cinzel text-xl text-white">📚 Inscribir Alumno</h3>
                    <button onclick="state.showEnrollStudent=false;state.enrollingCourse=null;render()" class="text-purple-400 hover:text-white"><i class="fas fa-times"></i></button>
                </div>
                
                <p class="text-purple-300 mb-4">Inscribir en: <strong class="text-white">${course?.title}</strong></p>
                
                <div class="space-y-2 max-h-60 overflow-y-auto">
                    ${state.myStudents.filter(s => !course?.enrolledStudents?.includes(s.id)).map(student => `
                        <button onclick="enrollStudentInCourse('${student.id}', '${course?.id}');state.showEnrollStudent=false;state.enrollingCourse=null;render()" class="w-full gradient-border">
                            <div class="gradient-border-inner p-3 flex items-center gap-3 hover:bg-purple-800/30 transition-colors">
                                <span class="text-2xl">${student.avatar}</span>
                                <div class="text-left flex-1">
                                    <p class="text-white">${student.name}</p>
                                    <p class="text-purple-400 text-xs">Nivel ${student.level} • ${student.points} pts</p>
                                </div>
                                <i class="fas fa-plus text-purple-400"></i>
                            </div>
                        </button>
                    `).join('') || '<p class="text-purple-400 text-center py-4">Todos tus alumnos ya están inscritos</p>'}
                </div>
            </div>
        </div>
    </div>`;
}

// Helper functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function insertTag(tag) {
    const textarea = $('editLessonContent');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const newText = text.substring(0, start) + `<${tag}>${selected}</${tag}>` + text.substring(end);
    textarea.value = newText;
    textarea.focus();
    textarea.selectionStart = start + tag.length + 2;
    textarea.selectionEnd = start + tag.length + 2 + selected.length;
}

function insertNoteBox() {
    const textarea = $('editLessonContent');
    if (!textarea) return;
    const template = `<div class="note-box">
<p class="note-title">💡 NOTA IMPORTANTE</p>
<p>Tu nota aquí...</p>
</div>`;
    const pos = textarea.selectionStart;
    textarea.value = textarea.value.substring(0, pos) + template + textarea.value.substring(pos);
    textarea.focus();
}

function insertPracticeBox() {
    const textarea = $('editLessonContent');
    if (!textarea) return;
    const template = `<div class="practice-box">
<p class="practice-title">🎯 EJERCICIO PRÁCTICO</p>
<p>Instrucciones del ejercicio...</p>
</div>`;
    const pos = textarea.selectionStart;
    textarea.value = textarea.value.substring(0, pos) + template + textarea.value.substring(pos);
    textarea.focus();
}

// Initialize
async function init() {
    createStars();
    await fetchData();
    
    if (state.user) {
        state.screen = 'main';
    }
    
    render();
}

init();
