import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PersonalInfo } from '@/types/resume';
import { Button } from '@/components/Button';
import { TextField } from '@/components/Form';

const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(1, 'Phone number is required'),
  linkedIn: z.string().url('Please enter a valid URL').or(z.literal('')),
  portfolio: z.string().url('Please enter a valid URL').or(z.literal('')),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: data,
  });

  const onSubmit = (formData: PersonalInfoFormData) => {
    onChange(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label="Full Name"
          {...register('fullName')}
          error={errors.fullName?.message}
          required
        />
        <TextField
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          required
        />
        <TextField
          label="Phone"
          type="tel"
          {...register('phone')}
          error={errors.phone?.message}
          required
        />
        <TextField
          label="LinkedIn Profile"
          placeholder="https://linkedin.com/in/yourprofile"
          {...register('linkedIn')}
          error={errors.linkedIn?.message}
        />
        <TextField
          label="Portfolio/Website"
          placeholder="https://yourwebsite.com"
          {...register('portfolio')}
          error={errors.portfolio?.message}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
