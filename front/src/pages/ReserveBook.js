import { Box, Container, Typography } from '@material-ui/core';
import ReservesTable from 'src/components/ReservesTable';
import { getAccountInfo } from 'src/services/authService';
import Page from '../components/Page';

export default function ReserveBook() {
  return (
    <Page title="Mis Reservas | zLibrary">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">
            {getAccountInfo().isAdmin ? 'Administrar Reservas' : 'Reservas de Libros'}
          </Typography>
        </Box>
      </Container>
      <ReservesTable />
    </Page>
  );
}
