import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Typography } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import Page from '../components/Page';
import { useParams, useNavigate } from 'react-router-dom';
import { acceptInvite } from 'src/services/authService';
import ErrorMessage from 'src/components/ErrorMessage';
import jwtDecode from 'jwt-decode';

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '80%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 30,
  margin: '20% auto'
}));

export default function Invitation() {
  const { registrationToken } = useParams();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState('');
  const [error, setError] = useState(null);

  const acceptInvitation = async () => {
    try {
      await acceptInvite(registrationToken);
      navigate('/login', { replace: true });
    } catch (ex) {
      setError(ex);
    }
  };

  useEffect(() => {
    setOrganization(jwtDecode(registrationToken).organizationName);
  }, [registrationToken]);

  return (
    <Page title="Dashboard | zLibrary">
      <Container maxWidth="xl">
        <SectionStyle>
          {error && (
            <ErrorMessage
              message={
                'No se ha podido aceptar la invitacion en este momento, por favor intentelo de nuevo.'
              }
            />
          )}
          <Typography variant="h3">Bienvenido a zLibrary</Typography>
          <Typography variant="h4">
            Has sido invitado a formar parte de la organizacion {organization}.
          </Typography>
          <Button onClick={acceptInvitation}>Aceptar Invitacion</Button>
        </SectionStyle>
      </Container>
    </Page>
  );
}
