import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Box from "src/components/Box";
import LabelledInput from "src/components/LabelledInput";
import Text from "src/components/Text";

export interface IPayment {
  payees: string[];
  shares: string[];
  nftify: string;
  nftifyShares: BigNumber;
}

const PaymentSplit = ({
  paymentSplit,
  setPaymentSplit,
}: {
  paymentSplit: IPayment;
  setPaymentSplit: (IPayment) => void;
}) => {
  const [percent, setPercent] = useState(0);
  const [payee, setPayee] = useState("");
  const [maxShare, setMaxShare] = useState(85);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    let shares = maxShare;
    paymentSplit?.shares?.forEach((share) => {
      shares -= parseInt(share);
    });
    setMaxShare(shares);
  }, []);

  const onSave = () => {
    setPaymentSplit({
      payees: [...paymentSplit?.payees, payee],
      shares: [...paymentSplit?.shares, percent.toString()],
      nftify: paymentSplit?.nftify,
      nftifyShares: paymentSplit?.nftifyShares,
    });
    setPayee("");
    setMaxShare(maxShare - percent);
    setPercent(0);
    setShowAdd(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPercent(parseFloat(e.target.value));
  };

  const removePayee = (index) => {
    const share = paymentSplit?.shares[index];
    setMaxShare(maxShare + parseInt(share));
    const newPayees = [...paymentSplit?.payees];
    newPayees.splice(index, 1);
    const newShares = [...paymentSplit?.shares];
    newShares.splice(index, 1);
    const newPaymentSplit = {
      payees: newPayees,
      shares: newShares,
      nftify: paymentSplit?.nftify,
      nftifyShares: paymentSplit?.nftifyShares,
    };

    setPaymentSplit(newPaymentSplit);
    console.log(newPaymentSplit, index, share);
  };
  return (
    <React.Fragment>
      <Text color="grey" fontSize="1.6rem" mb="3.2rem">
        PAYMENT SPLITTER
      </Text>
      <Box row mb="2rem">
        <Text fontSize="1.6rem" mr="1.2rem">
          NFTfy:
        </Text>
        <Text fontSize="1.6rem">15%</Text>
      </Box>
      {paymentSplit?.payees?.map((payee, index) => (
        <Box key={index} row mb="2rem" alignItems="center">
          <Text fontSize="1.6rem" mr="1.2rem">
            {payee}:
          </Text>
          <Text fontSize="1.6rem">{paymentSplit?.shares[index]}%</Text>
          <Box
            as="button"
            bg="white"
            border="none"
            onClick={() => removePayee(index)}
            color="primary-red"
            fontSize="1.2rem"
            ml="4rem"
            cursor="pointer"
          >
            Remove
          </Box>
        </Box>
      ))}
      <Text
        as="h4"
        color="primary-blue"
        cursor="pointer"
        display={showAdd || maxShare == 0 ? "none" : "block"}
        onClick={() => setShowAdd(true)}
      >
        + Add Beneficiary
      </Text>
      <Text>Remaining: {maxShare}%</Text>
      <Box mt="2rem" display={!showAdd ? "none" : "block"}>
        <Box row alignItems="center">
          <LabelledInput
            label="Address of Beneficiary"
            data={payee}
            set={setPayee}
          />
          <Text fontSize="2rem" ml="4rem">
            {percent}%
          </Text>
        </Box>
        <input
          type="range"
          list="tickmarks"
          value={percent}
          step="1"
          onChange={handleChange}
          min="0"
          max={maxShare.toString()}
          style={{ width: `${maxShare}rem` }}
        />
        <datalist id="tickmarks">
          <option value="0"></option>
          <option value="10"></option>
          <option value="20"></option>
          <option value="30"></option>
          <option value="40"></option>
          <option value="50"></option>
          <option value="60"></option>
          <option value="70"></option>
          <option value="80"></option>
          <option value="90"></option>
          <option value="100"></option>
        </datalist>
        <Box row justifyContent="flex-start" mt="4rem">
          <Box
            fontSize="1.6rem"
            bg="primary-red"
            color="white"
            py="1.2rem"
            px="2rem"
            borderRadius="8px"
            mr="2rem"
            cursor="pointer"
            onClick={() => setShowAdd(false)}
          >
            Cancel
          </Box>
          <Box
            fontSize="1.6rem"
            bg="primary-blue"
            color="white"
            py="1.2rem"
            px="2.4rem"
            borderRadius="8px"
            cursor="pointer"
            onClick={onSave}
          >
            Save
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default PaymentSplit;
