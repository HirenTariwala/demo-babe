import Box, { IBox } from '@/components/atoms/box';
import UploadIcon from '@/components/atoms/icons/uploadIcon';
import Input from '@/components/atoms/input';
import Typography from '@/components/atoms/typography';
import React, { useState } from 'react';

interface IDragUpload extends IBox {}

const DragUpload = ({ ...props }: IDragUpload) => {
  const [highlighted, setHighlighted] = useState(false);
  const handleFiles = (files: FileList | any) => {
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onloadend = function () {
      const img = document.createElement('img');
      img.src = reader.result as string;
      img.className = 'image';
      const dropArea = document.getElementById('drop-area');
      if (dropArea) {
        console.log('enter', img);
        dropArea.appendChild(img);
      }
    };
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setHighlighted(true);
    } else if (e.type === 'dragleave') {
      setHighlighted(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setHighlighted(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <Box
      id="drop-area"
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      width={552}
    >
      <Box
        p="24px 0"
        display="flex"
        alignItems="center"
        justifyContent="center"
        border={highlighted ? '1px dashed red' : '1px dashed #CCC'}
        borderRadius={3}
        minWidth={311}
        maxWidth="552px"
        gap="10px"
        {...props}
      >
        <Input
          type="file"
          id="fileElem"
          inputProps={{ accept: 'image/*' }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target) {
              handleFiles(e.target.files);
            }
          }}
          sx={{ display: 'none' }}
        />
        <label htmlFor="fileElem">
          <Box display="flex" flexDirection="column" gap="10px" alignItems="center">
            <UploadIcon />
            <Typography variant="subtitle2" className="upload-text">
              Drag & drop files or click to <b>Upload</b>
            </Typography>
            <Typography variant="caption" component="span">
              Supported formats: JPG, JPEG, PNG
            </Typography>
          </Box>
        </label>
      </Box>
    </Box>
  );
};

export default DragUpload;
