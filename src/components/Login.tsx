import {
  ChakraProvider,
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <ChakraProvider>
      <Flex height="100vh" align="center" justify="center">
        <Box
          width="400px"
          p={8}
          borderWidth={1}
          borderRadius={8}
          boxShadow="lg"
        >
          <Heading mb={4}>Login</Heading>
          <form>
            <FormControl mb={4}>
              <FormLabel>Email address</FormLabel>
              <Input type="email" placeholder="Enter your email" />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Password</FormLabel>
              <Input type="password" placeholder="Enter your password" />
            </FormControl>
            <Button colorScheme="teal" type="submit" width="full" mb={4}>
              Sign In
            </Button>
            <div>
              新規登録は<Link to={`/register/`}>こちら</Link>
            </div>
          </form>
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default Login;
