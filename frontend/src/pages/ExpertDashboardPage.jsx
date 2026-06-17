import { Link } from "react-router-dom";

const actions = [
  {
    to: "/expert/rooms",
    imgSrc: "/icon-expert.svg",
    title: "My Rooms",
    description: "View and manage all your learning rooms",
    color: "from-violet-500 to-violet-700",
  },
  {
    to: "/expert/create-room",
    icon: "➕",
    title: "Create Room",
    description: "Launch a new learning room for your students",
    color: "from-indigo-500 to-indigo-700",
  },
  {
    to: "/expert/create-lesson",
    icon: null,
    title: "Create Lesson",
    description: "Add a lesson with video, notes, PDF, and more",
    color: "from-blue-500 to-blue-700",
  },
];

function ExpertDashboardPage() {
  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-600 to-violet-800 rounded-2xl p-8 mb-8 text-white">
        <p className="text-violet-300 text-sm font-medium mb-1">Expert Portal</p>
        <h1 className="text-3xl font-bold mb-2">Welcome back, Expert!</h1>
        <p className="text-violet-200">
          Manage your rooms, create content, and grow your audience.
        </p>
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-semibold text-gray-900 mb-5">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {actions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-violet-100 transition-all p-6"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} text-white flex items-center justify-center text-2xl mb-4`}
            >
              {action.imgSrc ? (
                <img src={action.imgSrc} alt="" className="w-7 h-7 brightness-0 invert" />
              ) : action.icon ? (
                action.icon
              ) : (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 group-hover:text-violet-700 transition-colors mb-1">
              {action.title}
            </h3>
            <p className="text-sm text-gray-500">{action.description}</p>
          </Link>
        ))}
      </div>

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
        <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5 shrink-0 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
          Expert Tips
        </h3>
        <ul className="space-y-2 text-sm text-amber-800">
          <li>• Add a cover image to your rooms for better visibility</li>
          <li>• Organize lessons with a clear order number</li>
          <li>• Use YouTube links to embed video lessons</li>
          <li>• Upload PDFs as downloadable lesson notes</li>
        </ul>
      </div>
    </div>
  );
}

export default ExpertDashboardPage;
