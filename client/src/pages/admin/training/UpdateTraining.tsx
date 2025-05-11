import { useForm, useFormContext } from 'react-hook-form';
import { Card, CardContent } from '../../../components/ui/Card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';

type UpdateTrainingFormProps = {
  title: string;
  description: string;
  mediaUrl: string;
  tags: string;
};

export function UpdateTraining() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [existingMediaUrl, setExistingMediaUrl] = useState<string>(
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
  );

  const form = useForm<UpdateTrainingFormProps>({
    defaultValues: {
      title: '',
      description: '',
      mediaUrl: '',
      tags: '',
    },
  });

  useEffect(() => {
    async function fetchTrainingData() {
      if (!id) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/training/single/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch training data');

        const data = await response.json();
        console.log('Fetched Data:', data);

        if (data) {
          const { mediaUrl, ...trainingData } = data.data;
          setExistingMediaUrl(mediaUrl);
          form.reset({ ...trainingData, mediaUrl: '' }); // Reset without overwriting file input
        }
      } catch (error) {
        console.error('Error fetching training data:', error);
      }
    }

    fetchTrainingData();
  }, [id, form]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('tags', data.tags);

      if (data.mediaUrl && data.mediaUrl instanceof File) {
        formData.append('video', data.mediaUrl); // Append file only if new file is selected
      }

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/training/${id}`, {
        method: 'PUT',
        body: formData,
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update training.');
      }

      setLoading(false);
      toast.success('Training updated successfully!');

      // Update the media preview after a successful update
      if (data.mediaUrl && data.mediaUrl instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result && typeof reader.result === 'string') {
            setExistingMediaUrl(reader.result);
          }
        };
        reader.readAsDataURL(data.mediaUrl);
      }
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        console.error('Error updating training:', error.message);
        toast.error(error.message);
      } else {
        console.error('Error updating training:', error);
      }
      toast.error('Failed to update training. Please try again.');
    }
  };

  return (
    <Card className='w-[90%] m-auto mt-4 p-6 bg-transparent'>
      <h2 className='text-3xl font-bold mb-2'>Update Training</h2>
      <p className='text-gray-500 text-sm'>Modify the training details below.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 px-0'>
            <TextInputWithLabel nameInSchema='title' displayName='Title' placeholder='Enter training title' />
            <TextInputWithLabel
              nameInSchema='description'
              displayName='Description'
              placeholder='Enter training description'
            />
            <TextInputWithLabel
              nameInSchema='tags'
              displayName='Organization Name'
              placeholder='e.g., Org A, Org B'
            />
            <TextInputWithLabel nameInSchema='mediaUrl' displayName='Media' placeholder='Upload media' type='file' />
          </CardContent>

          {existingMediaUrl && existingMediaUrl.endsWith('.mp4') ? (
            <video className='w-60 aspect-video mt-4' controls>
              <source src={existingMediaUrl} type='video/mp4' />
              Your browser does not support the video tag.
            </video>
          ) : null}

          <div className='mt-4 flex justify-end'>
            <Button type='submit' disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
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
              type='file'
              id={nameInSchema}
              disabled={disabled}
              accept='video/*'
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                if (file.size > 9 * 1024 * 1024) { // Check if file size exceeds 9MB
                  toast.error('File size must not exceed 9MB.');
                  return;
                }
                form.setValue('mediaUrl', file);
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
          {type === 'file' &&
            previewUrl &&
            (previewUrl.startsWith('data:video') ? (
              <video className='w-60 aspect-video mt-4' controls>
                <source src={previewUrl} type='video/mp4' />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={previewUrl} alt='Preview' className='mt-4 h-40 object-contain' />
            ))}
        </FormItem>
      )}
    />
  );
}
