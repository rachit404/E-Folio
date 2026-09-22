import * as THREE from "three";

import type { MascotState } from "./MascotTypes";

const LEG_NAMES = [
  "leg-left-0",
  "leg-left-1",
  "leg-left-2",
  "leg-left-3",
  "leg-right-0",
  "leg-right-1",
  "leg-right-2",
  "leg-right-3",
];

export function animateMascot(
  root: THREE.Group,
  rig: THREE.Group,
  elapsed: number,
  state: MascotState,
) {
  const travelMultiplier = state === "travel" ? 1.8 : 1;
  const focusMultiplier = state === "focus" ? 0.45 : 1;

  /*
   * Main body motion.
   */
  rig.position.y =
    Math.sin(elapsed * 2.2 * travelMultiplier) * 0.045 * focusMultiplier;

  /*
   * Subtle personality rotation.
   */
  root.rotation.y = Math.sin(elapsed * 0.65) * 0.12 * focusMultiplier;

  root.rotation.z = Math.sin(elapsed * 0.9) * 0.025;

  /*
   * Eight articulated spider legs.
   *
   * We find the named joints in the existing
   * Three.js object graph instead of rebuilding
   * geometry during animation.
   */
  LEG_NAMES.forEach((name, index) => {
    const leg = root.getObjectByName(name);

    if (!leg) {
      return;
    }

    const side = index < 4 ? 1 : -1;
    const row = index % 4;

    const phase = row * 0.45;

    leg.rotation.z =
      side *
      (0.04 + Math.sin(elapsed * 2.5 + phase) * 0.055 * travelMultiplier);

    leg.rotation.y = Math.cos(elapsed * 2.1 + phase) * 0.035;
  });
}
