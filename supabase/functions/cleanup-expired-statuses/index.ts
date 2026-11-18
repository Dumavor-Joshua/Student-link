import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405, headers: corsHeaders });
  }

  const expectedSecret = Deno.env.get("STATUS_CLEANUP_SECRET");
  const suppliedSecret = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!expectedSecret || !suppliedSecret || suppliedSecret !== expectedSecret) {
    return Response.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing Supabase server environment variables.");
    return Response.json({ error: "Cleanup is not configured" }, { status: 500, headers: corsHeaders });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const cutoff = new Date().toISOString();

  const { data: expired, error: selectError } = await supabase
    .from("studentlink_statuses")
    .select("id,media_path")
    .lte("expires_at", cutoff)
    .order("expires_at", { ascending: true })
    .limit(500);

  if (selectError) {
    console.error("Could not select expired statuses:", selectError.message);
    return Response.json({ error: "Could not load expired statuses" }, { status: 500, headers: corsHeaders });
  }
  if (!expired?.length) {
    return Response.json({ deletedStatuses: 0, deletedMedia: 0 }, { headers: corsHeaders });
  }

  const paths = [...new Set(expired.map((row) => row.media_path).filter(Boolean))];
  let removablePaths = paths;
  if (paths.length) {
    const { data: stillReferenced, error: referenceError } = await supabase
      .from("studentlink_statuses")
      .select("media_path")
      .in("media_path", paths)
      .gt("expires_at", cutoff);
    if (referenceError) {
      console.error("Could not check active media references:", referenceError.message);
      return Response.json({ error: "Could not verify media references" }, { status: 500, headers: corsHeaders });
    }
    const activePaths = new Set((stillReferenced || []).map((row) => row.media_path));
    removablePaths = paths.filter((path) => !activePaths.has(path));
  }

  let deletedMedia = 0;
  if (removablePaths.length) {
    const { data: removed, error: removeError } = await supabase.storage
      .from("status-media")
      .remove(removablePaths);
    if (removeError) {
      console.error("Could not remove expired status media:", removeError.message);
      return Response.json({ error: "Could not remove expired status media" }, { status: 500, headers: corsHeaders });
    }
    deletedMedia = removed?.length ?? removablePaths.length;
  }

  const expiredIds = expired.map((row) => row.id);
  const { error: deleteError, count } = await supabase
    .from("studentlink_statuses")
    .delete({ count: "exact" })
    .in("id", expiredIds);

  if (deleteError) {
    console.error("Could not delete expired status rows:", deleteError.message);
    return Response.json({ error: "Media cleanup ran but status-row deletion failed" }, { status: 500, headers: corsHeaders });
  }

  return Response.json({
    deletedStatuses: count ?? expiredIds.length,
    deletedMedia,
    retainedSharedMedia: paths.length - removablePaths.length,
  }, { headers: corsHeaders });
});
