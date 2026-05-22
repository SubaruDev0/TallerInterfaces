export const preguntasTerrenoCarabineros = [
  // ===== UNIVERSALES =====
  {
    id: 1,
    categoria: 'todas',
    pregunta_texto: '¿Eres tú quien pidió ayuda por la aplicación?',
    opciones: ['Sí', 'No'],
    gif_lsch: '/lsch/ayuda.gif'
  },
  {
    id: 2,
    categoria: 'todas',
    pregunta_texto: '¿Entiendes lo que dice esta pantalla?',
    opciones: ['Sí', 'No', 'No sé'],
    gif_lsch: '/lsch/ayuda.gif'
  },
  {
    id: 3,
    categoria: 'todas',
    pregunta_texto: '¿Estás herido/a o sangrando?',
    opciones: ['Sí', 'No'],
    gif_lsch: '/lsch/ayuda.gif'
  },
  {
    id: 4,
    categoria: 'todas',
    pregunta_texto: '¿Necesitas que llamemos a una ambulancia urgente?',
    opciones: ['Sí', 'No'],
    gif_lsch: '/lsch/ayuda.gif'
  },
  {
    id: 5,
    categoria: 'todas',
    pregunta_texto: '¿Estás completamente solo/a aquí?',
    opciones: ['Sí, solo/a', 'No, hay alguien más'],
    gif_lsch: '/lsch/peligro.gif'
  },
  {
    id: 6,
    categoria: 'todas',
    pregunta_texto: '¿Hay cámaras de seguridad en este lugar?',
    opciones: ['Sí', 'No', 'No sé'],
    gif_lsch: '/lsch/emergencia.gif'
  },
  {
    id: 7,
    categoria: 'todas',
    pregunta_texto: '¿Quieres hacer la denuncia oficial ahora mismo?',
    opciones: ['Sí', 'No', 'Después'],
    gif_lsch: '/lsch/ayuda.gif'
  },

  // ===== VIOLENCIA =====
  {
    id: 8,
    categoria: 'Violencia',
    pregunta_texto: '¿El agresor está dentro de esta casa AHORA MISMO?',
    opciones: ['Sí', 'No', 'No sé'],
    gif_lsch: '/lsch/peligro.gif'
  },
  {
    id: 9,
    categoria: 'Violencia',
    pregunta_texto: '¿El agresor tiene un arma (cuchillo, pistola o similar)?',
    opciones: ['Sí', 'No', 'No sé'],
    gif_lsch: '/lsch/peligro.gif'
  },
  {
    id: 10,
    categoria: 'Violencia',
    pregunta_texto: '¿Te golpeó o te amenazó de muerte hoy?',
    opciones: ['Sí', 'No'],
    gif_lsch: '/lsch/peligro.gif'
  },
  {
    id: 11,
    categoria: 'Violencia',
    pregunta_texto: '¿Hay niños pequeños o ancianos en peligro aquí?',
    opciones: ['Sí', 'No', 'No sé'],
    gif_lsch: '/lsch/peligro.gif'
  },
  {
    id: 12,
    categoria: 'Violencia',
    pregunta_texto: '¿Tienes una orden de alejamiento vigente contra esta persona?',
    opciones: ['Sí', 'No', 'No sé'],
    gif_lsch: '/lsch/emergencia.gif'
  },

  // ===== ROBO =====
  {
    id: 13,
    categoria: 'Robo',
    pregunta_texto: '¿Los delincuentes siguen aquí adentro?',
    opciones: ['Sí', 'No'],
    gif_lsch: '/lsch/emergencia.gif'
  },
  {
    id: 14,
    categoria: 'Robo',
    pregunta_texto: '¿Te mostraron armas de fuego o cuchillos?',
    opciones: ['Sí', 'No'],
    gif_lsch: '/lsch/peligro.gif'
  },
  {
    id: 15,
    categoria: 'Robo',
    pregunta_texto: '¿Se llevaron tus documentos de identidad?',
    opciones: ['Sí', 'No', 'No sé'],
    gif_lsch: '/lsch/emergencia.gif'
  },
  {
    id: 16,
    categoria: 'Robo',
    pregunta_texto: '¿Los ladrones escaparon en un vehículo (auto/moto)?',
    opciones: ['Sí', 'No', 'No vi'],
    gif_lsch: '/lsch/emergencia.gif'
  },
  {
    id: 17,
    categoria: 'Robo',
    pregunta_texto: '¿Te golpearon durante el robo?',
    opciones: ['Sí', 'No'],
    gif_lsch: '/lsch/peligro.gif'
  },

  // ===== ACCIDENTE =====
  {
    id: 18,
    categoria: 'Accidente',
    pregunta_texto: '¿Hay personas atrapadas dentro de los vehículos?',
    opciones: ['Sí', 'No'],
    gif_lsch: '/lsch/ayuda.gif'
  },
  {
    id: 19,
    categoria: 'Accidente',
    pregunta_texto: '¿Hay alguna persona inconsciente o que no respira?',
    opciones: ['Sí', 'No'],
    gif_lsch: '/lsch/ayuda.gif'
  },
  {
    id: 20,
    categoria: 'Accidente',
    pregunta_texto: '¿El otro conductor se arrancó del lugar?',
    opciones: ['Sí', 'No', 'No sé'],
    gif_lsch: '/lsch/emergencia.gif'
  },
  {
    id: 21,
    categoria: 'Accidente',
    pregunta_texto: '¿Tú ibas manejando?',
    opciones: ['Sí, yo manejaba', 'No, era pasajero', 'Iba caminando'],
    gif_lsch: '/lsch/ayuda.gif'
  },

  // ===== OTRA (Sospechosos / Otras) =====
  {
    id: 22,
    categoria: 'Otra',
    pregunta_texto: '¿La persona sospechosa sigue cerca de aquí?',
    opciones: ['Sí', 'No', 'No sé'],
    gif_lsch: '/lsch/peligro.gif'
  },
  {
    id: 23,
    categoria: 'Otra',
    pregunta_texto: '¿El sospechoso intentó forzar la puerta o ventana?',
    opciones: ['Sí', 'No', 'No sé'],
    gif_lsch: '/lsch/peligro.gif'
  },
  {
    id: 24,
    categoria: 'Otra',
    pregunta_texto: '¿Tu vida corre peligro en este exacto momento?',
    opciones: ['Sí', 'No'],
    gif_lsch: '/lsch/peligro.gif'
  },
]
