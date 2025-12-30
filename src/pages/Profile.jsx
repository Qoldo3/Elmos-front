import { useState, useEffect } from 'react';
import { profileService } from '../services/profileService';
import { authService } from '../services/authService';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    description: '',
    image: null,
  });
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password1: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile();
      setProfile(data);
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        description: data.description || '',
        image: null,
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to load profile. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const data = await profileService.updateProfile(formData);
      setProfile(data);
      setEditing(false);
      setFormData((prev) => ({ ...prev, image: null }));
      setMessage({
        type: 'success',
        text: 'Profile updated successfully!',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error.response?.data?.detail ||
          Object.values(error.response?.data || {})
            .flat()
            .join(', ') ||
          'Failed to update profile.',
      });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordData.new_password !== passwordData.new_password1) {
      setMessage({
        type: 'error',
        text: 'New passwords do not match.',
      });
      return;
    }

    try {
      await authService.changePassword(
        passwordData.old_password,
        passwordData.new_password,
        passwordData.new_password1
      );
      setPasswordData({
        old_password: '',
        new_password: '',
        new_password1: '',
      });
      setShowPasswordForm(false);
      setMessage({
        type: 'success',
        text: 'Password changed successfully!',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error.response?.data?.old_password?.[0] ||
          error.response?.data?.new_password?.[0] ||
          error.response?.data?.detail ||
          'Failed to change password.',
      });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h1>Profile</h1>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <div className="profile-container">
        <div className="profile-card">
          {!editing ? (
            <>
              <div className="profile-header">
                {profile?.image && (
                  <img
                    src={profile.image}
                    alt="Profile"
                    className="profile-image-large"
                  />
                )}
                <div>
                  <h2>
                    {profile?.first_name || ''} {profile?.last_name || ''}
                  </h2>
                  <p className="profile-email">{profile?.email}</p>
                </div>
              </div>
              {profile?.description && (
                <div className="profile-description">
                  <h3>About</h3>
                  <p>{profile.description}</p>
                </div>
              )}
              <div className="profile-actions">
                <button
                  onClick={() => setEditing(true)}
                  className="btn-primary"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="btn-secondary"
                >
                  Change Password
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label htmlFor="image">Profile Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    loadProfile();
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {showPasswordForm && (
            <form onSubmit={handlePasswordSubmit} className="password-form">
              <h3>Change Password</h3>
              <div className="form-group">
                <label htmlFor="old_password">Current Password</label>
                <input
                  type="password"
                  id="old_password"
                  name="old_password"
                  value={passwordData.old_password}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      old_password: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="new_password">New Password</label>
                <input
                  type="password"
                  id="new_password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      new_password: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="new_password1">Confirm New Password</label>
                <input
                  type="password"
                  id="new_password1"
                  name="new_password1"
                  value={passwordData.new_password1}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      new_password1: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({
                      old_password: '',
                      new_password: '',
                      new_password1: '',
                    });
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
