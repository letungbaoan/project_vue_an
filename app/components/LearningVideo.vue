<script setup lang="ts">
import { useLearningStore } from "../../stores/learning";
import type { Lesson } from "../types";

const props = defineProps<{ lesson: Lesson }>();
const emit = defineEmits<{ ended: [] }>();
const learningStore = useLearningStore();
const videoRef = ref<HTMLVideoElement | null>(null);

onMounted(() => {
  learningStore.setVideoRef(videoRef.value);
});

const onTimeUpdate = () => {
  if (videoRef.value) {
    learningStore.currentTime = videoRef.value.currentTime;
  }
};

const onLoadedMetadata = () => {
  if (videoRef.value) {
    learningStore.duration = videoRef.value.duration;
  }
};

const onEnded = () => {
  learningStore.markAsCompleted(props.lesson.id);
  emit("ended");
};
</script>

<template>
  <div class="relative w-full h-full bg-black flex items-center justify-center">
    <video
      ref="videoRef"
      :key="lesson.id"
      class="w-full h-full max-h-full"
      controls
      autoplay
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
    >
      <source :src="lesson.videoUrl" type="video/mp4" />
    </video>
  </div>
</template>
