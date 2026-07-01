<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAlertStore } from '../stores/alertStore'
import { useCasosStore } from '../stores/casosStore'
import { connectGPSSocket, sendGPSUpdate, closeGPSSocket } from '../services/api.js'
import SafeCalculatorOverlay from '../components/SafeCalculatorOverlay.vue'

const router = useRouter()
const alertStore = useAlertStore()
const casosStore = useCasosStore()

const mostrarCalculadora = ref(false)
const menuAbierto = ref(false)
const presionando = ref(false)
const escalaCortina = ref(0)
const isLoading = ref(false)
const tiempoPresion = ref(0)
const mostrarEmergenciaEnProgreso = ref(false)
let conteoTimer = null
let escalaTimer = null
let tiempoTimer = null
let gpsWatchId = null
let gpsSocket = null

onMounted(() => {
  alertStore.resetAlerta()
  casosStore.cargarCasos()
  iniciarGPS()
})

onUnmounted(() => {
  clearTimeout(conteoTimer)
  clearInterval(escalaTimer)
  clearInterval(tiempoTimer)
  closeGPSSocket()
  if (gpsWatchId !== null) {
    navigator.geolocation.clearWatch(gpsWatchId)
  }
})

function iniciarGPS() {
  if (!navigator.geolocation) return
  gpsWatchId = navigator.geolocation.watchPosition(
    (pos) => {
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude
      alertStore.setUbicacion(`${lat.toFixed(6)}, ${lng.toFixed(6)}`, lat, lng)
    },
    () => {},
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  )
}

async function iniciarPresionCortina(e) {
  e.preventDefault()

  await casosStore.cargarCasos()
  const rut = alertStore.perfil.rut
  if (rut) {
    const activos = casosStore.getCasosPorRut(rut).filter(c => {
      if (c.estado === 'completada') return false
      const edad = Date.now() - new Date(c.creadoEn).getTime()
      if (edad > 10 * 60 * 1000) {
        casosStore.completarCaso(c.id, { nota: 'Cerrado automaticamente por tiempo.' })
        return false
      }
      return true
    })
    if (activos.length > 0) {
      mostrarEmergenciaEnProgreso.value = true
      return
    }
  }

  presionando.value = true
  escalaCortina.value = 0
  tiempoPresion.value = 0

  const incremento = 2500 / (4000 / 16)

  tiempoTimer = setInterval(() => {
    tiempoPresion.value = Math.min(tiempoPresion.value + 0.05, 4)
  }, 50)

  escalaTimer = setInterval(() => {
    if (escalaCortina.value < 2500) {
      escalaCortina.value += incremento
    }
  }, 16)

  conteoTimer = setTimeout(() => {
    clearInterval(escalaTimer)
    clearInterval(tiempoTimer)
    clearTimeout(conteoTimer)
    presionando.value = false
    escalaCortina.value = 0
    tiempoPresion.value = 0
    enviarPanico()
  }, 4000)
}

function cancelarPresionCortina() {
  if (presionando.value) {
    presionando.value = false
    escalaCortina.value = 0
    tiempoPresion.value = 0
    clearTimeout(conteoTimer)
    clearInterval(escalaTimer)
    clearInterval(tiempoTimer)
  }
}

async function enviarPanico() {
  if (isLoading.value) return
  isLoading.value = true

  const lat = alertStore.perfil._lastLat
  const lng = alertStore.perfil._lastLng
  const ubicacionTexto = alertStore.ubicacionNombre || alertStore.ubicacion || (lat && lng ? `${lat}, ${lng}` : '')

  alertStore.setEmergencia({ id: 0, titulo: 'Panico', preguntas: [] })

  const nuevoCaso = casosStore.crearCaso({
    victimRut: alertStore.perfil.rut,
    victimNombre: alertStore.perfil.nombre,
    victimTelefono: alertStore.perfil.telefono,
    victimContactoNombre: alertStore.perfil.contacto_nombre || '',
    victimContactoTelefono: alertStore.perfil.contacto_telefono || '',
    emergencia: { id: 0, titulo: 'Panico', gif_lsch: '/lsch/emergencia.gif' },
    contexto: {
      ubicacion: ubicacionTexto,
      respuestas: {},
      preguntas: {},
    },
    lat: lat || null,
    lng: lng || null,
  })

  if (nuevoCaso.id && lat) {
    gpsSocket = connectGPSSocket(nuevoCaso.id, {
      onConnect: () => {
        sendGPSUpdate(lat, lng)
      },
    })
  }

  isLoading.value = false
  router.push({ name: 'exito', query: { casoId: nuevoCaso.id } })
}

function irAEstado() {
  router.push({ name: 'estado' })
}
</script>

<template>
  <div class="mobile-phone-frame page home">
    <div class="home-bg-shape"></div>

    <header class="home-header">
      <div class="header-content">
        <img
          class="escudo"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Roundel_of_Carabineros_de_Chile.svg/250px-Roundel_of_Carabineros_de_Chile.svg.png"
          alt="Carabineros"
        />
        <div class="header-text">
          <span class="brand-tag">Carabineros de Chile</span>
          <h1 class="brand-title">EMERGENCIA</h1>
        </div>
      </div>

      <button class="menu-btn" @click="menuAbierto = true" aria-label="Menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
    </header>

    <div class="sidebar-overlay" :class="{ open: menuAbierto }" @click="menuAbierto = false">
      <nav class="sidebar-menu" @click.stop>
        <button class="sidebar-close" @click="menuAbierto = false" aria-label="Cerrar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <router-link to="/victim/perfil" class="sidebar-item" @click="menuAbierto = false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span>PERFIL</span>
        </router-link>

        <router-link to="/victim/estado" class="sidebar-item" @click="menuAbierto = false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>ESTADO</span>
        </router-link>

        <button class="sidebar-item danger" @click="mostrarCalculadora = true; menuAbierto = false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span>OCULTAR</span>
        </button>
      </nav>
    </div>

    <main class="home-main">
      <div class="panic-zone">
        <p class="panic-label">MANTEN PRESIONADO</p>

        <button
          class="panic-btn"
          :class="{ pressing: presionando, loading: isLoading }"
          @touchstart="iniciarPresionCortina"
          @touchend="cancelarPresionCortina"
          @touchcancel="cancelarPresionCortina"
          @mousedown="iniciarPresionCortina"
          @mouseup="cancelarPresionCortina"
          @mouseleave="cancelarPresionCortina"
          :disabled="isLoading"
        >
          <span class="panic-icon">{{ isLoading ? '...' : '!' }}</span>
          <div
            class="panic-ring"
            :class="{ active: presionando }"
            :style="{ transform: `scale(${1 + (escalaCortina / 2500) * 0.8})` }"
          ></div>
          <div
            class="panic-progress"
            :class="{ active: presionando }"
            :style="{ background: `conic-gradient(#fff ${(tiempoPresion / 4) * 100}%, transparent 0)` }"
          ></div>
        </button>

        <p class="panic-hint">4 segundos</p>
      </div>
    </main>

    <footer class="home-footer">
      <div class="gps-badge" :class="{ active: alertStore.ubicacion }">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <span>GPS {{ alertStore.ubicacion ? 'Activo' : 'Inactivo' }}</span>
      </div>

      <button class="ocultar-btn" @click="mostrarCalculadora = true" aria-label="Modo camuflaje">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <span>OCULTAR</span>
      </button>
    </footer>

    <SafeCalculatorOverlay v-model="mostrarCalculadora" />

    <div v-if="mostrarEmergenciaEnProgreso" class="popup-mask" @click="mostrarEmergenciaEnProgreso = false">
      <div class="popup-card" @click.stop>
        <div class="popup-icono">
          <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5" width="40" height="40">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h2>Emergencia en progreso</h2>
        <p>Ya tienes una emergencia activa. Espera a que la policía la resuelva.</p>
        <button class="popup-btn" @click="mostrarEmergenciaEnProgreso = false">Entendido</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mobile-phone-frame {
  width: 100%;
  max-width: 450px;
  height: 100vh;
  max-height: 850px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(160deg, #0a4a2e 0%, #006F3E 50%, #0a5a35 100%);
  border: 4px solid #1a1a2e;
  border-radius: 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.home-bg-circle {
  position: absolute;
  top: -150px;
  right: -100px;
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.home-bg-circle-2 {
  position: absolute;
  bottom: -100px;
  left: -80px;
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(0,0,0,0.15) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.home-bg-dots {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 30px 30px;
  pointer-events: none;
}

.home-header {
  position: relative;
  z-index: 2;
  padding: 20px 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-btn {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.2s;
  backdrop-filter: blur(8px);
}

.menu-btn:active {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(0.92);
}

.menu-btn svg {
  width: 22px;
  height: 22px;
}

.sidebar-overlay {
  position: absolute;
  inset: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.sidebar-overlay.open {
  opacity: 1;
  pointer-events: auto;
}

.sidebar-menu {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 220px;
  background: linear-gradient(180deg, #1a1a2e 0%, #16162a 100%);
  display: flex;
  flex-direction: column;
  padding: 20px 16px;
  gap: 8px;
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-overlay.open .sidebar-menu {
  transform: translateX(0);
}

.sidebar-close {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-end;
  margin-bottom: 24px;
  padding: 0;
}

.sidebar-close svg {
  width: 18px;
  height: 18px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  text-align: left;
}

.sidebar-item:active {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar-item svg {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  opacity: 0.8;
}

.sidebar-item.danger {
  margin-top: auto;
  background: rgba(220, 38, 38, 0.12);
  border-color: rgba(220, 38, 38, 0.2);
  color: #fca5a5;
}

.escudo {
  height: 44px;
  width: auto;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
}

.header-text {
  display: flex;
  flex-direction: column;
}

.brand-tag {
  font-size: 9px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.brand-title {
  margin: 2px 0 0;
  font-size: 22px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 1px;
  text-shadow: 0 2px 12px rgba(0,0,0,0.2);
}

.home-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.panic-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.panic-label {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin: 0;
}

.panic-hint {
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.35);
  margin: 0;
}

.panic-btn {
  width: 170px;
  height: 170px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #ef4444, #b91c1c 60%, #991b1b);
  border: 8px solid rgba(255, 255, 255, 0.9);
  box-shadow:
    0 0 0 2px rgba(239, 68, 68, 0.3),
    0 8px 40px rgba(0, 0, 0, 0.4),
    inset 0 -4px 12px rgba(0, 0, 0, 0.2),
    inset 0 4px 12px rgba(255, 255, 255, 0.1);
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275),
              box-shadow 0.3s ease;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.panic-btn.pressing {
  transform: scale(1.08);
  box-shadow:
    0 0 0 20px rgba(239, 68, 68, 0.25),
    0 0 60px rgba(239, 68, 68, 0.4),
    0 8px 40px rgba(0, 0, 0, 0.4),
    inset 0 -4px 12px rgba(0, 0, 0, 0.2),
    inset 0 4px 12px rgba(255, 255, 255, 0.1);
}

.panic-btn.loading {
  opacity: 0.7;
  cursor: wait;
}

.panic-icon {
  color: #fff;
  font-size: 76px;
  font-weight: 900;
  z-index: 3;
  position: relative;
  text-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  line-height: 1;
}

.panic-ring {
  position: absolute;
  top: -16px;
  left: -16px;
  right: -16px;
  bottom: -16px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.2);
  pointer-events: none;
  opacity: 0;
  transition: transform 0.16s linear, opacity 0.2s ease;
}

.panic-ring.active {
  opacity: 1;
}

.panic-progress {
  position: absolute;
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.panic-progress.active {
  opacity: 0.35;
}

.popup-mask {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.popup-card {
  background: white;
  border-radius: 20px;
  padding: 32px 24px;
  text-align: center;
  max-width: 300px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.popup-icono {
  margin-bottom: 16px;
}

.popup-card h2 {
  font-size: 18px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.popup-card p {
  font-size: 14px;
  color: #666;
  margin: 0 0 24px;
  line-height: 1.4;
}

.popup-btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: #1a1a1a;
  color: white;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

.popup-btn:active {
  opacity: 0.8;
}

.home-footer {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 0 24px 40px;
}

.gps-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  color: #f59e0b;
  transition: all 0.4s ease;
}

.gps-badge.active {
  color: #10b981;
  border-color: rgba(16, 185, 129, 0.3);
  background: rgba(16, 185, 129, 0.1);
}

.gps-badge svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.gps-badge span {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.ocultar-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(8px);
}

.ocultar-btn:active {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(0.96);
  color: #fff;
}

.ocultar-btn svg {
  width: 20px;
  height: 20px;
}
</style>
