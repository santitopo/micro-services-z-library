import React from 'react';
import Page from '../components/Page';
import {
  Box,
  Container,
  Typography,
  Card,
  Stack,
  TextField,
  IconButton,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import ReplayIcon from '@material-ui/icons/Replay';
import { useEffect, useState } from 'react';
import { getAccountInfo, inviteUser, changePreferences } from 'src/services/authService';
import { getOrganizationInfo, refreshApiKey } from 'src/services/organizationService';
import ErrorMessage from 'src/components/ErrorMessage';

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '95%',
  display: 'flex',
  flexDirection: 'column',
  gap: 15,
  padding: 40
}));

const changePreferencesInApi = async (organizationId, mail_preference) => {
  try {
    await changePreferences(organizationId, mail_preference);
  } catch (error) {
    console.log('error changing preferences against the backend');
  }
};

export default function Configuration() {
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState(null);
  const [organizationId] = useState(getAccountInfo().organizationId);
  const [checked, setChecked] = React.useState(true);

  useEffect(() => {
    const notificationsActivated = getAccountInfo().mail_notifications;
    setChecked(notificationsActivated === 'true');
  }, []);

  useEffect(async () => {
    fetchApiKey();
  }, [organizationId, apiKey]);

  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
    changePreferencesInApi(organizationId, event.target.checked);
  };

  const fetchApiKey = async () => {
    try {
      const { data } = await getOrganizationInfo(organizationId);
      setApiKey(data.api_key);
    } catch (error) {}
  };

  const handleSend = async (email) => {
    try {
      const { data } = await inviteUser({ email, isAdmin });
      if (data.length > 0) setError({ message: data[0].reason });
      else setError(null);
    } catch (error) {
      setError(error);
      return;
    }

    setEmail('');
  };

  const handleRefresh = async () => {
    try {
      const { data } = await refreshApiKey(organizationId);
      setApiKey(data);
    } catch (error) {
      setError(error);
      return;
    }
  };

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <Page title="Configuración | zLibrary">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Configuración</Typography>
        </Box>

        {error && <ErrorMessage message={error.message} />}

        {getAccountInfo().isAdmin && (
          <Stack spacing={3}>
            <SectionStyle>
              <div>
                <Typography variant="h5">Invitar a usuario</Typography>
                <Typography variant="body1" color="#808080">
                  Enviar invitacion a usuarios para unirse a la plataforma
                </Typography>
              </div>
              <Stack direction="row" gap={5} paddingRight={5}>
                <TextField fullWidth value={email} onChange={handleChange} label="Email" />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isAdmin}
                      onChange={() => {
                        setIsAdmin(!isAdmin);
                      }}
                    />
                  }
                  label="Admin"
                />
                <IconButton aria-label="send">
                  <SendIcon onClick={() => handleSend(email)} />
                </IconButton>
              </Stack>
            </SectionStyle>
            <SectionStyle>
              <div>
                <Typography variant="h5">API Key</Typography>
                <Typography variant="body1" color="#808080">
                  Clave única de la organizacion
                </Typography>
              </div>
              <Stack direction="row" gap={5} paddingRight={5}>
                <TextField fullWidth value={apiKey} label="Key" disabled />
                <IconButton aria-label="refresh">
                  <ReplayIcon onClick={handleRefresh} />
                </IconButton>
              </Stack>
            </SectionStyle>
          </Stack>
        )}
        {!getAccountInfo().isAdmin && (
          <SectionStyle>
            <div>
              <Typography variant="h5">Recibir notificaciones de recuerdos de reservas</Typography>
              <Typography variant="body1" color="#808080">
                El sistema le enviará un correo electrónico el día antes de la fecha de finalización
                de cada una de sus reservas.
              </Typography>
            </div>
            <FormControlLabel
              checked={checked}
              onChange={handleCheckboxChange}
              control={<Checkbox color="primary"></Checkbox>}
              label="Recibir notificaciones"
            />
          </SectionStyle>
        )}
      </Container>
    </Page>
  );
}
