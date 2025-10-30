import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { APP_CONFIG } from "../navigationConfig.tsx";
import logoImage from "../../../assets/images/V2XLogo(White).png";
import type NavBarBrandProps from "../../../models/navigation/NavBarBrandProps.ts";


export function NavBarBrand({ variant }: NavBarBrandProps) {
    const navigate = useNavigate();

    const handleHomeNavigation = () => {
        navigate("/");
    };

    if (variant === "desktop") {
        return (
            <>
                <Box sx={{ ml: 1 }}>
                    <img
                        src={logoImage}
                        alt="Company Logo"
                        style={{ height: APP_CONFIG.logoHeight }}
                    />
                </Box>

                <Box
                    onClick={handleHomeNavigation}
                    sx={{
                        cursor: "pointer",
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 1
                    }}
                >
                    <Typography
                        variant="h6"
                        noWrap
                        sx={{
                            display: "flex",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "rgba(255, 255, 255, 0.95)",
                            textDecoration: "none",
                        }}
                    >
                        {APP_CONFIG.title}
                    </Typography>
                </Box>
            </>
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexGrow: 1,
                justifyContent: "center",
                mr: 6 // Add space so it doesn't overlap with user menu
            }}
        >
            <img
                src={logoImage}
                alt="Company Logo"
                style={{ height: 35 }} // Slightly smaller on mobile
            />
            <Box onClick={handleHomeNavigation} sx={{ cursor: "pointer" }}>
                <Typography
                    variant="h6"
                    noWrap
                    sx={{
                        fontWeight: 700,
                        letterSpacing: ".1rem",
                        color: "inherit",
                        textDecoration: "none",
                        fontSize: "1.1rem"
                    }}
                >
                    {APP_CONFIG.mobileTitle}
                </Typography>
            </Box>
        </Box>
    );
}