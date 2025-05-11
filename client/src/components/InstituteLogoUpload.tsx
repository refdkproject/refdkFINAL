import { useState } from 'react';
import { profileService } from '../services/profileService';

export default function InstituteLogoUpload({
  currentImage,
  institutionId,
  onUploadSuccess,
}: {
  currentImage: string;
  institutionId: string;
  onUploadSuccess: (url: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('institutionId', institutionId);
    formData.append('institutionLogo', file);

    try {
      setLoading(true);
      setError('');
      const response = await profileService.updateInstituteLogo(formData);
      onUploadSuccess(response.data.data);
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center gap-6'>
      <div className='relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#397260]'>
        <img src={currentImage} alt='Logo' className='w-full h-full object-cover' />
      </div>

      <div>
        <label className='cursor-pointer bg-[#397260] text-white px-4 py-2 rounded-lg hover:bg-[#2c5846]'>
          {loading ? 'Uploading...' : 'Change Photo'}
          <input type='file' accept='image/*' className='hidden' onChange={handleFileUpload} disabled={loading} />
        </label>
        {error && <p className='text-red-600 text-sm mt-2'>{error}</p>}
      </div>
    </div>
  );
}
