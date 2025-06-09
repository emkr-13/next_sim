const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3080/api/";

interface Account {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface PaginationData {
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

interface AccountResponse {
  success: boolean;
  message: string;
  data: {
    data: Account[];
    pagination: PaginationData;
  };
}

interface AccountDetailResponse {
  success: boolean;
  message: string;
  data: Account;
}

interface AccountQueryParams {
  page?: number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
  type?: string;
}

enum AccountType {
  CUSTOMER = "customer",
  SUPPLIER = "supplier"
}

interface CreateAccount {
  name: string;
  phone: string;
  email: string;
  address: string;
  type: AccountType;
}

interface UpdateAccount {
  name: string;
  phone: string;
  email: string;
  address: string;
  type: AccountType;
}



export const accountsApi = {
  getAll: async (params: AccountQueryParams) => {
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
    if (params.type && params.type !== "all") queryParams.append("type", params.type);

    const response = await fetch(`${BASE_URL}akun/all?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch accounts");
    }

    return response.json() as Promise<AccountResponse>;
  },

  create: async (accountData: CreateAccount) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Validate required fields
    if (!accountData.name?.trim()) {
      throw new Error("Name is required");
    }
    if (!accountData.phone?.trim()) {
      throw new Error("Phone is required");
    }
    if (!accountData.email?.trim()) {
      throw new Error("Email is required");
    }
    if (!accountData.address?.trim()) {
      throw new Error("Address is required");
    }
    if (!Object.values(AccountType).includes(accountData.type)) {
      throw new Error("Invalid account type. Must be either 'customer' or 'supplier'");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(accountData.email)) {
      throw new Error("Invalid email format");
    }

    // Validate phone number (basic validation for numeric and minimum length)
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(accountData.phone.replace(/[^0-9]/g, ''))) {
      throw new Error("Phone number must be between 10-15 digits");
    }

    const response = await fetch(`${BASE_URL}akun/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(accountData),
    });

    if (!response.ok) {
      throw new Error("Failed to create account");
    }

    return response.json();
  },

  update: async (id: number, accountData: Partial<UpdateAccount>) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Validate fields if they are provided
    if (accountData.email && !accountData.email.trim()) {
      throw new Error("Email cannot be empty");
    }
    if (accountData.phone && !accountData.phone.trim()) {
      throw new Error("Phone cannot be empty");
    }
    if (accountData.name && !accountData.name.trim()) {
      throw new Error("Name cannot be empty");
    }
    if (accountData.address && !accountData.address.trim()) {
      throw new Error("Address cannot be empty");
    }

    // Validate email format if provided
    if (accountData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(accountData.email)) {
        throw new Error("Invalid email format");
      }
    }

    // Validate phone number if provided
    if (accountData.phone) {
      const phoneRegex = /^\d{10,15}$/;
      if (!phoneRegex.test(accountData.phone.replace(/[^0-9]/g, ''))) {
        throw new Error("Phone number must be between 10-15 digits");
      }
    }

    // Validate type if provided
    if (accountData.type && !Object.values(AccountType).includes(accountData.type)) {
      throw new Error("Invalid account type. Must be either 'customer' or 'supplier'");
    }

    const response = await fetch(`${BASE_URL}akun/edit`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        ...accountData
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update account");
    }

    return response.json();
  },

  delete: async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}akun/delete`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete account");
    }

    return response.json();
  },

  detail: async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}akun/detail`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch account details");
    }

    return response.json()as Promise<AccountDetailResponse>;
  },
}; 