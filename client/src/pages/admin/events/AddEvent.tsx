import { useForm, useFormContext } from 'react-hook-form';
import { Card, CardContent } from '../../../components/ui/Card';
import {
  Form,
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

export function AddEventForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      region: '',
      city: '',
      skillLevel: '',
      numberOfVolunteer: 0,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      location: '',
      eventPic: null
    },
  });

  const onSubmit = async (data: any) => {

    // check that volunteer is greater than 0
    if (data.numberOfVolunteer <= 0) {
      toast.error("Number of volunteers must be greater than 0.");
      
      return;
    }

    // check if startDate is after today and endDate is not before startDate
    const today = new Date();
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    if (startDate < today) {
      toast.error("Start date must be after today.");
      return;
    }
    if (endDate < startDate) {
      toast.error("End date must be after start date.");
      return;
    }
  
    const formData = new FormData();
    
    // Append text fields
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("city", data.city);
    formData.append("region", data.region);
    formData.append("location", data.location);
    formData.append("skillLevel", data.skillLevel);
    formData.append("numberOfVolunteer", String(data.numberOfVolunteer));
    formData.append("startDate", new Date(data.startDate).toISOString().replace("Z", "+00:00"));
    formData.append("endDate", new Date(data.endDate).toISOString().replace("Z", "+00:00"));
  
    // Append file separately if it exists
    if (data.eventPic instanceof File) {
      formData.append("eventPic", data.eventPic);
    }
    
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/event`, {
        method: "POST",
        body: formData, // Send form data
        headers: {
          Authorization: `Bearer ${user?.token}`,
          // Do NOT add "Content-Type": "multipart/form-data" (browser will set it automatically)
        },
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to create event.");
      }
  
      setLoading(false);
      console.log("Event Created Successfully:", responseData);
      toast.success("Event created successfully!");
    } catch (error) {
      setLoading(false);
      console.error("Error creating event:", error);
      toast.error("Failed to create event. Please try again.");
    }
  };
  
  return (
    <Card className="w-[90%] m-auto mt-4 p-6 bg-transparent">
      <h2 className="text-3xl font-bold mb-2">Add New Event</h2>
      <p className="text-gray-500 text-sm">Fill in the event details below.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 px-0">
            <TextInputWithLabel nameInSchema="name" displayName="Event Name" placeholder="Enter event name" />
            <TextInputWithLabel nameInSchema="description" displayName="Description" placeholder="Enter event description" />
            <TextInputWithLabel nameInSchema="region" displayName="Region" placeholder="Enter region" />
            <TextInputWithLabel nameInSchema="city" displayName="City" placeholder="Enter city" />
            <TextInputWithLabel nameInSchema="skillLevel" displayName="Skill Level" placeholder="Enter skill level" type='dropdown' />
            <TextInputWithLabel nameInSchema="numberOfVolunteer" displayName="Volunteers Needed" placeholder="Enter number" type="number" />
            <TextInputWithLabel nameInSchema="startDate" displayName="Start Date" placeholder="YYYY-MM-DD" type="date" />
            <TextInputWithLabel nameInSchema="endDate" displayName="End Date" placeholder="YYYY-MM-DD" type="date" />
            <TextInputWithLabel nameInSchema="location" displayName="Location" placeholder="Enter location" />
            <TextInputWithLabel nameInSchema="eventPic" displayName="Event Image URL" placeholder="Enter image URL" type="file" />
          </CardContent>
          <div className="mt-4 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Event"}
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
  type?: 'email' | 'text' | 'date' | 'number' | 'file' | 'dropdown';
  className?: string;
  labelClassName?: string;
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
            ) : type === 'dropdown' ? (
              <select
                className={cn('flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-transparent', className)}
                id={nameInSchema}
                {...field}
                required
              >
                <option value="" disabled>Select {displayName}</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
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
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
