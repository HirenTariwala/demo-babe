import React, { useState } from 'react';
import {
  Dialog,
  DialogProps,
  DialogContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  styled,
  Divider,
  Alert,
  Typography,
} from '@mui/material';

import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';

// import { useWindowSize } from '../../../hooks/useWindowSize';
// import { Quotation } from '../../Coin/Wallet/WiseWithdraw/Quotation';
// import { Recipient } from '../../Coin/Wallet/WiseWithdraw/Recipient';
// import { Transfer } from '../../Coin/Wallet/WiseWithdraw/Transfer';
// import CheckCircleOutlineIcon from '../../../icons/materialUiSvg/checkcircle';
import SuccessIcon from '@/components/atoms/icons/successIcon';
import Quotation from './WiseWithdraw/Quotation';
import { Recipient } from './WiseWithdraw/Recipient';
import { Transfer } from './WiseWithdraw/Transfer';

interface Props extends DialogProps {
  income: number;
  onClose: () => void;
}

const steps = ['Amount', 'Recipient', 'Review'];

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(({ theme, ownerState }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: '#784af4',
  }),
  '& .QontoStepIcon-completedIcon': {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18,
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

const QontoStepIcon = (props: StepIconProps) => {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <div className="QontoStepIcon-completedIcon">
          <SuccessIcon />
        </div>
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
};

const VerifiedModal = ({ income, onClose, ...props }: Props) => {
  // const [size] = useWindowSize();
  // const widthLimit = 420;

  const [step, setStep] = useState<number>(0);
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [recipientId, setRecipientId] = useState<number | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState<number | null>(null);
  const [targetCurrency, setTargetCurrency] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const onCloseHandle = () => {
    setStep(0);
    setQuoteId(null);
    setRecipientId(null);
    setTargetCurrency(null);
    setError('');
    onClose();
  };

  const onStepClick = (clickedStep: number) => {
    if (clickedStep < step && step !== 3) {
      setStep(clickedStep);
    }
  };

  return (
    <Dialog
      sx={{
        '.MuiPaper-root': {
          borderRadius: '24px',
        },
        '.MuiDialogContent-root': {
          padding: '24px',
        },
        '.MuiDialogActions-root': {
          padding: '24px',
        },
      }}
      fullWidth
      onClose={()=> onClose()}
      {...props}
    >
      {/* <Button
        onClick={onCloseHandle}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path d="M18.75 5.25l-13.5 13.5M18.75 18.75L5.25 5.25" />
        </svg>
      </Button> */}
      <Box sx={{ width: '100%', mt: 4, mb: 3 }}>
        <Stepper activeStep={step} alternativeLabel connector={<QontoConnector />}>
          {steps?.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={QontoStepIcon}
                onClick={() => {
                  console.log('Hello i am click');
                  onStepClick(index);
                }}
                sx={{
                  cursor: 'pointer',
                }}
                // sx={index < step ? { cursor: 'pointer' } : {}}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Divider />
      {error && <Alert severity="error">{error}</Alert>}
      <DialogContent>
        {step === 0 && (
          <Quotation
            income={income}
            setStep={setStep}
            setQuoteId={setQuoteId}
            setWithdrawAmount={setWithdrawAmount}
            setTargetCurrency={setTargetCurrency}
            setError={setError}
          />
        )}
        {step === 1 && (
          <Recipient
            quoteId={quoteId}
            targetCurrency={targetCurrency}
            setStep={setStep}
            setError={setError}
            setRecipientId={setRecipientId}
          />
        )}
        {step === 2 && (
          <Transfer
            quoteId={quoteId}
            recipientId={recipientId}
            withdrawAmount={withdrawAmount}
            setStep={setStep}
            setError={setError}
          />
        )}
        {step === 3 && (
          <Box
            sx={{
              height: '450px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 4,
            }}
          >
            <Typography variant="h6" fontWeight={700} textAlign="center">
              All done!
            </Typography>
            {/* <CheckCircleOutline sx={{ fontSize: 60, color: '#4caf50', my: 3 }} /> */}
            {/* <CheckCircleOutlineIcon /> */}
            <SuccessIcon />
            <Typography variant="body1" textAlign="center">
              Your withdrawal is being processed.
            </Typography>
            <Button variant="contained" color="success" fullWidth sx={{ mt: 4 }} onClick={onCloseHandle}>
              Close
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VerifiedModal;
// import Box from '@/components/atoms/box';
// import Button from '@/components/atoms/button';
// import Chip from '@/components/atoms/chip';
// import NextImage from '@/components/atoms/image';
// import Input from '@/components/atoms/input';
// import ToolTip from '@/components/atoms/tooltip';
// import Typography from '@/components/atoms/typography';
// import Dialog from '@/components/molecules/dialogs';
// import { db, functions } from '@/credentials/firebase';
// import { useDocumentQuery } from '@/hooks/useDocumentQuery';
// import {
//   PAGE,
//   PHONE,
//   USERS,
//   currencyKey,
//   // dateOfBirthKey,
//   emailKey,
//   legalNameKey,
//   nameKey,
//   paynowKey,
// } from '@/keys/firestoreKeys';
// import { moveIncomeToCashFunction } from '@/keys/functionNames';
// import { setCurrentUser, useUserStore } from '@/store/reducers/usersReducer';
// import { useAppDispatch } from '@/store/useReduxHook';
// import { DateHelper } from '@/utility/dateHelper';
// import {
//   CircularProgress,
//   DialogProps,
//   Divider,
//   FormControl,
//   FormControlLabel,
//   LinearProgress,
//   Radio,
//   RadioGroup,
//   TextField,
//   Tooltip,
// } from '@mui/material';
// import { collection, doc, getDocs, limit, query, updateDoc, where } from 'firebase/firestore';
// import { httpsCallable } from 'firebase/functions';
// import React, { ChangeEvent, useEffect, useState } from 'react';

// interface IVerifiedModal extends DialogProps {
//   income: number;
//   penalty: number;
//   onClose: () => void;
// }
// enum WithdrawByEnum {
//   paynow = 0,
//   transferwise = 1,
// }

// const Censor = (value: string | null | undefined) => {
//   if (!value) return '';

//   const length = value.length / 2;
//   return `${value.slice(0, -length)}****`;
// };
// const VerifiedModal = ({ income, penalty, onClose, ...props }: IVerifiedModal) => {
//   const withdrawMinLimit: {
//     [currency: string]: number;
//   } = {
//     SGD: 5,
//     PHP: 20,
//     MYR: 10,
//     COP: 30,
//     KRW: 5,
//   };

//   const dispatch = useAppDispatch();
//   const { currentUser } = useUserStore();

//   const [uid, nickname, myEmail, clubName, dateOfBirth, userCurrency, legalName] = [
//     currentUser?.uid,
//     currentUser?.nickname || currentUser?.nick || '',
//     currentUser?.email,
//     currentUser?.club,
//     currentUser?.dateOfBirth,
//     currentUser?.currency,
//     currentUser?.legalName,
//   ];

//   const [isLoading, setLoading] = useState<boolean>(false);

//   // const [open, setOpen] = useState<boolean>(false);
//   const [check, setCheck] = useState<WithdrawByEnum | undefined>();
//   const [price, setPrice] = useState<number>(0);

//   // const [dob, setDOB] = useState<Date | undefined>(
//   //   dateOfBirth ? new Date(Number.parseInt(dateOfBirth, 10)) : undefined
//   // );
//   const [myLegalName, setMyLegalName] = useState<string | null | undefined>(legalName || undefined);
//   // const [openSB, setSnackbar] = useState<boolean>(false);
//   const [msg, setMsg] = useState<string>();
//   console.log('msg ===>', msg, dateOfBirth);

//   const [currencyState, setCurrency] = useState<string | null | undefined>(userCurrency);

//   const { loading, data } = useDocumentQuery(`${uid || ''}-phone`, doc(db, PHONE, `${uid || ''}`));

//   const withdrawDefaultLimit = check === WithdrawByEnum.paynow ? 5 : 20;
//   // const widthLimit = 420;

//   const withdrawLimitState = withdrawMinLimit[currencyState ?? ''] ?? withdrawDefaultLimit;
//   const cannotServePenalty = price < penalty || price - penalty < withdrawLimitState;

//   useEffect(() => {
//     if (data?.exists()) {
//       const myPayNow = data.get(paynowKey) as string | undefined;
//       if (myPayNow) {
//         dispatch(setCurrentUser({ paynow: myPayNow }));
//       } else {
//         dispatch(setCurrentUser({ paynow: undefined }));
//       }
//     }
//   }, [data]);

//   const onCloseHandle = () => {
//     setPrice(0);
//     setCheck(WithdrawByEnum.paynow);
//     setCurrency('');
//     onClose();
//   };

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { value } = event.target;
//     setPrice(Number.parseFloat(value ?? '0'));
//   };

//   const roundedTwoDecimal = (value: number) => {
//     return Math.round((value + Number.EPSILON) * 100) / 100;
//   };

//   const openSnackbar = (message: string) => {
//     setMsg(message);
//     // setSnackbar(true);
//   };

//   const fees = (value: number | undefined) => {
//     if (!value) return '';

//     const final = value * 0.25 + 0.29;
//     const thisValue = roundedTwoDecimal(final);
//     if (penalty) {
//       return `Withdraw fees: SGD ${thisValue} + ${penalty.toFixed(2)} (Penalty).`;
//     }
//     return `Withdraw fees: SGD ${thisValue}.`;
//   };

//   const withdraw = async () => {
//     if (check === undefined) {
//       setMsg('Choose PayNow or Wise');
//       // setSnackbar(true);
//       return;
//     }

//     if (!price || check === undefined) {
//       return;
//     }

//     if (check === WithdrawByEnum?.transferwise) {
//       if (!currencyState) {
//         setMsg('Country is required');
//         // setSnackbar(true);
//         return;
//       }

//       if (currencyState === 'SGD') {
//         setMsg('Singapore is unavailable, please use PayNow instead');
//         // setSnackbar(true);
//         return;
//       }

//       if (!myLegalName) {
//         setMsg('Full name is required');
//         // setSnackbar(true);
//         return;
//       }

//       // if (!dob) {
//       //   setMsg('Date of birth is required');
//       //   setSnackbar(true);
//       //   return;
//       // }

//       if (!uid) {
//         setMsg('Please login');
//         // setSnackbar(true);
//         return;
//       }
//     }

//     const withdrawCurrency = currencyState ?? 'SGD';

//     const thisValue = roundedTwoDecimal(price);
//     const withdrawMinLimitValue = withdrawMinLimit[withdrawCurrency] ?? 5;

//     if (thisValue > 500 || thisValue < withdrawMinLimitValue) {
//       const message = `Max. 500.00 | Min. ${withdrawMinLimit[currencyState ?? ''] ?? withdrawDefaultLimit}.00`;
//       setMsg(message);
//       // setSnackbar(true);
//       return;
//     }

//     setLoading(true);
//     const moveIncomeToCash = httpsCallable(functions, moveIncomeToCashFunction);

//     try {
//       const map: { [key: string]: any } = {
//         nickname,
//         amount: thisValue,
//         payBy: check,
//         email: myEmail,
//       };

//       map.currency = currencyState || 'SGD';

//       if (clubName) {
//         const snapshot = await getDocs(query(collection(db, PAGE), where(nameKey, '==', clubName), limit(1)));
//         if (snapshot?.docs?.length > 0) {
//           const document = snapshot?.docs[0];
//           if (document?.exists()) {
//             const clubEmail = document?.get(emailKey) as string;
//             const clubCurrency = document?.get(currencyKey) as string;
//             const clubPayNow = document?.get(paynowKey) as string;
//             const clubMap: {
//               [key: string]: any;
//             } = {
//               name: clubName,
//               crry: clubCurrency,
//               email: '',
//               paynow: '',
//             };

//             if (clubEmail && clubCurrency !== 'SGD') {
//               clubMap[emailKey] = clubEmail;
//             } else if (clubPayNow && clubCurrency === 'SGD') {
//               clubMap[paynowKey] = clubPayNow;
//             }
//             map.club = clubMap;
//           }
//         }
//       }

//       // add update doc
//       const promises: Promise<any>[] = [];
//       if (check === WithdrawByEnum?.transferwise && uid) {
//         const userMap: { [key: string]: any } = {};
//         if (myLegalName && !legalName) {
//           userMap[legalNameKey] = myLegalName;
//         }

//         // if (dob && !dateOfBirth) {
//         //   userMap[dateOfBirthKey] = Timestamp?.fromDate(dob);
//         // }

//         if (currencyState && userCurrency !== currencyState) {
//           userMap[currencyKey] = currencyState;
//         }

//         if (Object?.keys(userMap)?.length > 0) {
//           const update = updateDoc(doc(db, USERS, uid), userMap);
//           promises?.push(update);
//         }
//       }

//       if (check === WithdrawByEnum.transferwise) {
//         if (myLegalName) {
//           map.legalName = myLegalName;
//         }
//         // if (dob) {
//         //   map.dob = `${dob?.getTime()}`;
//         // }
//       }

//       const cashData = moveIncomeToCash(map);
//       promises?.push(cashData);

//       Promise?.all(promises)
//         .then(() => {
//           openSnackbar('Success');
//           onClose();
//           setPrice(0);

//           return false;
//         })
//         .catch(() => {
//           openSnackbar('Unexpected error');
//         });
//     } catch {
//       openSnackbar('Unexpected error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onChangeTextHandle = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const v = e.currentTarget.value;
//     setMyLegalName(v);
//   };

//   const footer = (
//     <>
//       <Button disabled={isLoading} color="warning" onClick={onCloseHandle}>
//         Cancel
//       </Button>
//       <Button
//         endIcon={isLoading && <CircularProgress size={12} color="warning" />}
//         disabled={isLoading ? true : price > income || cannotServePenalty || !price}
//         color="warning"
//         onClick={withdraw}
//       >
//         Withdraw
//       </Button>
//     </>
//   );

//   return (
//     <>
//       <Dialog
//         sx={{
//           '.MuiPaper-root': {
//             borderRadius: '24px',
//           },
//           '.MuiDialogContent-root': {
//             padding: '24px',
//           },
//           '.MuiDialogActions-root': {
//             padding: '24px',
//           },
//         }}
//         footer={footer}
//         {...props}
//       >
//         {isLoading && <LinearProgress color="warning" />}

//         <Typography variant="h3" fontWeight={500} color="#1A1A1A" component={'span'}>
//           Withdraw
//         </Typography>
//         <Box
//           sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             gap: '8px',
//           }}
//         >
//           <Typography variant="body2" color="#767676">
//             According to Terms of Service, RentBabe platform will charge 25% of the withdraw amount as commission fee.
//           </Typography>
//           <Typography variant="body2" color="#646464">
//             You will also pay a withdraw fee for <strong>S$0.29/time</strong>. You can withdraw up to{' '}
//             <strong>500 Credit</strong> at one time.{' '}
//             <strong>Withdrawals will normally arrive within/after 24 hours.</strong>
//           </Typography>
//         </Box>

//         <br />

//         <Input
//           fullWidth
//           disabled={!income}
//           onClick={() => {
//             if (!income) {
//               setMsg('Your Credit Income is empty');
//               // setSnackbar(true);
//             }
//           }}
//           error={!income}
//           helperText={
//             income ? (
//               price ? (
//                 ''
//               ) : (
//                 <Typography color="error" fontSize="inherit" variant="inherit">
//                   *Please enter a withdraw amount
//                 </Typography>
//               )
//             ) : (
//               <Typography fontSize="inherit" variant="inherit">
//                 Your credit income is empty&nbsp;
//                 <ToolTip title="“Credit income” refers to the income you have generated through providing services and collecting tips. Income can be withdrawn.">
//                   <NextImage width={12} height={12} src="https://images.rentbabe.com/assets/question.svg" alt="" />
//                 </ToolTip>
//               </Typography>
//             )
//           }
//           margin="dense"
//           variant="standard"
//           color="warning"
//           placeholder="Withdraw amount"
//           autoComplete="off"
//           onChange={handleChange}
//         />

//         <br />

//         {price && (price > income || cannotServePenalty) ? (
//           <Typography color="error.main" fontSize={12} variant="caption">
//             {price && cannotServePenalty
//               ? `Min. ${penalty + withdrawLimitState} Income Credits ${penalty > 0 ? 'due to penalty' : ''}`
//               : 'Insufficient income'}
//           </Typography>
//         ) : (
//           <>
//             {!(price > 0 && (price > 500 || price < withdrawLimitState)) && (
//               <Typography color="error.main" fontSize={12} variant="caption">
//                 {fees(price)}
//               </Typography>
//             )}

//             {price && !(price > 0 && (price > 500 || price < withdrawLimitState)) ? (
//               <>
//                 <br />
//                 <Typography color="error.main" fontSize={12} variant="caption">
//                   {`Estimated bank transfer: ${DateHelper.getEstimatedBankTransferDate(new Date())}.`}
//                 </Typography>
//               </>
//             ) : undefined}

//             {check !== undefined &&
//               price > 0 &&
//               (price > 500 || price < (withdrawMinLimit[currencyState ?? ''] ?? 5)) && (
//                 <Typography color="error.main" fontSize={12} variant="caption">
//                   Max. 500.00 | Min.
//                   {withdrawMinLimit[currencyState ?? ''] ?? withdrawDefaultLimit}
//                   .00
//                 </Typography>
//               )}
//           </>
//         )}

//         <br />
//         <FormControl>
//           <RadioGroup onChange={(_, value) => setCheck(Number.parseInt(value, 10))}>
//             <Typography color="text.secondary" variant="caption">
//               Singapore Bank Account (DBS, OCBC, UOB, etc.)
//             </Typography>
//             <FormControlLabel
//               value={WithdrawByEnum.paynow}
//               disabled={!(loading || data?.get(paynowKey))}
//               control={
//                 <Radio color="warning" icon={loading ? <CircularProgress size={12} color="warning" /> : undefined} />
//               }
//               label={
//                 <Box display="flex">
//                   <Typography variant="body2">
//                     PayNow <b>{Censor(data?.get(paynowKey) as string)}</b>
//                   </Typography>
//                   <Box margin={`0 4px`} />;
//                   <Chip
//                     // onClick={() => setOpen(true)}
//                     disabled={loading}
//                     color="warning"
//                     size="small"
//                     style={{ boxShadow: ' 1px 2px 5px #666' }}
//                     label={data?.get(paynowKey) ? 'Disconnect' : 'Connect'}
//                   />
//                 </Box>
//               }
//             />
//             <Typography color="text.secondary" variant="caption">
//               Bank Account
//               <b>outside</b> of Singapore (TnG, BCA, GCash, etc)
//             </Typography>
//             <FormControlLabel
//               disabled={!myEmail}
//               value={WithdrawByEnum.transferwise}
//               control={<Radio color="warning" />}
//               label={
//                 <Box>
//                   <Box display="flex" alignItems="center">
//                     <img height={12} src="https://images.rentbabe.com/assets/logo/wise.svg" alt="" />
//                     <Box margin={`0 4px`} />;{/* <Google size="small" /> */}
//                     GOOGLE-BUTTON
//                     <Box margin={`0 4px`} />;
//                   </Box>
//                 </Box>
//               }
//             />
//           </RadioGroup>
//         </FormControl>

//         <br />

//         {check === WithdrawByEnum.transferwise && (
//           <Box marginTop={2}>
//             <Divider />
//             <Typography marginTop={1}>
//               Bank Account Details
//               <Tooltip
//                 arrow
//                 title="Please enter your real legal name and date of birth to prevent any Bank Transfer delay."
//                 enterTouchDelay={0}
//                 leaveTouchDelay={5000}
//               >
//                 <NextImage
//                   style={{
//                     cursor: 'pointer',
//                     margin: `${'0px' || ''}`,
//                     WebkitTapHighlightColor: 'transparent',
//                   }}
//                   width={24}
//                   height={24}
//                   src={'https://images.rentbabe.com/assets/question.svg'}
//                   alt=""
//                 />
//               </Tooltip>
//             </Typography>

//             <br />

//             <Box display="flex" marginTop={1}>
//               <TextField
//                 fullWidth
//                 size="small"
//                 autoComplete="none"
//                 color="secondary"
//                 label="Full Legal Name"
//                 required
//                 value={myLegalName}
//                 error={!myLegalName}
//                 onChange={onChangeTextHandle}
//               />

//               <Box margin="0px 5px " />

//               {/* <DateOfBirth
//                 DOB={dob ? Timestamp.fromDate(new Date(dob)) : undefined}
//                 onChange={(date) => {
//                   setDOB(date);
//                 }}
//               /> */}
//             </Box>

//             <br />

//             {/* <CurrencySelect
//               title="Country"
//               currency={currencyState}
//               required={!currencyState}
//               onChange={(value) => {
//                 setCurrency(value.currencyCode);
//               }}
//             /> */}
//           </Box>
//         )}
//       </Dialog>

//       {/* {!loading && (
//         <BindPhoneDialog
//           paynowNumber={data?.get(paynowKey) as string}
//           limit={data?.get('count') as Timestamp[]}
//           hasBind={!!data?.get(paynowKey)}
//           open={open}
//           onClose={() => setOpen(false)}
//         />
//       )} */}

//       {/* <CenterSnackBar open={openSB} autoHideDuration={2000} onClose={() => setSnackbar(false)} message={msg} /> */}
//     </>
//   );
// };

// export default VerifiedModal;
