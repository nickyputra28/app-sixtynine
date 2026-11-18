export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductSize {
  us: string;
  eurCm: string;
  fullLabel: string;
}

export interface ProductData {
  id: string;
  berandaName: string;
  katalogLines: [string, string?];
  fullName: string;
  subtitle: string;
  categoryTag: string;
  katalogBrandTag: string;
  archiveTag: string;
  categoryType: "sepatu" | "backpack";
  priceNumber: number;
  priceFormatted: string;
  originalPriceFormatted: string;
  discountBadge: string;
  rating: string;
  soldCount: number;
  reviewsCount: number;
  berandaBadge: string;
  berandaBadgeVariant: "red" | "white";
  katalogBadge: string;
  katalogBadgeStyle: "red" | "white" | "dark";
  katalogMeta: string;
  image: string;
  thumbnails: {
    label: string;
    image: string;
  }[];
  description: string;
  specs: ProductSpec[];
  sizes: ProductSize[];
  defaultSizeIndex: number;
  orderNumber: string;
  resiNumber: string;
  invoiceNumber: string;
}

export const SHOE_SIZES: ProductSize[] = [
  { us: "US 4.5", eurCm: "EUR 36 • 22.5cm", fullLabel: "US 4.5 // EUR 36 (22.5 cm)" },
  { us: "US 5", eurCm: "EUR 36.5 • 23cm", fullLabel: "US 5 // EUR 36.5 (23 cm)" },
  { us: "US 5.5", eurCm: "EUR 37 • 23.5cm", fullLabel: "US 5.5 // EUR 37 (23.5 cm)" },
  { us: "US 6", eurCm: "EUR 38 • 24cm", fullLabel: "US 6 // EUR 38 (24 cm)" },
  { us: "US 6.5", eurCm: "EUR 38.5 • 24.5cm", fullLabel: "US 6.5 // EUR 38.5 (24.5 cm)" },
  { us: "US 7", eurCm: "EUR 39 • 25cm", fullLabel: "US 7 // EUR 39 (25 cm)" },
  { us: "US 7.5", eurCm: "EUR 40 • 25.5cm", fullLabel: "US 7.5 // EUR 40 (25.5 cm)" },
  { us: "US 8", eurCm: "EUR 40.5 • 26cm", fullLabel: "US 8 // EUR 40.5 (26 cm)" },
  { us: "US 8.5", eurCm: "EUR 41 • 26.5cm", fullLabel: "US 8.5 // EUR 41 (26.5 cm)" },
  { us: "US 9", eurCm: "EUR 42 • 27cm", fullLabel: "US 9 // EUR 42 (27 cm)" },
  { us: "US 9.5", eurCm: "EUR 42.5 • 27.5cm", fullLabel: "US 9.5 // EUR 42.5 (27.5 cm)" },
  { us: "US 10", eurCm: "EUR 43 • 28cm", fullLabel: "US 10 // EUR 43 (28 cm)" },
  { us: "US 10.5", eurCm: "EUR 44 • 28.5cm", fullLabel: "US 10.5 // EUR 44 (28.5 cm)" },
  { us: "US 11", eurCm: "EUR 44.5 • 29cm", fullLabel: "US 11 // EUR 44.5 (29 cm)" },
];

export const BACKPACK_SIZES: ProductSize[] = [
  { us: "ALL SIZE", eurCm: "22 Liter • 42.5 x 32.5cm", fullLabel: "ALL SIZE // 22 LITER (ORIGINAL)" },
];

export const ALL_PRODUCTS: ProductData[] = [
  {
    id: "vans-sk8-low-contrast",
    berandaName: "Vans Sk8-Low…",
    katalogLines: ["Vans Sk8-Low", "Contrast Black"],
    fullName: "VANS SK8-LOW CONTRAST BLACK",
    subtitle: "Contrast Black / White Stitch Original",
    categoryTag: "SKATE LOW",
    katalogBrandTag: "VANS SKATE",
    archiveTag: "SKATE ARCHIVE // VANS CONTRAST",
    categoryType: "sepatu",
    priceNumber: 650000,
    priceFormatted: "Rp 650.000",
    originalPriceFormatted: "Rp 999.000",
    discountBadge: "-35%",
    rating: "4.9",
    soldCount: 48,
    reviewsCount: 94,
    berandaBadge: "100% ORIGINAL",
    berandaBadgeVariant: "red",
    katalogBadge: "NEW DROP",
    katalogBadgeStyle: "white",
    katalogMeta: "Size 40 - 44 | BNIB",
    image: "/images/prod-sk8low-contrast-176857.png",
    thumbnails: [
      { label: "SAMPING", image: "/images/prod-sk8low-contrast-176857.png" },
      { label: "DETAIL", image: "/images/sk8low-contrast-detail.png" },
      { label: "OUTSOLE", image: "/images/sk8low-contrast-outsole.jpg" },
      { label: "BOX ASLI", image: "/images/sk8low-contrast-box.jpg" },
    ],
    description:
      "Edisi spesial Vans Sk8-Low dengan jahitan kontras putih di atas suede dan kanvas hitam pekat. Memberikan tampilan tegas khas skena skate jalanan dengan daya tahan ekstra pada area ollie dan konstruksi sol vulkanisir.",
    specs: [
      { label: "UPPER MATERIAL", value: "Heavy Suede & Canvas" },
      { label: "OUTSOLE", value: "Signature Waffle Sole" },
      { label: "KONSTRUKSI", value: "Contrast Stitch Pro" },
      { label: "SKU / SERI", value: "VN0A4UUK187" },
    ],
    sizes: SHOE_SIZES,
    defaultSizeIndex: 8,
    orderNumber: "#SXN-SL-8812",
    resiNumber: "JT882910481102",
    invoiceNumber: "#69-202410-01",
  },
  {
    id: "vans-sk8-low-classic",
    berandaName: "Vans Sk8-Low Classic",
    katalogLines: ["Vans Sk8-Low Classic", "Black White"],
    fullName: "VANS SK8-LOW CLASSIC BLACK WHITE",
    subtitle: "Black / True White Original",
    categoryTag: "SKATE LOW",
    katalogBrandTag: "VANS SKATE",
    archiveTag: "SKATE ARCHIVE // VANS CORE",
    categoryType: "sepatu",
    priceNumber: 650000,
    priceFormatted: "Rp 650.000",
    originalPriceFormatted: "Rp 999.000",
    discountBadge: "-35%",
    rating: "5.0",
    soldCount: 89,
    reviewsCount: 128,
    berandaBadge: "HOT DROP",
    berandaBadgeVariant: "white",
    katalogBadge: "BEST SELLER",
    katalogBadgeStyle: "red",
    katalogMeta: "Size 39 - 44 | BNIB",
    image: "/images/prod-sk8low-classic-176857.png",
    thumbnails: [
      { label: "SAMPING", image: "/images/prod-sk8low-classic-176857.png" },
      { label: "DETAIL", image: "/images/sk8low-classic-detail.jpg" },
      { label: "OUTSOLE", image: "/images/sk8low-classic-outsole.jpg" },
      { label: "BOX ASLI", image: "/images/sk8low-classic-box.jpg" },
    ],
    description:
      "Siluet legendaris Sk8-Hi dalam versi low-top yang fleksibel. Dibuat dengan kanvas premium dan suede kokoh, sol waffle karet vulkanisir khas Vans untuk cengkeraman papan skate maksimal. Dilengkapi kerah berlapis empuk untuk kenyamanan sepanjang hari di jalanan maupun arena skate.",
    specs: [
      { label: "UPPER MATERIAL", value: "Canvas & Suede Kokoh" },
      { label: "OUTSOLE", value: "Signature Waffle Sole" },
      { label: "KONSTRUKSI", value: "Vulcanized Boardfeel" },
      { label: "SKU / SERI", value: "VN0A4UUKBKA" },
    ],
    sizes: SHOE_SIZES,
    defaultSizeIndex: 8,
    orderNumber: "#SXN-SC-8824",
    resiNumber: "JT882910482409",
    invoiceNumber: "#69-202410-02",
  },
  {
    id: "vans-old-skool-classic",
    berandaName: "Vans Old Skool Classic",
    katalogLines: ["Vans Old Skool Classic"],
    fullName: "VANS OLD SKOOL CLASSIC BLACK WHITE",
    subtitle: "Black White // Canvas & Suede",
    categoryTag: "HERITAGE OLD SKOOL",
    katalogBrandTag: "VANS CLASSIC",
    archiveTag: "HERITAGE ARCHIVE // OLD SKOOL",
    categoryType: "sepatu",
    priceNumber: 600000,
    priceFormatted: "Rp 600.000",
    originalPriceFormatted: "Rp 899.000",
    discountBadge: "-33%",
    rating: "4.9",
    soldCount: 142,
    reviewsCount: 215,
    berandaBadge: "100% ORIGINAL",
    berandaBadgeVariant: "red",
    katalogBadge: "ICONIC",
    katalogBadgeStyle: "dark",
    katalogMeta: "Size 38 - 43 | BNIB",
    image: "/images/prod-oldskool-classic-176857.png",
    thumbnails: [
      { label: "SAMPING", image: "/images/prod-oldskool-classic-176857.png" },
      { label: "DETAIL", image: "/images/oldskool-classic-detail.jpg" },
      { label: "OUTSOLE", image: "/images/oldskool-classic-outsole.jpg" },
      { label: "BOX ASLI", image: "/images/oldskool-classic-box.jpg" },
    ],
    description:
      "Sepatu skate klasik pertama yang menampilkan Sidestripe ikonik Vans. Menggabungkan upper suede dan kanvas tahan lama dengan toe cap yang diperkuat untuk menahan gesekan griptape berulang.",
    specs: [
      { label: "UPPER MATERIAL", value: "Suede & 10oz Canvas" },
      { label: "OUTSOLE", value: "Gum Rubber Waffle" },
      { label: "KONSTRUKSI", value: "Reinforced Toe Cap" },
      { label: "SKU / SERI", value: "VN000D3HY28" },
    ],
    sizes: SHOE_SIZES,
    defaultSizeIndex: 8,
    orderNumber: "#SXN-OS-8831",
    resiNumber: "JT882910482910",
    invoiceNumber: "#69-202410-03",
  },
  {
    id: "vans-authentic-red",
    berandaName: "Vans Authentic Red",
    katalogLines: ["Vans Authentic Red"],
    fullName: "VANS AUTHENTIC RACING RED WHITE",
    subtitle: "Racing Red / True White Canvas",
    categoryTag: "CLASSIC AUTHENTIC",
    katalogBrandTag: "VANS HERITAGE",
    archiveTag: "ANAHEIM HERITAGE // AUTHENTIC 66",
    categoryType: "sepatu",
    priceNumber: 550000,
    priceFormatted: "Rp 550.000",
    originalPriceFormatted: "Rp 799.000",
    discountBadge: "-31%",
    rating: "4.8",
    soldCount: 36,
    reviewsCount: 64,
    berandaBadge: "100% ORIGINAL",
    berandaBadgeVariant: "red",
    katalogBadge: "SPECIAL",
    katalogBadgeStyle: "red",
    katalogMeta: "Size 40 - 42 | BNIB",
    image: "/images/prod-authentic-red-176857.png",
    thumbnails: [
      { label: "SAMPING", image: "/images/prod-authentic-red-176857.png" },
      { label: "DETAIL", image: "/images/authentic-red-detail.jpg" },
      { label: "OUTSOLE", image: "/images/authentic-red-outsole.jpg" },
      { label: "BOX ASLI", image: "/images/authentic-red-box.png" },
    ],
    description:
      "Lahir di Anaheim pada tahun 1966, Vans Authentic adalah siluet orisinal yang memulai segalanya. Warna Racing Red ikonik dengan kanvas kokoh, eyelet logam, dan sol waffle khas.",
    specs: [
      { label: "UPPER MATERIAL", value: "Sturdy Woven Canvas" },
      { label: "OUTSOLE", value: "Original Waffle Sole" },
      { label: "KONSTRUKSI", value: "Low-Top Lace-Up" },
      { label: "SKU / SERI", value: "VN000EE3RED" },
    ],
    sizes: SHOE_SIZES,
    defaultSizeIndex: 8,
    orderNumber: "#SXN-AR-8845",
    resiNumber: "JT882910484519",
    invoiceNumber: "#69-202410-04",
  },
  {
    id: "vans-authentic-black",
    berandaName: "Vans Authentic Black",
    katalogLines: ["Vans Authentic Black", "White"],
    fullName: "VANS AUTHENTIC CLASSIC BLACK WHITE",
    subtitle: "Black / True White Core Canvas",
    categoryTag: "CLASSIC AUTHENTIC",
    katalogBrandTag: "VANS CORE",
    archiveTag: "ANAHEIM HERITAGE // CORE BLACK",
    categoryType: "sepatu",
    priceNumber: 500000,
    priceFormatted: "Rp 500.000",
    originalPriceFormatted: "Rp 749.000",
    discountBadge: "-33%",
    rating: "5.0",
    soldCount: 98,
    reviewsCount: 156,
    berandaBadge: "100% ORIGINAL",
    berandaBadgeVariant: "red",
    katalogBadge: "ESSENTIAL",
    katalogBadgeStyle: "white",
    katalogMeta: "Size 39 - 43 | BNIB",
    image: "/images/prod-authentic-black-176857.png",
    thumbnails: [
      { label: "SAMPING", image: "/images/prod-authentic-black-176857.png" },
      { label: "DETAIL", image: "/images/authentic-black-detail.jpg" },
      { label: "OUTSOLE", image: "/images/authentic-black-outsole.jpg" },
      { label: "BOX ASLI", image: "/images/authentic-black-box.jpg" },
    ],
    description:
      "Siluet esensial harian dari keluarga Vans. Kanvas hitam klasik dengan midsole putih bersih dan cengkeraman waffle karet yang sudah teruji di kultur skateboard dunia.",
    specs: [
      { label: "UPPER MATERIAL", value: "100% Heavyweight Canvas" },
      { label: "OUTSOLE", value: "Signature Waffle Sole" },
      { label: "KONSTRUKSI", value: "Heritage Vulcanized" },
      { label: "SKU / SERI", value: "VN000EE3BLK" },
    ],
    sizes: SHOE_SIZES,
    defaultSizeIndex: 8,
    orderNumber: "#SXN-AB-8859",
    resiNumber: "JT882910485901",
    invoiceNumber: "#69-202410-05",
  },
  {
    id: "vans-realm-backpack",
    berandaName: "Vans Realm Backpack",
    katalogLines: ["Vans Realm Backpack"],
    fullName: "VANS REALM CLASSIC BACKPACK BLACK",
    subtitle: "Black / White Off The Wall Patch (22L)",
    categoryTag: "STREET BACKPACK",
    katalogBrandTag: "ACCESSORIES",
    archiveTag: "STREET GEAR // VANS CARRY",
    categoryType: "backpack",
    priceNumber: 350000,
    priceFormatted: "Rp 350.000",
    originalPriceFormatted: "Rp 549.000",
    discountBadge: "-36%",
    rating: "4.9",
    soldCount: 65,
    reviewsCount: 82,
    berandaBadge: "100% ORIGINAL",
    berandaBadgeVariant: "red",
    katalogBadge: "GEAR",
    katalogBadgeStyle: "dark",
    katalogMeta: "All Size (22L) | Original",
    image: "/images/prod-realm-backpack-176857.png",
    thumbnails: [
      { label: "DEPAN", image: "/images/prod-realm-backpack-176857.png" },
      { label: "DETAIL", image: "/images/backpack-detail.png" },
      { label: "MATERIAL", image: "/images/backpack-material.jpg" },
      { label: "TAG ASLI", image: "/images/backpack-compartment.jpg" },
    ],
    description:
      "Tas ransel harian 22 liter dengan kompartemen utama luas, slot laptop berlapis pelindung hingga 15 inci, kantong depan beritsleting dengan organizer, serta strap bahu empuk yang nyaman untuk mobilitas harian.",
    specs: [
      { label: "MATERIAL", value: "100% Polyester 600D" },
      { label: "KAPASITAS", value: "22 Liter (Laptop 15\")" },
      { label: "DIMENSI", value: "42.5 x 32.5 x 12.5 cm" },
      { label: "SKU / SERI", value: "VN0A3UI6BLK" },
    ],
    sizes: BACKPACK_SIZES,
    defaultSizeIndex: 0,
    orderNumber: "#SXN-RB-8870",
    resiNumber: "JT882910487015",
    invoiceNumber: "#69-202410-06",
  },
];

export function getProductById(id?: string | null): ProductData {
  if (!id) return ALL_PRODUCTS[1]; // Default to Vans Sk8-Low Classic
  return ALL_PRODUCTS.find((p) => p.id === id) || ALL_PRODUCTS[1];
}

export function formatRupiah(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}
