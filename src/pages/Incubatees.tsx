import React from "react";
import { Helmet } from "react-helmet-async";
import { incubatees } from "@/data/incubatees";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const Incubatees: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Incubatees – TIC Nnewi Market</title>
        <meta name="description" content="Explore incubatees at Technology Incubation Centre, Nnewi and their products." />
        <link rel="canonical" href="/incubatees" />
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold">Incubatees</h1>
        <p className="mt-2 text-muted-foreground">Profiles and product catalogs of businesses at the Technology Incubation Centre, Nnewi.</p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {incubatees.map((i) => (
            <Card key={i.slug} className="flex h-full flex-col">
              <CardContent className="flex flex-1 flex-col p-6">
                <h2 className="text-xl font-semibold">{i.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{i.description}</p>
                {i.address && <p className="mt-2 text-xs text-muted-foreground">{i.address}</p>}
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{i.products.length} products</span>
                  <Link to={`/incubatees/${i.slug}`}>
                    <Button variant="outline">View Profile</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Incubatees;
