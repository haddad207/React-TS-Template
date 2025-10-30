import { useRef, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import * as formik from "formik";
import { useForgotPassword } from "../../hooks/useForgotPassword.ts";
import { forgotPasswordSchema } from "../../validation/authSchemas";
import type {
  ForgotPasswordModalProps,
  ForgotPasswordFormData,
} from "../../models/auth/AuthTypes";

function ForgotPasswordModal({ show, onHide }: ForgotPasswordModalProps) {
  const forgotPasswordEmailRef = useRef<HTMLInputElement>(null);
  const { Formik } = formik;

  const { message, error, submitForgotPassword, clearMessages, isLoading } =
    useForgotPassword();

  useEffect(() => {
    if (show) {
      clearMessages();
      setTimeout(() => {
        forgotPasswordEmailRef.current?.focus();
      }, 100);
    }
  }, [show, clearMessages]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onHide();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onHide]);

  const handleSubmit = async (data: ForgotPasswordFormData) => {
    const result = await submitForgotPassword(data);
    // Modal will auto-close via useEffect if successful
  };

  const handleClose = () => {
    clearMessages();
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header
        closeButton
        style={{
          background: "linear-gradient(135deg, #1f2937, #374151)",
          border: "none",
          color: "#ffffff",
        }}
      >
        <Modal.Title style={{ fontSize: "1.25rem", fontWeight: "600" }}>
          Reset Your Password
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        style={{
          background: "linear-gradient(135deg, #1f2937, #374151)",
          color: "#ffffff",
        }}
      >
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
          style={{ marginBottom: "1.5rem", color: "rgba(255, 255, 255, 0.8)" }}
        >
          Enter your email address and we'll send you instructions to reset your
          password.
        </p>

        <Formik
          validationSchema={forgotPasswordSchema}
          onSubmit={handleSubmit}
          initialValues={{
            email: "",
          }}
        >
          {({ handleSubmit, handleChange, values, errors, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                  }}
                >
                  Email Address
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  ref={forgotPasswordEmailRef}
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
                  style={{ color: "#ef4444" }}
                >
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-flex gap-2 justify-content-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleClose}
                  disabled={isSubmitting || isLoading}
                  style={{
                    background: "rgba(107, 114, 128, 0.8)",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px",
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
                    padding: "10px 20px",
                    fontWeight: "600",
                  }}
                >
                  {isSubmitting || isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}

export default ForgotPasswordModal;
