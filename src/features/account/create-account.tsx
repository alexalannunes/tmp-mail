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
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useLocalStorage } from "usehooks-ts";
import {
  Account,
  useAccountDispatch,
} from "../../data/context/account-context";
import { useCreateAccount } from "../../hooks/account/use-create-account";
import { useGetMe } from "../../hooks/account/use-get-me";
import { useGetToken } from "../../hooks/account/use-get-token";
import { LocalStorageKeys } from "../../storage/keys";
import { DomainField } from "./domain-field";
import {
  AccountTokenType,
  CreateAccountDialogProps,
  CreateAccountFields,
  CreateAccountRequest,
} from "./types";
import { useGetDomains } from "./use-get-domains";
import { useMessages } from "../../pages/inbox/inbox";

export function CreateAccountDialog({
  isOpen,
  onClose,
}: CreateAccountDialogProps) {
  const methods = useForm<CreateAccountFields>();

  const [, setAccounts] = useLocalStorage<Account[]>(
    LocalStorageKeys.ACCOUNTS,
    []
  );
  const [, setAccount] = useLocalStorage<Account | undefined>(
    LocalStorageKeys.ACCOUNT,
    undefined
  );

  const [, setAccountToken] = useLocalStorage<AccountTokenType>(
    LocalStorageKeys.TOKEN,
    { jwt: "" }
  );

  const dispatch = useAccountDispatch();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    getValues,
    formState: { errors, isValid },
  } = methods;

  const domain = watch("domain");

  const [showPassword, { toggle }] = useBoolean(false);

  // back here to improve this
  const [domainWidth, setDomainWidth] = useState(100);
  const domainFieldRef = useRef<HTMLDivElement>(null);

  const { data: domains } = useGetDomains();

  const toast = useToast();

  const { refetch } = useMessages();

  const { isLoadingAccountInfo, getAccountInfo } = useGetMe({
    // warning: coupling
    toast,
    onSuccess: (data) => {
      // *********** this block can be in another creation hook
      const accountData = {
        ...data,
        password: getValues("password"),
      };

      // set current account after crated
      setAccount(accountData);
      // store account to accounts array

      setAccounts((prev) => [...prev, accountData]);
      dispatch(accountData);
      // *********** this block can be in another creation hook

      reset();

      // reset field
      if (domains?.["hydra:member"]) {
        setValue("domain", domains?.["hydra:member"]?.[0]?.domain);
      }

      // refetch messages
      refetch();

      onClose();
    },
  });

  // re-use this function to login
  const { isLoadingGetToken, getToken } = useGetToken({
    toast,
    onSuccess: (data) => {
      setAccountToken({
        jwt: data.token,
      });
      getAccountInfo();
    },
  });

  const { isLoadingCreateAccount, createAccount } = useCreateAccount({
    toast,
    onSuccess: (_, variables) => getToken(variables),
  });

  const submit = (data: CreateAccountFields) => {
    const accountData: CreateAccountRequest = {
      address: `${data.username}@${data.domain}`,
      password: data.password,
    };

    createAccount(accountData);
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

  const isLoading =
    isLoadingCreateAccount || isLoadingGetToken || isLoadingAccountInfo;
  const isDisabled = isLoading;

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
          <Button
            variant={"ghost"}
            mr={3}
            onClick={onClose}
            isDisabled={isDisabled}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-new-account"
            isDisabled={disabled}
            isLoading={isLoading}
          >
            Create account
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
