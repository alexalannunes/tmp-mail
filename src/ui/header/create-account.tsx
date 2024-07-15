import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useBoolean,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { DomainField } from "./domain-field";
import { CreateAccountDialogProps, CreateAccountFields } from "./types";

export function CreateAccountDialog({
  isOpen,
  onOk,
  onClose,
}: CreateAccountDialogProps) {
  const methods = useForm<CreateAccountFields>();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isValid },
  } = methods;

  const domain = watch("domain");

  const [showPassword, { toggle }] = useBoolean(false);

  // back here to improve this
  const [domainWidth, setDomainWidth] = useState(100);
  const domainFieldRef = useRef<HTMLDivElement>(null);

  const submit = (data: CreateAccountFields) => {
    reset();
    onOk(data);
  };

  const hasErrors = !!Object.keys(errors).length;
  const isInvalid = !isValid;

  const disabled = hasErrors || isInvalid;

  useEffect(() => {
    if (domainFieldRef.current) {
      // 8 padding
      setDomainWidth(domainFieldRef.current.clientWidth + 8);
    }
  }, [domain]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create an account</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormProvider {...methods}>
            <Stack
              as="form"
              id="create-new-account"
              onSubmit={handleSubmit(submit)}
            >
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Flex>
                  {/* fix padding right */}
                  <Input
                    {...register("username", { required: true })}
                    placeholder={"Username"}
                    autoComplete="off"
                    pr={domainWidth}
                  />
                  <Box position={"absolute"} right={0} ref={domainFieldRef}>
                    <Controller
                      control={control}
                      name="domain"
                      render={({ field }) => {
                        return (
                          <DomainField
                            value={field.value}
                            onChange={field.onChange}
                          />
                        );
                      }}
                    />
                  </Box>
                </Flex>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...register("password", { required: true })}
                    placeholder="Password"
                  />
                  <InputRightElement>
                    <IconButton
                      icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                      onClick={toggle}
                      aria-label="View password"
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </Stack>
          </FormProvider>
        </ModalBody>

        <ModalFooter>
          <Button variant={"ghost"} mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="create-new-account" isDisabled={disabled}>
            Create account
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
