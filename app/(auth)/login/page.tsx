import { Suspense } from "react";
import LoginForm from "./_components/LoginForm";

const page = () => {
    return (
        <Suspense fallback={<div className="text-sm text-muted-foreground">Loading login...</div>}>
            <LoginForm />
        </Suspense>
    );
};

export default page;
