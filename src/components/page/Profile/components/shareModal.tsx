import React, { useEffect, useState } from 'react';
import Box from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import SimpleDialog from '@/components/atoms/modal';
import Typography from '@/components/atoms/typography';
import CopyIcon from '@/components/atoms/icons/copyIcon';
import Input from '@/components/atoms/input';
import Toast from '@/components/molecules/toast';

interface IShareModal {
  shareModalOpen: boolean;
  item: any;
  imgUrl: string | undefined;
  setShareModalOpen: (arg: boolean) => void;
}

const ShareModal = ({ shareModalOpen, item, imgUrl, setShareModalOpen }: IShareModal) => {
  const [text, setText] = useState('');
  const [textCopied, setTextCopied] = React.useState(false);

  const generateFirebaseDynamicLink = async (
    UUID: string,
    username: string | null | undefined,
    profileImage: string | null | undefined,
    bio?: string | undefined
  ): Promise<string> => {
    const apiUrl = 'https://api2.branch.io/v1/url';
    const title = username ? `${username} | RentBabe` : 'RentBabe';
    const profile = `${window.location.origin}/profile/${UUID}`;
    const branchKey = 'key_live_aDcm6W2ZWt8oaV7IgQszBipdCAjykFCF';

    const payLoad: {
      [key: string]: any;
    } = {
      branch_key: branchKey,
      channel: 'profile',
      feature: 'site',
      campaign: 'share_profile',
      data: {
        $desktop_url: profile,
        $ios_url: profile,
        $android_url: profile,
        $og_title: title,
      },
    };

    if (bio) {
      payLoad['data']['$og_description'] = bio;
    }

    if (profileImage) {
      payLoad['data']['$og_image_url'] = profileImage;
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payLoad),
    });
    const result = await response.json();

    const url = result.url;

    return url ?? 'ERROR';
  };

  const copyHandler = () => {
    navigator.clipboard.writeText(text);
    setTextCopied((prev) => !prev);
  };

  useEffect(() => {
    generateFirebaseDynamicLink(item?.uid, item?.nickname, imgUrl, item?.bio).then((res) => setText(res));
  }, [item]);

  return (
    <SimpleDialog
      footer={
        <Button
          variant="outlined"
          sx={{
            p: '12px 20px',
            whiteSpace: 'nowrap',
            height: 48,
          }}
          onClick={() => setShareModalOpen(false)}
        >
          Cancel
        </Button>
      }
      open={shareModalOpen}
      title={
        <Typography variant="h3" fontWeight={500} component="span">
          Share Profile
        </Typography>
      }
      modelWidth={'fit-content'}
    >
      <Box display="flex" flexDirection="column" gap={4}>
        <Typography variant="body1" component="span">
          Please copy this link to share
        </Typography>
        <Box display="flex" alignItems="center" gap={4}>
          <Input sx={{ width: '100%' }} inputProps={{ style: { padding: '12px 20px' } }} disabled value={text} />
          <Button
            variant="contained"
            startIcon={<CopyIcon />}
            sx={{
              p: '12px 20px',
              width: 'auto',
              minWidth: 'fit-content',
              whiteSpace: 'nowrap',
              height: 48,
            }}
            onClick={copyHandler}
          >
            Copy link
          </Button>
          <Toast alertMessage="Text Copied" onClose={() => setTextCopied(false)} open={textCopied} />
        </Box>
      </Box>
    </SimpleDialog>
  );
};

export default ShareModal;
