import type { Product } from "../../../types/Product";
import { formatCurrency } from "../../../utils/format";

interface ProductTableProps {
  products: Product[];
  onDetail: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductTable({
  products,
  onDetail,
  onEdit,
  onDelete,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        Belum ada produk. Klik "Tambah Produk" untuk menambah.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500 dark:border-neutral-800 dark:text-gray-400">
            <th className="py-2 pr-2 font-medium">Nama</th>
            <th className="py-2 pr-2 font-medium">Kategori</th>
            <th className="py-2 pr-2 font-medium">Harga Beli</th>
            <th className="py-2 pr-2 font-medium">Harga Jual</th>
            <th className="py-2 pr-2 font-medium">Stok</th>
            <th className="py-2 font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b border-gray-100 last:border-0 dark:border-neutral-800"
            >
              <td className="py-3 pr-2 font-medium text-gray-800 dark:text-gray-100">
                {product.name}
              </td>
              <td className="py-3 pr-2 text-gray-600 dark:text-gray-300">
                {product.category}
              </td>
              <td className="py-3 pr-2 text-gray-600 dark:text-gray-300">
                {formatCurrency(product.buyPrice)}
              </td>
              <td className="py-3 pr-2 text-gray-600 dark:text-gray-300">
                {formatCurrency(product.sellPrice)}
              </td>
              <td className="py-3 pr-2">
                {product.stock === 0 ? (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
                    Habis
                  </span>
                ) : (
                  <span className="text-gray-600 dark:text-gray-300">
                    {product.stock}
                  </span>
                )}
              </td>
              <td className="py-3">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => onDetail(product)}
                    className="rounded-lg px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800"
                  >
                    Lihat
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="rounded-lg px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(product)}
                    className="rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
