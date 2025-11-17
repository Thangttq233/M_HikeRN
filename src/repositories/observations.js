
import { run, all } from '../db/sqlite';

export async function addObservation(hikeId, { content, timestamp, note }) {
  const ts = timestamp || new Date().toISOString();
  const res = await run(
    `INSERT INTO observations (hikeId, content, timestamp, note) VALUES (?, ?, ?, ?);`,
    [hikeId, content, ts, note || null]
  );
  return res.lastInsertRowId;
}

export async function listObservations(hikeId) {
  return all(
    `SELECT * FROM observations WHERE hikeId=? ORDER BY timestamp DESC, id DESC;`,
    [hikeId]
  );
}

export async function updateObservation(id, { content, timestamp, note }) {
  const ts = timestamp || new Date().toISOString();
  await run(
    `UPDATE observations SET content=?, timestamp=?, note=? WHERE id=?;`,
    [content, ts, note || null, id]
  );
}

export async function deleteObservation(id) {
  await run(`DELETE FROM observations WHERE id=?;`, [id]);
}
