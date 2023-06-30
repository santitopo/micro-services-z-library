import React, { useEffect, useState } from 'react';
import Page from 'src/components/Page';
import { Card, Stack, IconButton, Divider, Typography, List } from '@material-ui/core';
import { Box } from '@material-ui/system';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useLocation, useNavigate } from 'react-router';
import ReviewForm from 'src/components/ReviewForm';
import { addReview, deleteReview, getReviews } from 'src/services/reviewsService';
import ReviewItem from '../components/ReviewItem';
import { getAccountInfo } from 'src/services/authService';
import moment from 'moment';

export default function Reviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const book = useLocation().state.book;
  const canReview = useLocation().state?.canReview;

  const { name, lastname } = getAccountInfo();

  const fetchReviews = async (isbn) => {
    try {
      const { data } = await getReviews(isbn);
      setReviews(data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchReviews(book.isbn);
  }, []);

  const handleAddReview = async (reviewData) => {
    const isbn = book.isbn;

    try {
      await addReview({ ...reviewData, isbn });

      setReviews([
        ...reviews,
        { ...reviewData, name, lastname, createdAt: moment().format('yyyy-MM-DD') }
      ]);
    } catch (error) {}
  };

  const handleDelete = async (description) => {
    const isbn = book.isbn;

    try {
      await deleteReview(isbn);
      setReviews(reviews.filter((review) => review.text !== description));
    } catch (error) {}
  };

  return (
    <Page title="Reviews | zLibrary">
      <Box sx={{ width: '90%', margin: '0 auto' }}>
        <Stack direction="row" alignItems="center" px={{ paddingBottom: '1%' }}>
          <IconButton color="primary" onClick={() => navigate(-1)}>
            <KeyboardBackspaceIcon />
          </IconButton>
        </Stack>
        <Card sx={{ padding: 2 }}>
          <Stack justifyContent="flex-start" alignItems="center" sx={{ padding: 3 }}>
            <Typography variant="h3" sx={{ px: 10 }}>
              {book?.title}
            </Typography>
            <Typography variant="h6" sx={{ px: 10 }}>
              {book?.authors}
            </Typography>
          </Stack>
          <Divider variant="middle" />
          {reviews && (
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {reviews.map((review) => (
                <ReviewItem
                  key={review.createdAt}
                  name={review.name}
                  surname={review.lastname}
                  description={review.text}
                  stars={review.score}
                  isDeleteable={review.name === name && review.lastname === lastname}
                  onDelete={handleDelete}
                />
              ))}
            </List>
          )}
          {canReview && <ReviewForm onSubmit={handleAddReview} />}
        </Card>
      </Box>
    </Page>
  );
}
