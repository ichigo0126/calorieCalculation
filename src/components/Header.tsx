import { ChakraProvider, Box, Flex, Heading, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";


const Header = () => {
  return (
    <ChakraProvider>
      <Flex
        as="header"
        align="center"
        justify="space-between"
        padding="4"
        bg="teal.500"
        color="white"
      >
        <Box>
          <Heading as="h1" size="lg">
            Your Logo
          </Heading>
        </Box>
        <Box>
          <Button colorScheme="whiteAlpha" mr="4">
            Sign In
          </Button>
          <Button colorScheme="teal">Sign Up</Button>
        </Box>
        {/* ログインは<Link to={`/login/`}>こちら</Link> */}
      </Flex>
    </ChakraProvider>
  );
};

export default Header;
