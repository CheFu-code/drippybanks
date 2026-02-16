import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FormState } from "@/types/user";
import { IState } from "country-state-city";
import React from "react";

const FinishUpForm = ({
    handleChange,
    handleSubmit,
    loading,
    form,
    countryOptions,
    stateOptions,
    handleCountrySelect,
    handleProvinceSelect,
    states,
    title = "Finish Setting Up Your Account",
    submitLabel = "Complete Setup",
}: {
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: () => void;
    loading: boolean;
    form: FormState
    countryOptions: { value: string; label: string }[];
    stateOptions: { value: string; label: string }[];
    handleCountrySelect: (isoCode: string) => void;
    handleProvinceSelect: (stateCode: string) => void;
    states: IState[]
    title?: string;
    submitLabel?: string;
}) => {
    return (
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">
                    {title}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                        id="phone"
                        name="phone"
                        placeholder="+27 82 123 4567"
                        value={form.phone}
                        onChange={handleChange}
                        type="tel"
                        autoComplete="tel"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select value={form.countryCode} onValueChange={handleCountrySelect}>
                        <SelectTrigger id="country">
                            <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                            {countryOptions.map((c) => (
                                <SelectItem key={c.value} value={c.value}>
                                    {c.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="province">Province / State</Label>
                    <Select
                        value={form.provinceCode}
                        onValueChange={handleProvinceSelect}
                        disabled={!states.length}
                    >
                        <SelectTrigger id="province">
                            <SelectValue
                                placeholder={
                                    states.length
                                        ? "Select province/state"
                                        : "Select a country first"
                                }
                            />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                            {stateOptions.map((s) => (
                                <SelectItem key={s.value} value={s.value}>
                                    {s.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="addressStreet">Street</Label>
                    <Input
                        id="addressStreet"
                        name="addressStreet"
                        placeholder="123 Example St, Suburb"
                        value={form.addressStreet}
                        onChange={handleChange}
                        autoComplete="address-line1"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="addressCity">City</Label>
                        <Input
                            id="addressCity"
                            name="addressCity"
                            placeholder="City"
                            value={form.addressCity}
                            onChange={handleChange}
                            autoComplete="address-level2"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="addressPostalCode">ZIP / Postal Code</Label>
                        <Input
                            id="addressPostalCode"
                            name="addressPostalCode"
                            placeholder="0002"
                            value={form.addressPostalCode}
                            onChange={handleChange}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            autoComplete="postal-code"
                        />
                    </div>
                </div>

                <Button
                    className="w-full mt-2"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Saving..." : submitLabel}
                </Button>
            </CardContent>
        </Card>
    );
};

export default FinishUpForm;
