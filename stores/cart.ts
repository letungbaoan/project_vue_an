import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import type { Course } from "../app/types";

export const useCartStore = defineStore("cart", () => {
  const { t } = useI18n();

  const items = useCookie<Course[]>("totc_cart", {
    default: () => [],
    watch: true,
    maxAge: 60 * 60 * 24 * 30,
  });

  // --- GETTERS ---
  const count = computed(() => items.value.length);

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price, 0),
  );

  // --- ACTIONS ---
  function addToCart(course: Course) {
    // Kiểm tra trùng lặp
    if (items.value.find((i) => i.id === course.id)) {
      toast.info(t("cart.already_in_cart"));
      return;
    }

    // Thêm vào giỏ
    items.value.push(course);
    toast.success(t("cart.add_success"));
  }

  function removeFromCart(courseId: string) {
    // Lọc bỏ item cần xóa
    items.value = items.value.filter((i) => i.id !== courseId);
    toast.success(t("cart.remove_success"));
  }

  function clearCart() {
    items.value = [];
  }

  function isInCart(courseId: string) {
    return items.value.some((i) => i.id === courseId);
  }

  return {
    items,
    count,
    total,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
  };
});
