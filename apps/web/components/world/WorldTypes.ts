export type WorldId =
  | "home"
  | "about"
  | "experience"
  | "projects"
  | "case-study"
  | "skills"
  | "contact"
  | "loading"
  | "404";

export interface WorldConfig {
  id: WorldId;
  number: string;
  label: string;
  background: string;
  camera: {
    position: [number, number, number];
    fov: number;
    near: number;
    far: number;
    parallax: number;
  };
  atmosphere: {
    fogNear: number;
    fogFar: number;
    opacity: number;
  };
}

export interface WorldTheme {
  primary: string;
  secondary: string;
  foreground: string;
}
