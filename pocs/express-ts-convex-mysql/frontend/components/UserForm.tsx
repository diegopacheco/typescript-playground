'use client';

import { useState } from 'react';
import { CreateUserInput, CreateUserSchema, UpdateUserInput, User } from '@/types/user';
import { useCreateUser, useUpdateUser } from '@/hooks/useUsers';

interface UserFormProps {
  user?: User;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState<CreateUserInput>({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || 18,
    isActive: user?.isActive ?? true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = CreateUserSchema.parse(formData);
      
      if (user) {
        await updateUserMutation.mutateAsync({
          id: user._id,
          userData: validatedData as UpdateUserInput,
        });
      } else {
        await createUserMutation.mutateAsync(validatedData);
      }
      
      onSuccess?.();
    } catch (error: unknown) {
      if (error instanceof Error && 'issues' in error) {
        const zodError = error as { issues: Array<{ path: Array<string>; message: string }> };
        const fieldErrors: Record<string, string> = {};
        zodError.issues.forEach(issue => {
          const field = issue.path[0];
          if (field) {
            fieldErrors[field] = issue.message;
          }
        });
        setErrors(fieldErrors);
      } else if (error instanceof Error) {
        setErrors({ general: error.message });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : type === 'number' ? Number(value) : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const isLoading = createUserMutation.isPending || updateUserMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-input ${errors.name ? 'form-input-error' : ''}`}
            placeholder="Enter full name"
            required
          />
          {errors.name && <p className="form-error">{errors.name}</p>}
          <p className="form-help">The user's complete name as it should appear in the system.</p>
        </div>

        <div>
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-input ${errors.email ? 'form-input-error' : ''}`}
            placeholder="user@example.com"
            required
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
          <p className="form-help">A unique email address for account identification.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="form-label">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className={`form-input ${errors.age ? 'form-input-error' : ''}`}
            min="1"
            max="150"
            placeholder="25"
            required
          />
          {errors.age && <p className="form-error">{errors.age}</p>}
          <p className="form-help">User's age in years (1-150).</p>
        </div>

        <div>
          <label className="form-label">Account Status</label>
          <div className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">
                Active Account
              </span>
              <p className="text-xs text-gray-500">
                {formData.isActive ? 'Account is active and can access the system' : 'Account is inactive and cannot access the system'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 font-medium">{errors.general}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary btn-lg flex-1 sm:flex-none sm:min-w-[140px]"
        >
          {isLoading ? (
            <>
              <div className="spinner w-4 h-4 mr-2"></div>
              {user ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {user ? 'Update User' : 'Create User'}
            </>
          )}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="btn-secondary btn-lg flex-1 sm:flex-none sm:min-w-[140px]"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}