import React from 'react';
import { Box, Button, ButtonGroup, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// Componente estilizado para el degradado vertical
const VerticalGradient = styled(Box)(({ opacity = 0.85 }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, ${opacity}))`,
  color: 'white',
  padding: '10px',
  pointerEvents: 'none',
}));

// Componente para el icono redondo
const RoundIcon = styled(Box)(({ backgroundColor = 'rgba(0, 0, 100, 0.7)', padding = '15px', marginRight = '10px' }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  backgroundColor,
  padding,
  marginRight,
  color: 'white',
}));

// Componente para el título del proyecto
const ProjectTitle = ({ icon, title }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <RoundIcon sx={{ mr: 2 }}>
        <i className={icon} />
      </RoundIcon>
      <Typography variant="h6" sx={{ fontWeight: 'light' }}>
        {title}
      </Typography>
    </Box>
  );
};

// Componente principal de la tarjeta de proyecto
const ProjectCard = ({
  image,
  title,
  description,
  youtube,
  github,
  language,
  languageColor,
  demoUrl
}) => {
  // Estilos CSS para animaciones y efectos hover
  const styles = {
    '.project-card': {
      '.project-cover': {
        backgroundSize: '102%',
        transition: 'all 0.5s',
        cursor: 'pointer',

        '.play-button': {
          display: 'none !important',
        },

        '&:hover': {
          '.play-button': {
            display: 'flex !important',
          },
        },
      },

      '&:hover': {
        '.project-cover': {
          backgroundSize: '120%',
          transition: 'all 0.5s',
        },
      },
    },
  };

  return (
    <Box 
      className="project-card"
      sx={{ 
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& .project-cover': {
          backgroundSize: '102%',
          transition: 'all 0.5s',
          cursor: 'pointer',
          '& .play-button': {
            display: 'none',
          },
          '&:hover': {
            backgroundSize: '120%',
            '& .play-button': {
              display: 'flex',
            },
          },
        },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          position: 'relative',
          borderRadius: '30px',
          overflow: 'hidden',
          width: '300px',
          backgroundColor: 'rgba(0, 0, 100, 0.2)',
          mb: 4,
        }}
      >
        <VerticalGradient opacity={0.5} />
        <Box>
          <Box
            className="project-cover"
            sx={{
              position: 'relative',
              backgroundImage: `url("${image}")`,
              backgroundPosition: 'center',
              width: '100%',
              height: '150px',
              zIndex: 0,
            }}
          >
            <VerticalGradient />
            {language && (
              <Box
                sx={{
                  color: languageColor || 'inherit',
                  position: 'absolute',
                  display: 'inline-block',
                  top: '5px',
                  right: '10px',
                  transform: 'scale(0.8)',
                  transformOrigin: 'top right',
                }}
              >
                <RoundIcon 
                  sx={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    padding: '10px',
                    marginRight: 0
                  }}
                >
                  <i className={`fa-brands fa-${language.toLowerCase()}`} />
                </RoundIcon>
              </Box>
            )}
            <Box
              className="play-button"
              sx={{
                position: 'absolute',
                fontSize: '20px',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={() => {
                window.open(demoUrl, '_blank');
              }}
            >
              <RoundIcon
                sx={{
                  backgroundColor: 'rgba(0,0,0,0.65)',
                  padding: '25px',
                  marginRight: 0
                }}
              >
                <i className="fa-solid fa-play" />
              </RoundIcon>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            position: 'relative',
            padding: '30px',
            marginTop: '-60px',
            pointerEvents: 'none',
          }}
        >
          <ProjectTitle icon={title.icon} title={title.title} />

          <Typography
            variant="body2"
            sx={{
              padding: '10px 0',
            }}
          >
            {description}
          </Typography>

          <Box sx={{ height: '90px' }} />
        </Box>

        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            padding: '20px',
          }}
        >
          <Box 
            sx={{ 
              width: '20%', 
              height: '3px', 
              backgroundColor: 'white', 
              margin: '0 auto',
              mb: 2
            }} 
          />

          <Box sx={{ textAlign: 'center' }}>
            <ButtonGroup
              sx={{
                borderRadius: '30px',
                overflow: 'hidden',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                transform: 'scale(0.8)',
              }}
            >
              <Button
                size="small"
                variant="contained"
                onClick={() => {
                  window.open(youtube, '_blank');
                }}
                startIcon={<i className="fa-brands fa-youtube" />}
                sx={{
                  backgroundColor: 'red',
                  '&:hover': {
                    backgroundColor: '#c00',
                  }
                }}
              >
                YouTube
              </Button>
              <Button
                size="small"
                variant="contained"
                href={github}
                target="_blank"
                startIcon={<i className="fa-brands fa-github" />}
                sx={{
                  backgroundColor: 'black',
                  '&:hover': {
                    backgroundColor: '#333',
                  }
                }}
              >
                Github
              </Button>
              <Button
                size="small"
                variant="contained"
                href={demoUrl}
                target="_blank"
                startIcon={<i className="fa-solid fa-globe" />}
                sx={{
                  backgroundColor: 'rgb(0, 30, 80)',
                  '&:hover': {
                    backgroundColor: 'rgb(0, 50, 120)',
                  }
                }}
              >
                Demo
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProjectCard;
