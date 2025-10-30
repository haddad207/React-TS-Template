import { Box, Typography, useMediaQuery } from "@mui/material";
import { ReactNode } from "react";

interface PageHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  iconColor?: string;
}

export default function PageHeader({
  icon,
  title,
  subtitle,
  iconColor = "#3b82f6"
}: PageHeaderProps) {
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <Box
      sx={{
        textAlign: "center",
        mb: 3,
        position: "relative",
        zIndex: 1,
      }}
    >
      <Box sx={{ fontSize: isMobile ? 48 : 64, color: iconColor, mb: 2 }}>
        {icon}
      </Box>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        sx={{
          color: "#fff",
          fontWeight: "bold",
          mb: 1,
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "rgba(255, 255, 255, 0.7)",
          maxWidth: 600,
          mx: "auto",
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
}