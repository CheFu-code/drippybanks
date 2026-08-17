'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Home/Navbar';
import { Footer } from '@/components/Home/Footer';
import {
    ShieldCheck,
    Lock,
    Eye,
    Database,
    Share2,
    UserCheck,
    Bell,
    HelpCircle,
    ArrowLeft,
    ChevronRight,
    Sparkles,
    Mail,
    Phone
} from 'lucide-react';

const SECTIONS = [
    { id: 'overview', title: '1. Overview & Scope', icon: Eye },
    { id: 'information-collected', title: '2. Information We Collect', icon: Database },
    { id: 'how-we-use-info', title: '3. How We Use Information', icon: Sparkles },
    { id: 'chefu-ecosystem', title: '4. CheFu Unified Account & Sharing', icon: Share2 },
    { id: 'payment-security', title: '5. Payment Processing & Security', icon: Lock },
    { id: 'cookies-tracking', title: '6. Cookies & Tracking Technologies', icon: Eye },
    { id: 'data-retention', title: '7. Data Retention & Protection', icon: ShieldCheck },
    { id: 'user-rights', title: '8. Your Rights (POPIA & GDPR)', icon: UserCheck },
    { id: 'marketing-communications', title: '9. Marketing & Communications', icon: Bell },
    { id: 'contact-us', title: '10. Contact & Information Officer', icon: HelpCircle },
];

export default function PrivacyPolicyPage() {
    const [activeSection, setActiveSection] = useState('overview');

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
                    <span className="text-amber-300 font-medium">Privacy Policy</span>
                </div>

                {/* Hero Header */}
                <header className="relative rounded-3xl border border-white/10 bg-slate-900/60 p-8 sm:p-12 mb-12 overflow-hidden shadow-2xl backdrop-blur-xl">
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
                            <ShieldCheck size={14} />
                            <span>Transparency & Trust</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                            Privacy Policy
                        </h1>
                        <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
                            At Drippy Banks, we value your trust and are committed to protecting your personal information. This Privacy Policy details how we collect, safeguard, and utilize data across our e-commerce platform and the CheFu ecosystem.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-4 text-xs sm:text-sm text-slate-400">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                                <span>Last Updated: August 2026</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-amber-400"></span>
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
                                <p className="font-semibold text-slate-200">Need immediate help with your data?</p>
                                <p>Email our Privacy Officer directly:</p>
                                <a
                                    href="mailto:legal@chefuinc.com"
                                    className="inline-block text-amber-300 hover:underline font-mono"
                                >
                                    legal@chefuinc.com
                                </a>
                            </div>
                        </div>
                    </aside>

                    {/* Legal Clauses Body */}
                    <article className="lg:col-span-8 space-y-12 text-slate-300 text-sm sm:text-base leading-relaxed">
                        {/* Section 1 */}
                        <section id="overview" className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <Eye className="text-amber-300" size={24} />
                                <h2 className="text-xl sm:text-2xl font-bold text-white">1. Overview & Scope</h2>
                            </div>
                            <p>
                                Drippy Banks (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is a premium streetwear brand and e-commerce platform operated by <strong className="text-white">CHEFU TECHNOLOGIES PTY (LTD)</strong>, registered in the Republic of South Africa.
                            </p>
                            <p>
                                This Privacy Policy applies to all personal information collected through our website (<strong className="text-amber-300">drippybanks.chefuinc.com</strong>), mobile experiences, marketing campaigns, and unified CheFu account services.
                            </p>
                            <p>
                                By accessing our services, creating an account, browsing our catalog, or purchasing apparel, you acknowledge that you have read and understood this Privacy Policy and consent to the data collection and usage practices described herein.
                            </p>
                        </section>

                        {/* Section 2 */}
                        <section id="information-collected" className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <Database className="text-amber-300" size={24} />
                                <h2 className="text-xl sm:text-2xl font-bold text-white">2. Information We Collect</h2>
                            </div>
                            <p>We collect information in several ways to provide seamless streetwear drops, checkout, and member services:</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-300">
                                <li>
                                    <strong className="text-white">Account Information:</strong> When you register via CheFu Single Sign-On (SSO) or create an account, we collect your name, email address, phone number, and avatar image.
                                </li>
                                <li>
                                    <strong className="text-white">Order & Delivery Details:</strong> Physical shipping address, recipient contact numbers, item sizes, color selections, and order history.
                                </li>
                                <li>
                                    <strong className="text-white">Billing Information:</strong> Payment method identifiers and transaction confirmation tokens provided by accredited payment gateways. We never store raw credit card numbers or CVV codes on our servers.
                                </li>
                                <li>
                                    <strong className="text-white">Device & Usage Data:</strong> IP address, browser type, operating system, pages viewed, time spent on items, referral sources, and wishlist activities.
                                </li>
                                <li>
                                    <strong className="text-white">Communication Records:</strong> Customer support messages, WhatsApp inquiries, newsletter feedback, and product reviews.
                                </li>
                            </ul>
                        </section>

                        {/* Section 3 */}
                        <section id="how-we-use-info" className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <Sparkles className="text-amber-300" size={24} />
                                <h2 className="text-xl sm:text-2xl font-bold text-white">3. How We Use Your Information</h2>
                            </div>
                            <p>Your information is processed for legitimate business and customer service purposes, including:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5">
                                    <h3 className="font-semibold text-white mb-1">Order Fulfillment</h3>
                                    <p className="text-xs text-slate-400">Processing payments, packaging garments, dispatching courier deliveries, and sending tracking notifications.</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5">
                                    <h3 className="font-semibold text-white mb-1">Account & Preferences</h3>
                                    <p className="text-xs text-slate-400">Maintaining your unified CheFu profile, wishlists, cart persistence, and personalized size recommendations.</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5">
                                    <h3 className="font-semibold text-white mb-1">Exclusive Drops & Alerts</h3>
                                    <p className="text-xs text-slate-400">Delivering newsletters, flash sale alerts, WhatsApp promo links, and VIP event invitations (with opt-out at any time).</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5">
                                    <h3 className="font-semibold text-white mb-1">Security & Fraud Prevention</h3>
                                    <p className="text-xs text-slate-400">Detecting malicious activities, preventing unauthorized access, and validating legitimate transactions.</p>
                                </div>
                            </div>
                        </section>

                        {/* Section 4 */}
                        <section id="chefu-ecosystem" className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <Share2 className="text-amber-300" size={24} />
                                <h2 className="text-xl sm:text-2xl font-bold text-white">4. CheFu Unified Account & Data Sharing</h2>
                            </div>
                            <p>
                                Drippy Banks is integrated into the <strong className="text-white">CheFu Ecosystem</strong>. When you log in with your CHEFU Account, authentication credentials and unified profile details are processed securely across CheFu Technologies services.
                            </p>
                            <p>We do NOT sell, rent, or trade your personal data to external advertisers. We only share information with trusted third parties strictly necessary for our operations:</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-300">
                                <li>
                                    <strong className="text-white">Logistics & Courier Partners:</strong> Delivery carriers receive your shipping address and contact phone number to deliver your parcel.
                                </li>
                                <li>
                                    <strong className="text-white">Payment Gateways:</strong> Secure processors that execute encrypted card and instant EFT transactions.
                                </li>
                                <li>
                                    <strong className="text-white">Hosting & Cloud Infrastructure:</strong> High-security database and server providers compliant with international data protection standards.
                                </li>
                            </ul>
                        </section>

                        {/* Section 5 */}
                        <section id="payment-security" className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <Lock className="text-amber-300" size={24} />
                                <h2 className="text-xl sm:text-2xl font-bold text-white">5. Payment Processing & Security</h2>
                            </div>
                            <p>
                                All monetary transactions are processed through encrypted, Level 1 PCI-DSS compliant payment gateways. All data transmissions between your browser and our servers are protected using Transport Layer Security (TLS 1.3 / SSL) 256-bit encryption.
                            </p>
                            <p>
                                We do not store sensitive credit or debit card numbers, CVC/CVV digits, or banking pins on our systems.
                            </p>
                        </section>

                        {/* Section 6 */}
                        <section id="cookies-tracking" className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <Eye className="text-amber-300" size={24} />
                                <h2 className="text-xl sm:text-2xl font-bold text-white">6. Cookies & Tracking Technologies</h2>
                            </div>
                            <p>
                                We use cookies and local storage tokens to recognize your device, remember items in your shopping bag, persist login states, and analyze user interaction patterns.
                            </p>
                            <p>
                                You can configure your browser to reject cookies or notify you when cookies are being set; however, disabling certain functional cookies may affect your ability to add items to cart or complete orders.
                            </p>
                        </section>

                        {/* Section 7 */}
                        <section id="data-retention" className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="text-amber-300" size={24} />
                                <h2 className="text-xl sm:text-2xl font-bold text-white">7. Data Retention & Protection</h2>
                            </div>
                            <p>
                                We retain personal information for as long as your CheFu account is active, or as required to fulfill purchases, comply with tax and statutory accounting obligations in South Africa, resolve disputes, and enforce our agreements.
                            </p>
                            <p>
                                We employ robust physical, administrative, and technological safeguards to shield your personal data against unauthorized disclosure, alteration, or destruction.
                            </p>
                        </section>

                        {/* Section 8 */}
                        <section id="user-rights" className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <UserCheck className="text-amber-300" size={24} />
                                <h2 className="text-xl sm:text-2xl font-bold text-white">8. Your Rights (POPIA & Global Standards)</h2>
                            </div>
                            <p>
                                Under the Protection of Personal Information Act (POPIA) of South Africa and applicable international regulations (such as GDPR), you have the right to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-300">
                                <li>Request access to the personal records we hold regarding your profile and order history.</li>
                                <li>Request the rectification or correction of inaccurate or outdated information.</li>
                                <li>Request the deletion or destruction of your personal data, subject to statutory retention limits.</li>
                                <li>Object to the processing of your data for direct marketing or withdraw consent at any time.</li>
                                <li>Lodge a complaint with the South African Information Regulator if you believe your data has been handled unlawfully.</li>
                            </ul>
                        </section>

                        {/* Section 9 */}
                        <section id="marketing-communications" className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <Bell className="text-amber-300" size={24} />
                                <h2 className="text-xl sm:text-2xl font-bold text-white">9. Marketing & Communications</h2>
                            </div>
                            <p>
                                You will only receive promotional emails, SMS, or WhatsApp drop alerts if you opted in during checkout, newsletter signup, or account registration. Every marketing email contains an unsubscribe link that immediately removes you from future promotional lists.
                            </p>
                        </section>

                        {/* Section 10 */}
                        <section id="contact-us" className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <HelpCircle className="text-amber-300" size={24} />
                                <h2 className="text-xl sm:text-2xl font-bold text-white">10. Contact & Information Officer</h2>
                            </div>
                            <p>
                                If you have questions regarding this Privacy Policy, your personal data, or wish to exercise your rights, please reach out to our team:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex items-start gap-3">
                                    <Mail className="text-amber-300 mt-1 shrink-0" size={18} />
                                    <div>
                                        <h4 className="font-semibold text-white text-sm">Legal & Privacy Inquiries</h4>
                                        <a href="mailto:legal@chefuinc.com" className="text-xs text-amber-300 hover:underline">
                                            legal@chefuinc.com
                                        </a>
                                        <p className="text-xs text-slate-400 mt-1">General: support@chefuinc.com</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex items-start gap-3">
                                    <Phone className="text-amber-300 mt-1 shrink-0" size={18} />
                                    <div>
                                        <h4 className="font-semibold text-white text-sm">WhatsApp Support</h4>
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
