
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PageTransition from "../components/ui/PageTransition";
import PassRequestList from "../components/admin/PassRequestList";
import AdminLoginForm from "../components/admin/AdminLoginForm";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { QrCode, User, ShieldCheck } from "lucide-react";

const Admin = () => {
  const { isAuthenticated, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showLoginForm, setShowLoginForm] = useState(false);

  useEffect(() => {
    // If authenticated but not admin, redirect to login
    if (isAuthenticated && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You must be logged in as an administrator to access this page.",
        variant: "destructive",
      });
      navigate("/register", { replace: true });
    }
    
    // If not authenticated, show login form
    if (!isAuthenticated) {
      setShowLoginForm(true);
    } else {
      setShowLoginForm(false);
    }
  }, [isAuthenticated, isAdmin, navigate, toast]);

  // Show login form if not authenticated
  if (showLoginForm) {
    return (
      <PageTransition>
        <div className="container max-w-md mx-auto px-4 py-12">
          <AdminLoginForm />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary mb-2">
              <ShieldCheck className="h-3 w-3 mr-1" /> Administrator Access
            </span>
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Portal
            </h1>
            <p className="text-muted-foreground">
              Manage and approve student pass requests
            </p>
          </motion.div>
          
          {user && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 bg-muted/40 rounded-lg px-4 py-2 border border-muted"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">Administrator</div>
              </div>
            </motion.div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-lg p-6 card-hover"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <QrCode className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Pass Management</h3>
                <p className="text-sm text-muted-foreground">Review and manage student passes</p>
              </div>
            </div>
            <p className="text-sm border-t pt-4">
              Approve or reject student pass requests based on their details and purpose.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-lg p-6 card-hover"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Student Verification</h3>
                <p className="text-sm text-muted-foreground">Verify student information</p>
              </div>
            </div>
            <p className="text-sm border-t pt-4">
              View complete student profiles including contact information and photos.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-lg p-6 card-hover"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Security Management</h3>
                <p className="text-sm text-muted-foreground">Ensure campus security</p>
              </div>
            </div>
            <p className="text-sm border-t pt-4">
              Maintain secure and controlled access to campus exit permissions.
            </p>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <PassRequestList />
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Admin;
