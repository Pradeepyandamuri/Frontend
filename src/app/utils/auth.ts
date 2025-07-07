// utils/auth.ts
export const getToken = (): string | null => {
  if (typeof window !== "undefined") return localStorage.getItem("token");
  return null;
};

export const getUser = (): { name: string; email: string } | null => {
  if (typeof window !== "undefined") {
    try {
      const str = localStorage.getItem("user");
      return str ? JSON.parse(str) : null;
    } catch {
      return null;
    }
  }
  return null;
};

export const logout = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
};
