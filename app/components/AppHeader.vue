<script setup lang="ts">
import { useAuthStore } from "../../stores/auth";
import {
  LogOut,
  Globe,
  Menu,
  X,
  User,
  BookOpen,
  ChevronDown,
  ShoppingBag,
} from "lucide-vue-next";
import { PATHS } from "../constants/paths";

const { locale, setLocale } = useI18n();
const auth = useAuthStore();
const isMenuOpen = ref(false);

const toggleLocale = () => {
  setLocale(locale.value === "vi" ? "en" : "vi");
};

const navLinks = [
  { name: "nav.home", path: PATHS.HOME },
  { name: "nav.courses", path: PATHS.COURSES },
  { name: "nav.careers", path: PATHS.CAREER },
  { name: "nav.blog", path: PATHS.BLOG },
  { name: "nav.about", path: PATHS.ABOUT },
];

// Menu items cho dropdown user
const userMenuItems = [
  { name: "nav.profile", path: PATHS.PROFILE, icon: User },
  { name: "nav.my_courses", path: PATHS.MY_COURSES, icon: BookOpen },
  { name: "nav.my_purchases", path: PATHS.MY_PURCHASES, icon: ShoppingBag },
];
</script>

<template>
  <header
    class="sticky top-0 z-50 bg-primary py-4 px-6 md:px-12 shadow-md transition-colors"
  >
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <NuxtLink :to="PATHS.HOME">
        <img src="/logo.png" class="h-10 w-auto" alt="Logo" />
      </NuxtLink>

      <nav class="hidden lg:flex items-center gap-8 text-white font-medium">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="hover:text-teal-100 transition relative group"
        >
          {{ $t(link.name) }}
          <span
            class="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-100 transition-all group-hover:w-full"
          ></span>
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-4">
        <button
          @click="toggleLocale"
          class="flex items-center gap-2 text-white text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full hover:bg-white/30 transition uppercase"
        >
          <Globe class="w-3.5 h-3.5" />
          {{ locale }}
        </button>

        <CartDropdown />

        <template v-if="!auth.isLoggedIn">
          <NuxtLink
            :to="PATHS.LOGIN"
            class="hidden md:block bg-white text-primary px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition shadow-sm"
          >
            {{ $t("auth.login") }}
          </NuxtLink>
        </template>

        <div v-else class="relative group z-50">
          <button
            class="flex items-center gap-3 bg-white/10 p-1 pr-3 rounded-full border border-white/20 hover:bg-white/20 transition cursor-pointer"
          >
            <img
              :src="auth.user?.avatar || 'https://i.pravatar.cc/150'"
              class="w-8 h-8 rounded-full border border-white shadow-sm object-cover"
            />
            <span
              class="text-white text-sm font-medium hidden md:inline max-w-[100px] truncate"
            >
              {{ auth.user?.username }}
            </span>
            <ChevronDown
              class="w-4 h-4 text-white/70 group-hover:rotate-180 transition-transform duration-300"
            />
          </button>

          <div
            class="absolute right-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2"
          >
            <div
              class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden min-w-[220px] py-2"
            >
              <div class="px-4 py-3 border-b border-gray-100 mb-1">
                <p class="text-sm font-bold text-gray-800 truncate">
                  {{ auth.user?.username }}
                </p>
                <p class="text-xs text-gray-500 truncate">
                  {{ auth.user?.email }}
                </p>
              </div>

              <NuxtLink
                v-for="item in userMenuItems"
                :key="item.path"
                :to="item.path"
                class="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary hover:bg-gray-50 hover:text-primary transition-colors"
              >
                <component :is="item.icon" class="w-4 h-4" />
                {{ $t(item.name) }}
              </NuxtLink>

              <div class="h-px bg-gray-100 my-1 mx-4"></div>

              <button
                @click="auth.logout()"
                class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left font-medium"
              >
                <LogOut class="w-4 h-4" />
                {{ $t("nav.logout") }}
              </button>
            </div>
          </div>
        </div>

        <button
          class="lg:hidden text-white ml-2"
          @click="isMenuOpen = !isMenuOpen"
        >
          <Menu v-if="!isMenuOpen" />
          <X v-else />
        </button>
      </div>
    </div>
  </header>
</template>
