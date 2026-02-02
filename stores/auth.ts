import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import type { User } from "../app/types";

export const useAuthStore = defineStore("auth", () => {
  const nuxtApp = useNuxtApp();
  const { t } = nuxtApp.$i18n as any;

  const user = useCookie<User | null>("totc_user", {
    maxAge: 60 * 60 * 24 * 7, // 7 ngày
    default: () => null,
    watch: true,
  });

  // --- GETTERS ---
  const isLoggedIn = computed(() => !!user.value);

  // Check quyền (Role-based)
  const isAdmin = computed(() => user.value?.role === "admin");
  const isInstructor = computed(() => user.value?.role === "instructor");

  // --- ACTIONS ---

  // 1. REGISTER
  async function register(payload: Partial<User>) {
    try {
      const newUserBody = {
        ...payload,
        role: "student",
        avatar: `https://i.pravatar.cc/150?u=${payload.username}`,
        skills: [],
        learningPath: [],
        createdAt: new Date().toISOString(),
      };

      const data = await $fetch<User>("http://localhost:3001/users", {
        method: "POST",
        body: newUserBody,
      });

      if (data) {
        setUser(data);
        toast.success(t("auth.register_success"));
      }
    } catch (error) {
      throw new Error(t("auth.error_register"));
    }
  }

  // 2. LOGIN
  async function login(email: string, password: string) {
    try {
      // JSON Server filter bằng query params
      const users = await $fetch<User[]>("http://localhost:3001/users", {
        params: { email, password },
      });

      if (users.length > 0 && users[0]) {
        setUser(users[0]);
        toast.success(t("auth.login_success"));
      } else {
        const msg = t("auth.error_login");
        throw new Error(msg);
      }
    } catch (error: any) {
      throw error;
    }
  }

  // Helper set user
  function setUser(userData: User) {
    user.value = userData;
  }

  // 3. LOGOUT
  function logout() {
    user.value = null;
    toast.info(t("auth.logout_success"));
    navigateTo("/login");
  }

  return {
    user,
    isLoggedIn,
    isAdmin,
    isInstructor,
    login,
    register,
    logout,
  };
});
