import Box, { IBox } from '@/components/atoms/box';
import UploadIcon from '@/components/atoms/icons/uploadIcon';
import Input from '@/components/atoms/input';
import Typography from '@/components/atoms/typography';
import React, { useState } from 'react';

interface IDragUpload extends IBox {
  setImage: (arg: string | ArrayBuffer | null) => void;
  icon?: React.ReactNode;
  isImageViewAuto?: boolean;
  name?: string;
}

const DragUpload = ({
  setImage,
  icon = <UploadIcon />,
  isImageViewAuto = true,
  name = 'fileId',
  ...props
}: IDragUpload) => {
  const [highlighted, setHighlighted] = useState(false);

  const handleFiles = (files: FileList | any) => {
    setImage(files[0]);

    if (isImageViewAuto) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = function () {
        const img = document.createElement('img');
        img.src = reader.result as string;
        img.className = 'image';
        img.width = 200;
        const dropArea = document.getElementById('drop-area');
        if (dropArea) {
          dropArea.appendChild(img);
        }
      };
    }
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
    if (e.dataTransfer.files && e.dataTransfer.files?.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <Box id="drop-area" onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}>
      <Box
        p="24px 0"
        display="flex"
        alignItems="center"
        justifyContent="center"
        border={highlighted ? '1px dashed red' : '1px dashed #CCC'}
        borderRadius={3}
        minWidth={200}
        gap="10px"
        {...props}
      >
        <Input
          type="file"
          id={name}
          inputProps={{ accept: 'image/*' }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            if (e?.target?.files && e?.target?.files?.length > 0) {
              handleFiles(e.target.files);
            }
          }}
          sx={{ display: 'none' }}
        />
        <label htmlFor={name}>
          <Box display="flex" flexDirection="column" gap="10px" alignItems="center">
            {/* <UploadIcon /> */}
            {icon}
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
