import React from "react";
import { Box, Grid, Typography, Button, Paper, Tooltip } from "@mui/material";
import { ThemeSwitcher } from "@templates";
import { DivM, PaperP } from "@containers";
import { Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GitHubIcon from '@mui/icons-material/GitHub';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LanguageIcon from '@mui/icons-material/Language';
import JS2CSS from "@jeff-aporta/js2css";

// Insertar estilos personalizados para la página de proyectos
JS2CSS.insertStyle({
  id: "projects-page-styles",
  objJs: {
    ".welcome-container": {
      padding: "30px 0",
    },
    ".project-card": {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
      transition: "transform 0.3s ease",
      margin: "15px 0",
      padding: "20px",
      "&:hover": {
        transform: "translateY(-5px)",
      }
    },
    ".project-image": {
      width: "100%",
      height: "220px",
      objectFit: "cover",
      borderBottom: "3px solid var(--verde-cielo)",
      marginBottom: "10px"
    },
    ".project-content": {
      padding: "0px",
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      gap: "10px"
    },
    ".project-title": {
      fontWeight: "700",
      marginBottom: "10px",
      fontFamily: "Poppins, sans-serif",
      color: "var(--text-primary)",
      display: "flex",
      alignItems: "center",
      gap: "10px"
    },
    ".project-description": {
      marginBottom: "20px",
      flexGrow: 1,
      lineHeight: "1.6"
    },
    ".project-actions": {
      display: "flex",
      gap: "15px",
      justifyContent: "center"
    },
    ".tech-icon": {
      width: "50px",
      height: "50px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "8px",
      transition: "transform 0.3s ease",
      "&:hover": {
        transform: "translateY(-5px)",
      },
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    ".main-title": {
      textAlign: "center",
      margin: "30px 0",
      fontWeight: "700",
      fontFamily: "Poppins, sans-serif",
      "& .highlight": { 
        color: "var(--verde-cielo)"
      }
    },
    ".decoration-dot-grid": {
      position: "absolute",
      top: "20px",
      right: "20px",
      width: "80px",
      height: "80px",
      backgroundImage: "radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px)",
      backgroundSize: "10px 10px",
      zIndex: "0",
    }
  },
});

// Lista de proyectos
const projectsList = [
  {
    id: 1,
    title: "Memorama",
    image: "/img/Proyectos/Memorama-prev.png",
    description: "Juego de memoria donde tienes que encontrar las parejas de cartas iguales.",
    icon: "fa-solid fa-brain",
    github: "memorama",
    youtube: "https://www.youtube.com/embed/n8ujo9spBR4",
    demo: "https://jeff-aporta.github.io/memorama",
    tech: "js"
  },
  {
    id: 2,
    title: "Juego de Trivia",
    image: "/img/Proyectos/Juego-trivia-prev.jpg",
    description: "Juego interactivo de preguntas y respuestas con múltiples categorías.",
    icon: "fa-regular fa-circle-question",
    github: "juego-trivia-v1",
    youtube: "https://www.youtube.com/embed/HHDCktzuUCk",
    demo: "https://jeff-aporta.github.io/juego-trivia-v1",
    tech: "js"
  },
  {
    id: 3,
    title: "Juego de Trivia V2",
    image: "/img/Proyectos/Juego-Trivia-v2-prev.jpg",
    description: "Juego de preguntas y respuestas con diferentes categorías. Segunda versión.",
    icon: "fa-regular fa-circle-question",
    github: "juego-trivia-v2",
    youtube: "https://www.youtube.com/embed/HHDCktzuUCk",
    demo: "https://jeff-aporta.github.io/juego-trivia-v2",
    tech: "js"
  },
  {
    id: 4,
    title: "Buscaminas",
    image: "/img/Proyectos/Buscaminas-prev.jpg",
    description: "Implementación del clásico juego de buscaminas con diferentes niveles de dificultad.",
    icon: "fa-solid fa-puzzle-piece",
    github: "juego-buscaminas",
    youtube: "https://www.youtube.com/embed/xwapo6FFhnQ",
    demo: "https://jeff-aporta.github.io/juego-buscaminas",
    tech: "js"
  },
  {
    id: 5,
    title: "Pong",
    image: "/img/Proyectos/Pong-prev.jpg",
    description: "Recreación del primer videojuego arcade de la historia con modos para uno y dos jugadores.",
    icon: "fa-solid fa-table-tennis-paddle-ball",
    github: "juego-pong-solitario",
    youtube: "https://www.youtube.com/embed/MCEl05ZbZ80",
    demo: "https://jeff-aporta.github.io/juego-pong-solitario",
    tech: "js"
  },
  {
    id: 6,
    title: "Juego de Conway",
    image: "/img/Proyectos/Juego-conway-prev.jpg",
    description: "Simulación del autómata celular Game of Life con controles de velocidad y patrones.",
    icon: "fa-solid fa-infinity",
    github: "juego-de-la-vida",
    youtube: "https://www.youtube.com/embed/JA3dvpNbUJs",
    demo: "https://jeff-aporta.github.io/juego-de-la-vida",
    tech: "js"
  },
  {
    id: 7,
    title: "Starfield",
    image: "/img/Proyectos/Starfield-prev.jpg",
    description: "Efecto de campo de estrellas en movimiento, icónico del screensaver de Windows 95.",
    icon: "fa-solid fa-film",
    github: "animacion-starfield",
    youtube: "https://www.youtube.com/embed/SDnhXcOZiXM",
    demo: "https://jeff-aporta.github.io/animacion-starfield",
    tech: "js"
  },
  {
    id: 8,
    title: "Caída de Nieve",
    image: "/img/Proyectos/caida-de-nieve-prev.jpg",
    description: "Efecto de caída de nieve en movimiento con partículas animadas.",
    icon: "fa-solid fa-film",
    github: "animacion-caida-de-nieve",
    youtube: "https://www.youtube.com/embed/TOPe7fdwUAo",
    demo: "https://jeff-aporta.github.io/animacion-caida-de-nieve",
    tech: "js"
  },
  {
    id: 9,
    title: "Snake Game",
    image: "/img/Proyectos/Snake-game-prev.jpg",
    description: "Versión moderna del clásico juego de la serpiente con diferentes niveles de dificultad.",
    icon: "fa-solid fa-gamepad",
    github: "juego-snake",
    youtube: "https://www.youtube.com/embed/wgSjVMmkLC0",
    demo: "https://jeff-aporta.github.io/juego-snake",
    tech: "js"
  },
  {
    id: 10,
    title: "Tetris",
    image: "/img/Proyectos/tetris-prev.jpg",
    description: "Implementación del clásico puzzle Tetris con efectos visuales modernos.",
    icon: "fa-solid fa-gamepad",
    github: "juego-tetris",
    youtube: "https://www.youtube.com/embed/y_rnUOHUoQ4",
    demo: "https://jeff-aporta.github.io/juego-tetris",
    tech: "js"
  },
  {
    id: 11,
    title: "Mandelbrot Fractal",
    image: "/img/Proyectos/mandelbrot-prev.jpg",
    description: "Exploración interactiva del conjunto de Mandelbrot con zoom y navegación.",
    icon: "fa-solid fa-infinity",
    github: "algoritmo-mandelbrot",
    youtube: "https://www.youtube.com/embed/SW0dq_DzeWk",
    demo: "https://jeff-aporta.github.io/algoritmo-mandelbrot",
    tech: "js"
  },
  {
    id: 12,
    title: "Epicicloides",
    image: "/img/Proyectos/Epicicloides-prev.jpg",
    description: "Implementación de epicicloides con tablas de multiplicar, una curiosidad matemática.",
    icon: "fa-solid fa-infinity",
    github: "algoritmo-epicicloides-con-tablas-de-multiplicar",
    youtube: "https://www.youtube.com/embed/TtQaSRsS2bM",
    demo: "https://jeff-aporta.github.io/algoritmo-epicicloides-con-tablas-de-multiplicar",
    tech: "js"
  },
  {
    id: 13,
    title: "Árboles Fractal",
    image: "/img/Proyectos/arboles-fractal-prev.jpg",
    description: "Implementación de árboles fractales con recursividad y controles interactivos.",
    icon: "fa-solid fa-infinity",
    github: "algoritmo-arboles-fractal",
    youtube: "https://www.youtube.com/embed/noe_P35Md5M",
    demo: "https://jeff-aporta.github.io/algoritmo-arboles-fractal",
    tech: "js"
  }
];

export default function Projects() {
  return (
    <ThemeSwitcher bgtype="default" h_init="10px" h_fin="100px">
      <DivM>
        {/* Botón de regreso */}
        <Button
          component={RouterLink}
          to="/"
          startIcon={<ArrowBackIcon />}
          variant="contained"
          color="primary"
          sx={{ 
            mb: 4,
            borderRadius: "12px",
            textTransform: "none",
            px: 3,
            py: 1,
            fontWeight: "bold",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)"
            }
          }}
        >
          Volver al Inicio
        </Button>

        {/* Título principal */}
        <Typography 
          variant="h3" 
          className="main-title"
          sx={{ 
            fontSize: { xs: "28px", sm: "35px", md: "42px" },
            mb: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px"
          }}
        >
          <i className="fa-brands fa-js" style={{ fontSize: "150%", color: "yellow" }} />
          <span className="highlight">JavaScript</span> Proyectos
        </Typography>
        
        {/* Tecnologías */}
        <Box sx={{ maxWidth: "800px", margin: "0 auto", padding: "0 20px", mb: 4, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "15px" }}>
          {['js', 'html5', 'css3'].map((tech) => (
            <Tooltip 
              key={tech} 
              title={tech === 'js' ? 'JavaScript' : tech === 'html5' ? 'HTML5' : 'CSS3'}
              arrow
              placement="top"
            >
              <Box 
                sx={{ 
                  width: "50px", 
                  height: "50px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  borderRadius: "8px",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                  },
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  bgcolor: (theme) => theme.palette.background.paper
                }}
              >
                <i className={`fa-brands fa-${tech}`} style={{ fontSize: "30px", color: tech === 'js' ? 'yellow' : tech === 'html5' ? '#E34F26' : '#1572B6' }} />
              </Box>
            </Tooltip>
          ))}
        </Box>

        {/* Contenedor de proyectos */}
        <PaperP elevation={0} sx={{ borderRadius: "8px", p: 3 }}>
          <Grid container spacing={4}>
            {projectsList.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <Paper className="project-card" elevation={3} sx={{ position: "relative" }}>
                  <Box className="decoration-dot-grid" />
                  
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="project-image"
                  />
                  
                  <Box className="project-content" sx={{ padding: "20px" }}>
                    <Typography variant="h6" className="project-title">
                      <i className={project.icon} style={{ fontSize: "20px", color: "var(--verde-cielo)" }} />
                      {project.title}
                    </Typography>
                    
                    <Typography variant="body2" className="project-description" color="text.secondary">
                      {project.description}
                    </Typography>
                    
                    <Box className="project-actions">
                      <Tooltip title="Ver en YouTube" arrow>
                        <Button 
                          variant="contained" 
                          size="small"
                          onClick={() => window.open(project.youtube, '_blank')}
                          sx={{ 
                            minWidth: "40px", 
                            backgroundColor: "red",
                            "&:hover": { backgroundColor: "#cc0000" }
                          }}
                        >
                          <YouTubeIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                      
                      <Tooltip title="Ver código en GitHub" arrow>
                        <Button 
                          variant="contained" 
                          size="small"
                          onClick={() => window.open(`https://github.com/Jeff-Aporta/${project.github}`, '_blank')}
                          sx={{ 
                            minWidth: "40px", 
                            backgroundColor: "#24292e",
                            "&:hover": { backgroundColor: "#000" }
                          }}
                        >
                          <GitHubIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                      
                      <Tooltip title="Ver demo" arrow>
                        <Button 
                          variant="contained" 
                          color="primary"
                          size="small"
                          onClick={() => window.open(project.demo, '_blank')}
                          sx={{ 
                            minWidth: "40px",
                            flex: 1
                          }}
                        >
                          <LanguageIcon fontSize="small" sx={{ mr: 1 }} />
                          Demo
                        </Button>
                      </Tooltip>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </PaperP>
      </DivM>
    </ThemeSwitcher>
  );
}
