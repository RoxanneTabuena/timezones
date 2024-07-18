
export const getLocalTime = (zone) => {
  const options = {
  hour12: true,
  timeZone: zone,
  hour: 'numeric',
  minute: 'numeric',
  weekday: 'long'
  };
  /* Could not figure out why js displays times three hours ahead. After much reformatting and troubleshooting,
  I decided on manually subtracting three hours from the time for a temporary fix*/
  const jsTime = new Date()
  const trueTime = jsTime.setHours(jsTime.getHours() - 3)
  return Intl.DateTimeFormat('en-US', options).format(trueTime);
};

export const getTimeDiff = (userZone, homieZone) => {
  const time = (zone) => new Date(new Date().toLocaleString('en-US', { timeZone: zone }));
  const timeDiff = time(userZone) - time(homieZone)
  const timeDiffHours = Math.abs(Math.floor(timeDiff/(1000*60*60)))
  if (timeDiff === 0) return 0;
  
  return timeDiff < 0 
    ? `${timeDiffHours} hours ahead of`
    : `${timeDiffHours} hours behind`;
};

export const getMatchingWeekdays = (userTime, homieTime) => {
  const usertimeArray = String(userTime).split(' ')
  const homietimeArray = String(homieTime).split(' ')
  if(usertimeArray[0] === homietimeArray[0]){
    usertimeArray.shift()
    homietimeArray.shift()
    const user = usertimeArray.join(' ')
    const homie = homietimeArray.join(' ')
    return [user, homie]
  }
  return false
};
