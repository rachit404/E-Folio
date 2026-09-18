import { loadPortfolio } from "@/content/loader/portfolio";

export default async function Home() {
  const portfolio = await loadPortfolio("main");

  return (
    <main>
      <h1>{portfolio.metadata.name}</h1>

      <p>{portfolio.metadata.course}</p>

      <p>Sections loaded: {portfolio.sections.length}</p>

      <div>
        {portfolio.sections.map((section, index) => (
          <section key={`${section.heading}-${index}`}>
            <h2>{section.heading}</h2>

            <p>Type: {section.kind}</p>

            <p>Items: {section.items.length}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
