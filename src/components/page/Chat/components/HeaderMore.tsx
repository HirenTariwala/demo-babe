import Box from '@/components/atoms/box';
import NextImage from '@/components/atoms/image';
import Menu from '@/components/atoms/popup/menu';
import { useUserStore } from '@/store/reducers/usersReducer';
import React, { useState } from 'react';
import UnVerifiedModal from '../../Wallet/components/Withdrawn/UnVerifiedModal';
import Toast from '@/components/molecules/toast';
import MenuItem from '@/components/atoms/popup';
import Typography from '@/components/atoms/typography';
import LoadingIcon from '@/components/atoms/icons/loading';

interface IHeaderMore {
  senderUUID: string | undefined;
  myBlock: boolean;
  hasOrder: boolean;
  reportClick?: () => void;
  deleteClick?: () => void;
  blockClick?: () => void;
  openProfile?: () => void;
  onLockChat: () => void;
  lockUnlockChatLoading: boolean;
}

const HeaderMore = ({
  senderUUID,
  myBlock,
  hasOrder,
  reportClick,
  deleteClick,
  blockClick,
  openProfile,
  onLockChat,
  lockUnlockChatLoading,
}: IHeaderMore) => {
  const { currentUser } = useUserStore();

  const [isAdmin, uid, verified, rejectedReasonAfter] = [
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    currentUser?.isAdmin || currentUser?.a,
    currentUser?.uid,
    currentUser?.verified,
    currentUser?.rejectedReasonAfter,
  ];

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>();
  const open = Boolean(anchorEl);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [openReport, setReport] = useState<boolean>(false);
  const [isOpen, setOpen] = useState<boolean>(false);

  const [openToast, setOpenToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const onCloseToast = () => {
    setOpenToast(false);
  };
  const onOpenToastWithMsg = (msg: string) => {
    setToastMsg(msg);
    setOpenToast(true);
  };

  //   const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
  //     setAnchorEl(event.currentTarget);
  //   };

  const onHandleReport = () => {
    reportClick?.();

    setReport(true);

    handleClose();
  };

  const onHandleBlock = () => {
    blockClick?.();
    handleClose();
  };

  const onDeleteConvo = () => {
    deleteClick?.();
    handleClose();
  };

  const onCloseDalog = () => {
    setOpen(false);
  };

  const onOpenProfile = () => {
    openProfile?.();

    handleClose();
  };

  //   const onReportDialogClose = () => {
  //     setReport(false);
  //   };

  const handleClose = () => {
    if (lockUnlockChatLoading) {
      return;
    }

    setAnchorEl(null);
  };

  return (
    <>
      <Toast alertMessage={toastMsg} onClose={onCloseToast} open={openToast} />
      <Box>
        <Menu
          anchorEl={anchorEl}
          open={open}
          setAnchorEl={setAnchorEl}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          onClose={handleClose}
          icon={
            <NextImage
              className="pointer"
              src="https://images.rentbabe.com/assets/mui/more_vert_black_24dp.svg"
              width={24}
              height={24}
              alt=""
            />
          }
        >
          <>
            <MyMenuItem name={'Services'} onClick={() => onOpenProfile()} />

            {isAdmin && senderUUID !== uid && (
              <MyMenuItem
                isLoading={lockUnlockChatLoading}
                name={`${hasOrder ? 'Lock' : 'Unlock'} chat`}
                onClick={() => {
                  onLockChat();
                }}
              />
            )}

            <MyMenuItem name={'Archive'} onClick={() => onDeleteConvo()} />

            <MyMenuItem name={'Report'} onClick={() => onHandleReport()} color="error" />
            <MyMenuItem name={myBlock ? 'Unblock' : 'Block'} onClick={() => onHandleBlock()} color="error" />
          </>
        </Menu>
      </Box>

      {/* <ReportDialog
        chatRoomId={chatRoomID}
        open={openReport}
        onClose={() => onReportDialogClose()}
        reportBy={reportData?.reportBy}
        user={reportData?.user}
      /> */}

      <UnVerifiedModal
        open={isOpen}
        onClose={() => onCloseDalog()}
        myUID={uid}
        verified={verified}
        rejectedReasonAfter={rejectedReasonAfter}
        onOpenToastWithMsg={onOpenToastWithMsg}
      />
    </>
  );
};

const MyMenuItem = ({
  isLoading,
  name,
  onClick,
  color = 'inherit',
}: {
  isLoading?: boolean;
  name: string;
  onClick: () => void;
  color?: string;
}) => {
  return (
    <MenuItem sx={{ justifyContent: 'left', minWidth: 80 }} onClick={onClick}>
      <Typography color={color} display="flex" alignItems="center" gap="8px">
        {isLoading && <LoadingIcon size={16} />}
        {name}
      </Typography>
    </MenuItem>
  );
};

export default HeaderMore;
