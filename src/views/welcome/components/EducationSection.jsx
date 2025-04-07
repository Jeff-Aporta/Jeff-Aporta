import React from "react";
import { Box, Typography } from "@mui/material";
import { PaperP } from "@containers";

const EducationSection = () => {
  return (
    <PaperP elevation={3} sx={{ mt: 4, p: 3, borderRadius: "8px" }}>
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
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>INGENIERO DE SISTEMAS</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                bgcolor: "background.paper", 
                px: 2, 
                py: 0.5, 
                borderRadius: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}>
                <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                  Universidad Distrital Francisco José de Caldas
                </Typography>
              </Box>
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                bgcolor: "background.paper", 
                px: 2, 
                py: 0.5, 
                borderRadius: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}>
                <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                  2018 - 2023
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
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>TÉCNICO EN MANTENIMIENTO DE SISTEMAS</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                bgcolor: "background.paper", 
                px: 2, 
                py: 0.5, 
                borderRadius: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}>
                <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                  SENA
                </Typography>
              </Box>
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                bgcolor: "background.paper", 
                px: 2, 
                py: 0.5, 
                borderRadius: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}>
                <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                  2015 - 2017
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </PaperP>
  );
};

export default EducationSection;
