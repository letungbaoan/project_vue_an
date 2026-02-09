<template>
  <div class="container mx-auto py-10 px-4">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-[#252641]">
        {{ t("nav.my_courses") }}
      </h1>
      <p class="text-gray-500 mt-2">
        {{
          locale === "vi"
            ? "Tiếp tục hành trình chinh phục kiến thức của bạn."
            : "Continue your journey to conquer knowledge."
        }}
      </p>
    </div>

    <div
      v-if="pending"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="h-80 bg-gray-200 animate-pulse rounded-3xl"
      ></div>
    </div>

    <div
      v-else-if="enrolledCourses.length === 0"
      class="text-center py-20 bg-white rounded-3xl shadow-sm"
    >
      <LucideBookOpen class="mx-auto h-16 w-16 text-gray-300 mb-4" />
      <h3 class="text-xl font-medium text-gray-900">
        {{ t("my_purchases.empty") }}
      </h3>
      <p class="text-gray-500 mt-2 mb-6">
        {{ t("my_purchases.empty_desc") }}
      </p>
      <NuxtLink
        to="/courses"
        class="text-primary font-semibold hover:underline"
      >
        {{ t("common.view_all") }} {{ t("nav.courses") }} →
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="item in enrolledCourses"
        :key="item.id"
        class="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
      >
        <div class="relative h-48 overflow-hidden">
          <img
            :src="item.course?.thumbnail"
            :alt="item.course?.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div
            class="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold"
          >
            {{ item.course?.category }}
          </div>
        </div>

        <div class="p-6 flex flex-col flex-1">
          <h3
            class="text-lg font-bold text-[#252641] line-clamp-2 mb-4 h-14 leading-tight"
          >
            {{ item.course?.name }}
          </h3>

          <div class="mt-auto">
            <div class="flex justify-between text-sm mb-2">
              <span class="text-gray-500 font-medium">
                {{ locale === "vi" ? "Tiến độ" : "Progress" }}
              </span>
              <span class="text-primary font-bold"
                >{{ item.progressPercent }}%</span
              >
            </div>
            <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                class="bg-primary h-full transition-all duration-700 ease-out"
                :style="{ width: `${item.progressPercent}%` }"
              ></div>
            </div>
          </div>

          <NuxtLink
            :to="`/learning/${item.courseId}/default`"
            class="mt-6 block text-center bg-[#252641] text-white py-3 rounded-xl font-semibold hover:bg-opacity-90 transition shadow-md"
          >
            {{
              item.progressPercent > 0
                ? t("checkout.go_to_learning")
                : t("checkout.go_to_learning")
            }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "../../stores/auth";
import type { Enrollment, Course } from "../types";

const { t, locale } = useI18n();
const auth = useAuthStore();
const enrolledCourses = ref<(Enrollment & { course?: Course })[]>([]);
const pending = ref(true);

const fetchMyCourses = async () => {
  try {
    // 1. Lấy danh sách enrollments của user
    const enrollments = await $fetch<Enrollment[]>(
      `http://localhost:3001/enrollments`,
      {
        params: { userId: auth.user?.id },
      },
    );

    if (enrollments.length > 0) {
      // 2. Fetch danh sách course details dựa trên courseId từ enrollments
      const courseIds = enrollments.map((e) => e.courseId);
      const query = courseIds.map((id) => `id=${id}`).join("&");
      const courses = await $fetch<Course[]>(
        `http://localhost:3001/courses?${query}`,
      );

      // 3. Kết hợp dữ liệu
      enrolledCourses.value = enrollments.map((en) => ({
        ...en,
        course: courses.find((c) => c.id === en.courseId),
      }));
    }
  } catch (error) {
    console.error("Failed to fetch my courses:", error);
  } finally {
    pending.value = false;
  }
};

onMounted(() => {
  if (auth.isLoggedIn) {
    fetchMyCourses();
  } else {
    // Nếu chưa login thì về trang chủ hoặc login
    navigateTo("/login");
  }
});
</script>
