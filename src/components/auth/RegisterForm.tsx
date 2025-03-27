import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { saveStudent } from "../../utils/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Camera, User } from "lucide-react";

const RegisterForm: React.FC = () => {
  const { registerUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    roomNumber: "",
    hostelName: "",
    contactNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      
      await new Promise(resolve => {
        video.onloadedmetadata = resolve;
      });
      
      video.play();
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setPhotoPreview(dataUrl);
      }
      
      stream.getTracks().forEach(track => track.stop());
      
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Access Error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!photoPreview) {
      toast({
        title: "Photo Required",
        description: "Please upload or capture your photo",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    const { name, rollNumber, roomNumber, hostelName, contactNumber } = formData;
    if (!name || !rollNumber || !roomNumber || !hostelName || !contactNumber) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    
    try {
      const studentData = {
        ...formData,
        id: Date.now().toString(),
        photoUrl: photoPreview,
      };
      
      saveStudent(studentData);
      
      registerUser({
        ...studentData,
        photoUrl: photoPreview,
      });
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully!",
      });
      
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "There was a problem with your registration. Please try again.",
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
      className="w-full max-w-md mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Student Registration</h2>
          <p className="text-muted-foreground text-sm">
            Register your account to request campus passes
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rollNumber">Roll Number</Label>
            <Input
              id="rollNumber"
              name="rollNumber"
              placeholder="Enter your roll number"
              value={formData.rollNumber}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roomNumber">Room Number</Label>
              <Input
                id="roomNumber"
                name="roomNumber"
                placeholder="Room number"
                value={formData.roomNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hostelName">Hostel Name</Label>
              <Input
                id="hostelName"
                name="hostelName"
                placeholder="Hostel name"
                value={formData.hostelName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              name="contactNumber"
              type="tel"
              placeholder="Your contact number"
              value={formData.contactNumber}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Photo</Label>
            <div className="flex flex-col items-center">
              {photoPreview ? (
                <div className="relative mb-4">
                  <motion.img
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    src={photoPreview}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover border-2 border-primary"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                    onClick={() => setPhotoPreview(null)}
                  >
                    ×
                  </Button>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mb-4">
                  <User className="h-12 w-12 text-muted-foreground" />
                </div>
              )}

              <div className="flex space-x-2">
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    id="photo"
                    className="absolute inset-0 opacity-0 w-full cursor-pointer"
                    onChange={handlePhotoUpload}
                  />
                  <Button type="button" variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCapture}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Capture
                </Button>
              </div>
            </div>
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
              Registering...
            </>
          ) : (
            "Register"
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default RegisterForm;
