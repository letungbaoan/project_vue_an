<script setup lang="ts">
import { useLearningStore } from "../../stores/learning";
import { useAuthStore } from "../../stores/auth";
import { LucidePlus, LucidePlay } from "lucide-vue-next";
import type { Note } from "../types";

const props = defineProps<{ lessonId: string }>();
const { t } = useI18n();
const learningStore = useLearningStore();
const auth = useAuthStore();

const notes = ref<Note[]>([]);
const newNoteContent = ref("");
const isAdding = ref(false);

// 1. Hàm lấy danh sách ghi chú từ JSON Server
const fetchNotes = async () => {
  try {
    const data = await $fetch<Note[]>(`http://localhost:3001/notes`, {
      params: {
        lessonId: props.lessonId, // Lọc theo bài học hiện tại
        userId: auth.user?.id, // Lọc theo user hiện tại
        _sort: "timeMarker", // Sắp xếp theo thời gian video
        _order: "asc",
      },
    });
    notes.value = data;
  } catch (e) {
    console.error("Lỗi tải ghi chú:", e);
  }
};

// 2. Gọi hàm fetch khi component được mount (Lúc F5 trang)
onMounted(() => {
  fetchNotes();
});

// 3. Theo dõi nếu lessonId thay đổi (khi bấm Next Lesson) thì tải lại note mới
watch(
  () => props.lessonId,
  () => {
    fetchNotes();
  },
);

const handleSaveNote = async () => {
  if (!newNoteContent.value.trim()) return;

  const noteData = {
    userId: auth.user?.id,
    lessonId: props.lessonId,
    content: newNoteContent.value,
    timeMarker: Math.floor(learningStore.currentTime),
    createdAt: new Date().toISOString(),
  };

  try {
    const res = await $fetch<Note>("http://localhost:3001/notes", {
      method: "POST",
      body: noteData,
    });

    // Thêm note mới vào list và sắp xếp lại
    notes.value.push(res);
    notes.value.sort((a, b) => a.timeMarker - b.timeMarker);

    newNoteContent.value = "";
    isAdding.value = false;
  } catch (e) {
    console.error(e);
  }
};

const formatTime = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};
</script>

<template>
  <div class="space-y-4">
    <div
      v-if="!isAdding"
      class="bg-teal-50 p-4 rounded-xl flex justify-between items-center border border-teal-100 transition hover:shadow-md cursor-pointer"
      @click="isAdding = true"
    >
      <span class="text-sm font-medium text-gray-700">
        {{ t("learning.add_note_at") }}
        <span class="text-primary font-bold ml-1 text-lg">
          {{ formatTime(learningStore.currentTime) }}
        </span>
      </span>
      <button
        class="bg-primary text-white p-2 rounded-lg hover:bg-opacity-90 transition transform active:scale-95"
      >
        <LucidePlus :size="20" />
      </button>
    </div>

    <div
      v-else
      class="bg-white border rounded-xl p-4 shadow-md animate-fade-in"
    >
      <div class="flex items-center gap-2 mb-2 text-primary font-bold text-sm">
        <LucidePlay :size="14" /> {{ formatTime(learningStore.currentTime) }}
      </div>
      <textarea
        v-model="newNoteContent"
        class="w-full border-gray-200 rounded-lg text-sm mb-3 focus:ring-primary focus:border-primary p-3"
        rows="3"
        :placeholder="t('learning.note_placeholder')"
        autofocus
      ></textarea>
      <div class="flex justify-end gap-3">
        <button
          @click="isAdding = false"
          class="text-sm font-medium text-gray-500 hover:text-gray-700 px-3 py-2"
        >
          {{ t("learning.cancel") }}
        </button>
        <button
          @click="handleSaveNote"
          class="bg-[#252641] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-opacity-90 transition shadow-sm"
        >
          {{ t("learning.save_note") }}
        </button>
      </div>
    </div>

    <div class="divide-y divide-gray-100">
      <div v-for="note in notes" :key="note.id" class="py-4 group">
        <div class="flex items-start gap-3">
          <button
            @click="learningStore.seekTo(note.timeMarker)"
            class="shrink-0 flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition"
          >
            <LucidePlay :size="10" class="fill-current" />
            {{ formatTime(note.timeMarker) }}
          </button>

          <div class="flex-1">
            <p
              class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap"
            >
              {{ note.content }}
            </p>
            <span class="text-[10px] text-gray-400 mt-1 block">
              {{ new Date(note.createdAt).toLocaleDateString() }}
            </span>
          </div>
        </div>
      </div>

      <div
        v-if="notes.length === 0 && !isAdding"
        class="text-center py-8 text-gray-400 text-sm"
      >
        Chưa có ghi chú nào cho bài học này.
      </div>
    </div>
  </div>
</template>
