<script setup lang="ts">
import { useAuthStore } from "../../stores/auth";
import { formatCurrency } from "../../utils/format";
import { PATHS } from "../constants/paths";
import {
  ShoppingBag,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
} from "lucide-vue-next";
import type { Order, Course } from "../types";

const { t, locale } = useI18n();
const auth = useAuthStore();

if (!auth.isLoggedIn) {
  navigateTo(PATHS.LOGIN);
}

const { data: orders, pending: loadingOrders } = await useFetch<Order[]>(
  `http://localhost:3001/orders`,
  {
    query: {
      userId: auth.user?.id,
      _sort: "createdAt",
      _order: "desc",
    },
    watch: [() => auth.user],
  },
);

const { data: courses } = await useFetch<Course[]>(
  `http://localhost:3001/courses?_expand=instructor`,
);

const getCourseInfo = (courseId: string) => {
  return courses.value?.find((c) => c.id === courseId);
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString(
    locale.value === "vi" ? "vi-VN" : "en-GB",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "success":
      return "bg-green-100 text-green-700 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "failed":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "success":
      return CheckCircle;
    case "pending":
      return Clock;
    case "failed":
      return AlertCircle;
    default:
      return Clock;
  }
};
</script>

<template>
  <div class="bg-gray-50 min-h-screen py-12 font-sans">
    <div class="max-w-5xl mx-auto px-6">
      <h1
        class="text-3xl font-bold text-[#2f327d] mb-8 flex items-center gap-3"
      >
        <ShoppingBag class="w-8 h-8 text-primary" />
        {{ $t("my_purchases.title") }}
      </h1>

      <div v-if="loadingOrders" class="space-y-4">
        <div
          v-for="i in 3"
          :key="i"
          class="h-40 bg-white rounded-3xl animate-pulse"
        ></div>
      </div>

      <div
        v-else-if="!orders || orders.length === 0"
        class="flex flex-col items-center justify-center bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 min-h-[400px]"
      >
        <div
          class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6"
        >
          <ShoppingBag class="w-10 h-10 text-gray-300" />
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">
          {{ $t("my_purchases.empty") }}
        </h3>
        <p class="text-gray-500 mb-8">{{ $t("my_purchases.empty_desc") }}</p>
        <NuxtLink
          :to="PATHS.COURSES"
          class="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-600 transition"
        >
          {{ $t("nav.courses") }}
        </NuxtLink>
      </div>

      <div v-else class="space-y-6">
        <div
          v-for="order in orders"
          :key="order.id"
          class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
        >
          <div
            class="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center"
          >
            <div class="flex items-center gap-4">
              <span class="font-bold text-gray-800">
                {{
                  $t("my_purchases.order_id", { id: order.id.toUpperCase() })
                }}
              </span>
              <div
                class="flex items-center gap-2 text-xs text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200"
              >
                <Calendar class="w-3.5 h-3.5" />
                {{ formatDate(order.createdAt) }}
              </div>
            </div>

            <div
              :class="[
                'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border capitalize',
                getStatusColor(order.status),
              ]"
            >
              <component
                :is="getStatusIcon(order.status)"
                class="w-3.5 h-3.5"
              />
              {{ $t(`my_purchases.status.${order.status}`) }}
            </div>
          </div>

          <div class="p-6">
            <div class="space-y-6">
              <div
                v-for="item in order.items"
                :key="item.courseId"
                class="flex gap-4 md:gap-6 items-center"
              >
                <NuxtLink
                  :to="PATHS.COURSE_DETAIL(item.courseId)"
                  class="shrink-0"
                >
                  <img
                    :src="
                      getCourseInfo(item.courseId)?.thumbnail ||
                      'https://via.placeholder.com/150'
                    "
                    class="w-20 h-14 md:w-28 md:h-20 object-cover rounded-lg border border-gray-100"
                  />
                </NuxtLink>

                <div class="flex-1 min-w-0">
                  <NuxtLink :to="PATHS.COURSE_DETAIL(item.courseId)">
                    <h4
                      class="font-bold text-[#2f327d] text-sm md:text-base line-clamp-2 hover:text-primary transition"
                    >
                      {{ item.courseName }}
                    </h4>
                  </NuxtLink>
                  <p class="text-xs text-gray-500 mt-1">
                    {{
                      getCourseInfo(item.courseId)?.instructor?.username ||
                      "Unknown Instructor"
                    }}
                  </p>
                </div>

                <div class="text-right">
                  <span
                    class="block font-bold text-primary text-sm md:text-base"
                  >
                    {{ formatCurrency(item.price, locale) }}
                  </span>
                </div>
              </div>
            </div>

            <div
              class="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center"
            >
              <span class="text-sm text-gray-500">
                {{
                  $t("my_purchases.item_count", { count: order.items.length })
                }}
              </span>
              <div class="flex items-center gap-4">
                <span class="text-gray-600 font-medium"
                  >{{ $t("my_purchases.total") }}:</span
                >
                <span class="text-xl font-bold text-[#2f327d]">
                  {{ formatCurrency(order.totalAmount, locale) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
