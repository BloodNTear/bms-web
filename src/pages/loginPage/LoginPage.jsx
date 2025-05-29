import React from 'react';
import './LoginPage.css';

import {useRef, useState, useEffect, useContext} from 'react';
import { useNavigate} from 'react-router';
import  AuthContext  from '../../contexts/authContext';
import { useAxiosWithAuth } from '../../api/useAxiosWithAuth';


import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";

const LOGIN_URL = 'account/login';

function LoginPage(){
  const axiosInstance = useAxiosWithAuth();
  const navigate = useNavigate();
  const {setAuth} = useContext(AuthContext);

  //#region UI handling code
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(
      () => {
          userRef.current.focus();
      }, []
  );

  useEffect(
    () => {
        setErrMsg('');
    }, [user, password]
  );
  //#endregion

  const HandleLogin = async (e) => {
    e.preventDefault();

    try {
        
        const response = await axiosInstance.post(LOGIN_URL, 
                                          JSON.stringify({
                                                company_code: "localhost",
                                                remember: false,
                                                email: user,
                                                password: password
                                            })
                                          );
        const responseData = response?.data;
        
        const requestStatus = responseData?.status;
        const requestErrMsg = responseData?.errorMessage;

        if(!requestStatus){
            setErrMsg(requestErrMsg);
        }else{
            const token = responseData?.data.tokenKey;
    
            setAuth({token});
            setUser('');
            setPassword('');

            navigate('/App');
        }
    } catch(error){
        if(!error?.response){
            setErrMsg('No Server Response');
        } else if(error.response?.status === 400){
            setErrMsg('Required Information was not fully received');
        } else {
            setErrMsg('Login Failed. Please contact software manager to get help');
        }

        errRef.current.focus();
    }
  }

  return (
            <div className="login-wrapper">
                <div className="login-form">
                    <div className="login-title">
                        <h1>Đăng nhập</h1>
                    </div>
                    <form onSubmit={HandleLogin} >
                        <section className="errorSection">
                        <p ref={errRef}
                        aria-live="assertive">
                        {errMsg}
                        </p>    
                        </section>

                        <div className="input-box">
                            <input type="text"
                                id="Username"
                                placeholder="Điền tên đăng nhập"
                                required

                                ref={userRef}
                                onChange={(e) => setUser(e.target.value)}
                                value={user}/>
                            <FaUser className='icon'/>
                        </div>

                        <div className="input-box">
                            <input type="password" 
                                id="Password"
                                placeholder="Điền mật khẩu"
                                required
                                
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}/>
                            <RiLockPasswordFill className='icon'/>
                        </div>

                        <button>Login</button>
                    </form>
                </div>        
            </div> 
        )
}

export default LoginPage;
