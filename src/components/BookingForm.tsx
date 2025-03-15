import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Clock, User, Phone } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

const services = [
  { id: 1, name: "Classic Haircut", duration: "45 min", price: "$35" },
  { id: 2, name: "Beard Trim & Shaping", duration: "30 min", price: "$25" },
  { id: 3, name: "Premium Shave", duration: "45 min", price: "$45" },
  { id: 4, name: "Complete Grooming", duration: "90 min", price: "$85" },
];

const barbers = [
  { id: 1, name: "Alex Johnson" },
  { id: 2, name: "Michael Rodriguez" },
  { id: 3, name: "David Chen" },
];

const BookingForm = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!date || !selectedTime || !selectedService || !selectedBarber || 
        !formData.name || !formData.phone || !formData.email) {
      toast({
        title: "Missing information",
        description: "Please fill out all fields to book your appointment.",
        variant: "destructive",
      });
      return;
    }
    
    // Success message
    toast({
      title: "Appointment Booked!",
      description: `Your appointment is confirmed for ${format(date, "MMMM d, yyyy")} at ${selectedTime}`,
    });
    
    // Reset form
    setDate(undefined);
    setSelectedTime(null);
    setSelectedService(null);
    setSelectedBarber(null);
    setFormData({ name: "", phone: "", email: "" });
  };

  return (
    <section className="py-24 px-4" id="book-now">
      <div className="container mx-auto">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="text-xs uppercase tracking-widest mb-2 inline-block">
                Book Your Visit
              </span>
              <h2 className="heading-lg mb-4">Reserve Your Appointment</h2>
              <p className="text-muted-foreground mb-6">
                Schedule your next grooming session with our expert barbers. Choose your preferred date, time, and service for a personalized experience.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-2xl mb-6">
                <h3 className="text-lg font-medium mb-4">Why Book With Us?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-black"></div>
                    <span className="text-sm">Skilled professional barbers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-black"></div>
                    <span className="text-sm">Premium products and tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-black"></div>
                    <span className="text-sm">Comfortable, modern environment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-black"></div>
                    <span className="text-sm">Personalized attention to detail</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-6 border border-gray-200 rounded-2xl">
                <h3 className="text-lg font-medium mb-2">Need Assistance?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Contact us directly if you have special requests or need help with your booking.
                </p>
                <a href="tel:+1234567890" className="text-sm font-medium inline-flex items-center gap-1 hover:underline">
                  <Phone className="w-4 h-4" />
                  +1 (234) 567-890
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-sm p-6 lg:p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                      <div className="relative">
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your name"
                          className="pl-10"
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                      <div className="relative">
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                          className="pl-10"
                        />
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Select Service</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className={cn(
                          "border rounded-lg p-3 cursor-pointer transition-all duration-300",
                          selectedService === service.id 
                            ? "border-black bg-gray-50" 
                            : "border-gray-200 hover:border-gray-300"
                        )}
                        onClick={() => setSelectedService(service.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-sm">{service.name}</h4>
                            <span className="text-xs text-muted-foreground">{service.duration}</span>
                          </div>
                          <span className="text-sm font-medium">{service.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Select Barber</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {barbers.map((barber) => (
                      <div
                        key={barber.id}
                        className={cn(
                          "border rounded-lg p-3 cursor-pointer transition-all duration-300 text-center",
                          selectedBarber === barber.id 
                            ? "border-black bg-gray-50" 
                            : "border-gray-200 hover:border-gray-300"
                        )}
                        onClick={() => setSelectedBarber(barber.id)}
                      >
                        <h4 className="font-medium text-sm">{barber.name}</h4>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Select Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal border-gray-200",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => 
                            date < new Date() || 
                            date > new Date(new Date().setMonth(new Date().getMonth() + 2))
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Select Time</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal border-gray-200",
                            !selectedTime && "text-muted-foreground"
                          )}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {selectedTime || "Select time"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-3">
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.map((time) => (
                            <Button
                              key={time}
                              variant="outline"
                              className={cn(
                                "text-xs h-9",
                                selectedTime === time && "bg-black text-white hover:bg-black/90"
                              )}
                              onClick={() => {
                                setSelectedTime(time);
                                document.querySelector('[data-radix-popper-content-wrapper]')?.remove();
                              }}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <Button type="submit" className="w-full bg-black hover:bg-black/90">
                  Confirm Booking
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
