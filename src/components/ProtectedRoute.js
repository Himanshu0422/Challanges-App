import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setUser } from '../redux/userSlice';

const ProtectedRoute = (props) => {

    const URL = process.env.REACT_APP_BACKEND_API;
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const getUser = async () => {
        try {
			const res = await axios.post(`${URL}/user/get-user-info-by-id`, {token: localStorage.getItem('token')}, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if(res.data.success){
                dispatch(setUser(res.data.data));
            }else{
                localStorage.clear();
                navigate('/login')
            }
        } catch (error) {
            localStorage.clear();
            navigate('/login')
        }
    }
    useEffect(() => {
        if(!user){
            getUser()
        }
    }, [user])

    if(localStorage.getItem('token')){
        return props.children
    }else{
        return <Navigate to='/login' />;
    }
}

export default ProtectedRoute;