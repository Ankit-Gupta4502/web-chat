"use client"
import React, { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'
import { useMutation } from "@tanstack/react-query"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { setCookie } from "nookies"
import { useAuthContext } from '@/Context/AuthContext'
interface IUser {
    id: number
    name: string,
    email: string,
    token: string,
    password: string,
    createdAt: string
}
const LoginForm = () => {
    const [formData, setFormData] = useState({ email: "", password: "", name: "" })
    const { replace } = useRouter()
    const [active, setActive] = useState(0)
    const [error, setError] = useState<{ [key: string]: any }>({})
    const { setUser } = useAuthContext()
    const signInUser = async (): Promise<IUser> => {
        const { data } = await axios.post(`/api/auth/${!active ? "login" : "register"}`, formData)
        return await data.data
    }
    const { mutate, isPending, data } = useMutation<IUser, { [key: string]: any }>({
        mutationKey: ["login"],
        mutationFn: signInUser,
        onSuccess: (data) => {
            setCookie(null, "token", data.token, {
                maxAge: 60 * 60 * 24 * 7,
                path: "/",
            })
            replace("/")
            localStorage.setItem("user", JSON.stringify(data))
            if (data) {
                setUser(data)
            }
        },
        onError(error) {
         
            if (error.message) {
                
            }
            
            setError(error)
        },
    })
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))


    return (
        <div className=' max-w-lg w-full rounded-2xl py-12 px-7 shadow-xl ' >
            <div className="flex space-x-6 items-center justify-center">
                <Button onClick={() => {
                    setActive(0)
                    setError({})
                    setFormData({email:"",name:"",password:""})
                }} variant={!active ? 'default' : "outline"} className=' w-full ' >
                    Sign In
                </Button>

                <Button onClick={() => {
                    setActive(1)
                    setError({})
                    setFormData({email:"",name:"",password:""})
                }} variant={active ? 'default' : "outline"} className=' w-full ' >
                    Sign Up
                </Button>
            </div>
            <div className=' space-y-5 mt-5 ' >

                {!!active && <div>
                    <Label className=' mb-3 block font-medium' >
                        Name
                    </Label>

                    <Input name='name' className={error?.name ? "border-rose-700 placeholder:text-rose-700 text-rose-700" : ""} value={formData.name} onChange={handleChange} placeholder='Enter Your Name' />
                    <span className=' block text-rose-700  ' >
                        {error?.name?.msg}
                    </span>
                </div>}
                <div>
                    <Label className=' mb-3 block font-medium' >
                        Email
                    </Label>

                    <Input name='email' className={error?.email ? "border-rose-700 placeholder:text-rose-700 text-rose-700" : ""} value={formData.email} onChange={handleChange} placeholder='Enter Your Email Address' />
                    <span className=' block text-rose-700  ' >
                        {error?.email?.msg}
                    </span>
                </div>

                <div>
                    <Label className=' mb-3 block font-medium'>
                        Password
                    </Label>

                    <Input className={error?.password ? "border-rose-700 placeholder:text-rose-700 text-rose-700" : ""} type='password' name='password' value={formData.password} onChange={handleChange} placeholder='Enter Your Password' />
                    <span className=' block text-rose-700  ' >
                        {error?.email?.msg}
                    </span>
                </div>
            </div>
            <Button disabled={isPending} onClick={() => mutate()} className='  mt-6 w-full ' >
                Submit
            </Button>

        </div>
    )
}

export default LoginForm