const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3080/api/";

export interface StockMovement {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  productSatuan: string;
  movementType: string;
  quantity: number;
  note: string;
  akunId: number | null;
  akunName: string | null;
  storeId: number;
  storeName: string;
  createdAt: string;
  updatedAt: string;
}
export interface PaginationData {
  total_data: string;
  total_page: number;
  total_display: number;
  first_page: boolean;
  last_page: boolean;
  prev: number;
  current: number;
  next: number;
  detail: number[];
}

export interface StockMovementResponse {
  success: boolean;
  message: string;
  data: {
    data: StockMovement[];
    pagination: PaginationData;
  };
}

export interface StockMovementDetailResponse {
  success: boolean;
  message: string;
  data: StockMovement;
}

export interface StockMovementQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
  movementType?: MovementType;
}

export enum MovementType {
  IN = "in",
  OUT = "out",
}

export const stockMovementApi = {
  getAll: async (params: StockMovementQueryParams) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
    if (params.search) queryParams.append("search", params.search);
    if (params.movementType) queryParams.append("movementType", params.movementType);

    const response = await fetch(`${BASE_URL}stock-movements/all?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch stock movements");
    }

    const data: StockMovementResponse = await response.json();
    return data;
  },

  detail: async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}stock-movements/detail`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch stock movement");
    }

    const data: StockMovementDetailResponse = await response.json();
    return data;
  },
};