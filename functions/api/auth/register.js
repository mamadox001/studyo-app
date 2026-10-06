import { generateSalt, hashPassword, createSessionToken, jsonResponse } from "../_auth_util.js";

export async function onRequestPost({ request, env }) {
  try {
    const { email, password, displayName } = await request.json();

    // Validation
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return jsonResponse({ error: "Please enter a valid email address." }, 400);
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return jsonResponse({ error: "Password must be at least 6 characters long." }, 400);
    }

    const cleanEmail = email.trim().toLowerCase();
    const name = displayName?.trim() || cleanEmail.split("@")[0];

    // Check if D1 database binding exists
    if (!env.DB) {
      return jsonResponse({ 
        error: "Cloudflare D1 Database binding 'DB' is not configured yet. Run schema.sql and bind DB." 
      }, 500);
    }

    // Check if email already registered
    const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?")
      .bind(cleanEmail)
      .first();

    if (existing) {
      return jsonResponse({ error: "An account with this email already exists. Please log in." }, 409);
    }

    // Generate salt and hash password
    const salt = generateSalt();
    const passwordHash = await hashPassword(password, salt);
    const userId = "usr_" + crypto.randomUUID().replace(/-/g, "");

    // Insert user into D1
    await env.DB.prepare(
      "INSERT INTO users (id, email, password_hash, salt, display_name) VALUES (?, ?, ?, ?, ?)"
    ).bind(userId, cleanEmail, passwordHash, salt, name).run();

    // Initialize user cloud sync row
    await env.DB.prepare(
      "INSERT INTO user_sync (user_id, streak, total_minutes, sessions_data, quest_data, settings_data) VALUES (?, 1, 0, '[]', '{}', '{}')"
    ).bind(userId).run();

    // Generate JWT Session Token
    const jwtSecret = env.JWT_SECRET || "studyo_edge_jwt_secret_free";
    const token = await createSessionToken(userId, cleanEmail, jwtSecret);

    return jsonResponse({
      message: "Account created successfully!",
      token,
      user: {
        id: userId,
        email: cleanEmail,
        displayName: name,
        createdAt: new Date().toISOString()
      }
    }, 201);
  } catch (err) {
    return jsonResponse({ error: "Registration failed: " + err.message }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({}, 200);
}
