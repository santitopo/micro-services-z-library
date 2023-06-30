import { Typography, Box } from '@material-ui/core';
import React from 'react';

export default function ErrorMessage({ message }) {
  return (
    <Box mb={4} sx={{ borderRadius: 1 }} bgcolor="#dc3545" textAlign="center">
      <Typography variant="h6" color="white" sx={{ px: 10 }}>
        {message ? message : 'Ha ocurrido un error, por favor intentalo de nuevo.'}
      </Typography>
    </Box>
  );
}
