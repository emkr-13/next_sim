const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3080/api/";

export interface Category {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface CategoryQueryParams {
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
  
export interface CategoryResponse {
    success: boolean;
    message: string;
    data: {
      data: Category[];
      pagination: PaginationData;
    };
  }

export interface CreateCategory {
    name: string;
    description: string;
}

export interface UpdateCategory {
    name: string;
    description: string;
}

export interface CategoryDetailResponse {
    success: boolean;
    message: string;
    data: Category;
}

export const categoriesApi = {
    getAll: async (params: CategoryQueryParams) => {
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

        const response = await fetch(`${BASE_URL}categories/all?${queryParams.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }

        return response.json() as Promise<CategoryResponse>;
    },

    create: async (categoryData: CreateCategory) => {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await fetch(`${BASE_URL}categories/create`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(categoryData),
        });

        if (!response.ok) {
            throw new Error("Failed to create category");
        }

        return response.json();
    },

    update: async (id: number, categoryData: UpdateCategory) => {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await fetch(`${BASE_URL}categories/update`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                ...categoryData
            }),
        });
        
        if (!response.ok) {
            throw new Error("Failed to update category");
        }

        return response.json();
    },

    delete: async (id: number) => {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await fetch(`${BASE_URL}categories/delete`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });

        if (!response.ok) {
            throw new Error("Failed to delete category");
        }

        return response.json();
    },

    detail: async (id: number) => {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await fetch(`${BASE_URL}categories/detail`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch category details");
        }

        return response.json() as Promise<CategoryDetailResponse>;
    }

}