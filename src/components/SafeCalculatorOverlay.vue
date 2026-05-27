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
  <div v-if="modelValue" class="safe-calculator-overlay-container">
    <div class="calculator-display">{{ display || '0' }}</div>
    <div class="calculator-buttons-grid">
      <button v-for="n in ['7','8','9','÷','4','5','6','×','1','2','3','-','0','.','+','⌫']" :key="n" class="calc-btn" :class="{ operator: ['÷','×','-','+'].includes(n) }" @click="press(n)">{{ n }}</button>
      <button class="calc-btn" @click="press('C')">C</button>
      <button class="calc-btn operator" @click="press('=')">=</button>
    </div>
  </div>
</template>

<style scoped>
.safe-calculator-overlay-container {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background-color: #ffffff !important;
  z-index: 2000 !important;
  display: flex !important;
  flex-direction: column !important;
  padding: 32px 24px !important;
  box-sizing: border-box !important;
  border-radius: 36px !important;
  overflow: hidden !important;
}

.calculator-display {
  width: 100%;
  background: #1e293b;
  color: #ffffff;
  text-align: right;
  padding: 18px;
  font-size: 28px;
  font-weight: 700;
  border-radius: 12px;
  margin-bottom: 16px;
}

.calculator-buttons-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  flex: 1;
}

.calc-btn {
  background: #f1f5f9;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.1s;
}

.calc-btn:active {
  background: #cbd5e1;
}

.calc-btn.operator {
  background: #e2e8f0;
  color: #006F3E;
}
</style>
