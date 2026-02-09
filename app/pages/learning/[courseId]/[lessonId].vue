<script setup lang="ts">
import { useAuthStore } from "../../../../stores/auth";
import { useLearningStore } from "../../../../stores/learning"; // Import Store
import type { Course, Lesson, Enrollment } from "../../../types";

// Tắt layout mặc định để dùng thủ công
definePageMeta({
  layout: false,
});

const route = useRoute();
const { t } = useI18n();
const auth = useAuthStore();
const learningStore = useLearningStore(); // Khởi tạo store

const courseId = route.params.courseId as string;
const lessonId = route.params.lessonId as string;

const course = ref<Course | null>(null);
const lessons = ref<Lesson[]>([]);
const loading = ref(true);

const fetchData = async () => {
  try {
    const [courseData, lessonsData, enrollData] = await Promise.all([
      $fetch<Course>(`http://localhost:3001/courses/${courseId}`),
      $fetch<Lesson[]>(`http://localhost:3001/lessons`, {
        params: { courseId, _sort: "order", _order: "asc" },
      }),
      $fetch<Enrollment[]>(`http://localhost:3001/enrollments`, {
        params: { courseId, userId: auth.user?.id },
      }),
    ]);

    course.value = courseData;
    lessons.value = lessonsData;

    learningStore.initData({
      enrollment: enrollData[0] || null,
      lessons: lessonsData,
    });
  
    if (lessonId === "default" && lessonsData[0]) {
      return navigateTo(`/learning/${courseId}/${lessonsData[0].id}`);
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);

// Cập nhật currentLesson vào store mỗi khi lessonId thay đổi
const currentLesson = computed(() => {
  const lesson = lessons.value.find((l) => l.id === lessonId);
  if (lesson) learningStore.currentLesson = lesson;
  return lesson;
});

const handleNextLesson = () => {
  const currentIndex = lessons.value.findIndex((l) => l.id === lessonId);
  if (currentIndex !== -1 && currentIndex < lessons.value.length - 1) {
    const nextLesson = lessons.value[currentIndex + 1];
    if (nextLesson) {
      navigateTo(`/learning/${courseId}/${nextLesson.id}`);
    }
  }
};
</script>

<template>
  <NuxtLayout
    name="learning"
    :course-name="course?.name"
    :progress="learningStore.enrollment?.progressPercent"
    :course-id="courseId"
  >
    <div
      v-if="!loading"
      class="flex flex-col lg:flex-row w-full h-full overflow-hidden"
    >
      <div class="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
        <div class="aspect-video bg-black w-full shrink-0 shadow-2xl">
          <LearningVideo
            v-if="currentLesson"
            :lesson="currentLesson"
            @ended="handleNextLesson"
          />
        </div>

        <div class="p-8">
          <h2 class="text-2xl font-bold text-[#252641] mb-6">
            {{ currentLesson?.name }}
          </h2>

          <LearningTabs
            v-if="currentLesson"
            :lesson="currentLesson"
            :course="course"
          />
        </div>
      </div>

      <div class="w-full lg:w-[400px] border-l bg-white flex flex-col shrink-0">
        <div
          class="p-5 border-b flex justify-between items-center bg-gray-50/50"
        >
          <h3 class="font-bold text-lg text-[#252641]">
            {{ t("course_detail.curriculum") }}
          </h3>
          <span
            class="text-xs font-bold px-3 py-1 bg-teal-100 text-primary rounded-full"
          >
            {{ lessons.length }} {{ t("course_detail.lessons") }}
          </span>
        </div>

        <div class="overflow-y-auto flex-1">
          <LearningSidebar
            :lessons="lessons"
            :current-lesson-id="lessonId"
            :course-id="courseId"
            :completed-lessons="learningStore.enrollment?.completedLessons || 0"
          />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
