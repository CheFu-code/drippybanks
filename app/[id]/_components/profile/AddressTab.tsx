import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormState } from "@/types/user";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { IState } from "country-state-city";
import type React from "react";
import FinishUpForm from "@/components/forms/FinishUpForm";

type SavedAddress = {
    addressStreet: string;
    addressCity: string;
    addressPostalCode: string;
    country: {
        name: string;
        code: string;
    } | null;
};

type AddressTabProps = {
    savedAddress: SavedAddress;
    onOpenAddressForm: () => void;
    onRemoveAddress: () => void;
    isAddressFormOpen: boolean;
    loading: boolean;
    form: FormState;
    countryOptions: { value: string; label: string }[];
    stateOptions: { value: string; label: string }[];
    handleCountrySelect: (isoCode: string) => void;
    handleProvinceSelect: (stateCode: string) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSaveAddress: () => void;
    states: IState[];
};

export const AddressTab = ({
    savedAddress,
    onOpenAddressForm,
    onRemoveAddress,
    isAddressFormOpen,
    loading,
    form,
    countryOptions,
    stateOptions,
    handleCountrySelect,
    handleProvinceSelect,
    handleChange,
    handleSaveAddress,
    states,
}: AddressTabProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
        >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Saved Addresses</h2>

            <Card className="relative">
                <div className="absolute top-6 right-6">
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        Default
                    </span>
                </div>

                <CardHeader>
                    <CardTitle className="text-gray-900 font-bold">Home</CardTitle>
                </CardHeader>

                {savedAddress.addressStreet ? (
                    <CardContent className="space-y-1">
                        <p className="text-gray-600">{savedAddress.addressStreet}</p>
                        <p className="text-gray-600">
                            {savedAddress.addressCity} {savedAddress.addressPostalCode}
                        </p>
                        <p className="text-gray-600">{savedAddress.country?.name}</p>

                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={onOpenAddressForm}
                                className="text-sm font-medium text-black underline"
                            >
                                Edit
                            </button>
                            <button
                                onClick={onRemoveAddress}
                                className="text-sm font-medium text-red-600 hover:underline"
                            >
                                Remove Address
                            </button>
                        </div>
                    </CardContent>
                ) : (
                    <CardContent className="space-y-1">
                        <p className="text-gray-600">No saved address yet.</p>
                    </CardContent>
                )}
            </Card>

            <button
                onClick={onOpenAddressForm}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
            >
                <MapPin className="h-5 w-5" />
                {savedAddress.addressStreet ? "Update Address" : "Add New Address"}
            </button>

            {isAddressFormOpen && (
                <FinishUpForm
                    handleChange={handleChange}
                    handleSubmit={handleSaveAddress}
                    loading={loading}
                    form={form}
                    countryOptions={countryOptions}
                    stateOptions={stateOptions}
                    handleCountrySelect={handleCountrySelect}
                    handleProvinceSelect={handleProvinceSelect}
                    states={states}
                    title="Add or Update Address"
                    submitLabel="Save Address"
                />
            )}
        </motion.div>
    );
};
