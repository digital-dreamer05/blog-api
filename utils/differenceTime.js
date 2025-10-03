exports.calculateRelativeTimeDifference = (createdAt) => {
  if (!createdAt) return { relative: 'Unknown', fullDate: 'Unknown' };

  const createdAtTime = new Date(createdAt);
  if (isNaN(createdAtTime))
    return { relative: 'Invalid Date', fullDate: 'Invalid Date' };

  const currentTime = new Date();
  const timeDifference = Math.abs(currentTime - createdAtTime);
  const seconds = Math.floor(timeDifference / 1000);
  const days = Math.floor(seconds / 86400);

  let relative;
  if (seconds < 60) {
    relative = 'Right now';
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    relative = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    relative = `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    relative = `${days} day${days > 1 ? 's' : ''} ago`;
  }

  const fullDate = createdAtTime.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return { relative, fullDate, days };
};
