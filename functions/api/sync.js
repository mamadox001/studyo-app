import { verifySessionToken, jsonResponse } from "./_auth_util.js";

// GET: Fetch synced data for current user
export async function onRequestGet({ request, env }) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const token = authHeader.substring(7);
    const jwtSecret = env.JWT_SECRET || "studyo_edge_jwt_secret_free";
    const payload = await verifySessionToken(token, jwtSecret);

    if (!payload || !env.DB) {
      return jsonResponse({ error: "Unauthorized or Database unavailable" }, 401);
    }

    const row = await env.DB.prepare(
      "SELECT streak, total_minutes, sessions_data, quest_data, settings_data, updated_at FROM user_sync WHERE user_id = ?"
    ).bind(payload.userId).first();

    if (!row) {
      return jsonResponse({
        streak: 1,
        total_minutes: 0,
        sessions: [],
        quest: null,
        settings: null
      });
    }

    return jsonResponse({
      streak: row.streak,
      total_minutes: row.total_minutes,
      sessions: row.sessions_data ? JSON.parse(row.sessions_data) : [],
      quest: row.quest_data ? JSON.parse(row.quest_data) : null,
      settings: row.settings_data ? JSON.parse(row.settings_data) : null,
      updatedAt: row.updated_at
    });
  } catch (err) {
    return jsonResponse({ error: "Sync fetch failed: " + err.message }, 500);
  }
}

// POST: Save/Push user progress to Cloudflare D1
export async function onRequestPost({ request, env }) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const token = authHeader.substring(7);
    const jwtSecret = env.JWT_SECRET || "studyo_edge_jwt_secret_free";
    const payload = await verifySessionToken(token, jwtSecret);

    if (!payload || !env.DB) {
      return jsonResponse({ error: "Unauthorized or Database unavailable" }, 401);
    }

    const { streak, totalMinutes, sessions, quest, settings } = await request.json();

    const sessionsStr = JSON.stringify(sessions || []);
    const questStr = JSON.stringify(quest || {});
    const settingsStr = JSON.stringify(settings || {});

    await env.DB.prepare(`
      INSERT INTO user_sync (user_id, streak, total_minutes, sessions_data, quest_data, settings_data, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        streak = excluded.streak,
        total_minutes = excluded.total_minutes,
        sessions_data = excluded.sessions_data,
        quest_data = excluded.quest_data,
        settings_data = excluded.settings_data,
        updated_at = CURRENT_TIMESTAMP
    `).bind(
      payload.userId,
      streak || 1,
      totalMinutes || 0,
      sessionsStr,
      questStr,
      settingsStr
    ).run();

    return jsonResponse({ success: true, message: "Progress synced to Cloudflare D1 edge database!" });
  } catch (err) {
    return jsonResponse({ error: "Sync push failed: " + err.message }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({}, 200);
}
