import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { Product } from "@/data/incubatees";

export type CartItem = Product & { quantity: number };

type CartState = {
  items: CartItem[];
};

type Action =
  | { type: "ADD"; product: Product }
  | { type: "REMOVE"; id: string }
  | { type: "INC"; id: string }
  | { type: "DEC"; id: string }
  | { type: "CLEAR" };

const CartContext = createContext<{
  items: CartItem[];
  total: number;
  add: (p: Product) => void;
  remove: (id: string) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  clear: () => void;
  checkoutEmail: (email: string) => string;
  checkoutWhatsApp: (phone: string) => string;
}>({
  items: [],
  total: 0,
  add: () => {},
  remove: () => {},
  inc: () => {},
  dec: () => {},
  clear: () => {},
  checkoutEmail: () => "",
  checkoutWhatsApp: () => "",
});

const initialState: CartState = { items: [] };

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.id === action.product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...action.product, quantity: 1 }] };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.id !== action.id) };
    case "INC":
      return {
        items: state.items.map((i) => (i.id === action.id ? { ...i, quantity: i.quantity + 1 } : i)),
      };
    case "DEC":
      return {
        items: state.items
          .map((i) => (i.id === action.id ? { ...i, quantity: i.quantity - 1 } : i))
          .filter((i) => i.quantity > 0),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

function usePersistedReducer() {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const raw = localStorage.getItem("tic_nnewi_cart");
      if (raw) return JSON.parse(raw) as CartState;
    } catch {}
    return init;
  });
  useEffect(() => {
    try {
      localStorage.setItem("tic_nnewi_cart", JSON.stringify(state));
    } catch {}
  }, [state]);
  return [state, dispatch] as const;
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = usePersistedReducer();

  const total = useMemo(() => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0), [state.items]);

  const buildSummary = () => {
    const lines = [
      "TIC Nnewi Market – Order",
      "",
      ...state.items.map(
        (i) => `• ${i.name} x${i.quantity} — ₦${(i.price * i.quantity).toLocaleString()} (${i.category})`
      ),
      "",
      `Total: ₦${total.toLocaleString()}`,
    ];
    return lines.join("\n");
  };

  const checkoutEmail = (email: string) => {
    const subject = encodeURIComponent("New Order – TIC Nnewi Market");
    const body = encodeURIComponent(buildSummary());
    return `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const checkoutWhatsApp = (phone: string) => {
    const text = encodeURIComponent(buildSummary());
    const normalized = phone.replace(/[^\d]/g, "");
    return `https://wa.me/${normalized}?text=${text}`;
  };

  const value = {
    items: state.items,
    total,
    add: (p: Product) => dispatch({ type: "ADD", product: p }),
    remove: (id: string) => dispatch({ type: "REMOVE", id }),
    inc: (id: string) => dispatch({ type: "INC", id }),
    dec: (id: string) => dispatch({ type: "DEC", id }),
    clear: () => dispatch({ type: "CLEAR" }),
    checkoutEmail,
    checkoutWhatsApp,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart() {
  return useContext(CartContext);
}
