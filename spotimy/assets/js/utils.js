const formatTime = (time) => (time < 10 ? `0${time}` : time);

export const toMinAndSec = (duration) => {
  const minutes = formatTime(Math.floor(duration / 60));
  const seconds = formatTime(Math.floor(duration - minutes * 60));

  return `${minutes}:${seconds}`;
};

export const shuffle = (array) => array.sort(() => 0.5 - Math.random());
