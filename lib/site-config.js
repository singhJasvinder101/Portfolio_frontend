export const SITE_ROLE = process.env.NEXT_PUBLIC_SITE_ROLE || "Software Engineer";
export const SITE_COMPANY = process.env.NEXT_PUBLIC_SITE_COMPANY || "Omniful";
export const SITE_BUILDING =
  process.env.NEXT_PUBLIC_SITE_BUILDING || "Distributed Systems and Agentic AI Engineering";
export const SITE_NAME = "Jasvinder";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteUrlWithProtocol = /^https?:\/\//i.test(rawSiteUrl) ? rawSiteUrl : `https://${rawSiteUrl}`;
export const SITE_URL = siteUrlWithProtocol.replace(/\/+$/, "");
export const SITE_DESCRIPTION = `${SITE_ROLE} at ${SITE_COMPANY}, writing about backend systems, distributed systems, and agentic AI.`;
