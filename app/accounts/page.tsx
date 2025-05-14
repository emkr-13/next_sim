"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, Trash, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

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

export default function AccountsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState("10");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [accountType, setAccountType] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!isLoading && isAuthenticated) {
      fetchAccounts();
    }
  }, [
    isAuthenticated,
    isLoading,
    router,
    currentPage,
    limit,
    sortBy,
    sortOrder,
    accountType,
  ]);

  const fetchAccounts = async () => {
    try {
      setIsPageLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      let url = `${
        process.env.BASE_URL || "http://localhost:3080/api/"
      }akun/all?page=${currentPage}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;

      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }

      if (accountType && accountType !== "all") {
        url += `&type=${accountType}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch accounts");
      }

      const data: AccountResponse = await response.json();
      setAccounts(data.data.data);
      setPagination(data.data.pagination);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast({
        title: "Error",
        description: "Failed to load accounts",
        variant: "destructive",
      });
    } finally {
      setIsPageLoading(false);
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setCurrentPage(1);
    fetchAccounts();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading || (isPageLoading && !accounts.length)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Layout>
      <ErrorBoundary>
        <PageHeader
          title="Accounts"
          description="Manage customer and supplier accounts"
          breadcrumbSegments={[
            { name: "Home", href: "/" },
            { name: "Accounts", href: "/accounts", current: true },
          ]}
          actions={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          }
        />

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <form
              onSubmit={handleSearch}
              className="flex w-full sm:w-auto gap-2"
            >
              <Input
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-[300px]"
              />
              <Button type="submit" variant="secondary" disabled={isSearching}>
                {isSearching ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search
              </Button>
            </form>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select
                value={accountType}
                onValueChange={(value) => {
                  setAccountType(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Account Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="supplier">Supplier</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortBy}
                onValueChange={(value) => {
                  setSortBy(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortOrder}
                onValueChange={(value) => {
                  setSortOrder(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isPageLoading ? (
            <div className="flex justify-center p-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Contact
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Type
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Created
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No accounts found
                        </TableCell>
                      </TableRow>
                    ) : (
                      accounts.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell className="font-medium">
                            {account.name}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div>{account.email}</div>
                            <div className="text-sm text-muted-foreground">
                              {account.phone}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                account.type === "customer"
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                  : "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                              }`}
                            >
                              {account.type}
                            </span>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {formatDate(account.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="icon" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {pagination && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {pagination.total_display} of{" "}
                    {pagination.total_data} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.prev)}
                      disabled={pagination.prev === 0}
                    >
                      Previous
                    </Button>

                    {pagination.detail.map((page) => (
                      <Button
                        key={page}
                        variant={
                          page === pagination.current ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.next)}
                      disabled={pagination.next === 0}
                    >
                      Next
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Select
                      value={limit}
                      onValueChange={(value) => {
                        setLimit(value);
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Rows" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 rows</SelectItem>
                        <SelectItem value="10">10 rows</SelectItem>
                        <SelectItem value="20">20 rows</SelectItem>
                        <SelectItem value="50">50 rows</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </ErrorBoundary>
    </Layout>
  );
}
