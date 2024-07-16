import {
  Button,
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
import { FormProvider, useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useLocalStorage } from "usehooks-ts";
import {
  Account,
  useAccountDispatch,
} from "../../data/context/account-context";
import { useGetMe } from "../../hooks/account/use-get-me";
import { useGetToken } from "../../hooks/account/use-get-token";
import { LocalStorageKeys } from "../../storage/keys";
import {
  AccountTokenType,
  CreateAccountDialogProps,
  CreateAccountRequest,
  LoginAccountFields,
} from "./types";

export function LoginAccountDialog({
  isOpen,
  onClose,
}: CreateAccountDialogProps) {
  const methods = useForm<LoginAccountFields>();

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
    getValues,
    formState: { errors, isValid },
  } = methods;

  const [showPassword, { toggle }] = useBoolean(false);

  const toast = useToast();

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

      dispatch(accountData);
      // *********** this block can be in another creation hook

      onClose();
      reset();
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

  const submit = (data: LoginAccountFields) => {
    const accountData: CreateAccountRequest = {
      address: data.email,
      password: data.password,
    };

    getToken(accountData);
  };

  const hasErrors = !!Object.keys(errors).length;
  const isInvalid = !isValid;

  const disabled = hasErrors || isInvalid;

  const isLoading = isLoadingGetToken || isLoadingAccountInfo;
  const isDisabled = isLoading;

  return (
    // convert modal to a modal component to accept title, body and button props
    <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Login to your account</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormProvider {...methods}>
            <Stack
              as="form"
              id="create-new-account"
              onSubmit={handleSubmit(submit)}
            >
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  {...register("email", { required: true })}
                  placeholder={"Email"}
                  autoComplete="off"
                />
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
            Login
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
