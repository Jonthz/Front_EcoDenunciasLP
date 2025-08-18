import { Link } from "react-router-dom";
import { Box, Container, Typography, Button as MuiButton, Card, CardContent, Grid } from "@mui/material";
import { Leaf, Plus, List, Shield, Trees, Droplets, Mountain } from "lucide-react";

const Home = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'hsl(var(--background))' }}>
      {/* Hero Section */}
      <Box sx={{ 
        background: 'linear-gradient(to bottom right, hsl(var(--primary) / 0.1), hsl(var(--muted) / 0.05), hsl(var(--accent) / 0.1))',
        py: { xs: 10, md: 20 }
      }}>
        <Container maxWidth="lg" sx={{ px: 2, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box sx={{ 
              p: 2, 
              bgcolor: 'hsl(var(--primary) / 0.1)', 
              borderRadius: '50%'
            }}>
              <Leaf style={{ width: 64, height: 64, color: 'hsl(var(--primary))' }} />
            </Box>
          </Box>
          
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '2.25rem', md: '3.75rem' },
              fontWeight: 'bold',
              mb: 3,
              color: 'hsl(var(--foreground))'
            }}
          >
            Eco<Box component="span" sx={{ color: 'hsl(var(--primary))' }}>Denuncia</Box>
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              color: 'hsl(var(--muted-foreground))',
              mb: 4,
              maxWidth: '48rem',
              mx: 'auto'
            }}
          >
            Plataforma ciudadana para la denuncia y seguimiento de delitos ambientales. 
            Juntos protegemos nuestro medio ambiente.
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            gap: 2, 
            justifyContent: 'center' 
          }}>
            <Link to="/crear-denuncia" style={{ textDecoration: 'none' }}>
              <MuiButton 
                variant="contained" 
                size="large"
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontSize: '1.125rem',
                  px: 4,
                  py: 1.5,
                  bgcolor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  '&:hover': {
                    bgcolor: 'hsl(var(--primary) / 0.9)'
                  }
                }}
                startIcon={<Plus style={{ width: 20, height: 20 }} />}
              >
                Crear Nueva Denuncia
              </MuiButton>
            </Link>
            
            <Link to="/denuncias" style={{ textDecoration: 'none' }}>
              <MuiButton 
                variant="outlined"
                size="large"
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontSize: '1.125rem',
                  px: 4,
                  py: 1.5,
                  borderColor: 'hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                  '&:hover': {
                    bgcolor: 'hsl(var(--accent))',
                    borderColor: 'hsl(var(--accent-foreground))'
                  }
                }}
                startIcon={<List style={{ width: 20, height: 20 }} />}
              >
                Ver Denuncias
              </MuiButton>
            </Link>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 10, md: 20 } }}>
        <Container maxWidth="lg" sx={{ px: 2 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontSize: '1.875rem',
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 6,
              color: 'hsl(var(--foreground))'
            }}
          >
            ¿Qué puedes denunciar?
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4
          }}>
            <Card sx={{ 
              textAlign: 'center',
              height: '100%',
              transition: 'box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
              },
              bgcolor: 'hsl(var(--card))',
              borderColor: 'hsl(var(--border))'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: 'hsl(var(--destructive) / 0.1)', 
                    borderRadius: '50%'
                  }}>
                    <Trees style={{ width: 32, height: 32, color: 'hsl(var(--destructive))' }} />
                  </Box>
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'hsl(var(--destructive))',
                    fontWeight: 'bold',
                    mb: 2
                  }}
                >
                  Incendios Forestales
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ color: 'hsl(var(--muted-foreground))' }}
                >
                  Reporta incendios forestales intencionales o negligentes que amenacen nuestros bosques y ecosistemas.
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ 
              textAlign: 'center',
              height: '100%',
              transition: 'box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
              },
              bgcolor: 'hsl(var(--card))',
              borderColor: 'hsl(var(--border))'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: 'hsl(var(--accent) / 0.1)', 
                    borderRadius: '50%'
                  }}>
                    <Droplets style={{ width: 32, height: 32, color: 'hsl(var(--accent))' }} />
                  </Box>
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'hsl(var(--accent))',
                    fontWeight: 'bold',
                    mb: 2
                  }}
                >
                  Contaminación
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ color: 'hsl(var(--muted-foreground))' }}
                >
                  Denuncia contaminación de aguas, suelos o aire que afecte el medio ambiente y la salud pública.
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ 
              textAlign: 'center',
              height: '100%',
              transition: 'box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
              },
              bgcolor: 'hsl(var(--card))',
              borderColor: 'hsl(var(--border))'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: 'hsl(var(--muted) / 0.2)', 
                    borderRadius: '50%'
                  }}>
                    <Mountain style={{ width: 32, height: 32, color: 'hsl(var(--muted-foreground))' }} />
                  </Box>
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'hsl(var(--muted-foreground))',
                    fontWeight: 'bold',
                    mb: 2
                  }}
                >
                  Minería Ilegal
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ color: 'hsl(var(--muted-foreground))' }}
                >
                  Reporta actividades mineras ilegales que dañen el paisaje y contaminen fuentes de agua.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ 
        bgcolor: 'hsl(var(--primary) / 0.05)', 
        py: { xs: 8, md: 16 } 
      }}>
        <Container maxWidth="lg" sx={{ px: 2, textAlign: 'center' }}>
          <Shield 
            style={{ 
              width: 48, 
              height: 48, 
              color: 'hsl(var(--primary))', 
              margin: '0 auto 24px'
            }} 
          />
          <Typography 
            variant="h2" 
            sx={{ 
              fontSize: '1.875rem',
              fontWeight: 'bold',
              mb: 2,
              color: 'hsl(var(--foreground))'
            }}
          >
            Tu voz cuenta
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              fontSize: '1.125rem',
              color: 'hsl(var(--muted-foreground))',
              mb: 4,
              maxWidth: '42rem',
              mx: 'auto'
            }}
          >
            Cada denuncia es un paso hacia la protección de nuestro medio ambiente. 
            Únete a la comunidad de ciudadanos comprometidos con el planeta.
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            gap: 2, 
            justifyContent: 'center' 
          }}>
            <Link to="/crear-denuncia" style={{ textDecoration: 'none' }}>
              <MuiButton 
                variant="contained"
                size="large"
                sx={{ 
                  fontSize: '1.125rem',
                  px: 4,
                  py: 1.5,
                  bgcolor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  '&:hover': {
                    bgcolor: 'hsl(var(--primary) / 0.9)'
                  }
                }}
              >
                Hacer una Denuncia Ahora
              </MuiButton>
            </Link>
            <Link to="/calendario-semanal" style={{ textDecoration: 'none' }}>
              <MuiButton 
                variant="outlined"
                size="large"
                sx={{ 
                  fontSize: '1.125rem',
                  px: 4,
                  py: 1.5,
                  borderColor: 'hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                  '&:hover': {
                    bgcolor: 'hsl(var(--accent))',
                    borderColor: 'hsl(var(--accent-foreground))'
                  }
                }}
              >
                Ver Calendario Semanal
              </MuiButton>
            </Link>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;