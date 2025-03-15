
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import BarberProfile from "../components/BarberProfile";
import BookingForm from "../components/BookingForm";
import Footer from "../components/Footer";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  useEffect(() => {
    document.title = "BarberBliss | Premium Barbershop Experience";
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Services />
      <BarberProfile />
      <BookingForm />
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;
