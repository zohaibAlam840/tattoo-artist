"use client";
import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { updateOwnProfileAction, uploadAvatarAction } from "@/app/actions/users";

export default function EditProfile() {
  const router = useRouter();
  const { profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({ name: "", handle: "" });
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setForm({ name: profile.full_name ?? "", handle: profile.handle ?? "" });
      if (profile.avatar_url) setAvatarPreview(profile.avatar_url);
    }
  }, [profile]);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    setError("");
    setUploading(true);

    // Upload avatar first if changed
    if (avatarFile) {
      const fd = new FormData();
      fd.append("avatar", avatarFile);
      const res = await uploadAvatarAction(fd);
      if (res?.error) { setError(res.error); setUploading(false); return; }
    }

    setUploading(false);

    startTransition(async () => {
      const res = await updateOwnProfileAction({ full_name: form.name, handle: form.handle });
      if (res?.error) setError(res.error);
      else {
        await refreshProfile();
        router.push("/profile");
      }
    });
  }

  const initial = form.name[0]?.toUpperCase() ?? "?";

  return (
    <main
      className="min-h-screen px-5 pt-6 pb-8"
      style={{ background: "#EAE5DF", fontFamily: "var(--font-dm-sans)" }}
    >
      <button onClick={() => router.back()} className="mb-8" aria-label="Go back">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 19l-7-7 7-7" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <h1
        className="text-3xl font-light text-[#2C2C2C] mb-8"
        style={{ fontFamily: "var(--font-cormorant)" }}
      >
        Editar Perfil
      </h1>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-3">
          {avatarPreview ? (
            <Image
              src={avatarPreview}
              alt="Avatar"
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover"
              unoptimized
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
              style={{ background: "#3A4A3B", color: "#fff", fontFamily: "var(--font-cormorant)" }}
            >
              {initial}
            </div>
          )}
          {/* Camera button */}
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center shadow"
            style={{ background: "#3A4A3B" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="13" r="4" stroke="#fff" strokeWidth="1.5"/>
            </svg>
          </button>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          className="text-sm font-medium"
          style={{ color: "#3A4A3B" }}
        >
          {avatarPreview ? "Alterar foto" : "Adicionar foto"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="flex flex-col gap-4">
        {[
          { label: "Nome Completo", field: "name" },
          { label: "Instagram", field: "handle" },
        ].map(({ label, field }) => (
          <div key={field}>
            <label className="block text-xs text-[#888] mb-1.5 uppercase tracking-widest">{label}</label>
            <input
              type="text"
              value={form[field as keyof typeof form]}
              onChange={set(field)}
              className="w-full bg-white border border-[#D5CFC9] rounded-2xl px-4 py-3.5 text-sm text-[#2C2C2C] outline-none focus:border-[#3A4A3B]"
            />
          </div>
        ))}
      </div>

      {error && <p className="text-xs text-red-500 text-center mt-4">{error}</p>}

      <button
        onClick={handleSave}
        disabled={isPending || uploading || !form.name.trim()}
        className="w-full text-white py-4 rounded-full text-base font-medium mt-8 disabled:opacity-40"
        style={{ background: "#3A4A3B" }}
      >
        {uploading ? "Enviando foto…" : isPending ? "Salvando…" : "Salvar Alterações"}
      </button>
    </main>
  );
}
