import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/Auth/AuthContext";
import openSocket from "socket.io-client";

const UserManageStatus = () => {
    const { user } = useContext(AuthContext);

    useEffect(() => {
		const socket = openSocket(process.env.REACT_APP_BACKEND_URL, {query: {userId: user.id}});
        return () => {
            socket.disconnect();
        };

	}, [user]);
    return (<></>);
}

export default UserManageStatus;