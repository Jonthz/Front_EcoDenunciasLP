import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "pendiente" | "en_proceso" | "resuelta";
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pendiente":
        return {
          label: "Pendiente",
          className: "bg-warning/10 text-warning border-warning/20"
        };
      case "en_proceso":
        return {
          label: "En Proceso",
          className: "bg-primary/10 text-primary border-primary/20"
        };
      case "resuelta":
        return {
          label: "Resuelta",
          className: "bg-success/10 text-success border-success/20"
        };
      default:
        return {
          label: "Desconocido",
          className: "bg-muted text-muted-foreground border-border"
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;