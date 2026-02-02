<script setup lang="ts">
import { PATHS } from "../constants/paths";
import { useAuthStore } from "../../stores/auth";
import { Mail, Lock, Loader2 } from "lucide-vue-next";
import { toast } from "vue3-toastify";
import { useForm, useField } from "vee-validate";
import { useLoginSchema } from "../../schemas/auth";

const { t } = useI18n();
const auth = useAuthStore();

const loginSchema = computed(() => useLoginSchema(t));

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: loginSchema,
});

const { value: email, errorMessage: emailError } = useField<string>("email");
const { value: password, errorMessage: passwordError } =
  useField<string>("password");

const handleLogin = handleSubmit(async (values) => {
  try {
    await auth.login(values.email, values.password);
    navigateTo(PATHS.HOME);
  } catch (err: any) {
    toast.error(err.message || t("auth.error_login"));
  }
});
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans"
  >
    <div
      class="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
    >
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-primary">
          {{ $t("auth.welcome") }}
        </h1>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-secondary mb-2">{{
            $t("auth.email")
          }}</label>
          <div class="relative">
            <Mail class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              v-model="email"
              type="email"
              class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-secondary"
              :class="{ 'border-red-500': emailError }"
              placeholder="name@example.com"
            />
          </div>
          <span v-if="emailError" class="text-red-500 text-xs mt-1 block">{{
            emailError
          }}</span>
        </div>

        <div>
          <label class="block text-sm font-bold text-secondary mb-2">{{
            $t("auth.password")
          }}</label>
          <div class="relative">
            <Lock class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              v-model="password"
              type="password"
              class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-secondary"
              :class="{ 'border-red-500': passwordError }"
              placeholder="••••••••"
            />
          </div>
          <span v-if="passwordError" class="text-red-500 text-xs mt-1 block">{{
            passwordError
          }}</span>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-teal-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Loader2 v-if="isSubmitting" class="w-5 h-5 animate-spin" />
          {{ isSubmitting ? "..." : $t("auth.login") }}
        </button>
      </form>

      <p class="text-center mt-8 text-sm text-gray-500">
        {{ $t("auth.no_account") }}
        <NuxtLink
          :to="PATHS.REGISTER"
          class="text-primary font-bold hover:underline"
          >{{ $t("auth.signup") }}</NuxtLink
        >
      </p>
    </div>
  </div>
</template>
