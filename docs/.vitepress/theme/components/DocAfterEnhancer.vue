<template>
  <component :is="Comment" v-if="isPostRoute && !frontmatter.isNoComment" />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
import { useData, useRoute } from "vitepress";

const { frontmatter } = useData();
const route = useRoute();
const isPostRoute = computed(() => route.path.startsWith("/posts/") || route.path.startsWith("/en/posts/"));
const Comment = defineAsyncComponent(() => import("./Comment.vue"));
</script>
