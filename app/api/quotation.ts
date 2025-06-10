const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3080/api/";

export interface QuotationAll {
    id: number;
    quotationNumber: string;
    quotationDate: string;
    customerId: number | null;
    customerName: string | null;
    storeId: number;
    storeName: string;
    subtotal: string;
    discountAmount: string;
    grandTotal: string;
    status: string;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}
export interface QuotationDetail{
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: string;
    satuan: string;
    discount: string;
    subtotal: string;
    description: string | null;
    notes: string | null;
}
export interface Quotation{
    id: number;
    quotationNumber: string;
    quotationDate: string;
    customerId: number;
    customerName: string;
    storeId: number | null;
    storeName: string | null;
    subtotal: string;
    discountAmount: string;
    grandTotal: string;
    status: string;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    details: QuotationDetail[];
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

export interface QuotationDetailResponse{
    success: boolean;
    message: string;
    data: Quotation;
}

export interface QuotationAllResponse{
    success: boolean;
    message: string;
    data: {
        data: QuotationAll[];
        pagination: PaginationData;
    };
}



export interface QuotationQueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
}