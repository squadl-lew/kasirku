import instance from "../src/libs/axios/instance";
import { endpoint } from "./endpoints";
import type {
  ICreateProduct,
  IUpdateProduct,
  Product,
  ProductSearchParams,
} from "../types/Product";
import type { ApiResponse, PagedResponse } from "../types/api";

const productServices = {
  getProducts: (params: ProductSearchParams) => {
    // Jangan kirim name/category kosong — BE menolak string kosong (min 1).
    // Kalau filter kosong, param-nya dihilangkan saja.
    const { name, category, ...rest } = params;
    const cleanParams = {
      ...rest,
      ...(name ? { name } : {}),
      ...(category ? { category } : {}),
    };
    return instance.get<PagedResponse<Product>>(endpoint.PRODUCT, {
      params: cleanParams,
    });
  },
  getProduct: (id: number) =>
    instance.get<ApiResponse<Product>>(`${endpoint.PRODUCT}/${id}`),
  createProduct: (payload: ICreateProduct) =>
    instance.post<ApiResponse<Product>>(endpoint.PRODUCT, payload),
  updateProduct: (id: number, payload: IUpdateProduct) =>
    instance.put<ApiResponse<Product>>(`${endpoint.PRODUCT}/${id}`, payload),
  deleteProduct: (id: number) =>
    instance.delete<ApiResponse<"OK">>(`${endpoint.PRODUCT}/${id}`),
};

export { productServices };
