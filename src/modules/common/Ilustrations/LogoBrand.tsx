import { ChessKnight } from "lucide-react";

type LogoBrandProps = {
  size?: number;
  color?: string;
  backgroundColor?: string;
  className?: string;
};

export const LogoBrand = ({
  size = 20,
  color = "white",
  backgroundColor,
  className = "",
}: LogoBrandProps) => {
  return (
    <div className={`bg-${backgroundColor} p-2 rounded-lg ${className}`}>
      <ChessKnight size={size} className={color} />
    </div>
  );
};
