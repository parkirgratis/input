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

    const showDataButton = document.getElementById('showDataButton');
    const dataSidebar = document.getElementById('dataSidebar');
    const closeDataSidebar = document.getElementById('closeDataSidebar');

    showDataButton.addEventListener('click', function(event) {
        event.preventDefault();
        console.log('Tombol TAMPILKAN DATA ditekan');
        dataSidebar.style.display = 'block';
    });

    closeDataSidebar.addEventListener('click', function() {
        console.log('Tombol Kembali ditekan');
        dataSidebar.style.display = 'none';
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

    document.getElementById('dataSidebar').style.display = 'none';

    document.getElementById('showFormButton').addEventListener('click', function() {
        const form = document.getElementById('placeForm');
        if (form.style.display === 'block') {
            form.style.display = 'none';
        } else {
            form.style.display = 'block';
        }
    });

    document.getElementById('placeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    uploadImage();

    // Mengambil data dari form
    const placeName = document.getElementById('placeName').value;
    const location = document.getElementById('location').value;
    const facilities = document.getElementById('facilities').value;
    const coordinates = document.getElementById('coordinates').value.split(',').map(Number);
    const image = document.getElementById('imageInput').files[0].name; // Mengambil hanya nama file

    // Membuat objek untuk dikirim sebagai JSON
    const data = {
        nama_tempat: placeName,
        lokasi: location,
        fasilitas: facilities,
        lat: coordinates[0],
        lon: coordinates[1],
        gambar: image
    };

    // Mengirim data ke server menggunakan fetch dengan body berformat JSON
    fetch('https://asia-southeast2-backend-438507.cloudfunctions.net/parkirgratisbackend/tempat-parkir', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Data berhasil disimpan!');
            // Menambahkan koordinat ke database
            tambahKoordinatKeDatabase(coordinates);
        } else {
            alert('Berhasil Menyimpan Data');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat mengirim data.');
    });

    // Prepare coordinates data for koordinat endpoint
    const coordData = {
        markers: [
            [coordinates[1], coordinates[0]]
        ]
    };

    fetch('https://asia-southeast2-backend-438507.cloudfunctions.net/parkirgratisbackend/koordinat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(coordData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Coordinates saved successfully:', data);
        alert('Coordinates added successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to add place or save coordinates!');
    });
});
