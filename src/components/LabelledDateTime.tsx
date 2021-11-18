import { useEffect, useState } from "react";
import TimezoneSelect from "react-timezone-select";
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
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const handleDateChange = (e) => {
    e.preventDefault();
    setDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    e.preventDefault();
    setTime(e.target.value);
  };

  useEffect(() => {
    console.log({ timezone });
    setTimezone(timezone);

    // @ts-ignore
    const label = timezone?.label?.split(" ")[0];

    const finalTime = `${date} ${time} ${
      label?.substring(1, label.length - 1) ??
      `GMT${new Date().toString().split("GMT")[1]}`
    }`;

    console.log({ label, finalTime, data });
    set(
      Date.parse(
        `${date} ${time} ${
          label?.substring(1, label.length - 1) ??
          `GMT${new Date().toString().split("GMT")[1]}`
        }`
      ) / 1000
    );
  }, [date, time, set, timezone, data]);

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
        {/* @ts-ignore */}
        <TimezoneSelect value={timezone} onChange={setTimezone} />
      </Box>
    </Box>
  );
};

export default LabelledDateTime;
