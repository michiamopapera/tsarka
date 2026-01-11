import { REBUILD_SQL } from "./rebuild_sql.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/rebuild") {
      return rebuildDatabase(request, env);
    }

    return new Response("Not found", { status: 404 });
  }
};

async function rebuildDatabase(request, env) {
  const auth = request.headers.get("Authorization");

  if (auth !== "Bearer gewurztraminer") {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await env.db.prepare(REBUILD_SQL).run();

    return new Response(
      JSON.stringify(
        { status: "ok", message: "Database rebuilt successfully" },
        null,
        2
      ),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify(
        { status: "error", message: err.message },
        null,
        2
      ),
      { status: 500 }
    );
  }
}
