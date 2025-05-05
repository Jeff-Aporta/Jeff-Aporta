import React from "react";
import { Box, Grid, Typography, Tooltip } from "@mui/material";
import { ThemeSwitcher } from "@templates";
import { DivM } from "@containers";
import { isDark } from "@jeff-aporta/theme-manager";
import JS2CSS from "@jeff-aporta/js2css";

// Importar componentes modularizados
import { 
  ProfileSection, 
  ProfessionalDetailsSection, 
  YouTubeSection,
  ExperienceSection,
  ProjectsSection,
  MocksSection
} from './components';

// Insert custom styles for the welcome page
JS2CSS.insertStyle({
  id: "welcome-page-styles",
  objJs: {
    ".welcome-container": {
      padding: "30px 0",
    },
    ".profile-image-container": {
      position: "relative",
      borderRadius: "50%",
      overflow: "hidden",
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
    },
    ".profile-image": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "50%",
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
    },
    ".decoration-line": {
      position: "absolute",
      bottom: "20px",
      left: "20px",
      width: "100px",
      height: "3px",
      background: "linear-gradient(90deg, #2575fc 0%, #6a11cb 100%)",
      borderRadius: "3px",
      zIndex: "0",
    },
    ".stat-card": {
      padding: "15px",
      textAlign: "center",
      borderRadius: "8px",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    ".stat-number": {
      fontSize: "42px",
      fontWeight: "700",
      color: "var(--verde-cielo)",
      lineHeight: 1.2 
    },
    ".stat-label": {
      fontSize: "14px",
      opacity: "0.8",
    },
    ".contact-info": {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    ".contact-item": {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    ".contact-icon": {
      fontSize: "20px",
    },
    ".tech-icons": {
      display: "flex",
      flexWrap: "wrap",
      gap: "15px",
      justifyContent: "flex-start",
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
    },
    ".main-title": {
      textAlign: "center",
      margin: "30px 0",
      "& .highlight": { 
        color: "var(--verde-cielo)"
      }
    }
  },
});

// Datos de las tecnologías
const techInfo = {
  js: {
    name: "JavaScript",
    url: "https://developer.mozilla.org/es/docs/Web/JavaScript"
  },
  react: {
    name: "React",
    url: "https://es.reactjs.org/"
  },
  html5: {
    name: "HTML5",
    url: "https://developer.mozilla.org/es/docs/Web/HTML"
  },
  css3: {
    name: "CSS3",
    url: "https://developer.mozilla.org/es/docs/Web/CSS"
  },
  nodejs: {
    name: "Node.js",
    url: "https://nodejs.org/es/"
  },
  java: {
    name: "Java",
    url: "https://www.java.com/es/"
  },
  mysql: {
    name: "MySQL",
    url: "https://www.mysql.com/"
  },
  postgresql: {
    name: "PostgreSQL",
    url: "https://www.postgresql.org/"
  },
  excel: {
    name: "Excel",
    url: "https://www.microsoft.com/es-es/microsoft-365/excel"
  },
  php: {
    name: "PHP",
    url: "https://www.php.net/manual/es/intro-whatis.php"
  },
  jquery: {
    name: "jQuery",
    url: "https://jquery.com/"
  },
  jse: {
    name: "Java SE",
    url: "https://www.oracle.com/java/technologies/javase-downloads.html"
  },
  jee: {
    name: "Java EE",
    url: "https://www.oracle.com/java/technologies/javaee-8-sdk-downloads.html"
  }
};

// Función para obtener URLs de iconos de tecnologías
const getTechIconUrl = (tech) => {
  const iconMap = {
    js: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    react: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    html5: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    css3: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    nodejs: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    mysql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    postgresql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    excel: "https://img.icons8.com/color/48/000000/microsoft-excel-2019--v1.png",
    php: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
    jquery: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jquery/jquery-original.svg",
    jse: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    jee: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg"
  };
  
  return iconMap[tech] || `https://ui-avatars.com/api/?name=${tech}&background=random&color=fff&size=30&bold=true`;
};

export default function Welcome() {
  return (
    <ThemeSwitcher bgtype="default" h_init="10px" h_fin="100px">
      <DivM>
        {/* Título principal fuera del contenedor */}
        <Typography 
          variant="h3" 
          className="main-title"
          sx={{ 
            fontSize: { xs: "28px", sm: "35px", md: "42px" },
            fontWeight: "700",
            mb: 4
          }}
        >
          ¡HOLA! Soy <span className="highlight">Jeffrey Agudelo</span>
        </Typography>
        
        {/* Tecnologías */}
        <Box className="tech-icons" sx={{ maxWidth: "800px", margin: "0 auto", padding: "0 20px", mb: 4 }}>
          {['js', 'react', 'html5', 'css3', 'nodejs', 'java', 'mysql', 'postgresql', 'excel', 'php', 'jquery'].map((tech) => (
            <Tooltip 
              key={tech} 
              title={techInfo[tech].name}
              arrow
              placement="top"
            >
              <Box 
                component="a"
                href={techInfo[tech].url}
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}
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
                    bgcolor: (theme) => theme.palette.background.paper // Agregar fondo de paper
                  }}
                >
                  <img src={getTechIconUrl(tech)} alt={techInfo[tech].name} width="30" height="30" />
                </Box>
              </Box>
            </Tooltip>
          ))}
        </Box>
        
        <Box className="welcome-container">
          <Grid container sx={{ minHeight: "100vh" }}>
            {/* Sección de perfil */}
            <ProfileSection techInfo={techInfo} getTechIconUrl={getTechIconUrl} />
            
            {/* Sección de detalles profesionales */}
            <Grid item xs={12} md={7}>
              <ProfessionalDetailsSection techInfo={techInfo} getTechIconUrl={getTechIconUrl} />
            </Grid>
          </Grid>
        </Box>
       
        {/* Sección de YouTube */}
        <YouTubeSection />
        
        {/* Sección de Experiencia Laboral */}
        <ExperienceSection />
        
        {/* Sección de Proyectos */}
        <ProjectsSection />
        
        {/* Sección de Mocks */}
        <MocksSection />
      </DivM>
    </ThemeSwitcher>
  );
}
