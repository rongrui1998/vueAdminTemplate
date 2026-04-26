<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

<template>
  <section class="page-container">
    <header v-if="title || $slots.header || $slots.extra" class="page-container__header">
      <slot name="header">
        <div v-if="title" class="page-container__title">{{ title }}</div>
      </slot>
      <div v-if="$slots.extra" class="page-container__extra">
        <slot name="extra" />
      </div>
    </header>
    <div class="page-container__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-container__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.page-container__title {
  font-size: 18px;
  font-weight: 600;
}

.page-container__body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
