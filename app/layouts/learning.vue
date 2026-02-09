<script setup lang="ts">
import { PATHS } from "../constants/paths";
import { LucideArrowLeft } from "lucide-vue-next";

const props = defineProps<{
  courseName?: string;
  progress?: number;
  courseId?: string;
}>();

const { t } = useI18n();
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden bg-white">
    <header
      class="h-16 border-b px-6 flex items-center justify-between bg-[#252641] text-white shrink-0"
    >
      <div class="flex items-center gap-4">
        <NuxtLink
          :to=PATHS.MY_COURSES
          class="hover:text-primary transition"
        >
          <LucideArrowLeft :size="20" />
        </NuxtLink>
        <h1 class="font-semibold truncate max-w-[300px]">
          {{ courseName || t("common.loading") }}
        </h1>
      </div>

      <div class="flex items-center gap-6">
        <div
          class="hidden md:block w-48 bg-gray-700 h-2 rounded-full overflow-hidden"
        >
          <div
            class="bg-primary h-full transition-all duration-500"
            :style="{ width: `${progress || 0}%` }"
          ></div>
        </div>
        <span class="text-sm font-medium">
          {{ progress || 0 }}%
          {{
            t("common.updating") === "Đang cập nhật..."
              ? "Hoàn thành"
              : "Complete"
          }}
        </span>
      </div>
    </header>

    <main class="flex-1 flex overflow-hidden">
      <slot />
    </main>
  </div>
</template>
