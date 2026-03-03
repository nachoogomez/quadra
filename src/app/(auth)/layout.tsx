export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background font-bold text-sm">
          Q
        </div>
        <span className="text-lg font-semibold text-foreground">Quadra</span>
      </div>
      <div className="w-full max-w-sm">
        {children}
      </div>
    </div>
  );
}
