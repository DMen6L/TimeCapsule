import { useNavigate } from "react-router-dom"
import { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons"
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons"

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [warningEmail, setWarningEmail] = useState('')
  const [warningPassword, setWarningPassword] = useState('')

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    return emailRegex.test(email)
  }
  const validatePassword = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d_]{8,20}$/

    return passwordRegex.test(password)
  }

  const handleSubmit = async () => {
    let hasError = false;
    setWarningEmail("")
    setWarningPassword("")

    if(!email) {
      setWarningEmail(!email ? "Please fill in the email field" : "")
      hasError = true;
    } else if(!validateEmail()) {
      setWarningEmail("Please ensure that email is the right format, like yourmail@example.com")
      hasError = true;
    }

    if(!password) {
      setWarningPassword(!password ? "Please fill in the password field" : "")
      hasError = true;
    } else if(!validatePassword()) {
      setWarningPassword("Password must have 8-20 characters with at least one of each of a-z, A-Z, 0-9 and _")
      hasError = true;
    }
    
    if(hasError) return;

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      console.log("Response from backend: ", data)
  
      if(response.ok) {
        localStorage.setItem("userEmail", email)
        localStorage.setItem("userPassword", password)
        localStorage.setItem("userId", data.id)
        navigate("/time-capsule")
      } else {
        alert(data || "Registration failed")
      }
    } catch(error) {
      console.error(error)
      alert("Network Error")
    }
  }

return (
<>
  {/* Header */}
  <div className="bg-red-700 rounded-t-xl p-4 text-center">
    <p className="text-white text-lg font-semibold">Login</p>
  </div>

  {/* Form Body */}
  <div className="flex flex-col gap-4 p-6 bg-white rounded-b-xl shadow-md">
    {/* Email Field */}
    <div className="w-full">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
        <FontAwesomeIcon icon={faUser} />
        Email
      </label>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
        placeholder="your@email.com"
      />
    </div>

    {/* Password Field */}
    <div className="w-full">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
        <FontAwesomeIcon icon={faLock}/>
        Password
      </label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
        placeholder="********"
      />
    </div>
    <div className="flex flex-col items-start justify-center gap-1">
      {warningEmail !== "" && (
        <p className="warning">
          <FontAwesomeIcon icon={faExclamationCircle}/>
          {warningEmail}
        </p>
      )}
      {warningPassword !== "" && (
        <p className="warning">
          <FontAwesomeIcon icon={faExclamationCircle}/>
          {warningPassword}
        </p>
      )}
    </div>

    <p className="text-sm text-center mt-2">
      Don't have an accout?{" "}
      <button
        className="text-blue-600 hover:underline focus:outline-none"
        onClick={() => navigate("/register")}
      >
        Register in here
      </button>
    </p>

    {/* Submit Button */}
    <button 
    onClick={handleSubmit}
    className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-md w-full transition duration-200">
      Login
    </button>
  </div>
</>

    )
}

export default Login