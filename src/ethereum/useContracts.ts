import { ethers, providers } from "ethers";
import { useEffect, useState } from "react";
import contracts from "../contracts/contracts.json";
import { ProviderProps } from "./types";

export const getContractDetails = async (contractName, provider) => {
  if (provider?.provider) {
    console.log(provider);
    // const network = contracts["4"];
    const network = contracts[(await provider.getNetwork()).chainId.toString()];
    console.log(network,(await provider.getNetwork()).chainId.toString(), provider.getNetwork());
    const contractDetails =
      network[Object.keys(network)[0]].contracts[contractName];
    console.log(contractDetails)
    return { address: contractDetails.address, abi: contractDetails.abi };
  } else {
    const network = contracts["4"];
    console.log(network);
    const contractDetails =
      network[Object.keys(network)[0]].contracts[contractName];
    console.log(contractDetails)
    return { address: contractDetails.address, abi: contractDetails.abi };
  }
};

const useContract = (contractName: string, provider: ProviderProps): any => {
  const [contract, setContract] = useState(null);
  useEffect(() => {
    console.log("UseContract started",contractName, provider);
    if (providers.Provider.isProvider(provider)) {
      try {
        getContractDetails(contractName, provider)
        .then(({address, abi}) => {
          console.log("This is working");
          console.log(address,abi, provider);
          setContract(new ethers.Contract(address, abi, provider));
        });
      } catch (error) {
        setContract(undefined);
        console.log(provider, contract);
        console.log(error);
        return error.message;
      }
    }
  }, [provider]);

  return contract;
};

export default useContract;
