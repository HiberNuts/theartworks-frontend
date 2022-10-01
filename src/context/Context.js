import React, { useEffect, useState } from "react";

export const PagesContext = React.createContext();

export const PagesProvider = ({ children }) => {
  const [Dao, setDao] = useState(false);

  return <PagesContext.Provider value={{ Dao, setDao }}>{children}</PagesContext.Provider>;
};
