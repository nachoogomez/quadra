import { getUser } from "@/lib/supabase/get-user";
import { UserProvider } from "@/lib/stores/user-provider";
import { QueryProvider } from "@/lib/query/query-provider";
import { Sidebar } from "@/components/sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    data: { user },
  } = await getUser();

  return (
    <QueryProvider>
      <UserProvider initialUser={user}>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto pt-14 md:pt-0">{children}</main>
        </div>
      </UserProvider>
    </QueryProvider>
  );
}
