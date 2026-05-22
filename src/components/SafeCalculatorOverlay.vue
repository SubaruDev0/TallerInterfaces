<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const display = ref('')

watch(() => props.modelValue, val => {
  if (!val) display.value = ''
})

function close() {
  emit('update:modelValue', false)
  display.value = ''
}

function press(key) {
  if (key === 'C') {
    display.value = ''
    return
  }
  if (key === '⌫') {
    display.value = display.value.slice(0, -1)
    return
  }
  if (key === '=') {
    const raw = display.value.replace(/×/g, '*').replace(/÷/g, '/')
    if (!/^[0-9+\-*/. ]+$/.test(raw)) return
    try {
      const result = Function(`"use strict"; return (${raw})`)()
      display.value = String(result)
    } catch {}
    return
  }

  display.value = (display.value + key).slice(-20)
  if (display.value === '505') {
    close()
  }
}
</script>

<template>
  <div v-if="modelValue" class="calc-mask">
    <div class="calc">
      <div class="calc-display">{{ display || '0' }}</div>
      <div class="calc-grid">
        <button v-for="n in ['7','8','9','÷','4','5','6','×','1','2','3','-','0','.','+','⌫']" :key="n" @click="press(n)">{{ n }}</button>
        <button class="calc-ghost" @click="press('C')">C</button>
        <button class="calc-eq" @click="press('=')">=</button>
      </div>
      <p class="calc-hint">Para volver, escribe 505 o reinicia la app.</p>
    </div>
  </div>
</template>

<style scoped>
.calc-mask {
  position: fixed;
  inset: 0;
  background: #f7f8fb;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.calc {
  width: 320px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.12);
  padding: 16px;
}

.calc-display {
  height: 56px;
  background: #0f172a;
  color: #fff;
  border-radius: 10px;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 12px;
  letter-spacing: 1px;
  margin-bottom: 10px;
}

.calc-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.calc-grid button {
  height: 48px;
  border: none;
  border-radius: 10px;
  background: #e8edf5;
  font-size: 18px;
  font-weight: 800;
  color: #1f2937;
  cursor: pointer;
}

.calc-eq {
  grid-column: span 2;
  background: #111827;
  color: #fff;
}

.calc-ghost {
  background: #fff;
  border: 2px solid #e5e7eb;
}

.calc-hint {
  margin: 12px 0 0;
  font-size: 11px;
  color: #6b7280;
  text-align: center;
}
</style>
