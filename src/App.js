import React, { useState, useCallback } from 'react';
import './App.css';
import { Map } from './Map';
import { getTimezone, getRegion } from './GeoUtils';
import { getLocalTime, getTimeDiff, getMatchingWeekdays } from './TimeUtils';
import { getRegionDiff, getShortRegion } from './RegionUtils';
import { type } from '@testing-library/user-event/dist/type';

function App() {
  const [user, setUser] = useState(null);
  const [homie, setHomie] = useState(null);
  const [geoFeatures, setGeoFeatures] = useState([]);

  const populatePerson = async (newPoint) => {
    const timezone= await getTimezone(newPoint)
    return {
      geo_point: newPoint,
      timezone,
      localtime: getLocalTime(timezone),
      region: await getRegion(newPoint)
    }
  }
  const setPerson = async (newPoint) =>{
    const newPerson = await populatePerson(newPoint);
    if (!user){
      setUser(newPerson)
    } else if (!homie){
      setHomie(newPerson)
    }
  }
  // Handle map click events
  const handleMapClick =  useCallback(async (e, map) => {
    // features checks for previously saved points and temporarily stores them for later access
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['points']
    });
    // if statement checks if the points location has been previously saved
    if (features.length) {
      const id = features[0].properties.id;
      // if the point exist in our dataset the event is treated as a removal request
      setGeoFeatures((geoFeatures)=>
        geoFeatures.filter((point)=>
          point.properties.id !== id)
        );
      if(user && user.geo_point.properties.id === id) {
        setUser(null)
      } else {
        setHomie(null)
      }
    // if the point does not exist it is added to our dataset
    } else if (!homie || !user) {
      const newPoint = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [e.lngLat.lng, e.lngLat.lat]
        },
        properties: {
          id: String(new Date().getTime())
        }
      };
      // add new point to geoFeatures (should cause map to auto update)
      setGeoFeatures((geoFeatures)=>[...geoFeatures, newPoint ]);
      // populate user and homie objects with geo info based on selected points
      await setPerson(newPoint);
    }
  }, [setPerson]);

  const getTextDisplay = (user, homie) => {
    if (!user) {
      return [
        "This map can fetch the local times, and calculate the time differences of two people anywhere in the world. Select your location on the map to get started...",
        "Timezones was created to help you stay connected with friends and family across all earthly distances by providing you with the information that you need to select the best time to give them a call."
      ];
    }
    
    if (user && !homie) {
      return [
        `Select the location of your loved one on the map to see their local time...`,
        `You are located in ${user.region}, right now it is ${user.localtime}.`
      ];
    }
    
    const timeDiff = getTimeDiff(user.timezone, homie.timezone);
    const matchingWeekdays = getMatchingWeekdays(user.localtime, homie.localtime)
    const regionDiff = getRegionDiff(user.region, homie.region);

    if (typeof regionDiff === 'object') {
      [user.region, homie.region] = regionDiff;
    }
    if (matchingWeekdays) {
      [user.localtime, homie.localtime] = matchingWeekdays;
    }
    
    let text = [
      `It is ${homie.localtime} in ${homie.region}. Their clocks run ${timeDiff} ${getShortRegion(user.region)}.`,
      `You are located in ${user.region}, right now it is ${user.localtime}.`
    ];
    
    if (timeDiff === 0) {
      text[0] = `Your friend in ${homie.region} is in the same timezone as you! That should make scheduling a call pretty convenient:)`;
    }
    
    if (typeof regionDiff === 'string') {
      text[0] = regionDiff;
    }
    
    return text;
  };
  
  const text = getTextDisplay(user, homie);


  return (
    <div className='interface' >
      <h1>timezones</h1>
      <p>{text[0]}</p>
      <Map onMapClick={handleMapClick} geoFeatures={geoFeatures}/>
      <p>{text[1]}</p>
    </div>
  );
}

export default App;
