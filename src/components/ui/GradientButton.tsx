import { Button, ButtonProps, styled } from "@mui/material";

interface GradientButtonProps extends ButtonProps {
  gradientColors?: [string, string];
  hoverGradientColors?: [string, string];
}

const StyledGradientButton = styled(Button)<{
  gradientColors: [string, string];
  hoverGradientColors: [string, string];
}>(({ gradientColors, hoverGradientColors }) => ({
  background: `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})`,
  border: "none",
  borderRadius: "8px",
  padding: "14px 24px",
  fontSize: "1rem",
  fontWeight: "600",
  color: "white",
  textTransform: "none",
  boxShadow: `0 4px 20px ${gradientColors[0]}40`,
  transition: "all 0.3s ease",
  "&:hover": {
    background: `linear-gradient(135deg, ${hoverGradientColors[0]}, ${hoverGradientColors[1]})`,
    transform: "translateY(-2px)",
    boxShadow: `0 6px 25px ${gradientColors[0]}60`,
  },
  "&:disabled": {
    background: "rgba(255, 255, 255, 0.1)",
    color: "rgba(255, 255, 255, 0.4)",
    transform: "none",
    boxShadow: "none",
  },
}));

export default function GradientButton({
  gradientColors = ["#3b82f6", "#1d4ed8"],
  hoverGradientColors = ["#2563eb", "#1e40af"],
  children,
  ...props
}: GradientButtonProps) {
  return (
    <StyledGradientButton
      gradientColors={gradientColors}
      hoverGradientColors={hoverGradientColors}
      {...props}
    >
      {children}
    </StyledGradientButton>
  );
}