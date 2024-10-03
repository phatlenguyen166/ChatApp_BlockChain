import React from 'react'

const Register = () => {
  return (
    <div className="formContainer bg-[#a7bcff] h-[100vh] flex items-center justify-center">
    <div className="formWrapper bg-white p-10 rounded-xl flex flex-col gap-3 items-center">
      <span className="logo text-2xl font-bold text-[#5d5b8d] ">
        Chat App
      </span>
      <span className="title text-sm font-bold text-[#5d5b8d] ">
        Register
      </span>
      <form className="flex flex-col gap-4">
        <input
          className="input-style"
          type="text"
          placeholder="Display Name"
        />
        <input className="input-style" type="email" placeholder="Email" />
        <input
          className="input-style"
          type="password"
          placeholder="Password"
        />
        <input className="input-style hidden" id="file" type="file" />
        <label htmlFor="file" className="flex flex-row gap-3 ml-2 items-center text-[#8da4f1] cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
            />
          </svg>
          <span className="ml-1 text-sm">Add an avatar</span>
        </label>

        <button className="button-style">Sign Up</button>
      </form>
      <p className="text-[#5b5d8d] mt-4 text-sm">
        Already have an account? Login
      </p>
    </div>
  </div>
  )
}

export default Register