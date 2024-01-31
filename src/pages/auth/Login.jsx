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
    Text,
    Link as ChakraLink
} from "@chakra-ui/react";

import { Link, useNavigate } from "react-router-dom";
import firebaseApp from '../firebaseConfig';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = getAuth(firebaseApp);

    let navigate = useNavigate();

    useEffect(()=>{
        onAuthStateChanged(auth, (user)=>{
          if(user){
            navigate('/');
          }
        });
      },[])

    const handleLogin = () => {
        if(email!=='' && password!==''){
            signInWithEmailAndPassword(auth, email, password)
            .then(()=>{
                navigate('/');
            }).catch((error) =>{
                Swal.fire({
                    title: "Login Failed",
                    text: "Invalid email or password. Please try again.",
                    icon: "error",
                    confirmButtonColor: "#3498db"
                });  
            })

        }else{
            Swal.fire({
                title: "Login Failed",
                text: "Please make sure all fields are filled, and passwords match.",
                icon: "error",
                confirmButtonColor: "#3498db"
            });    
        }
    }

    return (
        <Flex p={10} align="center" justify="center" minHeight="100vh" bg={"lightblue"}>
            <Container borderRadius="xl" maxW={{ base: '100%', md: '75%', lg: '50%', xl: '40%' }} bg=" #8fc1e3" padding={{ base: 4, md: 8 }} p={10}>
                <Heading mb={{ base: 3, md: 5 }} fontSize={'3xl'}>
                    Welcome to Pixemotions
                </Heading>
                <Text mb={{ base: 3, md: 5 }} fontSize={'2xl'}>
                   Login to your account
                </Text>

                {/* Login form */}
                <Card borderRadius="xl">
                    <CardBody>
                        <FormControl>
                            <FormLabel>Email address</FormLabel>
                            <Input 
                                type="email" 
                                onChange={(e)=>{
                                    setEmail(e.target.value)
                                }}
                                value={email}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Password</FormLabel>
                            <Input 
                                type="password" 
                                onChange={(e)=>{
                                    setPassword(e.target.value)
                                }}
                                value={password}
                            />
                        </FormControl>

                        <Button mt={6} colorScheme="blue" fontSize={{ base: 'sm', md: 'md' }} onClick={handleLogin}>
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
