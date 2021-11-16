import theme from "src/styleguide/theme";
import Box from "./Box";
import Text from "./Text";

export interface InputProps {
  label: string;
  placeholder?: string;
  set: (any) => void;
  data: any;
}

const LabelledInput = ({ label, placeholder, set, data }: InputProps) => {
  return (
    <Box column justifyContent="flex-end" mb="2rem" maxWidth="70rem">
      <Text fontSize="12px" fontWeight="semi-bold" mb="0.4rem">
        {label}
      </Text>
      <Box
        as="input"
        value={data}
        onChange={(e) => set(e.target.value)}
        placeholder={placeholder}
        px="1.2rem"
        py="1rem"
        fontSize="14px"
        minWidth="40rem"
        bg={`${theme.colors["secondary-black"]}00`}
        border="1px solid"
        borderColor={`${theme.colors["purple-black"]}11`}
        borderRadius="4px"
        outline="none"
      ></Box>
    </Box>
  );
};

export default LabelledInput;
