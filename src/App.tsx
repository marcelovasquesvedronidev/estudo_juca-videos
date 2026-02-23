import { useEffect, useMemo, useState } from "react";
import "./App.css";

type RawTemplate = {
  title?: string;
  metadata?: {
    template_type?: string;
  };
  content?: unknown[];
};

type TemplateIndexItem = {
  id: string;
  name: string;
  displayTitle: string;
};

type TemplateDetails = {
  title: string;
  type: string;
  blocks: number;
};

const PAGE_SIZE = 12;

const templateLoaders = import.meta.glob("../assets/templates/*.json", {
  import: "default"
}) as Record<string, () => Promise<RawTemplate>>;

const screenshotLoaders = import.meta.glob("../assets/screenshots/*.jpg", {
  import: "default"
}) as Record<string, () => Promise<string>>;

function normalizeName(value: string): string {
  return value.toLowerCase().replace(/\s*\(2\)\s*/g, "").replace(/[^a-z0-9-]/g, "");
}

function extractBaseName(path: string): string {
  return path.split("/").pop()?.replace(".json", "") ?? "";
}

function toDisplayTitle(filename: string): string {
  const base = filename.replace(/\s*\(2\)\s*/g, "");
  return base
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const templatesIndex: TemplateIndexItem[] = Object.keys(templateLoaders)
  .map((path) => {
    const name = extractBaseName(path);
    return {
      id: name,
      name,
      displayTitle: toDisplayTitle(name)
    };
  })
  .sort((a, b) => a.displayTitle.localeCompare(b.displayTitle));

const screenshotPathByName = Object.keys(screenshotLoaders).reduce<Record<string, string>>((acc, path) => {
  const filename = path.split("/").pop()?.replace(".jpg", "") ?? "";
  acc[normalizeName(filename)] = path;
  return acc;
}, {});

export default function App() {
  const [selectedId, setSelectedId] = useState<string>(templatesIndex[0]?.id ?? "");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [detailsById, setDetailsById] = useState<Record<string, TemplateDetails>>({});
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  const filteredTemplates = useMemo(() => {
    const query = filter.trim().toLowerCase();
    if (!query) return templatesIndex;

    return templatesIndex.filter((item) => {
      const details = detailsById[item.id];
      return (
        item.displayTitle.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        details?.type.toLowerCase().includes(query)
      );
    });
  }, [detailsById, filter]);

  const totalPages = Math.max(1, Math.ceil(filteredTemplates.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredTemplates.slice(start, start + PAGE_SIZE);
  }, [filteredTemplates, page]);

  useEffect(() => {
    const idsToLoad = new Set<string>(pageItems.map((item) => item.id));
    if (selectedId) idsToLoad.add(selectedId);

    idsToLoad.forEach((id) => {
      if (detailsById[id]) return;
      const path = `../assets/templates/${id}.json`;
      const load = templateLoaders[path];
      if (!load) return;

      void load().then((raw) => {
        setDetailsById((current) => {
          if (current[id]) return current;
          return {
            ...current,
            [id]: {
              title: raw.title?.trim() || toDisplayTitle(id),
              type: raw.metadata?.template_type || "unknown",
              blocks: Array.isArray(raw.content) ? raw.content.length : 0
            }
          };
        });
      });
    });
  }, [detailsById, pageItems, selectedId]);

  useEffect(() => {
    if (!selectedId) {
      setSelectedScreenshot(null);
      return;
    }

    const screenshotPath = screenshotPathByName[normalizeName(selectedId)];
    if (!screenshotPath) {
      setSelectedScreenshot(null);
      return;
    }

    let active = true;
    void screenshotLoaders[screenshotPath]().then((url) => {
      if (active) setSelectedScreenshot(url);
    });

    return () => {
      active = false;
    };
  }, [selectedId]);

  const selectedTemplate = templatesIndex.find((item) => item.id === selectedId) ?? pageItems[0] ?? null;
  const selectedDetails = selectedTemplate ? detailsById[selectedTemplate.id] : null;

  return (
    <div className="page">
      <header className="site-header">
        <div className="brand">
          <span className="brand__mark">JV</span>
          <div>
            <p className="brand__title">Juca Videos</p>
            <p className="brand__subtitle">Templates com lazy-load e paginacao</p>
          </div>
        </div>
      </header>

      <main>
        <section className="selected-template">
          <div className="selected-template__meta">
            <p className="eyebrow">Template ativo</p>
            <h1>{selectedDetails?.title ?? selectedTemplate?.displayTitle ?? "Nenhum template encontrado"}</h1>
            <p className="lead">Tipo: {selectedDetails?.type ?? "carregando..."}</p>
            <p className="lead">Blocos no JSON: {selectedDetails?.blocks ?? "carregando..."}</p>
          </div>
          <div className="selected-template__preview">
            {selectedScreenshot ? (
              <img src={selectedScreenshot} alt={`Preview ${selectedDetails?.title ?? selectedTemplate?.displayTitle}`} />
            ) : (
              <div className="empty-preview">Sem screenshot correspondente.</div>
            )}
          </div>
        </section>

        <section className="section">
          <div className="section__head">
            <h2>Templates disponiveis</h2>
            <input
              className="template-filter"
              type="search"
              placeholder="Filtrar por nome ou tipo"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            />
          </div>

          <div className="grid">
            {pageItems.map((item) => {
              const details = detailsById[item.id];
              return (
                <article key={item.id} className="card">
                  <button
                    className={`template-card__button ${item.id === selectedTemplate?.id ? "is-active" : ""}`}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <p className="template-card__title">{details?.title ?? item.displayTitle}</p>
                    <p className="template-card__type">{details?.type ?? "carregando tipo..."}</p>
                    <p className="template-card__type">
                      {details ? `${details.blocks} blocos` : "carregando blocos..."}
                    </p>
                  </button>
                </article>
              );
            })}
          </div>

          <div className="pagination">
            <button className="pager-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
              Anterior
            </button>
            <p className="pager-info">
              Pagina {page} de {totalPages}
            </p>
            <button
              className="pager-btn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Proxima
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
