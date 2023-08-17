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



// //auth3
// import React, { createContext, useState, useEffect } from "react";
// import jwt_decode from "jwt-decode";

// // will be used to share authentication related data across components
// const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   //it is used for decoding the token and to extract successfully the username role and _id of the user
//   useEffect(() => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (accessToken) {
//       try {
//         const decodedToken = jwt_decode(accessToken);
//         const { userId, username, role } = decodedToken;
//         setUser({ _id: userId, username, role });
//       } catch (error) {
//         console.error("Error decoding token:", error);
//         setUser(null);
//       }
//     } else {
//       setUser(null);
//     }
//   }, []);

//   //same thing as the useEffect it tries to decode the token and extract the user data username, _id and role
//   const login = (token) => {
//     console.log("Logging in with token:", token); // Add this line
//     localStorage.setItem("accessToken", token);

//     try {
//       const decodedToken = jwt_decode(token);
//       const { userId, username, roles } = decodedToken;
//       setUser({ _id: userId, username, roles });
//       console.log("User context updated:", { _id: userId, username, roles }); // Add this line
//     } catch (error) {
//       console.error("Error decoding token:", error);
//       setUser(null);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("accessToken");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export { AuthContext, AuthProvider };






// //auth 4
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
//         const { userId, username, role } = decodedToken;
//         setUser({ _id: userId, username, role });
//       } catch (error) {
//         console.error("Error decoding token:", error);
//         setUser(null);
//       }
//     } else {
//       setUser(null);
//     }
//   }, []);

//   const login = (token) => {
//     localStorage.setItem("accessToken", token);

//     try {
//       const decodedToken = jwt_decode(token);
//       const { userId, username, roles } = decodedToken;
//       setUser({ _id: userId, username, roles });
//     } catch (error) {
//       console.error("Error decoding token:", error);
//       setUser(null);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("accessToken");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export { AuthContext, AuthProvider };




//auth 5
import React, { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
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
      setUser(null);
    }
  }, []);

  const login = (token) => {
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
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  const updateUser = (newUserData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...newUserData,
    }));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
