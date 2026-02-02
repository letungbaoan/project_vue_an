<script setup lang="ts">
import { PATHS } from "../constants/paths";
import { useAuthStore } from "../../stores/auth";
import { User, Mail, Lock, Loader2 } from "lucide-vue-next";
import { toast } from "vue3-toastify";
import { useForm, useField } from "vee-validate";
import { useRegisterSchema } from "../../schemas/auth";

const { t } = useI18n();
const auth = useAuthStore();

// --- FORM SETUP ---
const registerSchema = computed(() => useRegisterSchema(t));

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: registerSchema,
});

// Định nghĩa fields
const { value: username, errorMessage: userError } =
  useField<string>("username");
const { value: email, errorMessage: emailError } = useField<string>("email");
const { value: password, errorMessage: passError } =
  useField<string>("password");

// --- SUBMIT HANDLER ---
const handleRegister = handleSubmit(async (values) => {
  try {
    await auth.register({
      username: values.username,
      email: values.email,
      password: values.password,
    });

    navigateTo(PATHS.HOME);
  } catch (err: any) {
    toast.error(err.message || t("auth.error_register"));
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
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary">
          {{ $t("auth.register_title") }}
        </h1>
        <p class="text-gray-400 text-sm mt-2">
          {{ $t("auth.register_subtitle") }}
        </p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <div>
          <label class="block text-sm font-bold text-secondary mb-2">
            {{ $t("auth.username") }}
          </label>
          <div class="relative">
            <User class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              v-model="username"
              type="text"
              class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-secondary"
              :class="{ 'border-red-500': userError }"
              placeholder="Username"
            />
          </div>
          <span v-if="userError" class="text-red-500 text-xs mt-1 block">{{
            userError
          }}</span>
        </div>

        <div>
          <label class="block text-sm font-bold text-secondary mb-2">
            {{ $t("auth.email") }}
          </label>
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
          <label class="block text-sm font-bold text-secondary mb-2">
            {{ $t("auth.password") }}
          </label>
          <div class="relative">
            <Lock class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              v-model="password"
              type="password"
              class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-secondary"
              :class="{ 'border-red-500': passError }"
              placeholder="••••••••"
            />
          </div>
          <span v-if="passError" class="text-red-500 text-xs mt-1 block">{{
            passError
          }}</span>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-teal-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          <Loader2 v-if="isSubmitting" class="w-5 h-5 animate-spin" />
          {{ isSubmitting ? "Creating account..." : $t("auth.signup") }}
        </button>
      </form>

      <p class="text-center mt-8 text-sm text-gray-500">
        {{ $t("auth.have_account") }}
        <NuxtLink
          :to="PATHS.LOGIN"
          class="text-primary font-bold hover:underline"
        >
          {{ $t("auth.login") }}
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
