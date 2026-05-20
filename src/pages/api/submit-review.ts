import type { APIRoute } from "astro";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const prerender = false;

function badRequest(message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { "content-type": "application/json" },
  });
}

function serverError(message: string, status = 500) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function getRedis(): Redis | null {
  const url = process.env.STORAGE_KV_REST_API_URL;
  const token = process.env.STORAGE_KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const redis = getRedis();
  if (!redis) {
    return serverError(
      "Submissions are temporarily unavailable. Please email reviews@smarteroutboundreviews.com directly and we'll publish your review.",
      503,
    );
  }

  const ip = clientAddress || "unknown";
  try {
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(1, "24 h"),
      prefix: "ratelimit:submit-review",
    });
    const { success } = await limiter.limit(ip);
    if (!success) {
      return serverError(
        "You've already submitted a review in the last 24 hours. Please wait and try again, or email us directly.",
        429,
      );
    }
  } catch {
    // ratelimit failure shouldn't block the submission
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body.");
  }

  const rating = Number(body?.rating);
  const title = String(body?.title || "").trim();
  const reviewBody = String(body?.body || "").trim();
  const reviewer = String(body?.reviewer || "").trim();
  const reviewerEmail = String(body?.reviewerEmail || "").trim();
  const reviewerTitle = String(body?.reviewerTitle || "").trim();
  const reviewerCompany = String(body?.reviewerCompany || "").trim();
  const serviceUsed = String(body?.serviceUsed || "").trim();
  const outcome = String(body?.outcome || "").trim();
  const consent = body?.consent === true;

  if (!rating || rating < 1 || rating > 5) return badRequest("Rating must be 1 to 5.");
  if (title.length < 10 || title.length > 150) return badRequest("Title must be 10-150 characters.");
  if (reviewBody.length < 100 || reviewBody.length > 5000)
    return badRequest("Review must be 100-5000 characters.");
  if (reviewer.length < 2 || reviewer.length > 80) return badRequest("Reviewer name is required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reviewerEmail))
    return badRequest("A valid email is required so we can verify you are a real client. Email is never published.");
  if (!consent) return badRequest("Please confirm you understand the editorial policy.");

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const submission = {
    id,
    rating,
    title,
    body: reviewBody,
    reviewer,
    reviewerEmail,
    reviewerTitle: reviewerTitle || null,
    reviewerCompany: reviewerCompany || null,
    serviceUsed: serviceUsed || null,
    outcome: outcome || null,
    submittedAt: new Date().toISOString(),
    ip,
    userAgent: request.headers.get("user-agent") || "",
    status: "pending",
  };

  try {
    await redis.hset(`review:pending:${id}`, submission as Record<string, any>);
    await redis.zadd("reviews:pending:queue", { score: Date.now(), member: id });
    await redis.expire(`review:pending:${id}`, 60 * 60 * 24 * 90); // 90-day retention
  } catch (err) {
    return serverError("We couldn't save your review right now. Please try again in a moment.");
  }

  return new Response(
    JSON.stringify({
      ok: true,
      message:
        "Thanks. We've received your review and will verify you as a client before publishing. You'll hear from us within 5 business days.",
    }),
    {
      status: 200,
      headers: { "content-type": "application/json" },
    },
  );
};
