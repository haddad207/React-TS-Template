import { Box, Button, IconButton, Stack, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useLocation } from "react-router";
import UserMenu from "./UserMenu";
import type NavBarActionsProps from "../../../models/navigation/NavBarActionsProps";

export function NavBarActions({ isLoggedIn, isLoginPage, onOpenDrawer, onAddPersonnel, onSearchPersonnel }: NavBarActionsProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery('(max-width: 600px)'); // Only small phones get mobile treatment

    const isPersonnelPage = location.pathname === '/personnel';

    const handleLoginClick = () => {
        navigate("/login");
    };

    return (
        <>
            {/* Mobile Menu Button */}
            {!isLoginPage && (
                <Box sx={{ display: { xs: "flex", md: "none" } }}>
                    <IconButton
                        size="large"
                        aria-label="open navigation menu"
                        onClick={onOpenDrawer}
                        color="inherit"
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>
            )}

            {/* Right Section - Add Personnel + User Menu (Hidden on mobile) */}
            <Box sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                ml: "auto",
                mr: -8
            }}>
                {isLoggedIn ? (
                    <Box>
                        <Stack spacing={1} direction="row" alignItems="center">
                            {/* Personnel Page Actions - Only show on personnel page */}
                            {isPersonnelPage && (
                                <>
                                    {/* Search Personnel Button */}
                                    {onSearchPersonnel && (
                                        <IconButton
                                            onClick={onSearchPersonnel}
                                            sx={{
                                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                                color: '#ffffff',
                                                width: '40px',
                                                height: '40px',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #059669, #047857)',
                                                    transform: 'translateY(-1px)',
                                                },
                                                '& .MuiSvgIcon-root': {
                                                    fontSize: '1.25rem',
                                                },
                                            }}
                                            title="Search Personnel"
                                        >
                                            <SearchIcon />
                                        </IconButton>
                                    )}

                                    {/* Add Personnel Button */}
                                    {onAddPersonnel && (
                                        <IconButton
                                            onClick={onAddPersonnel}
                                            sx={{
                                                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                                color: '#ffffff',
                                                width: '40px',
                                                height: '40px',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #2563eb, #1e40af)',
                                                    transform: 'translateY(-1px)',
                                                },
                                                '& .MuiSvgIcon-root': {
                                                    fontSize: '1.25rem',
                                                },
                                            }}
                                            title="Add Personnel"
                                        >
                                            <PersonAddIcon />
                                        </IconButton>
                                    )}
                                </>
                            )}
                            <UserMenu />
                        </Stack>
                    </Box>
                ) : (
                    !isLoginPage && (
                        <Button
                            onClick={handleLoginClick}
                            variant="outlined"
                            color="inherit"
                        >
                            Login
                        </Button>
                    )
                )}
            </Box>
        </>
    );
}