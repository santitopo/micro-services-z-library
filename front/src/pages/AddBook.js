import React from 'react';
import Page from '../components/Page';
import { styled } from '@material-ui/core/styles';

import AddBookForm from 'src/components/AddBookForm';
import { Card, Typography } from '@material-ui/core';

export default function AddBook() {
  const SectionStyle = styled(Card)((props) => ({
    width: '80%',
    margin: 'auto',
    alignItems: 'center',
    padding: '5%'
  }));

  return (
    <Page title="Libros | zLibrary">
      <SectionStyle>
        <Typography variant="h4" gutterBottom>
          Agrega tu Libro
        </Typography>
        <AddBookForm />
      </SectionStyle>
    </Page>
  );
}
