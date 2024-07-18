// this component works with the Mapbox API to render a map, and combines logic from MapUtils and MapEvents to make the map functional
import React, { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import './map.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiZmxhbWJvIiwiYSI6ImNseWhkbHdtdTAzZ2wya29tOHppb253dHUifQ.uFJZkQdteBAxPRBIs8Uzbw';

export function Map({onMapClick, geoFeatures}) {
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);

  const handleMapMouseMove = useCallback((e, map) => {
    // features again checks for previously saved points and temporarily stores them for later access
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['points']
    });
    // styling logic is placed on the cursor to indicate to the user the two different functionalities (adding and removing points)
    map.getCanvas().style.cursor = features.length ? 'pointer' : 'crosshair';
  }, [] );
  
  //Initalize the map instance and sets up the map once it mounts
  useEffect(() => {
    console.log(`init render`)
    // Map initialization parameters.
    // current: colored grey, centered slightly north, zoomed out, flat view
    const mapInitParams = {
      style: 'mapbox://styles/mapbox/light-v11',
      center: [0, 15],
      zoom: 1,
      projection: 'equirectangular'
    };

    // mapInstance initalizes the map and stores it
    const mapInst = new mapboxgl.Map({
      container: mapRef.current,
      ...mapInitParams
    });

    // on load directs map set up
    mapInst.on('load', () => {
      // add source connects the map to a dataset where we can store geo points for our user
      mapInst.addSource('geojson', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: geoFeatures
        }
      });

      // add layer visualizes our dataset(points)
      mapInst.addLayer({
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
      setMap(mapInst);
    });

    // map inst is removed after it is no longer needed
    return () => mapInst.remove();
  }, [] );

  //second effect hook is responsible for user interaction with map
  useEffect(() => {
    console.log(`event render`)
    if (map) {
      const clickHandler = (e) => onMapClick(e, map)
      const mouseMoveHandler = (e) => handleMapMouseMove(e, map) 

      map.on('click', clickHandler)
      map.on('mousemove', mouseMoveHandler)

      return () => {
      
        map.off('click', clickHandler)
        map.off('mousemove', mouseMoveHandler)

      };
    }}, [onMapClick, handleMapMouseMove, map]);

  // update map when geoFeatures changes
  useEffect(() => {
    console.log(`source render`)
    if (map) {
      map.getSource('geojson').setData({
        type: 'FeatureCollection',
        features: geoFeatures
      });
    }
  }, [geoFeatures, map]);
// return statement displays our map component, refrencing it through mapRef
return (

  <div className="map-container" ref={mapRef}>
  </div>
);
}
