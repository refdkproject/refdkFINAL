import { useForm, useFormContext } from 'react-hook-form';
import { Card, CardContent } from '../../../components/ui/Card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import { useState } from 'react';

export function AddInstitutionEngagementForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      volunteerPic: '',
      volunteerName: '',
      description: '',
      eventName: '',
      assignedBy: '',
    },
  });


  const onSubmit = async (data: any) => {
    setLoading(true);
    const formData = new FormData();
    
    // Append text fields
    formData.append("volunteerName", data.volunteerName);
    formData.append("description", data.description);
    formData.append("eventName", data.eventName);
    formData.append("assignedBy", data.assignedBy);
  
    // Append file separately if it exists
    if (data.volunteerPic instanceof File) {
      formData.append("volunteerPic", data.volunteerPic);
    }
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/institution-engagements`, {
        method: "POST",
        body: formData, // Send form data
        headers: {
          Authorization: `Bearer ${user?.token}`,
          // Do NOT add "Content-Type": "multipart/form-data" (browser will set it automatically)
        },
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to create Institution Engagement.");
      }
  
      setLoading(false);
      console.log("Event Created Successfully:", responseData);
      toast.success("Institution Engagement created successfully!");
    } catch (error) {
      setLoading(false);
      console.error("Error creating event:", error);
      toast.error("Failed to create Institution Engagement. Please try again.");
    }
  };

  return (
    <Card className="w-[90%] m-auto mt-4 p-6 bg-transparent">
      <h2 className="text-3xl font-bold mb-2">Add New Volunteer</h2>
      <p className="text-gray-500 text-sm">Fill in the volunteer details below.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 px-0">
            <TextInputWithLabel nameInSchema="volunteerName" displayName="Volunteer Name" placeholder="Enter volunteer name" />
            <TextInputWithLabel nameInSchema="description" displayName="Description" placeholder="Enter description" />
            <TextInputWithLabel nameInSchema="eventName" displayName="Event Name" placeholder="Enter event name" />
            <TextInputWithLabel nameInSchema="assignedBy" displayName="Assigned By" placeholder="Enter assigner name" />
            <TextInputWithLabel nameInSchema="volunteerPic" displayName="Volunteer Image" placeholder="Upload image" type="file" accept="image/*" />
          </CardContent>
          <div className="mt-4 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Volunteer'}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}

function TextInputWithLabel({
  displayName,
  nameInSchema,
  placeholder,
  type = 'text',
  className,
  labelClassName,
}: {
  displayName: string;
  nameInSchema: string;
  placeholder: string;
  type?: 'email' | 'text' | 'date' | 'number' | 'file';
  className?: string;
  labelClassName?: string;
  accept?: string;
}) {
  const { control, setValue } = useFormContext();

  return (
    <FormField
      control={control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={labelClassName} htmlFor={nameInSchema}>
            {displayName}
          </FormLabel>
          <FormControl>
            {type === 'file' ? (
                <Input
                  className={cn('bg-transparent', className)}
                  type={type}
                  id={nameInSchema}
                  placeholder={placeholder}
                  onChange={(e) => setValue(nameInSchema, e.target.files?.[0] || null)}
                  accept="image/*"
                  required
                />
              ) : (
                <Input
                  className={cn('bg-transparent', className)}
                  type={type}
                  id={nameInSchema}
                  placeholder={placeholder}
                  {...field}
                  required
                />
              )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
