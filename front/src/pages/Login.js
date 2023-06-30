import { styled } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';
import { Card, Stack, Container, Typography, Link } from '@material-ui/core';
import AuthLayout from '../layouts/AuthLayout';
import Logo from '../components/Logo';
import Page from '../components/Page';
import { MHidden } from '../components/@material-extend';
import { LoginForm } from '../components/authentication/login';

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  maxWidth: 464,
  height: '95vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: 20,
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

export default function Login() {
  return (
    <RootStyle title="Iniciar Sesión | zLibrary">
      <AuthLayout>
        No tienes una cuenta? &nbsp;
        <Link underline="none" variant="subtitle2" component={RouterLink} to="/register">
          Registrate aquí
        </Link>
      </AuthLayout>

      <MHidden width="mdDown">
        <SectionStyle>
          <Logo />
          <Typography variant="h3" sx={{ px: 10, mt: 5 }} style={{ textAlign: 'center' }}>
            Hola, bienvenido nuevamente.
          </Typography>
          <img
            src="/static/illustrations/illustration_login.jpeg"
            alt="login"
            style={{ maxWidth: '100%' }}
          />
        </SectionStyle>
      </MHidden>

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Inicia Sesión en zLibrary
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>Agrega tus datos debajo.</Typography>
          </Stack>
          <LoginForm />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
