<script setup lang="ts">
import { useCartStore } from "../../stores/cart";
import { formatCurrency } from "../../utils/format";
import { Trash2, ArrowRight, ShoppingBag, CreditCard } from "lucide-vue-next";
import { PATHS } from "../constants/paths";
import { toast } from "vue3-toastify";

const { t, locale } = useI18n();
const cartStore = useCartStore();

const handleCheckout = () => {
  if (cartStore.count === 0) return;
  navigateTo(PATHS.CHECKOUT);
};
</script>

<template>
  <div class="bg-gray-50 min-h-screen py-12 font-sans">
    <div class="max-w-7xl mx-auto px-6">
      <h1 class="text-3xl md:text-4xl font-bold text-[#2f327d] mb-8">
        {{ $t("cart.title") }}
        <span
          v-if="cartStore.count > 0"
          class="text-lg text-gray-500 font-medium ml-2"
        >
          ({{ $t("cart.course_count", { count: cartStore.count }) }})
        </span>
      </h1>

      <div
        v-if="cartStore.count === 0"
        class="flex flex-col items-center justify-center bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 min-h-[400px]"
      >
        <div
          class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 animate-pulse"
        >
          <ShoppingBag class="w-10 h-10 text-gray-300" />
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">
          {{ $t("cart.empty") }}
        </h3>
        <p class="text-gray-500 mb-8 max-w-md">
          {{ $t("cart.empty_desc") }}
        </p>
        <NuxtLink
          :to="PATHS.COURSES"
          class="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-teal-600 transition shadow-lg shadow-primary/30"
        >
          {{ $t("nav.courses") }} <ArrowRight class="w-5 h-5" />
        </NuxtLink>
      </div>

      <div v-else class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-4">
          <transition-group name="list" tag="div" class="space-y-4">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="group bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 md:gap-6 hover:shadow-md transition-all duration-300"
            >
              <NuxtLink
                :to="PATHS.COURSE_DETAIL(item.id)"
                class="shrink-0 overflow-hidden rounded-xl w-28 h-20 md:w-40 md:h-28"
              >
                <img
                  :src="item.thumbnail"
                  class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  alt="Course thumbnail"
                />
              </NuxtLink>

              <div class="flex-1 flex flex-col justify-between py-1">
                <div>
                  <div class="flex justify-between items-start gap-4">
                    <NuxtLink :to="PATHS.COURSE_DETAIL(item.id)">
                      <h3
                        class="font-bold text-[#2f327d] text-base md:text-lg line-clamp-2 group-hover:text-primary transition-colors"
                      >
                        {{ item.name }}
                      </h3>
                    </NuxtLink>
                    <span class="md:hidden text-primary font-bold text-sm">
                      {{ formatCurrency(item.price, locale) }}
                    </span>
                  </div>
                  <p
                    class="text-xs md:text-sm text-gray-500 mt-1 flex items-center gap-1"
                  >
                    By
                    <span class="font-medium text-gray-700">{{
                      item.instructorName
                    }}</span>
                  </p>
                </div>

                <div class="flex justify-between items-end mt-3">
                  <button
                    @click="cartStore.removeFromCart(item.id)"
                    class="text-gray-400 hover:text-red-500 flex items-center gap-1.5 text-xs md:text-sm transition font-medium px-2 py-1 -ml-2 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 class="w-4 h-4" />
                    {{ $t("cart.remove") }}
                  </button>

                  <span class="hidden md:block text-primary font-bold text-xl">
                    {{ formatCurrency(item.price, locale) }}
                  </span>
                </div>
              </div>
            </div>
          </transition-group>
        </div>

        <div class="lg:col-span-1">
          <div
            class="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-28"
          >
            <h3
              class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"
            >
              <CreditCard class="w-5 h-5 text-primary" />
              {{ $t("cart.total") }}
            </h3>

            <div class="space-y-4 mb-8">
              <div class="flex justify-between text-secondary text-sm">
                <span>{{ $t("cart.subtotal") }}</span>
                <span class="font-medium">{{
                  formatCurrency(cartStore.total, locale)
                }}</span>
              </div>
              <div class="h-px bg-gray-100 my-2"></div>
              <div class="flex justify-between items-end">
                <span class="text-gray-800 font-bold">{{
                  $t("cart.total")
                }}</span>
                <span class="text-2xl font-bold text-primary">{{
                  formatCurrency(cartStore.total, locale)
                }}</span>
              </div>
            </div>

            <button
              @click="handleCheckout"
              class="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-teal-600 shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
            >
              {{ $t("cart.checkout") }}
              <ArrowRight class="w-5 h-5" />
            </button>

            <p class="text-center text-xs text-gray-400 mt-4">
              {{ $t("cart.secure_payment") }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-active {
  position: absolute;
  width: 100%;
}
</style>
