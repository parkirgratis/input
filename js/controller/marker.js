import Feature from 'https://cdn.skypack.dev/ol/Feature.js';
import Point from 'https://cdn.skypack.dev/ol/geom/Point.js';
import VectorSource from 'https://cdn.skypack.dev/ol/source/Vector.js';
import {Vector as VectorLayer} from 'https://cdn.skypack.dev/ol/layer.js';
import {fromLonLat} from 'https://cdn.skypack.dev/ol/proj.js';
import {Icon, Style} from 'https://cdn.skypack.dev/ol/style.js';
import Overlay from 'https://cdn.skypack.dev/ol/Overlay.js';
import {map,idmarker} from '../config/peta.js';

export function insertMarker(namatempat,long,lat,lokasi,fasilitas){
  let marker = new Feature({
      type: 'icon',
      id : idmarker.id,
      namatempat : namatempat,
      lokasi : lokasi,
      fasilitas : fasilitas,
      geometry: new Point(fromLonLat([long, lat])),
    });
    marker.setStyle(
        new Style({
          image: new Icon({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: '../../img/marker.png',
            scale: 0.05 
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

export function deleteMarker(idmarker){
    let i=0;
    let sudahhapus=0;
    map.getLayers().forEach(layer => {
      if (i !== 0 && sudahhapus === 0) {
        layer.getSource().getFeatures().forEach( feature =>
          {
            if (feature.get('id') == idmarker){
              map.removeLayer(layer);
              sudahhapus=1;
              console.log("hapus layer");
              return;
            }
          }
        );
      }
      i++;
    });
}

export function createMarker(map, coordinates) {
  const marker = new Overlay({
    position: fromLonLat(coordinates),
    positioning: 'center-center',
    element: createMarkerElement(),
    stopEvent: false
  });
  map.addOverlay(marker);
  return marker;
}

function createMarkerElement() {
  const element = document.createElement('div');
  element.innerHTML = '<img src="../../img/marker.png" alt="Marker" style="width: 20px; height: 20px;">';
  return element;
}

// Fungsi untuk menambahkan marker pada lokasi pengguna
export function addUserLocationMarker() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoordinates = [position.coords.longitude, position.coords.latitude];
        const userMarker = new Feature({
          geometry: new Point(fromLonLat(userCoordinates)),
        });
        userMarker.setStyle(
          new Style({
            image: new Icon({
              anchor: [0.5, 1],
              src: '../../img/MarkerUser.png',
              scale: 0.02
            }),
          })
        );

        const vectorSource = new VectorSource({
          features: [userMarker],
        });

        const vectorLayer = new VectorLayer({
          source: vectorSource,
        });

        map.addLayer(vectorLayer);
        map.getView().setCenter(fromLonLat(userCoordinates));
        map.getView().setZoom(17); 
      },
      (error) => {
        console.error('Error mendapatkan lokasi pengguna:', error);
        alert('Tidak dapat mengakses lokasi Anda. Pastikan izin lokasi diaktifkan.');
      }
    );
  } else {
    alert('Geolocation tidak didukung oleh browser ini.');
  }
}

// Panggil fungsi ini saat halaman dimuat
document.addEventListener('DOMContentLoaded', addUserLocationMarker);