<script setup lang="ts">
import { ShoppingCart, Trash2, X } from "lucide-vue-next";
import { useCartStore } from "../../stores/cart";
import { formatCurrency } from "../../utils/format";
import { PATHS } from "../constants/paths";

const { t, locale } = useI18n();
const cartStore = useCartStore();
</script>

<template>
  <div class="relative group z-50">
    <NuxtLink
      :to="PATHS.CART"
      class="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition text-white"
    >
      <ShoppingCart class="w-5 h-5" />
      <span
        v-if="cartStore.count > 0"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-primary"
      >
        {{ cartStore.count }}
      </span>
    </NuxtLink>

    <div
      class="absolute right-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 w-80"
    >
      <div
        class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        <div
          class="px-4 py-3 border-b border-gray-100 flex justify-between items-center"
        >
          <h4 class="font-bold text-gray-800">
            {{ $t("cart.title") }} ({{ cartStore.count }})
          </h4>
        </div>

        <div
          v-if="cartStore.count === 0"
          class="p-6 text-center text-gray-400 text-sm"
        >
          <ShoppingCart class="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p>{{ $t("cart.empty") }}</p>
        </div>

        <div v-else>
          <div class="max-h-64 overflow-y-auto">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="flex gap-3 p-4 border-b border-gray-50 hover:bg-gray-50 transition"
            >
              <img
                :src="item.thumbnail"
                class="w-16 h-12 object-cover rounded-lg flex-shrink-0"
              />
              <div class="flex-1 min-w-0">
                <h5 class="text-sm font-bold text-gray-800 truncate">
                  {{ item.name }}
                </h5>
                <p class="text-xs text-primary font-bold mt-1">
                  {{ formatCurrency(item.price, locale) }}
                </p>
              </div>
              <button
                @click.prevent="cartStore.removeFromCart(item.id)"
                class="text-gray-400 hover:text-red-500 self-center"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div class="p-4 bg-gray-50">
            <div class="flex justify-between items-center mb-4">
              <span class="text-gray-600 font-medium"
                >{{ $t("cart.total") }}:</span
              >
              <span class="text-lg font-bold text-primary">{{
                formatCurrency(cartStore.total, locale)
              }}</span>
            </div>
            <NuxtLink
              :to="PATHS.CART"
              class="block w-full py-2.5 bg-primary text-white text-center rounded-xl font-bold hover:bg-teal-600 transition"
            >
              {{ $t("cart.view_cart") }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
