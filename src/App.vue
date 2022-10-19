<template>
  <TopMenu
    @showReports="visible_reports = !visible_reports; visible_info_project = !visible_info_project"
  />

  <div class="map-main" :style="{width: `${width_map}%`}">
    <l-map
      v-model:zoom.sync="zoom"
      :center="center"
      :minZoom="data.minZoom"
      :maxZoom="data.maxZoom"
      :options="{zoomControl: false, preferCanvas: true}"
      :fadeAnimation="data.fadeAnimation"
      :zoomAnimation="data.zoomAnimation"
      :noBlockingAnimations="data.noBlockingAnimations"
      :style="{width: `${ width }%`, height: `${ height }%`}"
      :update:center="center"
      :update:zoom="zoom"
      ref="map">

      <l-tile-layer
        :url="selected_map.url"
        :attribution="data.attribution"/>

      <l-polygon
        v-for="i in contours_polygon" :key="i.id"
        :lat-lngs="i.geometry.coordinates"
        color="black"
        fillColor="black"
        fillOpacity="0.3">
      </l-polygon>

      <l-polygon
        v-for="i in contours_images" :key="i.id"
        :lat-lngs="i.geometry.coordinates"
        color="red"
        weight="2"
        fillColor="red"
        fillOpacity="1">
        <l-popup>
          <div class="btn-download-images" @click="downloadImage(i.path)">загрузить снимок</div>
        </l-popup>
      </l-polygon>

    </l-map>

  </div>

  <RightPanel
    v-show="visible_right_panel" class="visible_right_panel"
    @showRightPanel="showRightPanel"
    @showBaseMap="showBaseMap"
    @queryContours="queryContours"
    @searchSatelliteImages="searchSatelliteImages" />

  <div class="show-right-panel"
       v-show="visible_icon">
    <a class="info" href="#" title="Right Panel"
       @mouseover="mouseover"></a>
  </div>

  <div class="info-project"
       v-show="visible_info_project">«Контура 2022 г.»
  </div>

</template>

<script setup lang="ts">
  import { latLng } from "leaflet"
  import { ref } from 'vue'
  import { data, basemaps } from './hooks/query_data.js'
  import TopMenu from './components/TopMenu.vue'
  import RightPanel from './components/RightPanel.vue'
  import { LMap, LTileLayer, LPolygon, LPopup } from '@vue-leaflet/vue-leaflet'

  const map = ref([]);
  const width_map = ref(100);
  const width = 100;
  const height = 100;
  const center = ref(latLng(57.600, 104.900));
  const zoom = ref(6);
  const visible_right_panel = ref(false);
  const visible_icon = ref(true);
  const visible_info_project = ref(true);
  const selected_map = ref(basemaps[0]);
  const contours_polygon = ref([]);
  const contours_images = ref([]);

  const mouseover = () => {
    visible_right_panel.value = true;
    visible_icon.value = false;
  };
  const showBaseMap = (e) => {
    selected_map.value = e;
  };
  const showRightPanel = () => {
    (width_map.value === 100) ? (width_map.value = 70) : (width_map.value = 100);
  };
  const queryContours = (e) => {
    contours_images.value = [];
    contours_polygon.value = e[0]['data'];
    let box = e[1]['data'][0]['bbox'];
    let bbox = [[box['f1'], box['f2']],
                [box['f3'], box['f4']]];
    map.value.leafletObject.fitBounds(bbox, {animate: true});
  };
  const searchSatelliteImages = (e) => {
    contours_images.value = e[0];
  };
  const downloadImage = (e) => {
    const link = document.createElement('a');
    link.href = `download-images?name=${ e }`;
    link.download = ``;
    link.click()
  }

</script>

<style scoped>
  .map-main {
    height: 93%;
  }
  .info-project {
    position: absolute;
    top: 64px;
    left: 5px;
    z-index: 400;
    background-color: #fff;
    border-radius: 4px;
    background: #b1f9b1;
  }
  .show-right-panel {
    position: absolute;
    top: 65px;
    z-index: 400;
    right: 4px;
  }
  .btn-download-images {
    cursor: pointer;
    border-radius: 4px;
    border: 1px solid #32CD32;
  }
  .btn-download-images:hover {
    background-color: #A7FFA7;
  }
</style>
