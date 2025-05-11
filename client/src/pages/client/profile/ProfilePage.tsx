import { useEffect, useState } from 'react';
import ProfilePicUpload from '../../../components/ProfilePicUpload';
import { VolunteerProfile, CharityProfile } from '../../../types/profile';
import { profileService } from '../../../services/profileService';
import { toast } from 'react-toastify';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOptions } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '../../../icons/icons';
import { AxiosError } from 'axios';
import InstituteLogoUpload from '../../../components/InstituteLogoUpload';

// Add these constants at the top of the file
const SKILL_OPTIONS = [
  'Programming',
  'Graphic Design',
  'Teaching',
  'First Aid',
  'Project Management',
  'Language Translation',
  'Event Planning',
  'Counseling',
];

const INTEREST_OPTIONS = [
  'Children Welfare',
  'Elderly Care',
  'Special Needs Support',
  'Education',
  'Community Development',
  'Healthcare',
  'Animal Welfare',
  'Environmental Conservation',
];

export default function ProfilePage() {
  const [skillsInput, setSkillsInput] = useState('');
  const [areasInput, setAreasInput] = useState('');
  const [profileData, setProfileData] = useState<VolunteerProfile | CharityProfile | any | null | undefined>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [allUsers, setAllUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileService.getProfile();
        setProfileData(response.data.data);
      } catch (err) {
        console.log(errors);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    const fetchAllUsers = async () => {
      try {
        const response = await profileService.getAllUsers();
        setAllUsers(response.data.data);
      } catch (err) {
        console.error('Failed to fetch users ', err);
      }
    };

    fetchProfile();
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (profileData?.skills) setSkillsInput(profileData.skills.join(', '));
    if (profileData?.areasOfInterest) setAreasInput(profileData.areasOfInterest.join(', '));
  }, [profileData]);
  const validateForm = () => {
    let tempErrors: any = {};
    let isValid = true;

    // Trim input values to prevent accidental spaces
    const trimmedEmail = profileData?.email?.trim();
    const trimmedPhoneNumber = profileData?.phoneNumber?.trim();

    if (!profileData?.name) {
      tempErrors.name = 'Full Name is required';
      toast.error('Full Name is required', { position: 'top-right' });
      isValid = false;
    }

    // Email Validation (Only Gmail Allowed)
    if (!trimmedEmail) {
      tempErrors.email = 'Email is required';
      toast.error('Email is required', { position: 'top-right' });
      isValid = false;
    } else if (!/^[^\s@]+@gmail\.com$/.test(trimmedEmail)) {
      tempErrors.email = 'Only Gmail addresses are allowed';
      toast.error('Only Gmail addresses are allowed', { position: 'top-right' });
      isValid = false;
    } else {
      const isEmailTaken = allUsers.some((user) => user.email === trimmedEmail && user.id !== profileData.id);
      if (isEmailTaken) {
        tempErrors.email = 'Email is already in use';
        toast.error('Email is already in use', { position: 'top-right' });
        isValid = false;
      }
    }

    // Phone Number Validation
    const phoneRegex = /^\+966\d{9,12}$/;
    if (!trimmedPhoneNumber) {
      tempErrors.phoneNumber = 'Phone number is required.';
      toast.error('Phone number is required.', { position: 'top-right' });
      isValid = false;
    } else if (!phoneRegex.test(trimmedPhoneNumber)) {
      tempErrors.phoneNumber = 'Phone number must start with +966 and contain 9 to 12 digits.';
      toast.error('Phone number must start with +966 and contain 9 to 12 digits.', { position: 'top-right' });
      isValid = false;
    }

    // Birth Date Validation
    if (!profileData?.birthDate) {
      tempErrors.birthDate = 'Birth Date is required';
      toast.error('Birth Date is required', { position: 'top-right' });
      isValid = false;
    } else {
      const birthDate = new Date(profileData.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 15) {
        tempErrors.birthDate = 'You must be at least 15 years old.';
        toast.error('You must be at least 15 years old.', { position: 'top-right' });
        isValid = false;
      }
    }

    // Volunteer-specific Validation
    if (profileData?.role === 'volunteer') {
      if (!skillsInput) {
        tempErrors.skills = 'At least one skill is required';
        toast.error('At least one skill is required', { position: 'top-right' });
        isValid = false;
      }
      if (!areasInput) {
        tempErrors.areasOfInterest = 'At least one area of interest is required';
        toast.error('At least one area of interest is required', { position: 'top-right' });
        isValid = false;
      }
    }

    // Password Validation
    if (profileData?.password && profileData.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters long';
      toast.error('Password must be at least 6 characters long', { position: 'top-right' });
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileData) return;

    if (!validateForm()) {
      return;
    }

    const updatedProfile = {
      ...profileData,
      skills: skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      areasOfInterest: areasInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const response = await profileService.updateProfile(updatedProfile);
      setProfileData(response.data.data);
      toast.success('Profile updated successfully!', { position: 'top-center', autoClose: 3000 });
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response.data.message, { position: 'top-center', autoClose: 3000 });
      } else {
        toast.error('Failed to update profile', { position: 'top-center', autoClose: 3000 });
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!profileData) return <div>Profile not found</div>;

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        <h1 className='text-3xl font-bold text-[#397260] mb-8'>Profile Settings</h1>

        <div className='bg-white rounded-xl shadow-sm p-6 mb-6 space-y-4'>
          <h2 className='text-xl font-semibold text-[#397260]'>Profile Picture</h2>
          <ProfilePicUpload
            currentImage={profileData.profilePic}
            onUploadSuccess={(url) => setProfileData({ ...profileData, profilePic: url })}
          />
        </div>

        {profileData.role === 'charity_admin' && (
          <div className='bg-white rounded-xl shadow-sm p-6 mb-6 space-y-4'>
            <h2 className='text-xl font-semibold text-[#397260]'>Institution Logo</h2>
            <InstituteLogoUpload
              currentImage={profileData?.institution?.logo}
              institutionId={profileData?.institution?._id}
              onUploadSuccess={(url) =>
                setProfileData({ ...profileData, institution: { ...profileData.institution, logo: url } })
              }
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className='bg-white rounded-xl shadow-sm p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Common Fields */}
            <div className='col-span-2'>
              <h2 className='text-xl font-semibold text-[#397260] mb-4'>Personal Information</h2>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Full Name</label>
              <input
                type='text'
                required
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397260]'
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
              <input
                type='email'
                required
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397260]'
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Phone Number</label>
              <input
                type='tel'
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397260]'
                value={profileData.phoneNumber || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 10) {
                    setProfileData({ ...profileData, phoneNumber: value });
                  }
                }}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Birth Date</label>
              <input
                type='date'
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397260]'
                value={profileData.birthDate?.split('T')[0] || ''}
                onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
              />
            </div>

            {/* Role-specific Fields */}
            {profileData.role === 'volunteer' ? (
              <VolunteerFields
                profile={profileData}
                setProfile={setProfileData}
                skillsInput={skillsInput}
                setSkillsInput={setSkillsInput}
                areasInput={areasInput}
                setAreasInput={setAreasInput}
              />
            ) : (
              <CharityFields profile={profileData} setProfile={setProfileData} />
            )}
          </div>

          <div className='mt-8'>
            <button
              type='submit'
              className='w-full bg-[#397260] text-white p-3 rounded-lg hover:bg-[#2c5846] font-semibold'
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Volunteer-specific fields component
const VolunteerFields = ({
  profile,
  setProfile,
  setSkillsInput,
  setAreasInput,
}: {
  profile: VolunteerProfile;
  setProfile: React.Dispatch<React.SetStateAction<VolunteerProfile | CharityProfile | null | any | undefined>>;
  skillsInput: string;
  setSkillsInput: React.Dispatch<React.SetStateAction<string>>;
  areasInput: string;
  setAreasInput: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [skillQuery, setSkillQuery] = useState('');
  const [interestQuery, setInterestQuery] = useState('');

  const filteredSkills =
    skillQuery === ''
      ? SKILL_OPTIONS
      : SKILL_OPTIONS.filter((skill) => skill.toLowerCase().includes(skillQuery.toLowerCase()));

  const filteredInterests =
    interestQuery === ''
      ? INTEREST_OPTIONS
      : INTEREST_OPTIONS.filter((interest) => interest.toLowerCase().includes(interestQuery.toLowerCase()));

  const handleSkillChange = (selected: string[]) => {
    setProfile({ ...profile, skills: selected });
    setSkillsInput(selected.join(', '));
  };

  const handleInterestChange = (selected: string[]) => {
    setProfile({ ...profile, areasOfInterest: selected });
    setAreasInput(selected.join(', '));
  };

  return (
    <>
      <div className='col-span-2'>
        <h2 className='text-xl font-semibold text-[#397260] mb-4'>Volunteer Details</h2>
      </div>

      <div className='col-span-2'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>Skills</label>
        <Combobox multiple value={profile.skills || []} onChange={handleSkillChange}>
          <div className='relative'>
            <Combobox.Input
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397260]'
              displayValue={(skills: string[]) => skills.join(', ')}
              placeholder='Select skills...'
              onChange={(e) => setSkillQuery(e.target.value)}
            />
            <Combobox.Button className='absolute inset-y-0 right-0 flex items-center pr-2'>
              <ChevronUpDownIcon className='h-5 w-5 text-gray-400' />
            </Combobox.Button>

            <Combobox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none'>
              {filteredSkills.map((skill) => (
                <Combobox.Option
                  key={skill}
                  value={skill}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-[#397260]/10' : 'text-gray-900'
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{skill}</span>
                      {selected && (
                        <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-[#397260]'>
                          <CheckIcon className='h-5 w-5' />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </div>
        </Combobox>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>Availability</label>
        <select
          className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397260]'
          value={profile.availability || ''}
          onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
        >
          <option value=''>Select availability</option>
          <option value='weekdays'>Weekdays</option>
          <option value='weekends'>Weekends</option>
          <option value='both'>Both</option>
        </select>
      </div>

      <div className='col-span-2'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>Areas of Interest</label>
        <Combobox multiple value={profile.areasOfInterest || []} onChange={handleInterestChange}>
          <div className='relative'>
            <ComboboxInput
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397260]'
              displayValue={(interests: string[]) => interests.join(', ')}
              placeholder='Select interests...'
              onChange={(e) => setInterestQuery(e.target.value)}
            />
            <ComboboxButton className='absolute inset-y-0 right-0 flex items-center pr-2'>
              <ChevronUpDownIcon className='h-5 w-5 text-gray-400' />
            </ComboboxButton>

            <ComboboxOptions
              className='max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none'
              anchor='bottom'
              style={{ width: 'var(--input-width)' }}
            >
              {filteredInterests.map((interest) => (
                <Combobox.Option
                  key={interest}
                  value={interest}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-[#397260]/10' : 'text-gray-900'
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{interest}</span>
                      {selected && (
                        <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-[#397260]'>
                          <CheckIcon className='h-5 w-5' />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </ComboboxOptions>
          </div>
        </Combobox>
      </div>
    </>
  );
};

// Charity Admin-specific fields component
const CharityFields = ({
  profile,
  setProfile,
}: {
  profile: CharityProfile;
  setProfile: React.Dispatch<React.SetStateAction<VolunteerProfile | CharityProfile | null | any | undefined>>;
}) => (
  <>
    <div className='col-span-2'>
      <h2 className='text-xl font-semibold text-[#397260] mb-4'>Institution Details</h2>
    </div>

    <div>
      <label className='block text-sm font-medium text-gray-700 mb-2'>Institution Name</label>
      <input
        type='text'
        className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397260]'
        value={profile.institution?.name || ''}
        onChange={(e) =>
          setProfile({
            ...profile,
            institution: { ...profile.institution, name: e.target.value },
          })
        }
      />
    </div>

    <div>
      <label className='block text-sm font-medium text-gray-700 mb-2'>Institution Type</label>
      <select
        className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397260]'
        value={profile.institution?.type || ''}
        onChange={(e) =>
          setProfile({
            ...profile,
            institution: { ...profile.institution, type: e.target.value },
          })
        }
      >
        <option value=''>Select type</option>
        <option value='orphanage'>Orphanage</option>
        <option value='elderly-care'>Elderly Care</option>
        <option value='special-needs'>Special Needs</option>
      </select>
    </div>

    <div className='col-span-2'>
      <label className='block text-sm font-medium text-gray-700 mb-2'>Contact Address</label>
      <input
        type='text'
        className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397260]'
        value={profile.institution?.contact?.address || ''}
        onChange={(e) =>
          setProfile({
            ...profile,
            institution: {
              ...profile.institution,
              contact: {
                ...profile.institution?.contact,
                address: e.target.value,
              },
            },
          })
        }
      />
    </div>
  </>
);
