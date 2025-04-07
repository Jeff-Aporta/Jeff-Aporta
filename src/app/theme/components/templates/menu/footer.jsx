import { PaperP } from "@containers";
import { href } from "@jeff-aporta/theme-manager";
import {
  Box,
  Container,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { ImageLocal } from "@recurrent";

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

export default Footer;

function Footer({ updateThemeName, getThemeName }) {
  return (
    <>
      <FooterNavSection />
      <PaperP elevation={0} className="content-container footer">
        <SelectThemeName {...{ getThemeName, updateThemeName }} />
      </PaperP>
    </>
  );
}

function SelectThemeName({ getThemeName, updateThemeName }) {
  return (
    <FormControl style={{ width: "150px" }}>
      <InputLabel id="label-select-theme-name">Nombre tema</InputLabel>
      <Select
        labelId="label-select-theme-name"
        id="select-theme-name"
        value={getThemeName()}
        onChange={(e) => updateThemeName(e.target.value)}
      >
        <MenuItem value="main">Main</MenuItem>
        <MenuItem value="skygreen">Verde cielo</MenuItem>
        <MenuItem value="lemongreen">Verde lima</MenuItem>
        <MenuItem value="springgreen">Verde primavera</MenuItem>
        <MenuItem value="blacknwhite">Blanco y negro</MenuItem>
      </Select>
    </FormControl>
  );
}

function FooterNavSection() {
  return (
    <Paper
      sx={{
        padding: "60px 0 20px",
      }}
    >
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Navegación
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                color="inherit"
                underline="hover"
                href={href("/welcome")}
              >
                Inicio
              </Link>
              <Link color="inherit" underline="hover" href={href("/projects")}>
                Proyectos
              </Link>
              <Link color="inherit" underline="hover" href={href("/skills")}>
                Habilidades
              </Link>
              <Link
                color="inherit"
                underline="hover"
                href={href("/contact")}
              >
                Contacto
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: "right" }}>
              <ImageLocal
                src="/img/logo.jpg"
                alt="Jeffrey Agudelo Logo"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: '50%',
                  objectFit: "cover"
                }}
              />
              <Typography variant="body2" sx={{ mb: 1 }}>
                Jeffrey Agudelo
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Desarrollador Full Stack
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Medellín, Antioquia, Colombia
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                jeffreyagudeloespitia@gmail.com
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mb: 2,
                }}
              >
                <a href="https://github.com/Jeff-Aporta" target="_blank" rel="noopener noreferrer">
                  <img
                    src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                    alt="GitHub"
                    style={{ height: "30px", borderRadius: "4px" }}
                  />
                </a>
                <a href="https://www.linkedin.com/in/jeffrey-agudelo/" target="_blank" rel="noopener noreferrer">
                  <img
                    src="https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Bug.svg.original.svg"
                    alt="LinkedIn"
                    style={{ height: "30px", borderRadius: "4px" }}
                  />
                </a>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Link href="https://www.youtube.com/@JeffAporta" target="_blank" color="inherit">
                  <Box
                    sx={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      bgcolor: "action.hover",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <YouTubeIcon fontSize="small" />
                  </Box>
                </Link>
                <Link href="https://twitter.com/JeffAporta" target="_blank" color="inherit">
                  <Box
                    sx={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      bgcolor: "action.hover",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TwitterIcon fontSize="small" />
                  </Box>
                </Link>
                <Link href="https://www.instagram.com/jeffaporta/" target="_blank" color="inherit">
                  <Box
                    sx={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      bgcolor: "action.hover",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <InstagramIcon fontSize="small" />
                  </Box>
                </Link>
                <Link href="https://www.facebook.com/JeffAporta" target="_blank" color="inherit">
                  <Box
                    sx={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      bgcolor: "action.hover",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FacebookIcon fontSize="small" />
                  </Box>
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Typography
          variant="caption"
          align="center"
          sx={{
            display: "block",
            mt: 4,
            opacity: 0.5,
          }}
        >
          {new Date().getFullYear()} Jeffrey Agudelo – Desarrollador Full Stack.
          Todos los derechos reservados.
        </Typography>
      </Container>
    </Paper>
  );
}
