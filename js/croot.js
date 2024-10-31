import {map} from './config/peta.js';
// import {onClosePopupClick,onDeleteMarkerClick,onMapClick,onMapPointerMove,disposePopover} from './controller/popup.js';
import { onClick, setValue } from 'https://cdn.jsdelivr.net/gh/jscroot/element@0.1.7/croot.js';
import { createMarker } from './controller/marker.js';
import { fromLonLat, toLonLat } from 'https://cdn.skypack.dev/ol/proj.js';
import {
    setInner,
    show,
    hide,
    getValue,
    getFileSize
  } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.0.6/croot.js";
  
  import { postFile } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.2/croot.js";

function enableSwipeUp(element) {
    let startY, currentY, isDragging = false;

    element.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        isDragging = true;
    });

    element.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentY = e.touches[0].clientY;
        const translateY = Math.max(0, currentY - startY);
        element.style.transform = `translateY(${translateY}px)`;
    });

    element.addEventListener('touchend', () => {
        isDragging = false;
        if (currentY - startY < -50) {
            element.classList.add('active');
        } else {
            element.style.transform = 'translateY(50%)';
        }
    });
}

function enableSwipeDownToHide(element) {
    let startY, currentY, isDragging = false, swipeCount = 0;

    element.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        isDragging = true;
    });

    element.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentY = e.touches[0].clientY;
        const translateY = Math.max(0, currentY - startY);
        element.style.transform = `translateY(${translateY}px)`;
    });

    element.addEventListener('touchend', () => {
        isDragging = false;
        if (currentY - startY > 50) {
            swipeCount++;
            if (swipeCount >= 2) {
                element.style.display = 'none';
                swipeCount = 0; // Reset swipe count
            }
        } else {
            element.style.transform = 'translateY(0)';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    map.getTargetElement().addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });

    mobileMenuToggle.addEventListener('click', function() {
        navbarMenu.classList.toggle('active');
    });

    // Pastikan sidebar tidak menutup ketika diklik
    sidebar.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    // Tambahkan event listener untuk menangkap klik pada peta
    map.on('click', function(evt) {
        // Dapatkan koordinat dari event klik
        let tile = evt.coordinate;
        let coordinate = toLonLat(tile); // Mengonversi koordinat ke lon dan lat

        // Simpan koordinat ke elemen input
        setValue('long', coordinate[0]); // Menyimpan longitude
        setValue('lat', coordinate[1]);  // Menyimpan latitude

        // Anda bisa menambahkan log atau notifikasi jika diperlukan
        console.log('Koordinat disimpan:', coordinate);
    });

    document.getElementById('insertmarkerbutton').addEventListener('click', function() {
        console.log('Tombol insertmarkerbutton ditekan'); 
        uploadImage(); // Memanggil fungsi uploadImage

        const lat = parseFloat(document.getElementById('lat').value);
        const lon = parseFloat(document.getElementById('long').value);

        // Mengambil data dari input di sidebar
        const placeName = document.getElementById('namatempat').value;
        const location = document.getElementById('lokasi').value;
        const facilities = document.getElementById('fasilitas').value;
        const imageInput = document.getElementById('imageInputSidebar');

        if (imageInput.files.length > 0) {
            const image = imageInput.files[0].name; // Mengambil hanya nama file

            // Membuat objek untuk dikirim sebagai JSON
            const data = {
                nama_tempat: placeName,
                lokasi: location,
                fasilitas: facilities,
                lat: lat,
                lon: lon,
                gambar: image
            };

            console.log('Data yang akan dikirim:', data); // Tambahkan log untuk melihat data yang akan dikirim

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
                    tambahKoordinatKeDatabase(lon, lat);
                } else {
                    alert('Gagal menyimpan data');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Terjadi kesalahan saat mengirim data.');
            });

            // Prepare coordinates data for koordinat endpoint
            const coordData = {
                markers: [
                    [lon, lat]
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
        } else {
            alert("Please select an image file");
        }
    });

    const showDataButton = document.getElementById('showDataButton');
    const dataSidebar = document.getElementById('dataSidebar');
    const closeDataSidebar = document.getElementById('closeDataSidebar');
    const dataSidebarContent = document.getElementById('dataSidebar-content');

    showDataButton.addEventListener('click', function(event) {
        event.preventDefault();
        console.log('Tombol TAMPILKAN DATA ditekan');
        dataSidebar.style.display = 'block';
    });

    closeDataSidebar.addEventListener('click', function() {
        console.log('Tombol Kembali ditekan');
        dataSidebar.style.display = 'none';
    });

    function fetchDataAndRender() {
        fetch('https://asia-southeast2-backend-438507.cloudfunctions.net/parkirgratisbackend/data/lokasi')
            .then(response => response.json())
            .then(data => {
                if (!Array.isArray(data)) {
                    console.error('Data lokasi bukan array:', data);
                    return;
                }
                renderDataToSidebar(data);
            })
            .catch(error => console.error('Gagal mengambil data lokasi:', error));
    }

    function renderDataToSidebar(lokasiData) {
        dataSidebarContent.innerHTML = ''; // Kosongkan konten sebelumnya
        lokasiData.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'lokasi-item flex items-center gap-2 p-2 border-b';

            itemElement.innerHTML = `
                <img src="${item.gambar || 'default.jpg'}" alt="${item.nama_tempat || 'Nama Tempat'}" class="w-16 h-16 object-cover rounded">
                <div>
                    <h3 class="font-semibold">${item.nama_tempat || 'Nama Tempat'}</h3>
                    <p>${item.lokasi || 'Lokasi'}</p>
                    <p>${item.fasilitas || 'Fasilitas'}</p>
                </div>
                
            `;

            itemElement.addEventListener('click', () => {
                focusOnMarker(item.lon, item.lat);
            });

            dataSidebarContent.appendChild(itemElement);
        });
    }

    function focusOnMarker(long, lat) {
        const view = map.getView(); 
        const coordinate = fromLonLat([long, lat]);
        view.animate({
            center: coordinate,
            duration: 1000,
            zoom: 18 
        });
    }

    // Panggil fungsi untuk mengambil dan menampilkan data
    fetchDataAndRender();

    if (sidebar) enableSwipeUp(sidebar);
    if (dataSidebar) enableSwipeUp(dataSidebar);
    if (sidebar) enableSwipeDownToHide(sidebar);
    if (dataSidebar) enableSwipeDownToHide(dataSidebar);
});

// onClick('popup-closer',onClosePopupClick);
// onClick('insertmarkerbutton',onSubmitMarkerClick);
// onClick('hapusbutton',onDeleteMarkerClick);

// map.on('click', onMapClick);
// map.on('pointermove', onMapPointerMove);
// map.on('movestart', disposePopover);

fetch('https://asia-southeast2-backend-438507.cloudfunctions.net/parkirgratisbackend/data/marker')
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

    

    // document.getElementById('showFormButton').addEventListener('click', function() {
    //     const form = document.getElementById('placeForm');
    //     if (form.style.display === 'block') {
    //         form.style.display = 'none';
    //     } else {
    //         form.style.display = 'block';
    //     }
    // });

    // const imageInput = document.getElementById('imageInputSidebar');
    // console.log(imageInput.files);

window.uploadImage = uploadImage;

const target_url = "https://asia-southeast2-backend-438507.cloudfunctions.net/parkirgratisbackend/upload/img";

function uploadImage() {
    const imageInput = document.getElementById('imageInputSidebar');
    if (!imageInput || imageInput.files.length === 0) {
        alert("Please select an image file");
        return;
    }
    const inputFileElement = document.getElementById('imageInputSidebar');
    if (inputFileElement) {
        hide("imageInputSidebar");
    } else {
        console.error("Element with ID 'imageInputSidebar' not found");
    }
    let besar = getFileSize("imageInputSidebar");
    setInner("isi", besar);
    
    postFile(target_url, "imageInputSidebar", "img", renderToHtml);
}

// Fungsi untuk menangani respons unggahan
function renderToHtml(result) {
    console.log(result);
    setInner("isi", "https://parkirgratis.github.io/filegambar/" + result.response);
    show("imageInputSidebar");
}


// // Fungsi untuk menangani kesalahan unggahan
// function handleUploadError(error) {
//     console.error(error);
//     if (error.status === 409) {
//         alert("File already exists or there is a conflict. Please try again with a different file.");
//     } else {
//         alert("An error occurred during the upload. Please try again.");
//     }
//     show("imageInputSidebar");
// }
// ;

document.getElementById('dataSidebar').style.display = 'none';