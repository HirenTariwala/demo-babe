import Box from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import AudioWavesIcon from '@/components/atoms/icons/audioWavesIcon';
import LoadingIcon from '@/components/atoms/icons/loading';
import PlayIcon from '@/components/atoms/icons/playIcon';
import NextImage from '@/components/atoms/image';
import useVoiceHook from '@/components/molecules/card/babe/useVoiceHook';
import { useGetAudioDuration } from '@/hooks/useGetAudioDuration';
import React, { useState } from 'react';

const VoiceButtonComp = ({ voiceUrl }: { voiceUrl: string }) => {
  const [duration, setDuration] = useState<number | null>(null);
  const { voiceOnClick, isAudioPlaying } = useVoiceHook({ voiceUrl: voiceUrl });
  useGetAudioDuration(voiceUrl, (d) => {
    setDuration(Math?.ceil(d) || 0);
  });
  return (
    <Button
      onClick={voiceOnClick}
      sx={{
        display: 'flex',
        width: 'fit-content',
        height: '36px',
        padding: '6px 12px 6px 8px',
        justifyContent: 'center',
        alignItems: 'baseline',
        gap: '8px',
        borderRadius: '360px',
        background: '#FFF',
        boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.10)',
        left: '-7px',
        bottom: '10px',
        ':hover': {
          background: '#FFF',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: '8px',
        }}
      >
        <Box
          sx={{
            width: '24px',
            height: '24px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#FFD443',
            borderRadius: '100px',
          }}
        >
          <PlayIcon />
        </Box>
        <Box
          sx={{
            width: '24px',
            height: '24px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {!isAudioPlaying ? (
            <AudioWavesIcon />
          ) : (
            <NextImage src="https://images.rentbabe.com/assets/gif/wave2.gif" width={20} height={20} alt="" />
          )}
        </Box>
        <Box>{duration === null ? <LoadingIcon size={15} /> : `${duration}s`}</Box>
      </Box>
    </Button>
  );
};

export default VoiceButtonComp;
