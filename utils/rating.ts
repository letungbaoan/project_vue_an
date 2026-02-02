export type StarState = "full" | "half" | "empty";

export const calculateStars = (
  rating: number,
  maxStars: number = 5,
): StarState[] => {
  const stars: StarState[] = [];

  for (let i = 1; i <= maxStars; i++) {
    if (rating >= i) {
      // Ví dụ: rating 4.5, i=1,2,3,4 -> full
      stars.push("full");
    } else if (rating >= i - 0.5) {
      // Ví dụ: rating 4.5, i=5 -> 4.5 >= 4.5 -> half
      stars.push("half");
    } else {
      // Còn lại -> empty
      stars.push("empty");
    }
  }

  return stars;
};
