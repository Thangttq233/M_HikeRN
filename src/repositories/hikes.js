
// src/repositories/hikes.js
import { run, all } from '../db/sqlite';

/** CREATE */
export async function createHike(h) {
  const { name, location, date, parking, length, difficulty, description, field1, field2 } = h;
  const res = await run(
    `INSERT INTO hikes
     (name, location, date, parking, length, difficulty, description, field1, field2, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'));`,
    [name, location, date, parking ? 1 : 0, Number(length), difficulty, description || null, field1 || null, field2 || null]
  );
  return res.lastInsertRowId;
}

/** READ - list tất cả */
export async function listHikes() {
  const rows = await all(`SELECT * FROM hikes ORDER BY date DESC, id DESC;`);
  return rows;
}

/** READ - lấy 1 bản ghi theo id */
export async function getHike(id) {
  const rows = await all(`SELECT * FROM hikes WHERE id=?;`, [id]);
  return rows[0] || null;
}

/** UPDATE */
export async function updateHike(id, h) {
  const { name, location, date, parking, length, difficulty, description, field1, field2 } = h;
  await run(
    `UPDATE hikes SET
      name=?, location=?, date=?, parking=?, length=?, difficulty=?,
      description=?, field1=?, field2=?, updatedAt=datetime('now')
     WHERE id=?;`,
    [name, location, date, parking ? 1 : 0, Number(length), difficulty, description || null, field1 || null, field2 || null, id]
  );
}

/** DELETE */
export async function deleteHike(id) {
  await run(`DELETE FROM hikes WHERE id=?;`, [id]);
}

/** RESET DB (xoá tất cả hike) */
export async function resetDb() {
  await run(`DELETE FROM hikes;`);
}

/** SEARCH cơ bản: tên (prefix, không phân biệt hoa/thường) */
export async function searchHikesByNamePrefix(q, limit = 50) {
  const text = (q ?? '').trim();
  if (!text) return [];
  return all(
    `SELECT * FROM hikes
     WHERE name LIKE ? COLLATE NOCASE
     ORDER BY name ASC
     LIMIT ?;`,
    [text + '%', limit]
  );
}

/** SEARCH nâng cao: name (prefix), location (contains), length range, date range */
export async function searchHikesAdvanced({
  name,
  location,
  minLength,
  maxLength,
  fromDate,
  toDate,
  limit = 200,
}) {
  const where = [];
  const params = [];

  if (name?.trim()) {
    where.push('name LIKE ? COLLATE NOCASE');
    params.push(name.trim() + '%');
  }
  if (location?.trim()) {
    where.push('location LIKE ? COLLATE NOCASE');
    params.push('%' + location.trim() + '%');
  }
  if (minLength !== undefined && minLength !== null && String(minLength).length) {
    where.push('length >= ?');
    params.push(Number(minLength));
  }
  if (maxLength !== undefined && maxLength !== null && String(maxLength).length) {
    where.push('length <= ?');
    params.push(Number(maxLength));
  }
  if (fromDate?.trim()) {
    where.push('date >= ?');
    params.push(fromDate.trim());
  }
  if (toDate?.trim()) {
    where.push('date <= ?');
    params.push(toDate.trim());
  }

  const sql = `
    SELECT * FROM hikes
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY date DESC, id DESC
    LIMIT ?;
  `;
  params.push(limit);

  return all(sql, params);
}
