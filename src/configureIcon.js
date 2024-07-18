import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

const MapboxExample = () => {
  const mapContainerRef = useRef();
  const mapRef = useRef();

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZmxhbWJvIiwiYSI6ImNseWhkbHdtdTAzZ2wya29tOHppb253dHUifQ.uFJZkQdteBAxPRBIs8Uzbw';

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-96, 37.8],
      zoom: 3
    });

    mapRef.current.on('load', () => {
      mapRef.current.loadImage(
        './icon.png',
        (error, image) => {
          if (error) throw error;
          mapRef.current.addImage('custom-marker', image);

          mapRef.current.addSource('points', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [-77.03238901390978, 38.913188059745586]
                  },
                  properties: {
                    title: 'Mapbox DC'
                  }
                },
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [-122.414, 37.776]
                  },
                  properties: {
                    title: 'Mapbox SF'
                  }
                }
              ]
            }
          });

          mapRef.current.addLayer({
            id: 'points',
            type: 'symbol',
            source: 'points',
            layout: {
              'icon-image': 'custom-marker',
              'text-field': ['get', 'title'],
              'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
              'text-offset': [0, 1.25],
              'text-anchor': 'top'
            }
          });
        }
      );
    });
  }, []);

  return <div id="map" style={{ height: '100%' }} ref={mapContainerRef}></div>;
};

export default MapboxExample;