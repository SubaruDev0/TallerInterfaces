<script setup>
const props = defineProps({
  id: { type: [String, Number], required: true },
  titulo: { type: String, required: true },
  icono: { type: String, required: true },
  color: { type: String, default: '#6b6b6b' },
  gif_lsch: { type: String, default: '' }
})

defineEmits(['select'])
</script>

<template>
  <div class="triage-card" @click="$emit('select', id)">
    <div class="card-static-body">
      <div class="icon-frame-holder">
        <!-- Violencia Intrafamiliar: corazón roto -->
        <svg v-if="icono === 'family'" viewBox="0 0 512 512" fill="currentColor" stroke="none">
          <path d="M119.4 44.1c23.3-3.9 46.8-1.9 68.6 5.3l49.8 77.5-75.4 75.4c-1.5 1.5-2.4 3.6-2.3 5.8s1 4.2 2.6 5.7l112 104c2.9 2.7 7.4 2.9 10.5 .3s3.8-7 1.7-10.4l-60.4-98.1 90.7-75.6c2.6-2.1 3.5-5.7 2.4-8.8L296.8 61.8c28.5-16.7 62.4-23.2 95.7-17.6C461.5 55.6 512 115.2 512 185.1l0 5.8c0 41.5-17.2 81.2-47.6 109.5L283.7 469.1c-7.5 7-17.4 10.9-27.7 10.9s-20.2-3.9-27.7-10.9L47.6 300.4C17.2 272.1 0 232.4 0 190.9l0-5.8c0-69.9 50.5-129.5 119.4-141z" />
        </svg>
        <!-- Robo / Hurto: personas robando -->
        <svg v-else-if="icono === 'robber'" viewBox="0 0 576 512" fill="currentColor" stroke="none">
          <path d="M488.2 59.1C478.1 99.6 441.7 128 400 128s-78.1-28.4-88.2-68.9L303 24.2C298.8 7.1 281.4-3.3 264.2 1S236.7 22.6 241 39.8l8.7 34.9c11 44 40.2 79.6 78.3 99.6L328 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 16 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-305.7c38.1-20 67.3-55.6 78.3-99.6L559 39.8c4.3-17.1-6.1-34.5-23.3-38.8S501.2 7.1 497 24.2l-8.7 34.9zM400 96a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM80 96A48 48 0 1 0 80 0a48 48 0 1 0 0 96zm-8 32c-35.3 0-64 28.7-64 64l0 96 0 .6L8 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 16 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-227.3 13 20.5c5.9 9.2 16.1 14.9 27 14.9l48 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-30.4 0-37.4-58.9C157.6 142 132.1 128 104.7 128L72 128z" />
        </svg>
        <!-- Accidente Tránsito: carretera con advertencia -->
        <svg v-else-if="icono === 'crash'" viewBox="0 0 640 512" fill="currentColor" stroke="none">
          <path d="M213.2 32L288 32l0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 74.8 0c27.1 0 51.3 17.1 60.3 42.6l42.7 120.6c-10.9-2.1-22.2-3.2-33.8-3.2c-59.5 0-112.1 29.6-144 74.8l0-42.8c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32c2.3 0 4.6-.3 6.8-.7c-4.5 15.5-6.8 31.8-6.8 48.7c0 5.4 .2 10.7 .7 16l-.7 0c-17.7 0-32 14.3-32 32l0 64L86.6 480C56.5 480 32 455.5 32 425.4c0-6.2 1.1-12.4 3.1-18.2L152.9 74.6C162 49.1 186.1 32 213.2 32zM496 224a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm0 240a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm0-192c-8.8 0-16 7.2-16 16l0 80c0 8.8 7.2 16 16 16s16-7.2 16-16l0-80c0-8.8-7.2-16-16-16z" />
        </svg>
        <!-- Agresión / Pelea: dos puños enfrentados -->
        <svg v-else-if="icono === 'fight'" viewBox="0 0 112 64" fill="currentColor" stroke="none">
          <g transform="translate(2, 1) scale(0.12)">
            <path d="M192 0c17.7 0 32 14.3 32 32l0 112-64 0 0-112c0-17.7 14.3-32 32-32zM64 64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 80-64 0 0-80zm192 0c0-17.7 14.3-32 32-32s32 14.3 32 32l0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-96zm96 64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64zm-96 88l0-.6c9.4 5.4 20.3 8.6 32 8.6c13.2 0 25.4-4 35.6-10.8c8.7 24.9 32.5 42.8 60.4 42.8c11.7 0 22.6-3.1 32-8.6l0 8.6c0 52.3-25.1 98.8-64 128l0 96c0 17.7-14.3 32-32 32l-160 0c-17.7 0-32-14.3-32-32l0-78.4c-17.3-7.9-33.2-18.8-46.9-32.5L69.5 357.5C45.5 333.5 32 300.9 32 267l0-27c0-35.3 28.7-64 64-64l88 0c22.1 0 40 17.9 40 40s-17.9 40-40 40l-56 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l56 0c39.8 0 72-32.2 72-72z" />
          </g>
          <g transform="translate(110, 1) scale(-0.12, 0.12)">
            <path d="M192 0c17.7 0 32 14.3 32 32l0 112-64 0 0-112c0-17.7 14.3-32 32-32zM64 64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 80-64 0 0-80zm192 0c0-17.7 14.3-32 32-32s32 14.3 32 32l0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-96zm96 64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64zm-96 88l0-.6c9.4 5.4 20.3 8.6 32 8.6c13.2 0 25.4-4 35.6-10.8c8.7 24.9 32.5 42.8 60.4 42.8c11.7 0 22.6-3.1 32-8.6l0 8.6c0 52.3-25.1 98.8-64 128l0 96c0 17.7-14.3 32-32 32l-160 0c-17.7 0-32-14.3-32-32l0-78.4c-17.3-7.9-33.2-18.8-46.9-32.5L69.5 357.5C45.5 333.5 32 300.9 32 267l0-27c0-35.3 28.7-64 64-64l88 0c22.1 0 40 17.9 40 40s-17.9 40-40 40l-56 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l56 0c39.8 0 72-32.2 72-72z" />
          </g>
        </svg>
        <!-- Pérdida de Celular: smartphone -->
        <svg v-else-if="icono === 'phone'" viewBox="0 0 384 512" fill="currentColor" stroke="none">
          <path d="M16 64C16 28.7 44.7 0 80 0L304 0c35.3 0 64 28.7 64 64l0 384c0 35.3-28.7 64-64 64L80 512c-35.3 0-64-28.7-64-64L16 64zM224 448a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM304 64L80 64l0 320 224 0 0-320z" />
        </svg>
        <!-- Incendio / Catástrofe: casa en llamas -->
        <svg v-else-if="icono === 'fire'" viewBox="0 0 640 512" fill="currentColor" stroke="none">
          <path d="M288 350.1l0 1.9-32 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L447.3 128.1c-12.3-1-25 3-34.8 11.7c-35.4 31.6-65.6 67.7-87.3 102.8C304.3 276.5 288 314.9 288 350.1zM480 512c-88.4 0-160-71.6-160-160c0-76.7 62.5-144.7 107.2-179.4c5-3.9 10.9-5.8 16.8-5.8c7.9-.1 16 3.1 22 9.2l46 46 11.3-11.3c11.7-11.7 30.6-12.7 42.3-1C624.5 268 640 320.2 640 352c0 88.4-71.6 160-160 160zm64-111.8c0-36.5-37-73-54.8-88.4c-5.4-4.7-13.1-4.7-18.5 0C453 327.1 416 363.6 416 400.2c0 35.3 28.7 64 64 64s64-28.7 64-64z" />
        </svg>
        <!-- Fallback: interrogación -->
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <circle cx="12" cy="17" r="0.5" fill="currentColor" />
        </svg>
      </div>
      <span class="triage-card-title-text">{{ titulo }}</span>
    </div>

    <div v-if="gif_lsch" class="lsch-gif-hover-overlay">
      <img :src="gif_lsch" :alt="'Seña LSCH ' + titulo" />
    </div>
  </div>
</template>

<style scoped>
.triage-card {
  position: relative !important;
  width: 100% !important;
  height: 148px !important;
  background-color: #ffffff !important;
  border: 2px solid #D1DDD7 !important;
  border-radius: 12px !important;
  box-sizing: border-box !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 8px !important;
  cursor: pointer !important;
  overflow: hidden !important;
  transition: border-color 0.2s ease, background-color 0.2s ease !important;
}

.card-static-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.icon-frame-holder svg,
.icon-frame-holder i,
.icon-frame-holder .triage-card-icon {
  width: 64px !important;
  height: 64px !important;
  color: #006F3E !important;
  margin-bottom: 4px !important;
  display: block !important;
}

.triage-card-title-text {
  font-size: 13px !important;
  font-weight: 700 !important;
  color: #0A1410 !important;
  line-height: 1.3 !important;
  text-align: center;
}

.lsch-gif-hover-overlay {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background-color: #ffffff !important;
  z-index: 20 !important;
  opacity: 0 !important;
  visibility: hidden !important;
  transition: opacity 0.2s ease, visibility 0.2s ease !important;
}

.lsch-gif-hover-overlay img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
}

.triage-card:hover .lsch-gif-hover-overlay,
.triage-card:active .lsch-gif-hover-overlay {
  opacity: 1 !important;
  visibility: visible !important;
}

.triage-card:hover,
.triage-card:active {
  border-color: #006F3E !important;
  background-color: #F4F7F5 !important;
}
</style>
