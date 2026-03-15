import { Landmark } from "lucide-react";

interface ProfessionalLoaderProps {
  fullScreen?: boolean;
  showLogo?: boolean;
  showText?: boolean;
  text?: string;
  overlay?: boolean;
}

const ProfessionalLoader = ({
  fullScreen = true,
  showLogo = false,
  showText = false,
  text = "Loading...",
  overlay = false,
}: ProfessionalLoaderProps) => {
  const wrapperClasses = fullScreen
    ? `${overlay ? "fixed" : "flex min-h-screen"} inset-0 flex items-center justify-center bg-background ${overlay ? "bg-background/95 backdrop-blur-sm z-50" : ""}`
    : "flex items-center justify-center py-12";

  return (
    <div className={wrapperClasses}>
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        {showLogo && (
          <div className="relative mb-2">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" />
            <div className="relative w-20 h-20 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.15)]">
              <Landmark className="w-9 h-9 text-primary" strokeWidth={1.5} />
            </div>
          </div>
        )}

        {/* Modern triple-dot loader */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-primary"
              style={{
                animation: "dot-bounce 1.4s ease-in-out infinite",
                animationDelay: `${i * 0.16}s`,
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-primary animate-progress-slide" />
        </div>

        {showText && (
          <p className="text-sm text-muted-foreground tracking-wider uppercase font-medium animate-text-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfessionalLoader;
