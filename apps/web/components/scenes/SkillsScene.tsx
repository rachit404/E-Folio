"use client";

import { useMemo, useState } from "react";

import type { PortfolioData } from "@/content/schema/portfolio";
import SceneSection from "@/components/shell/SceneSection";
import { collectCertificates, groupSkills } from "@/components/skills/group";
import BrushTitle from "@/components/ui/BrushTitle";
import HoloCard from "@/components/ui/HoloCard";
import SectionChip from "@/components/ui/SectionChip";
import { projectEntries, projectsUsing } from "@/lib/portfolio/derive";
import { sceneNumber } from "@/lib/scenes/order";

interface SkillsSceneProps {
  portfolio: PortfolioData;
}

interface Node {
  id: string;
  title: string;
  items: string[];
  /** Certificates are listed, not matched against projects. */
  certificates: boolean;
}

/** Around the core: three on top, one each side, one below. */
const SLOTS = [
  "lg:col-start-1 lg:row-start-1",
  "lg:col-start-2 lg:row-start-1",
  "lg:col-start-3 lg:row-start-1",
  "lg:col-start-1 lg:row-start-2",
  "lg:col-start-3 lg:row-start-2",
  "lg:col-start-2 lg:row-start-3",
];

export default function SkillsScene({ portfolio }: SkillsSceneProps) {
  const projects = useMemo(() => projectEntries(portfolio), [portfolio]);

  const nodes = useMemo<Node[]>(() => {
    const skillNodes = groupSkills(portfolio).map((group) => ({
      id: group.category,
      title: group.category,
      items: group.skills,
      certificates: false,
    }));

    const certificateNodes = collectCertificates(portfolio).map((section) => ({
      id: section.heading,
      title: "Certificates",
      items: section.certificates.map((certificate) =>
        certificate.issuer
          ? `${certificate.issuer}: ${certificate.title}`
          : certificate.title,
      ),
      certificates: true,
    }));

    // Six slots around the core; skills first, certificates last.
    return [...skillNodes.slice(0, certificateNodes.length ? 5 : 6), ...certificateNodes].slice(0, 6);
  }, [portfolio]);

  const totalSkills = nodes
    .filter((node) => !node.certificates)
    .reduce((sum, node) => sum + node.items.length, 0);

  const [selectedId, setSelectedId] = useState<string | null>(
    nodes[0]?.id ?? null,
  );

  const [skill, setSkill] = useState<string | null>(null);

  const selected = nodes.find((node) => node.id === selectedId) ?? nodes[0];

  const usedIn = useMemo(
    () => (skill ? projectsUsing(skill, projects) : []),
    [skill, projects],
  );

  return (
    <SceneSection id="skills">
      <div className="flex h-full flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="flex max-w-[22rem] shrink-0 flex-col justify-center gap-4 lg:w-[24%]">
          <SectionChip number={sceneNumber("skills")} label="Skills" />

          <BrushTitle size="sm" first="Engineering" second="Arsenal" />

          <p className="text-sm leading-6 text-[var(--color-white)]/80 [@media(max-height:700px)]:hidden">
            Choose a category to see its skills, then a skill to see where I
            used it.
          </p>

          <p className="micro text-[var(--color-muted)]">
            {String(totalSkills).padStart(2, "0")} skills
            {"  /  "}
            {String(nodes.filter((n) => !n.certificates).length).padStart(2, "0")} groups
          </p>
        </div>

        {nodes.length === 0 ? (
          <p className="micro self-center text-[var(--color-dim)]">
            No skill records available
          </p>
        ) : (
          <>
            <div className="grid min-h-0 min-w-0 flex-1 grid-cols-2 content-center gap-3 lg:grid-cols-3 lg:grid-rows-3">
              {nodes.map((node, index) => {
                const current = node.id === selected?.id;

                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(node.id);
                      setSkill(null);
                    }}
                    aria-pressed={current}
                    className={`block min-h-0 text-left transition-opacity ${SLOTS[index]} ${
                      current ? "opacity-100" : "opacity-75 hover:opacity-100"
                    }`}
                  >
                    <HoloCard
                      tone={current ? "accent" : "primary"}
                      className="h-full"
                      bodyClassName="flex h-full flex-col gap-1.5 p-3"
                    >
                      <span className="micro text-[var(--color-white)]">
                        {node.title}
                      </span>

                      <span className="line-clamp-2 text-[11px] leading-4 text-[var(--color-muted)]">
                        {node.items.slice(0, 4).join(", ")}
                      </span>

                      <span className="micro mt-auto text-[8px] text-[var(--holo)]">
                        Inspect →
                      </span>
                    </HoloCard>
                  </button>
                );
              })}

              {/* Core */}
              <div
                aria-hidden="true"
                className="hidden items-center justify-center lg:col-start-2 lg:row-start-2 lg:flex"
              >
                <div className="relative flex h-full max-h-[11rem] w-full max-w-[11rem] items-center justify-center">
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 h-full w-full animate-[spin_40s_linear_infinite] text-[var(--color-primary)]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.8"
                  >
                    <polygon points="50,4 90,27 90,73 50,96 10,73 10,27" />
                    <polygon points="50,18 78,34 78,66 50,82 22,66 22,34" className="text-[var(--color-accent)]" />
                    <path d="M50 4v92M10 27l80 46M90 27 10 73" opacity="0.5" />
                  </svg>

                  <span className="micro relative text-center text-[8px] leading-4 text-[var(--color-white)]">
                    Engineering
                    <br />
                    Core
                  </span>
                </div>
              </div>
            </div>

            {/* Details */}
            {selected && (
              <HoloCard
                className="min-h-0 lg:w-[28%] lg:shrink-0 lg:self-center"
                bodyClassName="flex max-h-[52svh] min-h-0 flex-col gap-3 p-4"
              >
                <p className="micro text-[var(--color-primary)]">
                  {"// Details"}
                </p>

                <h3 className="brush text-xl text-[var(--color-white)]">
                  {selected.title}
                </h3>

                <ul
                  data-native-scroll
                  className="flex min-h-0 flex-wrap content-start gap-2 overflow-y-auto"
                >
                  {selected.items.map((item) => (
                    <li key={item}>
                      {selected.certificates ? (
                        <span className="block border border-white/15 px-2 py-1 text-[11px] leading-4 text-[var(--color-white)]/85">
                          {item}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSkill(item === skill ? null : item)}
                          aria-pressed={item === skill}
                          className={`micro border px-2 py-1 transition-colors ${
                            item === skill
                              ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-void)]"
                              : "border-white/20 text-[var(--color-white)] hover:border-[var(--color-primary)]"
                          }`}
                        >
                          {item}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>

                {skill && (
                  <div className="border-t border-white/10 pt-3">
                    <p className="micro text-[8px] text-[var(--color-muted)]">
                      Used in
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[var(--color-white)]/85">
                      {usedIn.length > 0
                        ? usedIn.join(", ")
                        : "Not mentioned in a project write-up."}
                    </p>
                  </div>
                )}
              </HoloCard>
            )}
          </>
        )}
      </div>
    </SceneSection>
  );
}
