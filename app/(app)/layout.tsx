import BottomNav from "@/components/BottomNav";
import TopNav from "@/components/TopNav";
import AuthGuard from "@/components/AuthGuard";
import { AuthProvider } from "@/contexts/AuthContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen" style={{ background: "#EAE5DF" }}>
        <AuthGuard />
        <TopNav />
        <div className="flex-1 pb-16 md:pb-0 w-full md:max-w-4xl md:mx-auto md:px-8 md:py-6">
          {children}
        </div>
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </AuthProvider>
  );
}
