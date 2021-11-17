import { useEffect, useState } from "react";
import theme from "src/styleguide/theme";
import Box from "./Box";
import Text from "./Text";

export interface InputProps {
  label: string;
  placeholder?: string;
  set: (any) => void;
  data: any;
}

const LabelledDateTime = ({ label, placeholder, set, data }: InputProps) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleDateChange = (e) => {
    e.preventDefault();
    setDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    e.preventDefault();
    setTime(e.target.value);
  };

  useEffect(() => {
    console.log(
      Date.parse(
        `${date} ${time} GMT${new Date().toString().split("GMT")[1]}`
      ) / 1000
    );

    set(
      Date.parse(
        `${date} ${time} GMT${new Date().toString().split("GMT")[1]}`
      ) / 1000
    );
  }, [date, time, set]);

  return (
    <Box column justifyContent="flex-end" mb="2rem" maxWidth="70rem">
      <Text fontSize="12px" fontWeight="semi-bold" mb="0.4rem">
        {label}
      </Text>
      <Box row>
        <Box as="input" type="date" value={date} onChange={handleDateChange} />
        <Box
          as="input"
          type="time"
          value={time}
          onChange={handleTimeChange}
          step="1"
        />
      </Box>
    </Box>
  );
};

export default LabelledDateTime;
