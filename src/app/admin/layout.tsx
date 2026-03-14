import AdminLayout from "@/components/admin/admin-layout";

export const metadata = {
  title: "선비샵 관리자",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
