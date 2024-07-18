const accessToken = 'pk.eyJ1IjoiZmxhbWJvIiwiYSI6ImNseWhkbHdtdTAzZ2wya29tOHppb253dHUifQ.uFJZkQdteBAxPRBIs8Uzbw';
export const getTimezone = async(point) => {
  // create variables that will hold the
  // user's latitude and longitude data
  const longitude = point.geometry.coordinates[0]
  const latitude = point.geometry.coordinates[1]
  // use the Mapbox Tilequery API to query the timezone tileset
  try {
    const query = await fetch(
      `https://api.mapbox.com/v4/examples.4ze9z6tv/tilequery/${longitude},${latitude}.json?access_token=${accessToken}`,
      { method: 'GET' }
    );
    const data = await query.json();
    // grab the timezone from the resulting JSON
    const timezone = data.features[0].properties.TZID;
    // on success, display the user's timezone
    return timezone;
  } catch (e) {
  // display an error message if anything goes wrong
  alert('Error: Dropping points in the ocean breaks the logic for this app. Please refresh page to try again.')
  }
}

export const getRegion = async(point) => {
  // create variables that will hold the
  // user's latitude and longitude data
  const longitude = point.geometry.coordinates[0]
  const latitude = point.geometry.coordinates[1]
  const type = 'region'
  // use the Mapbox Tilequery API to query the timezone tileset
  try {
    const query = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?types=${type}&access_token=${accessToken}`,
      { method: 'GET' }
    );
    const data = await query.json();
    // grab the timezone from the resulting JSON
    const region = data.features[0].place_name;
    // on success, display the user's timezone
    return region;
  } catch (e) {
// display an error message if anything goes wrong
  alert('Error: The relationship between mapbox and the develepor of this app is currently strained. We all have our ups and downs. Please Try again later')
  }
}
