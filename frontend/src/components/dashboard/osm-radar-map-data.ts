export type GaragePoint = {
  id: string;
  name: string;
  area: string;
  position: [number, number];
  rate: number;
  spaces: number;
  totalCapacity: number;
  rating: number;
  open: boolean;
  is24_7: boolean;
  type: string;
  image: string;
};

export const defaultGarages: GaragePoint[] = [
  {
    id: "GAR-001",
    name: "Banani Prime Parking Complex",
    area: "Road 11, Block D, Banani",
    position: [23.7942, 90.4062],
    rate: 60,
    spaces: 8,
    totalCapacity: 25,
    rating: 4.9,
    open: true,
    is24_7: true,
    type: "Covered",
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "GAR-002",
    name: "Gulshan Corporate Underground Garage",
    area: "Gulshan Avenue, Gulshan 2",
    position: [23.7925, 90.4153],
    rate: 80,
    spaces: 14,
    totalCapacity: 40,
    rating: 4.8,
    open: true,
    is24_7: true,
    type: "Underground",
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "GAR-003",
    name: "Dhanmondi Lake View Parking Hub",
    area: "Satmasjid Road, Dhanmondi 27",
    position: [23.7465, 90.3742],
    rate: 50,
    spaces: 0,
    totalCapacity: 20,
    rating: 4.7,
    open: true,
    is24_7: false,
    type: "Indoor",
    image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "GAR-004",
    name: "Uttara Sector 3 Secure Lot",
    area: "Sector 3, Uttara Model Town",
    position: [23.8759, 90.3795],
    rate: 45,
    spaces: 12,
    totalCapacity: 30,
    rating: 4.9,
    open: true,
    is24_7: true,
    type: "Outdoor",
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "GAR-005",
    name: "Mirpur 14 Central Garage",
    area: "651 Ibrahimpur, Mirpur 14",
    position: [23.8223, 90.3669],
    rate: 40,
    spaces: 3,
    totalCapacity: 22,
    rating: 4.8,
    open: true,
    is24_7: true,
    type: "Indoor",
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "GAR-006",
    name: "Motijheel Financial District Parking",
    area: "Dilkusha Commercial Area, Motijheel",
    position: [23.7384, 90.4187],
    rate: 70,
    spaces: 2,
    totalCapacity: 35,
    rating: 4.6,
    open: true,
    is24_7: false,
    type: "Covered",
    image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=800&auto=format&fit=crop",
  },
];
