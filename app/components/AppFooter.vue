<template>
  <footer class="bg-[#252641] text-white pt-16 pb-8">
    <div class="max-w-7xl mx-auto px-6">
      <div class="max-w-xl mx-auto text-center mb-12">
        <h3 class="text-xl md:text-2xl font-medium mb-6 text-gray-200">
          {{ $t("footer.subscribe_title") }}
        </h3>
        <div class="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            :placeholder="$t('footer.placeholder_email')"
            class="flex-1 bg-transparent border border-gray-600 rounded-full px-6 py-3 outline-none focus:border-primary transition"
          />
          <button
            class="bg-primary px-10 py-3 rounded-full font-bold hover:bg-[#3da3a5] transition"
          >
            {{ $t("footer.subscribe_btn") }}
          </button>
        </div>
      </div>

      <div
        class="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400"
      >
        <p>© 2026 TOTC Inc. All rights reserved.</p>
        <div class="flex gap-6">
          <NuxtLink to="/terms" class="hover:text-white transition">{{
            $t("footer.terms")
          }}</NuxtLink>
          <NuxtLink to="/privacy" class="hover:text-white transition">{{
            $t("footer.privacy")
          }}</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
