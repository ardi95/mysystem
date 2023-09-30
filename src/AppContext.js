import React, {useState, createContext, useContext} from 'react';

const GlobalContext = createContext()
function GlobalProvider({children}){
   const [profileGlobal, setProfileGlobal] = useState(null);

   const addProfileGlobal = profileGlobal => setProfileGlobal(profileGlobal);

   return <GlobalContext.Provider value={{ profileGlobal, addProfileGlobal }}>{children}</GlobalContext.Provider>
}

const useGlobal = () => useContext(GlobalContext)

export { GlobalProvider, useGlobal, GlobalContext }