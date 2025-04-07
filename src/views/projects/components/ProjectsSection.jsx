import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import ProjectCard from './ProjectCard';

const projectsData = [
  {
    image: "/img/projects/memorama-prev.png",
    title: { icon: "fa-solid fa-brain", title: "Memorama" },
    description: "Juego de memoria donde tienes que encontrar las parejas de cartas iguales.",
    youtube: "https://www.youtube.com/embed/n8ujo9spBR4",
    github: "https://github.com/Jeff-Aporta/memorama",
    demoUrl: "https://jeff-aporta.github.io/memorama",
    language: "js",
    languageColor: "yellow",
  },
  {
    image: "/img/projects/juego-trivia-prev.jpg",
    title: { icon: "fa-regular fa-circle-question", title: "Juego de preguntas" },
    description: "Juego de preguntas y respuestas con diferentes categorías.",
    youtube: "https://www.youtube.com/embed/HHDCktzuUCk",
    github: "https://github.com/Jeff-Aporta/juego-trivia-v1",
    demoUrl: "https://jeff-aporta.github.io/juego-trivia-v1",
    language: "js",
    languageColor: "yellow",
  },
  {
    image: "/img/projects/juego-trivia-v2-prev.jpg",
    title: { icon: "fa-regular fa-circle-question", title: "Juego de preguntas v2" },
    description: "Juego de preguntas y respuestas con diferentes categorías. Segunda versión.",
    youtube: "https://www.youtube.com/embed/HHDCktzuUCk",
    github: "https://github.com/Jeff-Aporta/juego-trivia-v2",
    demoUrl: "https://jeff-aporta.github.io/juego-trivia-v2",
    language: "js",
    languageColor: "yellow",
  },
  {
    image: "/img/projects/buscaminas-prev.jpg",
    title: { icon: "fa-solid fa-puzzle-piece", title: "Buscaminas" },
    description: "Implementación del juego de buscaminas.",
    youtube: "https://www.youtube.com/embed/xwapo6FFhnQ",
    github: "https://github.com/Jeff-Aporta/juego-buscaminas",
    demoUrl: "https://jeff-aporta.github.io/juego-buscaminas",
    language: "js",
    languageColor: "yellow",
  },
  {
    image: "/img/projects/pong-prev.jpg",
    title: { icon: "fa-solid fa-table-tennis-paddle-ball", title: "Pong solitario" },
    description: "Juego de pong para un solo jugador.",
    youtube: "https://www.youtube.com/embed/MCEl05ZbZ80",
    github: "https://github.com/Jeff-Aporta/juego-pong-solitario",
    demoUrl: "https://jeff-aporta.github.io/juego-pong-solitario",
    language: "js",
    languageColor: "yellow",
  },
  {
    image: "/img/projects/juego-conway-prev.jpg",
    title: { icon: "fa-solid fa-infinity", title: "Juego de la vida" },
    description: "Implementación del juego de la vida de Conway.",
    youtube: "https://www.youtube.com/embed/JA3dvpNbUJs",
    github: "https://github.com/Jeff-Aporta/juego-de-la-vida",
    demoUrl: "https://jeff-aporta.github.io/juego-de-la-vida",
    language: "js",
    languageColor: "yellow",
  },
  {
    image: "/img/projects/starfield-prev.jpg",
    title: { icon: "fa-solid fa-film", title: "Starfield" },
    description: "Efecto de campo de estrellas en movimiento, icónico del screensaver de Windows 95.",
    youtube: "https://www.youtube.com/embed/SDnhXcOZiXM",
    github: "https://github.com/Jeff-Aporta/animacion-starfield",
    demoUrl: "https://jeff-aporta.github.io/animacion-starfield",
    language: "js",
    languageColor: "yellow",
  },
  {
    image: "/img/projects/caida-de-nieve-prev.jpg",
    title: { icon: "fa-solid fa-film", title: "Caida de nieve" },
    description: "Efecto de caida de nieve en movimiento.",
    youtube: "https://www.youtube.com/embed/TOPe7fdwUAo",
    github: "https://github.com/Jeff-Aporta/animacion-caida-de-nieve",
    demoUrl: "https://jeff-aporta.github.io/animacion-caida-de-nieve",
    language: "js",
    languageColor: "yellow",
  },
  {
    image: "/img/projects/snake-game-prev.jpg",
    title: { icon: "fa-solid fa-gamepad", title: "Snake game" },
    description: "Implementación básica del juego de la serpiente.",
    youtube: "https://www.youtube.com/embed/wgSjVMmkLC0",
    github: "https://github.com/Jeff-Aporta/juego-snake",
    demoUrl: "https://jeff-aporta.github.io/juego-snake",
    language: "js",
    languageColor: "yellow",
  },
  {
    image: "/img/projects/mandelbrot-prev.jpg",
    title: { icon: "fa-solid fa-infinity", title: "Mandelbrot" },
    description: "Implementación del conjunto de Mandelbrot.",
    youtube: "https://www.youtube.com/embed/SW0dq_DzeWk",
    github: "https://github.com/Jeff-Aporta/algoritmo-mandelbrot",
    demoUrl: "https://jeff-aporta.github.io/algoritmo-mandelbrot",
    language: "js",
    languageColor: "yellow",
  },
  {
    image: "/img/projects/epicicloides-prev.jpg",
    title: { icon: "fa-solid fa-infinity", title: "Epicicloides" },
    description: "Implementación de epicicloides con tablas de multiplicar, una curisidad matemática llevada a la programación.",
    youtube: "https://www.youtube.com/embed/TtQaSRsS2bM",
    github: "https://github.com/Jeff-Aporta/algoritmo-epicicloides-con-tablas-de-multiplicar",
    demoUrl: "https://jeff-aporta.github.io/algoritmo-epicicloides-con-tablas-de-multiplicar",
    language: "js",
    languageColor: "yellow",
  },
  {
    image: "/img/projects/arboles-fractal-prev.jpg",
    title: { icon: "fa-solid fa-infinity", title: "Arboles fractal" },
    description: "Implementación de arboles fractales con recursividad.",
    youtube: "https://www.youtube.com/embed/noe_P35Md5M",
    github: "https://github.com/Jeff-Aporta/algoritmo-arboles-fractal",
    demoUrl: "https://jeff-aporta.github.io/algoritmo-arboles-fractal",
    language: "js",
    languageColor: "yellow",
  },
  {
    image: "/img/projects/tetris-prev.jpg",
    title: { icon: "fa-solid fa-gamepad", title: "Tetris" },
    description: "Implementación básica del juego de tetris.",
    youtube: "https://www.youtube.com/embed/y_rnUOHoQ4",
    github: "https://github.com/Jeff-Aporta/juego-tetris",
    demoUrl: "https://jeff-aporta.github.io/juego-tetris",
    language: "js",
    languageColor: "yellow",
  },
  {
    image: "/img/projects/peces-prev.jpg",
    title: { icon: "fa-solid fa-film", title: "Peces" },
    description: "Efecto de peces animados en un estanque, con vista cenital.",
    youtube: "https://www.youtube.com/embed/0cvC6XRYz24",
    github: "https://github.com/Jeff-Aporta/peces-javascript",
    demoUrl: "https://jeff-aporta.github.io/peces-javascript",
    language: "js",
    languageColor: "yellow",
  },
  {
    image: "/img/projects/tierra-prev.png",
    title: { icon: "fa-solid fa-film", title: "Tierra y luna" },
    description: "Animación de la tierra y la luna en movimiento, con tecnología WebGL para renderizado 3D.",
    youtube: "https://www.youtube.com/embed/ijqsaG5qp3Y",
    github: "https://github.com/Jeff-Aporta/tierra",
    demoUrl: "https://jeff-aporta.github.io/tierra",
    language: "js",
    languageColor: "yellow",
  },
  {
    image: "/img/projects/carros-prev.png",
    title: { icon: "fa-solid fa-car-side", title: "Carros 3D (Three.js)" },
    description: "Juego 3D programado con Three.js, donde hay que acelerar y frenar para no chocar con los carros de la autopista.",
    youtube: "https://www.youtube.com/embed/GKFJajmz_dg",
    github: "https://github.com/Jeff-Aporta/animaci-n-de-carros",
    demoUrl: "https://jeff-aporta.github.io/animaci-n-de-carros",
    language: "js",
    languageColor: "yellow",
  },
];

const ProjectsSection = () => {
  return (
    <Box sx={{ py: 8, px: { xs: 3, md: 6 } }}>
      <Container maxWidth="xl">
        <Typography 
          variant="h2" 
          sx={{ 
            mb: 4, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            fontWeight: 'bold'
          }}
        >
          <i
            className="fa-brands fa-js"
            style={{
              fontSize: '150%',
              color: 'yellow',
            }}
          />
          JavaScript
        </Typography>
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 3,
            justifyContent: { xs: 'center', md: 'flex-start' }
          }}
        >
          {projectsData.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default ProjectsSection;
