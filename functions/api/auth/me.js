import { verifySessionToken, jsonResponse } from "../_auth_util.js";

export async function onRequestGet({ request, env }) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return jsonResponse({ error: "Missing or invalid authorization header." }, 401);
    }

    const token = authHeader.substring(7);
    const jwtSecret = env.JWT_SECRET || "studyo_edge_jwt_secret_free";
    const payload = await verifySessionToken(token, jwtSecret);

    if (!payload) {
      return jsonResponse({ error: "Session expired or invalid." }, 401);
    }

    if (!env.DB) {
      return jsonResponse({ user: { id: payload.userId, email: payload.email } });
    }

    const user = await env.DB.prepare(
      "SELECT id, email, display_name, created_at FROM users WHERE id = ?"
    ).bind(payload.userId).first();

    if (!user) {
      return jsonResponse({ error: "User not found." }, 404);
    }

    return jsonResponse({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name || user.email.split("@")[0],
        createdAt: user.created_at
      }
    }, 200);
  } catch (err) {
    return jsonResponse({ error: "Auth verification failed: " + err.message }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({}, 200);
}
