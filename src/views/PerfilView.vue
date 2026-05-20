<script setup>
import { reactive, computed, ref } from 'vue'

const perfil = reactive({
  rut: '',
  nombre: '',
  telefono: '',
  contacto_nombre: '',
  contacto_telefono: '',
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

function guardar() {
  localStorage.setItem('perfil', JSON.stringify(perfil))
}

function onRutBlur() {
  rutBlurred.value = true
}

function onNombreBlur() {
  nombreBlurred.value = true
}

window.$perfil = perfil
</script>

<template>
  <div class="page perfil">
    <header class="perfil-header">
      <router-link to="/" class="back-btn" aria-label="Volver al inicio">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
      </router-link>
      <h1>Perfil</h1>
    </header>

    <p class="perfil-desc">Tus datos personales se usarán al enviar una alerta.</p>

    <form class="perfil-form" @submit.prevent="guardar">
      <label class="form-group">
        <span class="form-label">RUT</span>
        <input
          name="rut"
          :value="perfil.rut"
          @input="onRutInput"
          @blur="onRutBlur"
          type="text"
          inputmode="numeric"
          placeholder="12.345.678-9"
          autocomplete="off"
        />
        <span v-if="rutBlurred && perfil.rut.length < 9" class="form-error">RUT inválido. Debe tener al menos 8 dígitos + dígito verificador.</span>
      </label>

      <label class="form-group">
        <span class="form-label">Nombre completo</span>
        <input
          name="nombre"
          v-model="perfil.nombre"
          @blur="onNombreBlur"
          type="text"
          autocapitalize="words"
          placeholder="Ej: María Pérez"
          autocomplete="name"
        />
        <span v-if="nombreBlurred && perfil.nombre.length < 2" class="form-error">El nombre debe tener al menos 2 caracteres.</span>
      </label>

      <label class="form-group">
        <span class="form-label">Teléfono</span>
        <input
          name="telefono"
          v-model="perfil.telefono"
          type="tel"
          inputmode="numeric"
          placeholder="+56 9 1234 5678"
          autocomplete="tel"
        />
      </label>

      <label class="form-group">
        <span class="form-label">Contacto de emergencia</span>
        <input
          name="contacto_nombre"
          v-model="perfil.contacto_nombre"
          type="text"
          autocapitalize="words"
          placeholder="Nombre del familiar o amigo"
          autocomplete="off"
        />
      </label>

      <label class="form-group">
        <span class="form-label">Teléfono del contacto</span>
        <input
          name="contacto_telefono"
          v-model="perfil.contacto_telefono"
          type="tel"
          inputmode="numeric"
          placeholder="+56 9 1234 5678"
          autocomplete="off"
        />
      </label>

      <button type="submit" class="save-btn" :disabled="!esFormularioValido">Guardar datos</button>
    </form>
  </div>
</template>

<style scoped>
.perfil-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--on-surface);
  cursor: pointer;
  text-decoration: none;
}

.back-btn svg {
  width: 22px;
  height: 22px;
}

.perfil-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
}

.perfil-desc {
  margin-bottom: 24px;
  color: var(--on-surface-muted);
  font-size: 15px;
}

.perfil-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 14px;
  font-weight: 700;
  color: var(--on-surface);
}

.form-group input {
  padding: 14px;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  font-size: 16px;
  font-family: inherit;
  color: var(--on-surface);
  background: var(--surface);
  transition: border-color 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary);
}

.form-error {
  font-size: 13px;
  font-weight: 600;
  color: var(--danger);
  line-height: 1.4;
}

.save-btn {
  width: 100%;
  padding: 16px;
  margin-top: 8px;
  border: none;
  border-radius: var(--radius);
  background: var(--primary);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.15s ease;
}

.save-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.save-btn:active:not(:disabled) {
  transform: scale(0.97);
}
</style>
