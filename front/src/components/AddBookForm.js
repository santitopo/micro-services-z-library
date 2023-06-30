import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoadingButton } from '@material-ui/lab';
import { addBook, updateBook } from '../services/bookService';

import { Stack, TextField } from '@material-ui/core';
import ErrorMessage from './ErrorMessage';

export default function AddBookForm() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [error, setError] = useState(false);

  const [initialValues, setInitialValues] = useState({
    isbn: '',
    title: '',
    authors: '',
    year: '',
    quantity: ''
  });

  useEffect(() => {
    if (state) {
      const { isbn, title, authors, year, quantity } = state.book;
      setInitialValues({
        isbn,
        title,
        authors,
        year,
        quantity
      });
    }
  }, []);

  const BookSchema = Yup.object().shape({
    title: Yup.string().required('Titulo Requerido'),
    authors: Yup.string().required('Autor/es Requerido'),
    year: Yup.string().required('Año Requerido'),
    quantity: Yup.number()
      .typeError('La cantidad debe ser un número')
      .positive('La cantidad debe ser mayor a cero')
      .required('Cantidad de Ejemplares Requerida')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: BookSchema,
    onSubmit: async () => {
      const bookData = { ...formik.values };

      try {
        if (state) {
          delete bookData.isbn;
          await updateBook(state.book.isbn, bookData);
        } else {
          await addBook(bookData);
        }
      } catch (error) {
        setError(true);
        return;
      }

      navigate('/dashboard/books', { replace: true });
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <>
      {error && <ErrorMessage />}
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              disabled={state}
              label="ISBN"
              {...getFieldProps('isbn')}
              error={Boolean(touched.isbn && errors.isbn)}
              helperText={touched.isbn && errors.isbn}
            />
            <TextField
              fullWidth
              label="Título"
              {...getFieldProps('title')}
              error={Boolean(touched.title && errors.title)}
              helperText={touched.title && errors.title}
            />
            <TextField
              fullWidth
              label="Autores"
              {...getFieldProps('authors')}
              error={Boolean(touched.authors && errors.authors)}
              helperText={touched.authors && errors.authors}
            />
            <TextField
              fullWidth
              label="Año"
              {...getFieldProps('year')}
              error={Boolean(touched.year && errors.year)}
              helperText={touched.year && errors.year}
            />
            <TextField
              fullWidth
              label="Cantidad de Ejemplares"
              {...getFieldProps('quantity')}
              error={Boolean(touched.quantity && errors.quantity)}
              helperText={touched.quantity && errors.quantity}
            />
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              {state ? 'Actualizar Libro' : 'Agregar Libro'}
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>
    </>
  );
}
