import React from 'react';
import { Box, Typography, Container, Divider } from '@mui/material';
import ExperienceCard from './ExperienceCard';
import { PaperP } from "@containers";

const ExperienceSection = () => {
  // Experiencias con contrato
  const contractExperiences = [
    {
      company: 'FyxToken',
      position: 'Desarrollador blockchain',
      period: {
        from: 'Marzo del 2025',
        to: 'Marzo del 2026',
        duration: '(1 año)'
      },
      location: 'Remoto',
      modality: 'Tiempo completo',
      description: 'Futuros financieros tokenizados',
      image: '/img/experience/logo-fyxtoken-main-color.svg',
      imageBgColor: '#2D1B4D', // Fondo morado oscuro basado en la imagen
      links: {
        website: 'https://fyxtoken.com/'
      },
      responsibilities: [
        'Desarrollo de interfaces de usuario frontend para la plataforma de tokenización.',
        'Implementación de APIs para la gestión de activos digitales y transacciones.',
        'Integración de APIs externas para ampliar la funcionalidad de la plataforma.',
        'Optimización del rendimiento y experiencia de usuario en la aplicación web.'
      ]
    },
    {
      company: 'REGISTEL SAS',
      position: 'Gestor de proyectos y desarrollador de software',
      period: {
        from: 'Diciembre del 2022',
        to: 'Mayo del 2024',
        duration: '(1.4 años)'
      },
      location: 'Cali - Valle del Cauca',
      modality: 'Presencial, tiempo completo',
      description: 'Información real para soluciones efectivas',
      image: '/img/experience/Registel-logo.png',
      imageBgColor: '#FFFFFF',
      links: {
        website: 'https://registel.co/',
        youtube: 'https://www.youtube.com/@registel',
        facebook: 'https://www.facebook.com/registel',
        linkedin: 'https://www.linkedin.com/in/registel/'
      },
      responsibilities: [
        'Planificar y coordinar proyectos de desarrollo de software.',
        'Definir requerimientos y elaborar cronogramas de trabajo.',
        'Asignar recursos y dar seguimiento al progreso de cada fase del proyecto.',
        'Coordinar reuniones de seguimiento con el equipo y stakeholders.'
      ]
    },
    {
      company: 'ISeeCI',
      position: 'Líder de desarrollo de software',
      period: {
        from: 'Abril del 2021',
        to: 'Julio del 2022',
        duration: '(1.2 años)'
      },
      location: 'Medellín - Antioquia',
      modality: 'Remoto, tiempo completo',
      description: 'Productos y servicios potenciados con IA',
      image: '/img/experience/ISeeCI-logo.svg',
      imageBgColor: '#1a237e', // Azul royal
      links: {
        website: 'https://www.iseeci.com/',
        facebook: 'https://www.facebook.com/iSeeCI',
        linkedin: 'https://www.linkedin.com/company/iseeci/'
      },
      responsibilities: [
        'Analizar y diseñar soluciones técnicas basadas en los requerimientos del proyecto.',
        'Implementar y mantener aplicaciones o sistemas, asegurando la calidad del código.',
        'Realizar pruebas unitarias e integrales para garantizar el correcto funcionamiento de las aplicaciones.',
        'Optimizar y actualizar software existente para mejorar su rendimiento y escalabilidad.'
      ]
    },
    {
      company: 'ELCINCO',
      position: 'Capacitador, área de soporte y mantenimiento',
      period: {
        from: 'Enero del 2019',
        to: 'Marzo del 2020',
        duration: '(1.2 años)'
      },
      location: 'Pereira - Risaralda',
      modality: 'Híbrido, tiempo completo',
      description: 'Productos y servicios a la medida',
      image: '/img/experience/ELCINCO-logo.png',
      imageBgColor: '#FFFFFF',
      links: {
        website: 'https://www.elcinco.io/',
        youtube: 'http://www.youtube.com/@elcinco.io_',
        facebook: 'https://www.facebook.com/centroinnovacion.co',
        linkedin: 'https://www.linkedin.com/company/cinco-innovation-center/'
      },
      responsibilities: [
        'Documentar procesos, desarrollos y cambios en el software para facilitar el mantenimiento.',
        'Colaborar de manera efectiva con otros departamentos y equipos técnicos.',
        'Facilitar la comunicación entre clientes y equipo de desarrollo para ajustar requerimientos y resolver incidencias.'
      ]
    }
  ];

  // Experiencias como freelancer (ordenadas por fecha)
  const freelanceExperiences = [
    {
      company: 'SingleClick Solutions',
      position: 'Desarrollador de software freelancer',
      period: {
        from: 'Marzo del 2019',
        to: 'Diciembre del 2019',
        duration: '(10 meses)'
      },
      location: 'Remoto',
      modality: 'Tiempo parcial',
      description: 'Soluciones digitales para empresas',
      image: '/img/experience/singleclick-logo.png',
      imageBgColor: '#FFFFFF',
      links: {
        website: 'https://singleclick.com.co/'
      },
      responsibilities: [
        'Desarrollo de aplicaciones web responsivas utilizando React y Node.js.',
        'Implementación de interfaces de usuario intuitivas y modernas.',
        'Integración con APIs de terceros para ampliar la funcionalidad de las aplicaciones.',
        'Optimización del rendimiento de aplicaciones existentes.'
      ]
    },
    {
      company: 'Registel (Freelance)',
      position: 'Desarrollador frontend freelancer',
      period: {
        from: 'Enero del 2024',
        to: 'Mayo del 2024',
        duration: '(5 meses)'
      },
      location: 'Remoto',
      modality: 'Proyecto',
      description: 'Desarrollo de interfaces para sistemas de gestión',
      image: '/img/experience/registel-freelancer.png',
      imageBgColor: '#FFFFFF',
      links: {
        website: 'https://registel.co/'
      },
      responsibilities: [
        'Diseño e implementación de interfaces de usuario para sistemas de gestión empresarial.',
        'Desarrollo de componentes reutilizables para agilizar el proceso de desarrollo.',
        'Colaboración con el equipo de backend para integrar servicios y APIs.',
        'Implementación de pruebas unitarias para garantizar la calidad del código.'
      ]
    },
    {
      company: 'Glorias Designer Clothes',
      position: 'Desarrollador web freelancer',
      period: {
        from: 'Enero del 2018',
        to: 'Mayo del 2018',
        duration: '(5 meses)'
      },
      location: 'Remoto',
      modality: 'Proyecto',
      description: 'Tienda online de ropa de diseñador',
      image: '/img/experience/glorias-logo.png',
      imageBgColor: '#FFFFFF',
      links: {
        website: 'https://www.etsy.com/shop/SarafinaDreams'
      },
      responsibilities: [
        'Desarrollo de tienda online con carrito de compras y pasarela de pagos.',
        'Implementación de catálogo de productos con filtros y búsqueda avanzada.',
        'Diseño responsivo para optimizar la experiencia en dispositivos móviles.',
        'Integración con redes sociales para aumentar la visibilidad de la marca.'
      ]
    },
    {
      company: 'Lava en Casa',
      position: 'Desarrollador de aplicación móvil',
      period: {
        from: 'Octubre del 2017',
        to: 'Diciembre del 2017',
        duration: '(3 meses)'
      },
      location: 'Remoto',
      modality: 'Proyecto',
      description: 'Servicio de alquiler de lavadoras a domicilio',
      image: '/img/experience/alquiler-logo.png',
      imageBgColor: '#FFFFFF',
      links: {},
      responsibilities: [
        'Desarrollo de aplicación móvil para gestión de alquiler de lavadoras.',
        'Implementación de sistema de reservas y seguimiento de pedidos.',
        'Diseño de interfaces intuitivas para facilitar el uso por parte de los clientes.',
        'Integración con sistema de pagos y notificaciones en tiempo real.'
      ]
    }
  ];

  return (
    <PaperP id="experiencia-laboral" elevation={0} sx={{ mt: 4, p: 3, borderRadius: "8px" }}>
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
        Experiencia Laboral
      </Typography>
      
      {/* Sección de experiencias con contrato */}
      <Typography 
        variant="h5" 
        component="h3" 
        sx={{ 
          fontWeight: 'bold',
          mb: 3,
          mt: 2,
          fontFamily: 'Poppins, sans-serif',
          color: 'inherit'
        }}
      >
        Experiencias Profesionales
      </Typography>
      <Box>
        {contractExperiences.map((experience, index) => (
          <ExperienceCard 
            key={`contract-${index}`}
            {...experience}
          />
        ))}
      </Box>
      
      <Divider sx={{ my: 5 }} />
      
      {/* Sección de experiencias como freelancer */}
      <Typography 
        variant="h5" 
        component="h3" 
        sx={{ 
          fontWeight: 'bold',
          mb: 3,
          fontFamily: 'Poppins, sans-serif',
          color: 'inherit'
        }}
      >
        Proyectos Freelance
      </Typography>
      <Box>
        {freelanceExperiences.map((experience, index) => (
          <ExperienceCard 
            key={`freelance-${index}`}
            {...experience}
          />
        ))}
      </Box>
    </PaperP>
  );
};

export default ExperienceSection;
