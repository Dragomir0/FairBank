import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import Personal from "./pages/Personal";
import Services from "./pages/Services";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import NoPage from "./pages/NoPage";
import FAQPage from "./pages/FAQPage";
import Politiques from "./pages/Politiques";
import DashboardLayout from "./pages/dashboard/DashboardLayout.tsx";
import DashboardOverview from "./pages/dashboard/DashboardOverview.tsx";
import DashboardTransactions from "./pages/transactions/DashboardTransactions.tsx";
import DashboardExchangeRates from "./pages/dashboard/DashboardExchangeRates.tsx";
import DashboardActivity from "./pages/dashboard/DashboardActivity.tsx";
import DashboardHelp from "./pages/dashboard/DashboardHelp.tsx";
import Settings from "./pages/dashboard/dashboard-settings/Settings.tsx";
import UserProfileSettings from "./pages/UserProfileSettings.tsx";
import { UserContextProvider } from "@/contexts/UserContext";
import { TransactionContextProvider } from "@/contexts/TransactionContext";
import PasswordReset from "./components/PasswordReset.tsx";
import PasswordResetRequest from "@/components/PasswordResetRequest.tsx";
import { ThemeProvider } from "@/provider/ThemeProvider.tsx";
import ProfileSettings from "./pages/dashboard/dashboard-settings/ProfileSettings.tsx";
import AccountSettings from "./pages/dashboard/dashboard-settings/AccountSettings.tsx";
import AppearanceSettings from "./pages/dashboard/dashboard-settings/AppearanceSettings.tsx";
import NotificationsSettings from "./pages/dashboard/dashboard-settings/NotificationsSettings.tsx";
import DisplaySettings from "./pages/dashboard/dashboard-settings/DisplaySettings.tsx";
export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          <Route
            path="/particuliers"
            element={
              <Layout>
                <Personal />
              </Layout>
            }
          />
          <Route
            path="/services"
            element={
              <Layout>
                <Services />
              </Layout>
            }
          />
          <Route
            path="/apropos"
            element={
              <Layout>
                <About />
              </Layout>
            }
          />
          <Route path="/connexion" element={<SignIn />} />
          <Route path="/inscription" element={<SignUp />} />
          <Route
            path="/faq"
            element={
              <Layout>
                <FAQPage />
              </Layout>
            }
          />
          <Route
            path="/politiques"
            element={
              <Layout>
                <Politiques />
              </Layout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <DashboardLayout>
                <DashboardOverview />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/transactions"
            element={
              <DashboardLayout>
                <TransactionContextProvider>
                  <DashboardTransactions />
                </TransactionContextProvider>
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/activity"
            element={
              <DashboardLayout>
                <DashboardActivity />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/exchange-rates"
            element={
              <DashboardLayout>
                <DashboardExchangeRates />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/help"
            element={
              <DashboardLayout>
                <DashboardHelp />
              </DashboardLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <UserContextProvider>
                <Settings>
                  <ProfileSettings />
                </Settings>
              </UserContextProvider>
            }
          />
          <Route
            path="/settings/account"
            element={
              <UserContextProvider>
                <Settings>
                  <AccountSettings />
                </Settings>
              </UserContextProvider>
            }
          />
          <Route
            path="/settings/themes"
            element={
              <UserContextProvider>
                <Settings>
                  <AppearanceSettings />
                </Settings>
              </UserContextProvider>
            }
          />
          <Route
            path="/settings/notifications"
            element={
              <UserContextProvider>
                <Settings>
                  <NotificationsSettings />
                </Settings>
              </UserContextProvider>
            }
          />
          <Route
            path="/settings/display"
            element={
              <UserContextProvider>
                <Settings>
                  <DisplaySettings />
                </Settings>
              </UserContextProvider>
            }
          />

          <Route
            path="/user/settings"
            element={
              <UserContextProvider>
                <UserProfileSettings />
              </UserContextProvider>
            }
          />
          <Route path="/password-reset/:token" element={<PasswordReset />} />
          <Route
            path="/request/password-reset/"
            element={<PasswordResetRequest />}
          />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
