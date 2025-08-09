import React from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { featuredProducts, incubatees } from "@/data/incubatees";
import { ProductCard } from "@/components/ProductCard";

const Index = () => {
  const incubateeNameBySlug = React.useMemo(() =>
    new Map(incubatees.map((i) => [i.slug, i.name])), []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>TIC Nnewi Market – Featured Products</title>
        <meta name="description" content="Browse featured products from incubatees at Technology Incubation Centre, Nnewi." />
        <link rel="canonical" href="/" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Technology Incubation Centre, Nnewi",
          url: "/",
        })}</script>
      </Helmet>
      <Header />
      <Hero />
      <main id="featured" className="container mx-auto px-4 py-10">
        <section aria-label="Featured products by incubatees">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} incubateeName={incubateeNameBySlug.get(p.incubateeSlug) || ""} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
