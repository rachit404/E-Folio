import type { WorldId } from "@/components/world/WorldTypes";

const worldAssets: Record<WorldId, string> = {
  home: "/assets/worlds/home.png",
  about: "/assets/worlds/about.png",
  experience: "/assets/worlds/experience.png",
  projects: "/assets/worlds/projects.png",
  "case-study": "/assets/worlds/case-study.png",
  skills: "/assets/worlds/skills.png",
  contact: "/assets/worlds/contact.png",
  loading: "/assets/worlds/loading.png",
  "404": "/assets/worlds/404.png",
};

export function getWorldAsset(worldId: WorldId): string {
  return worldAssets[worldId];
}

export { worldAssets };
