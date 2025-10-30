import React, { useState, forwardRef } from 'react';
import {
  FormControl,
  FormLabel,
  TextField,
  IconButton,
  InputAdornment,
  TextFieldProps
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface PasswordFieldProps extends Omit<TextFieldProps, 'variant' | 'type'> {
  label: string;
  height?: number;
  labelColor?: string;
  glassmorphism?: boolean;
}

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, height = 100, labelColor = "#fff", glassmorphism = false, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => setShowPassword(!showPassword);

    const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };

    const glassStyles = glassmorphism
      ? {
          "& .MuiOutlinedInput-root": {
            color: "#fff",
            background: "rgba(255, 255, 255, 0.08)",
            "& fieldset": {
              borderColor: "rgba(255, 255, 255, 0.3)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(255, 255, 255, 0.5)",
            },
            "&.Mui-focused fieldset": {
              borderColor: props.color === "error" ? "#ef4444" : "#3b82f6",
            },
          },
          "& .MuiInputLabel-root": {
            color: "rgba(255, 255, 255, 0.7)",
            "&.Mui-focused": {
              color: props.color === "error" ? "#ef4444" : "#3b82f6",
            },
          },
        }
      : {};

    return (
      <FormControl sx={{ width: "100%", height }}>
        <FormLabel htmlFor={props.id} sx={{ color: labelColor }}>
          {label}
        </FormLabel>
        <TextField
          ref={ref}
          variant="outlined"
          fullWidth
          type={showPassword ? "text" : "password"}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? "hide the password" : "display the password"
                    }
                    onClick={handleTogglePassword}
                    onMouseDown={handleMouseDown}
                    edge="end"
                    sx={{ color: glassmorphism ? "rgba(255, 255, 255, 0.7)" : undefined }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{
            ...glassStyles,
          }}
          {...props}
        />
      </FormControl>
    );
  }
);

PasswordField.displayName = "PasswordField";

export default PasswordField;