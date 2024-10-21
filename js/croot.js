import {map} from './config/peta.js';
import {onClosePopupClick,onDeleteMarkerClick,onSubmitMarkerClick,onMapClick,onMapPointerMove,disposePopover} from './controller/popup.js';
import { onClick } from 'https://cdn.jsdelivr.net/gh/jscroot/element@0.1.7/croot.js';
import { createMarker } from './controller/marker.js';

// Tambahkan kode ini di bagian atas file croot.js
document.addEventListener('DOMContentLoaded', function() {
    const map = document.getElementById('map');
    const sidebar = document.getElementById('sidebar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    map.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });

    mobileMenuToggle.addEventListener('click', function() {
        navbarMenu.classList.toggle('active');
    });

    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.className = 'absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded';
    closeButton.addEventListener('click', function() {
        sidebar.classList.remove('active');
    });
    sidebar.prepend(closeButton);

    document.getElementById('insertmarkerbutton').addEventListener('click', function() {
        console.log('Data diinput');
        sidebar.classList.remove('active');
    });

    sidebar.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});

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
