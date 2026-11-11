// PUT/PATCH /api/records/:id -> Update a record
// DELETE    /api/records/:id -> Delete a record
const { ObjectId } = require("mongodb");
const { getCollection, cleanRecord } = require("../_db");

module.exports = async (req, res) => {
  try {
    const { id } = req.query;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid record id" });
    const _id = new ObjectId(id);
    const col = await getCollection();

    if (req.method === "PUT" || req.method === "PATCH") {
      const { rec, error } = cleanRecord(req.body);
      if (error) return res.status(400).json({ error });
      const result = await col.updateOne({ _id }, { $set: rec });
      if (!result.matchedCount) return res.status(404).json({ error: "Record not found" });
      return res.status(200).json({ _id: id, ...rec });
    }

    if (req.method === "DELETE") {
      const result = await col.deleteOne({ _id });
      if (!result.deletedCount) return res.status(404).json({ error: "Record not found" });
      return res.status(200).json({ deleted: true });
    }

    res.setHeader("Allow", "PUT, PATCH, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error: " + err.message });
  }
};
