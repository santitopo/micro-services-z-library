import { styled } from '@material-ui/core/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import BookIcon from '@material-ui/icons/Book';
import {
  Card,
  Stack,
  Container,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import Logo from '../components/Logo';
import Page from '../components/Page';
import { MHidden } from '../components/@material-extend';
import { loginWithOrganization } from 'src/services/authService';

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

export default function Organization() {
  const navigate = useNavigate();
  const { organizations, userInfo } = useLocation().state;

  const handleLogin = async (organizationId) => {
    try {
      await loginWithOrganization(userInfo, organizationId);
      navigate('/dashboard/app', { replace: true });
    } catch (error) {}
  };

  return (
    <RootStyle title="Iniciar Sesión | zLibrary">
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
              Elige tu Organización
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Elige una de las opciones debajo.
            </Typography>
          </Stack>

          <Card sx={{ width: '100%', maxWidth: 360, padding: '3%' }}>
            <nav aria-label="organizations">
              <List>
                {organizations.map((organization) => (
                  <ListItem key={organization.id}>
                    <ListItemButton onClick={() => handleLogin(organization.id)}>
                      <ListItemIcon>
                        <BookIcon />
                      </ListItemIcon>
                      <ListItemText primary={organization.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </nav>
          </Card>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
