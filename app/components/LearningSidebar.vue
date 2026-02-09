<script setup lang="ts">
import {
  LucidePlayCircle,
  LucideCheckCircle,
  LucideLock,
} from "lucide-vue-next";
import type { Lesson } from "../types";

const props = defineProps<{
  lessons: Lesson[];
  currentLessonId: string;
  courseId: string;
  completedLessons: number; // Giả sử chúng ta lưu số lượng bài đã xong
}>();
</script>

<template>
  <div class="flex flex-col">
    <NuxtLink
      v-for="(lesson, index) in lessons"
      :key="lesson.id"
      :to="`/learning/${courseId}/${lesson.id}`"
      class="flex items-center gap-3 p-4 hover:bg-gray-50 border-b transition-colors"
      :class="{
        'bg-teal-50 border-l-4 border-l-primary': lesson.id === currentLessonId,
      }"
    >
      <div class="flex-shrink-0">
        <LucideCheckCircle
          v-if="index < completedLessons"
          class="text-primary"
          :size="20"
        />
        <LucidePlayCircle
          v-else
          :class="
            lesson.id === currentLessonId ? 'text-primary' : 'text-gray-400'
          "
          :size="20"
        />
      </div>

      <div class="flex-1 min-w-0">
        <p
          class="text-sm font-medium truncate"
          :class="{ 'text-primary font-bold': lesson.id === currentLessonId }"
        >
          {{ index + 1 }}. {{ lesson.name }}
        </p>
        <span class="text-xs text-gray-500"
          >{{ Math.floor(lesson.duration / 60) }} min</span
        >
      </div>
    </NuxtLink>
  </div>
</template>
