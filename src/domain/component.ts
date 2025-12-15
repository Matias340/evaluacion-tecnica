export interface Component {
  id: string;
  serviceId: string;
  name: string;
  description?: string;
  estimated: number;
  real?: number;
}
