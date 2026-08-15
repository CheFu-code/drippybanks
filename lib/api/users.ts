import { apiUrl } from "@/config/chefuAuth";

export interface AdminUser {
    id: string;
    fullname: string;
    email: string;
    roles: string[];
    createdAt: string | null;
}

export async function fetchAdminUsersApi(): Promise<AdminUser[]> {
    const res = await fetch(`${apiUrl}/admin/users`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch users: ${res.status}`);
    }

    const data = (await res.json()) as { users: AdminUser[] };
    return data.users ?? [];
}
