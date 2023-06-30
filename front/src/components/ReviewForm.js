import { Rating, Stack, TextField, IconButton } from '@material-ui/core';
import React from 'react';
import SendIcon from '@material-ui/icons/Send';

export default function ReviewForm({ onSubmit }) {
  const [score, setScore] = React.useState(1);
  const [text, setText] = React.useState('');

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  return (
    <Stack
      gap={1}
      sx={{ paddingLeft: 10, paddingRight: 10, marginBottom: 0, justifyContent: 'center' }}
    >
      <TextField
        value={text}
        onChange={handleTextChange}
        fullWidth
        label="Deja tu reseña aqui"
        multiline
        rows={4}
      />
      <Stack direction="row" gap={5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Rating
          name="simple-controlled"
          value={score}
          onChange={(event, newValue) => {
            setScore(newValue);
          }}
        />
        <IconButton aria-label="send">
          <SendIcon onClick={() => onSubmit({ score, text })} />
        </IconButton>
      </Stack>
    </Stack>
  );
}
