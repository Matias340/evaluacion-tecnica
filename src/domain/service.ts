import type { Component } from "./component";

export interface Service {
  id: string;
  orderId: string;
  name: string;
  description?: string;
  laborEstimated: number;
  laborReal?: number;
  components: Component[];
}
