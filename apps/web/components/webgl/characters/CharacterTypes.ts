export type CharacterId = "spider" | "titan" | "sentinel";

export interface CharacterDefinition {
  id: CharacterId;
  body: string;
  secondary: string;
  accent: string;
  dark: string;

  scale: number;

  shoulderWidth: number;
  hipWidth: number;
  torsoWidth: number;

  limbRadius: number;
  limbLength: number;
  headScale: number;
}
