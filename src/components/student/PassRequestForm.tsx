
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../contexts/AuthContext";
import { savePassRequest, generateQRCode } from "../../utils/storage";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// The schema defines the form fields and validation
const formSchema = z.object({
  purpose: z
    .string()
    .min(5, "Purpose must be at least 5 characters")
    .max(200, "Purpose cannot exceed 200 characters"),
  leavingTime: z
    .string()
    .refine(val => new Date(val) > new Date(), {
      message: "Leaving time must be in the future",
    }),
  returningTime: z
    .string()
    .refine(val => new Date(val) > new Date(), {
      message: "Returning time must be in the future",
    }),
}).refine(data => new Date(data.returningTime) > new Date(data.leavingTime), {
  message: "Returning time must be after leaving time",
  path: ["returningTime"],
});

type FormValues = z.infer<typeof formSchema>;

interface PassRequestFormProps {
  onPassCreated?: () => void;
}

const PassRequestForm: React.FC<PassRequestFormProps> = ({ onPassCreated }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purpose: "",
      leavingTime: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16), // 1 hour from now
      returningTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString().slice(0, 16), // 3 hours from now
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a pass request",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the pass request object
      const passRequest = {
        studentId: user.id,
        rollNumber: user.rollNumber,
        purpose: data.purpose,
        leavingTime: data.leavingTime,
        returningTime: data.returningTime,
        status: "pending" as const,
      };

      // Save to storage
      savePassRequest(passRequest);

      // Reset form
      form.reset({
        purpose: "",
        leavingTime: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
        returningTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString().slice(0, 16),
      });

      // Call the callback if provided
      if (onPassCreated) {
        onPassCreated();
      }
    } catch (error) {
      console.error("Error creating pass request:", error);
      toast({
        title: "Error",
        description: "Failed to create pass request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Campus Pass</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose of Exit</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Briefly explain why you need to leave campus" {...field} />
                  </FormControl>
                  <FormDescription>
                    Clearly state the reason for your exit request
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="leavingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leaving Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormDescription>
                      When do you plan to leave?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="returningTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Returning Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormDescription>
                      When will you return to campus?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Pass Request"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="bg-muted/50 text-sm text-muted-foreground">
        Your request will be reviewed by campus authorities
      </CardFooter>
    </Card>
  );
};

export default PassRequestForm;
