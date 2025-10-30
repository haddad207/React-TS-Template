import {
  FormControl,
  FormLabel,
  TextField,
  TextFieldProps,
  useMediaQuery,
} from "@mui/material";
import { forwardRef } from "react";

interface FormFieldProps extends Omit<TextFieldProps, "variant"> {
  label: string;
  height?: number;
  labelColor?: string;
  glassmorphism?: boolean;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, height = 100, labelColor = "#fff", glassmorphism = false, ...props }, ref) => {
    const isMobile = useMediaQuery("(max-width: 600px)");

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
          sx={{
            ...glassStyles,
          }}
          {...props}
        />
      </FormControl>
    );
  }
);

FormField.displayName = "FormField";

export default FormField;