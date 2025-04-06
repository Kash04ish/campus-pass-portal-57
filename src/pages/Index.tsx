
import React, { Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { ArrowRight, UserCheck, QrCode, ShieldCheck } from "lucide-react";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, useTexture } from '@react-three/drei';

const CampusModel = () => {
  // Simple building model
  return (
    <Float 
      speed={1.5} 
      rotationIntensity={0.2} 
      floatIntensity={0.5}
    >
      <group position={[0, -0.5, 0]}>
        {/* Main building */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[2, 1, 2]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
        
        {/* Roof */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <coneGeometry args={[1.5, 0.7, 4]} />
          <meshStandardMaterial color="#1d4ed8" />
        </mesh>
        
        {/* Entrance */}
        <mesh position={[0, 0.3, 1.01]} castShadow>
          <boxGeometry args={[0.5, 0.6, 0.05]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        
        {/* Windows */}
        <mesh position={[-0.5, 0.5, 1.01]} castShadow>
          <boxGeometry args={[0.3, 0.3, 0.05]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
        
        <mesh position={[0.5, 0.5, 1.01]} castShadow>
          <boxGeometry args={[0.3, 0.3, 0.05]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
        
        {/* Base/ground */}
        <mesh position={[0, -0.1, 0]} receiveShadow>
          <cylinderGeometry args={[2.5, 2.5, 0.2, 32]} />
          <meshStandardMaterial color="#4ade80" />
        </mesh>
      </group>
    </Float>
  );
};

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  // Determine where to direct the user based on their role
  const getStartedLink = isAuthenticated
    ? user?.role === "admin"
      ? "/admin"
      : "/student"
    : "/register";

  return (
    <div className="container px-4 py-6 mx-auto">
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-8"
        >
          <div className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary mb-6">
            <span className="mr-1">✨</span> Campus Pass Management System
          </div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-none bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent"
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
              <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/40 transition-all">
                {isAuthenticated ? "Go to Dashboard" : "Register Now"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            
            <Link to="/admin" className="mb-4 sm:mb-0">
              <Button variant="outline" size="lg" className="bg-primary/5 border-primary/20 hover:shadow-md transition-all">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Admin Portal
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        
        <div className="w-full max-w-4xl h-64 md:h-80 mb-12 bg-gradient-to-b from-blue-100/20 to-transparent rounded-xl border border-blue-100/20 shadow-xl overflow-hidden">
          <Suspense fallback={<div>Loading 3D Model...</div>}>
            <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <directionalLight 
                position={[10, 10, 5]} 
                intensity={1} 
                castShadow 
                shadow-mapSize-width={2048} 
                shadow-mapSize-height={2048}
              />
              <CampusModel />
              <OrbitControls 
                enableZoom={false} 
                maxPolarAngle={Math.PI / 2} 
                minPolarAngle={Math.PI / 3}
              />
            </Canvas>
          </Suspense>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mt-8"
        >
          <div className="flex flex-col items-center p-6 rounded-lg glass card-hover">
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 mb-4 shadow-inner">
              <UserCheck className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Easy Registration</h3>
            <p className="text-center text-muted-foreground text-sm">
              Quick and simple registration process for students with essential details.
            </p>
          </div>
          
          <div className="flex flex-col items-center p-6 rounded-lg glass card-hover transform hover:scale-105 transition-all">
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 mb-4 shadow-inner">
              <QrCode className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Digital Passes</h3>
            <p className="text-center text-muted-foreground text-sm">
              Receive QR code-based digital passes after admin approval for campus exit.
            </p>
          </div>
          
          <div className="flex flex-col items-center p-6 rounded-lg glass card-hover">
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 mb-4 shadow-inner">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
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
