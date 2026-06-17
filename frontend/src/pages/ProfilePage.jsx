import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/profileService";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("");
  const [picture, setPicture] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        const isEmpty = !data.bio && !data.interests && !data.profile_picture;
        setIsNew(isEmpty);
        setProfile(data);
        setBio(data.bio || "");
        setInterests(data.interests || "");
      } catch (err) {
        setError("Could not load your profile. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const formData = new FormData();
      formData.append("bio", bio);
      formData.append("interests", interests);
      if (picture) {
        formData.append("profile_picture", picture);
      }
      const updated = await updateProfile(formData);
      setProfile(updated);
      setIsNew(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-8 max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {isNew ? "Create Your Profile" : "My Profile"}
      </h1>

      {/* Avatar & Username */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6 flex items-center gap-5">
        {profile.profile_picture ? (
          <img
            src={profile.profile_picture}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover ring-4 ring-violet-100"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="w-20 h-20 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-3xl font-bold ring-4 ring-violet-50"
          style={{ display: profile.profile_picture ? "none" : "flex" }}
        >
          {profile.username?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900">{profile.username}</p>
          <p className="text-sm text-gray-400">Member</p>
        </div>
      </div>

      {/* Create / Edit Form */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        {isNew && (
          <div className="mb-5 p-4 bg-violet-50 border border-violet-100 rounded-lg">
            <p className="text-sm text-violet-700 font-medium">
              Welcome! Fill in your details below to set up your profile.
            </p>
          </div>
        )}

        <h2 className="text-lg font-semibold text-gray-900 mb-5">
          {isNew ? "Profile Details" : "Edit Profile"}
        </h2>

        {saved && (
          <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-700 font-medium">
            ✓ Profile updated successfully
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell people about yourself..."
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Interests
            </label>
            <textarea
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. Python, Machine Learning, Design..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none transition"
            />
            <p className="text-xs text-gray-400 mt-1">
              Used to personalize your recommendations
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Profile Picture
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors">
                <span>📁</span>
                {picture ? picture.name : "Choose file"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPicture(e.target.files[0])}
                  className="hidden"
                />
              </label>
              {picture && (
                <div className="flex items-center gap-2">
                  <img
                    src={URL.createObjectURL(picture)}
                    alt="Preview"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-200"
                  />
                  <span className="text-xs text-gray-400">Ready to upload</span>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : isNew ? "Create Profile" : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
