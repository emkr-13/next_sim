const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3080/api/";

interface UpdateProfileData {
  fullname: string;
}

export const userApi = {
  updateProfile: async (data: UpdateProfileData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}user/edit`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    return response.json();
  },
}; 