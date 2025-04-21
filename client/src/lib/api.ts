const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8093/v1";

export async function getSummary() {
  const response = await fetch(`${BASE_URL}/summary`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch summary");
  }
  return response.json();
}

export async function getTransactions({
  page = 1,
  limit = 10,
  category,
  startDate,
  endDate,
}: {
  page?: number;
  limit?: number;
  category?: string;
  startDate?: string;
  endDate?: string;
}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(category && { category }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  });
  const response = await fetch(`${BASE_URL}/transactions?${params}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch transactions");
  }
  return response.json();
}

export async function createTransaction(data: any) {
  const response = await fetch(`${BASE_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create transaction");
  }
  return response.json();
}

export async function apiUpdateTransaction(id: string, data: any) {
  const response = await fetch(`${BASE_URL}/transactions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update transaction");
  }
  return response.json();
}

export async function apiDeleteTransaction(id: string) {
  const response = await fetch(`${BASE_URL}/transactions/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete transaction");
  }
}
