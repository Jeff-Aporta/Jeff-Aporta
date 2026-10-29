/**
 * perfil.ts — quién es Jeffrey: identidad, propuesta de valor, video y contacto.
 * Solo datos: la UI los lee de `contenido/index.ts`, validados con `PerfilSchema`.
 */
export const perfil = {
  nombre: 'Jeffrey Alexander Agudelo Espitia',
  nombreCorto: 'Jeffrey Agudelo',
  iniciales: 'JA',
  titular: 'Desarrollador Full Stack · Estudiante de Ingeniería de Sistemas',
  roles: ['Full Stack', 'Arquitectura frontend', 'APIs y backend', 'IA aplicada', 'Liderazgo técnico'],
  ubicacion: 'Colombia',
  bandera: 'circle-flags:co',
  logo: 'assets/img/logo/jeffrey-agudelo-logo-256.png',
  foto: { src: 'assets/img/perfil/jeffrey-agudelo.jpg', alt: 'Retrato de Jeffrey Agudelo, desarrollador full stack' },
  propuesta: 'Construyo productos web de punta a punta: interfaces impecables, APIs robustas y procesos de entrega que escalan con el negocio.',
  resumen: [
    'Desarrollador full stack con más de 8 años construyendo software para empresas de tecnología, logística, finanzas, comercio y educación.',
    'Especializado en el ecosistema JavaScript/TypeScript (Web Components, React, Svelte, Node.js, Deno, NestJS) y en backend con Python (FastAPI), Java y PHP, con bases de datos relacionales y NoSQL.',
    'Hoy enfocado en Inteligencia Artificial aplicada: chats corporativos con LLM, Model Context Protocol (MCP) y sistemas de componentes UI/UX que aceleran equipos completos.',
  ],
  pilares: [
    { icono: 'mdi:layers-triple-outline', titulo: 'Full stack real', texto: 'Del modelo de datos a la interfaz: APIs REST y GraphQL, tiempo real y despliegue continuo.' },
    { icono: 'mdi:puzzle-outline', titulo: 'Sistemas de diseño', texto: 'Componentes web reutilizables, accesibles y documentados que unifican productos.' },
    { icono: 'mdi:robot-outline', titulo: 'IA aplicada', texto: 'Integración de LLM y MCP en flujos de negocio con resultados medibles.' },
    { icono: 'mdi:account-group-outline', titulo: 'Liderazgo técnico', texto: 'Gestión de proyectos ágiles, estándares de código y formación de equipos.' },
  ],
  video: { youtubeId: '32WdPbuVcdg', titulo: 'Presentación profesional de Jeffrey Agudelo', canal: 'https://www.youtube.com/@JeffAporta' },
  cv: 'assets/docs/jeffrey-agudelo-cv.pdf',
  /** Tarjeta de la hoja de vida: ícono hecho con capturas reales del PDF (`assets/img/cv/`) y su fecha. */
  cvTarjeta: { icono: 'assets/img/cv/cv-icono-256.webp', actualizado: 'octubre de 2026', paginas: 1 },
  contacto: {
    email: 'jeffrey.alexander.agudelo.espitia@gmail.com',
    telefono: '+57 310 725 7814',
    whatsapp: 'https://wa.link/1tmqmt',
    github: 'https://github.com/Jeff-Aporta',
    youtube: 'https://www.youtube.com/@JeffAporta',
  },
};
