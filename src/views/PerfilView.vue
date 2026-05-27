<script setup>
import { reactive, computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAlertStore } from '../stores/alertStore'

const router = useRouter()
const store = useAlertStore()

const perfil = reactive({
  rut: '',
  nombre: '',
  telefono: '',
  direccion: '',
  contacto_nombre: '',
  contacto_telefono: '',
})

onMounted(() => {
  perfil.rut = store.perfil.rut
  perfil.nombre = store.perfil.nombre
  perfil.telefono = store.perfil.telefono
  perfil.direccion = store.perfil.direccion
  perfil.contacto_nombre = store.perfil.contacto_nombre
  perfil.contacto_telefono = store.perfil.contacto_telefono
  if (!perfil.rut && localStorage.getItem('perfil')) {
    try {
      const data = JSON.parse(localStorage.getItem('perfil'))
      perfil.rut = data.rut || ''
      perfil.nombre = data.nombre || ''
      perfil.telefono = data.telefono || ''
      perfil.contacto_nombre = data.contacto_nombre || ''
      perfil.contacto_telefono = data.contacto_telefono || ''
      perfil.direccion = data.direccion || ''
    } catch {}
  }
})

const rutBlurred = ref(false)
const nombreBlurred = ref(false)

const esFormularioValido = computed(() => {
  return perfil.rut.length >= 9 && perfil.nombre.length >= 2
})

function formatearRut(raw) {
  const limpio = raw.replace(/[^0-9kK]/g, '')
  if (limpio.length <= 1) return limpio.toUpperCase()
  const digito = limpio.slice(-1).toUpperCase()
  const cuerpo = limpio.slice(0, -1)
  const formateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${formateado}-${digito}`
}

function onRutInput(e) {
  const cursor = e.target.selectionStart
  const antes = perfil.rut
  perfil.rut = formatearRut(e.target.value)
  const despues = perfil.rut
  if (cursor && despues.length > antes.length) {
    requestAnimationFrame(() => {
      e.target.setSelectionRange(cursor + (despues.length - antes.length), cursor + (despues.length - antes.length))
    })
  }
}

function formatearTelefono(raw) {
  const limpio = raw.replace(/[^0-9+]/g, '')
  if (limpio.startsWith('+56')) {
    const nums = limpio.replace(/[^0-9]/g, '').slice(2)
    const a = nums.slice(0, 1)
    const b = nums.slice(1, 5)
    const c = nums.slice(5, 9)
    return `+56 ${a}${b ? ' ' + b : ''}${c ? ' ' + c : ''}`.trim()
  }
  const nums = limpio.replace(/[^0-9]/g, '')
  const a = nums.slice(0, 1)
  const b = nums.slice(1, 5)
  const c = nums.slice(5, 9)
  return `${a}${b ? ' ' + b : ''}${c ? ' ' + c : ''}`.trim()
}

function onTelefonoInput(e) {
  perfil.telefono = formatearTelefono(e.target.value)
}

function onContactoTelefonoInput(e) {
  perfil.contacto_telefono = formatearTelefono(e.target.value)
}

function guardar() {
  store.actualizarPerfil({ ...perfil })
  router.push({ name: 'home' })
}

function onRutBlur() {
  rutBlurred.value = true
}

function onNombreBlur() {
  nombreBlurred.value = true
}
</script>

<template>
  <div class="page perfil mobile-profile-container">
    <header class="profile-top-header">
      <button class="back-arrow-btn" @click="router.push('/victim')" aria-label="Volver al inicio">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>
      <h1>Mi Perfil</h1>
      <img
        class="escudo-carabineros"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Roundel_of_Carabineros_de_Chile.svg/250px-Roundel_of_Carabineros_de_Chile.svg.png"
        alt="Carabineros de Chile"
      />
    </header>

    <main class="profile-scrollable-form">
      <div class="profile-welcome-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <p>Tus datos personales y de contacto se adjuntarán automáticamente al enviar una alerta de emergencia.</p>
      </div>

      <div class="form-group-card highlight-group">
        <label class="form-label visual-label-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="label-icon geo-color">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Ubicación actual de reporte
        </label>
        <input 
          type="text" 
          class="form-input geo-input" 
          placeholder="Obteniendo dirección por GPS..." 
          v-model="perfil.direccion"
        />
        <span class="input-hint-tag">🟢 GPS activo — Seleccionando ubicación exacta</span>
      </div>

      <div class="form-group-card">
        <label class="form-label">RUT del Usuario</label>
        <input 
          type="text" 
          class="form-input" 
          placeholder="Ej: 12.345.678-9" 
          :value="perfil.rut"
          @input="onRutInput"
          @blur="onRutBlur"
        />
        <span v-if="rutBlurred && perfil.rut.length < 9" class="form-error-text">RUT inválido. Debe tener al menos 8 dígitos + dígito verificador.</span>
      </div>

      <div class="form-group-card">
        <label class="form-label">Nombre Completo</label>
        <input 
          type="text" 
          class="form-input" 
          placeholder="Ej: María Pérez González" 
          v-model="perfil.nombre"
          @blur="onNombreBlur"
        />
        <span v-if="nombreBlurred && perfil.nombre.length < 2" class="form-error-text">El nombre debe tener al menos 2 caracteres.</span>
      </div>

      <div class="form-group-card">
        <label class="form-label">Tu Teléfono Móvil</label>
        <input 
          type="text" 
          class="form-input" 
          placeholder="Ej: +56 9 1234 5678" 
          :value="perfil.telefono"
          @input="onTelefonoInput"
        />
      </div>

      <div class="form-group-card separator-top">
        <label class="form-label">Nombre Contacto de Emergencia</label>
        <input 
          type="text" 
          class="form-input" 
          placeholder="Nombre del familiar o amigo" 
          v-model="perfil.contacto_nombre"
        />
      </div>

      <div class="form-group-card">
        <label class="form-label">Teléfono del Contacto</label>
        <input 
          type="text" 
          class="form-input" 
          placeholder="Ej: +56 9 8765 4321" 
          :value="perfil.contacto_telefono"
          @input="onContactoTelefonoInput"
        />
      </div>
    </main>

    <footer class="profile-fixed-footer">
      <button class="profile-save-submit-btn" @click="guardar">
        Guardar Mis Datos
      </button>
    </footer>
  </div>
</template>

<style scoped>
/* Contenedor Base adaptado al Marco del Teléfono */
.mobile-profile-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: var(--surface-2);
  position: relative;
  overflow: hidden;
}

/* Encabezado Fijo */
.profile-top-header {
  height: 64px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  flex-shrink: 0;
  z-index: 10;
}
.profile-top-header h1 {
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

/* Formulario Deslizable Independiente */
.profile-scrollable-form {
  flex: 1;
  overflow-y: auto;
  padding: 16px 16px 100px 16px;
}

/* Cuadro Informativo de Bienvenida */
.profile-welcome-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 111, 62, 0.05);
  border: 1px solid rgba(0, 111, 62, 0.15);
  padding: 12px 14px;
  border-radius: var(--radius);
  margin-bottom: 20px;
}
.profile-welcome-badge svg {
  width: 28px;
  height: 28px;
  color: var(--primary);
  flex-shrink: 0;
}
.profile-welcome-badge p {
  margin: 0;
  font-size: 12px;
  color: var(--on-surface);
  font-weight: 500;
  line-height: 1.4;
  text-align: left;
}

/* Tarjetas/Contenedores de los Campos */
.form-group-card {
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-bottom: 16px;
}
.form-label {
  font-size: 13px;
  font-weight: 800;
  color: var(--on-surface);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.visual-label-icon {
  display: flex;
  align-items: center;
  gap: 6px;
}
.label-icon {
  width: 16px;
  height: 16px;
}
.geo-color {
  color: #3b82f6;
}

/* Inputs de Texto Premium */
.form-input {
  width: 100%;
  padding: 12px 14px;
  font-size: 14px;
  background-color: var(--surface);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  color: var(--on-surface);
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.form-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(0, 111, 62, 0.1);
}
.geo-input {
  border-color: #93c5fd;
  background-color: #f8fafc;
  font-weight: 500;
}
.input-hint-tag {
  font-size: 11px;
  font-weight: 700;
  color: var(--on-surface-muted);
  margin-top: 5px;
}

.form-error-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--danger);
  margin-top: 4px;
}

/* Separadores Estéticos */
.separator-top {
  border-top: 1px dashed var(--border);
  padding-top: 16px;
  margin-top: 20px;
}

/* Footer Fijo con Botón de Guardar Institucional */
.profile-fixed-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 76px;
  background: var(--surface);
  border-top: 1px solid var(--border);
  padding: 12px 16px;
  z-index: 10;
  box-sizing: border-box;
}
.profile-save-submit-btn {
  width: 100%;
  height: 100%;
  background-color: var(--primary);
  color: #ffffff;
  border: none;
  border-radius: var(--radius);
  font-size: 15px;
  font-weight: 900;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
  box-shadow: 0 4px 12px rgba(0, 111, 62, 0.2);
}
.profile-save-submit-btn:active {
  background-color: var(--primary-dark);
  transform: scale(0.98);
}
</style>
