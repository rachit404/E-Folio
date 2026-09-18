import { z } from "zod";

const LinkSchema = z.object({
  label: z.string(),
  url: z.string(),
});

const MetadataSchema = z.object({
  name: z.string().optional(),
  course: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  links: z.record(z.string(), z.string()).default({}),
});

const TimelineItemSchema = z.object({
  organization: z.string(),
  secondary: z.string(),
  role: z.string(),
  dates: z.string(),
  details: z.array(z.string()),
});

const ProjectItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  metadata: z.object({
    primary: z.string(),
    secondary: z.string(),
  }),
  details: z.array(z.string()),
  links: z.array(LinkSchema),
});

const SkillItemSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const PositionItemSchema = z.object({
  title: z.string(),
  organization: z.string(),
  dates: z.string(),
});

const GenericItemSchema = z.object({
  text: z.string(),
});

const SectionSchema = z.object({
  heading: z.string(),
  kind: z.enum(["projects", "skills", "timeline", "positions", "content"]),
  items: z.array(
    z.union([
      TimelineItemSchema,
      ProjectItemSchema,
      SkillItemSchema,
      PositionItemSchema,
      GenericItemSchema,
    ]),
  ),
});

export const PortfolioSchema = z.object({
  schemaVersion: z.number(),
  source: z.object({
    file: z.string(),
  }),
  metadata: MetadataSchema,
  sections: z.array(SectionSchema),
});

export type PortfolioData = z.infer<typeof PortfolioSchema>;
