<script setup lang="ts">
import {
  PlayCircle,
  Clock,
  FileText,
  Globe,
  CheckCircle,
  User,
  Star,
  Lock,
  Loader2,
} from "lucide-vue-next";
import { formatCurrency } from "../../../utils/format";
import { useAuthStore } from "../../../stores/auth";
import { useCartStore } from "../../../stores/cart";
import { PATHS } from "../../constants/paths";
import { toast } from "vue3-toastify";
import type { Course, Lesson, Review, Enrollment } from "../../types";

const { t, locale } = useI18n();
const route = useRoute();
const auth = useAuthStore();
const cartStore = useCartStore();
const courseId = route.params.id as string;

const activeTab = ref("overview");
const userRating = ref(5);
const userComment = ref("");
const isSubmitting = ref(false);

// Fetch course with instructor data populated (only approved courses)
const { data: course, error } = await useFetch<Course>(
  `http://localhost:3001/courses/${courseId}`,
  {
    query: {
      _expand: "user",
    },
  },
);

const { data: lessons } = await useFetch<Lesson[]>(
  `http://localhost:3001/lessons?courseId=${courseId}&_sort=order&_order=asc`,
);

const { data: reviews, refresh: refreshReviews } = await useFetch<Review[]>(
  `http://localhost:3001/reviews?courseId=${courseId}&_sort=createdAt&_order=desc&_expand=user`,
);

const { data: enrollment } = await useFetch<Enrollment[]>(
  `http://localhost:3001/enrollments`,
  {
    query: computed(() => ({
      userId: auth.user?.id,
      courseId: courseId,
    })),
    watch: [() => auth.user],
    immediate: !!auth.user,
  },
);

const isOwned = computed(() => {
  if (!auth.isLoggedIn) return false;
  return enrollment.value && enrollment.value.length > 0;
});

const isYouTubeUrl = (url?: string) => {
  if (!url) return false;
  return url.includes("youtube.com") || url.includes("youtu.be");
};

const getYouTubeEmbedUrl = (url: string) => {
  const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
  return `https://www.youtube.com/embed/${videoId}`;
};

const videoUrl = computed(() => {
  return (
    course.value?.trailerUrl ||
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  );
});

// Format duration from seconds to mm:ss
const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const setRating = (star: number) => {
  userRating.value = star;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString(
      locale.value === "vi" ? "vi-VN" : "en-US",
    );
  } catch (e) {
    return "";
  }
};

const handleSubmitReview = async () => {
  if (!userComment.value.trim()) return;
  if (!auth.user) return;

  isSubmitting.value = true;

  try {
    const newReview = {
      courseId: courseId,
      userId: auth.user.id,
      rating: userRating.value,
      content: userComment.value,
      createdAt: new Date().toISOString(),
    };

    await $fetch("http://localhost:3001/reviews", {
      method: "POST",
      body: newReview,
    });

    toast.success(t("course_detail.review_success"));
    userComment.value = "";
    userRating.value = 5;

    await refreshReviews();
  } catch (error) {
    toast.error(t("course_detail.review_failed"));
  } finally {
    isSubmitting.value = false;
  }
};

const handleAddToCart = () => {
  if (course.value) {
    cartStore.addToCart(course.value);
  }
};

const handleBuyNow = () => {
  if (course.value) {
    if (!cartStore.isInCart(course.value.id)) {
      cartStore.addToCart(course.value);
    }
    navigateTo(PATHS.CART);
  }
};
</script>

<template>
  <div v-if="course" class="bg-gray-50 min-h-screen pb-20 font-sans">
    <div class="bg-[#252641] text-white py-16 px-6 relative overflow-hidden">
      <div
        class="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
      ></div>
      <div class="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12 relative z-10">
        <div class="lg:col-span-2 space-y-6">
          <div
            class="flex items-center gap-3 text-sm font-medium text-primary/80"
          >
            <span
              class="bg-white/10 px-3 py-1 rounded-full uppercase tracking-wider"
              >{{ course.level }}</span
            >
            <div class="flex items-center gap-1 text-yellow-400">
              <Star class="w-4 h-4 fill-current" />
              <span
                >{{ course.rating }} ({{
                  t("course_detail.reviews_count", {
                    count: reviews?.length || 0,
                  })
                }})</span
              >
            </div>
          </div>
          <h1 class="text-3xl md:text-5xl font-bold leading-tight">
            {{ course.name }}
          </h1>
          <p class="text-gray-300 text-lg leading-relaxed line-clamp-3">
            {{ course.description }}
          </p>

          <div class="flex flex-wrap gap-6 text-sm text-gray-300 pt-4">
            <div v-if="course.user" class="flex items-center gap-2">
              <User class="w-5 h-5 text-primary" />
              <span>{{ course.user?.username }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Clock class="w-5 h-5 text-primary" />
              <span
                >{{ $t("course_detail.last_updated") }}:
                {{ formatDate(course.updatedAt) }}</span
              >
            </div>
            <div class="flex items-center gap-2">
              <Globe class="w-5 h-5 text-primary" />
              <span>{{ $t("course_detail.languages") }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-10 -mt-20">
      <div class="lg:col-span-2 space-y-8">
        <div
          class="bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video relative group"
        >
          <iframe
            v-if="isYouTubeUrl(videoUrl)"
            class="w-full h-full"
            :src="getYouTubeEmbedUrl(videoUrl)"
            frameborder="0"
            allow="
              accelerometer;
              autoplay;
              clipboard-write;
              encrypted-media;
              gyroscope;
              picture-in-picture;
            "
            allowfullscreen
          />
          <video
            v-else
            controls
            :poster="course.thumbnail"
            class="w-full h-full object-cover"
            :src="videoUrl"
            :key="course.id"
          >
            {{ $t("course_detail.video_error") }}
          </video>
        </div>

        <div
          class="bg-white rounded-3xl shadow-sm border border-gray-100 p-2 flex gap-2 overflow-x-auto"
        >
          <button
            v-for="tab in ['overview', 'curriculum', 'instructor', 'reviews']"
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap capitalize',
              activeTab === tab
                ? 'bg-primary text-white shadow-md'
                : 'text-secondary hover:bg-gray-50',
            ]"
          >
            {{ $t(`course_detail.${tab}`) }}
          </button>
        </div>

        <div
          class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[400px]"
        >
          <div
            v-if="activeTab === 'overview'"
            class="space-y-6 text-secondary leading-relaxed"
          >
            <h3 class="text-2xl font-bold text-[#2f327d]">
              {{ $t("course_detail.overview") }}
            </h3>
            <p>{{ course.description }}</p>
            <ul class="grid md:grid-cols-2 gap-4 mt-4">
              <li class="flex items-start gap-3">
                <CheckCircle class="w-5 h-5 text-primary shrink-0" /><span>{{
                  $t("course_detail.full_lifetime_access")
                }}</span>
              </li>
              <li class="flex items-start gap-3">
                <CheckCircle class="w-5 h-5 text-primary shrink-0" /><span>{{
                  $t("course_detail.certificate")
                }}</span>
              </li>
            </ul>
          </div>

          <div v-if="activeTab === 'curriculum'" class="space-y-4">
            <h3 class="text-2xl font-bold text-[#2f327d] mb-6">
              {{ $t("course_detail.curriculum") }}
            </h3>
            <div
              v-if="!lessons?.length"
              class="text-center py-10 text-gray-500"
            >
              {{ $t("common.updating") }}
            </div>
            <div
              v-else
              v-for="(lesson, index) in lessons"
              :key="lesson.id"
              class="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-primary/50 hover:bg-gray-50 transition cursor-pointer group"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold"
                >
                  {{ index + 1 }}
                </div>
                <div>
                  <h4
                    class="font-bold text-secondary group-hover:text-primary transition"
                  >
                    {{ lesson.name }}
                  </h4>
                  <div
                    class="flex items-center gap-2 text-xs text-gray-400 mt-1"
                  >
                    <PlayCircle class="w-3 h-3" /><span>Video</span>
                    <span
                      v-if="lesson.isFree"
                      class="text-green-500 font-semibold"
                      >• Free</span
                    >
                  </div>
                </div>
              </div>
              <span class="text-sm font-medium text-gray-400">{{
                formatDuration(lesson.duration)
              }}</span>
            </div>
          </div>

          <div
            v-if="activeTab === 'instructor' && course.user"
            class="flex gap-6 items-start"
          >
            <img
              :src="course.user?.avatar"
              class="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
            />
            <div>
              <h3 class="text-xl font-bold text-[#2f327d]">
                {{ course.user?.username }}
              </h3>
              <p class="text-primary font-medium mb-4">
                {{
                  course.user.role === "instructor"
                    ? $t("course_detail.instructor_job")
                    : ""
                }}
              </p>
              <p class="text-secondary text-sm mb-4">
                {{
                  course.user.bio || $t("course_detail.instructor_desc")
                }}
              </p>
              <div
                v-if="course.user.skills?.length"
                class="flex flex-wrap gap-2"
              >
                <span
                  v-for="skill in course.user.skills"
                  :key="skill"
                  class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'reviews'">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-bold text-[#2f327d]">
                {{ $t("course_detail.reviews") }}
              </h3>
              <span
                class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-bold"
              >
                {{
                  t("course_detail.reviews_count", {
                    count: reviews?.length || 0,
                  })
                }}</span
              >
            </div>

            <div
              class="mb-10 bg-gray-50 p-6 rounded-2xl border border-gray-100"
            >
              <div v-if="!auth.isLoggedIn" class="text-center py-6">
                <Lock class="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p class="text-gray-600 mb-4">
                  {{ $t("course_detail.login_to_review") }}
                </p>
                <NuxtLink
                  :to="PATHS.LOGIN"
                  class="bg-primary text-white px-6 py-2 rounded-full font-bold hover:bg-teal-600 transition"
                  >{{ $t("course_detail.login_btn") }}</NuxtLink
                >
              </div>

              <div v-else>
                <h4 class="font-bold text-secondary mb-3">
                  {{ $t("course_detail.write_review") }}
                </h4>
                <div class="flex items-center gap-1 mb-4">
                  <button
                    v-for="star in 5"
                    :key="star"
                    @click="setRating(star)"
                    class="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      class="w-6 h-6"
                      :class="
                        star <= userRating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      "
                    />
                  </button>
                </div>
                <textarea
                  v-model="userComment"
                  rows="3"
                  class="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 outline-none mb-3 bg-white"
                  :placeholder="$t('course_detail.comment_placeholder')"
                ></textarea>
                <div class="flex justify-end">
                  <button
                    @click="handleSubmitReview"
                    :disabled="isSubmitting || !userComment.trim()"
                    class="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-teal-600 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
                    {{ $t("course_detail.submit_review") }}
                  </button>
                </div>
              </div>
            </div>

            <div
              v-if="!reviews || reviews.length === 0"
              class="text-center py-10 text-gray-400"
            >
              {{ $t("course_detail.no_reviews") }}
            </div>
            <div v-else class="space-y-6">
              <div
                v-for="review in reviews"
                :key="review.id"
                class="flex gap-4 border-b border-gray-100 pb-6 last:border-0"
              >
                <img
                  :src="review.user?.avatar || 'https://i.pravatar.cc/150'"
                  class="w-12 h-12 rounded-full object-cover border border-gray-100"
                />
                <div class="flex-1">
                  <div class="flex justify-between items-start">
                    <h5 class="font-bold text-secondary">
                      {{ review.user?.username || "Unknown User" }}
                    </h5>
                    <span class="text-xs text-gray-400">{{
                      formatDate(review.createdAt)
                    }}</span>
                  </div>
                  <div class="flex items-center gap-1 mb-2 mt-1">
                    <Star
                      v-for="i in 5"
                      :key="i"
                      class="w-3 h-3"
                      :class="
                        i <= review.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      "
                    />
                  </div>
                  <p class="text-gray-600 text-sm leading-relaxed">
                    {{ review.content }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div
          class="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 sticky top-24"
        >
          <img
            :src="course.thumbnail"
            class="w-full h-48 object-cover rounded-2xl mb-6 shadow-sm"
          />
          <div class="flex items-end gap-3 mb-2">
            <span class="text-3xl font-bold text-primary">{{
              formatCurrency(course.price, locale)
            }}</span>
            <span
              class="text-lg text-gray-400 line-through decoration-gray-400 mb-1"
              >{{ formatCurrency(course.price * 1.5, locale) }}</span
            >
          </div>
          <span
            class="inline-block bg-red-100 text-red-500 text-xs font-bold px-3 py-1 rounded-full mb-6"
            >{{ $t("course_detail.discount_off") }}</span
          >

          <div class="space-y-4">
            <button
              @click="handleBuyNow"
              :disabled="isOwned"
              class="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-teal-600 shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {{ isOwned ? $t("cart.owned") : $t("cart.buy_now") }}
            </button>
            <button
              v-if="!isOwned"
              @click="handleAddToCart"
              class="w-full py-4 bg-white text-primary border-2 border-primary rounded-xl font-bold text-lg hover:bg-primary/5 transition-colors"
            >
              {{ $t("cart.add_to_cart") }}
            </button>
          </div>

          <div class="mt-8 pt-6 border-t border-gray-100 space-y-4">
            <ul class="space-y-3 text-sm text-secondary">
              <li class="flex items-center gap-3">
                <FileText class="w-4 h-4 text-primary" />
                {{ lessons?.length || 0 }} {{ $t("course_detail.lessons") }}
              </li>
              <li class="flex items-center gap-3">
                <Clock class="w-4 h-4 text-primary" />
                {{ $t("course_detail.full_lifetime_access") }}
              </li>
              <li class="flex items-center gap-3">
                <Globe class="w-4 h-4 text-primary" />
                {{ $t("course_detail.access_mobile_tv") }}
              </li>
              <li class="flex items-center gap-3">
                <CheckCircle class="w-4 h-4 text-primary" />
                {{ $t("course_detail.certificate") }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="min-h-screen flex items-center justify-center">
    <Loader2 class="w-10 h-10 text-primary animate-spin" />
  </div>
</template>
