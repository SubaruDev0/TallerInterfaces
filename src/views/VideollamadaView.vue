<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const interprete = route.query.nombre || 'Intérprete'
const silenciado = ref(false)

function colgar() {
  router.push({ name: 'policia' })
}
</script>

<template>
  <div class="page policia videollamada-container">
    <div class="video-main">
      <div class="video-local">
        <span class="video-label">Tú (Carabinero)</span>
      </div>
      <div class="video-remote">
        <div class="remote-avatar">{{ interprete.charAt(0) }}</div>
        <span class="remote-name">{{ interprete }}</span>
        <span class="remote-status">Conectando...</span>
      </div>
    </div>

    <div class="video-controls">
      <button class="btn-mute" :class="{ muted: silenciado }" @click="silenciado = !silenciado">
        <svg v-if="!silenciado" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 9v6h4l5 5V4L7 9H3z"/>
          <path d="M16 7.5c.68.88 1.07 1.99 1.07 3.25s-.39 2.37-1.07 3.25"/>
          <path d="M19 5c1.35 1.61 2.07 3.68 2.07 5.9s-.72 4.29-2.07 5.9"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 9v6h4l5 5V4L7 9H3z"/>
          <line x1="23" y1="1" x2="1" y2="23" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <span class="btn-label">{{ silenciado ? 'Silenciado' : 'Silenciar' }}</span>
      </button>
      <button class="btn-colgar" @click="colgar">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-2 7.59l-1.59-1.59L7 13.41 10.59 17 18 9.59l-1.41-1.41L10.59 13.59z"/>
        </svg>
        Colgar
      </button>
    </div>
  </div>
</template>

<style scoped>
.videollamada-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1a1a1a;
  color: #fff;
}

.video-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  position: relative;
}

.video-remote {
  flex: 1;
  background: #2a2a2a;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.remote-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #006F3E;
  color: #fff;
  font-size: 32px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remote-name {
  font-size: 18px;
  font-weight: 800;
}

.remote-status {
  font-size: 13px;
  color: #999;
  font-weight: 600;
}

.video-local {
  height: 120px;
  width: 90px;
  background: #333;
  border-radius: 12px;
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 6px;
  border: 2px solid #006F3E;
}

.video-label {
  font-size: 9px;
  font-weight: 700;
  color: #fff;
}

.video-controls {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.btn-mute {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  border: none;
  border-radius: 30px;
  background: #333;
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
}

.btn-mute.muted {
  background: #f59e0b;
  color: #000;
}

.btn-mute svg {
  width: 20px;
  height: 20px;
}

.btn-mute:active {
  filter: brightness(0.8);
}

.btn-colgar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  border: none;
  border-radius: 30px;
  background: #EF4444;
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
}

.btn-colgar svg {
  width: 18px;
  height: 18px;
}

.btn-colgar:active {
  background: #DC2626;
}
</style>
