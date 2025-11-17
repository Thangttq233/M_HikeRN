
// src/db/sqlite.js
import * as SQLite from 'expo-sqlite';

let _db; // SQLiteDatabase

export async function getDb() {
  if (_db) return _db;
  _db = await SQLite.openDatabaseAsync('mhike.db');
  await _db.execAsync('PRAGMA foreign_keys = ON;');
  return _db;
}

// Chạy nhiều câu không có tham số (init schema)
export async function exec(sql) {
  const db = await getDb();
  return db.execAsync(sql);
}

// INSERT/UPDATE/DELETE có tham số
export async function run(sql, params = []) {
  const db = await getDb();
  // runAsync nhận danh sách tham số rải (spread)
  const result = await db.runAsync(sql, ...params);
  // Kết quả thường có lastInsertRowId, changes
  return result;
}

// SELECT trả về mảng object
export async function all(sql, params = []) {
  const db = await getDb();
  const rows = await db.getAllAsync(sql, ...params);
  return rows;
}
