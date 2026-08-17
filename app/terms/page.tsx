'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Home/Navbar';
import { Footer } from '@/components/Home/Footer';
import {
    FileText,
    UserCheck,
    ShoppingBag,
    CreditCard,
    Truck,
    RotateCcw,
    Award,
    Percent,
    AlertTriangle,
    Scale,
    HelpCircle,
    ArrowLeft,
    ChevronRight,
    Mail,
    Phone
} from 'lucide-react';

const SECTIONS = [
    { id: 'acceptance', title: '1. Acceptance & Eligibility', icon: FileText },
    { id: 'chefu-account', title: '2. CheFu Account & Security', icon: UserCheck },
    { id: 'products-pricing', title: '3. Products, Drops & Pricing', icon: ShoppingBag },
    { id: 'orders-payments', title: '4. Orders & Payment Terms', icon: CreditCard },
    { id: 'shipping-delivery', title: '5. Shipping & Courier Delivery', icon: Truck },
    { id: 'returns-refunds', title: '6. Returns, Exchanges & Refunds', icon: RotateCcw },
    { id: 'promotions-discounts', title: '7. Promotions & Promo Codes', icon: Percent },
    { id: 'intellectual-property', title: '8. Intellectual Property & Brand', icon: Award },
    { id: 'prohibited-conduct', title: '9. Prohibited Conduct & Usage', icon: AlertTriangle },
    { id: 'limitation-liability', title: '10. Disclaimers & Liability', icon: Scale },
    { id: 'governing-law', title: '11. Governing Law & Jurisdiction', icon: Scale },
    { id: 'contact-legal', title: '12. Legal Inquiries & Contact', icon: HelpCircle },
];

export default function TermsOfServicePage() {
    const [activeSection, setActiveSection] = useState('acceptance');

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -120;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-300 selection:text-slate-950">
            <Navbar />

            <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-8">
                    <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                        <ArrowLeft size={14} /> Back to Home
                    </Link>
                    <ChevronRight size={12} />
                    <span className="text-amber-300 font-medium">Terms of Service</span>
                </div>

                {/* Hero Header */}
                <header className="relative rounded-3xl border border-white/10 bg-slate-900/60 p-8 sm:p-12 mb-12 overflow-hidden shadow-2xl backdrop-blur-xl">
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
                            <Scale size={14} />
                            <span>Legal Agreement</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                            Terms of Service
                        </h1>
                        <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
                            Welcome to Drippy Banks. These Terms of Service govern your access to our streetwear platform, product purchases, promotional drops, and associated CheFu account features.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-4 text-xs sm:text-sm text-slate-400">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                                <span>Effective Date: August 2026</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                                <span>Operated by CHEFU TECHNOLOGIES PTY (LTD)</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Navigation Sidebar (Desktop Sticky) */}
                    <aside className="lg:col-span-4">
                        <div className="sticky top-28 rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-4 px-2">
                                Table of Contents
                            </h2>
                            <nav className="space-y-1">
                                {SECTIONS.map((section) => {
                                    const Icon = section.icon;
                                    const isActive = activeSection === section.id;
                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => scrollToSection(section.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm font-medium transition-all ${isActive
                                                    ? 'bg-amber-300 text-slate-950 font-bold shadow-md shadow-amber-300/20'
                                                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            <Icon size={16} className={isActive ? 'text-slate-950' : 'text-amber-300'} />
                                            <span className="truncate">{section.title}</span>
                                        </button>
                                    );
                                })}
                            </nav>

                            <div className="mt-6 pt-6 border-t border-white/10 text-xs text-slate-400 space-y-2">
                                <p className="font-semibold text-slate-200">Questions about our terms?</p>
                                <p>Contact our customer support desk:</p>
                                <a
                                    href="mailto:support@chefuinc.com"
                                    className="inline-block text-amber-300 hover:underline font-mono"
                                >
                                    support@chefuinc.com
                                </a>
                            </div>
                        </div>
                    </aside>

                    {/* Legal Clauses Body */}
                    <article className="lg:col-span-8 space-y-12 text-slate-300 text-sm sm:text-base leading-relaxed">
                        {/* Section 1 */}
                        <section id="acceptance" className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <FileText className="text-amber-300" size={24} />
                                <h2 className="text-xl sm:text-2xl font-bold text-white">1. Acceptance & Eligibility</h2>
                            </div>
                            <p>
                                These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User&quot; or &quot;Customer&quot;) and <strong className="text-white">CHEFU TECHNOLOGIES PTY (LTD)</strong> trading as <strong className="text-amber-300">Drippy Banks</strong>.
                            </p>
                            <p>
                                By accessing, browsing, registering an account, or placing an order on <strong className="text-white">drippybanks.chefuinc.com</strong>, you certify that you are at least 18 years of age (or accessing under the supervision of a parent or legal guardian) and possess the legal capacity to enter into binding contracts.
                            </p>
                            <p>
                                If you do not agree to these Terms in full, you must discontinue your use of our platform immediately.
                            </p>
                        </section>

                        {/* Section 2 */}
                        <section id="chefu-account" className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <UserCheck className="text-amber-300" size={24} />
                                <h2 className="text-xl sm:text-2xl font-bold text-white">2. CheFu Account & Security</h2>
                            </div>
                            <p>
                                Drippy Banks utilizes the unified <strong className="text-white">CheFu Account Single Sign-On (SSO)</strong> system. When creating or accessing your profile:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-300">
                                <li>You agree to provide true, accurate, current, and complete information during signup.</li>
                                <li>You are solely responsible for maintaining the confidentiality of your CheFu credentials and passwords.</li>
                                <li>You accept full responsibility for all activities, purchases, and interactions that occur under your account.</li>
                                <li>You must immediately notify us at <a href="mailto:support@chefuinc.com" className="text-amber-300 hover:underline">support@chefuinc.com</a> if you suspect any unauthorized access or breach of security.</li>
                            </ul>
                        </section>

                        {/* Section 3 */}
                        <section id="products-pricing" className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="text-amber-300" size={24} />
                                <h2 className="text-xl sm:text-2xl font-bold text-white">3. Products, Drops & Pricing</h2>
                            </div>
                            <p>
                                Drippy Banks produces limited-run streetwear, caps, hoodies, tees, and accessories. Due to the exclusive nature of our drops:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-300">
                                <li>
                                    <strong className="text-white">Availability:</strong> All items are subject to stock availability. Adding an item to your cart or wishlist does not reserve the stock until payment is confirmed.
                                </li>
                                <li>
                                    <strong className="text-white">Pricing Currency:</strong> All prices on the store are listed in South African Rand (ZAR / R) and are inclusive of applicable Value Added Tax (VAT), unless explicitly stated otherwise.
                                </li>
                                <li>
                                    <strong className="text-white">Pricing Corrections:</strong> While we take reasonable care to ensure accuracy, typographical errors in pricing or descriptions may occur. In the event an item is mispriced, we reserve the right to cancel the order prior to dispatch and issue a full refund.
                                </li>
                                <li>
                                    <strong className="text-white">Visual Representation:</strong> We make every effort to display garment colors and textures accurately; however, display calibration varies across screens and devices.
                                </li>
                            </ul>
                        </section>

                        {/* Section 4 */}
                        <section id="orders-payments" className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <CreditCard className="text-amber-300" size={24} />
                                <h2 className="text-xl sm:text-2xl font-bold text-white">4. Orders & Payment Terms</h2>
                            </div>
                            <p>
                                When placing an order, your submission constitutes an offer to purchase. An order is deemed accepted once payment has been cleared through our gateway and a confirmation email with an order reference number is dispatched.
                            </p>
                            <p>
                                We accept approved payment methods including Debit/Credit Cards (Visa, Mastercard) and instant EFT solutions. We reserve the right to decline or cancel orders suspected of fraudulent activity, automated bot purchases, or unauthorized card usage.
                            </p>
                        </section>

                        {/* Section 5 */}
                        <section id="shipping-delivery" className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <Truck className="text-amber-300" size={24} />
                                <h2 className="text-xl sm:text-2xl font-bold text-white">5. Shipping & Courier Delivery</h2>
                            </div>
                            <p>
                                Orders are processed and dispatched via reputable courier partners across South Africa and selected international destinations.
                            </p>
                            <div className="space-y-3 pt-2">
                                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5">
                                    <h3 className="font-semibold text-white mb-1">Estimated Delivery Times</h3>
                                    <p className="text-xs text-slate-400">
                                        Major Metro Centers (Gauteng, Cape Town, Durban): 2 to 4 business days. Regional & Outlying Areas: 3 to 7 business days. Drops and pre-orders may carry specific lead times noted on the product page.
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5">
                                    <h3 className="font-semibold text-white mb-1">Delivery Address & Risk</h3>
                                    <p className="text-xs text-slate-400">
                                        The customer is responsible for providing accurate delivery details. Risk of loss passes to the customer once the courier records successful delivery at the designated address.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 6 */}
                        <section id="returns-refunds" className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <RotateCcw className="text-amber-300" size={24} />
                                <h2 className="text-xl sm:text-2xl font-bold text-white">6. Returns, Exchanges & Refunds</h2>
                            </div>
                            <p>
                                We want you to be completely satisfied with your Drippy Banks pieces. Our return and exchange conditions are as follows:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-300">
                                <li>
                                    <strong className="text-white">14-Day Return Window:</strong> You may log a return or exchange request within 14 calendar days from the date of delivery.
                                </li>
                                <li>
                                    <strong className="text-white">Condition Requirements:</strong> Garments must be unwashed, unworn, undamaged, free of scent/makeup marks, with all original tags, labels, and packaging intact.
                                </li>
                                <li>
                                    <strong className="text-white">Non-Returnable Items:</strong> For hygiene reasons, undergarments, face masks, and custom-personalized drop pieces cannot be returned unless defective.
                                </li>
                                <li>
                                    <strong className="text-white">Refund Processing:</strong> Approved refunds are credited back to the original payment method within 5 to 10 business days following warehouse inspection.
                                </li>
                            </ul>
                        </section>

                        {/* Section 7 */}
                        <section id="promotions-discounts" className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <Percent className="text-amber-300" size={24} />
                                <h2 className="text-xl sm:text-2xl font-bold text-white">7. Promotions & Promo Codes</h2>
                            </div>
                            <p>
                                From time to time, Drippy Banks issues promotional discount codes (such as our 10% welcome or WhatsApp share promotions).
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-300">
                                <li>Promo codes are valid for a limited period and cannot be combined unless specified.</li>
                                <li>Codes cannot be redeemed for cash or applied retroactively to completed orders.</li>
                                <li>We reserve the right to modify or terminate promotional campaigns at our sole discretion.</li>
                            </ul>
                        </section>

                        {/* Section 8 */}
                        <section id="intellectual-property" className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <Award className="text-amber-300" size={24} />
                                <h2 className="text-xl sm:text-2xl font-bold text-white">8. Intellectual Property & Brand</h2>
                            </div>
                            <p>
                                All content on this platform—including brand names, logos, graphic designs, garment silhouettes, typography, product photography, software code, and UI elements—is the exclusive intellectual property of <strong className="text-white">CHEFU TECHNOLOGIES PTY (LTD)</strong> and Drippy Banks.
                            </p>
                            <p>
                                You may not reproduce, duplicate, copy, sell, reverse engineer, or exploit any portion of the service or content without express prior written consent.
                            </p>
                        </section>

                        {/* Section 9 */}
                        <section id="prohibited-conduct" className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="text-amber-300" size={24} />
                                <h2 className="text-xl sm:text-2xl font-bold text-white">9. Prohibited Conduct & Usage</h2>
                            </div>
                            <p>Users agree NOT to engage in any of the following prohibited behaviors:</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-300">
                                <li>Using automated scripts, bots, scrapers, or exploits to scalp stock or manipulate checkout.</li>
                                <li>Attempting to interfere with, compromise, or bypass platform security or server performance.</li>
                                <li>Impersonating another individual or submitting false identity/payment information.</li>
                                <li>Engaging in harassment, defamation, or abuse toward Drippy Banks staff, couriers, or community members.</li>
                            </ul>
                        </section>

                        {/* Section 10 */}
                        <section id="limitation-liability" className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <Scale className="text-amber-300" size={24} />
                                <h2 className="text-xl sm:text-2xl font-bold text-white">10. Disclaimers & Limitation of Liability</h2>
                            </div>
                            <p>
                                To the maximum extent permitted under South African law (including the Consumer Protection Act 68 of 2008), the Drippy Banks platform and all merchandise are provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind.
                            </p>
                            <p>
                                In no event shall CHEFU TECHNOLOGIES PTY (LTD), its directors, officers, employees, or partners be liable for any indirect, punitive, incidental, or consequential damages arising out of your use of the website or purchased products. Our total liability for any claim shall not exceed the actual amount paid by you for the specific purchase in dispute.
                            </p>
                        </section>

                        {/* Section 11 */}
                        <section id="governing-law" className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <Scale className="text-amber-300" size={24} />
                                <h2 className="text-xl sm:text-2xl font-bold text-white">11. Governing Law & Jurisdiction</h2>
                            </div>
                            <p>
                                These Terms shall be governed by, construed, and enforced in accordance with the laws of the <strong className="text-white">Republic of South Africa</strong>.
                            </p>
                            <p>
                                Any dispute arising from these Terms or transactions on Drippy Banks shall be submitted to the non-exclusive jurisdiction of the High Court of South Africa (Gauteng Division, Johannesburg).
                            </p>
                        </section>

                        {/* Section 12 */}
                        <section id="contact-legal" className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <HelpCircle className="text-amber-300" size={24} />
                                <h2 className="text-xl sm:text-2xl font-bold text-white">12. Legal Inquiries & Contact</h2>
                            </div>
                            <p>
                                For questions regarding these Terms of Service, order resolutions, or official legal notices, please reach out to our team:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex items-start gap-3">
                                    <Mail className="text-amber-300 mt-1 shrink-0" size={18} />
                                    <div>
                                        <h4 className="font-semibold text-white text-sm">Customer & Order Support</h4>
                                        <a href="mailto:support@chefuinc.com" className="text-xs text-amber-300 hover:underline">
                                            support@chefuinc.com
                                        </a>
                                        <p className="text-xs text-slate-400 mt-1">Legal: legal@chefuinc.com</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex items-start gap-3">
                                    <Phone className="text-amber-300 mt-1 shrink-0" size={18} />
                                    <div>
                                        <h4 className="font-semibold text-white text-sm">Customer Care Line</h4>
                                        <a
                                            href="https://wa.me/27769349851"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-amber-300 hover:underline"
                                        >
                                            +27 76 934 9851
                                        </a>
                                        <p className="text-xs text-slate-400 mt-1">Mon - Fri: 09:00 - 17:00 SAST</p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-white/5 text-xs text-slate-400">
                                <p className="font-medium text-slate-300">CHEFU TECHNOLOGIES PTY (LTD)</p>
                                <p>Johannesburg, South Africa &middot; https://chefuinc.com</p>
                            </div>
                        </section>
                    </article>
                </div>
            </main>

            <Footer />
        </div>
    );
}
