import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { sendMessage } from "../services/messageService";
import { getPublicProfile } from "../services/profileService";
import UserAvatar from "../components/UserAvatar";

function SendMessagePage() {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [receiver, setReceiver] = useState(null);
  const { receiverId } = useParams();

  useEffect(() => {
    if (receiverId) {
      getPublicProfile(receiverId)
        .then(setReceiver)
        .catch(() => {});
    }
  }, [receiverId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSending(true);
    setError("");
    try {
      await sendMessage({ receiver: receiverId, content });
      setSent(true);
      setContent("");
    } catch (err) {
      console.error(err.response?.data);
      setError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="px-6 py-8 max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Send Message</h1>
        {receiver && (
          <div className="flex items-center gap-3 mt-3">
            <UserAvatar
              username={receiver.username}
              profilePicture={receiver.profile_picture}
              size="lg"
            />
            <div>
              <p className="font-semibold text-gray-900">{receiver.username}</p>
              <p className="text-sm text-gray-400">Recipient</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        {sent && (
          <div className="mb-5 p-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-700 font-medium">
            ✓ Message sent successfully!
          </div>
        )}
        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Your message
            </label>
            <textarea
              placeholder="Type your message here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={sending || !content.trim()}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sending ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SendMessagePage;
