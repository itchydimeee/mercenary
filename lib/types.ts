export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  sizes: string[];
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  profile_picture: string;
  created_at: string;
}

export interface Message {
  id: string;
  user_id: string;
  product_id: string | null;
  message: string;
  reply: string | null;
  status: "pending" | "replied" | "resolved";
  created_at: string;
}
