import React, { useCallback, useEffect, useState } from 'react';
import Page from '../components/Page';

import { getBooks, deleteBook } from '../services/bookService';
import BookTable from 'src/components/BookTable';

export default function Book() {
  const [booksData, setBooksData] = useState([]);
  const [prev, setPrev] = useState(null);
  const [next, setNext] = useState(null);
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [name, setName] = useState('');

  const fetchBooksData = useCallback(
    async (page) => {
      try {
        const { data } = await getBooks(name, page, limit);
        if (data.next) {
          setNext(data.next.page);
          setLimit(data.next.limit);
        }
        if (data.previous) {
          setPrev(data.previous.page);
          setLimit(data.previous.limit);
        }
        setBooksData(data.results);
      } catch (error) {}
    },
    [limit, name]
  );
  useEffect(() => {
    fetchBooksData(0);
    setCurrentPage(0);
  }, [fetchBooksData]);

  const handlePageSizeChange = (pageSize) => {
    setLimit(pageSize);
  };

  const handleChangePage = useCallback(
    (newPage) => {
      fetchBooksData(newPage);
      setCurrentPage(newPage);
    },
    [fetchBooksData]
  );

  const handleNameChanged = (event) => {
    setName(event.target.value);
  };

  const handleDelete = async (isbn) => {
    const originalData = booksData;

    try {
      const booksFiltered = booksData.filter((book) => book.isbn !== isbn);
      setBooksData(booksFiltered);
      await deleteBook(isbn);
    } catch (error) {
      // Rollback
      setBooksData(originalData);
    }
  };

  return (
    <Page title="Libros | zLibrary">
      <BookTable
        data={booksData}
        prev={prev}
        next={next}
        limit={limit}
        currentPage={currentPage}
        onPageChange={handleChangePage}
        onPageSizeChange={handlePageSizeChange}
        onDelete={handleDelete}
        name={name}
        onSetName={handleNameChanged}
      />
    </Page>
  );
}
