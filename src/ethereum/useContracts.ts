import { ethers, providers } from "ethers";
import { useEffect, useState } from "react";
import contracts from "../contracts/contracts.json";
import { ProviderProps } from "./types";

export const getContractDetails = (contractName, provider) => {
  if (provider?.provider) {
    const network = contracts[provider.provider.networkVersion];
    const contractDetails =
      network[Object.keys(network)[0]].contracts[contractName];
    return { address: contractDetails.address, abi: contractDetails.abi };
  } else {
    const network = contracts["4"];
    const contractDetails =
      network[Object.keys(network)[0]].contracts[contractName];
    return { address: contractDetails.address, abi: contractDetails.abi };
  }
};

const useContract = (contractName: string, provider: ProviderProps): any => {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (providers.Provider.isProvider(provider)) {
      try {
        const { address, abi } = getContractDetails(contractName, provider);
        console.log("This is working");
        console.log(address,abi, provider);
        setContract(new ethers.Contract(address, abi, provider));
      } catch (error) {
        setContract(undefined);
        console.log(error);
        return error.message;
      }
    }
  }, [provider]);

  return contract;
};

export default useContract;
