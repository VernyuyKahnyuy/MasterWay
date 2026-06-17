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
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      {/* Profile Card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="h-24 bg-gradient-to-br from-violet-600 to-violet-800" />
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4">
            {profile.profile_picture ? (
              <img
                src={profile.profile_picture}
                alt={profile.username}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-white"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-3xl font-bold ring-4 ring-white">
                {profile.username?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {profile.username}
          </h1>
          {profile.bio && (
            <p className="text-gray-500 leading-relaxed mb-4">{profile.bio}</p>
          )}
          {profile.interests && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Interests
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.interests.split(",").map((tag, i) => (
                  <span
                    key={i}
                    className="bg-violet-50 text-violet-700 text-sm px-3 py-1 rounded-full border border-violet-100"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
          <Link
            to={`/messages/send/${profile.user}`}
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            Send Message
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PublicProfilePage;
