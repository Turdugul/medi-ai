import { useState, useContext } from 'react';
import { FaUser, FaEnvelope, FaUserMd, FaKey } from 'react-icons/fa';
import AuthContext from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/forms/Input';
import Button from '@/components/ui/Button';
import { showToast } from '@/components/Toast';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (isPasswordUpdate = false) => {
    const newErrors = {};
    
    if (!isPasswordUpdate) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
        newErrors.email = 'Invalid email address';
      }
    } else {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }
      if (!formData.newPassword) {
        newErrors.newPassword = 'New password is required';
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'Password must be at least 6 characters';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await updateProfile({
        fullName: formData.fullName,
        email: formData.email,
      });
      showToast('success', 'Profile updated successfully');
    } catch (error) {
      showToast('error', error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm(true)) return;

    setIsLoading(true);
    try {
      await updateProfile({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      showToast('success', 'Password updated successfully');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      showToast('error', error.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout title="Profile Settings">
      <div className="space-y-6">
        <Card
          title="Personal Information"
          actions={
            <Button
              type="submit"
              onClick={handleProfileUpdate}
              isLoading={isLoading}
            >
              Save Changes
            </Button>
          }
        >
          <div className="space-y-4">
            <Input
              label="Full Name"
              name="fullName"
              icon={FaUserMd}
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              placeholder="Enter your full name"
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              icon={FaEnvelope}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email"
            />
          </div>
        </Card>

        <Card
          title="Change Password"
          actions={
            <Button
              type="submit"
              onClick={handlePasswordUpdate}
              isLoading={isLoading}
            >
              Update Password
            </Button>
          }
        >
          <div className="space-y-4">
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              icon={FaKey}
              value={formData.currentPassword}
              onChange={handleChange}
              error={errors.currentPassword}
              placeholder="Enter current password"
            />
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              icon={FaKey}
              value={formData.newPassword}
              onChange={handleChange}
              error={errors.newPassword}
              placeholder="Enter new password"
            />
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              icon={FaKey}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Confirm new password"
            />
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Profile;
