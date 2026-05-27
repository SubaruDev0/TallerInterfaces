<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCasosStore } from '../stores/casosStore'
import { useAlertStore } from '../stores/alertStore'
import { preguntasTerrenoCarabineros } from '../data/preguntasTerrenoCarabineros'

const router = useRouter()
const casosStore = useCasosStore()
const alertStore = useAlertStore()

onMounted(() => {
  if (!alertStore.perfil.rut) {
    try {
      const data = JSON.parse(localStorage.getItem('perfil') || '{}')
      if (data.rut) {
        alertStore.actualizarPerfil(data)
      }
    } catch {}
  }
})

const pasos = [
  { id: 0, label: 'Recibida' },
  { id: 1, label: 'En proceso' },
  { id: 2, label: 'En terreno' },
  { id: 3, label: 'Resuelta' },
]

const misCasos = computed(() => {
  const rut = alertStore.perfil.rut
  if (!rut) return []
  return casosStore.getCasosPorRut(rut).sort(
    (a, b) => new Date(b.creadoEn) - new Date(a.creadoEn)
  )
})

function pasoActual(estado) {
  if (estado === 'recibida') return 0
  if (estado === 'aceptada' || estado === 'asignada') return 1
  if (estado === 'en_terreno') return 2
  if (estado === 'completada') return 3
  return 0
}

// Lógica de respuesta a preguntas en terreno (Wizard)
const respondiendoCasoId = ref(null)
const responderPasoActual = ref(0)
const respuestasBorrador = ref({})

const casoRespondiendo = computed(() =>
  respondiendoCasoId.value ? casosStore.getCasoPorId(respondiendoCasoId.value) : null
)

const colorEmergencia = computed(() =>
  casoRespondiendo.value?.emergencia?.color || '#a62100'
)

const preguntasPendientesObjetos = computed(() => {
  if (!respondiendoCasoId.value) return []
  const caso = casosStore.getCasoPorId(respondiendoCasoId.value)
  if (!caso || !caso.preguntasTerrenoPendientes.length) return []

  return caso.preguntasTerrenoPendientes.map(id => {
    return preguntasTerrenoCarabineros.find(p => p.id === id)
  }).filter(Boolean)
})

const preguntaActualObj = computed(() => {
  return preguntasPendientesObjetos.value[responderPasoActual.value] || null
})

function iniciarResponder(casoId) {
  respondiendoCasoId.value = casoId
  responderPasoActual.value = 0
  respuestasBorrador.value = {}
}

function responderOpcion(opcion) {
  const pId = preguntaActualObj.value.id
  respuestasBorrador.value[pId] = opcion

  if (responderPasoActual.value < preguntasPendientesObjetos.value.length - 1) {
    responderPasoActual.value++
  } else {
    // Terminar
    casosStore.responderPreguntasTerreno(respondiendoCasoId.value, respuestasBorrador.value)
    respondiendoCasoId.value = null
  }
}
</script>

<template>
  <div class="page historial mobile-history-container">
    <header class="history-top-header">
      <button class="back-arrow-btn" @click="router.push('/victim')" aria-label="Volver">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>
      <h1>Historial</h1>
      <img
        class="escudo-carabineros"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Roundel_of_Carabineros_de_Chile.svg/250px-Roundel_of_Carabineros_de_Chile.svg.png"
        alt="Carabineros de Chile"
      />
    </header>

    <main class="history-scrollable-content">
      <div v-if="misCasos.length === 0" class="empty-history-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <p>No tienes alertas registradas</p>
      </div>

      <div v-else class="history-list-grid">
        <article v-for="item in misCasos" :key="item.id" class="history-item-card">
          <div class="item-header">
            <span class="item-badge">{{ item.emergencia?.titulo || 'Emergencia' }}</span>
            <span class="item-date">{{ new Date(item.creadoEn).toLocaleString('es-CL', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' }) }}</span>
          </div>

          <div class="timeline">
            <div v-for="(paso, index) in pasos" :key="paso.id" class="timeline-paso">
              <div
                class="paso-circulo"
                :class="{
                  'paso-completado': pasoActual(item.estado) > index || (pasoActual(item.estado) === index && item.estado === 'completada'),
                  'paso-actual': pasoActual(item.estado) === index && item.estado !== 'completada'
                }"
              >
                <svg v-if="pasoActual(item.estado) > index || (pasoActual(item.estado) === index && item.estado === 'completada')" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span
                class="paso-label"
                :class="{ 'paso-activo': pasoActual(item.estado) >= index }"
              >{{ paso.label }}</span>
            </div>
          </div>

          <div v-if="item.estado === 'asignada' || item.estado === 'en_terreno'" class="alert-carab">
            Carabineros asignados: <strong>{{ item.asignados?.join(', ') || '—' }}</strong>
          </div>

          <div v-if="item.preguntasTerrenoPendientes?.length" class="banner-preguntas">
            <div class="banner-info">
              <span class="banner-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </span>
              <div class="banner-text">
                <strong>El carabinero necesita más información</strong>
                <span>Te ha enviado {{ item.preguntasTerrenoPendientes.length }} pregunta(s)</span>
              </div>
            </div>
            <button class="btn-responder-banner" @click="iniciarResponder(item.id)">
              Responder
            </button>
          </div>
        </article>
      </div>
    </main>

    <div v-if="respondiendoCasoId && preguntaActualObj" class="wiz-full" :style="{ '--c': colorEmergencia }">
      <header class="wiz-head">
        <button class="wiz-back" @click="respondiendoCasoId = null" aria-label="Volver">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        <span class="wiz-count">Pregunta {{ responderPasoActual + 1 }}/{{ preguntasPendientesObjetos.length }}</span>
        <div class="wiz-dots">
          <div
            v-for="i in preguntasPendientesObjetos.length"
            :key="i"
            class="wiz-dot"
            :class="{
              done: i - 1 < responderPasoActual,
              now: i - 1 === responderPasoActual
            }"
          ></div>
        </div>
      </header>

      <div class="wiz-body">
        <div class="wiz-gif">
          <img :src="preguntaActualObj.gif_lsch" alt="LSCh" />
        </div>
        <p class="wiz-text">{{ preguntaActualObj.pregunta_texto }}</p>
        <div class="wiz-ops">
          <button
            v-for="op in preguntaActualObj.opciones"
            :key="op"
            class="wiz-btn"
            @click="responderOpcion(op)"
          >
            <div class="wiz-btn-gif">
              <img :src="preguntaActualObj.gif_lsch" :alt="op" />
            </div>
            <span class="wiz-btn-lbl">{{ op }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mobile-history-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: var(--surface-2);
}
.history-top-header {
  height: 64px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  flex-shrink: 0;
}
.history-top-header h1 {
  margin: 0;
  font-size: 19px;
  font-weight: 900;
  color: var(--on-surface);
}
.back-arrow-btn {
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.back-arrow-btn svg {
  width: 24px;
  height: 24px;
}
.escudo-carabineros {
  height: 32px;
  width: auto;
  display: block;
}
.history-scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 16px;
}
.empty-history-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--on-surface-muted);
}
.empty-history-badge svg {
  width: 56px;
  height: 56px;
  margin-bottom: 16px;
  opacity: 0.6;
}
.empty-history-badge p {
  font-size: 14px;
  font-weight: 700;
  margin: 0;
}
.history-list-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 32px;
}
.history-item-card {
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  text-align: left;
}
.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.item-badge {
  font-size: 12px;
  font-weight: 800;
  background: rgba(0, 111, 62, 0.08);
  color: var(--primary);
  padding: 4px 8px;
  border-radius: 6px;
}
.item-date {
  font-size: 12px;
  color: var(--on-surface-muted);
}

/* Timeline (preservado) */
.timeline {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-bottom: 20px;
  padding: 0 10px;
}
.timeline::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 20px;
  right: 20px;
  height: 2px;
  background: var(--border);
  z-index: 0;
}
.timeline-paso {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.paso-circulo {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--surface-2);
  border: 2px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
}
.paso-completado {
  background: var(--success);
  border-color: var(--success);
  color: #fff;
}
.paso-completado svg {
  width: 12px;
  height: 12px;
}
.paso-actual {
  border-color: var(--primary);
  background: var(--surface);
  box-shadow: 0 0 0 3px rgba(166, 33, 0, 0.1);
}
.paso-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--on-surface-muted);
  text-align: center;
}
.paso-activo {
  color: var(--on-surface);
}
.alert-carab {
  font-size: 12px;
  color: var(--on-surface-muted);
  background: var(--surface-2);
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 12px;
}
.alert-carab strong {
  color: var(--on-surface);
}

/* Banner preguntas (preservado) */
.banner-preguntas {
  background: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}
.banner-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.banner-icon {
  color: #856404;
}
.banner-icon svg {
  width: 24px;
  height: 24px;
}
.banner-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.banner-text strong {
  font-size: 13px;
  color: #856404;
}
.banner-text span {
  font-size: 12px;
  color: #856404;
  opacity: 0.8;
  font-weight: 600;
}
.btn-responder-banner {
  background: #856404;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  text-align: center;
}

/* Wizard responder preguntas del carabinero (preservado) */
.wiz-full {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  background: #fafafa;
  height: 100dvh;
  max-width: 480px;
  margin: 0 auto;
}
.wiz-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: #fff;
  border-bottom: 2px solid #eee;
  flex-shrink: 0;
}
.wiz-back {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #222;
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.wiz-back svg { width: 18px; height: 18px; }
.wiz-count {
  font-size: 13px;
  font-weight: 800;
  color: var(--c, #a62100);
  white-space: nowrap;
  flex-shrink: 0;
}
.wiz-dots {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  justify-content: flex-end;
}
.wiz-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ddd;
  flex-shrink: 0;
  transition: all 0.2s ease;
}
.wiz-dot.done { background: var(--c, #a62100); opacity: 0.45; }
.wiz-dot.now { background: var(--c, #a62100); opacity: 1; transform: scale(1.3); box-shadow: 0 0 0 2px color-mix(in srgb, var(--c, #a62100) 18%, transparent); }
.wiz-body {
  flex: 1;
  overflow-y: auto;
  padding: 8px 14px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.wiz-gif {
  width: 100%;
  border-radius: 14px;
  overflow: hidden;
  background: #1a1a1a;
  box-shadow: 0 4px 16px rgba(0,0,0,0.05);
}
.wiz-gif img {
  width: 100%;
  display: block;
  max-height: 28vh;
  object-fit: contain;
}
.wiz-text {
  font-size: 17px;
  font-weight: 700;
  color: #222;
  text-align: center;
  margin: 0;
  line-height: 1.3;
}
.wiz-ops {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}
.wiz-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 0;
  border: none;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  transition: transform 0.1s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  overflow: hidden;
}
.wiz-btn:active { transform: scale(0.95); }
.wiz-btn-gif {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: #f0f0f0;
}
.wiz-btn-gif img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.wiz-btn-lbl {
  font-size: 13px;
  font-weight: 700;
  color: #222;
  padding: 0 4px 6px;
}
</style>
