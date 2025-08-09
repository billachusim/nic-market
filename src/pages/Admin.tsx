import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { supabase, ADMIN_EMAIL } from "@/lib/supabase";
import { incubatees as seedIncubatees } from "@/data/incubatees";

// Simple shapes for admin forms
type IncubateeRow = {
  slug: string;
  name: string;
  description: string;
  email?: string | null;
  whatsapp?: string | null;
  phone?: string | null;
  address?: string | null;
  logo_url?: string | null;
};

type ProductRow = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  incubatee_slug: string;
};

const Admin: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const isAdmin = useMemo(() => userEmail?.toLowerCase() === ADMIN_EMAIL.toLowerCase(), [userEmail]);

  // Lists
  const [incubatees, setIncubatees] = useState<IncubateeRow[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);

  // Forms
  const [iForm, setIForm] = useState<IncubateeRow>({ slug: "", name: "", description: "", email: "", whatsapp: "", phone: "", address: "", logo_url: "" });
  const [pForm, setPForm] = useState<ProductRow>({ id: "", name: "", price: 0, image: "", category: "", incubatee_slug: "" });

  useEffect(() => {
    // Auth session
    const init = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUserEmail(data.user?.email ?? null);
      } catch (e) {
        console.warn("Auth not initialized", e);
      }
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const ensureReady = () => {
    if (!supabase) return false;
    return true;
  };

  const fetchAll = async () => {
    if (!ensureReady()) return;
    const { data: inc, error: incErr } = await supabase.from("incubatees").select("*").order("name");
    if (incErr) console.error(incErr);
    setIncubatees((inc ?? []) as IncubateeRow[]);

    const { data: prod, error: prodErr } = await supabase.from("products").select("*").order("name");
    if (prodErr) console.error(prodErr);
    setProducts((prod ?? []) as ProductRow[]);
  };

  useEffect(() => {
    if (isAdmin) fetchAll();
  }, [isAdmin]);

  const signInMagicLink = async () => {
    if (!ensureReady()) return;
    const { error } = await supabase.auth.signInWithOtp({
      email: ADMIN_EMAIL,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    if (error) {
      toast({ title: "Sign in failed", description: error.message });
    } else {
      toast({ title: "Check your email", description: `Magic link sent to ${ADMIN_EMAIL}` });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const createIncubatee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!iForm.slug || !iForm.name) return toast({ title: "Missing fields", description: "Slug and name are required" });
    const payload: IncubateeRow = {
      slug: iForm.slug.trim(),
      name: iForm.name.trim(),
      description: iForm.description?.trim() ?? "",
      email: iForm.email || null,
      whatsapp: iForm.whatsapp || null,
      phone: iForm.phone || null,
      address: iForm.address || null,
      logo_url: iForm.logo_url || null,
    };
    const { error } = await supabase.from("incubatees").upsert(payload, { onConflict: "slug" });
    if (error) return toast({ title: "Save failed", description: error.message });
    toast({ title: "Saved", description: `${payload.name} saved` });
    setIForm({ slug: "", name: "", description: "", email: "", whatsapp: "", phone: "", address: "", logo_url: "" });
    fetchAll();
  };

  const deleteIncubatee = async (slug: string) => {
    const { error } = await supabase.from("incubatees").delete().eq("slug", slug);
    if (error) return toast({ title: "Delete failed", description: error.message });
    toast({ title: "Deleted", description: slug });
    fetchAll();
  };

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pForm.id || !pForm.name || !pForm.incubatee_slug) return toast({ title: "Missing fields", description: "ID, name, incubatee are required" });
    const payload: ProductRow = { ...pForm, price: Number(pForm.price) };
    const { error } = await supabase.from("products").upsert(payload, { onConflict: "id" });
    if (error) return toast({ title: "Save failed", description: error.message });
    toast({ title: "Saved", description: `${payload.name} saved` });
    setPForm({ id: "", name: "", price: 0, image: "", category: "", incubatee_slug: "" });
    fetchAll();
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast({ title: "Delete failed", description: error.message });
    toast({ title: "Deleted", description: id });
    fetchAll();
  };

  const seedData = async () => {
    // Seed incubatees
    const incRows: IncubateeRow[] = seedIncubatees.map((i) => ({
      slug: i.slug,
      name: i.name,
      description: i.description,
      email: i.email ?? null,
      whatsapp: i.whatsapp ?? null,
      phone: i.phone ?? null,
      address: i.address ?? null,
      logo_url: null,
    }));
    const prodRows: ProductRow[] = seedIncubatees.flatMap((i) => i.products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      category: p.category,
      incubatee_slug: i.slug,
    })));

    const { error: incErr } = await supabase.from("incubatees").upsert(incRows, { onConflict: "slug" });
    if (incErr) return toast({ title: "Seed failed (incubatees)", description: incErr.message });
    const { error: prodErr } = await supabase.from("products").upsert(prodRows, { onConflict: "id" });
    if (prodErr) return toast({ title: "Seed failed (products)", description: prodErr.message });

    toast({ title: "Seeded", description: `Inserted ${incRows.length} incubatees and ${prodRows.length} products` });
    fetchAll();
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Admin – TIC Nnewi Market</title>
        <meta name="description" content="Admin dashboard to manage incubatees and products at TIC Nnewi Market." />
        <link rel="canonical" href="/admin" />
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Admin</h1>
        {!isAdmin ? (
          <Card className="mt-6 max-w-xl">
            <CardContent className="space-y-4 p-6">
              <p className="text-muted-foreground">Sign in with the authorized admin email to continue.</p>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input id="admin-email" value={ADMIN_EMAIL} readOnly />
              </div>
              <Button onClick={signInMagicLink}>Send magic link</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={seedData}>Seed dummy data</Button>
              <Button variant="outline" onClick={fetchAll}>Refresh</Button>
              <Button variant="destructive" onClick={signOut}>Sign out</Button>
            </div>

            <Tabs defaultValue="incubatees" className="w-full">
              <TabsList>
                <TabsTrigger value="incubatees">Incubatees</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
              </TabsList>

              <TabsContent value="incubatees" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <form onSubmit={createIncubatee} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" value={iForm.slug} onChange={(e) => setIForm({ ...iForm, slug: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={iForm.name} onChange={(e) => setIForm({ ...iForm, name: e.target.value })} required />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={iForm.description} onChange={(e) => setIForm({ ...iForm, description: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={iForm.email ?? ""} onChange={(e) => setIForm({ ...iForm, email: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp">WhatsApp</Label>
                        <Input id="whatsapp" value={iForm.whatsapp ?? ""} onChange={(e) => setIForm({ ...iForm, whatsapp: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" value={iForm.phone ?? ""} onChange={(e) => setIForm({ ...iForm, phone: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" value={iForm.address ?? ""} onChange={(e) => setIForm({ ...iForm, address: e.target.value })} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="logo">Logo URL (optional)</Label>
                        <Input id="logo" value={iForm.logo_url ?? ""} onChange={(e) => setIForm({ ...iForm, logo_url: e.target.value })} />
                      </div>
                      <div className="md:col-span-2">
                        <Button type="submit">Save Incubatee</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Slug</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {incubatees.map((i) => (
                          <TableRow key={i.slug}>
                            <TableCell>{i.slug}</TableCell>
                            <TableCell>{i.name}</TableCell>
                            <TableCell className="text-muted-foreground">{i.email}</TableCell>
                            <TableCell className="text-muted-foreground">{i.phone}</TableCell>
                            <TableCell>
                              <Button variant="destructive" size="sm" onClick={() => deleteIncubatee(i.slug)}>Delete</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="products" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <form onSubmit={createProduct} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="pid">Product ID</Label>
                        <Input id="pid" value={pForm.id} onChange={(e) => setPForm({ ...pForm, id: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pname">Name</Label>
                        <Input id="pname" value={pForm.name} onChange={(e) => setPForm({ ...pForm, name: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (₦)</Label>
                        <Input id="price" type="number" inputMode="numeric" value={pForm.price} onChange={(e) => setPForm({ ...pForm, price: Number(e.target.value) })} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input id="category" value={pForm.category} onChange={(e) => setPForm({ ...pForm, category: e.target.value })} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="image">Image URL</Label>
                        <Input id="image" value={pForm.image} onChange={(e) => setPForm({ ...pForm, image: e.target.value })} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="inc">Incubatee Slug</Label>
                        <Input id="inc" value={pForm.incubatee_slug} onChange={(e) => setPForm({ ...pForm, incubatee_slug: e.target.value })} required />
                      </div>
                      <div className="md:col-span-2">
                        <Button type="submit">Save Product</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Incubatee</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell className="font-mono text-xs">{p.id}</TableCell>
                            <TableCell>{p.name}</TableCell>
                            <TableCell>₦{Number(p.price).toLocaleString()}</TableCell>
                            <TableCell className="text-muted-foreground">{p.incubatee_slug}</TableCell>
                            <TableCell>
                              <Button variant="destructive" size="sm" onClick={() => deleteProduct(p.id)}>Delete</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
