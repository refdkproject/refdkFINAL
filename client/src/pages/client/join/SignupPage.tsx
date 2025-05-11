import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { toast } from 'react-toastify';

export default function SignupPage({ role }: { role: 'volunteer' | 'charity_admin' }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '+966',
    birthDate: '',
    ...(role === 'charity_admin' && {
      institutionName: '',
      institutionType: 'orphanage',
    }),
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim() || !/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name is required and should contain only letters and spaces.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address (e.g., abc@gmail.com).';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (
      formData.password.length < 6 ||
      !/[A-Z]/.test(formData.password) ||
      !/[a-z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
    ) {
      newErrors.password =
        'Password must be at least 6 characters long and include uppercase letters, lowercase letters, numbers, and special characters.';
    }

    const phoneRegex = /^\+966\d{9,12}$/;
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required.';
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must start with +966 and contain 9 to 12 digits.';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Birth date is required.';
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 15) {
        newErrors.birthDate = 'You must be at least 15 years old.';
      }
    }

    if (role === 'charity_admin' && !formData.institutionName?.trim()) {
      newErrors.institutionName = 'Institution name is required.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach((error) => toast.error(error));
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const payload = {
        role,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        birthDate: formData.birthDate,
        ...(role === 'charity_admin' && {
          institutionName: formData.institutionName,
          institutionType: formData.institutionType,
        }),
      };

      const response = await authService.register(payload);

      if (response.data.success) {
        toast.success('User registered successfully');
        navigate('/login');
      } else {
        toast.error(response.data.message || 'Registration failed');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <main className='max-w-xl mx-auto pt-16 pb-24 px-4'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-primary mb-2'>JOIN OUR TEAM</h1>
          <h2 className='text-3xl font-bold text-primary mb-2 text-[#397260]'>
            {role === 'volunteer' ? 'Volunteer' : 'Charity Admin'}
          </h2>
          <h2 className='text-3xl font-semibold mb-2'>Create new Account</h2>
        </div>

        <form className='space-y-6' onSubmit={handleSubmit}>
          {role === 'charity_admin' && (
            <div>
              <label htmlFor='institutionName' className='block text-sm font-medium text-gray-700 mb-1'>
                ORGANIZATION NAME*
              </label>
              <input
                type='text'
                id='institutionName'
                required
                className='w-full p-3 bg-primary/20 rounded-md'
                placeholder='Enter your organization name'
                value={formData.institutionName}
                onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
              />
              {errors.institutionName && <p className='text-red-600 text-sm mt-1'>{errors.institutionName}</p>}
            </div>
          )}

          <div>
            <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
              Name*
            </label>
            <input
              type='text'
              id='name'
              className='w-full p-3 bg-primary/20 rounded-md'
              placeholder='Enter your name'
              value={formData.name}
              required
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <p className='text-red-600 text-sm mt-1'>{errors.name}</p>}
          </div>

          <div>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
              EMAIL*
            </label>
            <input
              type='email'
              id='email'
              className='w-full p-3 bg-primary/20 rounded-md'
              placeholder='Enter your email'
              value={formData.email}
              required
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className='text-red-600 text-sm mt-1'>{errors.email}</p>}
          </div>

          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>
              PASSWORD*
            </label>
            <input
              type='password'
              id='password'
              className='w-full p-3 bg-primary/20 rounded-md'
              placeholder='Enter your password'
              value={formData.password}
              required
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {errors.password && <p className='text-red-600 text-sm mt-1'>{errors.password}</p>}
          </div>

          <div>
            <label htmlFor='birthdate' className='block text-sm font-medium text-gray-700 mb-1'>
              BIRTH DATE*
            </label>
            <input
              type='date'
              id='birthdate'
              className='w-full p-3 bg-primary/20 rounded-md'
              placeholder='Enter your birth date'
              value={formData.birthDate}
              required
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
            />
            {errors.birthDate && <p className='text-red-600 text-sm mt-1'>{errors.birthDate}</p>}
          </div>

          <div>
            <label htmlFor='phoneNumber' className='block text-sm font-medium text-gray-700 mb-1'>
              CONTACT NUMBER*
            </label>
            <input
              type='tel'
              id='phoneNumber'
              className='w-full p-3 bg-primary/20 rounded-md'
              placeholder='Enter your phone number'
              value={formData.phoneNumber}
              required
              onChange={(e) => {
                let value = e.target.value;
                if (!value.startsWith('+966')) {
                  value = '+966';
                }
                value = '+966' + value.replace(/\D/g, '').slice(3);
                setFormData({ ...formData, phoneNumber: value });
              }}
            />
            {errors.phoneNumber && <p className='text-red-600 text-sm mt-1'>{errors.phoneNumber}</p>}
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-gray-600 text-white rounded-md py-3 hover:bg-gray-700 transition-colors'
          >
            Sign up
          </button>

          <p className='text-gray-600'>
            Already Registered?{' '}
            <Link to='/login' className='text-primary hover:underline'>
              Log in here
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
