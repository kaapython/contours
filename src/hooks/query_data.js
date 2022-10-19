import {latLng} from "leaflet"

const basemaps = [
  {
    name: 'Топографическая карта России',
    url: 'https://tile-{s}.opentopomap.ru/{z}/{x}/{y}.png',
    key: 'topomap',
    visible: true
  },
  {
    name: 'Спутниковые снимки ESRI',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png',
    key: 'esri',
    visible: true
  }
];
const admreg = [
  {
    name: 'Границы муниципальных образований',
    key: 'admreg',
    visible: true,
    url: 'https://geo.pblp.ru/wms',
    layers: 'adm_region',
    format: 'image/png',
    transparent: true,
    tms: true,
    zIndex: 202
  }
];
const data = {
  zoom: 7,
  attribution: 'Филиал ФГБУ «Рослесинфорг» «Прибайкаллеспроект» |',
  center: latLng(54.600, 104.900),
  minZoom: 5,
  maxZoom: 17,
  fadeAnimation: true,
  zoomAnimation: true,
  noBlockingAnimations: true,
  username: null
};
const getFormatedDate = (time) => {
  /* Функция возврата отформатированной даты gps-points */
  if (time !== null) {
    return `${time.slice(-8)} ${time.slice(8, 10)}.${time.slice(5, 7)}.${time.slice(0, 4)}г.`
  } else {
    return 'нет даты'
  }
}


export { basemaps, data, admreg, getFormatedDate }
