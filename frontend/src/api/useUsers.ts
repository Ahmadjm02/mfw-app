import { useQuery } from "@tanstack/react-query";

import type { User } from "../types/user";
import { apiGet } from "./client";

export interface UsersFetchResult {
  users: User[];
}

async function fetchUsers({ signal }: { signal: AbortSignal }): Promise<UsersFetchResult> {
  const users = await apiGet<User[]>("/api/users", signal);
  return { users };
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    enabled: false,
    staleTime: 0,
    gcTime: 0,
    retry: false,
  });
}
