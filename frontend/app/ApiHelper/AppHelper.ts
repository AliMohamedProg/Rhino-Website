// app/helpers/AppHelper.ts
export const AppHelper = {
  getCookie: (name: string): string | null => {
    if (typeof document === "undefined") return null; // لو على السيرفر
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1];
    return cookie || null;
  },
};
