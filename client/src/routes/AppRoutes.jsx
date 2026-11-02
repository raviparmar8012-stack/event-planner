import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Booking from "../pages/Booking";
import Packages from "../pages/Packages";
import Vendor from "../pages/Vendor";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VendorDetails from "../pages/VendorDetails.jsx";
import PackageDetails from "../pages/PackageDetails.jsx";
import MyBookings from "../pages/MyBookings";
import VendorRegister from "../pages/VendorRegister";
import AdminDashboard from "../pages/AdminDashboard";
import VendorManagement from "../pages/admin/VendorManagement";
import CustomerManagement from "../pages/admin/CustomerManagement";
import BookingManagement from "../pages/admin/BookingManagement";
import {Routes,Route}from "react-router-dom";
import Venues from "../pages/Venues";
import VenueDetails from "../pages/VenueDetails";
import BookingSummary from "../pages/BookingSummary";
import Financials from "../pages/admin/Financials";
import VendorPayouts from "../pages/admin/VendorPayouts";
import Refunds from "../pages/admin/Refunds";
import Ledger from "../pages/admin/Ledger";
import SystemLogs from "../pages/admin/SystemLogs";
import VendorDashboard from "../pages/VendorDashboard";
import ForgotPassword from "../pages/ForgotPassword.jsx";

function AppRoutes() {
    return (

        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/about" element={<About />}/>
            <Route path="/contact" element={<Contact />}/>
            <Route path="/booking" element={<Booking />}/>
            <Route path="/packages" element={<Packages />}/>
            <Route path ="/vendor" element={<Vendor />}/>
            <Route path="/vendors/:id" element={<VendorDetails />} />
            <Route path ="/login" element={<Login />}/>
            <Route path ="/register" element={<Register />}/>
            <Route path="/vendor/register" element={<VendorRegister />}/>
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/packages/:id" element={<PackageDetails />}/>
            <Route path="/admin/dashboard" element={<AdminDashboard />}/>
            <Route path="/admin/vendors" element={<VendorManagement />}/>
            <Route path="/admin/customers" element={<CustomerManagement />}/>
            <Route path="/admin/bookings" element={<BookingManagement />}/>
            <Route path="/venues" element={<Venues />} />
            <Route path="/venues/:id" element={<VenueDetails />} />
            <Route path="/booking-summary/:id" element={<BookingSummary />}/>
            <Route path="/admin/financials" element={<Financials />} />
            <Route path="/admin/payouts" element={<VendorPayouts />} />
            <Route path="/admin/refunds" element={<Refunds />} />
            <Route path="/admin/ledger" element={<Ledger />} />
            <Route path="/admin/logs" element={<SystemLogs />} />
            <Route path="/vendor/dashboard" element={<VendorDashboard />}/>
                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />



        </Routes>

    );
}
export default AppRoutes;