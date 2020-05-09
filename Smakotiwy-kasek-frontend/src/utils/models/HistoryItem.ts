import { OrderStatus } from "./OrderStatus";
import { OrderItem } from "./OrderItem";

export interface HistoryItem {
  id: number;
  orderStatus: OrderStatus;
  orderItems: OrderItem[];
  totalPrice: number;
  address: any;
  phoneNumber: string;
  createdAt: number;
  updatedAt: number;
  ownerUserName?: string;
}
