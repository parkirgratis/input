import Map from 'https://cdn.skypack.dev/ol/Map.js';
import View from 'https://cdn.skypack.dev/ol/View.js';
import TileLayer from 'https://cdn.skypack.dev/ol/layer/Tile.js';
import XYZ from 'https://cdn.skypack.dev/ol/source/XYZ.js';
import OSM from 'https://cdn.skypack.dev/ol/source/OSM.js';
import {fromLonLat} from 'https://cdn.skypack.dev/ol/proj.js';
import Overlay from 'https://cdn.skypack.dev/ol/Overlay.js';
import {container} from 'https://jscroot.github.io/element/croot.js';
import VectorSource from 'https://cdn.skypack.dev/ol/source/Vector.js';
import {Vector as VectorLayer} from 'https://cdn.skypack.dev/ol/layer.js';

const attributions = '<a href="https://petapedia.github.io/" target="_blank">&copy; PetaPedia Indonesia</a> ';

const place = [107.13563336552649,-6.8165156551551505];

const basemap = new TileLayer({
  source: new OSM({attributions: attributions,}),
});

const defaultstartmap = new View({
  center: fromLonLat(place),
  zoom: 9,
});

export const overlay = new Overlay({
    element: container('popup'),
    autoPan: {
      animation: {
        duration: 250,
      },
    },
  });

export let markerSource = new VectorSource();
const distmarker = new VectorLayer({
  source: markerSource,
});

export let map = new Map({
  overlays: [overlay],
  target: 'map',
  layers: [
    basemap, distmarker
  ],
  view: defaultstartmap,
});

