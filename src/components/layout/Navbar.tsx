import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Plus, List, Shield, Calendar } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">EcoDenuncia</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                className="flex items-center space-x-2"
              >
                <span>Inicio</span>
              </Button>
            </Link>
            
            <Link to="/crear-denuncia">
              <Button
                variant={isActive("/crear-denuncia") ? "default" : "ghost"}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Nueva Denuncia</span>
              </Button>
            </Link>
            
            <Link to="/denuncias">
              <Button
                variant={isActive("/denuncias") ? "default" : "ghost"}
                className="flex items-center space-x-2"
              >
                <List className="h-4 w-4" />
                <span>Ver Denuncias</span>
              </Button>
            </Link>
            
            <Link to="/calendario-semanal">
              <Button
                variant={isActive("/calendario-semanal") ? "default" : "ghost"}
                className="flex items-center space-x-2"
              >
                <Calendar className="h-4 w-4" />
                <span>Calendario</span>
              </Button>
            </Link>
            
            <Link to="/admin">
              <Button
                variant={isActive("/admin") ? "secondary" : "ghost"}
                className="flex items-center space-x-2"
              >
                <Shield className="h-4 w-4" />
                <span>Administración</span>
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <List className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;