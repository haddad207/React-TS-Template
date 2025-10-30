import { Card, styled } from "@mui/material";
import type { CardProps } from "@mui/material/Card";

const StyledGlassCard = styled(Card)<{ blur?: number }>(({ theme, blur = 10 }) => ({
  background: "rgba(0, 0, 0, 0.4)",
  backdropFilter: `blur(${blur}px)`,
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
  overflow: "hidden",
}));

interface GlassCardProps extends CardProps {
  blur?: number;
}

export default function GlassCard({ blur, children, ...props }: GlassCardProps) {
  return (
    <StyledGlassCard blur={blur} {...props}>
      {children}
    </StyledGlassCard>
  );
}