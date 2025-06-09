const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3080/api/";

export interface Store {
    id: number;
    name: string;
    description: string;
    location: string;
    manager: string;
    phone: string | null;
    email: string | null;
    address: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }

export interface StoreQueryParams {
    page?: number;
    limit?: string | number;
    sortBy?: string;
    sortOrder?: string;
    search?: string;
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
  
export interface StoreResponse {
    success: boolean;
    message: string;
    data: {
      data: Store[];
      pagination: PaginationData;
    };
  }

export interface StoreDetailResponse {
    success: boolean;
    message: string;
    data: Store;
  }

export interface CreateStore {
    name: string;
    description: string;
    location: string;
    manager: string;
    phone: string | null; 
    email: string | null;
    address: string;
  }

export interface UpdateStore {
    name: string;
    description: string;
    location: string;
    manager: string;
    phone: string | null;
    email: string | null;
    address: string;
  }
export const storeApi = {

  getAll: async (params: StoreQueryParams) => {
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

    const response = await fetch(`${BASE_URL}store/all?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch stores");
    }

    return response.json() as Promise<StoreResponse>;


  },

  create: async (storeData: CreateStore) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}store/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(storeData),
    });

    if (!response.ok) {
      throw new Error("Failed to create store");
    }

    return response.json(); 
  },

  update: async (id: number, storeData: UpdateStore) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}store/update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        ...storeData
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update store");
    }

    return response.json();
  },

  delete: async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}store/delete`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete store");
    }

    return response.json();
  },

  detail: async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}store/detail`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch store details");
    }

    return response.json() as Promise<StoreDetailResponse>;
  }
}  
  
  