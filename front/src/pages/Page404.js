import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';
import { Box, Button, Typography, Container } from '@material-ui/core';

import { MotionContainer, varBounceIn } from '../components/animate';
import Page from '../components/Page';

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

export default function Page404() {
  return (
    <RootStyle title="404 Page Not Found">
      <Container>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <motion.div variants={varBounceIn}>
              <Typography variant="h3" paragraph>
                Lo lamento, página no encontrada!
              </Typography>
            </motion.div>
            <Typography sx={{ color: 'text.secondary' }}>
              Lo sentimos, no pudimos encontrar la página que busca. ¿Quizás ha escrito mal la URL?
              Asegúrese de revisar su ortografía.
            </Typography>

            <Box
              component="img"
              src="/static/illustrations/illustration_404.jpeg"
              sx={{ my: { xs: 2, sm: 2 } }}
            />

            <Button to="/dashboard/app" size="large" variant="contained" component={RouterLink}>
              Ir al Dashboard
            </Button>
          </Box>
        </MotionContainer>
      </Container>
    </RootStyle>
  );
}
