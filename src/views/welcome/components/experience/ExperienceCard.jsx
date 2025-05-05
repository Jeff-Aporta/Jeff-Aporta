import React from 'react';
import { Box, Typography, Chip, Link, Grid, Tooltip, Paper, Avatar } from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import CodeIcon from '@mui/icons-material/Code';

// Función para obtener la URL de una tecnología
const getTechUrl = (tech) => {
  const techUrls = {
    'JavaScript': 'https://developer.mozilla.org/es/docs/Web/JavaScript',
    'HTML': 'https://developer.mozilla.org/es/docs/Web/HTML',
    'CSS': 'https://developer.mozilla.org/es/docs/Web/CSS',
    'React': 'https://reactjs.org/',
    'React Native': 'https://reactnative.dev/',
    'Node.js': 'https://nodejs.org/',
    'NestJS': 'https://nestjs.com/',
    'Express': 'https://expressjs.com/',
    'Python': 'https://www.python.org/',
    'Java': 'https://www.java.com/',
    'Kotlin': 'https://kotlinlang.org/',
    'JSX': 'https://reactjs.org/docs/introducing-jsx.html',
    'SQL': 'https://en.wikipedia.org/wiki/SQL',
    'MongoDB': 'https://www.mongodb.com/',
    'Firebase': 'https://firebase.google.com/',
    'Git': 'https://git-scm.com/',
    'D3.js': 'https://d3js.org/',
    'P5.js': 'https://p5js.org/',
    'jQuery': 'https://jquery.com/',
    'Bootstrap': 'https://getbootstrap.com/',
    'Material-UI': 'https://mui.com/',
    'TypeScript': 'https://www.typescriptlang.org/',
    'Jest': 'https://jestjs.io/',
    'REST APIs': 'https://en.wikipedia.org/wiki/Representational_state_transfer',
    'Linux server': 'https://en.wikipedia.org/wiki/Linux',
    'PHP': 'https://www.php.net/',
    'Laravel': 'https://laravel.com/',
    'Blockchain': 'https://en.wikipedia.org/wiki/Blockchain',
    'PayPal API': 'https://developer.paypal.com/',
    'Google Maps API': 'https://developers.google.com/maps',
    'Desarrollo web': 'https://en.wikipedia.org/wiki/Web_development'
  };
  
  return techUrls[tech] || `https://www.google.com/search?q=${encodeURIComponent(tech)}`;
};

// Función para obtener el logo de una tecnología
const getTechLogo = (tech) => {
  const techLogos = {
    'JavaScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    'HTML': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
    'CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
    'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    'React Native': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    'NestJS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg',
    'Express': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
    'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    'Java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    'Kotlin': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
    'MongoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
    'Firebase': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
    'Git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
    'jQuery': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jquery/jquery-original.svg',
    'Bootstrap': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',
    'Material-UI': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg',
    'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    'Jest': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg',
    'PHP': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
    'Laravel': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg',
    'Linux': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
    'SQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
    'MySQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
    'PostgreSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    'Desarrollo web': '🌐',
    'JSX': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    'D3.js': 'https://raw.githubusercontent.com/d3/d3-logo/master/d3.svg',
    'P5.js': 'https://p5js.org/assets/img/p5js.svg',
    'Blockchain': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bitcoin/bitcoin-original.svg'
  };
  
  return techLogos[tech] || null;
};

const ExperienceCard = ({ 
  company, 
  position, 
  period, 
  location, 
  modality,
  description,
  responsibilities,
  technologies = [],
  links,
  image,
  imageBgColor
}) => {
  return (
    <Box sx={{ 
      mb: 4, 
      p: 3, 
      borderRadius: '16px',
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <Grid container spacing={3}>
        {/* Lado izquierdo - Imagen y enlaces */}
        <Grid item xs={12} md={4}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            height: '100%',
            position: 'relative'
          }}>
            <Paper 
              elevation={24} 
              sx={{ 
                width: '100%',
                borderRadius: '12px',
                mb: 2,
                overflow: 'hidden'
              }}
            >
              <Box 
                component="img"
                src={image}
                alt={company}
                sx={{
                  width: '100%',
                  height: { xs: '200px', sm: '220px', md: '240px' },
                  maxWidth: '100%',
                  objectFit: 'scale-down',
                  backgroundColor: imageBgColor || 'rgba(255, 255, 255, 0.05)',
                  padding: 2
                }}
              />
            </Paper>
            
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              flexWrap: 'wrap',
              justifyContent: 'center',
              mb: 2
            }}>
              {links?.website && (
                <Tooltip title="Sitio web">
                  <Link href={links.website} target="_blank" rel="noopener noreferrer">
                    <Paper 
                      elevation={24} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        bgcolor: 'primary.main',
                        color: 'white',
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          bgcolor: 'primary.dark'
                        }
                      }}
                    >
                      <LanguageIcon fontSize="small" />
                    </Paper>
                  </Link>
                </Tooltip>
              )}
              
              {links?.youtube && (
                <Tooltip title="YouTube">
                  <Link href={links.youtube} target="_blank" rel="noopener noreferrer">
                    <Paper 
                      elevation={24} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        bgcolor: '#FF0000',
                        color: 'white',
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          bgcolor: '#CC0000'
                        }
                      }}
                    >
                      <YouTubeIcon fontSize="small" />
                    </Paper>
                  </Link>
                </Tooltip>
              )}
              
              {links?.facebook && (
                <Tooltip title="Facebook">
                  <Link href={links.facebook} target="_blank" rel="noopener noreferrer">
                    <Paper 
                      elevation={24} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        bgcolor: '#1877F2',
                        color: 'white',
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          bgcolor: '#0E5FC0'
                        }
                      }}
                    >
                      <FacebookIcon fontSize="small" />
                    </Paper>
                  </Link>
                </Tooltip>
              )}
              
              {links?.linkedin && (
                <Tooltip title="LinkedIn">
                  <Link href={links.linkedin} target="_blank" rel="noopener noreferrer">
                    <Paper 
                      elevation={24} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        bgcolor: '#0A66C2',
                        color: 'white',
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          bgcolor: '#084E96'
                        }
                      }}
                    >
                      <LinkedInIcon fontSize="small" />
                    </Paper>
                  </Link>
                </Tooltip>
              )}
            </Box>
            
            <Typography 
              variant="body2" 
              color="textSecondary" 
              sx={{ 
                fontFamily: 'Poppins, sans-serif',
                textAlign: 'center',
                fontStyle: 'italic'
              }}
            >
              {description}
            </Typography>
          </Box>
        </Grid>
        
        {/* Lado derecho - Información */}
        <Grid item xs={12} md={8}>
          <Box>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 1,
                fontFamily: 'Poppins, sans-serif',
                color: 'inherit'
              }}
            >
              {company}
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2,
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              <Box component="span" sx={{ 
                color: 'secondary.main', 
                fontWeight: 'bold',
                mr: 1,
                fontSize: '0.9rem'
              }}>
                Cargo:
              </Box>
              {position}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              <Chip 
                label={<>
                  <span>Periodo:</span> {period.from} - {period.to}
                </>} 
                size="small"
                sx={{ 
                  fontFamily: 'Poppins, sans-serif',
                  bgcolor: 'rgba(37, 117, 252, 0.1)',
                  color: 'inherit',
                  '& .MuiChip-label': {
                    '& span': {
                      color: 'secondary.main',
                      fontWeight: 'bold'
                    }
                  }
                }}
              />
              <Chip 
                label={<>
                  <span>Modalidad:</span> {location}
                </>} 
                size="small"
                sx={{ 
                  fontFamily: 'Poppins, sans-serif',
                  bgcolor: 'rgba(37, 117, 252, 0.1)',
                  color: 'inherit',
                  '& .MuiChip-label': {
                    '& span': {
                      color: 'secondary.main',
                      fontWeight: 'bold'
                    }
                  }
                }}
              />
              <Chip 
                label={<>
                  <span>Jornada:</span> {modality}
                </>} 
                size="small"
                sx={{ 
                  fontFamily: 'Poppins, sans-serif',
                  bgcolor: 'rgba(37, 117, 252, 0.1)',
                  color: 'inherit',
                  '& .MuiChip-label': {
                    '& span': {
                      color: 'secondary.main',
                      fontWeight: 'bold'
                    }
                  }
                }}
              />
              {period.duration && (
                <Chip 
                  label={<>
                    <span>Experiencia:</span> {period.duration}
                  </>} 
                  size="small"
                  sx={{ 
                    fontFamily: 'Poppins, sans-serif',
                    bgcolor: 'rgba(37, 117, 252, 0.1)',
                    color: 'inherit',
                    '& .MuiChip-label': {
                      '& span': {
                        color: 'secondary.main',
                        fontWeight: 'bold'
                      }
                    }
                  }}
                />
              )}
            </Box>
            
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 1,
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              Responsabilidades:
            </Typography>
            
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              {responsibilities.map((responsibility, index) => (
                <Box 
                  component="li" 
                  key={index}
                  sx={{ 
                    mb: 1,
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  <Typography variant="body2">
                    {responsibility}
                  </Typography>
                </Box>
              ))}
            </Box>
            
            {technologies && technologies.length > 0 && (
              <>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 'bold', 
                    mb: 1,
                    fontFamily: 'Poppins, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <CodeIcon fontSize="small" color="secondary" />
                  Tecnologías:
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {technologies.map((tech, index) => {
                    const techLogo = getTechLogo(tech);
                    
                    return (
                      <Tooltip key={index} title={`Ver más sobre ${tech}`} arrow>
                        <Chip 
                          component="a"
                          href={getTechUrl(tech)}
                          target="_blank"
                          rel="noopener noreferrer"
                          clickable
                          avatar={techLogo ? 
                            <Avatar 
                              src={techLogo} 
                              alt={tech} 
                              sx={{ 
                                bgcolor: 'white',
                                '& img': {
                                  objectFit: 'cover',
                                  p: 0.5
                                }
                              }} 
                            /> : null}
                          label={tech}
                          size="small"
                          sx={{ 
                            fontFamily: 'Poppins, sans-serif',
                            bgcolor: 'rgba(37, 117, 252, 0.1)',
                            color: 'inherit',
                            textDecoration: 'none',
                            '&:hover': {
                              bgcolor: 'rgba(37, 117, 252, 0.2)',
                            }
                          }}
                        />
                      </Tooltip>
                    );
                  })}
                </Box>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExperienceCard;
