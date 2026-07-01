<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCasosStore } from '../stores/casosStore'
import { preguntasTerrenoCarabineros } from '../data/preguntasTerrenoCarabineros'

const router = useRouter()
const store = useCasosStore()

let refreshInterval = null

onMounted(() => {
  store.cargarCasos()
  refreshInterval = setInterval(() => {
    store.cargarCasos()
  }, 5000)
})

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval)
})

const casoSeleccionado = ref(null)

const selectorAbierto = ref(false)
const casoParaSelector = ref(null)
const preguntasSeleccionadas = ref([])

const videoModalAbierto = ref(false)
const interpretesDisponibles = [
  { nombre: 'Carlos Muñoz', idioma: 'LSCh', disponible: true },
  { nombre: 'María Soto', idioma: 'LSCh', disponible: false },
  { nombre: 'Jorge Rivas', idioma: 'LSCh', disponible: true },
  { nombre: 'Camila Valdés', idioma: 'LSCh', disponible: false },
]

function llamarInterprete(nombre) {
  videoModalAbierto.value = false
  router.push({ name: 'videollamada', query: { nombre } })
}

function abrirSelectorPreguntas(caso) {
  casoParaSelector.value = caso
  preguntasSeleccionadas.value = []
  selectorAbierto.value = true
}

function cerrarSelector() {
  selectorAbierto.value = false
  casoParaSelector.value = null
}

function togglePreguntaSel(id) {
  const idx = preguntasSeleccionadas.value.indexOf(id)
  if (idx === -1) {
    preguntasSeleccionadas.value.push(id)
  } else {
    preguntasSeleccionadas.value.splice(idx, 1)
  }
}

function abrirCaso(caso) {
  casoSeleccionado.value = caso
}

function cerrarCaso() {
  casoSeleccionado.value = null
}

function enviarPreguntas() {
  if (!casoParaSelector.value || preguntasSeleccionadas.value.length === 0) return
  store.enviarPreguntasTerreno(casoParaSelector.value.id, preguntasSeleccionadas.value)
  cerrarSelector()
}

const preguntasFiltradas = computed(() => {
  if (!casoParaSelector.value) return []
  const cat = casoParaSelector.value.emergencia?.titulo
  return preguntasTerrenoCarabineros.filter(p => p.categoria === 'todas' || p.categoria === cat)
})

function badgeColor(estado) {
  if (estado === 'asignada') return '#1565c0'
  if (estado === 'aceptada') return '#7b1fa2'
  if (estado === 'en_terreno') return '#f57c00'
  return '#2e7d32'
}
function badgeBg(estado) {
  if (estado === 'asignada') return '#e3f2fd'
  if (estado === 'aceptada') return '#f3e5f5'
  if (estado === 'en_terreno') return '#fff3e0'
  return '#e8f5e9'
}
function badgeLabel(estado) {
  if (estado === 'asignada') return 'Asignado'
  if (estado === 'aceptada') return 'Activo'
  if (estado === 'en_terreno') return 'En terreno'
  return 'Completado'
}
</script>

<template>
  <div class="page policia mobile-police-container">
    <header class="police-top-header">
      <div class="header-left-meta">
        <img
          class="escudo-carabineros"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Roundel_of_Carabineros_de_Chile.svg/250px-Roundel_of_Carabineros_de_Chile.svg.png"
          alt="Carabineros de Chile"
        />
      </div>
      <h1>Carabineros en Escena</h1>
      <div class="header-placeholder-right"></div>
    </header>

    <main class="police-scrollable-content">
      <!-- Casos activos -->
      <div v-if="store.casosAsignados.length" class="p-s">
      <h2 class="p-s-tit">Activos</h2>
      <div v-for="c in store.casosAsignados" :key="c.id" class="caso-card">
        <div class="caso-top">
          <span class="caso-emerg" :style="{ color: c.emergencia?.color }">
            {{ c.emergencia?.titulo || 'Emergencia' }}
          </span>
          <span
            class="caso-estado"
            :style="{ background: badgeBg(c.estado), color: badgeColor(c.estado) }"
          >
            {{ badgeLabel(c.estado) }}
          </span>
        </div>

        <div class="caso-body">
          <div class="caso-info">
            <span class="caso-label">Víctima</span>
            <span class="caso-valor">{{ c.victimNombre || '—' }}</span>
          </div>
          <div class="caso-info" v-if="c.contexto?.ubicacion">
            <span class="caso-label">Ubicación</span>
            <span class="caso-valor">{{ c.contexto.ubicacion }}</span>
          </div>
          <div class="caso-info" v-if="c.asignados?.length">
            <span class="caso-label">Asignados</span>
            <span class="caso-valor">{{ c.asignados.join(', ') }}</span>
          </div>
        </div>

        <div class="caso-ctx" v-if="Object.keys(c.contexto?.respuestas || {}).length">
          <span class="caso-label">Antecedentes:</span>
          <div v-for="(v, k) in c.contexto.respuestas" :key="k" class="caso-rta">
            <span class="caso-rta-k">{{ c.contexto.preguntas?.[k] || k }}</span>
            <span class="caso-rta-v">{{ v }}</span>
          </div>
        </div>

        <div class="caso-actions">
          <button class="btn-detalles" @click="abrirCaso(c)">Ver detalles</button>
          <button class="btn-terreno" @click="abrirSelectorPreguntas(c)">
            {{ c.estado === 'en_terreno' ? 'Preguntar en terreno' : 'Preguntar a distancia' }}
          </button>
          <button
            v-if="c.estado === 'asignada' || c.estado === 'aceptada'"
            class="btn-terreno btn-llegada"
            @click="store.marcarEnTerreno(c.id)"
          >
            Llegué al lugar
          </button>
          <button
            v-if="c.estado === 'en_terreno'"
            class="btn-cerrar-card"
            @click="store.completarCaso(c.id, { nota: 'Cerrado en terreno por carabinero.' })"
          >
            Cerrar caso
          </button>
        </div>
      </div>
    </div>

    <div v-else class="p-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3a12 12 0 0 0 8.5 3A12 12 0 0 1 12 21 12 12 0 0 1 3.5 6 12 12 0 0 0 12 3z" />
      </svg>
      <p>No tienes casos asignados</p>
    </div>

    <!-- Casos completados -->
    <div v-if="store.casosCompletados.length" class="p-s">
      <h2 class="p-s-tit">Completados</h2>
      <div v-for="c in store.casosCompletados" :key="c.id" class="caso-card completado">
        <div class="caso-top">
          <span class="caso-emerg" :style="{ color: c.emergencia?.color }">
            {{ c.emergencia?.titulo || 'Emergencia' }}
          </span>
          <span class="caso-estado" :style="{ background: badgeBg(c.estado), color: badgeColor(c.estado) }">
            {{ badgeLabel(c.estado) }}
          </span>
        </div>
        <div class="caso-body">
          <div class="caso-info">
            <span class="caso-label">Víctima</span>
            <span class="caso-valor">{{ c.victimNombre || '—' }}</span>
          </div>
          <div class="caso-info">
            <span class="caso-label">Fecha</span>
            <span class="caso-valor">{{ new Date(c.actualizadoEn).toLocaleString('es-CL', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' }) }}</span>
          </div>
        </div>
      </div>
    </div>
    </main>

    <!-- Modal Selector de Preguntas -->
    <div v-if="selectorAbierto && casoParaSelector" class="selector-mask" @click.self="cerrarSelector">
      <div class="selector-modal">
        <div class="selector-head">
          <h2>Seleccionar preguntas</h2>
          <button class="selector-cerrar" @click="cerrarSelector">×</button>
        </div>

        <p class="selector-sub">Elige las preguntas que quieres enviar a la víctima:</p>

        <div class="selector-lista">
          <label
            v-for="p in preguntasFiltradas"
            :key="p.id"
            class="selector-item"
            :class="{ active: preguntasSeleccionadas.includes(p.id) }"
          >
            <input
              type="checkbox"
              :checked="preguntasSeleccionadas.includes(p.id)"
              @change="togglePreguntaSel(p.id)"
            />
            <span class="selector-txt">{{ p.pregunta_texto }}</span>
          </label>
        </div>

        <div class="selector-footer">
          <button class="selector-enviar" :disabled="preguntasSeleccionadas.length === 0" @click="enviarPreguntas">
            Enviar ({{ preguntasSeleccionadas.length }})
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Detalle del Caso -->
    <div v-if="casoSeleccionado" class="detalle-mask" @click.self="cerrarCaso">
      <div class="detalle">
        <div class="detalle-head-sticky">
          <div class="detalle-head">
            <h2>Detalle del caso</h2>
            <button class="detalle-cerrar" @click="cerrarCaso">×</button>
          </div>
        </div>
        <div class="detalle-body">
          <div>
            <span class="d-label">Víctima</span>
            <div class="d-value">{{ casoSeleccionado.victimNombre || '—' }}</div>
            <div class="d-sub">RUT: {{ casoSeleccionado.victimRut || '—' }}</div>
          </div>
          <div>
            <span class="d-label">Teléfono</span>
            <div class="d-value">{{ casoSeleccionado.victimTelefono || '—' }}</div>
          </div>
          <div>
            <span class="d-label">Ubicación</span>
            <div class="d-value">{{ casoSeleccionado.contexto?.ubicacion || '—' }}</div>
          </div>
          <div>
            <span class="d-label">Contacto de emergencia</span>
            <div class="d-value">{{ casoSeleccionado.victimContactoNombre || '—' }}</div>
            <div class="d-sub">{{ casoSeleccionado.victimContactoTelefono || '—' }}</div>
          </div>
          <div v-if="casoSeleccionado.serviciosExternos?.length">
            <span class="d-label">Servicios contactados</span>
            <div v-for="s in casoSeleccionado.serviciosExternos.filter(s => s.contactado)" :key="s.servicio" class="d-value d-small">
              {{ s.servicio }}
            </div>
            <div v-if="!casoSeleccionado.serviciosExternos.some(s => s.contactado)" class="d-sub">
              Ninguno
            </div>
          </div>

          <!-- Nota del operador -->
          <div v-if="casoSeleccionado.notaOperador" class="detalle-nota-op">
            <span class="d-label">Nota de central</span>
            <div class="d-value d-small nota-texto">{{ casoSeleccionado.notaOperador }}</div>
          </div>

          <div class="detalle-ctx">
          <span class="d-label">Contexto</span>
          <div v-for="(v, k) in casoSeleccionado.contexto?.respuestas || {}" :key="k" class="d-row">
            <span class="d-key">{{ casoSeleccionado.contexto?.preguntas?.[k] || k }}</span>
            <span class="d-val">{{ v }}</span>
          </div>
        </div>

        <div v-if="Object.keys(casoSeleccionado.respuestasTerreno || {}).length" class="detalle-terreno">
          <span class="d-label">Respuestas recibidas en terreno</span>
          <div v-for="(v, k) in casoSeleccionado.respuestasTerreno" :key="k" class="d-row">
            <span class="d-key">{{ preguntasTerrenoCarabineros.find(p => p.id === Number(k))?.pregunta_texto || k }}</span>
            <span class="d-val">{{ v }}</span>
          </div>
        </div>
        </div>
      </div>
    </div>

    <button class="btn-videollamada" @click="videoModalAbierto = true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    </button>

    <!-- Modal intérpretes -->
    <div v-if="videoModalAbierto" class="video-modal-mask" @click.self="videoModalAbierto = false">
      <div class="video-modal">
        <div class="video-modal-head">
          <span class="video-modal-icon"></span>
          <h2>Video intérprete disponible</h2>
          <button class="video-modal-cerrar" @click="videoModalAbierto = false">×</button>
        </div>
        <p class="video-modal-sub">Selecciona un intérprete para iniciar la videollamada:</p>
        <div class="video-modal-lista">
          <button
            v-for="interprete in interpretesDisponibles"
            :key="interprete.nombre"
            class="video-modal-item"
            :class="{ 'no-disponible': !interprete.disponible }"
            :disabled="!interprete.disponible"
            @click="interprete.disponible && llamarInterprete(interprete.nombre)"
          >
            <span class="video-modal-avatar">{{ interprete.nombre.charAt(0) }}</span>
            <div class="video-modal-info">
              <span class="video-modal-nombre">{{ interprete.nombre }}</span>
              <span class="video-modal-idioma">{{ interprete.idioma }}</span>
            </div>
            <span class="video-modal-llamar" :class="{ 'no-disponible-label': !interprete.disponible }">
              {{ interprete.disponible ? 'Llamar' : 'No disponible' }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mobile-police-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #F4F7F5;
  font-family: 'Roboto', sans-serif;
  position: relative;
  overflow: hidden;
}

.police-top-header {
  height: 64px;
  background-color: #006F3E;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  flex-shrink: 0;
  color: #ffffff;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.police-top-header h1 {
  margin: 0;
  font-size: 16px;
  font-weight: 900;
  text-align: center;
}

.badge-patrulla {
  font-size: 10px;
  font-weight: 900;
  background: rgba(255, 255, 255, 0.15);
  padding: 4px 8px;
  border-radius: 6px;
  text-transform: uppercase;
}

.escudo-carabineros {
  height: 32px;
  width: auto;
  display: block;
}

.header-placeholder-right {
  width: 70px;
}

.police-scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px;
  box-sizing: border-box;
}

.p-s {
  margin-bottom: 20px;
}

.p-s-tit {
  font-size: 12px;
  font-weight: 800;
  color: #5A6E65;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 0 0 10px;
}

.p-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 20px;
  color: #5A6E65;
  font-size: 15px;
  font-weight: 600;
}

.p-empty svg { width: 48px; height: 48px; }

.caso-card {
  background: #ffffff;
  border: 1px solid #D1DDD7;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 14px;
  text-align: left;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.completado {
  opacity: 0.75;
}

.caso-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.caso-emerg {
  font-size: 15px;
  font-weight: 800;
  color: #0A1410;
}

.caso-estado {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 10px;
}

.caso-body {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-bottom: 8px;
}

.caso-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.caso-label {
  font-size: 10px;
  font-weight: 700;
  color: #5A6E65;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.caso-valor {
  font-size: 14px;
  font-weight: 700;
  color: #0A1410;
}

.caso-ctx {
  padding: 8px 0;
  border-top: 1px solid #D1DDD7;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.caso-rta {
  display: flex;
  gap: 6px;
  font-size: 13px;
}

.caso-rta-k {
  font-weight: 700;
  color: #5A6E65;
  min-width: 36px;
}

.caso-rta-v {
  font-weight: 600;
  color: #0A1410;
}

.caso-actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.btn-detalles {
  flex: 1;
  padding: 12px;
  border: 2px solid #D1DDD7;
  border-radius: 12px;
  background: #fff;
  font-size: 14px;
  font-weight: 700;
  color: #0A1410;
  cursor: pointer;
}

.btn-terreno {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: #006F3E;
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}

.btn-terreno:active { background: #004D2B; }

.btn-cerrar-card {
  width: 100%;
  padding: 11px;
  border: 2px solid #dc2626;
  border-radius: 12px;
  background: #fff;
  color: #dc2626;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  margin-top: 8px;
}

.btn-cerrar-card:active {
  background: #dc2626;
  color: #fff;
}

.detalle-mask {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
}

.detalle {
  width: 100%;
  max-width: 520px;
  background: #fff;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -10px 24px rgba(0,0,0,0.15);
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}

.detalle-head-sticky {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 2;
  border-radius: 16px 16px 0 0;
}

.detalle-body {
  padding: 0 16px 16px;
  overflow-y: auto;
  flex: 1;
}

.detalle-nota-op {
  margin-top: 16px;
  padding: 12px;
  background: #fff8e1;
  border-radius: 12px;
  border: 1px solid #ffe082;
}

.nota-texto {
  font-size: 13px !important;
  color: #6d4c00 !important;
  font-weight: 700 !important;
  margin-top: 4px;
  white-space: pre-wrap;
}

.detalle-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 16px 10px;
}

.detalle-head h2 {
  font-size: 18px;
  font-weight: 800;
  margin: 0;
  color: #0A1410;
}

.detalle-cerrar {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: #f1f1f1;
  font-size: 20px;
  cursor: pointer;
}

.d-label {
  font-size: 10px;
  font-weight: 800;
  color: #5A6E65;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.d-value {
  font-size: 14px;
  font-weight: 800;
  color: #0A1410;
}

.d-sub {
  font-size: 12px;
  color: #5A6E65;
  font-weight: 600;
}

.d-small {
  font-size: 12px;
  font-weight: 700;
}

.detalle-ctx {
  margin-top: 16px;
  border-top: 2px solid #006F3E;
  padding-top: 12px;
}

.detalle-terreno {
  margin-top: 16px;
  border-top: 1px solid #D1DDD7;
  padding-top: 12px;
}

.d-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid #D1DDD7;
}

.d-key {
  font-size: 12px;
  font-weight: 700;
  color: #5A6E65;
}

.d-val {
  font-size: 12px;
  font-weight: 700;
  color: #0A1410;
}

.selector-mask {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.selector-modal {
  width: 100%;
  max-width: 600px;
  max-height: 85vh;
  background: #fff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.selector-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0;
  flex-shrink: 0;
}

.selector-head h2 {
  font-size: 20px;
  font-weight: 800;
  margin: 0;
  color: #0A1410;
}

.selector-cerrar {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: #f1f1f1;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.selector-sub {
  font-size: 14px;
  color: #5A6E65;
  margin: 8px 20px 12px;
  padding: 0;
}

.selector-lista {
  padding: 0 20px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.selector-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1.5px solid #D1DDD7;
  border-radius: 12px;
  cursor: pointer;
}

.selector-item.active {
  border-color: #006F3E;
  background: rgba(0, 111, 62, 0.05);
}

.selector-item input {
  accent-color: #006F3E;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.selector-txt {
  font-size: 15px;
  font-weight: 600;
  color: #0A1410;
  line-height: 1.3;
}

.selector-footer {
  padding: 16px 20px;
  border-top: 1px solid #D1DDD7;
  flex-shrink: 0;
}

.selector-enviar {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: #006F3E;
  color: #fff;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
}

.selector-enviar:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.selector-enviar:active:not(:disabled) {
  background: #004D2B;
}

.btn-videollamada {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  border: none;
  border-radius: 50%;
  background: #006F3E;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 111, 62, 0.35);
  z-index: 500;
}

.btn-videollamada svg {
  width: 26px;
  height: 26px;
}

.btn-videollamada:active {
  background: #004D2B;
}

.video-modal-mask {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 900;
}

.video-modal {
  width: 100%;
  max-width: 450px;
  background: #fff;
  border-radius: 20px 20px 0 0;
  padding: 20px;
  box-sizing: border-box;
  box-shadow: 0 -8px 30px rgba(0,0,0,0.15);
}

.video-modal-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.video-modal-head h2 {
  flex: 1;
  font-size: 17px;
  font-weight: 900;
  margin: 0;
  color: #0A1410;
}

.video-modal-icon {
  font-size: 22px;
}

.video-modal-cerrar {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  background: #f1f1f1;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-modal-sub {
  font-size: 13px;
  color: #5A6E65;
  font-weight: 600;
  margin: 0 0 14px;
}

.video-modal-lista {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.video-modal-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #D1DDD7;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.video-modal-item:active {
  background: #F4F7F5;
}

.video-modal-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #006F3E;
  color: #fff;
  font-size: 16px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.video-modal-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.video-modal-nombre {
  font-size: 14px;
  font-weight: 800;
  color: #0A1410;
}

.video-modal-idioma {
  font-size: 12px;
  font-weight: 600;
  color: #5A6E65;
}

.video-modal-llamar {
  font-size: 12px;
  font-weight: 800;
  color: #006F3E;
  padding: 6px 14px;
  border: 1.5px solid #006F3E;
  border-radius: 8px;
  flex-shrink: 0;
}

.video-modal-item.no-disponible {
  opacity: 0.5;
}

.video-modal-item.no-disponible:active {
  background: #fff;
}

.no-disponible-label {
  color: #5A6E65 !important;
  border-color: #D1DDD7 !important;
}
</style>
