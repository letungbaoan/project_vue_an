<script setup lang="ts">
import { useAuthStore } from "../../stores/auth";
import type { Lesson, Course } from "../types";
import LearningNotes from "../components/LearningNotes.vue";
import LearningDiscussion from "../components/LearningDiscussion.vue";

const props = defineProps<{
  lesson: Lesson;
  course: Course | null;
}>();

const { t } = useI18n();
const activeTab = ref("overview");
</script>

<template>
  <div class="mt-8">
    <div class="flex border-b border-gray-200 gap-8 mb-6 overflow-x-auto">
      <button
        @click="activeTab = 'overview'"
        class="pb-3 text-sm font-bold transition-all relative px-2 whitespace-nowrap"
        :class="
          activeTab === 'overview'
            ? 'text-primary'
            : 'text-gray-400 hover:text-gray-600'
        "
      >
        {{ t("course_detail.overview") }}
        <div
          v-if="activeTab === 'overview'"
          class="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"
        ></div>
      </button>

      <button
        @click="activeTab = 'notes'"
        class="pb-3 text-sm font-bold transition-all relative px-2 whitespace-nowrap"
        :class="
          activeTab === 'notes'
            ? 'text-primary'
            : 'text-gray-400 hover:text-gray-600'
        "
      >
        {{ t("home.feature_notes_title") }}
        <div
          v-if="activeTab === 'notes'"
          class="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"
        ></div>
      </button>

      <button
        @click="activeTab = 'discussion'"
        class="pb-3 text-sm font-bold transition-all relative px-2 whitespace-nowrap"
        :class="
          activeTab === 'discussion'
            ? 'text-primary'
            : 'text-gray-400 hover:text-gray-600'
        "
      >
        {{ t("discussion.title") }}
        <div
          v-if="activeTab === 'discussion'"
          class="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"
        ></div>
      </button>
    </div>

    <div class="min-h-[300px]">
      <div v-show="activeTab === 'overview'" class="animate-fade-in">
        <h3 class="text-xl font-bold text-[#252641] mb-4">
          {{ t("course_detail.overview") }}
        </h3>
        <div class="prose max-w-none text-gray-600 leading-relaxed">
          <p v-if="lesson.content">{{ lesson.content }}</p>
          <p v-else class="italic text-gray-400">
            Chưa có mô tả cho bài học này.
          </p>
        </div>
      </div>

      <KeepAlive>
        <div v-if="activeTab === 'notes'" class="animate-fade-in">
          <LearningNotes :lesson-id="lesson.id" />
        </div>
      </KeepAlive>

      <KeepAlive>
        <div v-if="activeTab === 'discussion'" class="animate-fade-in">
          <div v-if="activeTab === 'discussion'" class="animate-fade-in">
            <LearningDiscussion
              :lesson-id="lesson.id"
              :course-id="course?.id || ''"
            />
          </div>
        </div>
      </KeepAlive>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
