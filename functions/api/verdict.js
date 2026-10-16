export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const argument = body.argument || body.text || body.message || "";

    if (!argument.trim()) {
      return Response.json({ error: "No argument provided" }, { status: 400 });
    }

    const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        {
          role: "system",
          content:
            "You are a funny, dramatic judge settling everyday arguments. Read both sides, pick a winner, and give a short verdict (3-4 sentences) with humor. Be playful, never mean.",
        },
        { role: "user", content: argument },
      ],
      max_tokens: 250,
    });

    return Response.json({ verdict: result.response });
  } catch (err) {
    return Response.json({ error: "Judge is out of the courtroom" }, { status: 500 });
  }
}