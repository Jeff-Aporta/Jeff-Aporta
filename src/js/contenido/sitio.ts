/**
 * sitio.ts — metadatos del sitio y secciones de la navegación.
 * `scripts/build/build-meta.ts` escribe con esto el <head> de index.html, sitemap y manifest.
 */
export const sitio = {
  url: 'https://jeff-aporta.github.io/Jeff-Aporta/',
  idioma: 'es-CO',
  titulo: 'Jeffrey Agudelo · Desarrollador Full Stack',
  descripcion: 'Portafolio y hoja de vida de Jeffrey Agudelo, desarrollador full stack: 8+ años con TypeScript, Node.js, Python, .NET e IA aplicada.',
  palabrasClave: ['Jeffrey Agudelo', 'Jeff Aporta', 'desarrollador full stack', 'ingeniería de sistemas', 'TypeScript', 'JavaScript', 'Web Components', 'Node.js', 'React', 'Angular', 'Deno', 'Python', 'FastAPI', 'C#', '.NET', 'AWS', 'Azure', 'inteligencia artificial', 'Model Context Protocol', 'Colombia', 'hoja de vida', 'portafolio', 'blog de programación'],
  imagenOg: { src: 'assets/img/og/portada.png', alt: 'Jeffrey Agudelo — Desarrollador Full Stack' },
  colorTema: '#2563eb',
  /** Token de la etiqueta de verificación de Google Search Console (propiedad de prefijo de URL). */
  verificacionGoogle: 'GpoghZlKIsd4HjpFh18Y4kIS3hkKnfJwI0xFE6-cNf4',
  secciones: [
    { id: 'inicio', titulo: 'Inicio', icono: 'mdi:home-outline' },
    { id: 'perfil', titulo: 'Perfil', icono: 'mdi:account-outline' },
    { id: 'trayectoria', titulo: 'Trayectoria', icono: 'mdi:timeline-outline' },
    { id: 'proyectos', titulo: 'Proyectos', icono: 'mdi:rocket-launch-outline' },
    { id: 'habilidades', titulo: 'Habilidades', icono: 'mdi:tools' },
    { id: 'educacion', titulo: 'Educación', icono: 'mdi:school-outline' },
    { id: 'contacto', titulo: 'Contacto', icono: 'mdi:email-outline' },
  ],
};
