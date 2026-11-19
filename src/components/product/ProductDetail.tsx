import type { Product } from "../../../types/Product";
import { formatCurrency, formatDate } from "../../../utils/format";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const rows: Array<{ label: string; value: string }> = [
    { label: "Nama", value: product.name },
    { label: "Kategori", value: product.category },
    { label: "Deskripsi", value: product.description ?? "-" },
    { label: "Harga Beli", value: formatCurrency(product.buyPrice) },
    { label: "Harga Jual", value: formatCurrency(product.sellPrice) },
    { label: "Stok", value: String(product.stock) },
    { label: "Dibuat", value: formatDate(product.createdAt) },
    { label: "Diubah", value: formatDate(product.updatedAt) },
  ];

  return (
    <dl className="space-y-3 text-sm">
      {rows.map((row) => (
        <div key={row.label} className="flex justify-between gap-4">
          <dt className="text-gray-500 dark:text-gray-400">{row.label}</dt>
          <dd className="text-right font-medium text-gray-800 dark:text-gray-100">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
