import {map,idmarker} from '../config/peta.js';
import {insertMarkerCOG} from '../controller/marker.js';
import {disposePopover} from '../controller/popup.js';
import {hide} from 'https://cdn.jsdelivr.net/gh/jscroot/element@0.1.7/croot.js';

export function getAllCoordinates(){
    let i=0;
    let sudahhapus=0;
    let pointlist = [];
    map.getLayers().forEach(layer => {
      if (i !== 0 && sudahhapus === 0) {
        layer.getSource().getFeatures().forEach( feature =>
          {
            let node = {
                id : feature.get('id'),
                namatempat : feature.get('namatempat'),
                lokasi : feature.get('lokasi'),
                fasilitas : feature.get('fasilitas'),
                xy : feature.get('geometry').flatCoordinates,
            }
            pointlist.push(node);
          }
        );
      }
      i++;
    });
    console.log(pointlist);
    disposePopover();
    hide('hitungcogbutton');
}