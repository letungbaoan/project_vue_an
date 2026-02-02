<script setup lang="ts">
import { ArrowUpRight, Star, StarHalf } from "lucide-vue-next";
import { formatCurrency } from "../../utils/format";
import { calculateStars } from "../../utils/rating";
import type { Course } from "../types";

const { locale } = useI18n();

defineProps<{
  course: Course;
}>();
</script>

<template>
  <div
    class="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group h-full"
  >
    <NuxtLink
      :to="`/courses/${course.id}`"
      class="block relative mb-4 overflow-hidden rounded-2xl h-48 cursor-pointer"
    >
      <img
        :src="course.thumbnail"
        class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        alt="Course Thumbnail"
      />
      <div
        class="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm uppercase"
      >
        {{ course.level }}
      </div>
    </NuxtLink>

    <div class="flex flex-col flex-grow">
      <NuxtLink :to="`/courses/${course.id}`">
        <h3
          class="text-lg font-bold mb-2 text-[#2f327d] line-clamp-2 group-hover:text-primary transition-colors"
        >
          {{ course.name }}
        </h3>
      </NuxtLink>

      <div class="flex items-center gap-2 mb-4">
        <img
          :src="course.user?.avatar"
          class="w-6 h-6 rounded-full object-cover"
          alt="Instructor"
        />
        <span class="text-xs text-secondary truncate">{{
          course.user?.username
        }}</span>
      </div>

      <div
        class="flex items-center gap-1 mb-4 text-xs font-medium text-gray-500"
      >
        <div class="flex">
          <template
            v-for="(state, index) in calculateStars(course.rating)"
            :key="index"
          >
            <Star
              v-if="state === 'full'"
              class="w-3.5 h-3.5 text-yellow-400 fill-current"
            />

            <StarHalf
              v-else-if="state === 'half'"
              class="w-3.5 h-3.5 text-yellow-400 fill-current"
            />

            <Star v-else class="w-3.5 h-3.5 text-gray-300" />
          </template>
        </div>
        <span class="ml-1 pt-0.5">({{ course.rating }})</span>
      </div>

      <div
        class="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between"
      >
        <span class="text-xl font-bold text-primary">
          {{ formatCurrency(course.price, locale) }}
        </span>
        <NuxtLink
          :to="`/courses/${course.id}`"
          class="p-2 bg-gray-50 rounded-full text-gray-400 hover:bg-primary hover:text-white transition-all"
        >
          <ArrowUpRight class="w-5 h-5" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
