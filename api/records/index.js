// GET /api/records   -> Read all records
// POST /api/records  -> Create a record
const { getCollection, cleanRecord } = require("../_db");

module.exports = async (req, res) => {
  try {
    const col = await getCollection();

    if (req.method === "GET") {
      const docs = await col.find({}).sort({ _id: -1 }).toArray();
      return res.status(200).json(docs);
    }

    if (req.method === "POST") {
      const { rec, error } = cleanRecord(req.body);
      if (error) return res.status(400).json({ error });
      const result = await col.insertOne(rec);
      return res.status(201).json({ _id: result.insertedId, ...rec });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error: " + err.message });
  }
};
