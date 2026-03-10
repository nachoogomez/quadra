"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/lib/stores/user-store";
import { cn } from "@/lib/utils";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  phone: z.string().min(8, "Teléfono inválido"),
});

const passwordSchema = z
  .object({
    newPassword: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine(d => d.newPassword === d.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

// ─── Success message ──────────────────────────────────────────────────────────

function SuccessMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-600 dark:text-green-400">
      <CheckCircle2 size={15} />
      {message}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SettingsPage() {
  const user = useUserStore(s => s.user);
  const setUser = useUserStore(s => s.setUser);
  const supabase = createClient();

  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ── Profile form ────────────────────────────────────────────────────────────
  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      phone: user?.["phone" as keyof typeof user] as string ?? "",
    },
  });

  const onSaveProfile = async (values: ProfileValues) => {
    setProfileError(null);
    setProfileSuccess(false);

    const { error } = await supabase.auth.updateUser({
      data: { full_name: values.fullName, phone: values.phone },
    });

    if (error) {
      setProfileError("No se pudo guardar. Intentá de nuevo.");
      return;
    }

    // Refresh store
    const { data: { user: updated } } = await supabase.auth.getUser();
    if (updated) setUser(updated);
    setProfileSuccess(true);
  };

  // ── Password form ────────────────────────────────────────────────────────────
  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSavePassword = async (values: PasswordValues) => {
    setPasswordError(null);
    setPasswordSuccess(false);

    const { error } = await supabase.auth.updateUser({ password: values.newPassword });

    if (error) {
      setPasswordError("No se pudo cambiar la contraseña. Intentá de nuevo.");
      return;
    }

    passwordForm.reset();
    setPasswordSuccess(true);
  };

  return (
    <div className="flex h-full flex-col overflow-auto">
      <header className="flex items-center border-b border-border px-4 md:px-8 py-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Configuración</h1>
          <p className="text-sm text-muted-foreground">Administrá tu cuenta y preferencias</p>
        </div>
      </header>

      <div className="flex flex-col gap-6 p-4 md:p-8 max-w-2xl">

        {/* Avatar + email (read-only) */}
        <Section title="Perfil" description="Actualizá tu nombre y número de teléfono">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 rounded-xl">
              <AvatarImage src={user?.avatarUrl ?? undefined} alt={user?.fullName} />
              <AvatarFallback className="rounded-xl bg-muted text-xl font-semibold">
                {user?.initials ?? "??"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-foreground">{user?.fullName}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-4">
            {/* Full name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input
                id="fullName"
                placeholder="Juan García"
                {...profileForm.register("fullName")}
                className={cn(profileForm.formState.errors.fullName && "border-destructive")}
              />
              {profileForm.formState.errors.fullName && (
                <p className="text-xs text-destructive">{profileForm.formState.errors.fullName.message}</p>
              )}
            </div>

            {/* Email (read-only) */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user?.email ?? ""}
                disabled
                className="opacity-60 cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">El email no se puede modificar.</p>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+54 9 11 1234 5678"
                {...profileForm.register("phone")}
                className={cn(profileForm.formState.errors.phone && "border-destructive")}
              />
              {profileForm.formState.errors.phone && (
                <p className="text-xs text-destructive">{profileForm.formState.errors.phone.message}</p>
              )}
            </div>

            {profileError && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{profileError}</p>
            )}
            {profileSuccess && <SuccessMessage message="Perfil actualizado correctamente." />}

            <Button type="submit" disabled={profileForm.formState.isSubmitting}>
              {profileForm.formState.isSubmitting && <Loader2 size={14} className="animate-spin" />}
              Guardar cambios
            </Button>
          </form>
        </Section>

        {/* Change password */}
        <Section title="Contraseña" description="Cambiá tu contraseña de acceso">
          <form onSubmit={passwordForm.handleSubmit(onSavePassword)} className="space-y-4">
            {/* New password */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="newPassword">Nueva contraseña</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  {...passwordForm.register("newPassword")}
                  className={cn("pr-10", passwordForm.formState.errors.newPassword && "border-destructive")}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(v => !v)}
                  aria-label={showNew ? "Hide new password" : "Show new password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showNew ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
                </button>
              </div>
              {passwordForm.formState.errors.newPassword && (
                <p className="text-xs text-destructive">{passwordForm.formState.errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repetir contraseña"
                  {...passwordForm.register("confirmPassword")}
                  className={cn("pr-10", passwordForm.formState.errors.confirmPassword && "border-destructive")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
                </button>
              </div>
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-xs text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            {passwordError && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{passwordError}</p>
            )}
            {passwordSuccess && <SuccessMessage message="Contraseña actualizada correctamente." />}

            <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
              {passwordForm.formState.isSubmitting && <Loader2 size={14} className="animate-spin" />}
              Cambiar contraseña
            </Button>
          </form>
        </Section>

      </div>
    </div>
  );
}
