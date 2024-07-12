// This Component was created specifically to add and remove our event listeners to the map using the effect hook
import { useEffect } from 'react';

export const MapEvents = (map, events) => {
  useEffect(() => {
    if (map) {
      events.forEach(({ event, handler }) => {
        map.on(event, handler);
      });

      return () => {
        events.forEach(({ event, handler }) => {
          map.off(event, handler);
        });
      };
    }
  }, [map, events]);
};
