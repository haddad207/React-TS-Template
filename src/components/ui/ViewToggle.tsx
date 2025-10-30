import React from "react";
import { Box, ToggleButtonGroup, ToggleButton, useMediaQuery, useTheme } from "@mui/material";
import { Warning, Person } from "@mui/icons-material";

interface ViewToggleProps {
    currentView: "alerts" | "evacuations";
    onViewChange: (view: "alerts" | "evacuations") => void;
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery('(max-width: 600px)'); // Only small phones get mobile styling

    const handleChange = (_: React.MouseEvent<HTMLElement>, newView: "alerts" | "evacuations" | null) => {
        if (newView !== null) {
            onViewChange(newView);
        }
    };

    return (
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            mb: isMobile ? 2 : -7,
            mt: isMobile ? 1 : -5
        }}>
            <ToggleButtonGroup
                value={currentView}
                exclusive
                onChange={handleChange}
                aria-label="view toggle"
                sx={{
                    marginTop: isMobile ? 0 : 5,
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderRadius: isMobile ? "8px" : "12px",
                    padding: isMobile ? "4px" : "6px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                    width: isMobile ? '100%' : 'auto',
                    maxWidth: isMobile ? '100%' : 'none',
                    "& .MuiToggleButton-root": {
                        border: "none",
                        borderRadius: isMobile ? "6px" : "8px",
                        minWidth: isMobile ? '50%' : 150,
                        py: isMobile ? 1 : 1.5,
                        px: isMobile ? 1 : 3,
                        mx: isMobile ? 0 : 0.5,
                        fontSize: isMobile ? "0.85rem" : "0.95rem",
                        fontWeight: 500,
                        textTransform: "none",
                        color: "rgba(255, 255, 255, 0.7)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        flex: isMobile ? 1 : 'none',
                        "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                            color: "rgba(255, 255, 255, 0.9)",
                        },
                        "&.Mui-selected": {
                            backgroundColor: "rgba(255, 255, 255, 0.15)",
                            color: "#ffffff",
                            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
                            "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                            }
                        }
                    }
                }}
            >
                <ToggleButton value="alerts" aria-label="alerts view">
                    <Box sx={{ display: "flex", alignItems: "center", gap: isMobile ? 0.5 : 1 }}>
                        <Warning sx={{ fontSize: isMobile ? 18 : 20 }} />
                        <span>Alerts</span>
                    </Box>
                </ToggleButton>
                <ToggleButton value="evacuations" aria-label="evacuations view">
                    <Box sx={{ display: "flex", alignItems: "center", gap: isMobile ? 0.5 : 1 }}>
                        <Person sx={{ fontSize: isMobile ? 18 : 20 }} />
                        <span>Evacuations</span>
                    </Box>
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
}