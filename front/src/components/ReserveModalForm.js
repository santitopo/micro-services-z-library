import React, { useState, useEffect, useCallback } from 'react';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { LoadingButton } from '@material-ui/lab';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DatePicker from '@material-ui/lab/DatePicker';
import DateAdapter from '@material-ui/lab/AdapterMoment';
import moment from 'moment';
import {
  Modal,
  Stack,
  TextField,
  Box,
  Typography,
  Checkbox,
  FormControlLabel
} from '@material-ui/core';
import { getAvailability, reserveBook } from 'src/services/reservationService';
import ErrorMessage from './ErrorMessage';
import { useNavigate } from 'react-router';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '20%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4
};

export default function ReserveModalForm({ open, onClose, isbn }) {
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    date: new Date()
  });
  const [availableDates, setAvailableDates] = useState([]);
  const [month, setMonth] = useState(moment(Date.now()).month() + 1);

  const fetchAvailableDates = useCallback(async () => {
    const response = await getAvailability(isbn, month);
    setAvailableDates(response.data.availableDate);
  }, [month, isbn]);

  useEffect(() => {
    fetchAvailableDates();
  }, [fetchAvailableDates]);

  const ReserveBookSchema = Yup.object().shape({
    date: Yup.string()
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: ReserveBookSchema,
    onSubmit: async (values) => {
      const date = moment(values.date).format('YYYY-MM-DD');

      try {
        await reserveBook({ dateFrom: date, isbn });
        onClose();
        navigate('/dashboard/books', { replace: true });
      } catch (error) {
        setError(true);
        return;
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

  function disableWeekends(date) {
    return !availableDates.includes(moment(date).date());
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {error && (
          <ErrorMessage
            message={'No se ha podido crear la reserva, por favor intentelo de nuevo'}
          />
        )}
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <LocalizationProvider dateAdapter={DateAdapter}>
                <DatePicker
                  label="Fecha de Reserva"
                  inputFormat="YYYY-MM-DD"
                  shouldDisableDate={(date) => disableWeekends(date)}
                  {...getFieldProps('date')}
                  minDate={Date.now()}
                  maxDate={new Date(2021, 11, 31)}
                  onMonthChange={(date) => setMonth(moment(date).month() + 1)}
                  onOpen={fetchAvailableDates}
                  onChange={(newValue) => {
                    setFieldValue('date', newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <LoadingButton fullWidth type="submit" variant="contained" loading={isSubmitting}>
                Reservar
              </LoadingButton>
            </Stack>
          </Form>
        </FormikProvider>
      </Box>
    </Modal>
  );
}
