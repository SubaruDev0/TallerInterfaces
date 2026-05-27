export const emergencias = [
  {
    id: 1,
    titulo: "Violencia Intrafamiliar",
    icono: "shield",
    preguntas: [
      { id: "vif_1", tipo: "select", texto: "¿Agresor está aquí?", opciones: ["Sí, está aquí", "No, se fue"], gif_lsch: "/lsch/peligro.gif" },
      { id: "vif_2", tipo: "select", texto: "¿Hay armas?", opciones: ["Sí, de fuego", "Sí, cuchillo", "No"], gif_lsch: "/lsch/peligro.gif" },
      { id: "vif_3", tipo: "select", texto: "¿Hay personas heridas?", opciones: ["Sí", "No"], gif_lsch: "/lsch/ayuda.gif" }
    ]
  },
  {
    id: 2,
    titulo: "Robo o Hurto",
    icono: "lock",
    preguntas: [
      { id: "robo_1", tipo: "select", texto: "¿Hubo violencia?", opciones: ["Sí, me amenazaron", "No, fue descuido"], gif_lsch: "/lsch/peligro.gif" },
      { id: "robo_2", tipo: "select", texto: "¿Cuándo ocurrió?", opciones: ["Ahora mismo", "Hace pocos minutos", "Hace mucho rato"], gif_lsch: "/lsch/emergencia.gif" },
      { id: "robo_3", tipo: "select", texto: "¿Ves a los sospechosos?", opciones: ["Sí, los veo", "No, escaparon"], gif_lsch: "/lsch/emergencia.gif" }
    ]
  },
  {
    id: 3,
    titulo: "Accidente Tránsito",
    icono: "warning",
    preguntas: [
      { id: "acc_1", tipo: "select", texto: "¿Hay lesionados?", opciones: ["Sí, graves", "Sí, leves", "No, solo autos"], gif_lsch: "/lsch/ayuda.gif" },
      { id: "acc_2", tipo: "select", texto: "¿Hay atrapados?", opciones: ["Sí, atrapados", "No"], gif_lsch: "/lsch/ayuda.gif" },
      { id: "acc_3", tipo: "select", texto: "¿Involucra micros o camiones?", opciones: ["Sí", "No, solo autos"], gif_lsch: "/lsch/emergencia.gif" }
    ]
  },
  {
    id: 4,
    titulo: "Agresión / Pelea",
    icono: "warning",
    preguntas: [
      { id: "pel_1", tipo: "select", texto: "¿Cuántos pelean?", opciones: ["2 personas", "Grupo grande"], gif_lsch: "/lsch/peligro.gif" },
      { id: "pel_2", tipo: "select", texto: "¿Hay heridos en el suelo?", opciones: ["Sí", "No"], gif_lsch: "/lsch/ayuda.gif" },
      { id: "pel_3", tipo: "select", texto: "¿Están usando armas?", opciones: ["Sí", "No"], gif_lsch: "/lsch/peligro.gif" }
    ]
  },
  {
    id: 5,
    titulo: "Pérdida de Celular",
    icono: "lock",
    preguntas: [
      { id: "cel_1", tipo: "select", texto: "¿Fue un asalto?", opciones: ["Sí, me lo robaron", "No, se me perdió"], gif_lsch: "/lsch/emergencia.gif" },
      { id: "cel_2", tipo: "select", texto: "¿El celular está encendido?", opciones: ["Sí", "No / Apagado", "No sé"], gif_lsch: "/lsch/emergencia.gif" }
    ]
  },
  {
    id: 6,
    titulo: "Incendio / Catástrofe",
    icono: "shield",
    preguntas: [
      { id: "inc_1", tipo: "select", texto: "¿Qué se quema?", opciones: ["Casa / Depto", "Auto / Camión", "Pastizal / Árboles"], gif_lsch: "/lsch/peligro.gif" },
      { id: "inc_2", tipo: "select", texto: "¿El fuego se expande?", opciones: ["Sí, rápido", "No / Controlado"], gif_lsch: "/lsch/peligro.gif" },
      { id: "inc_3", tipo: "select", texto: "¿Hay personas atrapadas?", opciones: ["Sí", "No", "No sé"], gif_lsch: "/lsch/ayuda.gif" }
    ]
  }
]
