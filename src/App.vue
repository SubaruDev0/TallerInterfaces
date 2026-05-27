<template>
  <div class="project-root-container">
    <router-view />
  </div>
</template>

<style>
/* Reset absoluto del viewport del navegador */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  background-color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.project-root-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
