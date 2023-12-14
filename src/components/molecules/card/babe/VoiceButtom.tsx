import VoiceIcon from '@/components/atoms/icons/voiceIcon';
import { IconButton } from '@mui/material';
import useVoiceHook from './useVoiceHook';

interface IVoiceButton {
  voiceUrl: string | undefined;
}

const VoiceButtom = ({ voiceUrl, ...props }: IVoiceButton) => {
  const {voiceOnClick, isAudioPlaying} = useVoiceHook({voiceUrl})
 
  return (
    <IconButton
      onClick={voiceOnClick}
      sx={{
        background: '#FFD443',
        zIndex: 10,
        border: '2px solid #FFF',
        ':hover': { background: '#FFD443' },
      }}
      {...props}
    >
      <VoiceIcon playing={isAudioPlaying} />
    </IconButton>
  );
};

export default VoiceButtom;
