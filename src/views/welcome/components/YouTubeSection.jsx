import React from "react";
import { Box, Typography, Button, Link } from "@mui/material";
import { PaperP } from "@containers";
import YouTubeIcon from '@mui/icons-material/YouTube';
import { isDark } from "@jeff-aporta/theme-manager";
import { ImageLocal } from "@recurrent";

const YouTubeSection = () => {
  return (
    <Box sx={{ mt: 5, mb: 5, width: "100%" }}>
      <PaperP 
        elevation={0} 
        sx={{ 
          padding: 5, 
          color: 'white',
          borderRadius: '8px',
          position: 'relative',
          overflow: 'hidden',
          width: "100%"
        }}
      >
        <Box className="youtube-decoration" sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.1,
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
          zIndex: 0
        }}></Box>
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 4, 
            flexDirection: { xs: 'column', sm: 'row' },
            maxWidth: "1200px",
            margin: "0 auto"
          }}>
            <Box sx={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              overflow: 'hidden',
              border: '3px solid white',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
              mr: { xs: 0, sm: 2 },
              mb: { xs: 2, sm: 0 }
            }}>
              <ImageLocal 
                src="/img/logo.jpg" 
                alt="Jeffrey Agudelo Logo" 
                sx={{ objectFit: 'cover', borderRadius: '50%' }}  
                imgProps={{ style: { width: '100%', height: '100%' } }}
                fallbackSrc={`https://ui-avatars.com/api/?name=Jeff+Aporta&background=random&color=fff&size=100&bold=true`}
              />
            </Box>
            
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', textAlign: { xs: 'center', sm: 'left' } }}>
                <YouTubeIcon sx={{ fontSize: 40, mr: 1 }} />
                Mi Canal de YouTube
              </Typography>
              
              <Typography variant="h6" color="secondary" sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem', mb: 1 }}>
                www.youtube.com/@JeffAporta
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 2, 
            mb: 3,
            maxWidth: "1200px",
            margin: "0 auto",
            justifyContent: { xs: 'center', md: 'flex-start' },
            mt: 3
          }}>
            <Box sx={{ textAlign: 'center', px: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>1,96K</Typography>
              <Typography variant="body2" sx={{ fontFamily: 'var(--font-secondary)' }}>Suscriptores</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', px: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>87</Typography>
              <Typography variant="body2" sx={{ fontFamily: 'var(--font-secondary)' }}>Videos</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', px: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>264K</Typography>
              <Typography variant="body2" sx={{ fontFamily: 'var(--font-secondary)' }}>Visualizaciones</Typography>
            </Box>
            
            <Box 

            sx={{ 
              textAlign: 'center', 
              px: 2, 
              ml: { xs: 0, md: 'auto' },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'right',
              gap: 2
            }}>
              <Typography variant="body2" color="secondary" sx={{ fontFamily: 'Poppins, sans-serif' }}>
               Me uní el 4 ago 2019
              </Typography>

              <Button 
                variant="contained" 
                color="primary"
                href="https://www.youtube.com/@JeffAporta"
                target="_blank"
                startIcon={<YouTubeIcon />}
                sx={{ 
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontFamily: 'Poppins, sans-serif',
                  mb: 2
                }}
              >
                Visitar Canal
              </Button>
            </Box>
          </Box>
        </Box>
      </PaperP>
    </Box>
  );
};

export default YouTubeSection;
