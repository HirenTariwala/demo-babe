import { SelectChangeEvent, useMediaQuery } from '@mui/material';
import React, { useState } from 'react'

const useProfileSettingHook = () => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const phone = '+123456789';
  
    const [base64String, setBase64String] = useState<string>('');
    const [activeLocation, setActiveLocation] = useState<string>('');
    const [deleteModal, setDeleteModal] = useState(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        const file = e.target.files[0];
        const reader = new FileReader();
  
        reader.onload = (e) => {
          const base64Data = e.target?.result as string;
          setBase64String(base64Data);
        };
  
        reader.readAsDataURL(file);
      }
    };
  
    const handleLocationChange = (event: SelectChangeEvent) => {
      setActiveLocation(event.target.value);
    };
  
    const handleRemovePhoto = () => {
      setBase64String('');
    };
  
    const handleDeleteModal = () => {
      setDeleteModal(true);
    };
  
    const handleCloseDeleteModal = () => {
      setDeleteModal(false);
    };
return {
    isMobile,
    phone,
    base64String,
    deleteModal,
    activeLocation,
    handleCloseDeleteModal,
    handleDeleteModal,
    handleRemovePhoto,
    handleChange,
    handleLocationChange
}
}

export default useProfileSettingHook