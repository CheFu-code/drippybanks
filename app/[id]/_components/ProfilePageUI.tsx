import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { db } from "@/config/firebaseConfig";
import { AppUser, FormState } from "@/types/user";
import { Country, ICountry, IState, State } from "country-state-city";
import { doc, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import {
    ChevronRight,
    CreditCard,
    LogOut,
    MapPin,
    Package,
    Settings,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FaCcAmex, FaCcDiscover, FaCcMastercard, FaCcVisa, FaCreditCard } from "react-icons/fa";
import { toast } from "sonner";
import FinishUpForm from "../../(auth)/register/_components/FinishUpForm";
import { ORDERS } from "../profile/page";

const DEFAULT_COUNTRY_CODE = "ZA";

const detectCardBrand = (cardDigits: string): string => {
    if (/^4/.test(cardDigits)) return "Visa";
    if (/^(5[1-5]|2[2-7])/.test(cardDigits)) return "Mastercard";
    if (/^3[47]/.test(cardDigits)) return "American Express";
    if (/^6(?:011|5)/.test(cardDigits)) return "Discover";
    if (/^(50|5[6-9]|6[0-9])/.test(cardDigits)) return "Maestro";
    return "Unknown";
};

const getCardBrandIcon = (brand?: string) => {
    switch (brand) {
        case "Visa":
            return FaCcVisa;
        case "Mastercard":
            return FaCcMastercard;
        case "American Express":
            return FaCcAmex;
        case "Discover":
            return FaCcDiscover;
        default:
            return FaCreditCard;
    }
};

export const ProfilePageUI = ({
    user,
    handleLogout,
    activeTab,
    setActiveTab,
}: {
    user: AppUser
    handleLogout: (redirectTo?: string | undefined) => Promise<void>
    activeTab: "orders" | "addresses" | "payment"
    setActiveTab: (tab: "orders" | "addresses" | "payment") => void
}) => {
    const [loading, setLoading] = useState(false);
    const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
    const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
    const [countries, setCountries] = useState<ICountry[]>([]);
    const [states, setStates] = useState<IState[]>([]);
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardHolderName, setCardHolderName] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const [cardBillingPostalCode, setCardBillingPostalCode] = useState("");
    const [savedPaymentMethods, setSavedPaymentMethods] = useState(user?.paymentMethods ?? []);

    const [savedAddress, setSavedAddress] = useState({
        addressStreet: user?.addressStreet ?? "",
        addressCity: user?.addressCity ?? "",
        addressPostalCode: user?.addressPostalCode ?? "",
        country: user?.country ?? null,
    });

    const [form, setForm] = useState<FormState>({
        phone: user?.phone ?? "",
        countryCode: user?.country?.code ?? "",
        countryName: user?.country?.name ?? "",
        provinceCode: "",
        provinceName: "",
        addressStreet: user?.addressStreet ?? "",
        addressCity: user?.addressCity ?? "",
        addressPostalCode: user?.addressPostalCode ?? "",
    });

    useEffect(() => {
        setSavedAddress({
            addressStreet: user?.addressStreet ?? "",
            addressCity: user?.addressCity ?? "",
            addressPostalCode: user?.addressPostalCode ?? "",
            country: user?.country ?? null,
        });

        setForm((prev) => ({
            ...prev,
            phone: user?.phone ?? prev.phone,
            countryCode: user?.country?.code ?? prev.countryCode,
            countryName: user?.country?.name ?? prev.countryName,
            addressStreet: user?.addressStreet ?? "",
            addressCity: user?.addressCity ?? "",
            addressPostalCode: user?.addressPostalCode ?? "",
        }));

        setSavedPaymentMethods(user?.paymentMethods ?? []);
    }, [user]);

    useEffect(() => {
        const all = Country.getAllCountries();
        setCountries(all);

        const initialCountryCode = user?.country?.code || DEFAULT_COUNTRY_CODE;
        const selected = all.find((c) => c.isoCode === initialCountryCode);

        if (selected) {
            setForm((prev) => ({
                ...prev,
                countryCode: prev.countryCode || selected.isoCode,
                countryName: prev.countryName || selected.name,
            }));
            setStates(State.getStatesOfCountry(selected.isoCode));
        }
    }, [user?.country?.code]);

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

    const handleOpenAddressForm = () => {
        const countryCode = savedAddress.country?.code || form.countryCode;
        if (countryCode) {
            setStates(State.getStatesOfCountry(countryCode) || []);
        }

        setForm((prev) => ({
            ...prev,
            phone: user?.phone ?? prev.phone,
            countryCode,
            countryName: savedAddress.country?.name || prev.countryName,
            addressStreet: savedAddress.addressStreet,
            addressCity: savedAddress.addressCity,
            addressPostalCode: savedAddress.addressPostalCode,
        }));
        setIsAddressFormOpen(true);
    };

    const handleSaveAddress = async () => {
        if (!user?.id) {
            toast.error("Missing user id. Please reload the page.");
            return;
        }

        if (!form.countryCode || !form.countryName) {
            toast.error("Please select a country.");
            return;
        }

        if (!form.provinceCode) {
            toast.error("Please select a province.");
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

        setLoading(true);
        try {
            await setDoc(
                doc(db, "drippy-banks-users", user.id),
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

            setSavedAddress({
                addressStreet: form.addressStreet,
                addressCity: form.addressCity,
                addressPostalCode: form.addressPostalCode,
                country: {
                    code: form.countryCode,
                    name: form.countryName,
                },
            });
            setIsAddressFormOpen(false);
            toast.success("Address saved.");
        } catch (error: unknown) {
            const err = error as Error;
            toast.error("Failed to save address.", {
                description: err.message ?? "Unknown error",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveAddress = async () => {
        if (!user?.id) {
            toast.error("Missing user id. Please reload the page.");
            return;
        }

        if (savedAddress.addressStreet) {
            toast.error("Default address cannot be removed.");
            return;
        }

        setLoading(true);
        try {
            await setDoc(
                doc(db, "drippy-banks-users", user.id),
                {
                    addressStreet: "",
                    addressCity: "",
                    addressPostalCode: "",
                    province: null,
                    updatedAt: new Date(),
                },
                { merge: true },
            );

            setSavedAddress({
                addressStreet: "",
                addressCity: "",
                addressPostalCode: "",
                country: user?.country ?? null,
            });
            setIsAddressFormOpen(false);
            toast.success("Address removed.");
        } catch (error: unknown) {
            const err = error as Error;
            toast.error("Failed to remove address.", {
                description: err.message ?? "Unknown error",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveCard = async () => {
        if (!user?.id) {
            toast.error("Missing user id. Please reload the page.");
            return;
        }

        if (!cardHolderName.trim()) {
            toast.error("Please enter the cardholder name.");
            return;
        }

        const digits = cardNumber.replace(/\D/g, "");
        if (digits.length < 12) {
            toast.error("Please enter a valid card number.");
            return;
        }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
            toast.error("Please use card expiry format MM/YY.");
            return;
        }

        if (!/^\d{3,4}$/.test(cardCvv)) {
            toast.error("Please enter a valid CVV.");
            return;
        }

        if (!cardBillingPostalCode.trim()) {
            toast.error("Please enter billing postal code.");
            return;
        }

        const newMethod = {
            id: crypto.randomUUID(),
            type: "card" as const,
            holderName: cardHolderName.trim(),
            brand: detectCardBrand(digits),
            last4: digits.slice(-4),
            expiry: cardExpiry,
            billingPostalCode: cardBillingPostalCode.trim(),
            isDefault: savedPaymentMethods.length === 0,
            cardNumber: digits,
            createdAt: new Date(),
        };

        const updatedMethods = [...savedPaymentMethods, newMethod];

        setLoading(true);
        try {
            await setDoc(
                doc(db, "drippy-banks-users", user.id),
                {
                    paymentMethods: updatedMethods,
                    updatedAt: new Date(),
                },
                { merge: true },
            );

            setSavedPaymentMethods(updatedMethods);
            setCardNumber("");
            setCardExpiry("");
            setCardHolderName("");
            setCardCvv("");
            setCardBillingPostalCode("");
            setIsPaymentFormOpen(false);
            toast.success("Card added.");
        } catch (error: unknown) {
            const err = error as Error;
            toast.error("Failed to save card.", {
                description: err.message ?? "Unknown error",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCardNumberChange = (value: string) => {
        const digitsOnly = value.replace(/\D/g, "").slice(0, 16);
        const grouped = digitsOnly.match(/.{1,4}/g)?.join(" ") ?? "";
        setCardNumber(grouped);
    };

    const handleCardExpiryChange = (value: string) => {
        const digitsOnly = value.replace(/\D/g, "").slice(0, 4);
        if (digitsOnly.length <= 2) {
            setCardExpiry(digitsOnly);
            return;
        }

        const month = digitsOnly.slice(0, 2);
        const year = digitsOnly.slice(2, 4);
        setCardExpiry(`${month}/${year}`);
    };

    const handleCardCvvChange = (value: string) => {
        const digitsOnly = value.replace(/\D/g, "").slice(0, 4);
        setCardCvv(digitsOnly);
    };

    const handleRemoveCard = async (paymentMethodId: string) => {
        if (!user?.id) {
            toast.error("Missing user id. Please reload the page.");
            return;
        }

        const targetMethod = savedPaymentMethods.find(
            (method) => method.id === paymentMethodId,
        );
        if (targetMethod?.isDefault) {
            toast.error("Default card cannot be removed.");
            return;
        }

        const updatedMethods = savedPaymentMethods.filter(
            (method) => method.id !== paymentMethodId,
        );

        setLoading(true);
        try {
            await setDoc(
                doc(db, "drippy-banks-users", user.id),
                {
                    paymentMethods: updatedMethods,
                    updatedAt: new Date(),
                },
                { merge: true },
            );

            setSavedPaymentMethods(updatedMethods);
            toast.success("Card removed.");
        } catch (error: unknown) {
            const err = error as Error;
            toast.error("Failed to remove card.", {
                description: err.message ?? "Unknown error",
            });
        } finally {
            setLoading(false);
        }
    };

    const countryOptions = useMemo(
        () => countries.map((c) => ({ value: c.isoCode, label: c.name })),
        [countries],
    );

    const stateOptions = useMemo(
        () => states.map((s) => ({ value: s.isoCode, label: s.name })),
        [states],
    );

    const detectedCardBrand = useMemo(
        () => detectCardBrand(cardNumber.replace(/\D/g, "")),
        [cardNumber],
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                        <Avatar className="h-full w-full object-cover rounded-full">
                            <AvatarImage
                                src={user?.avatarUrl}
                                alt="Profile image"
                            />
                            <AvatarFallback>{user?.fullname?.[0] || "DB"}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="absolute bottom-0 right-0 bg-green-500 size-5 rounded-full border-2 border-white"></div>
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {user.fullname}
                        </h1>
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            Gold Member
                        </span>
                    </div>
                    <p className="text-gray-500">{user.email}</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Member since{" "}
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-ZA", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        }) : "Unknown"}
                    </p>
                </div>

                <Button className="flex items-center gap-2 px-4 py-2  text-sm font-medium">
                    <Settings className="h-4 w-4" />
                    Edit Profile
                </Button>
            </div>

            <div className="grid grid-cols-1 p-2 md:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="md:col-span-1 space-y-2">
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "orders"
                            ? "bg-black text-white"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        <Package className="h-4 w-4" />
                        My Orders
                    </button>
                    <button
                        onClick={() => setActiveTab("addresses")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "addresses"
                            ? "bg-black text-white"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        <MapPin className="h-4 w-4" />
                        Addresses
                    </button>
                    <button
                        onClick={() => setActiveTab("payment")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "payment"
                            ? "bg-black text-white"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        <CreditCard className="h-4 w-4" />
                        Payment Methods
                    </button>

                    <div className="pt-4 border-t border-gray-100 mt-4">
                        <Button
                            className="cursor-pointer"
                            variant={"destructive"}
                            onClick={() => handleLogout()}
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="md:col-span-3">
                    {activeTab === "orders" && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Order History
                            </h2>
                            {ORDERS.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow"
                                >
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-bold text-gray-900">
                                                {order.id}
                                            </span>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${order.status === "Delivered"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-blue-100 text-blue-700"
                                                    }`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">{order.date}</p>
                                        <p className="text-sm text-gray-600 mt-2">
                                            {order.items.join(", ")}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="font-bold text-lg">
                                            ${order.total.toFixed(2)}
                                        </span>
                                        <button className="text-gray-400 hover:text-black">
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === "addresses" && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Saved Addresses
                            </h2>

                            <Card className="relative">
                                {/* Default Badge */}
                                <div className="absolute top-6 right-6">
                                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                        Default
                                    </span>
                                </div>

                                <CardHeader>
                                    <CardTitle className="text-gray-900 font-bold">
                                        Home
                                    </CardTitle>
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
                                                onClick={handleOpenAddressForm}
                                                className="text-sm font-medium text-black underline"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={handleRemoveAddress}
                                                disabled
                                                className="text-sm font-medium text-gray-400 cursor-not-allowed"
                                            >
                                                Default Address
                                            </button>
                                        </div>
                                    </CardContent>
                                ) : (
                                    <CardContent className="space-y-1">
                                        <p className="text-gray-600">
                                            No saved address yet.
                                        </p>
                                    </CardContent>
                                )}
                            </Card>

                            <button
                                onClick={handleOpenAddressForm}
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
                    )}

                    {activeTab === "payment" && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Payment Methods
                            </h2>
                            {savedPaymentMethods.length === 0 ? (
                                <div className="bg-white rounded-xl border border-gray-100 p-6">
                                    <p className="text-sm text-gray-500">No payment methods saved yet.</p>
                                </div>
                            ) : (
                                savedPaymentMethods.map((method) => {
                                    const CardBrandIcon = getCardBrandIcon(method.brand);
                                    return (
                                    <div
                                        key={method.id}
                                        className="bg-white rounded-xl border border-gray-100 p-6 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="bg-gray-100 p-3 rounded-lg">
                                                <CardBrandIcon className="h-6 w-6 text-gray-700" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">
                                                    {method.brand ?? "Card"} *****{method.last4}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {method.holderName ?? "Cardholder"} - Expires {method.expiry}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Billing ZIP {method.billingPostalCode ?? "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                            <button
                                                onClick={() => handleRemoveCard(method.id)}
                                                disabled={method.isDefault}
                                                className={`text-sm font-medium ${method.isDefault
                                                    ? "text-gray-400 cursor-not-allowed"
                                                    : "text-red-600"
                                                    }`}
                                            >
                                                {method.isDefault ? "Default Card" : "Remove"}
                                            </button>
                                        </div>
                                    );
                                })
                            )}

                            <button
                                onClick={() => setIsPaymentFormOpen((prev) => !prev)}
                                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <CreditCard className="h-5 w-5" />
                                {isPaymentFormOpen ? "Close Card Form" : "Add New Card"}
                            </button>

                            {isPaymentFormOpen && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-xl font-semibold">
                                            Add Payment Card
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Cardholder Name
                                            </label>
                                            <Input
                                                value={cardHolderName}
                                                onChange={(e) => setCardHolderName(e.target.value)}
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Card Number
                                            </label>
                                            <Input
                                                value={cardNumber}
                                                onChange={(e) => handleCardNumberChange(e.target.value)}
                                                placeholder="4242 4242 4242 4242"
                                                inputMode="numeric"
                                                maxLength={19}
                                            />
                                            <p className="text-xs text-gray-500">
                                                Detected card type: {detectedCardBrand}
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Expiry (MM/YY)
                                            </label>
                                            <Input
                                                value={cardExpiry}
                                                onChange={(e) => handleCardExpiryChange(e.target.value)}
                                                placeholder="12/26"
                                                maxLength={5}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    CVV
                                                </label>
                                                <Input
                                                    value={cardCvv}
                                                    onChange={(e) => handleCardCvvChange(e.target.value)}
                                                    placeholder="123"
                                                    inputMode="numeric"
                                                    maxLength={4}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Billing ZIP / Postal Code
                                                </label>
                                                <Input
                                                    value={cardBillingPostalCode}
                                                    onChange={(e) => setCardBillingPostalCode(e.target.value)}
                                                    placeholder="0002"
                                                />
                                            </div>
                                        </div>

                                        <Button onClick={handleSaveCard} disabled={loading} className="w-full">
                                            {loading ? "Saving..." : "Save Card"}
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};
