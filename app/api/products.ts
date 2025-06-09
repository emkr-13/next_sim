const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3080/api/";

export interface Product {
    id: number;
    name: string;
    description: string;
    sku: string;
    stock: number;
    satuan: string;
    categoryId: number;
    categoryName: string;
    price_sell: string;
    price_cost: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProductQueryParams {
    page?: number;
    limit?: string | number;
    sortBy?: string;
    sortOrder?: string;
    search?: string;
    categoryId?: number;
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

export interface ProductResponse {
    success: boolean;
    message: string;
    data: {
        data: Product[];
        pagination: PaginationData;
    };
}

export interface ProductDetailResponse {
    success: boolean;
    message: string;
    data: Product;
}

export interface CreateProduct {
    name: string;
    description: string;
    categoryId: number;
    price: number;
    satuan: string;
}

export interface UpdateProduct {
    name: string;
    description: string;
    categoryId: number;
    price: number;
    satuan: string;
}


export const productsApi = {
    getAll: async (params: ProductQueryParams) => {
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
        if (params.categoryId) queryParams.append("categoryId", params.categoryId.toString());

        const response = await fetch(`${BASE_URL}products/all?${queryParams.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        return response.json() as Promise<ProductResponse>;
    },

    create: async (productData: CreateProduct) => {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await fetch(`${BASE_URL}products/create`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
        });

        if (!response.ok) {
            throw new Error("Failed to create product");
        }

        return response.json();
    },

    update: async (id: number, productData: UpdateProduct) => {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await fetch(`${BASE_URL}products/update`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                ...productData
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to update product");
        }

        return response.json();
    },

    delete: async (id: number) => {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await fetch(`${BASE_URL}products/delete`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });

        if (!response.ok) {
            throw new Error("Failed to delete product");
        }

        return response.json();
    },

    detail: async (id: number) => {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await fetch(`${BASE_URL}products/detail`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch product details");
        }

        return response.json() as Promise<ProductDetailResponse>;
    },

    exportPdf: async (title: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await fetch(`${BASE_URL}products/export/pdf?title=${encodeURIComponent(title)}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/pdf',
            },
        });

        if (!response.ok) {
            throw new Error("Failed to export product to pdf");
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `products-${title}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
    },

    exportExcel: async (title: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await fetch(`${BASE_URL}products/export/excel?title=${encodeURIComponent(title)}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
        });

        if (!response.ok) {
            throw new Error("Failed to export product to excel");   
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `products-${title}.xlsx`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
    }
    
}

