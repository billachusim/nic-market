import React from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { incubatees } from "@/data/incubatees";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const IncubateePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const incubatee = incubatees.find((i) => i.slug === slug);

  if (!incubatee) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold">Incubatee not found</h1>
          <Link to="/incubatees" className="mt-4 inline-block">
            <Button variant="outline">Back to Incubatees</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <Helmet>
          <title>{`${incubatee.name} – TIC Nnewi Market`}</title>
          <meta name="description" content={`${incubatee.name} profile and product catalog at TIC Nnewi Market.`} />
          <link rel="canonical" href={`/incubatees/${incubatee.slug}`} />
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: incubatee.name,
            address: incubatee.address,
            url: `/incubatees/${incubatee.slug}`,
          })}</script>
        </Helmet>

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">{incubatee.name}</h1>
          <p className="text-muted-foreground">{incubatee.description}</p>
          {incubatee.address && (
            <p className="text-sm text-muted-foreground">{incubatee.address}</p>
          )}
          <div className="mt-4 flex gap-3">
            {incubatee.email && (
              <a href={`mailto:${incubatee.email}`}>
                <Button variant="outline">Email</Button>
              </a>
            )}
            {incubatee.whatsapp && (
              <a href={`https://wa.me/${incubatee.whatsapp.replace(/[^\\d]/g, "")}`} target="_blank" rel="noreferrer">
                <Button variant="default">WhatsApp</Button>
              </a>
            )}
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-semibold">Products</h2>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {incubatee.products.map((p) => (
            <ProductCard key={p.id} product={p} incubateeName={incubatee.name} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default IncubateePage;
