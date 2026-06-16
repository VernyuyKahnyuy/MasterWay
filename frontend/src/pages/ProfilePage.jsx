import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/profileService";

function ProfilePage() {
  const [profile, setProfile] = useState(null);

  const [bio, setBio] = useState("");

  const [interests, setInterests] = useState("");

  const [picture, setPicture] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();

        setProfile(data);

        setBio(data.bio || "");

        setInterests(data.interests || "");
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("bio", bio);

      formData.append("interests", interests);

      if (picture) {
        formData.append("profile_picture", picture);
      }

      const updated = await updateProfile(formData);

      setProfile(updated);

      alert("Profile Updated");
    } catch (error) {
      console.error(error);
    }
  };

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>My Profile</h1>

      {profile.profile_picture && (
        <img src={profile.profile_picture} alt="Profile" width="150" />
      )}

      <p>Username: {profile.username}</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Bio</label>

          <br />

          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>

        <br />

        <div>
          <label>Interests</label>

          <br />

          <textarea
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Profile Picture</label>

          <br />

          <input type="file" onChange={(e) => setPicture(e.target.files[0])} />
        </div>

        <br />

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}

export default ProfilePage;
