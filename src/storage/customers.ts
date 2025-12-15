import type { Customer } from "../domain/customer";
import { loadFromStorage, saveToStorage } from "./storage";

const STORAGE_KEY = "customers";

export function getCustomers(): Customer[] {
  return loadFromStorage<Customer[]>(STORAGE_KEY, []);
}

export function saveCustomers(customers: Customer[]) {
  saveToStorage(STORAGE_KEY, customers);
}

export function addCustomer(customer: Customer) {
  const customers = getCustomers();
  saveCustomers([...customers, customer]);
}

export function getCustomerById(id: string): Customer | undefined {
  return getCustomers().find((c) => c.id === id);
}
