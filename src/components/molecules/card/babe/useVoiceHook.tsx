import { setCurrentAudio, useAudioStore } from '@/store/reducers/audioReducer';
import { useAppDispatch } from '@/store/useReduxHook';
import { useRef, useEffect } from 'react';

interface IVoiceButton {
  voiceUrl: string | undefined;
}


const useVoiceHook = ({voiceUrl}: IVoiceButton) => {
    const dispatch = useAppDispatch();
  const currentAudio = useAudioStore();
  const imgHTML = useRef<HTMLImageElement>(null);
  const current = currentAudio?.currentAudio?.voiceUrl;

  const isAudioPlaying = current === voiceUrl;

  useEffect(() => {
    const audio = document.getElementById('audio') as HTMLAudioElement | undefined;

    if (audio && isPlaying(audio)) {
      if (audio.src === voiceUrl) {
        const img = imgHTML.current;
        if (img) img.src = `https://images.rentbabe.com/assets/buttons/stop_rb.svg`;

        // "https://images.rentbabe.com/assets/gif/musicload.gif"

        audio.onended = function () {
          if (img) img.src = `https://images.rentbabe.com/assets/buttons/play_rb.svg`;
        };
      }
    }
    // eslint-disable-next-line
  }, []);

  function isPlaying(audelem: HTMLAudioElement | undefined) {
    return !audelem?.paused;
  }

  const voiceOnClick = () => {

    if (!voiceUrl) return;

    // onClick?.()

    const img = imgHTML.current;

    // let audio = document.getElementById('audio') as HTMLAudioElement
    const audio = document.getElementById('audio') as HTMLAudioElement;

    const isSame = audio.src === voiceUrl;

    if (isSame && audio && isPlaying(audio)) {
      audio.pause();
      audio.currentTime = 0;
      if (img) img.src = `https://images.rentbabe.com/assets/buttons/play_rb.svg`;
      //setPlaying(false)
      dispatch(setCurrentAudio({ voiceUrl: undefined }));
      return;
    }

    audio.src = voiceUrl;

    if (img) img.src = `https://images.rentbabe.com/assets/buttons/stop_rb.svg`;

    audio.onerror = function () {
      if (img) img.src = `https://images.rentbabe.com/assets/buttons/play_rb.svg`;
      dispatch(setCurrentAudio({ voiceUrl: undefined }));
      //setPlaying(false)
    };

    audio.onended = function () {
      if (img) img.src = `https://images.rentbabe.com/assets/buttons/play_rb.svg`;
      //setPlaying(false)
      dispatch(setCurrentAudio({ voiceUrl: undefined }));
    };

    audio.pause();
    audio.currentTime = 0;

    audio.load(); //call this to just preload the audio without playing
    audio.play(); //call this to play the song right away

    dispatch(setCurrentAudio({ voiceUrl: voiceUrl}));
  };
  return (
   {voiceOnClick,isAudioPlaying}
  )
}

export default useVoiceHook