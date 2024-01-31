import Box from '@/components/atoms/box';
import Typography from '@/components/atoms/typography';
import { StringHelper } from '@/utility/stringHelper';
import React from 'react';

interface IChatBubble {
  msg: string;
  isMine: boolean;
  lastSeen: string;
}

const ChatBubble = ({ msg, isMine, lastSeen }: IChatBubble) => {
  return (
    <Box
      sx={{
        transform: 'scaleY(-1)',
        display: 'flex',
        justifyContent: isMine ? `flex-end` : `flex-start`,
      }}
    >
      <Box display="flex" flexDirection="column" maxWidth="80%">
        <Box
          display="flex"
          flexDirection="column"
          p="10px 12px"
          borderRadius={3}
          bgcolor={isMine ? '#FFD443' : '#F0F0F0'}
        >
          <Typography
            sx={{
              wordBreak: 'break-word',
            }}
            variant="body1"
            component="span"
            dangerouslySetInnerHTML={{ __html: StringHelper?.bubbleMessage(msg) }}
          />

          <Typography variant="caption" component="span" textAlign="end">
            {lastSeen}
          </Typography>
        </Box>
        {isMine && (
          <Typography variant="caption" component="span" textAlign="end">
            Sent
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ChatBubble;
