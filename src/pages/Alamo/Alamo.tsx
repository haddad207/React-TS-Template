import { useState, useRef, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    Button,
    TextField,
    Switch,
    FormControlLabel,
    useMediaQuery,
    useTheme,
    Stack,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider
} from '@mui/material';
import {
    Warning,
    Security,
    Lock,
    LockOpen,
    VolumeUp,
    VolumeOff
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAlamoMutation } from '../../api/adminApi';

export default function Alamo() {
    const theme = useTheme();
    const isMobile = useMediaQuery('(max-width: 900px)');
    const audioRef = useRef<HTMLAudioElement>(null);

    const [alamoSecret, setAlamoSecret] = useState('');
    const [engage, setEngage] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [audioError, setAudioError] = useState(false);

    const [executeAlamo, { isLoading }] = useAlamoMutation();

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play()
                .then(() => {
                    setIsAudioPlaying(true);
                })
                .catch((error) => {
                    console.error('Audio playback failed:', error);
                    setAudioError(true);
                });
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isAudioPlaying) {
                audioRef.current.pause();
                setIsAudioPlaying(false);
            } else {
                audioRef.current.play()
                    .then(() => {
                        setIsAudioPlaying(true);
                    })
                    .catch((error) => {
                        console.error('Audio playback failed:', error);
                        setAudioError(true);
                    });
            }
        }
    };

    const handleExecuteAlamo = async () => {
        if (!alamoSecret.trim()) {
            toast.error('ALAMO Secret is required', {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        try {
            const result = await executeAlamo({ engage, alamoSecret: alamoSecret.trim() }).unwrap();

            toast.success(
                `ALAMO ${engage ? 'LOCK' : 'UNLOCK'} executed successfully! Processed: ${result.processed}, Updated: ${result.updated}`,
                {
                    position: "top-center",
                    autoClose: 5000,
                }
            );

            if (result.errors > 0) {
                toast.warning(`${result.errors} accounts had errors during operation`, {
                    position: "top-center",
                    autoClose: 4000,
                });
            }

            setOpenConfirmDialog(false);
            setAlamoSecret('');
        } catch (error: any) {
            console.error('ALAMO execution failed:', error);
            toast.error(
                error?.data?.message || 'ALAMO execution failed',
                {
                    position: "top-center",
                    autoClose: 4000,
                }
            );
        }
    };

    const openConfirmation = () => {
        if (!alamoSecret.trim()) {
            toast.error('ALAMO Secret is required', {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }
        setOpenConfirmDialog(true);
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            p: isMobile ? 2 : 3,
            position: 'relative'
        }}>
            {/* Audio Element */}
            <audio
                ref={audioRef}
                loop
                onEnded={() => setIsAudioPlaying(false)}
                onError={() => setAudioError(true)}
            >
                <source src="/sounds/emergency-alert-sound.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>

            {/* Background overlay with red emergency theme */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.3), rgba(0, 0, 0, 0.6))',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            {/* Pulsing emergency overlay */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle, rgba(255, 0, 0, 0.1) 0%, transparent 70%)',
                animation: 'pulse 2s infinite',
                pointerEvents: 'none',
                zIndex: 0,
                '@keyframes pulse': {
                    '0%': { opacity: 0.3 },
                    '50%': { opacity: 0.6 },
                    '100%': { opacity: 0.3 }
                }
            }} />

            {/* Header */}
            <Box sx={{
                textAlign: 'center',
                mb: 3,
                position: 'relative',
                zIndex: 1
            }}>
                <Security sx={{
                    fontSize: isMobile ? 48 : 64,
                    color: '#ff0000',
                    mb: 2,
                    filter: 'drop-shadow(0 0 20px #ff000080)'
                }} />
                <Typography variant={isMobile ? "h4" : "h3"} sx={{
                    color: '#ff0000',
                    fontWeight: 'bold',
                    mb: 1,
                    textShadow: '0 0 20px #ff000080',
                    fontFamily: 'monospace',
                    letterSpacing: '0.1em'
                }}>
                    ⚠️ ALAMO !!!! ⚠️
                </Typography>
                <Typography variant="h6" sx={{
                    color: '#ffcccc',
                    maxWidth: 600,
                    mx: 'auto',
                    fontWeight: 'bold'
                }}>
                    Emergency Account Lock/Unlock System
                </Typography>
                <Typography variant="body2" sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    mt: 1,
                    fontStyle: 'italic'
                }}>
                    SEEDED ADMIN ACCESS ONLY
                </Typography>
            </Box>

            {/* Audio Control */}
            <Box sx={{
                position: 'fixed',
                top: 20,
                right: 20,
                zIndex: 1000
            }}>
                <Button
                    onClick={toggleAudio}
                    variant="contained"
                    size="small"
                    disabled={audioError}
                    sx={{
                        minWidth: 'auto',
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: isAudioPlaying
                            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                            : 'linear-gradient(135deg, #6b7280, #4b5563)',
                        '&:hover': {
                            background: isAudioPlaying
                                ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
                                : 'linear-gradient(135deg, #4b5563, #374151)',
                        }
                    }}
                >
                    {audioError ? '🔇' : (isAudioPlaying ? <VolumeUp /> : <VolumeOff />)}
                </Button>
            </Box>

            {/* Main Content Card */}
            <Card sx={{
                maxWidth: 800,
                mx: 'auto',
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(8px)',
                border: '2px solid #ff0000',
                borderRadius: 3,
                position: 'relative',
                zIndex: 1,
                boxShadow: '0 0 30px rgba(255, 0, 0, 0.5)'
            }}>
                <Box sx={{ p: 4 }}>
                    {/* Warning Section */}
                    <Alert
                        severity="error"
                        icon={<Warning />}
                        sx={{
                            mb: 3,
                            backgroundColor: 'rgba(255, 0, 0, 0.2)',
                            border: '1px solid #ff0000',
                            '& .MuiAlert-message': { color: '#fff', fontWeight: 'bold' },
                            '& .MuiAlert-icon': { color: '#ff0000' }
                        }}
                    >
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            CRITICAL SYSTEM OPERATION
                        </Typography>
                        <Typography variant="body2">
                            This will affect ALL non-seeded user accounts in the system immediately.
                        </Typography>
                    </Alert>

                    <Stack spacing={4}>
                        {/* Operation Mode Selection */}
                        <Box sx={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: 2,
                            p: 3
                        }}>
                            <Typography variant="h6" sx={{
                                color: '#fff',
                                fontWeight: 'bold',
                                mb: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                {engage ? <Lock sx={{ color: '#ff0000' }} /> : <LockOpen sx={{ color: '#22c55e' }} />}
                                Operation Mode
                            </Typography>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={engage}
                                        onChange={(e) => setEngage(e.target.checked)}
                                        size="large"
                                        sx={{
                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: '#ff0000',
                                            },
                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                backgroundColor: '#ff0000',
                                            },
                                            '& .MuiSwitch-track': {
                                                backgroundColor: '#22c55e',
                                            }
                                        }}
                                    />
                                }
                                label={
                                    <Box>
                                        <Typography sx={{
                                            color: engage ? '#ff0000' : '#22c55e',
                                            fontWeight: 'bold',
                                            fontSize: '1.2rem'
                                        }}>
                                            {engage ? 'ENGAGE LOCKDOWN' : 'DISENGAGE LOCKDOWN'}
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            color: 'rgba(255, 255, 255, 0.7)',
                                            mt: 0.5
                                        }}>
                                            {engage
                                                ? 'Lock all non-seeded accounts (Emergency Mode)'
                                                : 'Unlock all non-seeded accounts (Recovery Mode)'
                                            }
                                        </Typography>
                                    </Box>
                                }
                            />
                        </Box>

                        <Divider sx={{ borderColor: 'rgba(255, 0, 0, 0.3)' }} />

                        {/* Secret Input */}
                        <Box>
                            <Typography variant="h6" sx={{
                                color: '#fff',
                                fontWeight: 'bold',
                                mb: 2
                            }}>
                                Authorization Required
                            </Typography>

                            <TextField
                                label="ALAMO Secret Key"
                                type="password"
                                value={alamoSecret}
                                onChange={(e) => setAlamoSecret(e.target.value)}
                                fullWidth
                                required
                                placeholder="Enter X-Alamo-Secret value"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: '#fff',
                                        fontFamily: 'monospace',
                                        fontSize: '1.1rem',
                                        '& fieldset': {
                                            borderColor: '#ff0000',
                                            borderWidth: '2px'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#ff4444',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#ff0000',
                                            borderWidth: '2px'
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#ffcccc',
                                        fontWeight: 'bold',
                                        '&.Mui-focused': {
                                            color: '#ff0000',
                                        },
                                    },
                                }}
                            />
                        </Box>

                        <Divider sx={{ borderColor: 'rgba(255, 0, 0, 0.3)' }} />

                        {/* Execute Button */}
                        <Button
                            variant="contained"
                            size="large"
                            onClick={openConfirmation}
                            disabled={!alamoSecret.trim() || isLoading}
                            sx={{
                                background: engage
                                    ? 'linear-gradient(135deg, #ff0000, #cc0000)'
                                    : 'linear-gradient(135deg, #22c55e, #16a34a)',
                                color: 'white',
                                px: 4,
                                py: 2,
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                borderRadius: 3,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                '&:hover': {
                                    background: engage
                                        ? 'linear-gradient(135deg, #cc0000, #990000)'
                                        : 'linear-gradient(135deg, #16a34a, #15803d)',
                                    transform: 'scale(1.02)'
                                },
                                '&:disabled': {
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    color: 'rgba(255, 255, 255, 0.4)',
                                    transform: 'none'
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <CircularProgress size={24} sx={{ mr: 2, color: 'inherit' }} />
                                    Executing ALAMO...
                                </>
                            ) : (
                                `Execute ALAMO ${engage ? 'LOCKDOWN' : 'RECOVERY'}`
                            )}
                        </Button>

                        {/* Message */}
                        <Box sx={{
                            background: 'rgba(255, 0, 0, 0.2)',
                            border: '1px solid rgba(255, 0, 0, 0.5)',
                            borderRadius: 2,
                            p: 3,
                            textAlign: 'center'
                        }}>
                            <Typography variant="h5" sx={{
                                color: '#ff0000',
                                fontWeight: 'bold',
                                fontFamily: 'monospace',
                                letterSpacing: '0.1em',
                                textShadow: '0 0 10px #ff000080'
                            }}>
                                This is what happens when you fuck with us
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            </Card>

            {/* Confirmation Dialog */}
            <Dialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        background: 'rgba(0, 0, 0, 0.9)',
                        backdropFilter: 'blur(8px)',
                        border: '2px solid #ff0000',
                        color: '#fff'
                    }
                }}
            >
                <DialogTitle sx={{
                    color: '#ff0000',
                    borderBottom: '1px solid rgba(255, 0, 0, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    textAlign: 'center'
                }}>
                    <Warning sx={{ color: '#ff0000' }} />
                    FINAL CONFIRMATION REQUIRED
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Alert
                        severity="error"
                        sx={{
                            mb: 2,
                            backgroundColor: 'rgba(255, 0, 0, 0.2)',
                            border: '1px solid #ff0000',
                            '& .MuiAlert-message': { color: '#fff' }
                        }}
                    >
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            You are about to execute ALAMO {engage ? 'LOCKDOWN' : 'RECOVERY'}
                        </Typography>
                    </Alert>

                    <Typography variant="body1" sx={{ color: '#fff', mb: 2 }}>
                        This operation will:
                    </Typography>

                    <Box sx={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                        p: 2,
                        mb: 2
                    }}>
                        <Typography variant="body2" sx={{ color: '#fff' }}>
                            • {engage ? 'LOCK' : 'UNLOCK'} all non-seeded user accounts<br/>
                            • Take effect immediately across the entire system<br/>
                            • Be permanently logged for security audit<br/>
                            • {engage ? 'Prevent users from accessing the system' : 'Restore normal user access'}
                        </Typography>
                    </Box>

                    <Typography variant="body2" sx={{
                        color: '#ffc107',
                        fontStyle: 'italic',
                        textAlign: 'center'
                    }}>
                        Are you absolutely certain you want to proceed?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255, 0, 0, 0.3)' }}>
                    <Button
                        onClick={() => setOpenConfirmDialog(false)}
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleExecuteAlamo}
                        variant="contained"
                        disabled={isLoading}
                        sx={{
                            background: engage
                                ? 'linear-gradient(135deg, #ff0000, #cc0000)'
                                : 'linear-gradient(135deg, #22c55e, #16a34a)',
                            '&:hover': {
                                background: engage
                                    ? 'linear-gradient(135deg, #cc0000, #990000)'
                                    : 'linear-gradient(135deg, #16a34a, #15803d)',
                            },
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                        }}
                    >
                        {isLoading ? 'Executing...' : `Execute ${engage ? 'LOCKDOWN' : 'RECOVERY'}`}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}