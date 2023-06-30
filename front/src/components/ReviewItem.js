import * as React from 'react';
import {
  Avatar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Rating,
  Typography
} from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import DeleteIcon from '@material-ui/icons/Delete';

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name)
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
  };
}

export default function AlignItemsList({
  name,
  surname,
  description,
  stars,
  onDelete,
  isDeleteable
}) {
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar {...stringAvatar(`${name} ${surname}`)} />
        </ListItemAvatar>
        <ListItemText
          primary={`${name} ${surname}`}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline', marginTop: 10 }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {description}
              </Typography>
            </React.Fragment>
          }
        />
        <ListItemIcon>
          <Rating
            name="text-feedback"
            value={stars}
            readOnly
            precision={0.5}
            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
          />
        </ListItemIcon>
        {isDeleteable && (
          <IconButton>
            <DeleteIcon onClick={() => onDelete(description)} />
          </IconButton>
        )}
      </ListItem>

      <Divider variant="inset" component="li" />
    </List>
  );
}
