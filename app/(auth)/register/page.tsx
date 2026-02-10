'use client'

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // import Firestore functions
import React, { useState } from "react";
import { toast } from "sonner";
import RegisterForm from "./_components/RegisterForm";
import { auth, db } from "@/config/firebaseConfig"; // make sure db is exported
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";

const Register = () => {
    const router = useRouter()
    const [email, setEmail] = useState("");
    const [fullname, setFullname] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullname) {
            toast.error("Please enter your full name");
            return;
        }

        setLoading(true);

        try {
            // Create user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update display name
            await updateProfile(userCredential.user, { displayName: fullname });
            await setDoc(doc(db, "drippy-banks-users", userCredential.user.uid), {
                fullname,
                email,
                createdAt: new Date(),
            });

            toast.success("Account created successfully!");
            router.replace(`/register/${userCredential.user.uid}/finish-up`)
        } catch (error: unknown) {
            let message = "Something went wrong!";

            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case "auth/email-already-in-use":
                        message = "This email is already in use.";
                        break;
                    case "auth/invalid-email":
                        message = "The email address is invalid.";
                        break;
                    case "auth/weak-password":
                        message = "Password should be at least 6 characters.";
                        break;
                    default:
                        message = error.message;
                }
            }

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <RegisterForm
            email={email}
            setEmail={setEmail}
            fullname={fullname}
            setFullname={setFullname}
            password={password}
            setPassword={setPassword}
            handleRegister={handleRegister}
            loading={loading}
        />
    );
};

export default Register;
