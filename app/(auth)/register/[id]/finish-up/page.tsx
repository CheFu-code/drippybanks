"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FinishSetupAccount = () => {
    const params = useParams();

    const [form, setForm] = useState({
        phone: "",
        bio: "",
        website: "",
    });

    const handleChange = (e: any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        console.log("Submitting:", form);
        // TODO: call API endpoint
    };

    return (
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">
                    Finish Setting Up Your Account
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                        name="phone"
                        placeholder="+1 555 123 4567"
                        value={form.phone}
                        onChange={handleChange}
                        type="tel"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Website (optional)</Label>
                    <Input
                        name="website"
                        placeholder="https://your-website.com"
                        value={form.website}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea
                        name="bio"
                        placeholder="Tell us a little about yourself..."
                        value={form.bio}
                        onChange={handleChange}
                    />
                </div>

                <Button className="w-full mt-4" onClick={handleSubmit}>
                    Complete Setup
                </Button>
            </CardContent>
        </Card>
    );
};

export default FinishSetupAccount;