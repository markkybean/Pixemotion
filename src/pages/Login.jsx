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
    Link
  } from "@chakra-ui/react";

function Login(){
    return (
        <Flex align="center" justify="center" minHeight="100vh" bg={"lightblue"}>
            <Container maxW={{ base: '100%', md: '75%', lg: '50%', xl: '40%' }} bg=" #8fc1e3" padding={40}>
                <Heading mb={5} fontSize={{ base: '2xl', md: '4xl', lg: '6xl' }}>
                    Welcome to Pixemotions
                </Heading>

                {/* Login form */}
                <Card>
                    <CardBody>
                        <FormControl>
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" />

                        </FormControl>
                        <FormControl>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" />
                        </FormControl>

                        <Button mt={5} colorScheme="blue">Login</Button>
                        <Box mt={5}>
                            <Link>Don't have an account? Register here.</Link>
                        </Box>
                    </CardBody>
                </Card>
            </Container>
        </Flex>
    );
}
export default Login;