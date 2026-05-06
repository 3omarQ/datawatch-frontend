import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TopBarWrapper } from "@/components/dashboard/TopBarWrapper";
import { NotificationsProvider } from "@/components/providers/NotificationProvider";
import { BreadcrumbProvider } from "@/components/dashboard/shared/BreadcrumbContext";

async function getMe() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMe();
  if (!user) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-background">
      <TopBarWrapper user={user} />
      <NotificationsProvider >
        <main className="mx-auto max-w-6xl px-4 py-8">
          <BreadcrumbProvider>
            {children}
          </BreadcrumbProvider>

        </main>
      </NotificationsProvider>
    </div>
  );
}
