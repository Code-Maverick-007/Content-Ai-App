import { clerkClient } from "@clerk/express";

// Middleware to attach userId, plan, and free-usage info
export const auth = async (req, res, next) => {
  try {
    const { userId, has } = await req.auth();
    req.userId = userId;                      // expose for controllers
    const hasPremiumPlan = await has({ plan: "premium" });

    // Latest Clerk metadata
    const user = await clerkClient.users.getUser(userId);

    // Premium status (helper OR stored flag)
    const metadataSaysPremium = user.privateMetadata?.plan === "premium";
    const isPremium = hasPremiumPlan || metadataSaysPremium;
    req.plan = isPremium ? "premium" : "free";

    // Free-usage counter (default 0)
    const freeUsage = Number(user.privateMetadata?.free_usage ?? 0);
    req.free_usage = freeUsage;

    // Initialise free_usage if missing
    if (user.privateMetadata?.free_usage === undefined) {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: freeUsage }
      });
    }

    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};