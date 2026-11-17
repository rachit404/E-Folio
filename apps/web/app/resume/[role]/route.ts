import { listResumePdfs, readResumePdf } from "@/content/loader/extras";

/**
 * Serves content/resumes/<role>.pdf. Generated at build time, so the
 * personal PDFs are only needed while building, like the .tex files.
 * With no PDFs there are simply no routes and the button is hidden.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const roles = await listResumePdfs();

  return roles.map((role) => ({ role }));
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ role: string }> },
) {
  const { role } = await context.params;

  const pdf = await readResumePdf(role);

  if (!pdf) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="resume-${role}.pdf"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
