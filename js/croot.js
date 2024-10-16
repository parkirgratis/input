import {map} from './config/peta.js';
import {onClosePopupClick,onDeleteMarkerClick,onSubmitMarkerClick,onMapClick,onMapPointerMove,disposePopover} from './controller/popup.js';
import { onClick } from 'https://cdn.jsdelivr.net/gh/jscroot/element@0.1.7/croot.js';
import { createMarker } from './controller/marker.js';

// Tambahkan kode ini di bagian atas file croot.js
document.addEventListener('DOMContentLoaded', function() {
    const map = document.getElementById('map');
    const sidebar = document.getElementById('sidebar');
    
    map.addEventListener('click', function() {
        if (sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        } else {
            sidebar.classList.add('active');
        }
    });

    // Tombol tutup sidebar
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.className = 'absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded';
    closeButton.addEventListener('click', function() {
        sidebar.classList.remove('active');
    });
    sidebar.prepend(closeButton);

    // Fungsi untuk menangani input data
    document.getElementById('insertmarkerbutton').addEventListener('click', function() {
        // Di sini Anda bisa menambahkan logika untuk menangani input data
        console.log('Data diinput');
        sidebar.classList.remove('active');
    });

    // Mencegah klik di dalam sidebar menutup sidebar
    sidebar.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    const mobileMenu = document.getElementById('mobile-menu');
    const navbarMenu = document.querySelector('.navbar-menu');

    mobileMenu.addEventListener('click', function() {
        navbarMenu.classList.toggle('active');
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
