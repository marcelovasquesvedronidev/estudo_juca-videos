import type { CSSProperties } from "react";

type SizeValue = {
  size?: string | number;
  unit?: string;
};

type BoxValue = {
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;
  unit?: string;
};

type TemplateNode = {
  id?: string;
  elType?: string;
  widgetType?: string;
  settings?: Record<string, any>;
  elements?: TemplateNode[];
};

function toSizeValue(input: unknown): string | undefined {
  if (!input && input !== 0) return undefined;
  if (typeof input === "string" || typeof input === "number") return `${input}`;
  const value = input as SizeValue;
  if (value.size === "" || value.size === undefined || value.size === null) {
    return undefined;
  }
  return `${value.size}${value.unit ?? "px"}`;
}

function toBoxValue(input: unknown): string | undefined {
  if (!input || typeof input !== "object") return undefined;
  const value = input as BoxValue;
  const unit = value.unit ?? "px";
  const safe = (v?: string | number) =>
    v === undefined || v === null || v === "" ? "0" : `${v}${unit}`;
  return `${safe(value.top)} ${safe(value.right)} ${safe(value.bottom)} ${safe(value.left)}`;
}

function cleanWidgetHtml(text: string): string {
  return text.replace(/\{\{(.*?)\}\}/g, "<span class='kit-highlight'>$1</span>");
}

function renderWidget(node: TemplateNode) {
  const settings = node.settings ?? {};
  const type = node.widgetType;

  if (type === "heading") {
    const Tag = (settings.header_size || "h2") as keyof JSX.IntrinsicElements;
    return (
      <Tag
        className="kit-widget kit-heading"
        style={{ textAlign: settings.align || "inherit" }}
        dangerouslySetInnerHTML={{ __html: settings.title ?? "" }}
      />
    );
  }

  if (type === "elementskit-heading") {
    const rawTag = (settings.ekit_heading_title_tag || "h2") as string;
    const Tag = /^h[1-6]$/.test(rawTag)
      ? (rawTag as keyof JSX.IntrinsicElements)
      : "h2";
    const html = cleanWidgetHtml(settings.ekit_heading_title ?? "");
    return (
      <Tag
        className="kit-widget kit-heading kit-heading--ekit"
        style={{
          textAlign:
            settings.ekit_heading_title_align === "text_center"
              ? "center"
              : "inherit",
          color: settings.ekit_heading_title_color,
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  if (type === "text-editor") {
    return (
      <div
        className="kit-widget kit-text"
        style={{ textAlign: settings.align || "inherit" }}
        dangerouslySetInnerHTML={{ __html: settings.editor ?? "" }}
      />
    );
  }

  if (type === "image") {
    const image = settings.image ?? {};
    const width = toSizeValue(settings.width);
    return (
      <div className="kit-widget kit-image">
        {image.url ? (
          <img
            src={image.url}
            alt={image.alt || ""}
            style={{ width, maxWidth: "100%", height: "auto" }}
          />
        ) : null}
      </div>
    );
  }

  if (type === "button") {
    return (
      <div className="kit-widget">
        <a className="kit-button" href={settings.link?.url || "#"}>
          {settings.text || "Button"}
        </a>
      </div>
    );
  }

  return null;
}

function renderNode(node: TemplateNode): JSX.Element | null {
  const key = node.id || `${node.elType}-${node.widgetType}`;
  const children = (node.elements ?? []).map(renderNode).filter(Boolean);

  if (node.elType === "widget") {
    const widget = renderWidget(node);
    if (widget) return <div key={key}>{widget}</div>;
    return (
      <div key={key} className="kit-widget kit-unsupported">
        Widget nao suportado: {node.widgetType}
      </div>
    );
  }

  const settings = node.settings ?? {};
  const style: CSSProperties = {
    display: "flex",
    flexDirection: settings.flex_direction || "column",
    justifyContent: settings.flex_justify_content || undefined,
    alignItems: settings.flex_align_items || undefined,
    minHeight: toSizeValue(settings.min_height),
    margin: toBoxValue(settings.margin),
    padding: toBoxValue(settings.padding),
    gap: toSizeValue(settings.flex_gap?.row ?? settings.flex_gap),
    width: toSizeValue(settings.width),
    maxWidth: toSizeValue(settings.boxed_width),
  };

  if (style.maxWidth) {
    style.marginLeft = "auto";
    style.marginRight = "auto";
  }

  if (settings.background_background === "classic" && settings.background_image?.url) {
    style.backgroundImage = `url(${settings.background_image.url})`;
    style.backgroundSize = settings.background_size || "cover";
    style.backgroundPosition = settings.background_position || "center";
  }

  return (
    <section key={key} className="kit-container" style={style}>
      {children}
    </section>
  );
}

type TemplateRendererProps = {
  content?: TemplateNode[];
};

export function TemplateRenderer({ content = [] }: TemplateRendererProps) {
  return <div className="kit-page">{content.map(renderNode)}</div>;
}

export default TemplateRenderer;
