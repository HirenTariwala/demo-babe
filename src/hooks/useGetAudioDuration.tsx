export const useGetAudioDuration = async (audioUrl: string | undefined, callback: (duration: number) => void) => {
  if (!audioUrl) return null;
  try {
    const audio = new Audio();
    audio.src = audioUrl;

    audio.addEventListener('loadedmetadata', function () {
      let urlDuration = 0;
      audio.currentTime = Number.MAX_SAFE_INTEGER;
      audio.ontimeupdate = () => {
        audio.ontimeupdate = null;
        urlDuration = audio.duration;
        callback(urlDuration);

        audio.currentTime = 0;
      };

      // callback(urlDuration);
      // const duration = audio?.duration;
      // console.log('duration', duration, audioUrl);

      // let urlDuration = 0;
      // if (duration === Infinity) {
      //   if (audioUrl?.includes('duration=')) {
      //     urlDuration = parseInt(audioUrl?.split('duration=')[1]);
      //   } else if (duration === Infinity) {
      //     audio.currentTime = Number.MAX_SAFE_INTEGER;
      //     audio.ontimeupdate = () => {
      //       audio.ontimeupdate = null;
      //       urlDuration = audio.duration;
      //       // callback(urlDuration);
      //       console.log('duration ==>', audio.duration);
      //       // resolve(audio.duration);
      //       audio.currentTime = 0;
      //     };
      //   }
      // }
      // callback(duration === Infinity ? urlDuration : duration || 0);
    });
  } catch (error) {
    console.error('Error fetching audio duration:', error);
    return null;
  }
};
