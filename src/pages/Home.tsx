import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Plus, List, Shield, Trees, Droplets, Mountain } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-nature/5 to-accent/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Leaf className="h-16 w-16 text-primary" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Eco<span className="text-primary">Denuncia</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Plataforma ciudadana para la denuncia y seguimiento de delitos ambientales. 
            Juntos protegemos nuestro medio ambiente.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/crear-denuncia">
              <Button size="lg" className="flex items-center space-x-2 text-lg px-8 py-3">
                <Plus className="h-5 w-5" />
                <span>Crear Nueva Denuncia</span>
              </Button>
            </Link>
            
            <Link to="/denuncias">
              <Button variant="outline" size="lg" className="flex items-center space-x-2 text-lg px-8 py-3">
                <List className="h-5 w-5" />
                <span>Ver Denuncias</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">¿Qué puedes denunciar?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-destructive/10 rounded-full">
                    <Trees className="h-8 w-8 text-destructive" />
                  </div>
                </div>
                <CardTitle className="text-destructive">Incendios Forestales</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Reporta incendios forestales intencionales o negligentes que amenacen nuestros bosques y ecosistemas.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-accent/10 rounded-full">
                    <Droplets className="h-8 w-8 text-accent" />
                  </div>
                </div>
                <CardTitle className="text-accent">Contaminación</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Denuncia contaminación de aguas, suelos o aire que afecte el medio ambiente y la salud pública.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-earth/10 rounded-full">
                    <Mountain className="h-8 w-8 text-earth" />
                  </div>
                </div>
                <CardTitle className="text-earth">Minería Ilegal</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Reporta actividades mineras ilegales que dañen el paisaje y contaminen fuentes de agua.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Tu voz cuenta</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Cada denuncia es un paso hacia la protección de nuestro medio ambiente. 
            Únete a la comunidad de ciudadanos comprometidos con el planeta.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/crear-denuncia">
              <Button size="lg" className="text-lg px-8 py-3">
                Hacer una Denuncia Ahora
              </Button>
            </Link>
            <Link to="/calendario-semanal">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Ver Calendario Semanal
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;