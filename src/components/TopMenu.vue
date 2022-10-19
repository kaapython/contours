<template>
  <div class="top-menu">

    <div class="logo-container">
      <a href="/" class="geoportal-logo">
        Филиал ФГБУ «Рослесинфорг» «Прибайкаллеспроект»</a>
    </div>

    <div style="width: calc(16%); margin: 3px 5px 0 0;">
      <form class="" action="/">
        <button type="submit" class="btn btn-tablet-form">
          Главная
        </button>
      </form>
    </div>

    <div style="width: calc(16%); margin: 3px 5px 0 0; display: none">
      <button type="submit" class="btn btn-tablet-form"
              @click="showReports">
        {{ reports_btn_text }}
      </button>
    </div>

    <div class="username-items" :title="username.name">
      <div
        class="username">{{ username.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {ref, defineEmits} from 'vue'
  import { username } from '@/hooks/query_username.js'

  const reports_btn_text = ref('Отчеты');
  const emit = defineEmits(['showReports']);

  const showReports = () => {
    emit('showReports');
    reports_btn_text.value === 'Отчеты' ? reports_btn_text.value = 'Закрыть отчеты' : reports_btn_text.value = 'Отчеты'
  };


</script>

<style scoped>
  .top-menu {
    display: flex;
    width: 100%;
    text-align: center;
    margin: 3px 0 3px 0;
  }

  .username-items {
    text-align: center;
    line-height: 50px;
    position: absolute;
    right: 5px;
    border: 1px solid #32CD32 !important;
    border-radius: 50px;
    cursor: pointer;
    padding: 0 5px 0 5px;
    margin: 3px 5px 0 0;
  }

  .username-items:hover {
    border: 1px solid #32CD32;
    color: #34495e;
    background-color: #A7FFA7;
  }

  .logo-container {
    margin: 0 10px 0 15px;
  }

  .btn-tablet-form {
    background-color: white;
  }
</style>