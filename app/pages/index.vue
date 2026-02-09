<script setup lang="ts">
import { Play, Users, BookOpen, ArrowRight } from "lucide-vue-next";
import { formatCurrency } from "../../utils/format";
import type { Course } from "../types";

const { locale } = useI18n();

// Fetch courses with instructor data populated using _expand
const { data: featuredCourses } = await useFetch<Course[]>(
  "http://localhost:3001/courses?_limit=3&_expand=user",
  { lazy: true },
);

const stats = [
  { labelKey: "home.stats_success", value: "15K+" },
  { labelKey: "home.stats_students", value: "75%" },
  { labelKey: "home.stats_courses", value: "35" },
  { labelKey: "home.stats_years", value: "26" },
  { labelKey: "home.stats_awards", value: "16" },
];
</script>

<template>
  <div class="overflow-x-hidden font-sans">
    <section
      class="relative bg-primary pt-20 pb-40 px-6 rounded-b-[50px] md:rounded-b-[80px]"
    >
      <div
        class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12"
      >
        <div class="text-white max-w-xl flex-1 text-center md:text-left z-10">
          <h1 class="text-4xl md:text-6xl font-bold leading-tight mb-6">
            <span class="text-[#f48c06]">{{ $t("home.hero_title_1") }}</span>
            {{ $t("home.hero_title_2") }}
          </h1>
          <p class="text-lg text-white/90 mb-8 font-light leading-relaxed">
            {{ $t("home.hero_desc") }}
          </p>
          <div class="flex flex-wrap justify-center md:justify-start gap-4">
            <button
              class="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-8 py-3.5 rounded-full font-bold transition-all duration-300"
            >
              {{ $t("home.join_free") }}
            </button>
            <button
              class="group flex items-center gap-3 bg-white text-primary px-6 py-3.5 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div
                class="bg-primary text-white p-1.5 rounded-full group-hover:scale-110 transition-transform"
              >
                <Play class="w-3 h-3 fill-current" />
              </div>
              {{ $t("home.watch_how") }}
            </button>
          </div>
        </div>

        <div class="relative flex-1 w-full max-w-lg">
          <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/10 rounded-full blur-3xl -z-10"
          ></div>
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644"
            alt="Hero Student"
            class="w-full h-[400px] md:h-[500px] object-cover rounded-[40px] shadow-2xl border-4 border-white/20"
          />
        </div>
      </div>
    </section>

    <section class="relative z-10 max-w-7xl mx-auto -mt-20 px-6 mb-24">
      <div
        class="bg-white/90 backdrop-blur-md rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 md:p-12"
      >
        <div
          class="flex flex-wrap justify-center md:justify-between items-center gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100"
        >
          <div
            v-for="(stat, i) in stats"
            :key="i"
            class="w-full md:w-auto pt-4 md:pt-0 px-4"
          >
            <p
              class="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#3da3a5] mb-2 font-display"
            >
              {{ stat.value }}
            </p>
            <p
              class="text-gray-500 font-medium text-sm uppercase tracking-wider"
            >
              {{ $t(stat.labelKey) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-6 mb-24">
      <div
        class="flex flex-col md:flex-row justify-between items-end mb-12 gap-4"
      >
        <div>
          <h2 class="text-3xl font-bold text-[#2f327d] mb-2">
            {{ $t("nav.courses") }}
          </h2>
          <p class="text-gray-500">{{ $t("home.course_subtitle") }}</p>
        </div>
        <NuxtLink
          to="/courses"
          class="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all"
        >
          {{ $t("common.view_all") }} <ArrowRight class="w-5 h-5" />
        </NuxtLink>
      </div>

      <div v-if="!featuredCourses" class="flex justify-center py-12">
        <span class="text-primary">{{ $t("home.loading_courses") }}</span>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="course in featuredCourses"
          :key="course.id"
          class="bg-white rounded-[20px] p-5 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col h-full"
        >
          <NuxtLink
            :to="`/courses/${course.id}`"
            class="relative mb-5 overflow-hidden rounded-xl h-56 block"
          >
            <img
              :src="course.thumbnail"
              class="w-full h-full object-cover transform hover:scale-110 transition duration-700"
            />
            <div
              class="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-lg text-xs font-bold text-primary shadow-sm uppercase tracking-wide"
            >
              {{ course.level }}
            </div>
          </NuxtLink>

          <div class="flex flex-col flex-grow">
            <NuxtLink :to="`/courses/${course.id}`">
              <h3
                class="text-xl font-bold mb-3 text-[#2f327d] line-clamp-2 min-h-[3.5rem] hover:text-primary transition-colors"
              >
                {{ course.name }}
              </h3>
            </NuxtLink>
            <p class="text-gray-500 text-sm mb-6 line-clamp-2">
              {{ course.description }}
            </p>

            <div
              class="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between"
            >
              <div v-if="course.user" class="flex items-center gap-3">
                <img
                  :src="course.user?.avatar"
                  class="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
                />
                <span
                  class="text-sm font-semibold text-gray-700 truncate max-w-[100px]"
                  >{{ course.user?.username }}</span
                >
              </div>
              <span class="text-lg font-bold text-primary">
                {{ formatCurrency(course.price, locale) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-6 mb-32">
      <div class="grid md:grid-cols-2 gap-16 items-center">
        <div class="relative order-2 md:order-1">
          <div
            class="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"
          ></div>
          <div
            class="absolute -bottom-10 -right-10 w-40 h-40 bg-[#f48c06]/20 rounded-full blur-3xl"
          ></div>
          <img
            src="https://images.pexels.com/photos/6517335/pexels-photo-6517335.jpeg"
            class="rounded-[40px] shadow-2xl relative z-10 w-full object-cover"
          />

          <div
            class="absolute -bottom-6 -right-6 md:right-10 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3 animate-bounce"
          >
            <div class="bg-[#f48c06] p-2 rounded-lg text-white">
              <BookOpen class="w-6 h-6" />
            </div>
            <div>
              <p class="text-xs text-gray-500">
                {{ $t("home.total_courses") }}
              </p>
              <p class="font-bold text-[#2f327d]">5,000+</p>
            </div>
          </div>
        </div>

        <div class="order-1 md:order-2">
          <h2
            class="text-3xl md:text-5xl font-bold text-[#2f327d] mb-8 leading-tight"
          >
            {{ $t("home.feature_title") }} <br />
            <span class="text-primary">{{ $t("home.feature_highlight") }}</span>
          </h2>
          <p class="text-gray-600 mb-8 text-lg leading-relaxed">
            {{ $t("home.feature_desc") }}
          </p>
          <ul class="space-y-6">
            <li class="flex items-start gap-4 group">
              <div
                class="bg-white p-3 rounded-xl shadow-md text-primary group-hover:bg-primary group-hover:text-white transition-colors"
              >
                <Users class="w-6 h-6" />
              </div>
              <div>
                <h4 class="font-bold text-[#2f327d] text-lg">
                  {{ $t("home.feature_interaction_title") }}
                </h4>
                <p class="text-gray-500 text-sm mt-1">
                  {{ $t("home.feature_1") }}
                </p>
              </div>
            </li>
            <li class="flex items-start gap-4 group">
              <div
                class="bg-white p-3 rounded-xl shadow-md text-primary group-hover:bg-primary group-hover:text-white transition-colors"
              >
                <BookOpen class="w-6 h-6" />
              </div>
              <div>
                <h4 class="font-bold text-[#2f327d] text-lg">
                  {{ $t("home.feature_notes_title") }}
                </h4>
                <p class="text-gray-500 text-sm mt-1">
                  {{ $t("home.feature_2") }}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>
