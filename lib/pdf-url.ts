export interface PdfEmbedOptions {
  page?: number;
  hideToolbar?: boolean;
  hideNavpanes?: boolean;
  hideScrollbar?: boolean;
  view?: "Fit" | "FitH" | "FitV" | "FitB";
  zoom?: number;
}

export function buildPdfEmbedUrl(
  url: string,
  {
    page,
    hideToolbar = true,
    hideNavpanes = true,
    hideScrollbar = false,
    view = "FitH",
    zoom,
  }: PdfEmbedOptions = {}
): string {
  const params = new URLSearchParams();

  if (page != null) params.set("page", String(page));
  if (hideToolbar) params.set("toolbar", "0");
  if (hideNavpanes) params.set("navpanes", "0");
  if (hideScrollbar) params.set("scrollbar", "0");
  if (view) params.set("view", view);
  if (zoom != null) params.set("zoom", String(zoom));

  const hash = params.toString();
  if (!hash) return url;

  const base = url.split("#")[0];
  return `${base}#${hash}`;
}
