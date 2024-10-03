import React from 'react'

const Login = () => {
  return (
    <div className="formContainer bg-[#a7bcff] h-[100vh] flex items-center justify-center">
      <div className="formWrapper bg-white p-10 rounded-xl flex flex-col gap-3 items-center">
        <span className="logo text-2xl font-bold text-[#5d5b8d] ">
          Chat App
        </span>
        <span className="title text-sm font-bold text-[#5d5b8d] ">Login</span>
        <form className="flex flex-col gap-4">
          <input className="input-style" type="email" placeholder="Email" />
          <input
            className="input-style"
            type="password"
            placeholder="Password"
          />

          <button className="button-style">Sign in</button>
        </form>
        <p className="text-[#5b5d8d] mt-4 text-sm">
          You don't have an account? Regiter
        </p>
      </div>
    </div>
  )
}

export default Login