export default function handler(req, res) {
  const { name } = req.query;
  const { greeting } = req.params;
  res.status(200).json({ message: greeting + " " + name });
}
