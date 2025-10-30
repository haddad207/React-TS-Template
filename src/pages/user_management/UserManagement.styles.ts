import { styled } from '@mui/material/styles';
import { Box, Card, Button } from '@mui/material';

export const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #0f1419 100%)',
  padding: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(3),
  },
}));

export const StatsCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  textAlign: 'center',
  color: '#fff',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, rgba(120, 200, 255, 0.8), transparent)',
  }
}));

export const ActionButton = styled(Button)<{ variant: 'promote' | 'demote' | 'lock' | 'unlock' | 'delete' | 'reset' }>(
  ({ theme, variant }) => {
    const variants = {
      promote: {
        color: '#10b981',
        borderColor: 'rgba(16, 185, 129, 0.3)',
        '&:hover': {
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
        },
      },
      demote: {
        color: '#f59e0b',
        borderColor: 'rgba(245, 158, 11, 0.3)',
        '&:hover': {
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
        },
      },
      lock: {
        color: '#ef4444',
        borderColor: 'rgba(239, 68, 68, 0.3)',
        '&:hover': {
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
        },
      },
      unlock: {
        color: '#10b981',
        borderColor: 'rgba(16, 185, 129, 0.3)',
        '&:hover': {
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
        },
      },
      delete: {
        color: '#ef4444',
        borderColor: 'rgba(239, 68, 68, 0.3)',
        '&:hover': {
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
        },
      },
      reset: {
        color: '#3b82f6',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        '&:hover': {
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
        },
      },
    };

    return {
      minWidth: 'auto',
      padding: theme.spacing(0.5, 1),
      ...variants[variant],
    };
  }
);

export const TableContainer = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  '& .MuiTableHead-root': {
    '& .MuiTableCell-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: '#fff',
      fontWeight: 'bold',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },
  },
  '& .MuiTableBody-root': {
    '& .MuiTableRow-root': {
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
      },
      '& .MuiTableCell-root': {
        color: 'rgba(255, 255, 255, 0.9)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      },
    },
  },
}));

export const dialogStyles = {
  '& .MuiDialog-paper': {
    background: 'rgba(0, 0, 0, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
  },
  '& .MuiDialogTitle-root': {
    color: '#fff',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  '& .MuiDialogContent-root': {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  '& .MuiTextField-root': {
    '& .MuiOutlinedInput-root': {
      color: '#fff',
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.3)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.5)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#3b82f6',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.7)',
      '&.Mui-focused': {
        color: '#3b82f6',
      },
    },
  },
};