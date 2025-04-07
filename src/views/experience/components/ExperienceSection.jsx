import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import ExperienceCard from './ExperienceCard';

const ExperienceSection = () => {
  const experiences = [
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
      image: '/img/experience/registel.png',
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
      image: '/img/experience/iseeci.png',
      links: {
        website: 'https://iseeci.com/es/',
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
        from: 'Enero del 2020',
        to: 'Julio del 2021',
        duration: '(1.2 años)'
      },
      location: 'Pereira - Risaralda',
      modality: 'Híbrido, tiempo completo',
      description: 'Productos y servicios a la medida',
      image: '/img/experience/elcinco.png',
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
    },
    {
      company: 'Desarrollos como Freelancer',
      position: 'Desarrollador de software independiente',
      period: {
        from: '2018',
        to: 'Presente',
        duration: ''
      },
      location: 'Remoto',
      modality: 'Tiempo parcial',
      description: 'Desarrollo de soluciones personalizadas para diversos clientes',
      image: '/img/experience/freelancer.png',
      links: {},
      responsibilities: [
        'Desarrollo de aplicaciones web y móviles para diversos clientes.',
        'Mantenimiento y actualización de sistemas existentes.',
        'Consultoría técnica y asesoramiento en soluciones tecnológicas.',
        'Clientes: Pentagrama, SingleClick Solutions, Registel, Glorias Designer Clothes, Lava en Casa, entre otros.'
      ]
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography 
        variant="h3" 
        component="h2" 
        align="center" 
        gutterBottom
        sx={{ 
          fontWeight: 'bold',
          mb: 6,
          fontFamily: 'Poppins, sans-serif',
          color: 'primary.main'
        }}
      >
        Experiencia Laboral
      </Typography>
      
      <Box>
        {experiences.map((experience, index) => (
          <ExperienceCard 
            key={index}
            {...experience}
          />
        ))}
      </Box>
    </Container>
  );
};

export default ExperienceSection;
