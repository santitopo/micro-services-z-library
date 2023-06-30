import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Checkbox,
  Button
} from '@material-ui/core';
import { finishReserve, getReserves } from 'src/services/reservationService';
import moment from 'moment';
import Label from './Label';
import { getAccountInfo } from 'src/services/authService';
import { getAllReserves } from 'src/services/reservationService';
import { useNavigate } from 'react-router';

export default function ReservesTable() {
  const navigate = useNavigate();
  const [reserves, setReserves] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);

  useEffect(() => {
    if (!loadingReservations) {
      return;
    }
    fetchReservesData();
    setLoadingReservations(false);
  }, [loadingReservations]);

  const fetchReservesData = async () => {
    try {
      const { isAdmin, organizationId } = getAccountInfo();
      if (isAdmin) {
        const { data } = await getAllReserves(organizationId);
        setReserves(data);
      } else {
        const { data } = await getReserves();
        setReserves(data);
      }
    } catch (error) {
      setReserves([]);
    }
  };

  const handleChange = async (bookId) => {
    try {
      await finishReserve(bookId);
      setLoadingReservations(true);
    } catch (error) {}
  };

  const handleReview = (book, canReview) => {
    navigate('/dashboard/reviews', { state: { book, canReview } });
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650, width: '90%', margin: 'auto' }}>
        <TableHead>
          <TableRow>
            <TableCell>ISBN</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Fecha Desde</TableCell>
            <TableCell>Fecha Hasta</TableCell>
            <TableCell>Estado</TableCell>
            {getAccountInfo().isAdmin && <TableCell>Devuelta</TableCell>}
            {!getAccountInfo().isAdmin && <TableCell>Reseña</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {reserves.map((bookData) => (
            <TableRow
              key={bookData.book.isbn}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {bookData.book.isbn}
              </TableCell>
              <TableCell component="th" scope="row">
                {bookData.book.title}
              </TableCell>
              <TableCell>{moment(new Date(bookData.dateFrom)).format('DD/MM/YYYY')}</TableCell>
              <TableCell>{moment(new Date(bookData.dateTo)).format('DD/MM/YYYY')}</TableCell>
              <TableCell align="left">
                <Label
                  variant="ghost"
                  color={
                    (bookData.state === 'En Falta' && 'error') ||
                    (bookData.state === 'Próxima' && 'warning') ||
                    (bookData.state === 'Activa' && 'warning') ||
                    'success'
                  }
                >
                  {bookData.state}
                </Label>
              </TableCell>
              {getAccountInfo().isAdmin && (
                <TableCell align="left">
                  <Checkbox
                    checked={bookData.state === 'Finished'}
                    disabled={bookData.state === 'Finished'}
                    onChange={() => handleChange(bookData.grouping_uuid)}
                    color="primary"
                  ></Checkbox>
                </TableCell>
              )}
              {!getAccountInfo().isAdmin && (
                <TableCell align="left">
                  <Button
                    disabled={!bookData.canReview}
                    onClick={() => handleReview(bookData.book, bookData.canReview)}
                    variant="contained"
                  >
                    Dejar Reseña
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
