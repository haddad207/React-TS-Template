import React from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";

interface AuthCardProps {
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

function AuthCard({ title, children, maxWidth = '400px' }: AuthCardProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          pointerEvents: 'none'
        }}
      />

      <Container className="d-flex justify-content-center" style={{ maxWidth: '500px', position: 'relative', zIndex: 1 }}>
        <Card
          style={{
            width: '100%',
            maxWidth,
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(120, 200, 255, 0.8), transparent)',
              height: '2px',
              width: '100%'
            }}
          />

          <Card.Header
            className="text-center border-0"
            style={{
              background: 'transparent',
              color: '#ffffff',
              fontSize: '1.5rem',
              fontWeight: '600',
              paddingTop: '2rem',
              paddingBottom: '1rem'
            }}
          >
            {title}
          </Card.Header>

          <Card.Body style={{ padding: '0 2rem 2rem 2rem' }}>
            {children}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default AuthCard;