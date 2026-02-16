import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { db } from "@/config/firebaseConfig";
import { AppUser, FormState } from "@/types/user";
import { Country, ICountry, IState, State } from "country-state-city";
import { doc, setDoc } from "firebase/firestore";
import {
    CreditCard,
    LogOut,
    MapPin,
    Package,
    Settings,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ORDERS } from "../profile/page";
import { detectCardBrand } from "./profile/cardBrand";
import { OrdersTab } from "./profile/OrdersTab";
import { AddressTab } from "./profile/AddressTab";
import { PaymentTab } from "./profile/PaymentTab";

const DEFAULT_COUNTRY_CODE = "ZA";

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
                    {activeTab === "orders" && <OrdersTab orders={ORDERS} />}

                    {activeTab === "addresses" && (
                        <AddressTab
                            savedAddress={savedAddress}
                            onOpenAddressForm={handleOpenAddressForm}
                            onRemoveAddress={handleRemoveAddress}
                            isAddressFormOpen={isAddressFormOpen}
                            loading={loading}
                            form={form}
                            countryOptions={countryOptions}
                            stateOptions={stateOptions}
                            handleCountrySelect={handleCountrySelect}
                            handleProvinceSelect={handleProvinceSelect}
                            handleChange={handleChange}
                            handleSaveAddress={handleSaveAddress}
                            states={states}
                        />
                    )}

                    {activeTab === "payment" && (
                        <PaymentTab
                            savedPaymentMethods={savedPaymentMethods}
                            isPaymentFormOpen={isPaymentFormOpen}
                            setIsPaymentFormOpen={setIsPaymentFormOpen}
                            cardHolderName={cardHolderName}
                            setCardHolderName={setCardHolderName}
                            cardNumber={cardNumber}
                            handleCardNumberChange={handleCardNumberChange}
                            detectedCardBrand={detectedCardBrand}
                            cardExpiry={cardExpiry}
                            handleCardExpiryChange={handleCardExpiryChange}
                            cardCvv={cardCvv}
                            handleCardCvvChange={handleCardCvvChange}
                            cardBillingPostalCode={cardBillingPostalCode}
                            setCardBillingPostalCode={setCardBillingPostalCode}
                            handleSaveCard={handleSaveCard}
                            handleRemoveCard={handleRemoveCard}
                            loading={loading}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
