
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { ArrowRight, UserCheck, QrCode, ShieldCheck } from "lucide-react";

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  // Determine where to direct the user based on their role
  const getStartedLink = isAuthenticated
    ? user?.role === "admin"
      ? "/admin"
      : "/student"
    : "/register";

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary mb-6">
            <span className="mr-1">✨</span> Campus Pass Management System
          </div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-none"
          >
            Streamlined Campus Pass Management
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            A secure and efficient system to manage campus exit passes for students with digital
            approval workflows and QR code-based verification.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link to={getStartedLink}>
              <Button size="lg" className="gap-2">
                {isAuthenticated ? "Go to Dashboard" : "Register Now"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            
            {!isAuthenticated && (
              <Link to="/admin">
                <Button variant="outline" size="lg">
                  Admin Portal
                </Button>
              </Link>
            )}
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mt-8"
        >
          <div className="flex flex-col items-center p-6 rounded-lg glass card-hover">
            <div className="p-3 rounded-full bg-blue-50 mb-4">
              <UserCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Easy Registration</h3>
            <p className="text-center text-muted-foreground text-sm">
              Quick and simple registration process for students with essential details.
            </p>
          </div>
          
          <div className="flex flex-col items-center p-6 rounded-lg glass card-hover">
            <div className="p-3 rounded-full bg-blue-50 mb-4">
              <QrCode className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Digital Passes</h3>
            <p className="text-center text-muted-foreground text-sm">
              Receive QR code-based digital passes after admin approval for campus exit.
            </p>
          </div>
          
          <div className="flex flex-col items-center p-6 rounded-lg glass card-hover">
            <div className="p-3 rounded-full bg-blue-50 mb-4">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Secure Management</h3>
            <p className="text-center text-muted-foreground text-sm">
              Administrators can review, approve or reject pass requests with full student details.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
