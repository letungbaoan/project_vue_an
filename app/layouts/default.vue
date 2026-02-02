<template>
  <div class="min-h-screen flex flex-col font-sans">
    <AppHeader />

    <main class="flex-grow">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<style>
body {
  font-family: "Inter", sans-serif;
  color: #000000;
}
</style>
