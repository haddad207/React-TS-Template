// React imports
import { useEffect, useRef, useState } from "react";

// Third-party libraries
import * as formik from "formik";
import { useNavigate } from "react-router";

// Bootstrap components
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

// Styles
import "./auth.css";

// API hooks
import { useLoginUserMutation } from "../../api/authApi.ts";

// Store
import { useAppDispatch } from "../../store/store.ts";
import { login } from "../../store/slices/userSlice.ts";

// Providers

// Types
import type LoginModel from "../../models/auth/LoginModel.ts";
import type Token from "../../models/auth/Token.ts";

// Components
import AuthCard from "../../components/auth/AuthCard.tsx";
import ForgotPasswordModal from "../../components/auth/ForgotPasswordModal.tsx";

// Validation
import { loginSchema } from "../../validation/authSchemas.ts";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const emailRef = useRef<HTMLInputElement>(null);
  const { Formik } = formik;
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const onHandleSubmit = async (data: LoginModel) => {
    try {
      if (data) {
        const loginData = data;
        const result = await loginUser(loginData);

        if (result.data) {
          // Check if user must change password
          if (result.data.mustChangePassword) {
            // Store temporary user data for password change
            sessionStorage.setItem("tempUserId", result.data.userId || "");
            sessionStorage.setItem("tempEmail", result.data.email || "");
            navigate("/change-initial-password");
          } else {
            // Normal login flow - treat as Token
            const token: Token = result.data as Token;
            dispatch(login(token));
            navigate("/");
          }
        }
      }
    } catch (e) {
      // Handle login errors silently
    }
  };

  return (
    <>
      <AuthCard title="Emergency Action Plan">
        {error && (
          <Alert variant="danger" className="mb-4">
            {"data" in error &&
            error.data &&
            typeof error.data === "object" &&
            "message" in error.data
              ? (error.data as any).message
              : "Login failed. Please check your credentials and try again."}
          </Alert>
        )}

        <Formik
          validationSchema={loginSchema}
          onSubmit={onHandleSubmit}
          initialValues={{
            email: "",
            password: "",
          }}
        >
          {({ handleSubmit, handleChange, values, errors }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4" controlId="formBasicEmail">
                <Form.Label
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                  }}
                >
                  Email Address
                </Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    ref={emailRef}
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "1rem",
                      padding: "12px 16px",
                    }}
                  />
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ color: "#ff6b6b" }}
                  >
                    {errors.email}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-4" controlId="formBasicPassword">
                <Form.Label
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                  }}
                >
                  Password
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "1rem",
                      padding: "12px 16px",
                    }}
                  />
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ color: "#ff6b6b" }}
                  >
                    {errors.password}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Button
                type="submit"
                className="w-100"
                disabled={isLoading}
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "14px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 25px rgba(59, 130, 246, 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 20px rgba(59, 130, 246, 0.3)";
                  }
                }}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>

              <div className="text-center mt-3">
                <Button
                  variant="link"
                  onClick={() => setShowForgotPasswordModal(true)}
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    padding: "0",
                    border: "none",
                    background: "none",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "rgba(255, 255, 255, 1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                  }}
                >
                  Forgot your password?
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </AuthCard>

      <ForgotPasswordModal
        show={showForgotPasswordModal}
        onHide={() => setShowForgotPasswordModal(false)}
      />
    </>
  );
}
