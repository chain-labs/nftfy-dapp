import React, { useEffect, useState } from "react";
import { ProviderProps, SignerProps } from "../ethereum/types";

const StatesContext = React.createContext({
  provider: null,
  setProvider: null,
  signer: null,
  setSigner: null,
});

export interface StatesProviderProps {
  children?: React.ReactNode;
}

const StatesProvider = ({ children }: StatesProviderProps): JSX.Element => {
  const [provider, setProvider] = useState<ProviderProps>(null);
  const [signer, setSigner] = useState<SignerProps>(null);

  useEffect(() => {
    console.log("Signer=", signer);
  }, [signer]);

  return (
    <StatesContext.Provider
      value={{
        provider,
        signer,
        setProvider,
        setSigner,
      }}
    >
      {children}
    </StatesContext.Provider>
  );
};

export { StatesContext, StatesProvider };
