export async function GET() {
  return Response.json({
    app: "parking-lagbe",
    status: "ok",
    supabaseConfigured: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
  });
}
