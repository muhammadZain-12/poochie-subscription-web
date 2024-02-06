import React from "react";
import { useState } from "react";
import UserContext from "./context";



export const UserState = ({ children }) => {

    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
