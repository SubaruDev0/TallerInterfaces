<script setup>
import { ref } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  titulo: {
    type: String,
    required: true
  },
  icono: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#6b6b6b'
  },
  gif_lsch: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['select'])

// Estado para controlar la reproducción del "GIF"
const isActive = ref(false)

const handleInteraction = (state) => {
  isActive.value = state
}

const handleClick = () => {
  emit('select', props.id)
}
</script>

<template>
  <button
    class="triage-card"
    :style="{ '--card-color': color }"
    @click="handleClick"
    @pointerenter="handleInteraction(true)"
    @pointerleave="handleInteraction(false)"
    @focus="handleInteraction(true)"
    @blur="handleInteraction(false)"
    :aria-label="`Seleccionar emergencia: ${titulo}`"
  >
    <div class="card-inner">
      <div class="icon-container">
        <!-- SVGs con stroke="currentColor" para flexibilidad de color y contraste -->
        <svg v-if="icono === 'shield'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3a12 12 0 0 0 8.5 3A12 12 0 0 1 12 21 12 12 0 0 1 3.5 6 12 12 0 0 0 12 3z" />
        </svg>
        <svg v-else-if="icono === 'lock'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <circle cx="12" cy="16" r="1" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
        <svg v-else-if="icono === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v12M6 12h12" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="8" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="16" r="1.5" />
        </svg>
      </div>
      
      <span class="card-label">{{ titulo }}</span>

      <!-- El GIF se reproduce solo al interactuar (hover/focus) -->
      <div v-if="isActive && gif_lsch" class="gif-overlay">
        <img :src="gif_lsch" :alt="`Seña LSCh de ${titulo}`" />
      </div>
      <!-- Indicador visual de estado activo si no hay GIF disponible -->
      <div v-else-if="isActive" class="active-indicator" />
    </div>
  </button>
</template>

<style scoped>
.triage-card {
  /* Área táctil mínima de 88x88px (WCAG) */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 110px;
  min-width: 88px;
  width: 100%;
  padding: 16px;
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s ease-out;
  position: relative;
  overflow: hidden;
  outline: none;
}

.triage-card:hover,
.triage-card:focus {
  border-color: var(--card-color);
  background-color: var(--surface);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

.triage-card:active {
  transform: scale(0.95);
  transition: transform 0.1s ease;
}

.card-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  pointer-events: none;
}

.icon-container svg {
  width: 40px;
  height: 40px;
  color: var(--card-color);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.triage-card:hover .icon-container svg,
.triage-card:focus .icon-container svg {
  transform: scale(1.1) rotate(2deg);
}

.card-label {
  font-size: 16px;
  font-weight: 800;
  color: var(--on-surface);
  letter-spacing: -0.3px;
}

.active-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--card-color);
  animation: pulse 1s ease-in-out infinite;
}

.gif-overlay {
  position: absolute;
  inset: 0;
  background: var(--surface);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.gif-overlay img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.6); opacity: 0.4; }
}
</style>
