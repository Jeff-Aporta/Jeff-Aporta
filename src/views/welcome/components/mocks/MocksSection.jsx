import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import MockCard from './MockCard';
import { PaperP } from "@containers";

const MocksSection = () => {
  // Datos de los mocks
  const mockProjects = [
    {
      name: 'Army',
      description: 'Aplicación web para la venta de productos tácticos y militares, diseñada para ofrecer equipamiento táctico de alta calidad con años de experiencia en el mercado.',
      logo: 'https://jeff-aporta.github.io/Army/img/logo-main.svg',
      demoUrl: 'https://jeff-aporta.github.io/Army/',
      repoUrl: 'https://github.com/Jeff-Aporta/Army',
      technologies: ['React v19.0.0', 'Node.js v18.x', 'Material-UI v6.4.8'],
      features: [
        'Diseño Moderno y Temática Militar',
        'Tienda Virtual',
        'Gestión de Productos'
      ],
      bgColor: '#2a3b4c'
    },
    {
      name: 'DrTrack',
      description: 'Sistema de Gestión de Historiales Clínicos diseñado para facilitar el trabajo de profesionales de la salud. Permite crear, visualizar y exportar historias clínicas completas en formato PDF.',
      logo: 'https://jeff-aporta.github.io/DrTrack/img/logo-main.svg',
      repoUrl: 'https://github.com/Jeff-Aporta/DrTrack',
      demoUrl: 'https://jeff-aporta.github.io/DrTrack/',
      technologies: ['React v19.0.0', 'Node.js v18.x', 'Material-UI v6.4.8'],
      features: [
        'Gestión de Historiales Clínicos',
        'Exportación a PDF',
        'Interfaz Intuitiva'
      ],
      bgColor: '#008097'
    },
    {
      name: 'FyxToken',
      description: 'Proyecto frontend desarrollado en React para gestión y visualización de tokens digitales. Ofrece una interfaz intuitiva y potente para el seguimiento, análisis y gestión de activos digitales en tiempo real.',
      logo: 'https://jeff-aporta.github.io/Fyxtoken/img/Logo_Fyxtoken_Icono_Color_Principal.svg',
      repoUrl: 'https://github.com/Jeff-Aporta/Fyxtoken',
      demoUrl: 'https://jeff-aporta.github.io/Fyxtoken/',
      technologies: ['React 18', 'Node >=14'],
      features: [
        'Gestión de Tokens',
        'Visualización en Tiempo Real',
        'Interfaz Intuitiva'
      ],
      bgColor: '#2D1B4D'
    },
    {
      name: 'MagnetLab',
      description: 'Agencia especializada en marketing digital que ofrece servicios de publicidad, branding y producción audiovisual para empresas y marcas que buscan visibilidad, posicionamiento y ventas en redes sociales.',
      logo: 'https://jeff-aporta.github.io/MagnetLab/img/logo-main.svg',
      repoUrl: 'https://github.com/Jeff-Aporta/MagnetLab',
      demoUrl: 'https://jeff-aporta.github.io/MagnetLab/',
      technologies: ['React v19.0.0', 'Node.js v18.x', 'Material-UI v6.4.8'],
      features: [
        'Publicidad Digital & Tráfico Pago',
        'Branding y Diseño',
        'Producción Audiovisual'
      ],
      bgColor: '#333333'
    }
  ];

  return (
    <PaperP id="mocks" elevation={0} sx={{ mt: 4, p: 3, borderRadius: "8px" }}>
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
        Mocks y Plantillas
      </Typography>
      
      <Typography 
        variant="body1" 
        sx={{ 
          mb: 4, 
          textAlign: 'center',
          maxWidth: '800px',
          mx: 'auto',
          fontFamily: 'Poppins, sans-serif'
        }}
      >
        Plantillas frontend desarrolladas para empresas y proyectos, mostrando habilidades de diseño y desarrollo de interfaces modernas.
      </Typography>
      
      <Grid container spacing={3}>
        {mockProjects.map((project, index) => (
          <Grid item xs={12} md={6} key={index}>
            <MockCard {...project} />
          </Grid>
        ))}
      </Grid>
    </PaperP>
  );
};

export default MocksSection;
