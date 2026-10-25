import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy, useEffect } from "react";
import { useLoadingStore } from "@/store/loading";
import { AppToaster } from "@/components/Toaster";
import { initNotifications } from "@/lib/notifications/client";
import CookieConsent from "@/components/CookieConsent";
import LoadingOverlay from "@/components/brand/LoadingOverlay";
import { AuthenticatedLayout } from "@/routes/customer-dashboard/_authenticated";
import { AdminLayout } from "@/routes/admin/route";

// Landing pages
import Home from "@/routes/_landing-page/index";
import RentReliefLanding from "@/routes/_landing-page/rent-relief";
import RentReceiptLanding from "@/routes/_landing-page/rent-receipt";
import TaxesLanding from "@/routes/_landing-page/taxes";
import EInvoicingLanding from "@/routes/_landing-page/e-invoicing";
import DocumentRenewalLanding from "@/routes/_landing-page/document-renewal";
import NewsPage from "@/routes/_landing-page/news";
import ContactPage from "@/routes/_landing-page/contact";
import TermsPage from "@/routes/_landing-page/legal.terms";
import PrivacyPage from "@/routes/_landing-page/legal.privacy";

// Customer auth
import LoginPage from "@/routes/customer-dashboard/login";
import SignupPage from "@/routes/customer-dashboard/signup";
import ForgotPasswordPage from "@/routes/customer-dashboard/forgot-password";
import ResetPasswordPage from "@/routes/customer-dashboard/reset-password";
import ResetPasswordSuccessPage from "@/routes/customer-dashboard/reset-password-success";
import VerifyEmailPage from "@/routes/customer-dashboard/verify-email";
import OnboardingPage from "@/routes/customer-dashboard/onboarding";
import SelectPlanPage from "@/routes/customer-dashboard/select-plan";

// Customer dashboard (authenticated)
import AuthenticatedIndex from "@/routes/customer-dashboard/_authenticated/index";
import ReceiptsPage from "@/routes/customer-dashboard/_authenticated/receipts";
import NewReceiptPage from "@/routes/customer-dashboard/_authenticated/receipt.new";
import ReceiptPreviewPage from "@/routes/customer-dashboard/_authenticated/receipt.preview";
import TaxesPage from "@/routes/customer-dashboard/_authenticated/taxes";
import TaxesPAYEPage from "@/routes/customer-dashboard/_authenticated/taxes/paye";
import TaxesVATPage from "@/routes/customer-dashboard/_authenticated/taxes/vat";
import TaxesWithholdingPage from "@/routes/customer-dashboard/_authenticated/taxes/withholding";
import TaxesHistoryPage from "@/routes/customer-dashboard/_authenticated/taxes/history";
import TaxesFilingPage from "@/routes/customer-dashboard/_authenticated/taxes/filing";
import TaxesDeadlinesPage from "@/routes/customer-dashboard/_authenticated/taxes/deadlines";
import TaxesCompliancePage from "@/routes/customer-dashboard/_authenticated/taxes/compliance";
import DocumentsIndexPage from "@/routes/customer-dashboard/_authenticated/documents/index";
import DocumentsNewPage from "@/routes/customer-dashboard/_authenticated/documents/new";
import DocumentsVINPage from "@/routes/customer-dashboard/_authenticated/documents/vin";
import DocumentsDriversLicensePage from "@/routes/customer-dashboard/_authenticated/documents/drivers-license";
import InvoicingCreatePage from "@/routes/customer-dashboard/_authenticated/invoicing/create";
import InvoicingManagePage from "@/routes/customer-dashboard/_authenticated/invoicing/manage";
import InvoicingPaymentsPage from "@/routes/customer-dashboard/_authenticated/invoicing/payments";
import InvoicingTemplatesPage from "@/routes/customer-dashboard/_authenticated/invoicing/templates";
import BatchPage from "@/routes/customer-dashboard/_authenticated/batch";
import ProfilePage from "@/routes/customer-dashboard/_authenticated/profile";
import SettingsPage from "@/routes/customer-dashboard/_authenticated/settings";
import SubscriptionPage from "@/routes/customer-dashboard/_authenticated/subscription";
import SupportPage from "@/routes/customer-dashboard/_authenticated/support";
import NotificationsPage from "@/routes/customer-dashboard/_authenticated/notifications";

// Admin pages
import AdminIndex from "@/routes/admin/index";
import AdminLoginPage from "@/routes/admin/login";
import AdminUsersPage from "@/routes/admin/users";
import AdminSubscriptionsPage from "@/routes/admin/subscriptions";
import AdminReceiptsPage from "@/routes/admin/receipts";
import AdminAnalyticsPage from "@/routes/admin/analytics";
import AdminAuditPage from "@/routes/admin/audit";
import AdminSettingsPage from "@/routes/admin/settings";

// Error pages
import ErrorPage500 from "@/routes/500";

const queryClient = new QueryClient();

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Error 404</p>
        <h1 className="mt-4 text-5xl font-black tracking-tight">Lost in transit</h1>
        <p className="mt-4 text-base text-muted-foreground font-medium">This page is not on file with the registry.</p>
        <a href="/" className="mt-8 inline-block text-sm font-black uppercase tracking-widest text-primary hover:opacity-80 transition-opacity">Return home →</a>
      </div>
    </div>
  );
}

function RootLayout() {
  const showLoader = useLoadingStore((s) => s.showLoader);
  const hideLoader = useLoadingStore((s) => s.hideLoader);

  useEffect(() => {
    showLoader("Initializing compliance portal...");
    const timer = setTimeout(() => hideLoader(), 400);
    initNotifications();
    return () => {
      clearTimeout(timer);
    };
  }, [showLoader, hideLoader]);

  return (
    <>
      <Routes>
        {/* Landing pages */}
        <Route path="/" element={<Home />} />
        <Route path="/rent-relief" element={<RentReliefLanding />} />
        <Route path="/rent-receipt" element={<RentReceiptLanding />} />
        <Route path="/taxes" element={<TaxesLanding />} />
        <Route path="/e-invoicing" element={<EInvoicingLanding />} />
        <Route path="/document-renewal" element={<DocumentRenewalLanding />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/legal/terms" element={<TermsPage />} />
        <Route path="/legal/privacy" element={<PrivacyPage />} />

        {/* Customer auth */}
        <Route path="/customer-dashboard/login" element={<LoginPage />} />
        <Route path="/customer-dashboard/signup" element={<SignupPage />} />
        <Route path="/customer-dashboard/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/customer-dashboard/reset-password" element={<ResetPasswordPage />} />
        <Route path="/customer-dashboard/reset-password-success" element={<ResetPasswordSuccessPage />} />
        <Route path="/customer-dashboard/verify-email" element={<VerifyEmailPage />} />
        <Route path="/customer-dashboard/onboarding" element={<OnboardingPage />} />
        <Route path="/customer-dashboard/select-plan" element={<SelectPlanPage />} />

        {/* Customer dashboard (authenticated) */}
        <Route path="/customer-dashboard" element={<AuthenticatedLayout />}>
          <Route index element={<AuthenticatedIndex />} />
          <Route path="receipts" element={<ReceiptsPage />} />
          <Route path="receipt/new" element={<NewReceiptPage />} />
          <Route path="receipt/preview" element={<ReceiptPreviewPage />} />
          <Route path="taxes" element={<TaxesPage />} />
          <Route path="taxes/paye" element={<TaxesPAYEPage />} />
          <Route path="taxes/vat" element={<TaxesVATPage />} />
          <Route path="taxes/withholding" element={<TaxesWithholdingPage />} />
          <Route path="taxes/history" element={<TaxesHistoryPage />} />
          <Route path="taxes/filing" element={<TaxesFilingPage />} />
          <Route path="taxes/deadlines" element={<TaxesDeadlinesPage />} />
          <Route path="taxes/compliance" element={<TaxesCompliancePage />} />
          <Route path="documents" element={<DocumentsIndexPage />} />
          <Route path="documents/new" element={<DocumentsNewPage />} />
          <Route path="documents/vin" element={<DocumentsVINPage />} />
          <Route path="documents/drivers-license" element={<DocumentsDriversLicensePage />} />
          <Route path="invoicing/create" element={<InvoicingCreatePage />} />
          <Route path="invoicing/manage" element={<InvoicingManagePage />} />
          <Route path="invoicing/payments" element={<InvoicingPaymentsPage />} />
          <Route path="invoicing/templates" element={<InvoicingTemplatesPage />} />
          <Route path="batch" element={<BatchPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="subscription" element={<SubscriptionPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminIndex />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
          <Route path="receipts" element={<AdminReceiptsPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="audit" element={<AdminAuditPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Error */}
        <Route path="/500" element={<ErrorPage500 />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <AppToaster />
      <CookieConsent />
      <LoadingOverlay />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <RootLayout />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
