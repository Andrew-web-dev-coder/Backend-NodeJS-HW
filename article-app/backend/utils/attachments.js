export function mapFilesToAttachments(files = []) {
  return files.map((f) => ({
    filename: f.filename,
    originalname: f.originalname,
    size: f.size,
    url: `/uploads/${f.filename}`,
  }));
}