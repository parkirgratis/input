import {map} from './config/peta.js';
import {onClosePopupClick,onDeleteMarkerClick,onSubmitMarkerClick,onMapClick,onMapPointerMove,disposePopover} from './controller/popup.js';
import {onClick} from 'https://cdn.jsdelivr.net/gh/jscroot/element@0.1.7/croot.js';
import { createMarker } from './controller/marker.js';

onClick('popup-closer',onClosePopupClick);
onClick('insertmarkerbutton',onSubmitMarkerClick);
onClick('hapusbutton',onDeleteMarkerClick);

map.on('click', onMapClick);
map.on('pointermove', onMapPointerMove);
map.on('movestart', disposePopover);

fetch('https://asia-southeast2-fit-union-424704-a6.cloudfunctions.net/parkirgratisbackend/data/marker')
    .then(response => response.json())
    .then(data => {
        if (!Array.isArray(data.markers)) {
            console.error('Data marker bukan array:', data);
            return;
        }
        console.log('Koordinat Marker:', data.markers);
        createMapMarkers(data.markers);
    })
    .catch(error => console.error('Gagal mengambil data marker:', error));

function createMapMarkers(markerCoords) {
    const markers = markerCoords.map(coord => createMarker(map, coord));

    markers.forEach((marker, index) => {   
    });
}