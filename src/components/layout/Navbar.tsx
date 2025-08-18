import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button as MuiButton,
  Box,
  Container,
  IconButton,
  useTheme
} from "@mui/material";
import { Leaf, Plus, List, Shield, Calendar, Menu } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const theme = useTheme();

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        bgcolor: 'hsl(var(--card))',
        borderBottom: '1px solid hsl(var(--border))',
        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ minHeight: '64px !important', px: { xs: 1, sm: 2 } }}>
          {/* Logo */}
          <Box 
            component={Link} 
            to="/" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <Leaf style={{ width: 32, height: 32, color: 'hsl(var(--primary))' }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold', 
                color: 'hsl(var(--foreground))',
                fontSize: '1.25rem'
              }}
            >
              EcoDenuncia
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center', 
            gap: 1,
            ml: 'auto'
          }}>
            <MuiButton
              component={Link}
              to="/"
              variant={isActive("/") ? "contained" : "text"}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: isActive("/") ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
                bgcolor: isActive("/") ? 'hsl(var(--primary))' : 'transparent',
                '&:hover': {
                  bgcolor: isActive("/") ? 'hsl(var(--primary) / 0.9)' : 'hsl(var(--accent))',
                },
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              <span>Inicio</span>
            </MuiButton>
            
            <MuiButton
              component={Link}
              to="/crear-denuncia"
              variant={isActive("/crear-denuncia") ? "contained" : "text"}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: isActive("/crear-denuncia") ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
                bgcolor: isActive("/crear-denuncia") ? 'hsl(var(--primary))' : 'transparent',
                '&:hover': {
                  bgcolor: isActive("/crear-denuncia") ? 'hsl(var(--primary) / 0.9)' : 'hsl(var(--accent))',
                },
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              <Plus style={{ width: 16, height: 16 }} />
              <span>Nueva Denuncia</span>
            </MuiButton>
            
            <MuiButton
              component={Link}
              to="/denuncias"
              variant={isActive("/denuncias") ? "contained" : "text"}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: isActive("/denuncias") ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
                bgcolor: isActive("/denuncias") ? 'hsl(var(--primary))' : 'transparent',
                '&:hover': {
                  bgcolor: isActive("/denuncias") ? 'hsl(var(--primary) / 0.9)' : 'hsl(var(--accent))',
                },
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              <List style={{ width: 16, height: 16 }} />
              <span>Ver Denuncias</span>
            </MuiButton>
            
            <MuiButton
              component={Link}
              to="/calendario-semanal"
              variant={isActive("/calendario-semanal") ? "contained" : "text"}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: isActive("/calendario-semanal") ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
                bgcolor: isActive("/calendario-semanal") ? 'hsl(var(--primary))' : 'transparent',
                '&:hover': {
                  bgcolor: isActive("/calendario-semanal") ? 'hsl(var(--primary) / 0.9)' : 'hsl(var(--accent))',
                },
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              <Calendar style={{ width: 16, height: 16 }} />
              <span>Calendario</span>
            </MuiButton>
            
            <MuiButton
              component={Link}
              to="/admin"
              variant={isActive("/admin") ? "contained" : "text"}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: isActive("/admin") ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
                bgcolor: isActive("/admin") ? 'hsl(var(--primary))' : 'transparent',
                '&:hover': {
                  bgcolor: isActive("/admin") ? 'hsl(var(--primary) / 0.9)' : 'hsl(var(--accent))',
                },
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              <Shield style={{ width: 16, height: 16 }} />
              <span>Administración</span>
            </MuiButton>
          </Box>

          {/* Mobile menu button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 'auto' }}>
            <IconButton
              sx={{
                color: 'hsl(var(--foreground))',
                '&:hover': {
                  bgcolor: 'hsl(var(--accent))',
                }
              }}
            >
              <Menu style={{ width: 20, height: 20 }} />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;