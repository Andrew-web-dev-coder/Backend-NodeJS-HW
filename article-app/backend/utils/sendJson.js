export function sendJson(res, status, data) {
  res.status(status).json(data);
}
