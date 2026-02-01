import PDFDocument from "pdfkit";
import db from "../models/index.js";

const { Article, ArticleVersion, User } = db;

function stripHtml(html = "") {
  return html
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

export async function exportArticlePdf(req, res) {
  try {
    const { id } = req.params;

    const article = await Article.findByPk(id, {
      include: [{ model: User, as: "author" }],
    });
    if (!article) return res.status(404).json({ error: "Article not found" });

    const latestVersion = await ArticleVersion.findOne({
      where: { articleId: id },
      order: [["version", "DESC"]],
    });

    if (!latestVersion) {
      return res.status(404).json({ error: "No versions found" });
    }

    const title = latestVersion.title || "Untitled";
    const plainContent = stripHtml(latestVersion.content || "");

    const safeName = title.replace(/[^\w\-]+/g, "_").slice(0, 60);
    const filename = `${safeName || "article"}_${id}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });

    doc.pipe(res);

    // Title
    doc.fontSize(20).text(title, { align: "left" });
    doc.moveDown(0.8);

    // Metadata
    doc.fontSize(10).fillColor("gray");
    doc.text(`Article ID: ${article.id}`);
    doc.text(`Version: ${latestVersion.version}`);
    doc.text(`Created: ${new Date(article.createdAt).toLocaleString()}`);
    if (article.author?.email) doc.text(`Author: ${article.author.email}`);
    doc.fillColor("black");
    doc.moveDown(1);

    // Content
    doc.fontSize(12);
    doc.text(plainContent || "(empty)", {
      align: "left",
      lineGap: 4,
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to export PDF" });
  }
}
