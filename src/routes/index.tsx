import { createFileRoute } from "@tanstack/react-router";
import IPhone from "@/components/iphone/IPhone";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "iPhone 17 Pro Simulator" },
      { name: "description", content: "Interactive iPhone 17 Pro with iOS lock screen, home screen, Control Center and working apps." },
      { property: "og:title", content: "iPhone 17 Pro Simulator" },
      { property: "og:description", content: "Interactive iPhone 17 Pro with working iOS apps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IPhone,
});
