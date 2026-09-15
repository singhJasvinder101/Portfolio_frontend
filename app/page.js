import HomePage from "@/components/Home";
import { getAllBlogsSafe } from "@/lib/blogs";
import { jsonLdScript } from "@/lib/jsonld";
import { SITE_NAME, SITE_ROLE, SITE_COMPANY, SITE_URL } from "@/lib/site-config";

export const dynamic = "force-dynamic";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_NAME,
  jobTitle: SITE_ROLE,
  worksFor: { "@type": "Organization", name: SITE_COMPANY },
  url: SITE_URL,
  sameAs: [
    "https://github.com/singhJasvinder101",
    "https://www.linkedin.com/in/jasvinder-singh-466a72256/",
  ],
};

export default async function Page() {
  const { posts, status } = await getAllBlogsSafe();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(personJsonLd) }}
      />
      <HomePage posts={posts} postsStatus={status} />
    </>
  );
}
