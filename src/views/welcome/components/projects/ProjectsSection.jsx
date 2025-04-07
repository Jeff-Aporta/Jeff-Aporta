import React from 'react';
import { Box, Typography, Grid, Button, Card, CardMedia, CardContent, CardActionArea } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { PaperP } from "@containers";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GitHubIcon from '@mui/icons-material/GitHub';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LanguageIcon from '@mui/icons-material/Language';

const ProjectsSection = () => {
  // Lista de proyectos destacados para mostrar en la página de bienvenida
  const featuredProjects = [
    {
      id: 1,
      title: 'Juego de Trivia',
      image: '/img/Proyectos/Juego-trivia-prev.jpg',
      description: 'Juego de preguntas y respuestas con múltiples categorías',
      link: '/projects/trivia',
      youtube: 'https://www.youtube.com/embed/HHDCktzuUCk',
      github: 'juego-trivia-v1',
      demo: 'https://jeff-aporta.github.io/juego-trivia-v1'
    },
    {
      id: 2,
      title: 'Mandelbrot Fractal',
      image: '/img/Proyectos/mandelbrot-prev.jpg',
      description: 'Visualización interactiva del conjunto de Mandelbrot',
      link: '/projects/mandelbrot',
      youtube: 'https://www.youtube.com/embed/SW0dq_DzeWk',
      github: 'algoritmo-mandelbrot',
      demo: 'https://jeff-aporta.github.io/algoritmo-mandelbrot'
    },
    {
      id: 3,
      title: 'Snake Game',
      image: '/img/Proyectos/Snake-game-prev.jpg',
      description: 'Clásico juego de la serpiente con características modernas',
      link: '/projects/snake',
      youtube: 'https://www.youtube.com/embed/wgSjVMmkLC0',
      github: 'juego-snake',
      demo: 'https://jeff-aporta.github.io/juego-snake'
    },
    {
      id: 4,
      title: 'Juego de Conway',
      image: '/img/Proyectos/Juego-conway-prev.jpg',
      description: 'Implementación del Juego de la Vida de Conway',
      link: '/projects/conway',
      youtube: 'https://www.youtube.com/embed/JA3dvpNbUJs',
      github: 'juego-de-la-vida',
      demo: 'https://jeff-aporta.github.io/juego-de-la-vida'
    },
    {
      id: 5,
      title: 'Tetris',
      image: '/img/Proyectos/tetris-prev.jpg',
      description: 'Versión del clásico juego Tetris',
      link: '/projects/tetris',
      youtube: 'https://www.youtube.com/embed/y_rnUOHUoQ4',
      github: 'juego-tetris',
      demo: 'https://jeff-aporta.github.io/juego-tetris'
    },
    {
      id: 6,
      title: 'Pong',
      image: '/img/Proyectos/Pong-prev.jpg',
      description: 'Recreación del primer videojuego de la historia',
      link: '/projects/pong',
      youtube: 'https://www.youtube.com/embed/MCEl05ZbZ80',
      github: 'juego-pong-solitario',
      demo: 'https://jeff-aporta.github.io/juego-pong-solitario'
    }
  ];

  return (
    <PaperP id="proyectos" elevation={0} sx={{ mt: 4, p: 3, borderRadius: "8px" }}>
      <Typography 
        variant="h4" 
        component="h2" 
        align="center"
        gutterBottom
        sx={{ 
          fontWeight: 'bold',
          mb: 4,
          fontFamily: 'Poppins, sans-serif',
          color: 'verde_cielo.main'
        }}
      >
        Proyectos Destacados
      </Typography>
      
      <Grid container spacing={4}>
        {featuredProjects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)'
                },
                margin: '15px 0',
                padding: '20px'
              }}
            >
              <CardActionArea component={RouterLink} to={project.link} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '20px' }}>
                <CardMedia
                  component="img"
                  height="220"
                  image={project.image}
                  alt={project.title}
                  sx={{ objectFit: 'cover', marginBottom: '10px' }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold', marginBottom: '10px', fontFamily: 'Poppins, sans-serif', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {project.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '20px', flexGrow: 1, lineHeight: '1.6' }}>
                    {project.description}
                  </Typography>
                  <Box className="project-actions" sx={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
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
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
        <Button 
          component={RouterLink} 
          to="/projects" 
          variant="contained" 
          color="primary"
          endIcon={<ArrowForwardIcon />}
          fullWidth
          sx={{ 
            borderRadius: '12px',
            fontWeight: 'bold',
            textTransform: 'none',
            py: 2,
            fontSize: '1.2rem',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease',
            maxWidth: '100%',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 12px 20px rgba(0, 0, 0, 0.3)',
            }
          }}
        >
          Ver todos los proyectos
        </Button>
      </Box>
    </PaperP>
  );
};

export default ProjectsSection;
