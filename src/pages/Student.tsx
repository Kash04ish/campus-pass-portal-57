
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PageTransition from "../components/ui/PageTransition";
import PassRequestForm from "../components/student/PassRequestForm";
import { getPassRequestsByStudent } from "../utils/storage";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { QrCode, History, Clock, Calendar, User } from "lucide-react";

const Student = () => {
  const { isAuthenticated, user, isStudent } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [passRequests, setPassRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("request");
  const [selectedPass, setSelectedPass] = useState<any | null>(null);

  useEffect(() => {
    // If not authenticated or not a student, redirect to login
    if (!isAuthenticated || !isStudent) {
      toast({
        title: "Access Denied",
        description: "You must be logged in as a student to access this page.",
        variant: "destructive",
      });
      navigate("/register", { replace: true });
      return;
    }
    
    // Load pass requests
    if (user) {
      const requests = getPassRequestsByStudent(user.id);
      setPassRequests(requests);
    }
  }, [isAuthenticated, isStudent, user, navigate, toast]);

  const refreshPassRequests = () => {
    if (user) {
      const requests = getPassRequestsByStudent(user.id);
      setPassRequests(requests);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="text-orange-500 border-orange-200 bg-orange-100">Pending</Badge>;
    }
  };

  const handleViewPass = (pass: any) => {
    setSelectedPass(pass);
    setActiveTab("details");
  };

  return (
    <PageTransition>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold tracking-tight"
            >
              Student Portal
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground"
            >
              Request and manage your campus passes
            </motion.p>
          </div>
          
          {user && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 bg-muted/40 rounded-lg px-4 py-2 border border-muted"
            >
              {user.photoUrl ? (
                <img 
                  src={user.photoUrl} 
                  alt={user.name} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
              )}
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.rollNumber}</div>
              </div>
            </motion.div>
          )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="request" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              <span className="hidden sm:inline">Request Pass</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Pass History</span>
            </TabsTrigger>
            <TabsTrigger value="details" disabled={!selectedPass} className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Pass Details</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="request" className="space-y-4">
            <div className="max-w-md mx-auto">
              <PassRequestForm />
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Pass Requests</h2>
              <Button variant="outline" size="sm" onClick={refreshPassRequests}>
                Refresh
              </Button>
            </div>
            
            {passRequests.length === 0 ? (
              <Card className="text-center p-8">
                <div className="flex justify-center mb-4">
                  <QrCode className="h-12 w-12 text-muted" />
                </div>
                <CardTitle className="text-lg mb-2">No Pass Requests</CardTitle>
                <CardDescription>
                  You haven't made any pass requests yet. Create one using the Request Pass tab.
                </CardDescription>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {passRequests.map((pass) => (
                  <motion.div
                    key={pass.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="card-hover">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <CardTitle className="text-lg">Campus Pass</CardTitle>
                            <CardDescription className="line-clamp-1">
                              {pass.purpose}
                            </CardDescription>
                          </div>
                          {getStatusBadge(pass.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2 pb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Leaving: {formatDateTime(pass.leavingTime)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Returning: {formatDateTime(pass.returningTime)}</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleViewPass(pass)}
                        >
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="details">
            {selectedPass && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="max-w-lg mx-auto"
              >
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Pass Details</CardTitle>
                        <CardDescription>
                          Created on {new Date(selectedPass.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      {getStatusBadge(selectedPass.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium">Leaving Time</h4>
                        <p className="text-muted-foreground">
                          {formatDateTime(selectedPass.leavingTime)}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Returning Time</h4>
                        <p className="text-muted-foreground">
                          {formatDateTime(selectedPass.returningTime)}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium">Purpose</h4>
                      <p className="text-muted-foreground">{selectedPass.purpose}</p>
                    </div>
                    
                    {selectedPass.status === 'approved' && selectedPass.qrCode && (
                      <div className="pt-4 flex flex-col items-center justify-center">
                        <div className="bg-white p-4 rounded-lg border mb-2">
                          <img 
                            src={selectedPass.qrCode} 
                            alt="Pass QR Code" 
                            className="w-48 h-48"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                          Show this QR code at the exit gate
                        </p>
                      </div>
                    )}
                    
                    {selectedPass.status === 'rejected' && (
                      <div className="bg-red-50 text-red-800 p-4 rounded-lg text-sm">
                        Your pass request has been rejected. You may submit a new request with
                        updated information if needed.
                      </div>
                    )}
                    
                    {selectedPass.status === 'pending' && (
                      <div className="bg-orange-50 text-orange-800 p-4 rounded-lg text-sm">
                        Your pass request is pending approval. Please check back later.
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedPass(null);
                        setActiveTab("history");
                      }}
                    >
                      Back to History
                    </Button>
                    
                    {selectedPass.status === 'approved' && selectedPass.qrCode && (
                      <Button onClick={() => window.print()}>
                        Print Pass
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default Student;
