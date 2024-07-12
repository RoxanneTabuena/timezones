// this component works with the Mapbox API to render a map, and combines logic from MapUtils and MapEvents to make the map functional
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { initializeMap, handleMapClick, handleMapMouseMove } from './MapUtils';
import { MapEvents } from './MapEvents';
import './map.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiZmxhbWJvIiwiYSI6ImNseWhkbHdtdTAzZ2wya29tOHppb253dHUifQ.uFJZkQdteBAxPRBIs8Uzbw';

export function Map() {
  // mapRef refrences the div that Map will be held in
  const mapRef = useRef(null);
  // map stores the map instance
  const [map, setMap] = useState(null);

  //Effect Hook initalizes the map instance and sets up the map once it mounts
  useEffect(() => {
    // mapInstance initalizes the map and stores it
    const mapInstance = initializeMap(mapRef.current);
    // set projection styles our map flat
    mapInstance.setProjection('equalEarth');
    // on load directs map set up
    mapInstance.on('load', () => {
      // add source connects the map to a dataset where we can store geo points for our user
      mapInstance.addSource('geojson', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });
      // add layer visualizes our dataset(points)
      mapInstance.addLayer({
        id: 'points',
        type: 'circle',
        source: 'geojson',
        paint: {
          'circle-radius': 5,
          'circle-color': '#000'
        },
        filter: ['in', '$type', 'Point']
      });
      // set map moves our map instance to a permanent location now that set up is complete
      setMap(mapInstance);
    });
    // map instance removes the initalization logic after it is no longer needed
    return () => mapInstance.remove();
  }, []);

  // map events imports a second effect hook which is responsible for user interaction
  MapEvents(map, [
    { event: 'click', handler: (e) => handleMapClick(e, map) },
    { event: 'mousemove', handler: (e) => handleMapMouseMove(e, map) }
  ]);

  // return statement displays our map component, refrencing it through mapRef
  return <div className="map-container" ref={mapRef} />;
}
