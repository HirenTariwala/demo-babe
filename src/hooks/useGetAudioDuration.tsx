export const useGetAudioDuration = async (audioUrl: string | undefined, callback: (duration: number) => void) => {
  if (!audioUrl) return null;
  try {
    const audio = new Audio();
    audio.src = audioUrl;

    audio.addEventListener('loadedmetadata', function () {
      const duration = audio.duration;
      callback(duration === Infinity ? 0 : duration);
    });
  } catch (error) {
    console.error('Error fetching audio duration:', error);
    return null;
  }
};
