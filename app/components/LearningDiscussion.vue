<script setup lang="ts">
import { useAuthStore } from "../../stores/auth";
import {
  LucideSend,
  LucideMessageSquare,
  LucideUser,
  LucideBadgeCheck,
  LucideHeart,
  LucideCornerDownRight,
} from "lucide-vue-next";
import type { Discussion } from "../types";

const props = defineProps<{
  lessonId: string;
  courseId: string;
}>();

const { t } = useI18n();
const auth = useAuthStore();

// State
const discussions = ref<Discussion[]>([]);
const newContent = ref("");
const replyContent = ref(""); // Nội dung cho form trả lời
const isPosting = ref(false);
const replyingToId = ref<string | null>(null); // ID của comment đang được trả lời

// 1. Fetch Discussions
const fetchDiscussions = async () => {
  try {
    const data = await $fetch<Discussion[]>(
      "http://localhost:3001/discussions",
      {
        params: {
          lessonId: props.lessonId,
          _expand: "user",
          _sort: "createdAt",
          _order: "desc",
        },
      },
    );
    discussions.value = data;
  } catch (e) {
    console.error("Failed to fetch discussions:", e);
  }
};

// 2. Computed: Tách Comment gốc và Reply để hiển thị lồng nhau
const rootDiscussions = computed(() => {
  return discussions.value.filter((d) => !d.parentId);
});

const getReplies = (parentId: string) => {
  // Lấy các comment con và đảo ngược để comment mới nhất nằm dưới
  return discussions.value
    .filter((d) => d.parentId === parentId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
};

// 3. Xử lý Like
const handleLike = async (item: Discussion) => {
  if (!auth.isLoggedIn) return alert("Vui lòng đăng nhập để like!");

  // Optimistic Update: Tăng like ngay lập tức ở UI
  const originalLikes = item.likes;
  item.likes++;

  try {
    await $fetch(`http://localhost:3001/discussions/${item.id}`, {
      method: "PATCH",
      body: { likes: item.likes },
    });
  } catch (e) {
    // Nếu lỗi thì rollback
    item.likes = originalLikes;
    console.error(e);
  }
};

// 4. Đăng bình luận gốc
const handlePostRoot = async () => {
  await postComment(newContent.value, null);
  newContent.value = "";
};

// 5. Đăng câu trả lời
const handleReplySubmit = async (parentId: string) => {
  await postComment(replyContent.value, parentId);
  replyContent.value = "";
  replyingToId.value = null; // Đóng form reply
};

// Hàm POST chung
const postComment = async (content: string, parentId: string | null) => {
  if (!content.trim() || isPosting.value) return;

  isPosting.value = true;
  try {
    const payload = {
      userId: auth.user?.id,
      courseId: props.courseId,
      lessonId: props.lessonId,
      content: content,
      parentId: parentId,
      likes: 0,
      createdAt: new Date().toISOString(),
    };

    const res = await $fetch<Discussion>("http://localhost:3001/discussions", {
      method: "POST",
      body: payload,
    });

    const postedItem: Discussion = {
      ...res,
      user: auth.user || undefined,
    };

    // Thêm vào list local
    discussions.value.unshift(postedItem);
  } catch (e) {
    console.error(e);
  } finally {
    isPosting.value = false;
  }
};

const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  return (
    date.toLocaleDateString() +
    " " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
};

onMounted(fetchDiscussions);
watch(() => props.lessonId, fetchDiscussions);
</script>

<template>
  <div class="space-y-8 animate-fade-in pb-10">
    <div class="flex gap-4">
      <div class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
        <img
          v-if="auth.user?.avatar"
          :src="auth.user.avatar"
          class="w-full h-full object-cover"
        />
        <LucideUser v-else class="w-full h-full p-2 text-gray-400" />
      </div>
      <div class="flex-1 relative">
        <textarea
          v-model="newContent"
          class="w-full border-gray-200 rounded-xl p-3 pr-12 text-sm focus:ring-primary focus:border-primary min-h-[80px]"
          :placeholder="t('discussion.placeholder')"
        ></textarea>
        <button
          @click="handlePostRoot"
          :disabled="!newContent.trim() || isPosting"
          class="absolute bottom-3 right-3 text-primary hover:text-[#252641] disabled:opacity-50 transition"
        >
          <LucideSend :size="20" />
        </button>
      </div>
    </div>

    <div class="space-y-8">
      <h4
        class="font-bold text-[#252641] flex items-center gap-2 border-b pb-2"
      >
        {{ discussions.length }} {{ t("discussion.comments") }}
      </h4>

      <div
        v-if="discussions.length === 0"
        class="text-center py-10 text-gray-400"
      >
        <LucideMessageSquare class="mx-auto mb-2 opacity-50" :size="32" />
        <p>{{ t("discussion.empty") }}</p>
      </div>

      <div
        v-else
        v-for="rootItem in rootDiscussions"
        :key="rootItem.id"
        class="group"
      >
        <div class="flex gap-4">
          <div
            class="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-100"
          >
            <img
              v-if="rootItem.user?.avatar"
              :src="rootItem.user.avatar"
              class="w-full h-full object-cover"
            />
            <LucideUser v-else class="w-full h-full p-2 text-gray-400" />
          </div>

          <div class="flex-1 space-y-1">
            <div class="flex items-center gap-2">
              <span class="font-bold text-sm text-[#252641]">
                {{ rootItem.user?.username || "Unknown User" }}
              </span>
              <span
                v-if="rootItem.user?.role === 'instructor'"
                class="flex items-center gap-1 text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold"
              >
                <LucideBadgeCheck :size="10" /> Instructor
              </span>
              <span class="text-xs text-gray-400"
                >• {{ timeAgo(rootItem.createdAt) }}</span
              >
            </div>

            <p class="text-sm text-gray-600 leading-relaxed">
              {{ rootItem.content }}
            </p>

            <div class="flex items-center gap-4 mt-2">
              <button
                @click="handleLike(rootItem)"
                class="flex items-center gap-1 text-xs font-medium transition"
                :class="
                  rootItem.likes > 0
                    ? 'text-red-500'
                    : 'text-gray-500 hover:text-red-500'
                "
              >
                <LucideHeart
                  :size="14"
                  :class="{ 'fill-current': rootItem.likes > 0 }"
                />
                {{ rootItem.likes || 0 }}
              </button>

              <button
                @click="
                  replyingToId =
                    replyingToId === rootItem.id ? null : rootItem.id
                "
                class="text-xs text-gray-500 font-bold hover:text-primary transition"
              >
                {{ t("discussion.reply") }}
              </button>
            </div>
          </div>
        </div>

        <div class="ml-14 mt-4 space-y-4">
          <div
            v-for="reply in getReplies(rootItem.id)"
            :key="reply.id"
            class="flex gap-3 bg-gray-50 p-3 rounded-xl"
          >
            <div
              class="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0"
            >
              <img
                v-if="reply.user?.avatar"
                :src="reply.user.avatar"
                class="w-full h-full object-cover"
              />
              <LucideUser v-else class="w-full h-full p-2 text-gray-400" />
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-bold text-xs text-[#252641]">{{
                  reply.user?.username
                }}</span>
                <span
                  v-if="reply.user?.role === 'instructor'"
                  class="flex items-center gap-1 text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold"
                >
                  <LucideBadgeCheck :size="8" />
                </span>
                <span class="text-[10px] text-gray-400">{{
                  timeAgo(reply.createdAt)
                }}</span>
              </div>
              <p class="text-xs text-gray-600">{{ reply.content }}</p>
              <button
                @click="handleLike(reply)"
                class="flex items-center gap-1 text-[10px] mt-2 font-medium transition"
                :class="
                  reply.likes > 0
                    ? 'text-red-500'
                    : 'text-gray-400 hover:text-red-500'
                "
              >
                <LucideHeart
                  :size="12"
                  :class="{ 'fill-current': reply.likes > 0 }"
                />
                {{ reply.likes || 0 }}
              </button>
            </div>
          </div>

          <div
            v-if="replyingToId === rootItem.id"
            class="flex gap-3 animate-fade-in"
          >
            <LucideCornerDownRight :size="20" class="text-gray-300 ml-2" />
            <div class="flex-1 relative">
              <textarea
                v-model="replyContent"
                class="w-full border-gray-200 rounded-lg p-2 pr-10 text-xs focus:ring-primary focus:border-primary min-h-[60px]"
                :placeholder="`${t('discussion.reply')} @${rootItem.user?.username}...`"
                autofocus
              ></textarea>
              <button
                @click="handleReplySubmit(rootItem.id)"
                :disabled="!replyContent.trim() || isPosting"
                class="absolute bottom-2 right-2 text-primary hover:text-[#252641] disabled:opacity-50"
              >
                <LucideSend :size="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
