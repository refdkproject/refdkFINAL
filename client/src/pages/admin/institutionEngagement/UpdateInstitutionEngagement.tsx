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
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';

type UpdateEventFormProps = {
  eventName: string;
  description: string;
  assignedBy: string;
  volunteerName: string;
  institution: string;
  createdAt: string;
  updatedAt: string;
  volunteerPic: any;
};

export function UpdateInstitutionEngagementForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>(); 
  const [existingUrl, setExistingUrl] = useState<string>('https://www.svgrepo.com/show/508699/landscape-placeholder.svg');

  const form = useForm<UpdateEventFormProps>({
    defaultValues: {
      eventName: '',
      description: '',
      assignedBy: '',
      volunteerName: '',
      volunteerPic: 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    },
  });

  useEffect(() => {
    async function fetchEventData() {
      if (!id) return; 

      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/institution-engagements/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch event data');

        const data = await response.json();
        console.log('Fetched Data:', data);

        if (data) {
          const { volunteerPic, ...eventData } = data.data;
          setExistingUrl(`${volunteerPic}`);
          form.reset({ ...eventData, volunteerPic: '' }); // Reset without overwriting file input
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    }

    fetchEventData();
  }, [id, form]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('eventName', data.eventName);
      formData.append('description', data.description);
      formData.append('assignedBy', data.assignedBy);
      formData.append('volunteerName', data.volunteerName);
      
      if (data.volunteerPic && data.volunteerPic instanceof File) {
        formData.append('volunteerPic', data.volunteerPic); // Ensure the field name matches the server's Multer configuration
      } else {
        formData.append('volunteerPic', ''); // Send an empty string if no file is selected
      }

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/institution-engagements/${id}`, {
        method: 'PUT',
        body: formData,
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update Institution Engagement.');
      }

      setLoading(false);
      console.log('Event Updated Successfully:', responseData);
      toast.success('Institution Engagement updated successfully!');

      // Update the image preview after a successful update
      if (data.volunteerPic && data.volunteerPic instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result && typeof reader.result === 'string') {
            setExistingUrl(reader.result);
          }
        };
        reader.readAsDataURL(data.volunteerPic);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error updating event:', error);
      toast.error('Failed to update Institution Engagement. Please try again.');
    }
  };

  return (
    <Card className="w-[90%] m-auto mt-4 p-6 bg-transparent">
      <h2 className="text-3xl font-bold mb-2">Update Institutional Engagement</h2>
      <p className="text-gray-500 text-sm">Modify the volunteer details below.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 px-0">
            <TextInputWithLabel nameInSchema="volunteerName" displayName="Volunteer Name" placeholder="Enter volunteer name" />
            <TextInputWithLabel nameInSchema="description" displayName="Description" placeholder="Enter event description" />
            <TextInputWithLabel nameInSchema="eventName" displayName="Event Name" placeholder="Enter event name" />
            <TextInputWithLabel nameInSchema="assignedBy" displayName="Assigned By" placeholder="Enter assigner name" />
            <TextInputWithLabel nameInSchema="volunteerPic" displayName="Volunteer Image" placeholder="Upload an image" type="file" />
          </CardContent>

          <img className="w-[20%]" src={existingUrl} alt="Volunteer Pic" />

          <div className="mt-4 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Volunteer'}
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
  type = 'text',
  placeholder,
  className,
  labelClassName,
  disabled = false,
}: {
  displayName: string;
  nameInSchema: string;
  type?: 'email' | 'text' | 'date' | 'number' | 'file';
  className?: string;
  placeholder?: string;
  labelClassName?: string;
  disabled?: boolean;
}) {
  const form = useFormContext();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  return (
    <FormField
      control={form.control}
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
                type="file"
                id={nameInSchema}
                disabled={disabled}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    form.setValue('volunteerPic', file);
                    field.onChange(file); 

                    const reader = new FileReader();
                    reader.onloadend = () => {
                      if (reader.result && typeof reader.result === 'string') {
                        setPreviewUrl(reader.result);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            ) : (
              <Input
                className={cn('bg-transparent', className)}
                type={type}
                id={nameInSchema}
                disabled={disabled}
                placeholder={placeholder}
                {...field}
              />
            )}
          </FormControl>
          <FormMessage />
          {type === 'file' && previewUrl && (
            <img src={previewUrl} alt="Preview" className="mt-2 w-[100px] h-[100px] object-cover" />
          )}
        </FormItem>
      )}
    />
  );
}
