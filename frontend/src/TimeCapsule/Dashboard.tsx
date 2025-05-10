import { useEffect, useState } from "react"
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface Capsule {
  title: string;
  message: string;
  deliveryDate: string;
  created_at: string;
}

function Dashboard() {
  const userId = Number(localStorage.getItem("userId"))
  const [showModal, setShowModal] = useState(false)

  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [deliveryDate, setDeliveryDate] = useState("")

  const [warningMessage, setWarningMessage] = useState("")
  const [warningDeliveryDate, setWarningDeliveryDate] = useState("")

  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingMessage, setEditingMessage] = useState<Capsule | null>(null)

  const [messages, setMessages] = useState<Capsule[]>([])

  const today = new Date().toISOString().split("T")[0]

  useEffect(() => {
    const fetchCapsules = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        const userPassword = localStorage.getItem("userPassword");
  
        if (!userEmail || !userPassword) return;
  
        const response = await fetch("http://localhost:5000/load-capsules", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: userEmail,
            password: userPassword
          })
        });
  
        if (!response.ok) {
          console.error("Failed to fetch capsules");
          return;
        }
  
        const data = await response.json();
        setMessages(data); // make sure the response is an array of Capsule objects
      } catch (error) {
        console.error("Error loading capsules:", error);
      }
    };
  
    fetchCapsules();
  }, []);

  const handleSubmit = async () => {
    let hasError = false
    setWarningMessage("")
    setWarningDeliveryDate("")

    if(!message) {
        setWarningMessage("write a message to the future!")
        hasError = true
    }

    if(!deliveryDate) {
        setWarningDeliveryDate("choose delivery date")
        hasError = true
    } else if(deliveryDate < today) {
        setWarningDeliveryDate("you can't choose date earlier than today!")
        hasError = true
    }

    if(hasError) return

    const newCapsule: Capsule = {
        title,
        message,
        deliveryDate,
        created_at: new Date().toISOString().split("T")[0]
    }

    const response = await fetch("http://localhost:5000/capsule", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...newCapsule,
          userId
        })
    })

    const data = await response.json()
    console.log("Response from backend: ", data)

    if(response.ok) {
        console.log("Submitted:", { title, message, deliveryDate })
        setMessages([...messages, newCapsule])
        reset()

        setShowModal(false)
    } else {
        alert(data || "Registration failed")
    }
  }

  const handleCancel = () => {
    reset()

    setShowModal(false)
  }

  const handleDelete = async () => {
    const response = await fetch("http://localhost:5000/delete-capsule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...editingMessage,
        userId
      })
    })

    if(!response.ok) {
      alert("Error while deleting capsule")
      return;
    }

    const data = await response.json()
    console.log("Response: ", data)
  }

  const reset = () => {
    setMessage("")
    setDeliveryDate("")
    setTitle("")
  }

  return (
    <div className="bg-white flex flex-col items-center justify-center rounded-xl shadow-md p-3 gap-3">
      <div className="p-1 flex flex-col gap-3">
        {messages.length === 0 ? (
            <div>
              <h2 className="text-center text-xl text-gray-500 font-bold">Currently there are no messages to the future</h2>
              <p className="text-center text-md text-gray-500">You can add messages by pressing the button below!</p>
            </div>
        ) : (
            messages.map((m, index) => (
                <div 
                key={index}
                onClick={() => {
                    setEditingIndex(index);
                    setEditingMessage({ ...m }); // clone to avoid direct mutation
                  }}
                className="flex flex-col cursor-pointer w-full sm:w-72 max-w-md border-2 border-gray-500 rounded-md bg-gray-200 p-4 shadow-md  transition-transform duration-200 transform hover:scale-105"
              >
                <div className="w-full h-4 bg-white border-b border-gray-300 mb-2"></div>
                <h3 className="font-bold text-center text-gray-700">{m.title || "Untitled"}</h3>
                <p className="text-center text-xs text-gray-500">Created at: {m.created_at}</p>
                <p className="text-center text-xs text-gray-500">Deliver on: {m.deliveryDate}</p>
              </div>
              
          ))
        )}
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-400 hover:bg-blue-500 transition duration-200 p-1 rounded-xl text-white"
      >
        Add message
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md relative">
            <input
              type="text"
              placeholder="New Time Capsule"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded mb-3 text-lg font-semibold"
            />
            
            <textarea
              className="w-full border p-2 rounded mb-3"
              rows={4}
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <input
              type="date"
              min={today}
              className="w-full border p-2 rounded mb-3"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
            />

            {warningMessage !== "" && <p className="warning">
                <FontAwesomeIcon icon={faExclamationCircle}/>
                {" "}
                {warningMessage}
            </p>
            }

            {warningDeliveryDate !== "" && <p className="warning">
                <FontAwesomeIcon icon={faExclamationCircle} />
                {" "}
                {warningDeliveryDate}
            </p>
            }
 
            <div className="flex justify-end gap-2 pt-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {editingMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md relative">
            <input
                type="text"
                value={editingMessage.title}
                onChange={(e) =>
                setEditingMessage({ ...editingMessage, title: e.target.value })
                }
                className="w-full border p-2 rounded mb-3 text-lg font-semibold"
            />
            <textarea
                value={editingMessage.message}
                onChange={(e) =>
                setEditingMessage({ ...editingMessage, message: e.target.value })
                }
                className="w-full border p-2 rounded mb-3"
                rows={4}
            />
            <input
                type="date"
                value={editingMessage.deliveryDate}
                onChange={(e) =>
                setEditingMessage({ ...editingMessage, deliveryDate: e.target.value })
                }
                className="w-full border p-2 rounded mb-3"
            />
            <div className="flex justify-end gap-2 pt-4">
                <button
                className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
                onClick={() => setEditingMessage(null)}
                >
                Cancel
                </button>
                <button
                className="bg-green-500 hover:bg-green-600 px-3 py-1 text-white rounded"
                onClick={() => {
                    if (editingIndex !== null && editingMessage) {
                      const updatedMessages = [...messages]
                      updatedMessages[editingIndex] = editingMessage
                      setMessages(updatedMessages)
                    }
                    setEditingIndex(null)
                    setEditingMessage(null)
                  }}
                >
                Save
                </button>
            </div>
            </div>
        </div>
        )}

    </div>
  )
}

export default Dashboard