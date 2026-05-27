<script setup>
import { computed, ref } from 'vue'
import { useCasosStore } from '../stores/casosStore'

const store = useCasosStore()

const filtro = ref('pendientes')
const casoSeleccionado = ref(null)
const contactoNotas = ref('')
const carabinerosSeleccionados = ref([])

const lista = computed(() => {
  if (filtro.value === 'pendientes') return store.casosDisponibles
  if (filtro.value === 'asignados') return store.casosAsignados
  if (filtro.value === 'completados') return store.casosCompletados
  return store.casos
})

function seleccionarCaso(caso) {
  casoSeleccionado.value = caso
  contactoNotas.value = caso.contactoNotas || ''
  carabinerosSeleccionados.value = []
}

function asignarSeleccionados() {
  if (!casoSeleccionado.value) return
  carabinerosSeleccionados.value.forEach(nombre => {
    store.asignarCarabinero(casoSeleccionado.value.id, nombre)
  })
  carabinerosSeleccionados.value = []
}

function quitar(nombre) {
  if (!casoSeleccionado.value) return
  store.quitarCarabinero(casoSeleccionado.value.id, nombre)
}

function toggleCarabineroSel(nombre) {
  const idx = carabinerosSeleccionados.value.indexOf(nombre)
  if (idx === -1) {
    carabinerosSeleccionados.value.push(nombre)
  } else {
    carabinerosSeleccionados.value.splice(idx, 1)
  }
}

function toggleServicio(index) {
  if (!casoSeleccionado.value) return
  store.toggleServicioContactado(casoSeleccionado.value.id, index)
}

function guardarNota(ev) {
  if (!casoSeleccionado.value) return
  store.setNotaOperador(casoSeleccionado.value.id, ev.target.value)
}

function setContacto(estado) {
  if (!casoSeleccionado.value) return
  store.setContactoEstado(casoSeleccionado.value.id, estado)
  casoSeleccionado.value.contactoEstado = estado
}

function guardarContactoNotas() {
  if (!casoSeleccionado.value) return
  store.setContactoNotas(casoSeleccionado.value.id, contactoNotas.value)
}

function badgeEstado(estado) {
  if (estado === 'recibida') return 'Nueva'
  if (estado === 'aceptada') return 'Aceptada'
  if (estado === 'asignada') return 'Asignada'
  if (estado === 'en_terreno') return 'En terreno'
  return 'Completada'
}

function contactoLabel(estado) {
  if (estado === 'contactado') return 'Contactado'
  if (estado === 'sin_respuesta') return 'Sin respuesta'
  return 'Pendiente'
}

function yaAsignado(nombre) {
  return casoSeleccionado.value?.asignados?.includes(nombre)
}

const carabinerosFiltrados = computed(() => {
  if (!casoSeleccionado.value) return []
  const com = casoSeleccionado.value.comisariaCercana || ''
  return store.carabineros.filter(cb =>
    com.toLowerCase().includes(cb.unidad.toLowerCase().replace('° comisaría', '').trim())
  )
})
</script>

<template>
  <div class="central">
    <header class="central-header">
      <div class="brand">
        <img
          class="escudo-header"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Roundel_of_Carabineros_de_Chile.svg/250px-Roundel_of_Carabineros_de_Chile.svg.png"
          alt="Carabineros de Chile"
        />
        <span class="brand-title">Central Operativa</span>
      </div>
      <div class="meta">
        <span class="pill">{{ store.casos.length }} casos</span>
        <span class="pill online">En línea</span>
      </div>
    </header>

    <div class="layout">
      <aside class="list">
        <div class="list-head">
          <h1>Denuncias</h1>
          <div class="tabs">
            <button :class="{ active: filtro === 'pendientes' }" @click="filtro = 'pendientes'">
              Pendientes <span class="tab-count">{{ store.casosDisponibles.length }}</span>
            </button>
            <button :class="{ active: filtro === 'asignados' }" @click="filtro = 'asignados'">
              Asignadas <span class="tab-count">{{ store.casosAsignados.length }}</span>
            </button>
            <button :class="{ active: filtro === 'completados' }" @click="filtro = 'completados'">
              Cerradas <span class="tab-count">{{ store.casosCompletados.length }}</span>
            </button>
          </div>
        </div>

        <div v-if="lista.length === 0" class="empty">
          No hay casos en esta categoría
        </div>

        <button
          v-for="c in lista"
          :key="c.id"
          class="case-row"
          :class="{ active: casoSeleccionado?.id === c.id }"
          @click="seleccionarCaso(c)"
        >
          <div class="case-top">
            <span class="case-emerg" :style="{ color: c.emergencia?.color || '#666' }">{{ c.emergencia?.titulo || 'Emergencia' }}</span>
            <span class="case-state" :class="c.estado">{{ badgeEstado(c.estado) }}</span>
          </div>
          <div class="case-sub">
            <span>{{ c.victimNombre || '—' }}</span>
            <span>RUT {{ c.victimRut || '—' }}</span>
          </div>
          <div class="case-meta">
            {{ new Date(c.creadoEn).toLocaleString('es-CL', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' }) }}
          </div>
        </button>
      </aside>

      <section class="detail">
        <div v-if="!casoSeleccionado" class="detail-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="#D1DDD7" stroke-width="1.5" width="48" height="48">
            <rect x="2" y="3" width="20" height="18" rx="2" />
            <line x1="8" y1="9" x2="16" y2="9" />
            <line x1="8" y1="13" x2="16" y2="13" />
            <line x1="8" y1="17" x2="12" y2="17" />
          </svg>
          <p>Selecciona una denuncia para ver el detalle y gestionarla</p>
        </div>

        <div v-else class="detail-wrap">
          <!-- Encabezado principal -->
          <div class="detail-head">
            <div class="detail-head-left">
              <span class="detail-badge" :class="casoSeleccionado.estado">{{ badgeEstado(casoSeleccionado.estado) }}</span>
              <h2>{{ casoSeleccionado.emergencia?.titulo || 'Emergencia' }}</h2>
              <p class="detail-id">ID {{ casoSeleccionado.id }}</p>
            </div>
          </div>

          <!-- Alarma de contacto pendiente -->
          <div v-if="casoSeleccionado.estado === 'recibida' && !casoSeleccionado.contactoEstado" class="contact-alert">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <circle cx="12" cy="16" r="0.5" fill="currentColor" />
            </svg>
            Debes contactar al contacto de emergencia antes de asignar carabineros
          </div>

          <!-- Paso 1: Contacto de emergencia -->
          <div class="section-card">
            <div class="section-step">
              <span class="step-num">1</span>
              <h3>Contacto de emergencia</h3>
              <span class="contact-badge" :class="casoSeleccionado.contactoEstado || 'pendiente'">
                {{ contactoLabel(casoSeleccionado.contactoEstado) }}
              </span>
            </div>
            <div class="contact-info">
              <div class="contact-line">
                <span class="contact-label">Nombre</span>
                <strong>{{ casoSeleccionado.victimContactoNombre || '—' }}</strong>
              </div>
              <div class="contact-line">
                <span class="contact-label">Teléfono</span>
                <strong>{{ casoSeleccionado.victimContactoTelefono || '—' }}</strong>
              </div>
            </div>

            <div class="contact-actions" v-if="casoSeleccionado.estado !== 'completada'">
              <textarea
                class="input-note"
                v-model="contactoNotas"
                @input="guardarContactoNotas"
                placeholder="Anota lo conversado con el contacto (opcional)"
              ></textarea>
              <div class="contact-btns">
                <button
                  class="btn btn-ok"
                  :class="{ active: casoSeleccionado.contactoEstado === 'contactado' }"
                  @click="setContacto('contactado')"
                >
                  {{ casoSeleccionado.contactoEstado === 'contactado' ? '✓ Contactado' : 'Contactado' }}
                </button>
                <button
                  class="btn btn-no"
                  :class="{ active: casoSeleccionado.contactoEstado === 'sin_respuesta' }"
                  @click="setContacto('sin_respuesta')"
                >
                  {{ casoSeleccionado.contactoEstado === 'sin_respuesta' ? '✓ Sin respuesta' : 'Sin respuesta' }}
                </button>
              </div>
            </div>

            <div v-else class="contact-notas-leidas">
              <strong>Notas del operador:</strong>
              {{ casoSeleccionado.contactoNotas || '(sin notas)' }}
            </div>
          </div>

          <!-- Datos del caso -->
          <div class="info-grid">
            <div class="section-card">
              <h3 class="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Víctima
              </h3>
              <div class="info-line"><span>Nombre</span><strong>{{ casoSeleccionado.victimNombre || '—' }}</strong></div>
              <div class="info-line"><span>RUT</span><strong>{{ casoSeleccionado.victimRut || '—' }}</strong></div>
              <div class="info-line"><span>Teléfono</span><strong>{{ casoSeleccionado.victimTelefono || '—' }}</strong></div>
            </div>

            <div class="section-card">
              <h3 class="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Ubicación
              </h3>
              <div class="info-line"><span>Dirección</span><strong>{{ casoSeleccionado.contexto?.ubicacion || '—' }}</strong></div>
              <div class="info-line">
                <span>Comisaría</span>
                <strong class="comisaria">{{ casoSeleccionado.comisariaCercana || '—' }}</strong>
              </div>
            </div>
          </div>

          <!-- Contexto recibido -->
          <div class="section-card">
            <h3 class="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <circle cx="12" cy="8" r="0.5" fill="currentColor" />
              </svg>
              Contexto recibido de la víctima
            </h3>
            <div v-if="Object.keys(casoSeleccionado.contexto?.respuestas || {}).length === 0" class="info-line muted">
              Sin respuestas
            </div>
            <div v-for="(v, k) in casoSeleccionado.contexto?.respuestas || {}" :key="k" class="info-line">
              <span>{{ casoSeleccionado.contexto?.preguntas?.[k] || k }}</span>
              <strong>{{ v }}</strong>
            </div>
          </div>

          <!-- Paso 2: Servicios externos -->
          <div class="section-card">
            <div class="section-step">
              <span class="step-num">2</span>
              <h3>Servicios externos</h3>
            </div>
            <div v-for="(s, i) in casoSeleccionado.serviciosExternos" :key="i" class="servicio-row">
              <div class="servicio-info">
                <span class="servicio-nombre">{{ s.servicio }}</span>
                <span class="servicio-estado" :class="{ ok: s.contactado }">
                  {{ s.contactado ? '✓ Contactado' : 'Pendiente' }}
                </span>
              </div>
              <button
                v-if="casoSeleccionado.estado !== 'completada'"
                class="btn btn-servicio"
                :class="{ active: s.contactado }"
                @click="toggleServicio(i)"
              >
                {{ s.contactado ? 'He contactado ✓' : 'He contactado' }}
              </button>
            </div>
            <div class="servicio-ayuda">
              <span>🚑 Ambulancia: 131</span>
              <span>🚒 Bomberos: 132</span>
            </div>
          </div>

          <!-- Paso 3: Nota al carabinero -->
          <div class="section-card">
            <div class="section-step">
              <span class="step-num">3</span>
              <h3>Nota para el carabinero en terreno</h3>
            </div>
            <textarea
              class="input-note"
              :value="casoSeleccionado.notaOperador"
              @input="guardarNota"
              placeholder="Ej: posible agresor armado, riesgo alto, etc."
            ></textarea>
          </div>

          <!-- Paso 4: Asignar carabineros -->
          <div class="section-card" v-if="casoSeleccionado.estado !== 'completada'">
            <div class="section-step">
              <span class="step-num">4</span>
              <h3>Asignar carabineros</h3>
              <span class="comisaria-label">{{ casoSeleccionado.comisariaCercana || '48° Comisaría' }}</span>
            </div>
            <div v-if="carabinerosFiltrados.length === 0" class="info-line muted">
              No hay carabineros disponibles para esta comisaría
            </div>
            <div class="assign-grid">
              <label
                v-for="cb in carabinerosFiltrados"
                :key="cb.nombre"
                class="assign-option"
                :class="{ disabled: yaAsignado(cb.nombre) }"
              >
                <input
                  type="checkbox"
                  :value="cb.nombre"
                  :checked="carabinerosSeleccionados.includes(cb.nombre)"
                  :disabled="yaAsignado(cb.nombre)"
                  @change="toggleCarabineroSel(cb.nombre)"
                />
                <div class="assign-info">
                  <span class="assign-nombre">{{ cb.nombre }}</span>
                  <span class="assign-unidad">{{ cb.unidad }}</span>
                </div>
                <span v-if="yaAsignado(cb.nombre)" class="assign-badge">Asignado</span>
              </label>
            </div>
            <button
              class="btn btn-assign"
              @click="asignarSeleccionados"
              :disabled="carabinerosSeleccionados.length === 0"
            >
              Asignar seleccionados ({{ carabinerosSeleccionados.length }})
            </button>

            <!-- Ya asignados -->
            <div v-if="casoSeleccionado.asignados?.length" class="asignados-lista">
              <span class="asignados-titulo">Carabineros asignados:</span>
              <div v-for="a in casoSeleccionado.asignados" :key="a" class="asignado-chip">
                <span>{{ a }}</span>
                <button
                  v-if="casoSeleccionado.estado !== 'completada' && casoSeleccionado.estado !== 'en_terreno'"
                  class="btn-remove-xs"
                  @click="quitar(a)"
                >✕</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.central {
  width: 100vw !important;
  height: 100vh !important;
  max-width: none !important;
  display: flex !important;
  flex-direction: column !important;
  background: #F4F7F5 !important;
  color: #0A1410;
  padding: 20px 24px;
  font-family: 'Roboto', sans-serif;
  box-sizing: border-box;
}

.central * { box-sizing: border-box; }

/* HEADER */
.central-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 800;
  color: #006F3E;
}

.escudo-header {
  height: 32px;
  width: auto;
}

.brand-title {
  letter-spacing: 0.5px;
}

.meta {
  display: flex;
  gap: 8px;
}

.pill {
  font-size: 11px;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 999px;
  background: #D1DDD7;
  color: #5A6E65;
}

.pill.online {
  background: #006F3E;
  color: #fff;
}

/* LAYOUT PRINCIPAL */
.layout {
  flex: 1;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 16px;
  min-height: 0;
  overflow: hidden;
}

/* LISTA LATERAL */
.list {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
  border: 1px solid #D1DDD7;
}

.list-head h1 {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 800;
  color: #0A1410;
}

.tabs {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.tabs button {
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #D1DDD7;
  background: #fff;
  color: #5A6E65;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tabs button.active {
  background: #006F3E;
  border-color: #006F3E;
  color: #fff;
}

.tab-count {
  font-size: 10px;
  font-weight: 800;
  background: rgba(0,0,0,0.08);
  padding: 1px 6px;
  border-radius: 6px;
}

.tabs button.active .tab-count {
  background: rgba(255,255,255,0.2);
}

.empty {
  color: #5A6E65;
  font-size: 13px;
  text-align: center;
  padding: 24px 0;
}

.case-row {
  background: #fff;
  border-radius: 10px;
  padding: 10px 12px;
  border: 1px solid #D1DDD7;
  cursor: pointer;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.case-row.active {
  border-color: #006F3E;
  background: #F4F7F5;
}

.case-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.case-emerg {
  font-weight: 800;
  font-size: 13px;
  color: #0A1410;
}

.case-state {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
}

.case-state.recibida { background: #fff3cd; color: #856404; }
.case-state.aceptada { background: #cce5ff; color: #004085; }
.case-state.asignada { background: #d4edda; color: #155724; }
.case-state.en_terreno { background: #e2e3f5; color: #383d41; }
.case-state.completada { background: #D1DDD7; color: #5A6E65; }

.case-sub {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #5A6E65;
}

.case-meta {
  font-size: 11px;
  color: #5A6E65;
}

/* DETALLE */
.detail {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  overflow-y: auto;
  min-height: 0;
  border: 1px solid #D1DDD7;
}

.detail-empty {
  color: #5A6E65;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 100%;
}

.detail-empty p {
  margin: 0;
  font-weight: 600;
}

.detail-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 12px;
  border-bottom: 2px solid #006F3E;
}

.detail-head-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-badge {
  font-size: 10px;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 6px;
  width: fit-content;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-badge.recibida { background: #fff3cd; color: #856404; }
.detail-badge.aceptada { background: #cce5ff; color: #004085; }
.detail-badge.asignada { background: #d4edda; color: #155724; }
.detail-badge.en_terreno { background: #e2e3f5; color: #383d41; }
.detail-badge.completada { background: #D1DDD7; color: #5A6E65; }

.detail-head h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #0A1410;
}

.detail-id {
  margin: 0;
  color: #5A6E65;
  font-size: 11px;
  font-weight: 600;
}

.detail-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* ALERTA CONTACTO */
.contact-alert {
  background: #fff3cd;
  color: #856404;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* SECCIONES */
.section-card {
  background: #F9FAFB;
  border-radius: 12px;
  padding: 14px;
  border: 1px solid #D1DDD7;
}

.section-step {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.step-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #006F3E;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.section-step h3 {
  flex: 1;
  margin: 0;
  font-size: 13px;
  font-weight: 800;
  color: #0A1410;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 800;
  color: #006F3E;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* INFO GRID */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.info-line {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding: 4px 0;
  border-bottom: 1px solid #E5E7EB;
}

.info-line:last-child { border-bottom: none; }

.info-line span { color: #5A6E65; font-weight: 600; }
.info-line strong { color: #0A1410; }
.info-line.muted { justify-content: center; color: #5A6E65; font-style: italic; }

.comisaria {
  font-size: 12px;
  text-align: right;
  max-width: 200px;
  color: #5A6E65;
  font-weight: 600;
}

.comisaria-label {
  font-size: 11px;
  font-weight: 700;
  color: #5A6E65;
  background: #E5E7EB;
  padding: 3px 8px;
  border-radius: 6px;
}

/* CONTACTO */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  margin-bottom: 10px;
}

.contact-line {
  display: flex;
  gap: 8px;
  font-size: 14px;
  padding: 3px 0;
}

.contact-label {
  color: #5A6E65;
  font-weight: 600;
  min-width: 70px;
}

.contact-badge {
  font-size: 10px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 6px;
  text-transform: uppercase;
}

.contact-badge.pendiente { background: #fff3cd; color: #856404; }
.contact-badge.contactado { background: #d4edda; color: #155724; }
.contact-badge.sin_respuesta { background: #f8d7da; color: #721c24; }

.contact-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-btns {
  display: flex;
  gap: 8px;
}

.contact-notas-leidas {
  font-size: 13px;
  color: #5A6E65;
  padding: 8px 0 0;
  border-top: 1px solid #D1DDD7;
}

.contact-notas-leidas strong { color: #0A1410; }

/* BOTONES GENERALES */
.btn {
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid #D1DDD7;
  background: #fff;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  color: #0A1410;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-assign {
  background: #006F3E;
  color: #fff;
  border-color: #006F3E;
  width: 100%;
  margin-top: 8px;
  padding: 10px;
  font-size: 13px;
}

.btn-ok {
  flex: 1;
  border-color: #006F3E;
  color: #006F3E;
}

.btn-ok.active {
  background: #006F3E;
  color: #fff;
}

.btn-no {
  flex: 1;
  border-color: #dc3545;
  color: #dc3545;
}

.btn-no.active {
  background: #dc3545;
  color: #fff;
}

.btn-servicio {
  font-size: 11px;
  padding: 4px 10px;
}

.btn-servicio.active {
  background: #006F3E;
  border-color: #006F3E;
  color: #fff;
}

.btn-remove-xs {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  padding: 0 2px;
}

/* SERVICIOS */
.servicio-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #E5E7EB;
}

.servicio-row:last-child { border-bottom: none; }

.servicio-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.servicio-nombre {
  font-size: 13px;
  font-weight: 700;
  color: #0A1410;
}

.servicio-estado {
  font-size: 10px;
  font-weight: 700;
  color: #5A6E65;
}

.servicio-estado.ok { color: #006F3E; }

.servicio-ayuda {
  display: flex;
  gap: 16px;
  margin-top: 8px;
  font-size: 12px;
  color: #5A6E65;
  font-weight: 600;
}

/* INPUTS */
.input-note {
  width: 100%;
  min-height: 60px;
  border-radius: 8px;
  border: 1px solid #D1DDD7;
  background: #fff;
  color: #0A1410;
  font-size: 13px;
  font-weight: 600;
  padding: 10px;
  resize: vertical;
  box-sizing: border-box;
  font-family: inherit;
}

.input-note::placeholder { color: #bbb; }

/* ASIGNACIÓN */
.assign-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.assign-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #D1DDD7;
  cursor: pointer;
  background: #fff;
}

.assign-option.disabled {
  opacity: 0.5;
  cursor: default;
}

.assign-option input {
  accent-color: #006F3E;
  width: 18px;
  height: 18px;
}

.assign-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
}

.assign-nombre {
  font-size: 13px;
  font-weight: 700;
  color: #0A1410;
}

.assign-unidad {
  font-size: 11px;
  color: #5A6E65;
  font-weight: 600;
}

.assign-badge {
  font-size: 10px;
  font-weight: 800;
  background: rgba(0, 111, 62, 0.1);
  color: #006F3E;
  padding: 2px 8px;
  border-radius: 6px;
}

.asignados-lista {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #E5E7EB;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.asignados-titulo {
  font-size: 11px;
  font-weight: 700;
  color: #5A6E65;
  width: 100%;
}

.asignado-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(0, 111, 62, 0.08);
  color: #006F3E;
  font-size: 12px;
  font-weight: 700;
}
</style>
