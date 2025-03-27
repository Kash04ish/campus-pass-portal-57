
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import RegisterForm from "../components/auth/RegisterForm";
import { getStudentByRollNumber } from "../utils/storage";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { UserCog } from "lucide-react";

const Register = () => {
  const { isAuthenticated, user, login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  // Process admin login from query parameter
  useEffect(() => {
    // If already authenticated, redirect to the appropriate portal
    if (isAuthenticated) {
      const destination = user?.role === "admin" ? "/admin" : "/student";
      navigate(destination, { replace: true });
    }
    
    // Check for auto-login as admin (for demo purposes)
    if (searchParams.get("admin") !== null) {
      login({
        id: "admin",
        name: "Administrator",
        rollNumber: "ADMIN001",
        roomNumber: "Admin Office",
        hostelName: "Administration Building",
        contactNumber: "123-456-7890",
        photoUrl: "",
        role: "admin",
      });
      
      toast({
        title: "Admin Login",
        description: "You've been logged in as an administrator.",
      });
      
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, user, navigate, login, toast, searchParams]);

  const handleAdminLogin = () => {
    login({
      id: "admin",
      name: "Administrator",
      rollNumber: "ADMIN001",
      roomNumber: "Admin Office",
      hostelName: "Administration Building",
      contactNumber: "123-456-7890",
      photoUrl: "",
      role: "admin",
    });
    
    toast({
      title: "Admin Login",
      description: "You've been logged in as an administrator.",
    });
    
    navigate("/admin", { replace: true });
  };

  const handleCheckStudent = (rollNumber: string) => {
    const existingStudent = getStudentByRollNumber(rollNumber);
    if (existingStudent) {
      login({
        ...existingStudent,
        role: "student",
      });
      
      toast({
        title: "Welcome Back!",
        description: "You've been logged in with your existing account.",
      });
      
      navigate("/student", { replace: true });
      return true;
    }
    return false;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container max-w-6xl mx-auto px-4 py-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Register for Campus Pass
          </h1>
          <p className="text-muted-foreground text-lg">
            Create your account to request and manage campus exit passes. Your details will be used for verification purposes.
          </p>
          
          <div className="bg-muted/40 p-4 rounded-lg border border-muted">
            <h3 className="font-medium mb-2">Already Registered?</h3>
            <p className="text-sm text-muted-foreground mb-2">
              If you've registered before, simply enter your roll number and we'll find your account.
            </p>
            <div className="flex flex-col gap-3 mt-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleAdminLogin}
              >
                <UserCog size={16} />
                Demo Admin Login
              </Button>
              <div className="text-xs text-muted-foreground">
                Click above to access the admin portal with demo credentials
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-6 rounded-xl glass shadow-lg"
        >
          <RegisterForm />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Register;
