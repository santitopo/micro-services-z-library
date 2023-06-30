import { Box, Card, Container, Typography } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { useLocation } from 'react-router';
import { getAccountInfo } from 'src/services/authService';

import Logo from '../components/Logo';
import Page from '../components/Page';

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '95%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 30
}));

export default function Dashboard() {
  const { state } = useLocation();

  return (
    <Page title="Dashboard | zLibrary">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hola, Bienvenido {getAccountInfo().name} </Typography>
        </Box>

        <SectionStyle>
          <Logo />
          <Typography variant="h3">Bienvenido a zLibrary</Typography>
        </SectionStyle>
      </Container>
    </Page>
  );
}
