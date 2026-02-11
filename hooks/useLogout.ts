import { signOut } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useLogout = () => {
    const router = useRouter();

    const handleLogout = async (redirectTo?: string) => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully!");

            if (redirectTo) {
                router.replace(redirectTo);
            }
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Logout failed. Please try again.");
        }
    };

    return { handleLogout };
};
