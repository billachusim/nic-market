import React from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { CartSheet } from "@/components/CartSheet";
import { useCart } from "@/contexts/CartContext";

const Header: React.FC = () => {
  const { items } = useCart();
  const count = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-gradient-primary shadow-elegant" aria-hidden />
          <span className="text-base font-semibold">TIC Nnewi Market</span>
        </Link>
        <nav className="flex items-center gap-6">
          <NavLink to="/" className={({ isActive }) => (isActive ? "text-primary" : "text-foreground/80 hover:text-foreground")}>Home</NavLink>
          <NavLink to="/incubatees" className={({ isActive }) => (isActive ? "text-primary" : "text-foreground/80 hover:text-foreground")}>Incubatees</NavLink>
          <NavLink to="/admin" className={({ isActive }) => (isActive ? "text-primary" : "text-foreground/80 hover:text-foreground")}>Admin</NavLink>
          <div className="relative">
            <CartSheet />
            {count > 0 && (
              <span aria-label={`${count} items in cart`} className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                {count}
              </span>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
