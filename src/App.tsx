import "./App.css";

export default function App() {
  return (
    <div className="page">
      <header className="site-header">
        <div className="brand">
          <span className="brand__mark">JV</span>
          <div>
            <p className="brand__title">Juca Videos</p>
            <p className="brand__subtitle">ProduÃ§Ã£o audiovisual & storytelling</p>
          </div>
        </div>
        <nav className="site-nav">
          <a href="#inicio">InÃ­cio</a>
          <a href="#servicos">ServiÃ§os</a>
          <a href="#projetos">Projetos</a>
          <a href="#contato">Contato</a>
        </nav>
        <button className="cta">Fale com a gente</button>
      </header>

      <main>
        <section id="inicio" className="hero">
          <div>
            <p className="eyebrow">Seu prÃ³ximo vÃ­deo comeÃ§a aqui</p>
            <h1>Um site base para vocÃª montar o template perfeito depois.</h1>
            <p className="lead">
              Deixe esta estrutura pronta enquanto vocÃª reÃºne imagens, vÃ­deos e
              textos finais. Troque o conteÃºdo quando quiser.
            </p>
            <div className="hero__actions">
              <button className="cta cta--ghost">Ver portfÃ³lio</button>
              <button className="cta cta--solid">Solicitar orÃ§amento</button>
            </div>
          </div>
          <div className="hero__media">
            <div className="media-card">
              <p className="media-card__title">EspaÃ§o reservado</p>
              <p className="media-card__body">
                Use este bloco para inserir um vÃ­deo destaque ou imagem hero.
              </p>
            </div>
            <div className="media-card media-card--small">
              <p className="media-card__title">Thumbnail 01</p>
              <p className="media-card__body">Imagem futura</p>
            </div>
            <div className="media-card media-card--small">
              <p className="media-card__title">Thumbnail 02</p>
              <p className="media-card__body">Imagem futura</p>
            </div>
          </div>
        </section>

        <section id="servicos" className="section">
          <div className="section__head">
            <h2>ServiÃ§os principais</h2>
            <p>
              Listas rÃ¡pidas para vocÃª editar depois. Ex: vÃ­deos institucionais,
              publicidade, cobertura de eventos.
            </p>
          </div>
          <div className="grid">
            {["Branding visual", "ConteÃºdo digital", "CaptaÃ§Ã£o e ediÃ§Ã£o"].map(
              (item) => (
                <article key={item} className="card">
                  <h3>{item}</h3>
                  <p>Texto curto para explicar este serviÃ§o.</p>
                </article>
              )
            )}
          </div>
        </section>

        <section id="projetos" className="section">
          <div className="section__head">
            <h2>Projetos em destaque</h2>
            <p>Troque por thumbnails quando tiver imagens finais.</p>
          </div>
          <div className="grid grid--projects">
            {[1, 2, 3, 4].map((item) => (
              <article key={item} className="project">
                <div className="project__thumb">Projeto {item}</div>
                <div className="project__body">
                  <h3>TÃ­tulo do projeto</h3>
                  <p>DescriÃ§Ã£o curta do que foi feito.</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contato" className="section cta-section">
          <div>
            <h2>Pronto para criar o prÃ³ximo vÃ­deo?</h2>
            <p>
              Deixe um canal de contato preparado enquanto organiza as
              informaÃ§Ãµes finais.
            </p>
          </div>
          <button className="cta cta--solid">Entrar em contato</button>
        </section>
      </main>

      <footer className="site-footer">
        <p>Â© 2026 Juca Videos. Estrutura inicial para seu template.</p>
      </footer>
    </div>
  );
}
