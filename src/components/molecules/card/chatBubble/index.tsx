import Box from '@/components/atoms/box'
import Typography from '@/components/atoms/typography'
import React from 'react'

interface IChatBubble {
    msg: string;
    isMine: boolean;
    lastSeen: string
}

const ChatBubble = ({msg,isMine,lastSeen}: IChatBubble) => {
  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" flexDirection="column" p="10px 12px" borderRadius={3} bgcolor={isMine ?  "#FFD443" : "#F0F0F0"}>
           <Typography variant='body1' component="span">{msg}</Typography>
           <Typography variant='caption' component="span" textAlign="end">{lastSeen}</Typography>
      </Box>
      {isMine && <Typography variant='caption' component="span" textAlign="end">Sent</Typography>}
    </Box>
  )
}

export default ChatBubble