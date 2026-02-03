<script setup lang="ts">
// Lấy locale hiện tại và hàm đổi ngôn ngữ
const { locale, setLocale } = useI18n();
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4"
  >
    <div class="mb-6 bg-white p-2 rounded-lg shadow-sm flex gap-2">
      <button
        @click="setLocale('vi')"
        class="px-4 py-2 rounded transition-colors"
        :class="
          locale === 'vi'
            ? 'bg-indigo-600 text-white font-bold'
            : 'text-gray-600 hover:bg-gray-100'
        "
      >
        Tiếng Việt
      </button>
      <button
        @click="setLocale('en')"
        class="px-4 py-2 rounded transition-colors"
        :class="
          locale === 'en'
            ? 'bg-indigo-600 text-white font-bold'
            : 'text-gray-600 hover:bg-gray-100'
        "
      >
        English
      </button>
    </div>

    <div
      class="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-200 transition-all"
    >
      <h1 class="text-3xl font-bold text-indigo-600 mb-4 text-center">
        {{ $t("hello") }}
      </h1>

      <p class="text-gray-600 mb-6 text-center">
        {{ $t("desc") }}
      </p>

      <button
        class="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
      >
        {{ $t("button") }}
      </button>

      <div class="mt-4 text-center text-xs text-gray-400">
        Current Locale:
        <span class="font-mono font-bold text-indigo-500">{{ locale }}</span>
      </div>
    </div>
  </div>
</template>
