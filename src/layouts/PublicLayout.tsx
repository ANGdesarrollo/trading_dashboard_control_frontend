import { Navbar } from "@/components/navbar"

export const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </>
  );
};
