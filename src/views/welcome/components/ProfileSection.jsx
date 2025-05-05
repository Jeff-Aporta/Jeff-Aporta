import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Link, 
  Chip, 
  Tooltip, 
  Button, 
  IconButton, 
  Snackbar, 
  Alert,
  Divider
} from "@mui/material";
import { PaperP } from "@containers";
import { ImageLocal } from "@recurrent";
import TelegramIcon from '@mui/icons-material/Telegram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import GitHubIcon from '@mui/icons-material/GitHub';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const ProfileSection = ({ techInfo, getTechIconUrl }) => {
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');

  const handleCopyEmail = () => {
    const email = "jeffrey.alexander.agudelo.espitia@gmail.com";
    navigator.clipboard.writeText(email)
      .then(() => {
        setToastMessage('Correo electrónico copiado al portapapeles');
        setToastSeverity('success');
        setOpenToast(true);
      })
      .catch(() => {
        setToastMessage('No se pudo copiar el correo electrónico');
        setToastSeverity('error');
        setOpenToast(true);
      });
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenToast(false);
  };

  return (
    <Grid item xs={12} md={5}>
      <PaperP
        elevation={0}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 3,
          position: "relative",
          overflow: "auto"
        }}
      >
        <Box component="div" className="decoration-dot-grid"></Box>
        <Box component="div" className="decoration-line"></Box>
        
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="h5" sx={{ mb: 2, fontFamily: 'Poppins, sans-serif', color: 'inherit', fontWeight: 'bold' }}>
            Desarrollador de Software, Senior Vanilla JavaScript, Senior React y MERN Stack
          </Typography>

          <br />
          
          <Box className="profile-image-container" sx={{ width: "200px", height: "200px", margin: "0 auto 20px auto" }}>
            <ImageLocal 
              src="img/profile.jpg" 
              alt="Jeffrey Alexander Agudelo Espitia" 
              className="profile-image"
              fallbackSrc={`https://ui-avatars.com/api/?name=Jeffrey+Alexander&background=random&color=fff&size=200&bold=true`}
            />
          </Box>
          
          {/* Enlaces de redes sociales */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3, mt: 3 }}>
            {/* Redes profesionales */}
            <Tooltip title="LinkedIn">
              <IconButton 
                href="https://www.linkedin.com/in/jeffrey-alexander-agudelo-espitia/" 
                target="_blank"
                sx={{ 
                  bgcolor: '#0A66C2', 
                  color: 'white',
                  '&:hover': { bgcolor: '#084E96' },
                  width: 40,
                  height: 40
                }}
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="GitHub">
              <IconButton 
                href="https://github.com/Jeff-Aporta" 
                target="_blank"
                sx={{ 
                  bgcolor: '#333', 
                  color: 'white',
                  '&:hover': { bgcolor: '#24292e' },
                  width: 40,
                  height: 40
                }}
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            
            {/* Redes sociales */}
            <Tooltip title="Canal de Telegram">
              <Button 
                href="https://t.me/canalAporta" 
                target="_blank"
                size="small"
                startIcon={<TelegramIcon />}
                sx={{ 
                  bgcolor: '#0088cc', 
                  color: 'white',
                  '&:hover': { bgcolor: '#0077b5' },
                  fontSize: '0.75rem',
                  padding: '4px 8px'
                }}
              >
                Canal
              </Button>
            </Tooltip>
            
            <Tooltip title="Grupo Manos al código">
              <Button 
                href="https://t.me/manos_al_codigo" 
                target="_blank"
                size="small"
                startIcon={<TelegramIcon />}
                sx={{ 
                  bgcolor: '#0088cc', 
                  color: 'white',
                  '&:hover': { bgcolor: '#0077b5' },
                  fontSize: '0.75rem',
                  padding: '4px 8px'
                }}
              >
                Grupo
              </Button>
            </Tooltip>
            
            <Tooltip title="WhatsApp">
              <IconButton 
                href="https://wa.link/1tmqmt" 
                target="_blank"
                sx={{ 
                  bgcolor: '#25D366', 
                  color: 'white',
                  '&:hover': { bgcolor: '#128C7E' },
                  width: 40,
                  height: 40
                }}
              >
                <WhatsAppIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="YouTube">
              <IconButton 
                href="https://www.youtube.com/@JeffAporta" 
                target="_blank"
                sx={{ 
                  bgcolor: '#FF0000', 
                  color: 'white',
                  '&:hover': { bgcolor: '#CC0000' },
                  width: 40,
                  height: 40
                }}
              >
                <YouTubeIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <br />
          
          <Typography 
            component="h1" 
            color="secondary"
            sx={{ 
              fontSize: "35px", 
              fontWeight: "700", 
              lineHeight: "1.2", 
              mb: 1,
              "& .highlight": { color: "verde_cielo.main" }
            }}
          >
            <span className="highlight">Jeffrey Alexander</span>
          </Typography>
          
          <Typography 
            component="h2" 
            color="secondary"
            sx={{ 
              fontSize: "28px", 
              fontWeight: "500", 
              lineHeight: "1.2",
              "& .highlight": { color: "verde_cielo.main" }
            }}
          >
            <span className="highlight">Agudelo Espitia</span>
          </Typography>

          <br />
          
          <Tooltip title="Colombia" arrow placement="top">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box 
                component="img" 
                src="https://flagcdn.com/co.svg" 
                alt="Colombia" 
                sx={{ 
                  width: 24, 
                  height: 16, 
                  mr: 1,
                }} 
              />
              <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif', color: 'inherit', fontWeight: 'bold' }}>
                Tuluá - Valle
              </Typography>
            </Box>
          </Tooltip>

          <Box >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box className="stat-card" sx={{ 
                  textAlign: "center",
                  borderRadius: "8px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                  mb: "60px"
                }}>
                  <Typography className="stat-number" sx={{ fontSize: "48px", fontWeight: "800" }}>
                    +7.2
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif', color: 'inherit' }}>
                    Años de experiencia
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Link 
                      href="#experiencia-laboral" 
                      sx={{ 
                        textDecoration: 'none',
                        color: 'primary.main',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Ver experiencia laboral
                    </Link>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 2, 
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    justifyContent: 'space-between'
                  }}>
                    <Chip
                      icon={
                        <Box 
                          component="img" 
                          src="https://www.gstatic.com/images/branding/product/2x/gmail_2020q4_32dp.png" 
                          alt="Gmail" 
                          sx={{ 
                            width: 20, 
                            height: 20,
                            ml: 1
                          }} 
                        />
                      }
                      label="jeffrey.alexander.agudelo.espitia@gmail.com"
                      onClick={handleCopyEmail}
                      deleteIcon={<ContentCopyIcon />}
                      onDelete={handleCopyEmail}
                      sx={{ 
                        fontFamily: 'Poppins, sans-serif',
                        bgcolor: 'white',
                        color: '#333',
                        borderRadius: '4px',
                        py: 2.5,
                        px: 1,
                        '& .MuiChip-deleteIcon': {
                          color: '#DB4437'
                        },
                        flexGrow: 1,
                        maxWidth: { xs: '100%', sm: '60%' }
                      }}
                    />
                    
                    <Chip
                      icon={<WhatsAppIcon />}
                      label="(+57) 3107257814"
                      component="a"
                      href="https://wa.me/573107257814"
                      clickable
                      sx={{ 
                        fontFamily: 'Poppins, sans-serif',
                        bgcolor: '#25D366',
                        color: 'white',
                        '& .MuiChip-icon': { color: 'white' },
                        borderRadius: '4px',
                        py: 2.5,
                        px: 1,
                        flexGrow: 1,
                        maxWidth: { xs: '100%', sm: '35%' }
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </PaperP>
      <Snackbar 
        open={openToast} 
        autoHideDuration={3000} 
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default ProfileSection;
