
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogIn } from "lucide-react";
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
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="rollNumber">Roll Number</Label>
          <Input
            id="rollNumber"
            placeholder="Enter your roll number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            className="w-full"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
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
