import type { CSSProperties } from "react";
import headerTemplate from "../assets/templates/header.json";

type TemplateNode = {
  settings?: Record<string, any>;
  elements?: TemplateNode[];
  widgetType?: string;
};

const menuItems = [
  { label: "Home", href: "#" },
  { label: "About", href: "#" },
  { label: "Portfolio", href: "#" },
  { label: "Contact", href: "#" },
];

export function Header() {
  const root = (headerTemplate.content?.[0] ?? {}) as TemplateNode;
  const leftContainer = (root.elements?.[0] ?? {}) as TemplateNode;
  const rightContainer = (root.elements?.[1] ?? {}) as TemplateNode;

  const imageWidget = leftContainer.elements?.find(
    (el) => el.widgetType === "image"
  );
  const navWidget = rightContainer.elements?.find(
    (el) => el.widgetType === "ekit-nav-menu"
  );

  const logoUrl = imageWidget?.settings?.image?.url as string | undefined;
  const logoWidthPercent = Number(imageWidget?.settings?.width?.size ?? 50);
  const textColor =
    (navWidget?.settings?.elementskit_menu_text_color as string | undefined) ??
    "#ffffff";
  const hoverColor =
    (navWidget?.settings?.elementskit_item_color_hover as string | undefined) ??
    "#ff934e";
  const fontFamily =
    (navWidget?.settings?.elementskit_content_typography_font_family as
      | string
      | undefined) ?? "Archivo";

  const style = {
    "--header-menu-color": textColor,
    "--header-hover-color": hoverColor,
    "--header-font": fontFamily,
    "--header-logo-max-width": `${logoWidthPercent}%`,
  } as CSSProperties;

  return (
    <header className="template-header" style={style}>
      <a className="template-header__brand" href="/">
        {logoUrl ? (
          <img src={logoUrl} alt="Juca Videos" />
        ) : (
          <span>Juca Videos</span>
        )}
      </a>

      <nav className="template-header__nav" aria-label="Menu principal">
        {menuItems.map((item) => (
          <a key={item.label} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

export default Header;
