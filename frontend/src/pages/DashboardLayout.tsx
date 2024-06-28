import Sidebar from "@/components/Sidebar";
import UserPanel from "@/components/UserPanel";
import { UserContextProvider } from "@/components/UserContext.tsx";

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
export default function Dashboard({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex h-screen w-full py-7">
      <UserContextProvider>
        <Sidebar />
        {children}
        <UserPanel />
      </UserContextProvider>
    </section>
  );
}
