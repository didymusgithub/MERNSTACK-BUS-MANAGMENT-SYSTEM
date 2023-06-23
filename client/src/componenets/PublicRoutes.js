import React, { useEffect }  from "react";
import {  useNavigate } from "react-router-dom";

// this is to check if the user token is already exist in the locat storage
function PublicRoute({children}){
    const navigate = useNavigate();

    useEffect(() =>{
        if(localStorage.getItem('token')){
            navigate("/");
        }
    }, [])
    return (
        <div>
            {children}
        </div>
    )

}

export default PublicRoute