import React from "react";
import { Box, Typography, Link } from "@mui/material";
import { PaperP } from "@containers";

const ProfessionalDetailsSection = ({ techInfo, getTechIconUrl }) => {
  return (
    <PaperP 
      elevation={4} 
      sx={{ 
        height: "100%", 
        borderRadius: 0,
        padding: 3,
        position: "relative",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}
    >
      <Box sx={{ maxWidth: "600px", margin: "0 auto", fontFamily: 'Poppins, sans-serif', color: 'inherit' }}>
        <Typography paragraph sx={{ fontFamily: 'Poppins, sans-serif', color: 'inherit' }}>
          <strong>Ingeniero de desarrollo de software</strong> con más de 7 años de experiencia en: diseño, desarrollo e implementación de aplicaciones y mantenimiento de software existente. Desarrollador de sistemas con sólidos conocimientos en plataformas <Link href={techInfo.jse.url} target="_blank" rel="noopener noreferrer" sx={{ color: 'inherit', fontWeight: 'bold' }}><strong>JAVA JSE</strong></Link> y <Link href={techInfo.jee.url} target="_blank" rel="noopener noreferrer" sx={{ color: 'inherit', fontWeight: 'bold' }}><strong>JEE</strong></Link>, bases de datos <Link href={techInfo.mysql.url} target="_blank" rel="noopener noreferrer" sx={{ color: 'inherit', fontWeight: 'bold' }}><strong>MySQL</strong></Link> y <Link href={techInfo.postgresql.url} target="_blank" rel="noopener noreferrer" sx={{ color: 'inherit', fontWeight: 'bold' }}><strong>PostgreSQL</strong></Link>, así como en desarrollo web utilizando <Link href={techInfo.html5.url} target="_blank" rel="noopener noreferrer" sx={{ color: 'inherit', fontWeight: 'bold' }}><strong>HTML</strong></Link>, <Link href={techInfo.php.url} target="_blank" rel="noopener noreferrer" sx={{ color: 'inherit', fontWeight: 'bold' }}><strong>PHP</strong></Link>, <Link href={techInfo.js.url} target="_blank" rel="noopener noreferrer" sx={{ color: 'inherit', fontWeight: 'bold' }}><strong>JavaScript</strong></Link>, <Link href={techInfo.jquery.url} target="_blank" rel="noopener noreferrer" sx={{ color: 'inherit', fontWeight: 'bold' }}><strong>jQuery</strong></Link> y <Link href={techInfo.css3.url} target="_blank" rel="noopener noreferrer" sx={{ color: 'inherit', fontWeight: 'bold' }}><strong>CSS</strong></Link>.
        </Typography>
        
        <Typography paragraph sx={{ fontFamily: 'Poppins, sans-serif', color: 'inherit' }}>
          Capacidad para trabajar de forma <strong>AUTÓNOMA</strong> con <strong>INICIATIVA</strong> y eficiencia en la toma de <strong>DECISIONES</strong> para cumplir cronogramas y objetivos. Orientado al <strong>LOGRO</strong> y con habilidades para ofrecer soporte técnico y capacitación a clientes.
        </Typography>
        
        {/* Sección de Educación */}
        <PaperP elevation={0} sx={{ mt: 4, p: 3, borderRadius: "8px" }}>
          <Typography variant="h5" sx={{ mb: 3, textAlign: "center", position: "relative", "&:after": {
            content: '""',
            position: "absolute",
            bottom: "-10px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "60px",
            height: "3px",
            background: "linear-gradient(90deg, #2575fc 0%, #6a11cb 100%)",
            borderRadius: "3px"
          }}}>
            Educación
          </Typography>
          
          <Box sx={{ mt: 5 }}>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ 
                position: "relative", 
                pl: 3, 
                "&:before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "3px",
                  background: "linear-gradient(180deg, #2575fc 0%, #6a11cb 100%)",
                  borderRadius: "3px"
                }
              }}>
                <Typography variant="h6" sx={{ fontFamily: 'Poppins, sans-serif', color: '#2575fc', fontWeight: 'bold' }}>
                  INGENIERO DE SISTEMAS
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
                  <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    padding: "5px 15px", 
                    backgroundColor: "background.paper", 
                    borderRadius: "20px",
                    boxShadow: "0 6px 10px rgba(0,0,0,0.15)",
                    elevation: 6
                  }}>
                    <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif', color: 'inherit' }}>
                      Universitaria
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    padding: "5px 15px", 
                    backgroundColor: "background.paper", 
                    borderRadius: "20px",
                    boxShadow: "0 6px 10px rgba(0,0,0,0.15)",
                    elevation: 6
                  }}>
                    <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif', color: 'inherit' }}>
                      Remington
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    padding: "5px 15px", 
                    backgroundColor: "background.paper", 
                    borderRadius: "20px",
                    boxShadow: "0 6px 10px rgba(0,0,0,0.15)",
                    elevation: 6
                  }}>
                    <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif', color: 'inherit' }}>
                      UTP
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    padding: "5px 15px", 
                    backgroundColor: "background.paper", 
                    borderRadius: "20px",
                    boxShadow: "0 6px 10px rgba(0,0,0,0.15)",
                    elevation: 6
                  }}>
                    <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif', color: 'inherit' }}>
                      Estado: Incompleto
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Box sx={{ 
                position: "relative", 
                pl: 3, 
                "&:before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "3px",
                  background: "linear-gradient(180deg, #2575fc 0%, #6a11cb 100%)",
                  borderRadius: "3px"
                }
              }}>
                <Typography variant="h6" sx={{ fontFamily: 'Poppins, sans-serif', color: '#2575fc', fontWeight: 'bold' }}>
                  TÉCNICO EN MANTENIMIENTO DE SISTEMAS
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
                  <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    padding: "5px 15px", 
                    backgroundColor: "background.paper", 
                    borderRadius: "20px",
                    boxShadow: "0 6px 10px rgba(0,0,0,0.15)",
                    elevation: 6
                  }}>
                    <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif', color: 'inherit' }}>
                      Técnica Laboral
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    padding: "5px 15px", 
                    backgroundColor: "background.paper", 
                    borderRadius: "20px",
                    boxShadow: "0 6px 10px rgba(0,0,0,0.15)",
                    elevation: 6
                  }}>
                    <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif', color: 'inherit' }}>
                      SENA - ARMENIA
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </PaperP>
        
        {/* Sección de Habilidades */}
        <PaperP elevation={0} sx={{ mt: 4, p: 3, borderRadius: "8px" }}>
          <Typography variant="h5" sx={{ mb: 3, textAlign: "center", position: "relative", "&:after": {
            content: '""',
            position: "absolute",
            bottom: "-10px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "60px",
            height: "3px",
            background: "linear-gradient(90deg, #2575fc 0%, #6a11cb 100%)",
            borderRadius: "3px"
          }}}>
            Habilidades
          </Typography>
          
          <Box sx={{ mt: 5, display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
            {/* Primera columna */}
            <Box sx={{ width: { xs: "100%", sm: "48%" } }}>
              <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ 
                  width: "50px", 
                  height: "50px", 
                  bgcolor: "#6c8cff", 
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "20px"
                }}>
                  JS
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Senior</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif', color: 'inherit' }}>JavaScript</Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ 
                  width: "50px", 
                  height: "50px", 
                  bgcolor: "#6c8cff", 
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="white">
                    <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85-1.03 0-1.87-.85-1.87-1.85 0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9-.82-.08-1.63-.2-2.4-.36-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9c-.6 0-1.17 0-1.71.03-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03.6 0 1.17 0 1.71-.03.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68 0 1.69-1.83 2.93-4.37 3.68.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68 0-1.69 1.83-2.93 4.37-3.68-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26 0-.73-1.18-1.63-3.28-2.26-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26 0 .73 1.18 1.63 3.28 2.26.25-.76.55-1.51.89-2.26m9 2.26l-.3.51c.31-.05.61-.1.88-.16-.07-.28-.18-.57-.29-.86l-.29.51m-2.89 4.04c1.59 1.5 2.97 2.08 3.59 1.7.64-.35.83-1.82.32-3.96-.77.16-1.58.28-2.4.36-.48.67-.99 1.31-1.51 1.9M8.08 9.74l.3-.51c-.31.05-.61.1-.88.16.07.28.18.57.29.86l.29-.51m2.89-4.04C9.38 4.2 8 3.62 7.37 4c-.63.36-.82 1.82-.31 3.96a22.7 22.7 0 002.4-.36c.48-.67.99-1.31 1.51-1.9z" />
                  </svg>
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Framework preferido</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif', color: 'inherit' }}>React JS</Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ 
                  width: "50px", 
                  height: "50px", 
                  bgcolor: "#6c8cff", 
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="white">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z"/>
                  </svg>
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Experto</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif', color: 'inherit' }}>Frontend</Typography>
                </Box>
              </Box>
            </Box>
            
            {/* Segunda columna */}
            <Box sx={{ width: { xs: "100%", sm: "48%" } }}>
              <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ 
                  width: "50px", 
                  height: "50px", 
                  bgcolor: "#6c8cff", 
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="white">
                    <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16h-9v-6h9v6z"/>
                  </svg>
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Gran habilidad en</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif', color: 'inherit' }}>Computación Gráfica 2D</Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ 
                  width: "50px", 
                  height: "50px", 
                  bgcolor: "#6c8cff", 
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="white">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2L2 18c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16h-9v-6h9v6z"/>
                  </svg>
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Buen nivel con</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif', color: 'inherit' }}>Estructura de datos</Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ 
                  width: "50px", 
                  height: "50px", 
                  bgcolor: "#6c8cff", 
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="white">
                    <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85-1.03 0-1.87-.85-1.87-1.85 0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9-.82-.08-1.63-.2-2.4-.36-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9c-.6 0-1.17 0-1.71.03-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03.6 0 1.17 0 1.71-.03.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68 0 1.69-1.83 2.93-4.37 3.68.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68 0-1.69 1.83-2.93 4.37-3.68-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26 0-.73-1.18-1.63-3.28-2.26-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26 0 .73 1.18 1.63 3.28 2.26.25-.76.55-1.51.89-2.26m9 2.26l-.3.51c.31-.05.61-.1.88-.16-.07-.28-.18-.57-.29-.86l-.29.51m-2.89 4.04c1.59 1.5 2.97 2.08 3.59 1.7.64-.35.83-1.82.32-3.96-.77.16-1.58.28-2.4.36-.48.67-.99 1.31-1.51 1.9M8.08 9.74l.3-.51c-.31.05-.61.1-.88.16.07.28.18.57.29.86l.29-.51m2.89-4.04C9.38 4.2 8 3.62 7.37 4c-.63.36-.82 1.82-.31 3.96a22.7 22.7 0 002.4-.36c.48-.67.99-1.31 1.51-1.9z" />
                  </svg>
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Apasionado por la</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif', color: 'inherit' }}>Investigación e innovación</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </PaperP>
      </Box>
    </PaperP>
  );
};

export default ProfessionalDetailsSection;
