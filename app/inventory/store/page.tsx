'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Plus, Search, Edit, Trash, MapPin, Mail, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

interface Store {
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

interface StoreResponse {
  success: boolean;
  message: string;
  data: {
    data: Store[];
    pagination: PaginationData;
  };
}

export default function StorePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [stores, setStores] = useState<Store[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState('10');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isSearching, setIsSearching] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!isLoading && isAuthenticated) {
      fetchStores();
    }
  }, [isAuthenticated, isLoading, router, currentPage, limit, sortBy, sortOrder]);

  const fetchStores = async () => {
    try {
      setIsPageLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      let url = `${process.env.BASE_URL || 'http://localhost:3080/api/'}store/all?page=${currentPage}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stores');
      }

      const data: StoreResponse = await response.json();
      setStores(data.data.data);
      setPagination(data.data.pagination);
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast({
        title: 'Error',
        description: 'Failed to load stores',
        variant: 'destructive',
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
    fetchStores();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading || (isPageLoading && !stores.length)) {
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
          title="Stores"
          description="Manage your store locations"
          breadcrumbSegments={[
            { name: 'Home', href: '/' },
            { name: 'Inventory', href: '/inventory' },
            { name: 'Stores', href: '/inventory/store', current: true },
          ]}
          actions={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Store
            </Button>
          }
        />

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <form onSubmit={handleSearch} className="flex w-full sm:w-auto gap-2">
              <Input
                placeholder="Search stores..."
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
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="rounded-none px-3"
                >
                  Table
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none px-3"
                >
                  Grid
                </Button>
              </div>

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
                  <SelectItem value="location">Location</SelectItem>
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
              {viewMode === 'table' ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">Location</TableHead>
                        <TableHead className="hidden md:table-cell">Manager</TableHead>
                        <TableHead className="hidden md:table-cell">Contact</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stores.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No stores found
                          </TableCell>
                        </TableRow>
                      ) : (
                        stores.map((store) => (
                          <TableRow key={store.id}>
                            <TableCell className="font-medium">{store.name}</TableCell>
                            <TableCell className="hidden md:table-cell">{store.location}</TableCell>
                            <TableCell className="hidden md:table-cell">{store.manager}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {store.email && <div className="text-sm">{store.email}</div>}
                              {store.phone && <div className="text-sm">{store.phone}</div>}
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
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stores.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                      No stores found
                    </div>
                  ) : (
                    stores.map((store) => (
                      <Card key={store.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-0">
                          <div className="bg-primary/10 p-6">
                            <h3 className="text-lg font-semibold mb-1">{store.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{store.description}</p>
                          </div>
                          <div className="p-4 space-y-3">
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                              <span className="text-sm">{store.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm">{store.email || 'No email provided'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm">{store.phone || 'No phone provided'}</span>
                            </div>
                          </div>
                          <div className="border-t p-4 flex justify-between items-center">
                            <div className="text-sm text-muted-foreground">
                              Manager: <span className="font-medium text-foreground">{store.manager}</span>
                            </div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}

              {pagination && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {pagination.total_display} of {pagination.total_data} results
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
                        variant={page === pagination.current ? "default" : "outline"}
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