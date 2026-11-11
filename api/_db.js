const { MongoClient } = require("mongodb");

// Reuse the connection across serverless invocations.
let cached = global._mongoPromise;

function getCollection() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set");
  }
  if (!cached) {
    const client = new MongoClient(process.env.MONGODB_URI);
    cached = global._mongoPromise = client.connect();
  }
  return cached.then((client) =>
    client
      .db(process.env.MONGODB_DB || "LabAttendanceDB_PALER")
      .collection(process.env.MONGODB_COLLECTION || "LabAttendanceDB")
  );
}

// Validate and normalise a record from the request body.
// Shape matches the existing LabAttendanceDB collection:
// { subject_name, section, student_name, attendance_dates: [ "YYYY-MM-DD", ... ] }
function cleanRecord(body) {
  const b = body || {};
  const rec = {
    subject_name: String(b.subject_name || "").trim(),
    section: String(b.section || "").trim(),
    student_name: String(b.student_name || "").trim(),
  };
  const missing = Object.keys(rec).filter((k) => !rec[k]);
  if (missing.length) return { error: "Missing required field(s): " + missing.join(", ") };

  let dates = b.attendance_dates;
  if (typeof dates === "string") dates = dates.split(",");
  if (!Array.isArray(dates)) dates = [];
  dates = dates.map((d) => String(d).trim()).filter(Boolean);
  if (!dates.length) return { error: "At least one attendance date is required" };
  if (dates.some((d) => !/^\d{4}-\d{2}-\d{2}$/.test(d))) {
    return { error: "Dates must be YYYY-MM-DD (separate several with commas)" };
  }
  rec.attendance_dates = dates;
  return { rec };
}

module.exports = { getCollection, cleanRecord };
