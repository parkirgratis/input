import Feature from 'https://cdn.skypack.dev/ol/Feature.js';
import Point from 'https://cdn.skypack.dev/ol/geom/Point.js';
import VectorSource from 'https://cdn.skypack.dev/ol/source/Vector.js';
import {Vector as VectorLayer} from 'https://cdn.skypack.dev/ol/layer.js';
import {fromLonLat} from 'https://cdn.skypack.dev/ol/proj.js';
import {Icon, Style} from 'https://cdn.skypack.dev/ol/style.js';
import {map} from '../config/peta.js';

export function cogMarker(long,lat){
    let marker = new Feature({
        type: 'icon',
        geometry: new Point(fromLonLat([long, lat])),
    });
    marker.setStyle(
        new Style({
          image: new Icon({
            anchor: [0.5, 1],
            src: 'img/icon.png',
          }),
        })
      );
    let vectorSource = new VectorSource({
        features: [marker],
    });
    
    let vectorLayer = new VectorLayer({
    source: vectorSource,
    });
    map.addLayer(vectorLayer);
}