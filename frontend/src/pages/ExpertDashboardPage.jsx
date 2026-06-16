import { Link } from  "react-router-dom"

function ExpertDashboardPage() {
    return (
        <div>
            <h1>Expert Dashboard</h1>

            <ul>
                <li>
                    <Link to="/expert/rooms">
                        My Rooms
                    </Link>
                </li>

                <li>
                    <Link to = "/expert/create-room">
                        Create Room
                    </Link>
                </li>

                <li>
                    <Link to= "/expert/create-lesson">
                        Create Lesson
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default ExpertDashboardPage;