import { ALL_PRODUCTS } from "@/data/products";
import ProductDetailClient from "./ProductDetailClient";

export function generateStaticParams() {
  return ALL_PRODUCTS.map((product) => ({
    id: product.id,
  }));
}

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <ProductDetailClient productId={params.id} />;
}
