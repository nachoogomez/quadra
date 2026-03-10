"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <AlertTriangle className="h-8 w-8 text-destructive" />
      <div>
        <h2 className="text-sm font-semibold text-foreground">Algo salió mal</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {error.digest ? `Error ID: ${error.digest}` : "Ocurrió un error inesperado."}
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={reset}>
        Reintentar
      </Button>
    </div>
  );
}
