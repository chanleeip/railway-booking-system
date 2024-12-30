import { FormEvent, useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import '@/app/globals.css'
export default function LoginPage() {
  const router = useRouter()
  const [responseMessage, setResponseMessage] = useState<string | null>(null) // State to store the response message

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (response.ok) {
      const { token,username } = await response.json() 
      console.log(token)
      Cookies.set('authToken', token, { expires: 1, secure: false, sameSite: 'Strict' })
      Cookies.set('username', username, { expires: 1, secure: false, sameSite: 'Strict' })
      router.push({pathname: '/trains/TRAIN-A'}
      )
    } else {
      const errorMessage = await response.text() 
      setResponseMessage(`Error ${response.status}: ${errorMessage}`)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen  bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full sm:w-80"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center text-black">Login</h2>
        
        <div className="mb-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            className="w-full p-2 border border-gray-300 rounded-md text-black"
          />
        </div>

        <div className="mb-6">
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full p-2 border border-gray-300 rounded-md text-black"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Login
        </button>

        {responseMessage && (
          <div
            className="mt-4 p-4 bg-red-500 text-white rounded-md"
            role="alert"
          >
            {responseMessage}
          </div>
        )}
      </form>
    </div>
  )
}