<script setup>
import { computed } from 'vue'
import { mockHistory } from '../data/mockHistory'

const pasos = [
  { id: 0, label: 'Recibida' },
  { id: 1, label: 'En proceso' },
  { id: 2, label: 'En terreno' },
  { id: 3, label: 'Resuelta' },
]

const historial = computed(() =>
  [...mockHistory].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
)
</script>

<template>
  <div class="page historial">
    <header class="historial-header">
      <h1>Historial</h1>
    </header>

    <div v-if="historial.length === 0" class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
      <p>Aún no tienes denuncias registradas.</p>
    </div>

    <div v-else class="alerts-list">
      <article
        v-for="item in historial"
        :key="item.id"
        class="alert-card"
      >
        <div class="alert-head">
          <span class="alert-tipo" :style="{ color: item.color }">{{ item.tipo }}</span>
          <span class="alert-fecha">{{ item.fechaLabel }}</span>
        </div>

        <div class="timeline">
          <div
            v-for="(paso, index) in pasos"
            :key="paso.id"
            class="paso"
          >
            <div class="paso-indicador">
              <div
                class="paso-circulo"
                :class="{ 'paso-activo': item.pasoActual >= index }"
              ></div>
              <div
                v-if="index < pasos.length - 1"
                class="paso-linea"
                :class="{ 'paso-activo': item.pasoActual > index }"
              ></div>
            </div>
            <span
              class="paso-label"
              :class="{ 'paso-activo': item.pasoActual >= index }"
            >{{ paso.label }}</span>
          </div>
        </div>
      </article>
    </div>

  </div>
</template>

<style scoped>
.historial {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  padding-bottom: 0;
  position: relative;
}

.historial-header {
  padding-bottom: 16px;
}

.historial-header h1 {
  margin: 0;
}

.alerts-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 88px;
  -webkit-overflow-scrolling: touch;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--on-surface-muted);
  padding-bottom: 88px;
}

.empty-state svg {
  width: 64px;
  height: 64px;
  opacity: 0.4;
}

.empty-state p {
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  max-width: 220px;
}

.alert-card {
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.alert-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.alert-tipo {
  font-size: 18px;
  font-weight: 800;
}

.alert-fecha {
  font-size: 13px;
  color: var(--on-surface-muted);
  font-weight: 600;
}

.timeline {
  display: flex;
  justify-content: space-between;
  gap: 4px;
}

.paso {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.paso-indicador {
  display: flex;
  align-items: center;
  width: 100%;
}

.paso-circulo {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #d0d0d0;
  flex-shrink: 0;
  transition: background 0.3s ease;
}

.paso-circulo.paso-activo {
  background: var(--primary);
}

.paso-linea {
  flex: 1;
  height: 3px;
  background: #d0d0d0;
  border-radius: 2px;
  transition: background 0.3s ease;
}

.paso-linea.paso-activo {
  background: var(--primary);
}

.paso-label {
  font-size: 11px;
  font-weight: 700;
  color: #b0b0b0;
  text-align: center;
  line-height: 1.2;
  transition: color 0.3s ease;
}

.paso-label.paso-activo {
  color: var(--primary);
}

</style>
