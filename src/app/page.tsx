import { PublicLayout } from "@/layouts/PublicLayout";

export default async function Home() {
  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to Trading Dashboard
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Manage your trading operations and symbols with powerful backtesting capabilities.
        </p>
        <div className="flex gap-4">
          <a
            href="/symbol"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Manage Symbols
          </a>
          <a
            href="/operation"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            View Operations
          </a>
        </div>
      </div>
    </PublicLayout>
  );
}
