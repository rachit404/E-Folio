/** Scenes in page order. The ids are the section element ids. */
export const SCENES = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

export type SceneId = (typeof SCENES)[number]["id"];

export const SCENE_IDS: string[] = SCENES.map((scene) => scene.id);

/** Zero-padded position, e.g. "03" for projects. */
export function sceneNumber(id: SceneId): string {
  return String(SCENES.findIndex((scene) => scene.id === id)).padStart(2, "0");
}
