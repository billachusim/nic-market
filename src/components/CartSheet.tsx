import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import React from "react";

export const CartSheet: React.FC = () => {
  const { items, total, inc, dec, remove, checkoutEmail, checkoutWhatsApp, clear } = useCart();

  const emailLink = checkoutEmail("thetechfaculty@gmail.com");
  const waLink = checkoutWhatsApp("+2348068597140");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" size="sm" aria-label="Open cart">
          <ShoppingCart />
          <span className="sr-only">Cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex h-[80vh] flex-col">
          <div className="flex-1 space-y-4 overflow-auto pr-2">
            {items.length === 0 ? (
              <p className="text-muted-foreground">Your cart is empty.</p>
            ) : (
              items.map((i) => (
                <div key={i.id} className="flex items-center gap-4 border-b pb-4">
                  <img
                    src={i.image}
                    alt={`${i.name} product image`}
                    loading="lazy"
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{i.name}</p>
                    <p className="text-sm text-muted-foreground">₦{i.price.toLocaleString()}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => dec(i.id)} aria-label="Decrease quantity">
                        <Minus />
                      </Button>
                      <span className="w-6 text-center">{i.quantity}</span>
                      <Button size="sm" variant="outline" onClick={() => inc(i.id)} aria-label="Increase quantity">
                        <Plus />
                      </Button>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => remove(i.id)} aria-label="Remove item">
                    <Trash2 />
                  </Button>
                </div>
              ))
            )}
          </div>
          <div className="border-t pt-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-lg font-semibold">₦{total.toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a href={emailLink} className="w-full" target="_blank" rel="noreferrer">
                <Button variant="hero" className="w-full">Checkout Email</Button>
              </a>
              <a href={waLink} className="w-full" target="_blank" rel="noreferrer">
                <Button variant="default" className="w-full">WhatsApp</Button>
              </a>
            </div>
            {items.length > 0 && (
              <Button variant="ghost" className="mt-2 w-full" onClick={clear}>Clear Cart</Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
