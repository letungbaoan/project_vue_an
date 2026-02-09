<script setup lang="ts">
import { useCartStore } from "../../stores/cart";
import { useAuthStore } from "../../stores/auth";
import { formatCurrency } from "../../utils/format";
import { PATHS } from "../constants/paths";
import {
  CreditCard,
  Lock,
  ShieldCheck,
  Loader2,
  CheckCircle,
} from "lucide-vue-next";
import { useForm, useField } from "vee-validate";
import { useCheckoutSchema } from "../../schemas/checkout";
import { toast } from "vue3-toastify";

const { t, locale } = useI18n();
const cartStore = useCartStore();
const auth = useAuthStore();
const router = useRouter();

// --- BẢO VỆ ROUTE ---
// 1. Phải đăng nhập
if (!auth.isLoggedIn) {
  navigateTo(PATHS.LOGIN);
}
// 2. Giỏ hàng phải có hàng
if (cartStore.count === 0) {
  navigateTo(PATHS.CART);
}

// --- STATE ---
const isProcessing = ref(false);
const isSuccess = ref(false);

// --- FORM SETUP ---
const checkoutSchema = computed(() => useCheckoutSchema(t));
const { handleSubmit } = useForm({
  validationSchema: checkoutSchema,
});

const { value: cardHolder, errorMessage: holderError } =
  useField<string>("cardHolder");
const { value: cardNumber, errorMessage: numberError } =
  useField<string>("cardNumber");
const { value: expiryDate, errorMessage: expiryError } =
  useField<string>("expiryDate");
const { value: cvv, errorMessage: cvvError } = useField<string>("cvv");

// --- XỬ LÝ THANH TOÁN ---
const handlePayment = handleSubmit(async (values) => {
  if (!auth.user) return;

  isProcessing.value = true;

  try {
    const newOrder = {
      userId: auth.user.id,
      totalAmount: cartStore.total,
      status: "success",
      items: cartStore.items.map((item) => ({
        courseId: item.id,
        price: item.price,
      })),
      createdAt: new Date().toISOString(),
    };

    await $fetch("http://localhost:3001/orders", {
      method: "POST",
      body: newOrder,
    });

    for (const item of cartStore.items) {
      const newEnrollment = {
        userId: auth.user.id,
        courseId: item.id,
        createdAt: new Date().toISOString(),
        progressPercent: 0,
        completedLessons: 0,
      };

      await $fetch("http://localhost:3001/enrollments", {
        method: "POST",
        body: newEnrollment,
      });
    }

    isSuccess.value = true;
    cartStore.clearCart(); // Xóa giỏ hàng
    toast.success(t("checkout.success_title"));
  } catch (error) {
    toast.error(t("checkout.error_payment"));
  } finally {
    isProcessing.value = false;
  }
});

// Điều hướng sau khi thành công
const goToMyCourses = () => {
  router.push(PATHS.MY_COURSES); // Hoặc trang My Courses nếu bạn đã làm
};
</script>

<template>
  <div class="bg-gray-50 min-h-screen py-12 font-sans">
    <div class="max-w-6xl mx-auto px-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-[#2f327d]">
          {{ $t("checkout.title") }}
        </h1>
        <div class="flex items-center gap-2 text-sm text-green-600 mt-2">
          <ShieldCheck class="w-4 h-4" />
          <span>{{ $t("cart.secure_payment") }}</span>
        </div>
      </div>

      <div
        v-if="isSuccess"
        class="max-w-2xl mx-auto bg-white rounded-3xl p-12 text-center shadow-lg border border-gray-100 animate-fade-in"
      >
        <div
          class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle class="w-10 h-10" />
        </div>
        <h2 class="text-3xl font-bold text-[#2f327d] mb-4">
          {{ $t("checkout.success_title") }}
        </h2>
        <p class="text-gray-500 mb-8">{{ $t("checkout.success_desc") }}</p>
        <button
          @click="goToMyCourses"
          class="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-600 transition shadow-lg shadow-primary/30"
        >
          {{ $t("checkout.go_to_learning") }}
        </button>
      </div>

      <div v-else class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div
            class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
          >
            <h3
              class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"
            >
              <CreditCard class="w-5 h-5 text-primary" />
              {{ $t("checkout.payment_details") }}
            </h3>

            <div
              class="bg-gradient-to-r from-[#2f327d] to-[#5558b6] p-6 rounded-2xl text-white mb-8 shadow-lg relative overflow-hidden"
            >
              <div
                class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"
              ></div>
              <div class="flex justify-between items-start mb-8">
                <span class="text-xs font-mono opacity-80">Debit / Credit</span>
                <span class="font-bold italic text-xl">VISA</span>
              </div>
              <div class="text-2xl font-mono tracking-widest mb-6">
                {{ cardNumber || "•••• •••• •••• ••••" }}
              </div>
              <div class="flex justify-between text-xs uppercase opacity-80">
                <div class="flex flex-col">
                  <span class="text-[10px]">Card Holder</span>
                  <span class="font-bold text-sm tracking-wide">{{
                    cardHolder || "YOUR NAME"
                  }}</span>
                </div>
                <div class="flex flex-col items-end">
                  <span class="text-[10px]">Expires</span>
                  <span class="font-bold text-sm tracking-wide">{{
                    expiryDate || "MM/YY"
                  }}</span>
                </div>
              </div>
            </div>

            <form @submit.prevent="handlePayment" class="space-y-6">
              <div>
                <label class="block text-sm font-bold text-secondary mb-2">{{
                  $t("checkout.card_number")
                }}</label>
                <div class="relative">
                  <input
                    v-model="cardNumber"
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    maxlength="16"
                    class="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    :class="{ 'border-red-500': numberError }"
                  />
                  <CreditCard
                    class="absolute right-4 top-3.5 w-5 h-5 text-gray-400"
                  />
                </div>
                <span
                  v-if="numberError"
                  class="text-red-500 text-xs mt-1 block"
                  >{{ numberError }}</span
                >
              </div>

              <div>
                <label class="block text-sm font-bold text-secondary mb-2">{{
                  $t("checkout.card_holder")
                }}</label>
                <input
                  v-model="cardHolder"
                  type="text"
                  placeholder="NGUYEN VAN A"
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all uppercase"
                  :class="{ 'border-red-500': holderError }"
                />
                <span
                  v-if="holderError"
                  class="text-red-500 text-xs mt-1 block"
                  >{{ holderError }}</span
                >
              </div>

              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-bold text-secondary mb-2">{{
                    $t("checkout.expiry_date")
                  }}</label>
                  <input
                    v-model="expiryDate"
                    type="text"
                    placeholder="12/25"
                    maxlength="5"
                    class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    :class="{ 'border-red-500': expiryError }"
                  />
                  <span
                    v-if="expiryError"
                    class="text-red-500 text-xs mt-1 block"
                    >{{ expiryError }}</span
                  >
                </div>

                <div>
                  <label class="block text-sm font-bold text-secondary mb-2">{{
                    $t("checkout.cvv")
                  }}</label>
                  <div class="relative">
                    <input
                      v-model="cvv"
                      type="password"
                      placeholder="•••"
                      maxlength="4"
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      :class="{ 'border-red-500': cvvError }"
                    />
                    <Lock
                      class="absolute right-4 top-3.5 w-4 h-4 text-gray-400"
                    />
                  </div>
                  <span
                    v-if="cvvError"
                    class="text-red-500 text-xs mt-1 block"
                    >{{ cvvError }}</span
                  >
                </div>
              </div>

              <button
                type="submit"
                :disabled="isProcessing"
                class="lg:hidden w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-teal-600 transition-all shadow-lg mt-4 flex justify-center items-center gap-2"
              >
                <Loader2 v-if="isProcessing" class="w-5 h-5 animate-spin" />
                {{ $t("checkout.pay_now") }}
              </button>
            </form>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div
            class="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 sticky top-28"
          >
            <h3 class="text-lg font-bold text-gray-800 mb-6">
              {{ $t("checkout.order_summary") }}
            </h3>

            <div class="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
              <div
                v-for="item in cartStore.items"
                :key="item.id"
                class="flex gap-3"
              >
                <img
                  :src="item.thumbnail"
                  class="w-16 h-12 object-cover rounded-lg border border-gray-100 shrink-0"
                />
                <div class="overflow-hidden">
                  <h4 class="text-sm font-medium text-gray-700 truncate">
                    {{ item.name }}
                  </h4>
                  <p class="text-xs text-primary font-bold">
                    {{ formatCurrency(item.price, locale) }}
                  </p>
                </div>
              </div>
            </div>

            <div class="h-px bg-gray-100 my-4"></div>

            <div class="flex justify-between items-end mb-6">
              <span class="text-gray-600 font-medium">Total</span>
              <span class="text-2xl font-bold text-primary">{{
                formatCurrency(cartStore.total, locale)
              }}</span>
            </div>

            <button
              @click="handlePayment"
              :disabled="isProcessing"
              class="hidden lg:flex w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-teal-600 transition-all shadow-lg transform hover:-translate-y-1 active:scale-95 justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Loader2 v-if="isProcessing" class="w-5 h-5 animate-spin" />
              {{
                isProcessing
                  ? $t("checkout.processing")
                  : $t("checkout.pay_now")
              }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
