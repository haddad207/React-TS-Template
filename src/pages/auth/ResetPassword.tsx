import { useRef, useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import * as formik from "formik";
import { useNavigate } from "react-router";
import AuthCard from "../../components/auth/AuthCard.tsx";
import { useResetPassword } from "../../hooks/useResetPassword.ts";
import { resetPasswordSchema } from "../../validation/authSchemas.ts";
import "./auth.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const passwordRef = useRef<HTMLInputElement>(null);
  const { Formik } = formik;

  const {
    message,
    error,
    email,
    submitResetPassword,
    isLoading,
    isValidResetLink,
  } = useResetPassword();

  useEffect(() => {
    if (isValidResetLink) {
      passwordRef.current?.focus();
    }
  }, [isValidResetLink]);

  if (!isValidResetLink) {
    return (
      <AuthCard title="Password Reset">
        <Alert
          variant="danger"
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#ef4444",
          }}
        >
          Invalid reset link. Please request a new password reset.
        </Alert>
        <Button
          variant="primary"
          onClick={() => navigate("/login")}
          className="w-100"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            border: "none",
            borderRadius: "8px",
            padding: "14px",
            fontSize: "1rem",
            fontWeight: "600",
          }}
        >
          Back to Login
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Reset Password">
      {message && (
        <Alert
          variant="success"
          style={{
            background: "rgba(34, 197, 94, 0.1)",
            border: "1px solid rgba(34, 197, 94, 0.3)",
            color: "#22c55e",
          }}
        >
          {message}
        </Alert>
      )}

      {error && (
        <Alert
          variant="danger"
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#ef4444",
          }}
        >
          {error}
        </Alert>
      )}

      <p
        style={{
          marginBottom: "1.5rem",
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: "0.9rem",
        }}
      >
        Enter your new password for:{" "}
        <strong style={{ color: "#ffffff" }}>{email}</strong>
      </p>

      <Formik
        validationSchema={resetPasswordSchema}
        onSubmit={submitResetPassword}
        initialValues={{
          newPassword: "",
          confirmPassword: "",
        }}
      >
        {({ handleSubmit, handleChange, values, errors, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4" controlId="formNewPassword">
              <Form.Label
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: "0.95rem",
                  fontWeight: "500",
                }}
              >
                New Password
              </Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="password"
                  placeholder="Enter your new password"
                  name="newPassword"
                  value={values.newPassword}
                  onChange={handleChange}
                  isInvalid={!!errors.newPassword}
                  ref={passwordRef}
                  disabled={isSubmitting || isLoading}
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
                  {errors.newPassword}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formConfirmPassword">
              <Form.Label
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: "0.95rem",
                  fontWeight: "500",
                }}
              >
                Confirm Password
              </Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="password"
                  placeholder="Confirm your new password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  isInvalid={!!errors.confirmPassword}
                  disabled={isSubmitting || isLoading}
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
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <div className="d-flex gap-2 justify-content-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/login")}
                disabled={isSubmitting || isLoading}
                style={{
                  background: "rgba(107, 114, 128, 0.8)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "14px 20px",
                  color: "#ffffff",
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "14px 20px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3)",
                  transition: "all 0.3s ease",
                }}
              >
                {isSubmitting || isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </AuthCard>
  );
}
