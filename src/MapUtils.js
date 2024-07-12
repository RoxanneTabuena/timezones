/*
This file contains all the map-related utility functions.
This list includes: 
1. Map Initialization
2. Map Click Handler (point display logic)
3. Map Mouse Move Handler (cursor change logic)
*/
import mapboxgl from 'mapbox-gl';

// GeoJSON object to hold our measurement features
let geojson = {
  type: 'FeatureCollection',
  features: []
};

// Map initialization parameters
const mapInitializationParams = {
  style: 'mapbox://styles/mapbox/light-v11',
  center: [0, 0],
  zoom: 1.5
};

// Initialize the map
export const initializeMap = (container) => {
  return new mapboxgl.Map({
    container: container,
    ...mapInitializationParams
  });
};

// Handle map click events
export const handleMapClick = (e, map) => {
  // features checks for previously saved points and temporarily stores them for later access
  const features = map.queryRenderedFeatures(e.point, {
    layers: ['points']
  });
  // if statement checks if the points location has been previously saved
  if (features.length) {
    const id = features[0].properties.id;
    // in the case that the point already exists the event is treated as a removal request and the point is removed from our dataset
    geojson.features = geojson.features.filter(
      (point) => point.properties.id !== id
    );
  // if the point does not exist it is added to our dataset
  } else {
    const point = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [e.lngLat.lng, e.lngLat.lat]
      },
      properties: {
        id: String(new Date().getTime())
      }
    };
    geojson.features.push(point);
  }
  // the map is reloaded with the new dataset
  map.getSource('geojson').setData(geojson);
};

// Handle map mouse move events
export const handleMapMouseMove = (e, map) => {
  // features again checks for previously saved points and temporarily stores them for later access
  const features = map.queryRenderedFeatures(e.point, {
    layers: ['points']
  });
  // styling logic is placed on the cursor to indicate to the user the two different functionalities (adding and removing points)
  map.getCanvas().style.cursor = features.length ? 'pointer' : 'crosshair';
};