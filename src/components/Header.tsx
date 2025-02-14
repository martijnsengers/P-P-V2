
import { Leaf } from "lucide-react";

interface HeaderProps {
  subtitle?: string;
}

export const Header = ({ subtitle }: HeaderProps) => {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <Leaf className="h-12 w-12 text-primary" />
      </div>
      <div className="text-4xl font-extrabold text-primary leading-[0]">
        <div>Planten en Planeten</div>
        <div>AI Assistent</div>
      </div>
      {subtitle && (
        <p className="text-base text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
};
