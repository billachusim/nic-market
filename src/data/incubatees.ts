export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  incubateeSlug: string;
};

export type Incubatee = {
  slug: string;
  name: string;
  description: string;
  email?: string;
  whatsapp?: string;
  phone?: string;
  address?: string;
  products: Product[];
};

// Images
import powerBank from "@/assets/products/power-bank.jpg";
import rechargeableFan from "@/assets/products/rechargeable-fan.jpg";
import smartHomeHub from "@/assets/products/smart-home-hub.jpg";
import spareParts from "@/assets/products/spare-parts.jpg";
import solderingStation from "@/assets/products/soldering-station.jpg";
import wirelessEarbuds from "@/assets/products/wireless-earbuds.jpg";

export const incubatees: Incubatee[] = [
  {
    slug: "tech-faculty",
    name: "Tech Faculty",
    description:
      "Innovative consumer electronics: power solutions, cooling, and smart home devices.",
    email: "thetechfaculty@gmail.com",
    whatsapp: "+2348068597140",
    address: "Technology Incubation Centre, Nnewi",
    products: [
      {
        id: "tf-pb-01",
        name: "10,000mAh Power Bank",
        price: 12000,
        image: powerBank,
        category: "Power Solutions",
        incubateeSlug: "tech-faculty",
      },
      {
        id: "tf-fan-01",
        name: "Rechargeable Desk Fan",
        price: 18500,
        image: rechargeableFan,
        category: "Cooling",
        incubateeSlug: "tech-faculty",
      },
      {
        id: "tf-smarthub-01",
        name: "Smart Home Hub",
        price: 35000,
        image: smartHomeHub,
        category: "Smart Home",
        incubateeSlug: "tech-faculty",
      },
    ],
  },
  {
    slug: "nnewi-auto-parts",
    name: "Nnewi Auto Parts",
    description:
      "Quality automotive spare parts sourced from trusted manufacturers.",
    phone: "+2348000000000",
    address: "TIC Nnewi Block B",
    products: [
      {
        id: "nap-brk-01",
        name: "Brake Pads & Spark Plugs Set",
        price: 22000,
        image: spareParts,
        category: "Spare Parts",
        incubateeSlug: "nnewi-auto-parts",
      },
    ],
  },
  {
    slug: "maker-lab-electronics",
    name: "Maker Lab Electronics",
    description: "Tools and components for prototyping and repair.",
    phone: "+2348111111111",
    address: "TIC Nnewi Block C",
    products: [
      {
        id: "mle-solder-01",
        name: "Digital Soldering Station",
        price: 48000,
        image: solderingStation,
        category: "Tools",
        incubateeSlug: "maker-lab-electronics",
      },
      {
        id: "mle-buds-01",
        name: "Wireless Earbuds",
        price: 16000,
        image: wirelessEarbuds,
        category: "Gadgets",
        incubateeSlug: "maker-lab-electronics",
      },
    ],
  },
];

export const featuredProducts: Product[] = incubatees.flatMap((i) => i.products);
