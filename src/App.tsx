import "./App.css";
import Header from "./header";
import homepageTemplate from "../assets/templates/homepage.json";
import TemplateRenderer from "./templateRenderer";

function App() {
  return (
    <div className="page">
      <Header />
      <main>
        <TemplateRenderer content={homepageTemplate.content} />
      </main>
    </div>
  );
}

export default App;
