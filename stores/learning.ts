import { defineStore } from "pinia";
import type { Enrollment, Lesson } from "../app/types";

export const useLearningStore = defineStore("learning", () => {
  // --- STATE ---
  const currentLesson = ref<Lesson | null>(null);
  const courseLessons = ref<Lesson[]>([]); // Thêm cái này để biết tổng số bài
  const enrollment = ref<Enrollment | null>(null);
  const currentTime = ref(0);
  const duration = ref(0);
  const videoElement = ref<HTMLVideoElement | null>(null);

  // --- ACTIONS ---

  // 1. Hàm này giúp Page set dữ liệu vào Store gọn gàng hơn
  const initData = (data: {
    enrollment: Enrollment | null;
    lessons: Lesson[];
  }) => {
    enrollment.value = data.enrollment;
    courseLessons.value = data.lessons;
  };

  const setVideoRef = (el: HTMLVideoElement | null) =>
    (videoElement.value = el);

  const seekTo = (seconds: number) => {
    if (videoElement.value) {
      videoElement.value.currentTime = seconds;
      videoElement.value.play(); // Tự động play khi seek
    }
  };

  // 2. Logic cập nhật hoàn thành (Đã sửa)
  const markAsCompleted = async (lessonId: string) => {
    // Guard clause: Nếu chưa có enrollment hoặc lessons thì dừng
    if (!enrollment.value || courseLessons.value.length === 0) return;

    // Lấy giá trị hiện tại
    const totalLessons = courseLessons.value.length;
    let currentCompleted = enrollment.value.completedLessons;

    // Chặn lỗi: Nếu đã 100% rồi thì thôi không cộng nữa (hoặc logic chặt hơn cần check ID)
    if (currentCompleted >= totalLessons) return;

    // Tăng số bài học hoàn thành lên 1
    const newCompletedCount = currentCompleted + 1;

    // Tính % mới: (Số bài đã học / Tổng số bài) * 100
    const newProgress = Math.round((newCompletedCount / totalLessons) * 100);

    // Cập nhật Optimistic UI (Cập nhật giao diện trước khi gọi API cho mượt)
    const oldEnrollment = { ...enrollment.value }; // Backup để rollback nếu lỗi
    enrollment.value.completedLessons = newCompletedCount;
    enrollment.value.progressPercent = newProgress;

    try {
      const updatedData = {
        completedLessons: newCompletedCount,
        progressPercent: newProgress, // Cập nhật cả field này
        lastAccessedAt: new Date().toISOString(),
      };

      // Gọi API PATCH
      const res = await $fetch<Enrollment>(
        `http://localhost:3001/enrollments/${enrollment.value.id}`,
        {
          method: "PATCH",
          body: updatedData,
        },
      );

      // Cập nhật lại lần nữa bằng dữ liệu chính xác từ Server trả về
      enrollment.value = res;

      console.log(`Đã cập nhật tiến độ: ${newProgress}%`);
    } catch (e) {
      console.error("Failed to update progress:", e);
      // Rollback nếu API lỗi
      enrollment.value = oldEnrollment;
    }
  };

  return {
    currentLesson,
    courseLessons, // Export ra nếu cần dùng ở sidebar
    enrollment,
    currentTime,
    duration,
    videoElement,
    initData,
    setVideoRef,
    seekTo,
    markAsCompleted,
  };
});
