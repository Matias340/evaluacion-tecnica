import { useEffect, useState } from "react";
import { Customer } from "../domain/customer";
import { mockCustomers } from "../mocks/customers";
import { getCustomers, saveCustomers } from "../storage/customers";

function initializeCustomers(): Customer[] {
  const data = getCustomers();

  if (data.length === 0) {
    saveCustomers(mockCustomers);
    return mockCustomers;
  }

  return data;
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    setCustomers(initializeCustomers());
  }, []);

  function addCustomer(customer: Customer) {
    const updated = [...customers, customer];
    setCustomers(updated);
    saveCustomers(updated);
  }

  return {
    customers,
    addCustomer,
  };
}
