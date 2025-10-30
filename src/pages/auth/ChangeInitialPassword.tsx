import { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import * as formik from "formik";
import "./auth.css";
import { useChangeInitialPasswordMutation } from "../../api/authApi.ts";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../../store/store.ts";
import { login } from "../../store/slices/userSlice.ts";
import AuthCard from "../../components/auth/AuthCard.tsx";
import { changeInitialPasswordSchema } from "../../validation/authSchemas.ts";
import type ChangeInitialPasswordForm from "../../models/auth/password/ChangeInitialPasswordForm.ts";



export default function ChangeInitialPassword() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [changeInitialPassword, { isLoading, error }] = useChangeInitialPasswordMutation();
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const { Formik } = formik;
  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Get temporary user data from sessionStorage
    const tempUserId = sessionStorage.getItem('tempUserId');
    const tempEmail = sessionStorage.getItem('tempEmail');

    if (!tempUserId || !tempEmail) {
      // If no temp data, redirect to login
      navigate('/login');
      return;
    }

    setUserId(tempUserId);
    setUserEmail(tempEmail);
    currentPasswordRef.current?.focus();
  }, [navigate]);

  const onHandleSubmit = async (data: ChangeInitialPasswordForm) => {
    try {
      const result = await changeInitialPassword({
        userId,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      if (result.data) {
        // Clear temporary data
        sessionStorage.removeItem('tempUserId');
        sessionStorage.removeItem('tempEmail');

        // Log the user in with the new token
        dispatch(login(result.data.auth));

        // Show success message briefly
        setShowSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (e) {
      // Error handling is done by the error state from the mutation
    }
  };

  if (showSuccess) {
    return (
      <AuthCard title="Password Changed Successfully">
        <Alert variant="success" className="text-center">
          <strong>Success!</strong> Your password has been changed successfully.
          <br />
          Redirecting to dashboard...
        </Alert>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Set Your Password">
      <div className="text-center mb-4">
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem' }}>
          Welcome, <strong>{userEmail}</strong>
        </p>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
          You must change your temporary password to continue
        </p>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {('data' in error && error.data && typeof error.data === 'object' && 'message' in error.data)
            ? (error.data as any).message
            : 'Failed to change password. Please try again.'}
        </Alert>
      )}

      <Formik
        validationSchema={changeInitialPasswordSchema}
        onSubmit={onHandleSubmit}
        initialValues={{
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
      >
        {({ handleSubmit, handleChange, values, errors }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4" controlId="formCurrentPassword">
              <Form.Label style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.95rem', fontWeight: '500' }}>
                Temporary Password
              </Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="password"
                  placeholder="Enter your temporary password"
                  name="currentPassword"
                  value={values.currentPassword}
                  onChange={handleChange}
                  isInvalid={!!errors.currentPassword}
                  ref={currentPasswordRef}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '1rem',
                    padding: '12px 16px'
                  }}
                />
                <Form.Control.Feedback type="invalid" style={{ color: '#ff6b6b' }}>
                  {errors.currentPassword}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formNewPassword">
              <Form.Label style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.95rem', fontWeight: '500' }}>
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
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '1rem',
                    padding: '12px 16px'
                  }}
                />
                <Form.Control.Feedback type="invalid" style={{ color: '#ff6b6b' }}>
                  {errors.newPassword}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formConfirmPassword">
              <Form.Label style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.95rem', fontWeight: '500' }}>
                Confirm New Password
              </Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="password"
                  placeholder="Confirm your new password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  isInvalid={!!errors.confirmPassword}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '1rem',
                    padding: '12px 16px'
                  }}
                />
                <Form.Control.Feedback type="invalid" style={{ color: '#ff6b6b' }}>
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Button
              type="submit"
              className="w-100"
              disabled={isLoading}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                borderRadius: '8px',
                padding: '14px',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(16, 185, 129, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.3)';
                }
              }}
            >
              {isLoading ? 'Changing Password...' : 'Change Password'}
            </Button>

            <div className="text-center mt-3">
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>
                Password must contain at least 8 characters with uppercase, lowercase, number, and special character
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </AuthCard>
  );
}