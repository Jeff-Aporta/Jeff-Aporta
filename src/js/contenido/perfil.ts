/**
 * perfil.ts — quién es Jeffrey: identidad, propuesta de valor, video y contacto.
 * Solo datos: la UI los lee de `contenido/index.ts`, validados con `PerfilSchema`.
 */
export const perfil = {
  nombre: 'Jeffrey Alexander Agudelo Espitia',
  nombreCorto: 'Jeffrey Agudelo',
  iniciales: 'JA',
  titular: 'Ingeniero de IA aplicada · Agentes LLM en la nube · Full Stack',
  roles: ['Ingeniería de IA', 'Agentes, RAG y LLM', 'Cloud y serverless', 'Infraestructura y VPS', 'Backend y APIs', 'Full Stack'],
  ubicacion: 'Colombia',
  bandera: 'circle-flags:co',
  logo: 'assets/img/logo/jeffrey-agudelo-logo-256.png',
  foto: { src: 'assets/img/perfil/jeffrey-agudelo.jpg', alt: 'Retrato de Jeffrey Agudelo, desarrollador full stack' },
  propuesta: 'Construyo IA que trabaja en producción: agentes LLM con RAG en la nube, CRM y mensajería automática por bot, y apps auto-mantenibles y autoescalables sobre VPS.',
  resumen: [
    'Ingeniero de IA aplicada y desarrollador full stack con más de 8 años construyendo software para empresas de tecnología, logística, finanzas, comercio y educación.',
    'Especializado en IA en producción: agentes LLM en la nube con Model Context Protocol (MCP) y llamadas a herramientas, RAG con embeddings y pgvector, controladores de prompts, CRM con IA, chatbots y mensajería automática por bot, y voz en tiempo real.',
    'Backend con Node.js, Deno, NestJS y FastAPI (controladores, servicios, patrón cliente-controlador), ORM sobre PostgreSQL y MSSQL, y front con React, Next.js y Svelte. Infraestructura como código: VPS Linux, Docker, CI/CD y serverless en Cloudflare y Azure, con apps auto-mantenibles y autoescalables.',
  ],
  pilares: [
    { icono: 'mdi:brain', titulo: 'IA y agentes', texto: 'Agentes LLM, RAG, MCP y controladores de prompts conectados a los datos del negocio.' },
    { icono: 'mdi:cloud-sync-outline', titulo: 'Cloud y serverless', texto: 'APIs serverless, edge y workers que escalan sin infraestructura que mantener a mano.' },
    { icono: 'mdi:server-network', titulo: 'Infraestructura y VPS', texto: 'Apps auto-mantenibles y autoescalables en VPS Linux, con Docker, CI/CD y monitoreo.' },
    { icono: 'mdi:database-outline', titulo: 'Backend y datos', texto: 'Controladores, ORM y modelos cliente-controlador sobre PostgreSQL, MSSQL y vectores.' },
  ],
  video: { youtubeId: '32WdPbuVcdg', titulo: 'Presentación profesional de Jeffrey Agudelo', canal: 'https://www.youtube.com/@JeffAporta' },
  cv: 'assets/docs/jeffrey-agudelo-cv.pdf',
  /** Tarjeta de la hoja de vida: ícono hecho con capturas reales del PDF (`assets/img/cv/`) y su fecha. */
  cvTarjeta: { icono: 'assets/img/cv/cv-icono-256.webp', actualizado: 'noviembre de 2026', paginas: 2 },
  contacto: {
    email: 'jeffrey.alexander.agudelo.espitia@gmail.com',
    telefono: '+57 310 725 7814',
    whatsapp: 'https://wa.link/1tmqmt',
    github: 'https://github.com/Jeff-Aporta',
    youtube: 'https://www.youtube.com/@JeffAporta',
  },
};
