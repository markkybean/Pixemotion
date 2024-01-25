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
    Link as ChakraLink
} from "@chakra-ui/react";

import { Link } from "react-router-dom";

function Login() {
    return (
        <Flex align="center" justify="center" minHeight="100vh" bg={"lightblue"}>
            <Container borderRadius="xl" maxW={{ base: '100%', md: '75%', lg: '50%', xl: '40%' }} bg=" #8fc1e3" padding={{ base: 4, md: 8 }}>
                <Heading mb={{ base: 3, md: 5 }} fontSize={{ base: '2xl', md: '4xl', lg: '6xl' }}>
                    Welcome to Pixemotions
                </Heading>

                {/* Login form */}
                <Card borderRadius="xl">
                    <CardBody>
                        <FormControl>
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" />
                        </FormControl>

                        <Button mt={6} colorScheme="blue" fontSize={{ base: 'sm', md: 'md' }}>
                            Login
                        </Button>
                        <Box mt={4}>
                            <Link to="/register" fontSize="sm">
                                <ChakraLink>
                                Don't have an account? Register here.
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
