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
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AxiosError } from "axios";
import {
  Account,
  useAccountDispatch,
} from "../../data/context/account-context";
import { api } from "../../infra/http";
import { LocalStorageKeys } from "../../storage/keys";
import { DomainField } from "./domain-field";
import {
  CreateAccountDialogProps,
  CreateAccountFields,
  CreateAccountRequest,
  ErrorResponse,
  GetTokenResponse,
} from "./types";
import { useGetDomains } from "./use-get-domains";

// TODO: map http errors code
async function createAccountFetch(
  params: CreateAccountRequest
): Promise<Account> {
  const request = await api.post("/accounts", params);
  return request.data;
}

async function getAccountTokenFetch(
  params: CreateAccountRequest
): Promise<GetTokenResponse> {
  const request = await api.post("/token", params);
  return request.data;
}

async function getAccountInfoFetch(token: string): Promise<Account> {
  // create api instance with authorization token and remove token params
  const request = await api.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return request.data;
}

export function CreateAccountDialog({
  isOpen,
  onClose,
}: CreateAccountDialogProps) {
  const methods = useForm<CreateAccountFields>();

  const dispatch = useAccountDispatch();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors, isValid },
  } = methods;

  const domain = watch("domain");

  const [showPassword, { toggle }] = useBoolean(false);

  // back here to improve this
  const [domainWidth, setDomainWidth] = useState(100);
  const domainFieldRef = useRef<HTMLDivElement>(null);

  const { data: domains } = useGetDomains();

  const toast = useToast();

  const { isPending: isLoadingAccountInfo, mutate: getAccountInfo } =
    useMutation<Account, AxiosError<ErrorResponse>, string>({
      mutationKey: ["account-info"],
      mutationFn: getAccountInfoFetch,
      onSuccess: (data) => {
        // user can create multiple accounts
        localStorage.setItem(LocalStorageKeys.ACCOUNT, JSON.stringify(data));
        dispatch(data);
      },
      onError: (error) => {
        toast({
          title: error.response?.data.detail,
          isClosable: true,
        });
      },
    });

  const { isPending: isLoadingGetToken, mutate: getToken } = useMutation<
    GetTokenResponse,
    AxiosError<ErrorResponse>,
    CreateAccountRequest
  >({
    mutationKey: ["account-token"],
    mutationFn: getAccountTokenFetch,
    onSuccess: (data) => {
      localStorage.setItem(LocalStorageKeys.TOKEN, data.token);
      getAccountInfo(data.token);
    },
    onError: (error) => {
      toast({
        title: error.response?.data.detail,
        isClosable: true,
      });
    },
  });

  const { isPending: isLoadingCreateAccount, mutate: createAccount } =
    useMutation<Account, AxiosError<ErrorResponse>, CreateAccountRequest>({
      mutationKey: ["create-account"],
      mutationFn: createAccountFetch,
      onSuccess: (_, variables) => {
        getToken(variables);
      },
      onError: (error) => {
        toast({
          title: error.response?.data.detail,
          isClosable: true,
        });
      },
    });

  const submit = (data: CreateAccountFields) => {
    const accountData: CreateAccountRequest = {
      address: `${data.username}@${data.domain}`,
      password: data.password,
    };

    createAccount(accountData);

    reset();

    // reset field
    if (domains?.["hydra:member"]) {
      setValue("domain", domains?.["hydra:member"]?.[0]?.domain);
    }

    // onOk(data);
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
          <Button
            type="submit"
            form="create-new-account"
            isDisabled={disabled}
            isLoading={
              isLoadingCreateAccount ||
              isLoadingGetToken ||
              isLoadingAccountInfo
            }
          >
            Create account
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
