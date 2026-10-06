import { hashPassword, createSessionToken, jsonResponse } from "../_auth_util.js";

export async function onRequestPost({ request, env }) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return jsonResponse({ error: "Email and password are required." }, 400);
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!env.DB) {
      return jsonResponse({ 
        error: "Cloudflare D1 Database binding 'DB' is not configured yet." 
      }, 500);
    }

    // Lookup user in D1
    const user = await env.DB.prepare(
      "SELECT id, email, password_hash, salt, display_name FROM users WHERE email = ?"
    ).bind(cleanEmail).first();

    if (!user) {
      return jsonResponse({ error: "Invalid email or password." }, 401);
    }

    // Hash provided password with user's salt and compare
    const computedHash = await hashPassword(password, user.salt);
    if (computedHash !== user.password_hash) {
      return jsonResponse({ error: "Invalid email or password." }, 401);
    }

    // Update last_login_at
    await env.DB.prepare(
      "UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind(user.id).run();

    // Generate JWT Session Token
    const jwtSecret = env.JWT_SECRET || "studyo_edge_jwt_secret_free";
    const token = await createSessionToken(user.id, user.email, jwtSecret);

    return jsonResponse({
      message: "Welcome back!",
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name || user.email.split("@")[0]
      }
    }, 200);
  } catch (err) {
    return jsonResponse({ error: "Login error: " + err.message }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({}, 200);
}
