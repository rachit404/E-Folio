"use client";

import type { CharacterId } from "./CharacterTypes";

import ProceduralCharacter from "./ProceduralCharacter";

import { sentinelCharacter } from "./sentinel";
import { spiderCharacter } from "./spider";
import { titanCharacter } from "./titan";

const characters = {
  spider: spiderCharacter,
  titan: titanCharacter,
  sentinel: sentinelCharacter,
} satisfies Record<CharacterId, typeof spiderCharacter>;

interface CharacterFactoryProps {
  id?: string;
}

export default function CharacterFactory({
  id = "spider",
}: CharacterFactoryProps) {
  const definition = characters[id as CharacterId] ?? characters.spider;

  return <ProceduralCharacter definition={definition} />;
}
