"use client";

import { doc, setDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { db } from "@/config/firebaseConfig";
import { FormState } from "@/types/user";
import { Country, ICountry, IState, State } from "country-state-city";
import FinishUpForm from "../../_components/FinishUpForm";

const DEFAULT_COUNTRY_CODE = "ZA"; // Preselect South Africa (optional)

const FinishSetupAccount = () => {
    const params = useParams<{ id?: string | string[] }>();
    const userId = Array.isArray(params.id) ? params.id[0] : params.id;
    const router = useRouter()

    const [loading, setLoading] = useState(false);
    const [countries, setCountries] = useState<ICountry[]>([]);
    const [states, setStates] = useState<IState[]>([]);

    const [form, setForm] = useState<FormState>({
        phone: "",
        countryCode: "",
        countryName: "",
        provinceCode: "",
        provinceName: "",
        addressStreet: "",
        addressCity: "",
        addressPostalCode: "",
    });

    // Load countries on mount
    useEffect(() => {
        const all = Country.getAllCountries(); // [{ name, isoCode, phonecode, flag, ... }]
        setCountries(all);

        // Optionally default to South Africa
        const za = all.find((c) => c.isoCode === DEFAULT_COUNTRY_CODE);
        if (za) {
            setForm((prev) => ({
                ...prev,
                countryCode: za.isoCode,
                countryName: za.name,
            }));
            const zaStates = State.getStatesOfCountry(za.isoCode);
            setStates(zaStates);
        }
    }, []);

    // When country changes, refresh states (provinces)
    const handleCountrySelect = (isoCode: string) => {
        const selected = countries.find((c) => c.isoCode === isoCode);
        setForm((prev) => ({
            ...prev,
            countryCode: isoCode,
            countryName: selected?.name ?? "",
            provinceCode: "",
            provinceName: "",
        }));
        setStates(State.getStatesOfCountry(isoCode) || []);
    };

    const handleProvinceSelect = (stateCode: string) => {
        const selected = states.find((s) => s.isoCode === stateCode);
        setForm((prev) => ({
            ...prev,
            provinceCode: selected?.isoCode ?? "",
            provinceName: selected?.name ?? "",
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!userId) {
            toast.error("Missing user id. Please reload the page.");
            return;
        }

        if (!form.countryCode) {
            toast.error("Please select a country.");
            return;
        }

        if (!form.addressStreet || !form.addressCity || !form.addressPostalCode) {
            toast.error("Please complete your address (street, city, postal code).");
            return;
        }

        if (!form.phone) {
            toast.error("Please enter your phone number.");
            return;
        }

        if (!form.provinceCode) {
            toast.error("Please select a province.");
            return;
        }

        if (!form.countryName) {
            toast.error("Please select a country.");
            return;
        }


        setLoading(true);

        try {
            await setDoc(
                doc(db, "drippy-banks-users", userId),
                {
                    phone: form.phone,
                    country: {
                        code: form.countryCode,
                        name: form.countryName,
                    },
                    province: form.provinceName
                        ? { code: form.provinceCode, name: form.provinceName }
                        : null,
                    addressStreet: form.addressStreet,
                    addressCity: form.addressCity,
                    addressPostalCode: form.addressPostalCode,
                    finishedSetup: true,
                    updatedAt: new Date(),
                },
                { merge: true },
            );

            toast.success("Account details saved!");
            router.replace("/")
        } catch (error: unknown) {
            const err = error as Error;
            toast.error("Failed to save account details.", {
                description: err.message ?? "Unknown error",
            });
        } finally {
            setLoading(false);
        }
    };

    // Derived memoized lists (optional, for performance with large lists)
    const countryOptions = useMemo(
        () =>
            countries.map((c) => ({
                value: c.isoCode,
                label: c.name,
            })),
        [countries],
    );

    const stateOptions = useMemo(
        () =>
            states.map((s) => ({
                value: s.isoCode,
                label: s.name,
            })),
        [states],
    );

    return (
        <FinishUpForm
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={loading}
            form={form}
            countryOptions={countryOptions}
            stateOptions={stateOptions}
            handleCountrySelect={handleCountrySelect}
            handleProvinceSelect={handleProvinceSelect}
            states={states}
        />
    );
};

export default FinishSetupAccount;
