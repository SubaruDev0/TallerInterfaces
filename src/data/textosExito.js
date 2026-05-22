export const textosExito = {
  online: {
    titulo: 'Alerta enviada',
    mensaje: 'Carabineros fue notificado de tu ubicación.',
    instrucciones: [
      'Mantén tu teléfono desbloqueado y visible.',
      'No abandones tu ubicación a menos que corras peligro inminente.',
      'Un móvil policial será despachado lo antes posible.'
    ],
    badge: 'Notificación enviada'
  },

  offline: {
    titulo: 'MODO SMS ACTIVADO',
    mensaje: 'No hay conexión a internet. Generando mensaje cifrado para enviar por SMS.',
    instrucciones: [
      'Tu alerta se enviará automáticamente cuando haya señal de telefonía.',
      'No cierres la aplicación ni apagues el teléfono.',
      'Apenas tengas conexión, la alerta se reenviará por internet.'
    ],
    badge: 'Preparando SMS...'
  }
}
