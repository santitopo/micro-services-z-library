import React from 'react';
import ImageUploading from 'react-images-uploading';
import { styled } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button, Grid } from '@material-ui/core';

export function ImagePicker({ images, onImageChange }) {
  const maxNumber = 1;

  const SectionStyle = styled('div')(({ theme }) => ({
    margin: 'auto',
    gridTemplateRows: 'auto auto',
    display: 'grid',
    gap: 10,
    justifyContent: 'center',
    alignContent: 'center'
  }));

  return (
    <div className="App">
      <ImageUploading
        multiple
        value={images}
        onChange={onImageChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps
        }) => (
          <SectionStyle>
            {imageList.map((image, index) => (
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={1}
              >
                <Grid item>
                  <img
                    key={index}
                    src={image['data_url']}
                    alt=""
                    width="200"
                    height="200"
                    style={{ borderRadius: 100, border: '3px solid grey', margin: 'auto' }}
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => onImageRemove(index)}
                    {...dragProps}
                    startIcon={<DeleteIcon />}
                  >
                    Eliminar
                  </Button>
                </Grid>
              </Grid>
            ))}

            {!imageList[0] && (
              <button
                onClick={onImageUpload}
                {...dragProps}
                style={{ backgroundColor: 'transparent', border: 'none' }}
              >
                <img
                  src="/static/image-preview.png"
                  alt=""
                  width="200"
                  style={{
                    border: '3px solid #C5C5C5',
                    borderRadius: 100,
                    boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.15)'
                  }}
                />
              </button>
            )}
          </SectionStyle>
        )}
      </ImageUploading>
    </div>
  );
}
