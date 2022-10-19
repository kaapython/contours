<template>
  <div
    class="tenantry-first-right-panel"
    :style="{right: `${right}%`, width: `${width}%`, background: `${background}`, backgroundPositionX: `${backgroundPositionX}`}">
    <div class="items-left-btn-tablet">

      <div class="block-resource">

        <div class="btn-tablet settings-btn-tablet" title="Управление лесными ресурсами"
             @click="showRightPanelManagement"></div>
        <div class="items-resources" v-show="visible_items_resources">
          <div class="item-text btn-outline-success" @click="visible_item_resources = !visible_item_resources">
            <b>Управление лесными ресурсами</b>
          </div>
          <transition name="resource">

            <div class="item-resource" v-show="visible_item_resources">
              <div class="item-text btn-outline-success" @click="visible_map = !visible_map"><b>Базовые карты</b></div>

              <transition name="layers">
                <ul class="layers-menu" v-show="visible_map">
                  <li v-for="i in basemaps" :key="i.id">
                    <RadioButton class="span-item form-check-input"
                                 :inputId="i.key"
                                 :value="i"
                                 v-model="selected_base_map"
                                 @change="showBaseMap"/>
                    <label class="item-text" :for="i.key">{{ i.name }}</label>
                  </li>
                </ul>
              </transition>
            </div>

          </transition>

        </div>
      </div>

      <div class="block-resource">
        <div
          class="btn-tablet forestry-btn-table"
          title="Лесные ресурсы"
          @click="showRightPanelResources"></div>
        <div
          class="items-resources"
          v-show="visible_items_resources">
          <div
            class="item-text btn-outline-success"
            @click="visible_forestry_resources = !visible_forestry_resources"><b>Лесные ресурсы</b></div>
          <transition name="forestry_resource">
            <div class="item-forestry-resource" v-show="visible_forestry_resources">
              <div class="form-group">

                <div class="item__resource">
                  <label class="label-text">Лесничества</label>
                  <select class="form-control" style="height: 30px"
                          v-model="selected_resource_id" @change="queryResource">
                    <option v-for="i in forestry" :key="i.id"
                            :value="'forestry_id:' + i.forestry_id"
                            @click="queryContours(`f|${i.forestry_id}`)">{{ i.name }}
                    </option>
                  </select>
                </div>

                <div style="margin: 3px 0 0 0;" v-show="visible_btn_search_images_f">
                  <Button class="btn-search-images" style="border-radius: 5px" type="button"
                          label="Поиск снимков" icon="pi pi-search" iconPos="right"
                          :loading="loading[0]" @click="searchSatelliteImages(0)" />
                </div>

                <div class="item__resource" v-show="visible_forestry_district">
                  <label class="label-text">Участковые лесничества</label>
                  <select class="form-control" style="height: 30px"
                          v-model="selected_resource_id" @change="queryResource">
                    <option v-for="i in forestry_district" :key="i.id"
                            :value="'forestry_district_id:' + i.forestry_district_id"
                            @click="queryContours(`fd|${i.forestry_district_id}`)">{{ i.name }}
                    </option>
                  </select>
                </div>

                <div style="margin: 3px 0 0 0;" v-show="visible_btn_search_images_fd">
                  <Button class="btn-search-images" style="border-radius: 5px" type="button"
                          label="Поиск снимков" icon="pi pi-search" iconPos="right"
                          :loading="loading[0]" @click="searchSatelliteImages(0)" />
                </div>

                <div class="item__resource" v-show="visible_district">
                  <label class="label-text">Участковые дачи и тех. участки</label>
                  <select class="form-control" style="height: 30px"
                          v-model="selected_resource_id" @change="queryKvartals">
                    <option v-for="i in district" :key="i.id"
                            :value="i.district_id" @click="queryContours(`d|${i.district_id}`)">{{ i.name }}
                    </option>
                  </select>
                </div>

                <div style="margin: 3px 0 0 0;" v-show="visible_btn_search_images_kv">
                  <Button class="btn-search-images" style="border-radius: 5px" type="button"
                          label="Поиск снимков" icon="pi pi-search" iconPos="right"
                          :loading="loading[0]" @click="searchSatelliteImages(0)" />
                </div>

              </div>

            </div>

          </transition>

        </div>
      </div>

      <Dialog
        header="Диалоговое окно"
        v-model:visible="display_modal"
        :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '25vw'}" :modal="true">
        <p class="m-0" style="font-size: 20px"><b>{{ msg }}</b></p>
        <template #footer>
          <Button label="Закрыть" icon="pi pi-check" @click="closeModal" autofocus />
        </template>
      </Dialog>

    </div>
  </div>

</template>

<script setup lang="ts">
  import { ref, defineEmits } from 'vue'
  import { basemaps } from '../hooks/query_data.js'
  import { queryDataExios } from '../hooks/query_axios.js'

  const right = 0;
  const width = ref(2);
  const background = ref('rgb(255, 255, 255)');
  const backgroundPositionX = 'right';
  const forestry = ref([]);
  const forestry_district = ref([]);
  const district = ref([]);
  const errors = [];
  const contours = ref([]);
  const visible_items_resources = ref(false);
  const visible_item_resources = ref(false);
  const visible_forestry_resources = ref(false);
  const visible_forestry_district = ref(false);
  const visible_district = ref(false);
  const visible_map = ref(false);
  const visible_kv = ref(false);
  const visible_button = ref(false);
  const visible_btn_search_images_f = ref(false);
  const visible_btn_search_images_fd = ref(false);
  const visible_btn_search_images_kv = ref(false);
  const selected_resource_id = ref([]);
  const selected_base_map = ref(basemaps[0]);
  const kvartals = ref([]);
  const text_contours = ref([]);
  const loading = ref([false]);
  const images = ref([]);
  const msg = ref([]);
  const display_modal = ref(false);

  const emit = defineEmits([
    'showRightPanel',
    'showBaseMap',
    'searchSatelliteImages'
  ]);
  const showRightPanelManagement = () => {
    (width.value === 2) ? (width.value = 30, visible_items_resources.value = true, background.value = 'white url(/static/images/desktop/sidebar-bg.svg) repeat-y center') :
      (width.value = 2, visible_items_resources.value = false, background.value = 'rgb(255, 255, 255)');
    visible_item_resources.value = !visible_item_resources.value;
    emit('showRightPanel');
  };
  const showRightPanelResources = () => {
    (width.value === 2) ? (width.value = 30, visible_items_resources.value = true, background.value = 'white url(/static/images/desktop/sidebar-bg.svg) repeat-y center') :
      (width.value = 2, visible_items_resources.value = false, background.value = 'rgb(255, 255, 255)');
    visible_forestry_resources.value = !visible_forestry_resources.value;
    emit('showRightPanel');
  };
  const showBaseMap = () => {
    emit('showBaseMap', selected_base_map.value);
  };
  const queryResource = () => {
    // Получение списка имен лесничеств и уч.лисничеств 
    visible_kv.value = false;
    visible_button.value = false;
    kvartals.value = [];
    const id = selected_resource_id.value.split(':')[1];
    const name_id = selected_resource_id.value.split(':')[0];
    if (name_id === 'forestry_id'){
      queryDataExios(
        `select-forestry-disrtict?forestry_pk=${id}`,
        'get'
      )
          .then(response => {
            forestry_district.value = response.data[0].sort((a, b) => a.name > b.name);
            visible_forestry_district.value = true;
          })
          .catch(e => {
            console.log('Err_query_forestry_district: ', errors.push(e));
          });
    } else {
      visible_kv.value = false;
      visible_button.value = false;
      kvartals.value = [];
      queryDataExios(
        `select-district?forestry_district_pk=${id}`,
        'get'
      )
          .then(response => {
            district.value = response.data[0].sort((a, b) => a.name > b.name);
            visible_district.value = true;
            // emit('queryForestry', response.data);
          })
          .catch(e => {
            console.log('Err_query_district: ', errors.push(e));
          });
    }
  };
  const queryKvartals = () => {
    // Получение списка pk кварталов по даче
    visible_btn_search_images_fd.value = false;
    visible_btn_search_images_kv.value = true;
    queryDataExios(
      `query-kvartals-numbers?district_pk=${selected_resource_id.value}`,
      'get'
    )
        .then(response => {
          visible_kv.value = true;
          kvartals.value = response.data[0];
        })
        .catch(e => {
          console.log('Error: ', errors.push(e))
        });
  };
  const queryContours = (e) => {
    // Получение контуров лесничеств
    let url;
    let split_url = e.split('|')[0];
    let split_url_ = e.split('|')[1];
    (split_url === 'f') ? (url = 'query-forestry-contours', visible_btn_search_images_f.value = true, visible_btn_search_images_fd.value = false, visible_btn_search_images_kv.value = false) :
      (split_url === 'fd') ? (url = 'query-district-forestry-contours', visible_btn_search_images_f.value = false, visible_btn_search_images_fd.value = true, visible_btn_search_images_kv.value = false) : url = 'query-district-contours';
    queryDataExios(
      `${url}?pk=${split_url_}`,
      'get'
    )
        .then(response => {
          if (response.data[0][0]['data'][0]['geometry'] !== null) {
            contours.value = response.data[0];
            text_contours.value = contours.value[0].data[0]['text'];
            emit('queryContours', contours.value)
          } else {
            msg.value = 'Кварталов не найдено';
            display_modal.value = true;
          }
        })
        .catch(e => {
          console.log('Error: ', errors.push(e))
        });
  };
  const searchSatelliteImages = (index) => {
    // Получение снимков лесничества
    loading.value[index] = true;
    setTimeout(() => loading.value[index] = false, 1000);
    console.log('text_contours', text_contours.value);
    queryDataExios(
      'query-satellite-images',
      'post',
      `${text_contours.value}`
    )
        .then(response => {
          if (response.data[0] !== null) {
            images.value = response.data;
            emit('searchSatelliteImages', images.value);
          } else {
            msg.value = 'Снимков не найдено';
            display_modal.value = true;
          }
        })
        .catch(e => {
          console.log('Error: ', errors.push(e))
        });
  };
  const closeModal = () => {
    display_modal.value = false;
  };
  queryDataExios(
    // Получение списка имен лесничеств
    'select-forestry',
    'get'
  )
      .then(response => {
        forestry.value = response.data[0];
      })
      .catch(e => {
        console.log('Error: ', errors.push(e))
      });


</script>

<style scoped>
  li {
    list-style-type: none;
  }
  label {
    margin-bottom: 0;
  }
  .tenantry-first-right-panel {
    height: 92%;
    background-color: white;
    position: absolute;
    top: 65px;
    z-index: 400;
    border-radius: 4px;
    right: 2px;
    overflow-y: auto;
    font-size: 15px;
  }
  option, select {
    font-size: 16px;
  }
  .btn-tablet {
    height: 35px;
    width: 35px;
    border-radius: 4px;
    border: 1px solid #32CD32;
    cursor: pointer;
    margin: 2px 1px 0 1px;
  }
  .btn-tablet:hover {
    border: 3px solid #32CD32;
  }
  .item-text {
    cursor: pointer;
  }
  .settings-btn-tablet {
    background: url('../../../../static/images/settings.png') no-repeat center;
    background-size: 70%;
  }
  .forestry-btn-table {
    background: url('../../../../static/images/tree.png') no-repeat center;
    background-size: 70%;
  }
  .items-resources {
    margin: 9px 0 0 5px;
    width: 88%;
  }
  .item-resource {
    margin: 0 0 0 5px;
  }
  .block-resource {
    display: flex;
  }
  .form-check-input {
    margin-top: 0.2rem;
    margin-left: -1.5rem;
  }
  .item__resource {
    margin: 5px 0 0 -4px;
  }
  .icon-tablet-kv {
    height: 26px;
    width: 7%;
    text-align: center;
  }
  .icon-tablet-kv:focus {
    background-color: #38aa38;
  }
  .resource-enter, .resource-leave-active {
    transition: opacity .8s;
  }
  .resource-enter-active, .resource-leave-to {
    opacity: 0;
  }
  .forestry_resource-enter, .forestry_resource-leave-active {
    transition: opacity .8s;
  }
  .forestry_resource-enter-active, .forestry_resource-leave-to {
    opacity: 0;
  }
  .layers-enter, .layers-leave-active {
    transition: opacity .8s;
  }
  .layers-enter-active, .layers-leave-to {
    opacity: 0;
  }
  .satellites-enter, .satellites-leave-active {
    transition: opacity .8s;
  }
  .satellites-enter-active, .satellites-leave-to {
    opacity: 0;
  }
  .btn-search-images {
    background: #28a745;
  }
  .btn-search-images:hover {
    background: #38aa38;
  }
</style>