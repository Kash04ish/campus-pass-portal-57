import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  getPassRequests, 
  getStudentByRollNumber, 
  updatePassRequest, 
  generateQRCode,
  Student,
  notifyStudentAboutPass
} from "../../utils/storage";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Check, 
  X, 
  Eye, 
  User, 
  Calendar, 
  Clock, 
  QrCode,
  Loader2,
  Bell
} from "lucide-react";
import { Card } from "@/components/ui/card";

const PassRequestList: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [studentDetails, setStudentDetails] = useState<Student | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
    
    const intervalId = setInterval(loadRequests, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  const loadRequests = () => {
    setLoading(true);
    try {
      const allRequests = getPassRequests();
      setRequests(allRequests);
    } catch (error) {
      console.error("Error loading requests:", error);
      toast({
        title: "Error",
        description: "Failed to load pass requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewRequest = (request: any) => {
    setSelectedRequest(request);
    const student = getStudentByRollNumber(request.rollNumber);
    setStudentDetails(student);
    setDialogOpen(true);
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setProcessingId(id);
    try {
      let updatedRequest: any;
      
      if (status === 'approved') {
        const request = requests.find(r => r.id === id);
        if (!request) throw new Error("Request not found");
        
        const qrCode = generateQRCode(request);
        updatedRequest = updatePassRequest(id, { status, qrCode });
        
        if (updatedRequest && !updatedRequest.notificationSent) {
          notifyStudentAboutPass(updatedRequest);
          toast({
            title: "Notification Sent",
            description: "The student has been notified about their approved pass.",
          });
        }
      } else {
        updatedRequest = updatePassRequest(id, { status });
      }
      
      if (!updatedRequest) throw new Error("Failed to update request");
      
      setRequests(prev => 
        prev.map(r => r.id === id ? { ...r, status, qrCode: updatedRequest.qrCode } : r)
      );
      
      toast({
        title: `Request ${status === 'approved' ? 'Approved' : 'Rejected'}`,
        description: `The pass request has been ${status}.`,
      });
      
      if (selectedRequest?.id === id) {
        setSelectedRequest({ ...selectedRequest, status, qrCode: updatedRequest.qrCode });
      }
      
    } catch (error) {
      console.error(`Error ${status} request:`, error);
      toast({
        title: "Action Failed",
        description: `Failed to ${status} the request`,
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
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

  const handleSendNotification = (request: any) => {
    if (request.status === 'approved' && request.qrCode) {
      notifyStudentAboutPass(request);
      
      setRequests(prev => 
        prev.map(r => r.id === request.id ? { ...r, notificationSent: true } : r)
      );
      
      if (selectedRequest?.id === request.id) {
        setSelectedRequest({ ...selectedRequest, notificationSent: true });
      }
      
      toast({
        title: "Notification Sent",
        description: `The QR code has been sent to ${request.studentName || 'the student'}.`,
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pass Requests</h2>
        <Button variant="outline" size="sm" onClick={loadRequests}>
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : requests.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <div className="flex justify-center mb-4">
            <QrCode className="h-12 w-12 text-muted" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Pass Requests</h3>
          <p>There are no pass requests to display at this time.</p>
        </Card>
      ) : (
        <div className="rounded-md border bg-white overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead>Roll Number</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Leaving Time</TableHead>
                <TableHead>Returning Time</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {requests.map((request) => (
                  <motion.tr
                    key={request.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-b last:border-b-0"
                  >
                    <TableCell className="font-medium">
                      {request.rollNumber}
                    </TableCell>
                    <TableCell>{request.studentName || "Unknown"}</TableCell>
                    <TableCell>{formatDateTime(request.leavingTime)}</TableCell>
                    <TableCell>{formatDateTime(request.returningTime)}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {request.purpose}
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewRequest(request)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {request.status === 'approved' && !request.notificationSent && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleSendNotification(request)}
                            title="Send QR code to student"
                          >
                            <Bell className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {request.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleUpdateStatus(request.id, 'approved')}
                              disabled={!!processingId}
                            >
                              {processingId === request.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleUpdateStatus(request.id, 'rejected')}
                              disabled={!!processingId}
                            >
                              {processingId === request.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Pass Request Details</DialogTitle>
            <DialogDescription>
              Complete information about the pass request
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6 py-2">
              <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Student Information
                </h3>
                
                <div className="flex items-center gap-4">
                  {studentDetails?.photoUrl ? (
                    <img 
                      src={studentDetails.photoUrl} 
                      alt={studentDetails.name} 
                      className="w-20 h-20 rounded-full object-cover border-2 border-muted"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium">{studentDetails?.name || 'Unknown'}</h4>
                    <div className="text-sm text-muted-foreground space-y-1 mt-1">
                      <p>Roll: {studentDetails?.rollNumber || 'N/A'}</p>
                      <p>Room: {studentDetails?.roomNumber || 'N/A'}, {studentDetails?.hostelName || 'N/A'}</p>
                      <p>Contact: {studentDetails?.contactNumber || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Leaving Time
                    </h4>
                    <p className="mt-1">{formatDateTime(selectedRequest.leavingTime)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Returning Time
                    </h4>
                    <p className="mt-1">{formatDateTime(selectedRequest.returningTime)}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">Purpose</h4>
                  <p className="mt-1 text-muted-foreground">{selectedRequest.purpose}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">Status</h4>
                  <div className="mt-2">{getStatusBadge(selectedRequest.status)}</div>
                </div>
                
                {selectedRequest.status === 'approved' && selectedRequest.qrCode && (
                  <div className="text-center py-2">
                    <h4 className="text-sm font-medium mb-2 flex items-center justify-center gap-1">
                      <QrCode className="h-3.5 w-3.5" />
                      Pass QR Code
                    </h4>
                    <div className="bg-white p-4 inline-block rounded-lg border">
                      <img 
                        src={selectedRequest.qrCode} 
                        alt="Pass QR Code" 
                        className="w-40 h-40"
                      />
                    </div>
                    
                    {!selectedRequest.notificationSent && (
                      <Button
                        variant="outline" 
                        size="sm"
                        className="mt-2"
                        onClick={() => handleSendNotification(selectedRequest)}
                      >
                        <Bell className="h-4 w-4 mr-2" />
                        Send QR Code to Student
                      </Button>
                    )}
                    
                    {selectedRequest.notificationSent && (
                      <p className="text-xs text-muted-foreground mt-2">
                        ✓ QR code sent to student
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              {selectedRequest.status === 'pending' && (
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      handleUpdateStatus(selectedRequest.id, 'rejected');
                    }}
                    disabled={!!processingId}
                  >
                    {processingId === selectedRequest.id ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <X className="h-4 w-4 mr-2" />
                    )}
                    Reject
                  </Button>
                  
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleUpdateStatus(selectedRequest.id, 'approved');
                    }}
                    disabled={!!processingId}
                  >
                    {processingId === selectedRequest.id ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Approve
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PassRequestList;
