import {
    FormControl,
    FormLabel,
    Input,
    Heading,
    Container,
    Box,
    Card,
    CardBody,
    Button,
    Flex,
    Link as ChakraLink,
    Text
} from "@chakra-ui/react";

import { Link } from "react-router-dom";

function Login() {
    return (
        <Flex align="center" justify="center" minHeight="100vh" bg={"lightblue"}>
            <Container borderRadius="xl" maxW={{ base: '100%', md: '75%', lg: '50%', xl: '40%' }} bg=" #8fc1e3" padding={{ base: 4, md: 8 }}>
                <Heading mb={{ base: 3, md: 5 }} fontSize={{ base: '2xl', md: '4xl', lg: '6xl' }}>
                    Welcome to Pixemotions
                </Heading>
                <Text mb={{ base: 3, md: 5 }} fontSize={{ base: '2xl', md: '4xl', lg: '6xl' }}>
                    Create an account
                </Text>

                {/* Login form */}
                <Card borderRadius="xl">
                    <CardBody>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input type="text" />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Confirm Password</FormLabel>
                            <Input type="password" />
                        </FormControl>

                        <Button mt={6} colorScheme="blue" fontSize={{ base: 'sm', md: 'md' }}>
                            Login
                        </Button>
                        <Box mt={4}>
                            <Link to="/" fontSize="sm">
                                <ChakraLink>
                                    Already  have an account? Login here.
                                </ChakraLink>
                            </Link>
                        </Box>
                    </CardBody>
                </Card>
            </Container>
        </Flex>
    );
}

export default Login;
