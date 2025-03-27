import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User, Home, ShieldCheck } from "lucide-react";

const Navbar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const navLinks = [
    { path: "/", label: "Home", icon: <Home className="h-4 w-4 mr-2" /> },
    { path: "/student", label: "Student Portal", show: isAuthenticated && user?.role === "student" },
    { 
      path: "/admin", 
      label: "Admin Portal", 
      icon: <ShieldCheck className="h-4 w-4 mr-2" />,
      show: true  // Always show admin portal link
    },
    { path: "/register", label: "Register", show: !isAuthenticated },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full backdrop-blur-md bg-white/70 fixed top-0 left-0 right-0 z-50 shadow-sm"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-primary font-bold text-xl">Campus Pass</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navLinks
            .filter(link => link.show !== false)
            .map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-1 py-2 text-sm font-medium transition-colors 
                  ${location.pathname === link.path 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <span className="flex items-center">
                  {link.icon}
                  {link.label}
                </span>
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-primary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            ))}
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user?.name || "User"}</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={logout}
                className="text-muted-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <Link to="/register">
              <Button size="sm" variant="default">
                Get Started
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
