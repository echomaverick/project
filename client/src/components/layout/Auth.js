// import React, { createContext, useState, useEffect } from "react";
// import jwt_decode from "jwt-decode";

// const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (accessToken) {
//       try {
//         const decodedToken = jwt_decode(accessToken);
//         const { username, roles } = decodedToken; // Extract the username and roles from the token
//         setUser({ username, roles }); // Set the user object with the username and roles
//       } catch (error) {
//         console.error("Error decoding token:", error);
//       }
//     }
//   }, []);

//   const logout = () => {
//     localStorage.removeItem("accessToken");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export { AuthContext, AuthProvider };


//auth2
// import React, { createContext, useState, useEffect } from "react";
// import jwt_decode from "jwt-decode";

// const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (accessToken) {
//       try {
//         const decodedToken = jwt_decode(accessToken);
//         const { userId, username, roles } = decodedToken; // Extract the userId from the token
//         setUser({ _id: userId, username, roles }); // Set the user object with the correct _id field
//       } catch (error) {
//         console.error("Error decoding token:", error);
//       }
//     }
//   }, []);

//   const logout = () => {
//     localStorage.removeItem("accessToken");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export { AuthContext, AuthProvider };



//auth3
import React, { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for the token in local storage on component mount
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      try {
        const decodedToken = jwt_decode(accessToken);
        const { userId, username, role } = decodedToken;
        setUser({ _id: userId, username, role });
      } catch (error) {
        console.error("Error decoding token:", error);
        setUser(null);
      }
    } else {
      // If there's no token in local storage, set the user to null
      setUser(null);
    }
  }, []);

  const login = (token) => {
    // Save the token in local storage
    localStorage.setItem("accessToken", token);

    try {
      const decodedToken = jwt_decode(token);
      const { userId, username, roles } = decodedToken;
      setUser({ _id: userId, username, roles });
    } catch (error) {
      console.error("Error decoding token:", error);
      setUser(null);
    }
  };

  const logout = () => {
    // Clear the token from local storage
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider }; // Remove "login" from here


