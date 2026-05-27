<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAlertStore } from '../stores/alertStore'
import { emergencias } from '../data/emergencias'
import TriageCard from '../components/TriageCard.vue'
import SafeCalculatorOverlay from '../components/SafeCalculatorOverlay.vue'

const router = useRouter()
const store = useAlertStore()

const mostrarCalculadora = ref(false)
const sidebarAbierto = ref(false)
const presionando = ref(false)
const escalaCortina = ref(0)
let conteoTimer = null
let escalaTimer = null

onMounted(() => {
  store.resetAlerta()
})

function handleSelect(id) {
  const emergencia = emergencias.find(e => e.id === id)
  if (emergencia) {
    store.setEmergencia(emergencia)
    router.push({ name: 'contexto' })
  }
}

function iniciarPresionCortina(e) {
  e.preventDefault()
  presionando.value = true
  escalaCortina.value = 0

  // 4000ms / 16ms = 250 pasos en total para llegar a una escala de cobertura del chasis (~2500%)
  const incremento = 2500 / (4000 / 16) 
  
  escalaTimer = setInterval(() => {
    if (escalaCortina.value < 2500) {
      escalaCortina.value += incremento
    }
  }, 16) // 60fps para fluidez total en el mockup

  conteoTimer = setTimeout(() => {
    clearInterval(escalaTimer)
    clearTimeout(conteoTimer)
    presionando.value = false
    escalaCortina.value = 0
    router.push({ name: 'exito' })
  }, 4000)
}

function cancelarPresionCortina() {
  if (presionando.value) {
    presionando.value = false
    escalaCortina.value = 0
    clearTimeout(conteoTimer)
    clearInterval(escalaTimer)
  }
}

onUnmounted(() => {
  clearTimeout(conteoTimer)
  clearInterval(escalaTimer)
})
</script>

<template>
  <div class="mobile-phone-frame page home">
    <div class="sidebar-drawer" :class="{ 'is-open': sidebarAbierto }">
      <div class="sidebar-backdrop" @click="sidebarAbierto = false"></div>
      <div class="sidebar-content">
        <button class="close-drawer-btn" @click="sidebarAbierto = false">✕</button>
        <nav class="sidebar-nav-visual">
          <router-link to="/victim/perfil" @click="sidebarAbierto = false" class="drawer-visual-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span class="visual-label">PERFIL</span>
          </router-link>
          <router-link to="/victim/historial" @click="sidebarAbierto = false" class="drawer-visual-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span class="visual-label">HISTORIAL</span>
          </router-link>
        </nav>
      </div>
    </div>

    <header class="app-top-header">
      <div class="header-left-group">
        <img
          class="escudo-carabineros"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Roundel_of_Carabineros_de_Chile.svg/250px-Roundel_of_Carabineros_de_Chile.svg.png"
          alt="Carabineros de Chile"
        />
        <div class="brand-block">
          <span class="brand-tag">Emergencia</span>
          <h1>Carabineros</h1>
        </div>
      </div>
      <button class="hamburger-menu-btn" @click="sidebarAbierto = true" aria-label="Abrir menú">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </button>
    </header>

    <main class="scrollable-triage-content">
      <div class="triage-section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
        <span>Selecciona tu Emergencia</span>
      </div>

      <div class="triage-scroll-grid">
        <TriageCard :id="1" titulo="Violencia Intrafamiliar" icono="family" color="#006F3E" gif_lsch="/lsch/peligro.gif" @select="handleSelect" />
        <TriageCard :id="2" titulo="Robo o Hurto" icono="robber" color="#006F3E" gif_lsch="/lsch/peligro.gif" @select="handleSelect" />
        <TriageCard :id="3" titulo="Accidente Tránsito" icono="crash" color="#006F3E" gif_lsch="/lsch/peligro.gif" @select="handleSelect" />
        <TriageCard :id="4" titulo="Agresión / Pelea" icono="fight" color="#006F3E" gif_lsch="/lsch/peligro.gif" @select="handleSelect" />
        <TriageCard :id="5" titulo="Pérdida de Celular" icono="phone" color="#006F3E" gif_lsch="/lsch/peligro.gif" @select="handleSelect" />
        <TriageCard :id="6" titulo="Incendio / Catástrofe" icono="fire" color="#006F3E" gif_lsch="/lsch/peligro.gif" @select="handleSelect" />
      </div>

      <button class="discreet-hide-shortcut" @click="mostrarCalculadora = true">
         Modo Camuflaje Rápido
      </button>
    </main>

    <footer class="app-fixed-footer">
      <div class="footer-instruction-left">
        <span class="f-title">PÁNICO</span>
        <span class="f-sub">Mantén presionado por 4 segundos</span>
      </div>
      
      <button 
        class="panic-circular-trigger"
        :class="{ 'is-pressing': presionando }"
        @touchstart="iniciarPresionCortina"
        @touchend="cancelarPresionCortina"
        @touchcancel="cancelarPresionCortina"
        @mousedown="iniciarPresionCortina"
        @mouseup="cancelarPresionCortina"
        @mouseleave="cancelarPresionCortina"
      >
        <span class="panic-bang-icon" :style="{ opacity: presionando ? 0 : 1 }">!</span>
        <div 
          class="panic-expansion-radial-curtain" 
          :class="{ 'is-active': presionando }"
          :style="{ transform: 'translate(-50%, -50%) scale(' + escalaCortina + '%)' }"
        ></div>
      </button>
    </footer>

    <SafeCalculatorOverlay v-model="mostrarCalculadora" />
  </div>
</template>

<style scoped>
.mobile-phone-frame {
  width: 450px;
  height: 100vh;
  max-height: 850px;
  position: relative;
  overflow: hidden;
  background-color: var(--surface-2);
  border: 4px solid #334155;
  border-radius: 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.sidebar-drawer {
  position: absolute;
  inset: 0;
  z-index: 999;
  pointer-events: none;
}
.sidebar-drawer.is-open {
  pointer-events: auto;
}
.sidebar-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.sidebar-drawer.is-open .sidebar-backdrop {
  opacity: 1;
}
.sidebar-content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 110px;
  background: var(--surface);
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 12px;
  box-sizing: border-box;
}
.sidebar-drawer.is-open .sidebar-content {
  transform: translateX(0);
}
.close-drawer-btn {
  position: absolute;
  top: 12px;
  left: 12px;
  background: none;
  border: none;
  font-size: 22px;
  font-weight: bold;
  color: var(--on-surface-muted);
  cursor: pointer;
  padding: 0;
  line-height: 1;
}
.sidebar-nav-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  margin-top: 48px;
}
.drawer-visual-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.15s ease;
}
.drawer-visual-item:active {
  opacity: 0.5;
}
.drawer-visual-item svg {
  width: 44px;
  height: 44px;
  margin-bottom: 6px;
}
.visual-label {
  font-size: 12px;
  font-weight: 900;
  color: var(--on-surface);
  letter-spacing: 0.5px;
}
.app-top-header {
  padding: 18px 20px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.header-left-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.escudo-carabineros {
  height: 36px;
  width: auto;
  display: block;
}
.brand-block {
  display: flex;
  flex-direction: column;
  text-align: left;
}
.brand-tag {
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 800;
  color: var(--on-surface-muted);
}
.brand-block h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 900;
  color: var(--primary);
}
.hamburger-menu-btn {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
.hamburger-menu-btn .bar {
  width: 100%;
  height: 3px;
  background-color: var(--primary);
  border-radius: 2px;
}
.scrollable-triage-content {
  flex: 1;
  overflow-y: auto;
  padding: 48px 16px 12px 16px;
  box-sizing: border-box;
}
.triage-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  color: var(--on-surface-muted);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}
.triage-section-title svg {
  width: 16px;
  height: 16px;
  color: var(--primary);
}
.triage-scroll-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.app-fixed-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background-color: var(--primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  z-index: 100;
  box-sizing: border-box;
}
.footer-instruction-left {
  display: flex;
  flex-direction: column;
  text-align: left;
  color: #ffffff;
}
.f-title {
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 0.5px;
}
.f-sub {
  font-size: 11px;
  opacity: 0.85;
}
.panic-circular-trigger {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background-color: var(--danger);
  border: 4px solid #ffffff;
  box-shadow: 0 4px 14px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  bottom: 18px;
  right: 4px;
  outline: none;
  transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 101;
  user-select: none;
  overflow: visible;
  -webkit-tap-highlight-color: transparent;
}
.panic-circular-trigger.is-pressing {
  transform: scale(1.1);
  box-shadow: 0 0 0 12px rgba(239, 68, 68, 0.35);
}
.panic-bang-icon {
  color: #ffffff;
  font-size: 36px;
  font-weight: 900;
  z-index: 103;
  transition: opacity 0.1s ease;
}
.panic-expansion-radial-curtain {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background-color: var(--danger);
  z-index: 102;
  pointer-events: none;
  opacity: 0;
  transition: transform 0.16s linear, opacity 0.1s ease;
}
.panic-expansion-radial-curtain.is-active {
  opacity: 1;
}
.discreet-hide-shortcut {
  margin-top: 20px;
  width: 100%;
  padding: 12px;
  border: 2px dashed var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  color: var(--on-surface-muted);
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 20px;
}

</style>
