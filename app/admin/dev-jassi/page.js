import AdminBlogManager from "@/components/AdminBlogManager";

export const metadata = {
  title: "admin — portfolio",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminBlogManager />;
}
