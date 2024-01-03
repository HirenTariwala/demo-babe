import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import {
  Box,
  Button,
  Divider,
  FormControl,
  MenuItem,
  Select,
  Typography,
  Skeleton,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { debounce } from 'lodash';
import { auth } from '@/credentials/firebase';
import NextImage from '@/components/atoms/image';
import Input from '@/components/atoms/input';

interface Props {
  income: number;
  setStep: Dispatch<SetStateAction<number>>;
  setQuoteId: Dispatch<SetStateAction<string | null>>;
  setWithdrawAmount: Dispatch<SetStateAction<number | null>>;
  setTargetCurrency: Dispatch<SetStateAction<string | null>>;
  setError: Dispatch<SetStateAction<string>>;
}

interface Quote {
  id: string;
  rate: number;
  totalFee: number;
  amountConverted: number;
  targetAmount: number;
  targetCurrency: string;
  formattedEstimatedDelivery: string;
}

enum PageType {
  loading = 0,
  createQuotation = 1,
}

// const NumberFormatCustom = forwardRef<NumberFormat<InputAttributes>, CustomProps>((props, ref) => {
//   const { onChange, ...other } = props;

//   return (
//     <NumberFormat
//       {...other}
//       getInputRef={ref}
//       onValueChange={(values) => {
//         onChange({
//           target: {
//             name: props.name,
//             value: values.value,
//           },
//         });
//       }}
//       thousandSeparator
//       isNumericString
//     />
//   );
// });

const CalIconStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: '700',
  width: '16px',
  height: '16px',
  backgroundColor: '#16330014',
  borderRadius: '50%',
  lineHeight: '16px',
  marginRight: '10px',
};

const backEndUrl = process?.env?.NEXT_PUBLIC_APP_API_URL;

const currencyLocalStorageKey = 'wise-withdraw-currency';

const Quotation = (props: Props) => {
  // Platform transfer fees
  const variableFee = 0.25; // TODO: Get this from Firebase
  const fixedFee = 0.29; // TODO: Get this from Firebase

  // WISE currency code and ISO 3166 country code to get the flag
  const currecyCountryList = [
    {
      currency: 'SGD',
      countryCode: 'SG',
      countryName: 'Singapore',
    },
    {
      currency: 'MYR',
      countryCode: 'MY',
      countryName: 'Malaysia',
    },
    {
      currency: 'IDR',
      countryCode: 'ID',
      countryName: 'Indonesia',
    },
    {
      currency: 'THB',
      countryCode: 'TH',
      countryName: 'Thailand',
    },
    {
      currency: 'VND',
      countryCode: 'VN',
      countryName: 'Vietnam',
    },
    {
      currency: 'PHP',
      countryCode: 'PH',
      countryName: 'Philippines',
    },
    {
      currency: 'GBP',
      countryCode: 'GB',
      countryName: 'United Kingdom',
    },
    {
      currency: 'USD',
      countryCode: 'US',
      countryName: 'United States of America',
    },
  ];

  const [currency, setCurrency] = useState<string>('SGD');
  const [amount, setAmount] = useState<number | string>('');
  const [conversionRate, setConversionRate] = useState<number>(0);
  const [tranferFee, setTransferFee] = useState<number>(0);
  const [amountError, setAmountError] = useState<boolean>(false);
  const [amountErrorMessage, setAmountErrorMessage] = useState<string>('');
  const [quotation, setQuotation] = useState<Quote>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<PageType>(PageType.createQuotation);

  //Clear quotation id if it already exists
  useEffect(() => {
    props.setQuoteId(null);
    props.setTargetCurrency(null);
    props.setWithdrawAmount(null);

    // Get currency from local storage
    const currencyFromLocalStorage = localStorage.getItem(currencyLocalStorageKey);
    if (currencyFromLocalStorage) {
      setCurrency(currencyFromLocalStorage);
    }
    // eslint-disable-next-line
  }, []);

  // Make API call to get the quotation when input values change
  useEffect(() => {
    const debouncedApiCall = debounce(async () => {
      try {
        props.setError('');
        setConversionRate(0);
        const url = `${backEndUrl}/v1/quotations/new`;
        // const url = 'https://api.sandbox.transferwise.tech';
        const token = await auth?.currentUser?.getIdToken();

        const response = await axios.post(
          url,
          {
            amount: amount,
            targetCurrency: currency,
            isTargetAmount: false,
            withdrawalAmount: amount,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { data } = response.data;
        const quoteObject: Quote = {
          id: data.id,
          rate: data.rate,
          totalFee: data.paymentOptions[0]?.fee?.total ?? 0,
          amountConverted: data.sourceAmount - data.paymentOptions[0]?.fee?.total ?? 0,
          targetAmount: data.paymentOptions[0]?.targetAmount ?? 0,
          targetCurrency: data.targetCurrency,
          formattedEstimatedDelivery: data.paymentOptions[0]?.formattedEstimatedDelivery ?? '',
        };
        setQuotation(quoteObject);
        setConversionRate(quoteObject.rate);
        getFee();
        setIsLoading(false);
      } catch (error: any) {
        props.setError('Error creating quotation. Please try again');
        console.log({ error });

        setQuotation(undefined);
        setIsLoading(false);
      }
    }, 1000);

    if (amount && currency && !amountError) {
      setIsLoading(true);
      debouncedApiCall();
    }

    return debouncedApiCall.cancel;
    // eslint-disable-next-line
  }, [amount, currency]);

  const handleAmountChange = (event: any) => {
    const sanitizedValue = event?.target?.value?.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    console.log(event?.target?.value, sanitizedValue, props?.income);

    props.setError('');
    if (!sanitizedValue || Number(sanitizedValue) === 0) {
      setAmountError(true);
      setAmountErrorMessage('Please enter amount to withdraw');
      setAmount('');
      setQuotation(undefined);
      return;
    }

    // Show error if amount is more than balance
    if (Number(sanitizedValue) > props?.income) {
      setAmountError(true);
      setAmountErrorMessage('Your balance is not sufficient');
      setAmount(event?.target?.value);
      setQuotation(undefined);
      return;
    }

    // Validate regex for amount with 2 decimal places
    const regex = /^\d+(\.\d{1,2})?$/;
    if (!regex?.test(sanitizedValue)) {
      return;
    }

    setAmountError(false);
    setAmountErrorMessage('');
    setAmount(sanitizedValue);
  };

  const handleCurrencyChange = (event: any) => {
    const sanitizedValue = event?.target?.value?.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    console.log({ sanitizedValue });

    props.setError('');
    setCurrency(sanitizedValue);

    // Store in local storage
    localStorage.setItem(currencyLocalStorageKey, sanitizedValue);
  };

  const handleContinue = async () => {
    try {
      setPage(PageType.loading);
      const url = `${backEndUrl}/v1/quotations/new`;
      const token = await auth.currentUser?.getIdToken();
      const targetAmount = (Number(amount) - tranferFee) * conversionRate;
      const response = await axios.post(
        url,
        {
          amount: targetAmount,
          targetCurrency: currency,
          isTargetAmount: true,
          withdrawalAmount: amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { data } = response.data;

      // Prevent proceeding if Wise fee is more than the platform commission
      if ((data.paymentOptions[0]?.fee?.total ?? 0) > tranferFee) {
        props.setError('Cannot proceed with the entered withdrawal amount. Please enter a higher amount.');
        setPage(PageType.createQuotation);
        return;
      }

      props.setQuoteId(data.id);
      props.setTargetCurrency(data.targetCurrency);
      props.setWithdrawAmount(Number(amount));
      props.setStep(1);
    } catch (error: any) {
      props.setError('Error creating quotation. Please try again');
      setPage(PageType.createQuotation);
    }
  };

  const getCalculationRow = (symbol: string, title: string, value: number | string) => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <span style={CalIconStyle}>
            <span style={{ paddingBottom: '2px' }}>{symbol}</span>
          </span>{' '}
          <strong>{isLoading ? <Skeleton width="50px" /> : quotation?.id ? value : ''}</strong>
        </Box>
        <Typography variant="subtitle1">{title}</Typography>
      </Box>
    );
  };

  const getFee = () => {
    setTransferFee(Number(amount) * variableFee + fixedFee);
  };

  return (
    <>
      {page === PageType?.loading && (
        <Box sx={{ height: '450px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress color="secondary" />
        </Box>
      )}
      {page === PageType?.createQuotation && (
        <Box
          sx={{
            p: 3,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Platform & Withdrawal fees{' '}
            {/* <DefaultTooltip
              width={16}
              margin="0 0 0 0px"
              title={
                <Typography
                  variant="body2"
                  whiteSpace="pre-line"
                  dangerouslySetInnerHTML={{ __html: `${t('withdraw.hint')}` }}
                ></Typography>
              }
              url="https://images.rentbabe.com/assets/mui/help.svg"
            /> */}
          </Typography>
          <Input
            hiddenLabel
            value={amount}
            fullWidth
            onChange={handleAmountChange}
            error={amountError}
            helperText={amountErrorMessage}
            margin="dense"
            autoComplete="off"
            placeholder="Credit amount"
            // label="Credit amount"
            // InputProps={{
            //   inputComponent: NumberFormatCustom as any,
            // }}
          />
          <Typography variant="caption" color="text.secondary">
            Bank Account Country
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <Select
              labelId="currency-select-label"
              id="currency-select"
              value={currency}
              onChange={handleCurrencyChange}
              autoComplete="off"
              color="secondary"
            >
              {currecyCountryList.map((item, index) => {
                return (
                  <MenuItem key={index} value={item.currency}>
                    <NextImage
                      loading="lazy"
                      width="20"
                      height="20"
                      src={`https://flagcdn.com/w20/${item.countryCode.toLowerCase()}.png`}
                      alt=""
                      style={{ marginRight: '10px', border: '1px solid #ddd', borderRadius: '50%' }}
                    />{' '}
                    {item.countryName}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <br />
          <Box sx={{ p: 2 }}>
            {getCalculationRow(
              '–',
              'Fee',
              tranferFee.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }) ?? ''
            )}
            {getCalculationRow(
              '=',
              'Amount converted',
              (Number(amount) - tranferFee).toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }) ?? ''
            )}
            {getCalculationRow(
              '×',
              'Rate',
              conversionRate.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: undefined,
              }) ?? ''
            )}
            <Divider />
            {quotation && (
              <Typography mt={1} variant="h5">
                {isLoading ? (
                  <Skeleton width="150px" />
                ) : (
                  `${quotation?.targetCurrency} ${((Number(amount) - tranferFee) * conversionRate).toLocaleString(
                    undefined,
                    { minimumFractionDigits: 0, maximumFractionDigits: 2 }
                  )}`
                )}
              </Typography>
            )}

            {quotation?.formattedEstimatedDelivery && (
              <Typography variant="caption">
                {isLoading ? (
                  <Skeleton width="200px" />
                ) : (
                  <span>
                    Should arrive <strong>{quotation?.formattedEstimatedDelivery}</strong>
                  </span>
                )}
              </Typography>
            )}
          </Box>
          <br />

          <Button
            variant="contained"
            fullWidth={true}
            disabled={isLoading || !amount || !currency || amountError || !quotation?.id}
            onClick={handleContinue}
          >
            {isLoading && !amountError ? <CircularProgress size={24} /> : `Continue`}
          </Button>
        </Box>
      )}
    </>
  );
};

export default Quotation;
