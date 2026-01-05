import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Python Study App",
    short_name: "PyStudy",
    description: "ブラウザで学ぶ、楽しいPython学習アプリ",
    start_url: "/learn",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#58cc02",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      // 本来は192x192, 512x512などのPNGアイコンが必要
      // ここでは仮置き
    ],
  };
}
