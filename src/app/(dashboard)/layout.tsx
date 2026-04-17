import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { count: pendingCount } = await supabase
    .from("testimonials")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending")
    .in(
      "space_id",
      (await supabase.from("spaces").select("id").eq("user_id", user.id)).data?.map((s) => s.id) ?? []
    );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar profile={profile} pendingCount={pendingCount ?? 0} />
      <main className="flex-1 md:ml-64 mt-14 md:mt-0 p-4 md:p-8">{children}</main>
    </div>
  );
}
