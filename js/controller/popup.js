import {toLonLat} from 'https://cdn.skypack.dev/ol/proj.js';
import {toStringHDMS} from 'https://cdn.skypack.dev/ol/coordinate.js';
import {overlay,map,popupinfo,idmarker} from '../config/peta.js';
import {clickpopup} from '../template/popup.js';
import {insertMarker,deleteMarker} from './marker.js';
import {setInner,textBlur, getValue,setValue} from 'https://cdn.jsdelivr.net/gh/jscroot/element@0.1.7/croot.js';
import { postJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.8/croot.js";


export function onClosePopupClick() {
    overlay.setPosition(undefined);
    textBlur('popup-closer');
}

export function onDeleteMarkerClick() {
    let idmarker = getValue('idmarker');
    popupinfo.setPosition(undefined);
    deleteMarker(idmarker);
}

export function onSubmitMarkerClick() {
  let long = getValue('long');
  let lat = getValue('lat');
  let namatempat = getValue('namatempat');
  let lokasi = getValue('lokasi');
  let fasilitas = getValue('fasilitas');
  let volume = getValue('volume'); // Pastikan volume diambil dari input yang benar
  let data = {long, lat, volume};
  postJSON("https://eoqc0wqfm9sjc6y.m.pipedream.net","Token","dsf9ygf87h98u479y98dj0fs89nfd7",data,afterSubmitCOG);
  overlay.setPosition(undefined);
  textBlur('popup-closer');
  insertMarker(namatempat,long,lat,volume,lokasi,fasilitas);
  idmarker.id=idmarker.id+1;
}

function afterSubmitCOG(result){
    console.log(result);
}

function popupInputMarker(evt) {
    let tile = evt.coordinate;
    let coordinate = toLonLat(tile);
    let namatempat = getValue('namatempat');
    let lokasi = getValue('lokasi');
    let fasilitas = getValue('fasilitas');
    let volume = getValue('volume'); // Pastikan volume diambil dari input yang benar
    let msg = clickpopup.replace("#LONG#", coordinate[0])
                        .replace("#LAT#", coordinate[1])
                        .replace('#X#', tile[0])
                        .replace('#Y#', tile[1])
                        .replace('#HDMS#', toStringHDMS(coordinate));
    msg = 'ID : ' + idmarker.id + '<br>' + msg + "Pixel : " + evt.pixel + "<br>";
    setInner('popup-content', msg);
    setValue('long', coordinate[0]);
    setValue('lat', coordinate[1]);
    overlay.setPosition(tile);
}

function popupGetMarker(evt, feature) {
    let title = feature.get('id') + "#" + feature.get('namatempat');
    setInner('popupinfo-title', title);
    setValue('idmarker', feature.get('id'));
    
    let ctnt = "volume : " + feature.get('volume');
    let loka = "lokasi : " + feature.get('lokasi'); 
    let fasi = "fasilitas : " + feature.get('fasilitas') + "<br>" + feature.get('geometry').flatCoordinates;
    // Gabungkan konten menjadi satu string
    let content = ctnt + "<br>" + loka + "<br>" + fasi;
    // Set konten popup
    setInner('popupinfo-content', content);
    // Tampilkan popup pada posisi koordinat event
    popupinfo.setPosition(evt.coordinate);
}

export function onMapPointerMove(evt) {
  const pixel = map.getEventPixel(evt.originalEvent);
  const hit = map.hasFeatureAtPixel(pixel);
  map.getTargetElement().style.cursor = hit ? 'pointer' : '';
}

let popover;
export function disposePopover() {
  if (overlay || popupinfo) {
    overlay.setPosition(undefined);
    popupinfo.setPosition(undefined);
  }
}

export function onMapClick(evt) {
    let feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
      return feature;
    });
    overlay.setPosition(undefined);
    popupinfo.setPosition(undefined);
    if (!feature) {
        popupInputMarker(evt);
        return;
    }else{
        popupGetMarker(evt,feature);
    }
  }