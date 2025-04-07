import React from 'react';
import { Box, Typography, Chip, Link, Grid, Tooltip } from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';

const ExperienceCard = ({ 
  company, 
  position, 
  period, 
  location, 
  modality,
  description,
  responsibilities,
  links,
  image
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
            <Box 
              component="img"
              src={image}
              alt={company}
              sx={{
                width: '100%',
                maxWidth: '300px',
                height: 'auto',
                borderRadius: '12px',
                mb: 2,
                objectFit: 'contain'
              }}
            />
            
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
                    <Box sx={{ 
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
                    }}>
                      <LanguageIcon fontSize="small" />
                    </Box>
                  </Link>
                </Tooltip>
              )}
              
              {links?.youtube && (
                <Tooltip title="YouTube">
                  <Link href={links.youtube} target="_blank" rel="noopener noreferrer">
                    <Box sx={{ 
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
                    }}>
                      <YouTubeIcon fontSize="small" />
                    </Box>
                  </Link>
                </Tooltip>
              )}
              
              {links?.facebook && (
                <Tooltip title="Facebook">
                  <Link href={links.facebook} target="_blank" rel="noopener noreferrer">
                    <Box sx={{ 
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
                    }}>
                      <FacebookIcon fontSize="small" />
                    </Box>
                  </Link>
                </Tooltip>
              )}
              
              {links?.linkedin && (
                <Tooltip title="LinkedIn">
                  <Link href={links.linkedin} target="_blank" rel="noopener noreferrer">
                    <Box sx={{ 
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
                    }}>
                      <LinkedInIcon fontSize="small" />
                    </Box>
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
                color: 'primary.main'
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
              {position}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              <Chip 
                label={`${period.from} - ${period.to}`} 
                size="small"
                sx={{ 
                  fontFamily: 'Poppins, sans-serif',
                  bgcolor: 'rgba(37, 117, 252, 0.1)',
                  color: 'primary.main'
                }}
              />
              <Chip 
                label={location} 
                size="small"
                sx={{ 
                  fontFamily: 'Poppins, sans-serif',
                  bgcolor: 'rgba(37, 117, 252, 0.1)',
                  color: 'primary.main'
                }}
              />
              <Chip 
                label={modality} 
                size="small"
                sx={{ 
                  fontFamily: 'Poppins, sans-serif',
                  bgcolor: 'rgba(37, 117, 252, 0.1)',
                  color: 'primary.main'
                }}
              />
              {period.duration && (
                <Chip 
                  label={period.duration} 
                  size="small"
                  sx={{ 
                    fontFamily: 'Poppins, sans-serif',
                    bgcolor: 'rgba(37, 117, 252, 0.1)',
                    color: 'primary.main'
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
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExperienceCard;
