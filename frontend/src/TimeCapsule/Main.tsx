import { Link } from "react-router-dom"

function Main() {
  return (
    <div className="text-center p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to Time Capsule</h1>
      <p className="mb-6">Leave a message to your future self!</p>
      <Link to="/register" className="text-blue-500 underline mr-4">Register</Link>
      <Link to="/login" className="text-blue-500 underline">Login</Link>
    </div>
  )
}

export default Main;
