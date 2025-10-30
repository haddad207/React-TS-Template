import React, { useState, useEffect, useRef } from "react";
import "./auth.css";
import * as formik from "formik";
import * as yup from "yup";
import { useCreateUserMutation } from "../../api/adminApi.ts";
import { useNavigate } from "react-router";
import {
  styled,
  Stack,
  Box,
  Button,
  CssBaseline,
  Divider,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { CheckIfAdmin } from "../../utils/checkAdmin.ts";
// import { useAddSubHandReceiptHolderMutation } from "../../api/subhandreceiptholderApi.ts";
import MuiCard from "@mui/material/Card";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { toast } from "react-toastify";
import type RegisterAdminModel from "../../models/auth/RegisterAdminModel.ts";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  backgroundColor: "rgba(200, 200, 200, 0.4)",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "750px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function Register() {
  const firstNameRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [createUser] = useCreateUserMutation();
  const { Formik } = formik;

  useEffect(() => {
    firstNameRef.current?.focus();
  }, []);

  const schema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().required(),
    password: yup.string().required(),
  });
  const navigate = useNavigate();

  const onHandleSubmit = async (data: RegisterAdminModel) => {
    try {
      if (data) {
        const formattedData = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
        };
        const result = await createUser(formattedData);
        if (result.data) {
          // console.log({
          //   name: token.fullName,
          //   jobTitle: data.jobTitle,
          //   deptSection: data.department,
          //   applicationUserId: token.userId, // ✅ Ensure ApplicationUserId is included
          // });
          // setTimeout(async () => {
          //   await addSubHandReceiptHolder({
          //     name: token.fullName,
          //     jobTitle: data.jobTitle,
          //     deptSection: data.department,
          //     applicationUserId: token.userId, // ✅ Ensure ApplicationUserId is included
          //   });
          // }, 1000);
          if (CheckIfAdmin()) {
            toast("User created successfully", {
              hideProgressBar: true,
              theme: "colored",
              type: "success",
            });
            return;
          }
          // For non-admin users, you'd need to login with the new account
          navigate("/login");
        }
      }
    } catch (e) {
      console.error("Registration failed");
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <>
      <CssBaseline />
      {/* <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} /> */}
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
            textAlign="center"
          >
            Register
          </Typography>
          <Divider />
          <Formik
            validationSchema={schema}
            onSubmit={onHandleSubmit}
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
          >
            {({ handleSubmit, handleChange, values, errors }) => (
              <>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <FormControl sx={{ width: "100%", height: 100 }}>
                        <FormLabel htmlFor="firstName" sx={{ color: "black" }}>
                          First Name
                        </FormLabel>
                        <TextField
                          type="text"
                          name="firstName"
                          value={values.firstName}
                          onChange={handleChange}
                          error={!!errors.firstName}
                          inputRef={firstNameRef}
                          autoComplete="name"
                          required
                          fullWidth
                          id="firstName"
                          placeholder="John"
                          helperText={errors.firstName}
                          // error={nameError}
                          // helperText={nameErrorMessage}
                          // color={nameError ? "error" : "primary"}
                        />
                      </FormControl>
                    </Grid>
                    <Grid size={6}>
                      <FormControl sx={{ width: "100%", height: 100 }}>
                        <FormLabel htmlFor="lastName" sx={{ color: "black" }}>
                          Last Name
                        </FormLabel>
                        <TextField
                          type="text"
                          name="lastName"
                          placeholder="Doe"
                          value={values.lastName}
                          onChange={handleChange}
                          error={!!errors.lastName}
                          required
                          fullWidth
                          id="lastName"
                          autoComplete="name"
                          variant="outlined"
                          helperText={errors.lastName}
                          // error={emailError}
                          // helperText={emailErrorMessage}
                          // color={passwordError ? "error" : "primary"}
                        />
                      </FormControl>
                    </Grid>
                    <Grid size={6}>
                      <FormControl sx={{ width: "100%", height: 100 }}>
                        <FormLabel htmlFor="email" sx={{ color: "black" }}>
                          Email
                        </FormLabel>
                        <TextField
                          // slotProps={{
                          //   input: {
                          //     endAdornment: (
                          //       <InputAdornment position="end">
                          //         @gov2x.com
                          //       </InputAdornment>
                          //     ),
                          //   },
                          // }}
                          type="email"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          error={!!errors.email}
                          autoComplete="email"
                          required
                          fullWidth
                          id="email"
                          placeholder="Jhon.Doe@gov2x.com"
                          helperText={errors.email}
                          // error={nameError}
                          // helperText={nameErrorMessage}
                          // color={nameError ? "error" : "primary"}
                        />
                      </FormControl>
                    </Grid>

                    <Grid size={6}>
                      <FormControl sx={{ width: "100%", height: 100 }}>
                        <FormLabel htmlFor="password" sx={{ color: "black" }}>
                          Password
                        </FormLabel>
                        <TextField
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={values.password}
                          onChange={handleChange}
                          error={!!errors.password}
                          required
                          fullWidth
                          placeholder="••••••"
                          id="password"
                          autoComplete="new-password"
                          variant="outlined"
                          helperText={errors.password}
                          slotProps={{
                            input: {
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label={
                                      showPassword
                                        ? "hide the password"
                                        : "display the password"
                                    }
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    onMouseUp={handleMouseUpPassword}
                                    edge="end"
                                  >
                                    {showPassword ? (
                                      <VisibilityOff />
                                    ) : (
                                      <Visibility />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            },
                          }}
                          // error={passwordError}
                          // helperText={passwordErrorMessage}
                          // color={passwordError ? "error" : "primary"}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" />}
              label="I want to receive updates via email."
            /> */}
                  <Divider />
                  <Button type="submit" fullWidth variant="contained">
                    Sign up
                  </Button>
                </Box>
                {/* <Divider>
                  <Typography sx={{ color: "text.secondary" }}>or</Typography>
                </Divider>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography sx={{ textAlign: "center" }}>
                    Already have an account?{" "}
                    <Link
                      href="/material-ui/getting-started/templates/sign-in/"
                      variant="body2"
                      sx={{ alignSelf: "center" }}
                    >
                      Sign in
                    </Link>
                  </Typography>
                </Box> */}
              </>
            )}
          </Formik>
        </Card>
      </SignUpContainer>
    </>
  );
}
