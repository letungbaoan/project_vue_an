<script setup lang="ts">
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  X,
} from "lucide-vue-next";
import type { Course } from "../../types";

const { t, locale } = useI18n();

// --- CONSTANTS ---
const EXCHANGE_RATE = 25000;
const PAGE_LIMIT = 6;

// --- STATE ---
const searchQuery = ref("");
const selectedLevel = ref("");
const minPriceInput = ref<number | null>(null);
const maxPriceInput = ref<number | null>(null);
const sortOption = ref("created_at_desc");
const isFilterOpen = ref(false);

const page = useState("courses-page", () => 1);
const totalCourses = useState("courses-total", () => 0);

// --- OPTIONS ---
const levels = ["Beginner", "Intermediate", "Advanced"];
const sortOptions = [
  { value: "name_asc", label: "courses.sort_name_asc" },
  { value: "name_desc", label: "courses.sort_name_desc" },
  { value: "price_asc", label: "courses.sort_price_asc" },
  { value: "price_desc", label: "courses.sort_price_desc" },
];

// --- UI COMPUTED ---
const currencySymbol = computed(() => (locale.value === "vi" ? "đ" : "$"));
const pricePlaceholder = computed(() =>
  locale.value === "vi" ? "500.000" : "20",
);

// Tính tổng số trang
const totalPages = computed(() => Math.ceil(totalCourses.value / PAGE_LIMIT));

// --- QUERY COMPUTED (CORE LOGIC) ---
const queryParams = computed(() => {
  const [field, order] = sortOption.value.split("_");

  let finalMin = minPriceInput.value;
  let finalMax = maxPriceInput.value;

  if (locale.value === "en") {
    if (finalMin !== null) finalMin = finalMin * EXCHANGE_RATE;
    if (finalMax !== null) finalMax = finalMax * EXCHANGE_RATE;
  }

  return {
    name_like: searchQuery.value || undefined,
    level: selectedLevel.value || undefined,
    price_gte: finalMin || undefined,
    price_lte: finalMax || undefined,
    _sort: field,
    _order: order,
    _page: page.value,
    _limit: PAGE_LIMIT,
    _expand: "user",
  };
});

// --- FETCH DATA ---
const { data: courses, status } = await useFetch<Course[]>(
  "http://localhost:3001/courses",
  {
    query: queryParams,
    watch: [queryParams],
    onResponse({ response }) {
      const totalHeader = response.headers.get("X-Total-Count");
      if (totalHeader) {
        totalCourses.value = parseInt(totalHeader, 10);
      }
    },
  },
);

// --- ACTIONS ---
const resetFilters = () => {
  searchQuery.value = "";
  selectedLevel.value = "";
  minPriceInput.value = null;
  maxPriceInput.value = null;
  sortOption.value = "name_asc";
  page.value = 1;
};

const changePage = (newPage: number) => {
  page.value = newPage;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Reset về trang 1 khi thay đổi bất kỳ bộ lọc nào (trừ page)
watch(
  [searchQuery, selectedLevel, minPriceInput, maxPriceInput, sortOption],
  () => {
    page.value = 1;
  },
);

// Reset input giá khi đổi ngôn ngữ
watch(locale, () => {
  minPriceInput.value = null;
  maxPriceInput.value = null;
});
</script>

<template>
  <div class="bg-gray-50 min-h-screen pb-20 font-sans">
    <div class="bg-primary py-12 px-6 rounded-b-[40px] mb-8 shadow-sm">
      <div class="max-w-7xl mx-auto text-center">
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-6">
          {{ $t("courses.title") }}
        </h1>

        <div class="relative max-w-2xl mx-auto">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('courses.search_placeholder')"
            class="w-full pl-14 pr-6 py-4 rounded-2xl bg-white text-secondary outline-none focus:ring-4 focus:ring-white/20 shadow-xl transition-all"
          />
          <Search class="absolute left-5 top-4 w-6 h-6 text-primary" />
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6">
      <div
        class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4"
      >
        <button
          @click="isFilterOpen = true"
          class="lg:hidden flex items-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition w-full sm:w-auto justify-center"
        >
          <Filter class="w-5 h-5" />
          {{ $t("courses.filter_title") }}
        </button>

        <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span class="text-secondary whitespace-nowrap hidden sm:inline"
            >{{ $t("courses.sort_by") }}:</span
          >
          <div class="relative w-full sm:w-64">
            <select
              v-model="sortOption"
              class="w-full appearance-none bg-white border border-gray-200 px-5 py-3 rounded-xl text-secondary outline-none focus:border-primary cursor-pointer font-medium shadow-sm"
            >
              <option
                v-for="opt in sortOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ $t(opt.label) }}
              </option>
            </select>
            <ChevronDown
              class="absolute right-4 top-3.5 w-4 h-4 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-4 gap-8 items-start">
        <aside
          class="fixed inset-0 z-50 lg:static lg:z-0 lg:block transition-all duration-300"
          :class="
            isFilterOpen
              ? 'visible opacity-100'
              : 'invisible opacity-0 lg:visible lg:opacity-100'
          "
        >
          <div
            class="absolute inset-0 bg-black/50 lg:hidden transition-opacity"
            @click="isFilterOpen = false"
          ></div>

          <div
            class="absolute left-0 top-0 bottom-0 w-80 bg-white p-6 shadow-2xl lg:static lg:w-auto lg:shadow-sm lg:rounded-3xl lg:border lg:border-gray-100 transform transition-transform duration-300 overflow-y-auto"
            :class="
              isFilterOpen
                ? 'translate-x-0'
                : '-translate-x-full lg:translate-x-0'
            "
          >
            <div class="flex items-center justify-between mb-8 lg:mb-6">
              <div
                class="flex items-center gap-2 text-primary font-bold text-xl"
              >
                <Filter class="w-5 h-5" />
                {{ $t("courses.filter_title") }}
              </div>
              <button
                @click="isFilterOpen = false"
                class="lg:hidden text-gray-400 hover:text-red-500"
              >
                <X class="w-6 h-6" />
              </button>
            </div>

            <div class="space-y-8">
              <div>
                <label class="block text-secondary font-bold mb-4">{{
                  $t("courses.level")
                }}</label>
                <div class="space-y-3">
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      value=""
                      v-model="selectedLevel"
                      class="w-5 h-5 text-primary focus:ring-primary border-gray-300 accent-primary"
                    />
                    <span
                      class="text-secondary group-hover:text-primary transition font-medium"
                      >{{ $t("courses.all_levels") }}</span
                    >
                  </label>
                  <label
                    v-for="lvl in levels"
                    :key="lvl"
                    class="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      :value="lvl"
                      v-model="selectedLevel"
                      class="w-5 h-5 text-primary focus:ring-primary border-gray-300 accent-primary"
                    />
                    <span
                      class="text-secondary group-hover:text-primary transition font-medium"
                      >{{ lvl }}</span
                    >
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-secondary font-bold mb-4">{{
                  $t("courses.price_range")
                }}</label>
                <div class="grid grid-cols-2 gap-2">
                  <div class="relative">
                    <input
                      v-model.number="minPriceInput"
                      type="number"
                      :placeholder="pricePlaceholder"
                      class="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <span
                      class="absolute right-3 top-2 text-gray-400 font-medium text-sm select-none"
                      >{{ currencySymbol }}</span
                    >
                  </div>
                  <div class="relative">
                    <input
                      v-model.number="maxPriceInput"
                      type="number"
                      :placeholder="pricePlaceholder"
                      class="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <span
                      class="absolute right-3 top-2 text-gray-400 font-medium text-sm select-none"
                      >{{ currencySymbol }}</span
                    >
                  </div>
                </div>
              </div>

              <button
                @click="resetFilters"
                class="w-full py-3 text-sm font-bold text-gray-500 bg-gray-50 hover:bg-primary hover:text-white rounded-xl transition-all duration-300"
              >
                {{ $t("courses.reset") }}
              </button>
            </div>
          </div>
        </aside>

        <div class="lg:col-span-3 w-full flex flex-col min-h-[600px]">
          <div
            v-if="status === 'pending'"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <div
              v-for="n in 6"
              :key="n"
              class="bg-white h-80 rounded-3xl animate-pulse shadow-sm border border-gray-100"
            ></div>
          </div>

          <div
            v-else-if="!courses || courses.length === 0"
            class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 text-center"
          >
            <div class="bg-gray-50 p-6 rounded-full mb-4">
              <SlidersHorizontal class="w-10 h-10 text-gray-400" />
            </div>
            <h3 class="text-lg font-bold text-secondary mb-2">
              {{ $t("courses.no_results") }}
            </h3>
            <p class="text-gray-500 mb-6 max-w-xs text-sm">
              {{ $t("courses.no_results_desc") }}
            </p>
            <button
              @click="resetFilters"
              class="text-primary font-bold hover:underline"
            >
              {{ $t("courses.reset") }}
            </button>
          </div>

          <div v-else>
            <div
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <CourseCard
                v-for="course in courses"
                :key="course.id"
                :course="course"
              />
            </div>

            <Pagination
              :current-page="page"
              :total-pages="totalPages"
              @change="changePage"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
