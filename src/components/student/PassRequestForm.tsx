
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { savePassRequest } from "../../utils/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Calendar, Clock } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const PassRequestForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    leavingTime: "",
    returningTime: "",
    purpose: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to request a pass",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Validate the times
      const leaving = new Date(formData.leavingTime);
      const returning = new Date(formData.returningTime);
      
      if (isNaN(leaving.getTime()) || isNaN(returning.getTime())) {
        throw new Error("Invalid date or time format");
      }
      
      if (leaving >= returning) {
        throw new Error("Leaving time must be before returning time");
      }
      
      // Check if returning time is within permitted range (e.g., same day or next day)
      const maxReturnTime = new Date(leaving);
      maxReturnTime.setDate(maxReturnTime.getDate() + 1); // Allow up to next day
      
      if (returning > maxReturnTime) {
        throw new Error("Returning time cannot be more than 24 hours after leaving");
      }
      
      // Create and save the pass request
      const passRequest = savePassRequest({
        studentId: user.id,
        rollNumber: user.rollNumber,
        leavingTime: formData.leavingTime,
        returningTime: formData.returningTime,
        purpose: formData.purpose,
        status: "pending",
      });
      
      toast({
        title: "Pass Request Submitted",
        description: "Your pass request has been submitted successfully and is pending approval.",
      });
      
      // Reset form
      setFormData({
        leavingTime: "",
        returningTime: "",
        purpose: "",
      });
      
    } catch (error) {
      console.error("Pass request error:", error);
      toast({
        title: "Request Failed",
        description: error instanceof Error ? error.message : "Failed to submit pass request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper to get min datetime (current time)
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const minDateTime = getCurrentDateTime();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Request Campus Pass</h2>
          <p className="text-muted-foreground text-sm">
            Fill in the details to request a campus pass
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rollNumber">Roll Number</Label>
            <Input
              id="rollNumber"
              value={user?.rollNumber || ""}
              disabled
              className="w-full bg-muted/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="leavingTime">Leaving Time</Label>
            <div className="relative">
              <Input
                id="leavingTime"
                name="leavingTime"
                type="datetime-local"
                min={minDateTime}
                value={formData.leavingTime}
                onChange={handleChange}
                required
                className="w-full pl-10"
              />
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="returningTime">Returning Time</Label>
            <div className="relative">
              <Input
                id="returningTime"
                name="returningTime"
                type="datetime-local"
                min={formData.leavingTime || minDateTime}
                value={formData.returningTime}
                onChange={handleChange}
                required
                className="w-full pl-10"
              />
              <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose of Leave</Label>
            <Textarea
              id="purpose"
              name="purpose"
              placeholder="Briefly describe your purpose for leaving campus"
              value={formData.purpose}
              onChange={handleChange}
              required
              className="min-h-[100px]"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Pass Request"
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default PassRequestForm;
