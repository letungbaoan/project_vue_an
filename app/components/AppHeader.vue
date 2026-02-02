<script setup lang="ts">
import { useAuthStore } from "../../stores/auth";
import { LogOut, Globe } from "lucide-vue-next";

const { locale, setLocale } = useI18n();
const auth = useAuthStore();

const toggleLocale = () => {
  setLocale(locale.value === "vi" ? "en" : "vi");
};

const navLinks = [
  { name: "nav.home", path: "/" },
  { name: "nav.courses", path: "/courses" },
  { name: "nav.careers", path: "/careers" },
  { name: "nav.blog", path: "/blog" },
  { name: "nav.about", path: "/about" },
];
</script>

<template>
  <header class="sticky top-0 z-50 bg-primary py-4 px-6 md:px-12 shadow-md">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <NuxtLink to="/">
        <img src="/logo.png" class="h-10 w-auto" alt="Logo" />
      </NuxtLink>

      <nav class="hidden lg:flex items-center gap-8 text-white font-medium">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="hover:text-teal-100 transition"
        >
          {{ $t(link.name) }}
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

        <template v-if="!auth.isLoggedIn">
          <NuxtLink
            to="/login"
            class="bg-white text-primary px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition"
          >
            {{ $t("auth.login") }}
          </NuxtLink>
        </template>

        <div
          v-else
          class="flex items-center gap-3 bg-white/10 p-1 pr-3 rounded-full border border-white/20"
        >
          <img
            :src="auth.user?.avatar"
            class="w-8 h-8 rounded-full border border-white shadow-sm"
          />
          <span class="text-white text-sm font-medium hidden md:inline">{{
            auth.user?.username
          }}</span>
          <button
            @click="auth.logout()"
            class="text-white hover:text-red-200 transition"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
