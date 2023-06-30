import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  IconButton,
  Tooltip
} from '@material-ui/core';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BlockIcon from '@material-ui/icons/Block';
import CommentIcon from '@material-ui/icons/Comment';

import Scrollbar from './Scrollbar';
import { UserListHead, UserListToolbar, UserMoreMenu } from './_dashboard/books';
import ReserveModalForm from './ReserveModalForm';
import { getAccountInfo } from 'src/services/authService';

const TABLE_HEAD = [
  { id: 'isbn', label: 'ISBN', alignRight: false },
  { id: 'title', label: 'Título', alignRight: false },
  { id: 'authors', label: 'Autores', alignRight: false },
  { id: 'year', label: 'Año', alignRight: false },
  { id: 'quantity', label: 'Cantidad de Ejemplares', alignRight: false },
  { id: '' }
];

export default function BookTable({
  data,
  currentPage,
  limit,
  onDelete,
  onPageSizeChange,
  onPageChange,
  name,
  onSetName
}) {
  const navigate = useNavigate();
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [openedIsbn, setOpenedIsbn] = useState(null);
  const handleOpen = (isbn) => setOpenedIsbn(isbn);
  const handleClose = () => setOpenedIsbn(null);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleReviews = (book) => {
    navigate('/dashboard/reviews', { state: { book } });
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleRowClick = (book) => {};

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Libros
        </Typography>
        {getAccountInfo().isAdmin && (
          <Button
            variant="contained"
            component={RouterLink}
            to="/dashboard/addBook"
            startIcon={<Icon icon={plusFill} />}
          >
            Nuevo Libro
          </Button>
        )}
      </Stack>
      <Card sx={{ p: 2 }}>
        <UserListToolbar numSelected={selected.length} name={name} onSetName={onSetName} />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={data.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />

              <TableBody>
                {data.map((book) => {
                  const { id, isbn, title, authors, year, quantity } = book;
                  const isItemSelected = selected.indexOf(id) !== -1;

                  return (
                    <TableRow
                      hover
                      key={id}
                      tabIndex={-1}
                      role="checkbox"
                      selected={isItemSelected}
                      aria-checked={isItemSelected}
                    >
                      <TableCell component="th" scope="row" onClick={() => handleRowClick(book)}>
                        {isbn}
                      </TableCell>
                      <TableCell align="left">{title}</TableCell>
                      <TableCell align="left">{authors}</TableCell>
                      <TableCell align="left">{year}</TableCell>
                      <TableCell align="left">{quantity}</TableCell>
                      {!getAccountInfo().isAdmin ? (
                        <TableCell align="right">
                          <Tooltip title="Reservar">
                            <IconButton
                              disabled={quantity === 0}
                              aria-label="reserve"
                              color="primary"
                              onClick={() => handleOpen(isbn)}
                            >
                              <BookmarkIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      ) : null}
                      <TableCell align="right">
                        <Tooltip title="Ver Comentarios">
                          <IconButton
                            disabled={quantity === 0}
                            aria-label="reserve"
                            color="primary"
                            onClick={() => handleReviews(book)}
                          >
                            <CommentIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      {getAccountInfo().isAdmin && (
                        <TableCell align="right">
                          <UserMoreMenu book={book} onDelete={onDelete} />
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <ReserveModalForm open={openedIsbn !== null} onClose={handleClose} isbn={openedIsbn} />

        <TablePagination
          labelRowsPerPage="Filas por página"
          rowsPerPageOptions={[5]}
          component="div"
          count={-1}
          rowsPerPage={limit}
          page={currentPage}
          onPageChange={(event, newPage) => {
            onPageChange(newPage);
          }}
          onRowsPerPageChange={(e) => onPageSizeChange(e.target.value)}
        />
      </Card>
    </Container>
  );
}
