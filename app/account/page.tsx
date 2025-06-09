"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { User, Save } from "lucide-react";
import { userApi } from "@/app/api/user";


export default function AccountPage() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isLoading && !isAuthenticated) {
        router.push("/login");
        return;
      }

      try {
        const response = await userApi.getProfile();
        if (response.success && response.data) {
          setFullname(response.data.fullname);
          setEmail(response.data.email);
          setCreatedAt(response.data.createdAt);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error instanceof Error && error.message === "No authentication token found") {
          router.push("/login");
          return;
        }
        toast({
          title: "Error",
          description: "Failed to fetch profile data",
          variant: "destructive",
        });
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, isLoading, router, toast]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      await userApi.updateProfile({ fullname });
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      // Refresh profile data after update
      const response = await userApi.getProfile();
      if (response.success && response.data) {
        setFullname(response.data.fullname);
        setEmail(response.data.email);
        setCreatedAt(response.data.createdAt);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error instanceof Error && error.message === "No authentication token found") {
        router.push("/login");
        return;
      }
      
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (isLoading || isPageLoading) {
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
          title="Account"
          description="Manage your account settings"
          breadcrumbSegments={[
            { name: "Home", href: "/" },
            { name: "Account", href: "/account", current: true },
          ]}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account details and personal information.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={email}
                    disabled
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your email address cannot be changed.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullname">Full Name</Label>
                  <Input
                    id="fullname"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>

          <div className="space-y-6">
            <Card className="bg-primary/5">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Account Security</CardTitle>
                    <CardDescription>
                      Manage your account security settings
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-card rounded-md p-4 border">
                    <h4 className="font-medium mb-1">Password Management</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      It's a good practice to change your password regularly.
                    </p>
                    <Button variant="outline" className="w-full" disabled>
                      Change Password
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      This feature is coming soon.
                    </p>
                  </div>

                  <div className="bg-card rounded-md p-4 border">
                    <h4 className="font-medium mb-1">
                      Two-Factor Authentication
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Add an extra layer of security to your account.
                    </p>
                    <Button variant="outline" className="w-full" disabled>
                      Setup 2FA
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      This feature is coming soon.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>
                  Manage your active sessions across devices.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-primary/5 rounded-md">
                    <div className="rounded-full bg-primary/10 p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <rect width="16" height="20" x="4" y="2" rx="2" />
                        <path d="M12 18h.01" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium flex items-center">
                        Current Session
                        <span className="ml-2 inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-300">
                          Active
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Last active: Just now
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" disabled>
                  Log Out All Other Devices
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </ErrorBoundary>
    </Layout>
  );
}
