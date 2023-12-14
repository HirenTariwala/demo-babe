export const getColor = (status: string) => {
    switch (status) {
      case 'error':
        return {
          backgroundColor: '#FDF1F1',
          color: '#E32D2D',
        };
      case 'primary':
        return {
          backgroundColor: '#F0F0F0',
          color: '#646464',
        };
      case 'success':
        return {
          backgroundColor: '#DBF0DC',
          color: '#4CAF4F',
        };
      case 'warning':
        return {
          backgroundColor: '#FEF7ED',
          color: '#DD8700',
        };
      case 'info':
        return {
          backgroundColor: '#ECF7FE',
          color: '#37AAF2',
        };
      default:
        break;
    }
  };