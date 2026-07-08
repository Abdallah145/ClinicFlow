import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../firebaseConfig'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

const Login = () => {
  const navigate = useNavigate()
  const [state, setState] = useState('Sign Up')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (state === 'Sign Up') {
        // 1. Create user credential profile inside Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // 2. Initialize their database profile record document with a explicit patient role
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: name,
          email: email,
          phone: phone,
          role: 'patient', // Default account registration role type
          createdAt: new Date()
        })

        alert('Account created successfully!')
        navigate('/') // Route back to client homepage view context
      } else {
        // 3. Authenticate returning session tokens for login profiles
        await signInWithEmailAndPassword(auth, email, password)
        alert('Logged in successfully!')
        navigate('/')
      }
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? "Create Account" : "Login"}</p>
        <p>Please {state === 'Sign Up' ? "sign up" : "log in"} to book appointment</p>

        {error && (
          <div className='w-full p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200'>
            {error}
          </div>
        )}

        {
          state === 'Sign Up' && (
            <div className='w-full'>
              <p>Full Name</p>
              <input
                className='border border-zinc-300 rounded w-full p-2 mt-1'
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </div>
          )
        }

        {
          state === 'Sign Up' && (
            <div className='w-full'>
              <p>Phone Number</p>
              <input
                className='border border-zinc-300 rounded w-full p-2 mt-1'
                type="tel"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                required
              />
            </div>
          )
        }

        <div className='w-full'>
          <p>Email</p>
          <input
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className='w-full'>
          <p>Password</p>
          <input
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        <button
          disabled={loading}
          type='submit'
          className='bg-primary text-white w-full py-2 rounded-md text-base mt-2 disabled:bg-zinc-400'
        >
          {loading ? "Processing..." : (state === 'Sign Up' ? "Create account" : "Login")}
        </button>

        {
          state === 'Sign Up'
            ? <p>Already have an account? <span onClick={() => { setState('Login'); setError(''); }} className='text-primary underline cursor-pointer'>Login here</span></p>
            : <p>Create a new account? <span onClick={() => { setState('Sign Up'); setError(''); }} className='text-primary underline cursor-pointer'>Click here</span></p>
        }
      </div>
    </form>
  )
}

export default Login