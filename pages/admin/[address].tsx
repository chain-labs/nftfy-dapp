import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Box from "src/components/Box";
import { StatesContext } from "src/components/StatesContext";
import AdminComp from "src/containers/admin";
import useContract, { getContractDetails } from "src/ethereum/useContracts";

const AdminPage = () => {
  const state = useContext(StatesContext);
  const router = useRouter();

  const [contractAddress, setContractAddress] = useState<string>("");

  useEffect(() => {
    if (!router.isReady) return;
    setContractAddress(router.query.address as string);
  }, [router.isReady]);

  if (!state.provider || !state.signer || !contractAddress) return null;
  return <AdminComp contractAddress={contractAddress} />;
};

export default AdminPage;
