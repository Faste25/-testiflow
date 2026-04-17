Eres un experto senior full-stack developer especializado en construir Micro-SaaS rápidos y escalables.

Quiero que me generes **desde cero** un MVP completo de una aplicación llamada **TestiFlow** — una herramienta Automated Testimonial Collector.

**Tech Stack exacta (usa esto):**
- Next.js 15 (App Router) con TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Auth, Database, Storage)
- Stripe (suscripciones + checkout)
- Resend (para emails transaccionales)
- Lucide icons

**Objetivo del MVP:**
Herramienta que permite a freelancers, coaches y pequeños negocios recolectar testimonios (texto + video) automáticamente y generar widgets bonitos para embed en su web.

**Features del MVP (deben estar todas funcionales):**

1. **Auth**
   - Registro e inicio de sesión con email + magic link (Supabase Auth)
   - No permitir acceso sin login

2. **Dashboard principal**
   - Lista de “Espacios” (Campaigns / Walls) que el usuario ha creado
   - Botón para crear nuevo Espacio

3. **Crear Espacio (Campaign)**
   - Nombre del espacio (ej: “Testimonios Curso Fitness”)
   - Descripción opcional
   - URL personalizada del Wall público (ej: testiflow.com/wall/mi-curso)

4. **Formulario público de testimonio** (accesible con link único)
   - Campo nombre
   - Campo texto del testimonio
   - Grabación de video corto directamente en el navegador (usar MediaRecorder API)
   - Botón para enviar

5. **Dashboard del usuario**
   - Lista de todos los testimonios recibidos (con preview de video)
   - Botones para Aprobar / Rechazar cada testimonio
   - Filtros (aprobados / pendientes / rechazados)

6. **Widget Embed Generator**
   - Genera un código HTML/JS listo para copiar
   - Widget tipo “Wall of Love” bonito con carousel (usa Tailwind + simple JS)
   - Muestra foto de perfil (iniciales si no hay), nombre, texto y video (click para reproducir)
   - Diseño moderno y responsive

7. **Pricing & Stripe**
   - Plan Free: máximo 10 testimonios aprobados
   - Plan Pro: $19/mes (ilimitados, sin branding de TestiFlow, prioridad en soporte)
   - Integración completa de Stripe Checkout + webhook para manejar suscripciones

8. **Emails automáticos (Resend)**
   - Email de bienvenida al registrarse
   - Email a los clientes pidiendo testimonio (con link único)
   - Email de confirmación cuando se envía un testimonio

**Estructura de carpetas y archivos** que quiero que generes:
- Estructura completa de proyecto Next.js 15 (app router)
- Schema completo de Supabase (SQL) con todas las tablas necesarias (users, spaces, testimonials, subscriptions, etc.)
- Types de TypeScript
- Todas las rutas (pages + API routes)
- Componentes principales (con shadcn/ui)

**Requisitos extras:**
- Código limpio, bien comentado y listo para producción
- Usa Server Actions donde sea posible
- Seguridad básica (Row Level Security en Supabase)
- Diseño moderno, limpio y profesional (estilo Senja/Famewall)
- Mobile-first

Por favor, genera primero:
1. El schema completo de Supabase (SQL)
2. La estructura completa de carpetas y archivos
3. Luego todo el código necesario, archivo por archivo.

Empieza ya.