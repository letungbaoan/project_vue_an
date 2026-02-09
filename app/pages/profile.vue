<script setup lang="ts">
import { useAuthStore } from "../../stores/auth";
import { toast } from "vue3-toastify";
import {
  User,
  Lock,
  Camera,
  Mail,
  Phone,
  FileText,
  Loader2,
} from "lucide-vue-next";
import { useForm, useField } from "vee-validate";
import { useGeneralSchema, usePasswordSchema } from "../../schemas/auth";

const { t } = useI18n();
const auth = useAuthStore();

if (!auth.isLoggedIn) {
  navigateTo("/login");
}

const activeTab = ref<"general" | "security">("general");

// --- 1. GENERAL FORM ---
const generalSchema = computed(() => useGeneralSchema(t));

const { handleSubmit: handleGeneralSubmit, isSubmitting: isGeneralSubmitting } =
  useForm({
    validationSchema: generalSchema,
    initialValues: {
      username: auth.user?.username || "",
      email: auth.user?.email || "",
      avatar: auth.user?.avatar || "",
      bio: auth.user?.bio || "",
      phone: auth.user?.phone || "",
    },
  });

const { value: username, errorMessage: usernameError } =
  useField<string>("username");
const { value: email } = useField<string>("email");
const { value: avatar, errorMessage: avatarError } = useField<string>("avatar");
const { value: phone } = useField<string>("phone");
const { value: bio } = useField<string>("bio");

const onGeneralSubmit = handleGeneralSubmit(async (values) => {
  try {
    const updatedUser = await $fetch<any>(
      `http://localhost:3001/users/${auth.user?.id}`,
      {
        method: "PATCH",
        body: values,
      },
    );

    if (updatedUser) {
      auth.user = { ...auth.user, ...updatedUser };
      if (import.meta.client) {
        localStorage.setItem("totc_user", JSON.stringify(auth.user));
      }
      toast.success(t("profile.success_update"));
    }
  } catch (error) {
    toast.error("Update failed");
  }
});

// --- 2. PASSWORD FORM ---
const passwordSchema = computed(() => usePasswordSchema(t));

const {
  handleSubmit: handlePassSubmit,
  isSubmitting: isPassSubmitting,
  resetForm: resetPassForm,
} = useForm({
  validationSchema: passwordSchema,
});

const { value: currentPassword, errorMessage: currentPassError } =
  useField<string>("currentPassword");
const { value: newPassword, errorMessage: newPassError } =
  useField<string>("newPassword");
const { value: confirmPassword, errorMessage: confirmPassError } =
  useField<string>("confirmPassword");

const onPassSubmit = handlePassSubmit(async (values) => {
  try {
    const currentUserData = await $fetch<any>(
      `http://localhost:3001/users/${auth.user?.id}`,
    );

    if (currentUserData.password !== values.currentPassword) {
      toast.error(t("profile.error_wrong_pass"));
      return;
    }

    await $fetch(`http://localhost:3001/users/${auth.user?.id}`, {
      method: "PATCH",
      body: { password: values.newPassword },
    });

    toast.success(t("profile.success_password"));
    resetPassForm();
  } catch (error) {
    toast.error("Change password failed");
  }
});
</script>

<template>
  <div class="bg-gray-50 min-h-screen pb-20 pt-10 font-sans">
    <div class="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
      <aside class="md:col-span-1">
        <div
          class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center mb-6"
        >
          <div class="relative inline-block mb-4">
            <img
              :src="auth.user?.avatar || 'https://i.pravatar.cc/150'"
              class="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-md"
            />
            <div
              class="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full border-2 border-white"
            >
              <Camera class="w-4 h-4" />
            </div>
          </div>
          <h2 class="font-bold text-lg text-secondary">
            {{ auth.user?.username }}
          </h2>
          <p class="text-xs text-gray-400 font-medium uppercase tracking-wider">
            {{ auth.user?.role || "Student" }}
          </p>
        </div>

        <nav
          class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <button
            @click="activeTab = 'general'"
            class="w-full flex items-center gap-3 px-6 py-4 text-sm font-bold transition-all border-l-4"
            :class="
              activeTab === 'general'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-transparent text-secondary hover:bg-gray-50'
            "
          >
            <User class="w-5 h-5" /> {{ $t("profile.tab_general") }}
          </button>
          <button
            @click="activeTab = 'security'"
            class="w-full flex items-center gap-3 px-6 py-4 text-sm font-bold transition-all border-l-4"
            :class="
              activeTab === 'security'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-transparent text-secondary hover:bg-gray-50'
            "
          >
            <Lock class="w-5 h-5" /> {{ $t("profile.tab_security") }}
          </button>
        </nav>
      </aside>

      <main class="md:col-span-3">
        <div
          class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[500px]"
        >
          <div v-if="activeTab === 'general'">
            <h1 class="text-2xl font-bold text-[#2f327d] mb-8">
              {{ $t("profile.tab_general") }}
            </h1>
            <form @submit.prevent="onGeneralSubmit" class="space-y-6 max-w-2xl">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-bold text-secondary mb-2">{{
                    $t("profile.label_username")
                  }}</label>
                  <div class="relative">
                    <User
                      class="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
                    />
                    <input
                      v-model="username"
                      type="text"
                      class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-secondary"
                      :class="{ 'border-red-500': usernameError }"
                    />
                  </div>
                  <span
                    v-if="usernameError"
                    class="text-red-500 text-xs mt-1 block"
                    >{{ usernameError }}</span
                  >
                </div>
                <div>
                  <label class="block text-sm font-bold text-secondary mb-2">{{
                    $t("profile.label_phone")
                  }}</label>
                  <div class="relative">
                    <Phone
                      class="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
                    />
                    <input
                      v-model="phone"
                      type="text"
                      class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-secondary"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold text-secondary mb-2">{{
                  $t("profile.label_email")
                }}</label>
                <div class="relative">
                  <Mail class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    v-model="email"
                    type="email"
                    readonly
                    class="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold text-secondary mb-2"
                  >Avatar URL</label
                >
                <div class="relative">
                  <Camera
                    class="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
                  />
                  <input
                    v-model="avatar"
                    type="text"
                    placeholder="https://..."
                    class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-secondary"
                    :class="{ 'border-red-500': avatarError }"
                  />
                </div>
                <span
                  v-if="avatarError"
                  class="text-red-500 text-xs mt-1 block"
                  >{{ avatarError }}</span
                >
              </div>

              <div>
                <label class="block text-sm font-bold text-secondary mb-2">{{
                  $t("profile.label_bio")
                }}</label>
                <div class="relative">
                  <FileText
                    class="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
                  />
                  <textarea
                    v-model="bio"
                    rows="4"
                    class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-secondary resize-none"
                  ></textarea>
                </div>
              </div>

              <div class="pt-4">
                <button
                  type="submit"
                  :disabled="isGeneralSubmitting"
                  class="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-600 transition shadow-lg shadow-primary/30 flex items-center gap-2 disabled:opacity-50"
                >
                  <Loader2
                    v-if="isGeneralSubmitting"
                    class="w-5 h-5 animate-spin"
                  />
                  {{ $t("profile.btn_save") }}
                </button>
              </div>
            </form>
          </div>

          <div v-if="activeTab === 'security'">
            <h1 class="text-2xl font-bold text-[#2f327d] mb-8">
              {{ $t("profile.tab_security") }}
            </h1>
            <form @submit.prevent="onPassSubmit" class="space-y-6 max-w-md">
              <div>
                <label class="block text-sm font-bold text-secondary mb-2">{{
                  $t("profile.current_password")
                }}</label>
                <div class="relative">
                  <Lock class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    v-model="currentPassword"
                    type="password"
                    class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-secondary"
                    :class="{ 'border-red-500': currentPassError }"
                  />
                </div>
                <span
                  v-if="currentPassError"
                  class="text-red-500 text-xs mt-1 block"
                  >{{ currentPassError }}</span
                >
              </div>
              <hr class="border-gray-100" />
              <div>
                <label class="block text-sm font-bold text-secondary mb-2">{{
                  $t("profile.new_password")
                }}</label>
                <div class="relative">
                  <Lock class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    v-model="newPassword"
                    type="password"
                    class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-secondary"
                    :class="{ 'border-red-500': newPassError }"
                  />
                </div>
                <span
                  v-if="newPassError"
                  class="text-red-500 text-xs mt-1 block"
                  >{{ newPassError }}</span
                >
              </div>
              <div>
                <label class="block text-sm font-bold text-secondary mb-2">{{
                  $t("profile.confirm_password")
                }}</label>
                <div class="relative">
                  <Lock class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    v-model="confirmPassword"
                    type="password"
                    class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-secondary"
                    :class="{ 'border-red-500': confirmPassError }"
                  />
                </div>
                <span
                  v-if="confirmPassError"
                  class="text-red-500 text-xs mt-1 block"
                  >{{ confirmPassError }}</span
                >
              </div>
              <div class="pt-4">
                <button
                  type="submit"
                  :disabled="isPassSubmitting"
                  class="bg-secondary text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-700 transition shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  <Loader2
                    v-if="isPassSubmitting"
                    class="w-5 h-5 animate-spin"
                  />
                  {{ $t("profile.btn_change_pass") }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
