<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

const props = defineProps<{
  currentPage: number;
  totalPages: number;
}>();

const emit = defineEmits<{
  (e: "change", page: number): void;
}>();

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit("change", page);
  }
};
</script>

<template>
  <div
    v-if="totalPages > 1"
    class="flex items-center justify-center gap-2 mt-12"
  >
    <button
      @click="handlePageChange(currentPage - 1)"
      :disabled="currentPage === 1"
      class="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <ChevronLeft class="w-5 h-5" />
    </button>

    <div class="flex gap-2">
      <button
        v-for="page in totalPages"
        :key="page"
        @click="handlePageChange(page)"
        class="w-10 h-10 rounded-xl font-bold text-sm transition-all duration-300"
        :class="
          page === currentPage
            ? 'bg-primary text-white shadow-lg shadow-primary/30'
            : 'bg-white text-secondary border border-gray-200 hover:border-primary hover:text-primary'
        "
      >
        {{ page }}
      </button>
    </div>

    <button
      @click="handlePageChange(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <ChevronRight class="w-5 h-5" />
    </button>
  </div>
</template>
