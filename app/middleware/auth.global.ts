// middleware/auth.global.ts
import { useAuthStore } from "../../stores/auth";
import { PATHS } from "../constants/paths";

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore();
  const path = to.path;

  // ============================================================
  // 1. LOGIC CHO NGƯỜI DÙNG ĐÃ ĐĂNG NHẬP
  // ============================================================
  if (auth.isLoggedIn) {
    const role = auth.user?.role;

    // --- A. LUẬT RIÊNG CHO INSTRUCTOR (STRICT MODE) ---
    // Yêu cầu: Instructor CHỈ được ở trong /instructor
    if (role === "instructor") {
      // Nếu đường dẫn hiện tại KHÔNG bắt đầu bằng /instructor
      if (!path.startsWith("/instructor")) {
        // Chuyển hướng ngay lập tức về trang chủ của Instructor
        // (Bạn có thể đổi thành PATHS.INSTRUCTOR_DASHBOARD nếu có)
        return navigateTo(PATHS.INSTRUCTOR_COURSES);
      }

      // Nếu đã ở trong /instructor rồi thì cho phép đi tiếp
      return;
    }

    // --- B. LUẬT CHO CÁC ROLE KHÁC (Student, Admin) ---
    // Ngăn chặn vào lại trang Login/Register khi đã đăng nhập
    if (path === PATHS.LOGIN || path === PATHS.REGISTER) {
      return navigateTo(PATHS.HOME);
    }
  }

  // ============================================================
  // 2. LOGIC CHO KHÁCH (GUEST - CHƯA LOGIN)
  // ============================================================
  const protectedPrefixes = [
    "/profile",
    "/checkout",
    "/my-courses",
    "/my-purchases",
    "/cart",
    "/learning",
    "/instructor", // Bảo vệ luôn route này khỏi Guest
    "/admin", // Bảo vệ luôn route này khỏi Guest
  ];

  const isProtectedRoute = protectedPrefixes.some((prefix) =>
    path.startsWith(prefix),
  );

  if (!auth.isLoggedIn && isProtectedRoute) {
    return navigateTo(PATHS.LOGIN);
  }

  // ============================================================
  // 3. LOGIC BẢO VỆ ROUTE (RBAC - Role Based Access Control)
  // (Dành cho Student/Admin cố tình truy cập vào route cấm)
  // ============================================================

  // A. Bảo vệ khu vực ADMIN
  if (path.startsWith("/admin")) {
    if (auth.user?.role !== "admin") {
      return navigateTo(PATHS.HOME);
    }
  }

  // B. Bảo vệ khu vực INSTRUCTOR
  // (Trường hợp này dành cho Student/Admin cố tình gõ URL /instructor)
  if (path.startsWith("/instructor")) {
    // Lưu ý: Logic Instructor đã được xử lý ở bước 1.A rồi.
    // Nếu code chạy xuống được đây, nghĩa là user ĐÃ login nhưng KHÔNG PHẢI instructor.
    // Vậy thì đá về Home luôn.
    return navigateTo(PATHS.HOME);
  }
});
