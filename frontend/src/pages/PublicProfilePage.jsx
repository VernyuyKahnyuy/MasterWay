import { useEffect, useState } from "react";

import { useParams, Link } from "react-router-dom";

import { getPublicProfile } from "../services/profileService";

function PublicProfilePage() {
  const { userId } = useParams();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getPublicProfile(userId);

        setProfile(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, [userId]);

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{profile.username}</h1>

      <p>{profile.bio}</p>

      <p>Interests: {profile.interests}</p>

      <Link to={`/messages/send/${profile.user}`}>Message User</Link>
    </div>
  );
}

export default PublicProfilePage;
