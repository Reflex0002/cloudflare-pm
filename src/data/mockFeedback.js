import { mockTags } from "./mockTags.js";
import { mockUsers } from "./mockUsers.js";

const sourceTypes = ["SUPPORT", "DISCORD", "GITHUB", "EMAIL", "X", "FORUM"];
const sourceLabels = {
  SUPPORT: "Support Tickets",
  DISCORD: "Discord",
  GITHUB: "GitHub Issues",
  EMAIL: "Email",
  X: "X/Twitter",
  FORUM: "Community Forums",
};

const types = ["BUG", "FEATURE", "QUESTION", "PRAISE"];
const priorities = ["P0", "P1", "P2", "P3"];
const statuses = ["NEW", "TRIAGED", "IN_PROGRESS", "CLOSED"];
const sentiments = ["NEGATIVE", "NEUTRAL", "POSITIVE"];

const titles = [
  "Dashboard fails to load during traffic spike",
  "Need bulk tag management in inbox",
  "Feature request: webhook retries",
  "Discord alerting stops after reconnect",
  "API token rotation UX is confusing",
  "Slow response times in analytics",
  "Broken link in onboarding email",
  "Please add per-team SLA filters",
  "Export to CSV missing priority",
  "Love the new triage flow",
  "Billing page shows incorrect totals",
  "Mobile navigation needs improvement",
];

const snippets = [
  "Users report blank screens when refreshing the dashboard.",
  "Looking for a faster way to update tags across many items.",
  "Retries are needed when downstream services fail.",
  "We lost alerts after the Discord bot reconnects.",
  "Rotating tokens requires too many clicks.",
  "Latency spikes appear during heavy usage.",
  "Onboarding email link points to 404.",
  "Would like filters for SLA risk and queue.",
  "Priority column doesn't appear in exports.",
  "Great experience overall with the new design.",
  "Invoice totals don't match usage reports.",
  "Navigation on mobile is hard to reach.",
];

const bodies = [
  "We are seeing intermittent failures when many agents open the dashboard. The page stays blank and never recovers unless we hard refresh.",
  "We triage dozens of items daily. A bulk tag editor would save a lot of time during cleanup and labeling.",
  "Please add retries with exponential backoff for webhooks so we can avoid missing events.",
  "After the Discord bot reconnects, alerts stop and we have to re-authenticate manually.",
  "Token rotation requires visiting multiple pages and the flow is not obvious.",
  "The analytics panel sometimes takes 10+ seconds to respond, especially with filters.",
  "The onboarding email for new users includes a broken link to the setup guide.",
  "We want to focus on SLA risk items across all queues for escalation.",
  "CSV exports miss the priority field, making reporting difficult.",
  "Just wanted to say the new triage view is fantastic. Great work!",
  "Billing totals are higher than expected. The summary does not match our usage.",
  "On small screens, the primary navigation is hard to access.",
];

const createMetadata = (sourceType, index) => {
  switch (sourceType) {
    case "SUPPORT":
      return {
        ticketId: `SUP-${1000 + index}`,
        queue: index % 2 === 0 ? "Enterprise" : "SMB",
        slaHoursRemaining: Math.max(0, 24 - (index % 12) * 2),
      };
    case "DISCORD":
      return {
        server: index % 2 === 0 ? "Cloudflare Devs" : "Customer Hub",
        channel: index % 3 === 0 ? "#alerts" : "#feedback",
        messageId: `msg-${index}-${Date.now()}`,
      };
    case "GITHUB":
      return {
        repo: index % 2 === 0 ? "cloudflare/pm" : "cloudflare/edge",
        issueNumber: 240 + index,
        labels: index % 2 === 0 ? ["bug", "triage"] : ["feature"],
      };
    case "EMAIL":
      return {
        mailbox: index % 2 === 0 ? "support@" : "feedback@",
        threadId: `thr-${index}-${Date.now()}`,
        fromDomain: index % 2 === 0 ? "example.com" : "startup.io",
      };
    case "X":
      return {
        tweetId: `tw-${index}-${Date.now()}`,
        followerCount: 500 + index * 15,
      };
    case "FORUM":
      return {
        forumName: "Community Hub",
        category: index % 2 === 0 ? "Performance" : "UX",
        upvotes: 10 + (index % 12),
      };
    default:
      return {};
  }
};

const pick = (arr, index, offset = 0) => arr[(index + offset) % arr.length];

export const mockFeedback = Array.from({ length: 60 }).map((_, index) => {
  const sourceType = pick(sourceTypes, index);
  const user = pick(mockUsers, index, 2);
  const createdAt = new Date(Date.now() - index * 6 * 60 * 60 * 1000).toISOString();
  const tagCount = (index % 3) + 1;
  const tags = Array.from({ length: tagCount }).map((__, tagIndex) =>
    pick(mockTags, index, tagIndex)
  );

  return {
    id: `fb-${index + 1}`,
    sourceType,
    sourceLabel: sourceLabels[sourceType],
    title: pick(titles, index),
    snippet: pick(snippets, index),
    body: pick(bodies, index),
    authorName: user.name,
    authorHandle: user.handle,
    company: user.company,
    createdAt,
    status: pick(statuses, index, 1),
    type: pick(types, index, 2),
    priority: pick(priorities, index, 3),
    sentiment: pick(sentiments, index, 2),
    tags,
    productArea: pick(["Networking", "Security", "Analytics", "Edge"], index),
    sourceMetadata: createMetadata(sourceType, index),
  };
});
