// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const data = require("../../../public/data.json");

export default function handler(req, res) {
  console.log(req.query.language);
  res.status(200).json(data[req.query.character][req.query.language]);
}
