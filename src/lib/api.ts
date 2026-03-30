const API_URL = "http://localhost:3000/api";

export interface CoffeeItem {
  id: number;
  name: string;
  brand: string;
  origin: string;
  roast_level: "Light" | "Medium" | "Dark";
  price: number;
  notes: string;
  image_url: string;
  roast_date: string;
  ai_description?: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
}

export const api = {
  fetchCoffees: async (limit = 20, offset = 0): Promise<CoffeeItem[]> => {
    const res = await fetch(`${API_URL}/coffees?limit=${limit}&offset=${offset}`);
    if (!res.ok) throw new Error("Archival data unreachable");
    return res.json();
  },

  addCoffee: async (data: Omit<CoffeeItem, "id">): Promise<CoffeeItem> => {
    const res = await fetch(`${API_URL}/coffees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Curation transmission failure");
    return res.json();
  },

  updateCoffee: async (id: number, data: Partial<CoffeeItem>): Promise<CoffeeItem> => {
    const res = await fetch(`${API_URL}/coffees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Refinement transmission failure");
    return res.json();
  },

  deleteCoffee: async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/coffees/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Archive purge failure");
  },

  login: async (email: string, password: string): Promise<UserProfile> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Authentication failure");
    }
    return res.json();
  },

  register: async (name: string, email: string, password: string): Promise<UserProfile> => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Identity collision");
    }
    return res.json();
  },

  updateProfile: async (email: string, oldPassword: string, newPassword?: string, newName?: string): Promise<{ success: boolean; name: string }> => {
    const res = await fetch(`${API_URL}/auth/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, oldPassword, newPassword, newName }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Refinement failure");
    }
    return res.json();
  },

  describeCoffee: async (coffee: Partial<CoffeeItem>): Promise<string> => {
    const res = await fetch(`${API_URL}/ai/describe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(coffee),
    });
    if (!res.ok) return "Sensory simulation offline.";
    const data = await res.json();
    return data.description;
  },

  submitOrder: async (coffeeId: number, quantity: number, totalPrice: number): Promise<void> => {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coffee_id: coffeeId, quantity, total_price: totalPrice }),
    });
    if (!res.ok) throw new Error("Archival order failure");
  },

  fetchAnalytics: async (): Promise<{ order_count: number; orders: any[] }> => {
    const res = await fetch(`${API_URL}/analytics`);
    if (!res.ok) throw new Error("Analytics retrieval failure");
    return res.json();
  }
};
