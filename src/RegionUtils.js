export const getRegionDiff = (userRegion, homieRegion) => {
  const area = (location) => {return location.split(', ')[1]}
  const region = (location) => {return location.split(',')[0]}
  return userRegion === homieRegion ? 
  `You and your loved one are both located in ${region(userRegion)}. How fortunate! Why not plan a visit?` :
  area(userRegion) === area(homieRegion) ? [region(userRegion), region(homieRegion)]:
  true
}

export const getShortRegion = (region) => {
  return region.split(', ')[0]
}