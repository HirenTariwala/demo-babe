'use client';
import { setCurrentAudio } from '@/store/reducers/audioReducer';
import { useAppDispatch } from '@/store/useReduxHook';
import React from 'react';

const Audio = () => {
  const dispatch = useAppDispatch();
  return (
    <audio
      id="audio"
      className="auto-audio"
      autoPlay
      loop={false}
      onPause={() => {
        dispatch(setCurrentAudio({ voiceUrl: undefined }));
      }}
      onEnded={() => {
        dispatch(setCurrentAudio({ voiceUrl: undefined }));
      }}
    >
      <source type="audio/ogg" />
      <source type="audio/mpeg" />
      <source type="audio/webm" />
      <source type="audio/mp3" />
      <source type="audio/wav" />
    </audio>
  );
};

export default Audio;
