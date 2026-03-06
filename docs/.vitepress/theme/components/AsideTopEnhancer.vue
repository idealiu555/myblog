<template>
  <component :is="GoBack" v-if="isPostRoute" />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
import { useRoute } from "vitepress";

const route = useRoute();
const isPostRoute = computed(() => route.path.startsWith("/posts/") || route.path.startsWith("/en/posts/"));

const GoBack = defineAsyncComponent(() => import("./GoBack.vue"));
</script>
