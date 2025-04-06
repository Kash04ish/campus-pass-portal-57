
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogIn, School } from "lucide-react";
import { motion } from "framer-motion";

const StudentLoginForm: React.FC = () => {
  const { studentLogin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [rollNumber, setRollNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rollNumber) {
      toast({
        title: "Roll Number Required",
        description: "Please enter your roll number",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const success = studentLogin(rollNumber);
      
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome back to Campus Pass!",
        });
        navigate("/student");
      } else {
        toast({
          title: "Login Failed",
          description: "Roll number not found. Please register first.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg border border-blue-100"
    >
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
          <School className="h-8 w-8 text-white" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
        Student Login
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="rollNumber" className="text-sm font-medium">
            Roll Number
          </Label>
          <Input
            id="rollNumber"
            placeholder="Enter your roll number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            className="w-full border-blue-200 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-300"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default StudentLoginForm;
