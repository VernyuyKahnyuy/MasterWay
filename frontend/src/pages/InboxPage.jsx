import { useEffect, useState } from "react";
import { getInbox } from "../services/messageService";

function InboxPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const data = await getInbox();
        setMessages(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInbox();
  }, []);

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inbox</h1>
          <p className="text-gray-500 mt-1">
            {messages.length} message{messages.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-xl h-20 animate-pulse"
            />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-12 text-center">
          <p className="text-4xl mb-3">✉️</p>
          <p className="font-medium text-gray-700">No messages yet</p>
          <p className="text-sm text-gray-400 mt-1">
            When someone messages you, it will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className="p-5 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-sm shrink-0">
                  {message.sender_username?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-gray-900 text-sm">
                      {message.sender_username}
                    </p>
                    <span className="text-xs text-gray-400 shrink-0">
                      {new Date(message.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InboxPage;
