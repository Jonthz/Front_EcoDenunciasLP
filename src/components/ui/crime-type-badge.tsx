import { cn } from "@/lib/utils";
import { Flame, Droplets, Mountain, AlertTriangle, Trees, Trash2, Volume2 } from "lucide-react";

interface CrimeTypeBadgeProps {
  type: "contaminacion_agua" | "contaminacion_aire" | "deforestacion" | "manejo_residuos" | "ruido_excesivo" | "contaminacion_suelo" | "otros" | "incendio" | "contaminacion" | "mineria_ilegal" | "otro";
  className?: string;
  showIcon?: boolean;
}

const CrimeTypeBadge = ({ type, className, showIcon = true }: CrimeTypeBadgeProps) => {
  const getTypeConfig = (type: string) => {
    switch (type) {
      case "contaminacion_agua":
        return {
          label: "Contaminación de Agua",
          icon: Droplets,
          className: "bg-blue-100 text-blue-800 border-blue-200"
        };
      case "contaminacion_aire":
        return {
          label: "Contaminación de Aire",
          icon: AlertTriangle,
          className: "bg-gray-100 text-gray-800 border-gray-200"
        };
      case "deforestacion":
        return {
          label: "Deforestación",
          icon: Trees,
          className: "bg-green-100 text-green-800 border-green-200"
        };
      case "manejo_residuos":
        return {
          label: "Manejo de Residuos",
          icon: Trash2,
          className: "bg-yellow-100 text-yellow-800 border-yellow-200"
        };
      case "ruido_excesivo":
        return {
          label: "Ruido Excesivo",
          icon: Volume2,
          className: "bg-purple-100 text-purple-800 border-purple-200"
        };
      case "contaminacion_suelo":
        return {
          label: "Contaminación de Suelo",
          icon: Mountain,
          className: "bg-orange-100 text-orange-800 border-orange-200"
        };
      case "otros":
        return {
          label: "Otros",
          icon: AlertTriangle,
          className: "bg-muted text-muted-foreground border-border"
        };
      // Legacy support for old categories
      case "incendio":
        return {
          label: "Incendio Forestal",
          icon: Flame,
          className: "bg-destructive/10 text-destructive border-destructive/20"
        };
      case "contaminacion":
        return {
          label: "Contaminación",
          icon: Droplets,
          className: "bg-accent/10 text-accent border-accent/20"
        };
      case "mineria_ilegal":
        return {
          label: "Minería Ilegal",
          icon: Mountain,
          className: "bg-earth/10 text-earth border-earth/20"
        };
      case "otro":
        return {
          label: "Otro",
          icon: AlertTriangle,
          className: "bg-muted text-muted-foreground border-border"
        };
      default:
        return {
          label: "Desconocido",
          icon: AlertTriangle,
          className: "bg-muted text-muted-foreground border-border"
        };
    }
  };

  const config = getTypeConfig(type);
  const IconComponent = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border gap-1",
        config.className,
        className
      )}
    >
      {showIcon && <IconComponent className="h-3 w-3" />}
      {config.label}
    </span>
  );
};

export default CrimeTypeBadge;