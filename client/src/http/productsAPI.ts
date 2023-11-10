import { $authHost, $host } from "./index";

export const createType = async (type: string) => {
  const { data } = await $authHost.post("api/type", type);
  return data;
};

export const fetchTypes = async () => {
  const { data } = await $host.get("api/type");
  return data;
};

export const createBrand = async (brand: string) => {
  const { data } = await $authHost.post("api/brand", brand);
  return data;
};

export const fetchBrands = async () => {
  const { data } = await $host.get("api/brand");
  return data;
};

export const createProduct = async (product: any) => {
  const { data } = await $authHost.post("api/product", product);
  return data;
};

export const fetchProducts = async (
  typeId: number,
  brandId: number,
  page: number,
  limit = 5,
) => {
  const { data } = await $host.get("api/product", {
    params: {
      typeId,
      brandId,
      page,
      limit,
    },
  });
  return data;
};

export const fetchOneProduct = async (id: number) => {
  const { data } = await $host.get(`api/product/${id}`);
  return data;
};
