import type { WorldConfig, WorldId } from "@/components/world/WorldTypes";

export const WORLD_CONFIGS: Record<WorldId, WorldConfig> = {
  home: {
    id: "home",
    number: "00",
    label: "SYSTEM INITIALIZATION",
    background: "/assets/worlds/home.png",
    camera: {
      position: [0, 0, 6.2],
      fov: 46,
      near: 0.1,
      far: 40,
      parallax: 0.28,
    },
    atmosphere: {
      fogNear: 7,
      fogFar: 22,
      opacity: 1,
    },
  },

  about: {
    id: "about",
    number: "01",
    label: "IDENTITY / SYSTEM PROFILE",
    background: "/assets/worlds/about.png",
    camera: {
      position: [0, 0, 7],
      fov: 48,
      near: 0.1,
      far: 40,
      parallax: 0.2,
    },
    atmosphere: {
      fogNear: 8,
      fogFar: 24,
      opacity: 0.82,
    },
  },

  experience: {
    id: "experience",
    number: "02",
    label: "EXPERIENCE / TIMELINE",
    background: "/assets/worlds/experience.png",
    camera: {
      position: [0, 0, 7],
      fov: 48,
      near: 0.1,
      far: 40,
      parallax: 0.22,
    },
    atmosphere: {
      fogNear: 8,
      fogFar: 24,
      opacity: 0.84,
    },
  },

  projects: {
    id: "projects",
    number: "03",
    label: "PROJECTS / SYSTEM ARCHIVE",
    background: "/assets/worlds/projects.png",
    camera: {
      position: [0, 0, 7],
      fov: 48,
      near: 0.1,
      far: 40,
      parallax: 0.25,
    },
    atmosphere: {
      fogNear: 8,
      fogFar: 25,
      opacity: 0.86,
    },
  },

  "case-study": {
    id: "case-study",
    number: "04",
    label: "CASE STUDY / DEEP INSPECTION",
    background: "/assets/worlds/case-study.png",
    camera: {
      position: [0, 0, 6.8],
      fov: 47,
      near: 0.1,
      far: 40,
      parallax: 0.18,
    },
    atmosphere: {
      fogNear: 7,
      fogFar: 23,
      opacity: 0.9,
    },
  },

  skills: {
    id: "skills",
    number: "05",
    label: "SKILLS / CAPABILITY MATRIX",
    background: "/assets/worlds/skills.png",
    camera: {
      position: [0, 0, 7],
      fov: 48,
      near: 0.1,
      far: 40,
      parallax: 0.24,
    },
    atmosphere: {
      fogNear: 8,
      fogFar: 25,
      opacity: 0.86,
    },
  },

  contact: {
    id: "contact",
    number: "06",
    label: "TRANSMISSION / CONTACT",
    background: "/assets/worlds/contact.png",
    camera: {
      position: [0, 0, 7],
      fov: 48,
      near: 0.1,
      far: 40,
      parallax: 0.2,
    },
    atmosphere: {
      fogNear: 8,
      fogFar: 25,
      opacity: 0.86,
    },
  },

  loading: {
    id: "loading",
    number: "--",
    label: "LOADING",
    background: "/assets/worlds/loading.png",
    camera: {
      position: [0, 0, 7],
      fov: 48,
      near: 0.1,
      far: 40,
      parallax: 0,
    },
    atmosphere: {
      fogNear: 8,
      fogFar: 24,
      opacity: 1,
    },
  },

  "404": {
    id: "404",
    number: "XX",
    label: "DIMENSION NOT FOUND",
    background: "/assets/worlds/404.png",
    camera: {
      position: [0, 0, 7],
      fov: 48,
      near: 0.1,
      far: 40,
      parallax: 0.18,
    },
    atmosphere: {
      fogNear: 8,
      fogFar: 24,
      opacity: 1,
    },
  },
};

export function getWorldConfig(worldId: WorldId): WorldConfig {
  return WORLD_CONFIGS[worldId];
}
