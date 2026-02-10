import { AppUser } from "@/types/user";
import { useState, useEffect } from "react";
import { doc, getDoc } from "@firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export function useAuthUser() {
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser && firebaseUser.email) {
                const docRef = doc(db, "drippy-bank-users", firebaseUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUser(docSnap.data() as AppUser);
                } else {
                    // fallback AppUser
                    setUser({
                        id: firebaseUser.uid,
                        email: firebaseUser.email,
                        fullname: "",
                        role: "guest",
                        createdAt: new Date(),
                    } as AppUser);
                }
            } else {
                setUser(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { user, loading };
}
