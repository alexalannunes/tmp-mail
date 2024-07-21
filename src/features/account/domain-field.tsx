import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FaChevronDown } from "react-icons/fa";
import { CreateAccountFields, DomainFieldProps } from "./types";
import { useGetDomains } from "../../hooks/account/use-get-domains";

export function DomainField({ onChange, value }: DomainFieldProps) {
  const [localValue, setLocalValue] = useState(value);
  const { setValue } = useFormContext<CreateAccountFields>();

  const { isPending, data: domains } = useGetDomains();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (option: string) => {
    onChange(option);
  };

  useEffect(() => {
    // after all, create a dto do avoid use this structure
    if (domains?.["hydra:member"]) {
      setValue("domain", domains?.["hydra:member"][0].domain);
    }
    // enable eslint
  }, []);

  return (
    <Menu>
      <MenuButton
        w="full"
        fontWeight={"normal"}
        as={Button}
        rightIcon={<FaChevronDown fontSize={12} />}
        isLoading={isPending}
      >
        {localValue ?? domains?.["hydra:member"]?.[0]?.domain}
      </MenuButton>
      <MenuList>
        {domains?.["hydra:member"].map((domain) => (
          <MenuItem
            p={0}
            key={domain.id}
            onClick={() => handleChange(domain.domain)}
          >
            <Box
              py={1.5}
              w={"full"}
              px={3}
              bg={localValue === domain.domain ? "gray.200" : "transparent"}
              _dark={{
                bg: localValue === domain.domain ? "gray.600" : "transparent",
              }}
            >
              {domain.domain}
            </Box>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
