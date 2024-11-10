import React, {useRef} from 'react';
import axiosInstace from "./util/util.js";
import {useAuth} from './authentication/AuthProvider.jsx'
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const formRef = useRef(null)
    const {login} = useAuth()
    const navigate = useNavigate()
    const handleLogin  =  (e)=>{
        e.preventDefault()

        axiosInstace.post("login", {email: formRef.current.email.value, senha: formRef.current.senha.value}).then(response => {
            const token = response.data.token
            if(response.status === 200){
                localStorage.setItem('token', token)
                login()
                navigate('/dashboard')
            }else{
                navigate('/dashboard')
            }
        })

    }
    return (
        <div className="flex items-center justify-center min-h-screen">
            <form action="" ref={formRef} onSubmit={handleLogin } className={"bg-white p-8 rounded shadow-login flex flex-col gap-2"}>
                <label htmlFor="" className={"text-black font-bold"}>Email:</label>
                <input type="email" name="email" id="" className={"border border-gray-300 rounded"}/>
                <label htmlFor="" className={"text-black font-bold"}>Senha:</label>
                <input type="password" name="senha" id="" className={"border border-gray-300 rounded"}/>
                <div className={"flex justify-end mt-4"}>
                    <button type="submit" className={"rounded bg-blue-600 text-white font-bold p-2"}>Login</button>
                </div>
            </form>
        </div>
    );
};

export default Login;