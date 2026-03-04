import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Lock, Plus, Pencil, Trash2, Save, X, ArrowLeft, Upload, ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";

type UnlistedShare = {
  id: string;
  name: string;
  short_code: string;
  tag: string;
  tag_color: string;
  price: string;
  min_qty: string;
  gradient_color: string;
  display_order: number;
  is_active: boolean;
  image_url: string | null;
};

const TAG_PRESETS = [
  { label: "Most Bought", value: "Most Bought", color: "bg-secondary/10 text-secondary" },
  { label: "Top Gainer", value: "Top Gainer", color: "bg-brand-gold/10 text-brand-gold" },
  { label: "Hot Right Now", value: "Hot Right Now", color: "bg-destructive/10 text-destructive" },
  { label: "Popular", value: "Popular", color: "bg-secondary/10 text-secondary" },
  { label: "Exchange", value: "Exchange", color: "bg-primary/10 text-primary" },
  { label: "Financial", value: "Financial", color: "bg-primary/10 text-primary" },
  { label: "HealthTech", value: "HealthTech", color: "bg-secondary/10 text-secondary" },
];

const GRADIENT_PRESETS = [
  { label: "Blue", value: "from-blue-600 to-blue-800" },
  { label: "Indigo", value: "from-indigo-600 to-indigo-800" },
  { label: "Green", value: "from-emerald-600 to-green-700" },
  { label: "Yellow", value: "from-yellow-500 to-amber-600" },
  { label: "Red", value: "from-red-500 to-rose-600" },
  { label: "Purple", value: "from-purple-600 to-violet-700" },
  { label: "Teal", value: "from-teal-500 to-cyan-600" },
  { label: "Cyan", value: "from-blue-500 to-cyan-600" },
];

const emptyShare: Omit<UnlistedShare, "id"> = {
  name: "",
  short_code: "",
  tag: "Popular",
  tag_color: "bg-secondary/10 text-secondary",
  price: "",
  min_qty: "1 Share",
  gradient_color: "from-blue-600 to-blue-800",
  display_order: 0,
  is_active: true,
  image_url: null,
};

const AdminPage = () => {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [shares, setShares] = useState<UnlistedShare[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<UnlistedShare>>({});
  const [creating, setCreating] = useState(false);
  const [newForm, setNewForm] = useState(emptyShare);
  const [uploading, setUploading] = useState(false);

  const fetchShares = async () => {
    setLoading(true);
    const { data } = await supabase.functions.invoke("manage-unlisted-shares", {
      body: { action: "list" },
    });
    if (data?.success) setShares(data.data);
    setLoading(false);
  };

  const handleLogin = async () => {
    const { data } = await supabase.functions.invoke("manage-unlisted-shares", {
      body: { action: "update", password, data: { id: "test" } },
    });
    if (data?.error === "Invalid password") {
      toast({ title: "Invalid password", variant: "destructive" });
    } else {
      setAuthenticated(true);
      fetchShares();
    }
  };

  const handleImageUpload = async (file: File, shareId?: string, setForm?: (f: any) => void, currentForm?: any) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("password", password);
      formData.append("file", file);
      if (shareId) formData.append("share_id", shareId);

      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/manage-unlisted-shares`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${anonKey}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      if (result.success && result.url) {
        toast({ title: "Logo uploaded successfully" });
        if (setForm && currentForm) {
          setForm({ ...currentForm, image_url: result.url });
        }
        if (shareId) fetchShares();
      } else {
        toast({ title: "Upload failed", description: result.error, variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Upload error", description: err.message, variant: "destructive" });
    }
    setUploading(false);
  };

  const handleUpdate = async (share: UnlistedShare) => {
    const { data } = await supabase.functions.invoke("manage-unlisted-shares", {
      body: { action: "update", password, data: { ...share, ...editForm } },
    });
    if (data?.success) {
      toast({ title: "Share updated successfully" });
      setEditingId(null);
      fetchShares();
    } else {
      toast({ title: "Error updating share", description: data?.error, variant: "destructive" });
    }
  };

  const handleCreate = async () => {
    const { data } = await supabase.functions.invoke("manage-unlisted-shares", {
      body: { action: "create", password, data: { ...newForm, display_order: shares.length + 1 } },
    });
    if (data?.success) {
      toast({ title: "Share created successfully" });
      setCreating(false);
      setNewForm(emptyShare);
      fetchShares();
    } else {
      toast({ title: "Error creating share", description: data?.error, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this share?")) return;
    const { data } = await supabase.functions.invoke("manage-unlisted-shares", {
      body: { action: "delete", password, data: { id } },
    });
    if (data?.success) {
      toast({ title: "Share deleted" });
      fetchShares();
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-secondary" />
            </div>
            <CardTitle className="font-heading text-2xl">Admin Panel</CardTitle>
            <p className="text-muted-foreground text-sm">Enter admin password to manage unlisted shares</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
              <Input
                type="password"
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button className="w-full" type="submit">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const LogoUpload = ({ form, setForm, shareId }: { form: any; setForm: (f: any) => void; shareId?: string }) => {
    const fileRef = useRef<HTMLInputElement>(null);
    return (
      <div>
        <Label>Logo / Image</Label>
        <div className="flex items-center gap-3 mt-1">
          {form.image_url ? (
            <img src={form.image_url} alt="Logo" className="w-14 h-14 rounded-xl object-contain border border-border bg-white" />
          ) : (
            <div className="w-14 h-14 rounded-xl border border-dashed border-border flex items-center justify-center bg-muted/30">
              <ImageIcon className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file, shareId, setForm, form);
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-1" />
              {uploading ? "Uploading..." : "Upload Logo"}
            </Button>
            {form.image_url && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive text-xs h-7"
                onClick={() => setForm({ ...form, image_url: null })}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ShareForm = ({ form, setForm, onSave, onCancel, title, shareId }: {
    form: any;
    setForm: (f: any) => void;
    onSave: () => void;
    onCancel: () => void;
    title: string;
    shareId?: string;
  }) => (
    <Card className="border-secondary/30 mb-4">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>Company Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label>Short Code</Label><Input value={form.short_code} onChange={(e) => setForm({ ...form, short_code: e.target.value })} placeholder="e.g. NSE" /></div>
          <div><Label>Price</Label><Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g. ₹2,060" /></div>
          <div><Label>Min Quantity</Label><Input value={form.min_qty} onChange={(e) => setForm({ ...form, min_qty: e.target.value })} placeholder="e.g. 1 Share" /></div>
          <LogoUpload form={form} setForm={setForm} shareId={shareId} />
          <div>
            <Label>Tag</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {TAG_PRESETS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setForm({ ...form, tag: t.value, tag_color: t.color })}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${form.tag === t.value ? "ring-2 ring-secondary" : ""} ${t.color}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Color (fallback if no logo)</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {GRADIENT_PRESETS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setForm({ ...form, gradient_color: g.value })}
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${g.value} border-2 transition-all ${form.gradient_color === g.value ? "ring-2 ring-secondary scale-110" : "border-transparent"}`}
                  title={g.label}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label>Active</Label>
          <Switch checked={form.is_active} onCheckedChange={(c) => setForm({ ...form, is_active: c })} />
        </div>
        <div className="flex gap-2">
          <Button onClick={onSave}><Save className="w-4 h-4 mr-1" /> Save</Button>
          <Button variant="outline" onClick={onCancel}><X className="w-4 h-4 mr-1" /> Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2">
              <ArrowLeft className="w-4 h-4" /> Back to site
            </Link>
            <h1 className="font-heading text-3xl font-bold text-foreground">Manage Unlisted Shares</h1>
            <p className="text-muted-foreground">Update prices, add or remove shares</p>
          </div>
          <Button onClick={() => setCreating(true)} disabled={creating}>
            <Plus className="w-4 h-4 mr-1" /> Add Share
          </Button>
        </div>

        {creating && (
          <ShareForm
            form={newForm}
            setForm={setNewForm}
            onSave={handleCreate}
            onCancel={() => { setCreating(false); setNewForm(emptyShare); }}
            title="Add New Share"
          />
        )}

        {loading ? (
          <p className="text-muted-foreground text-center py-12">Loading...</p>
        ) : (
          <div className="space-y-3">
            {shares.map((share) => (
              editingId === share.id ? (
                <ShareForm
                  key={share.id}
                  form={{ ...share, ...editForm }}
                  setForm={(f: any) => setEditForm(f)}
                  onSave={() => handleUpdate(share)}
                  onCancel={() => setEditingId(null)}
                  title={`Edit: ${share.name}`}
                  shareId={share.id}
                />
              ) : (
                <Card key={share.id} className={`${!share.is_active ? "opacity-50" : ""}`}>
                  <CardContent className="p-4 flex items-center gap-4">
                    {share.image_url ? (
                      <img src={share.image_url} alt={share.short_code} className="w-12 h-12 rounded-xl object-contain border border-border bg-white shrink-0" />
                    ) : (
                      <div className={`w-12 h-12 bg-gradient-to-br ${share.gradient_color} rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                        {share.short_code}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm truncate">{share.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-foreground">{share.price}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${share.tag_color}`}>{share.tag}</span>
                        {!share.is_active && <span className="text-[10px] text-muted-foreground">(Hidden)</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" variant="outline" onClick={() => { setEditingId(share.id); setEditForm(share); }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleDelete(share.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
