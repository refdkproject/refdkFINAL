import { useForm, useFormContext } from 'react-hook-form';
import { Card, CardContent } from '../../../components/ui/Card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import { useState } from 'react';

export function AddTrainingForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      mediaUrl: '',
      tags: '',
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    const formData = new FormData();

    // Append text fields
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('tags', data.tags);

    // Append file separately if it exists
    if (data.mediaUrl instanceof File) {
      formData.append('video', data.mediaUrl);
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/training`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create training.');
      }

      setLoading(false);
      toast.success('Training created successfully!');
    } catch (error) {
      setLoading(false);
      console.error('Error creating training:', error);
      toast.error('Failed to create training. Please try again.');
    }
  };

  return (
    <Card className='w-[90%] m-auto mt-4 p-6 bg-transparent'>
      <h2 className='text-3xl font-bold mb-2'>Add New Training</h2>
      <p className='text-gray-500 text-sm'>Fill in the training details below.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 px-0'>
            <TextInputWithLabel nameInSchema='title' displayName='Training Title' placeholder='Enter training title' />
            <TextInputWithLabel
              nameInSchema='description'
              displayName='Description'
              placeholder='Enter training description'
            />
            <TextInputWithLabel nameInSchema='mediaUrl' displayName='Media URL' placeholder='Enter media' type='file' />
            <TextInputWithLabel nameInSchema='tags' displayName='Organization Name' placeholder='e.g., Org A, Org B' />
          </CardContent>
          <div className='mt-4 flex justify-end'>
            <Button type='submit' disabled={loading}>
              {loading ? 'Adding...' : 'Add Training'}
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
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && file.size > 9 * 1024 * 1024) {
                    toast.error('File size must not exceed 9MB.');
                    e.target.value = ''; // Clear the input
                  } else {
                    setValue(nameInSchema, file || null);
                  }
                }}
                accept='video/*'
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
