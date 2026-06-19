import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportToPdf(node: HTMLElement, filename: string) {
  const canvas = await html2canvas(node, { scale: 2, backgroundColor: "#FAF6EE", useCORS: true });
  const img = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const ratio = canvas.width / canvas.height;
  let w = pageW - 40, h = w / ratio;
  if (h > pageH - 40) { h = pageH - 40; w = h * ratio; }
  pdf.addImage(img, "PNG", (pageW - w) / 2, 20, w, h);
  pdf.save(filename);
}
