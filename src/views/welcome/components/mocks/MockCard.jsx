import React from 'react';
import { 
  Box, 
  Typography, 
  Chip, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Divider, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText 
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const MockCard = ({ 
  name, 
  description, 
  logo, 
  repoUrl, 
  demoUrl, 
  technologies, 
  features,
  bgColor
}) => {
  return (
    <Card 
      elevation={4} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: '12px',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
        }
      }}
    >
      {/* Cabecera con logo */}
      <Box 
        sx={{ 
          bgcolor: bgColor || 'primary.main', 
          p: 3, 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          height: '180px'
        }}
      >
        <Box 
          component="img" 
          src={logo} 
          alt={`${name} Logo`} 
          sx={{ 
            maxWidth: '80%', 
            maxHeight: '120px',
            objectFit: 'contain'
          }} 
        />
      </Box>
      
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography 
          variant="h5" 
          component="h3" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            fontFamily: 'Poppins, sans-serif',
            mb: 4
          }}
        >
          {name}
        </Typography>

        {demoUrl && (
          <Button
            variant="contained"
            startIcon={<LanguageIcon fontSize="small" />}
            href={demoUrl}
            target="_blank"
            size="small"
            sx={{
              mb: 4,
              bgcolor: 'var(--verde-cielo)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0, 150, 136, 0.9)',
                color: 'white'
              }
            }}
          >
            Ver Demo
          </Button>
        )}

        <Typography 
          variant="body2" 
          color="text.secondary" 
          paragraph 
          sx={{ 
            mb: 3,
            fontFamily: 'Poppins, sans-serif',
            minHeight: '80px'
          }}
        >
          {description}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Tecnologías */}
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 'bold', 
            mb: 1,
            fontFamily: 'Poppins, sans-serif'
          }}
        >
          Tecnologías:
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {technologies.map((tech, index) => (
            <Chip 
              key={index} 
              label={tech} 
              size="small" 
              sx={{ 
                fontFamily: 'Poppins, sans-serif',
                bgcolor: 'rgba(25, 118, 210, 0.2)',
                color: "var(--azul-agua)"
              }} 
            />
          ))}
        </Box>
        
        {/* Características */}
        <Typography 
          variant="subtitle2" 
          color="verde_cielo"
          sx={{ 
            fontWeight: 'bold', 
            mb: 1,
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          Características:
        </Typography>
        
        <List dense sx={{ pl: 0 }}>
          {features.map((feature, index) => (
            <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: '30px' }}>
                <CheckCircleOutlineIcon color="verde_cielo" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary={feature} 
                color="verde_cielo"
                primaryTypographyProps={{ 
                  variant: 'body2',
                  fontFamily: 'Poppins, sans-serif'
                }} 
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0 }}>
        {repoUrl && (
          <Button 
            startIcon={<GitHubIcon sx={{ color: 'white' }} />} 
            href={repoUrl} 
            target="_blank" 
            size="small" 
            sx={{ 
              fontFamily: 'Poppins, sans-serif',
              textTransform: 'none',
              bgcolor: '#000000',
              color: 'white',
              '&:hover': {
                bgcolor: '#2f363d',
                color: 'white'
              },
              width: '100%'
            }}
          >
            Repositorio
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default MockCard;
