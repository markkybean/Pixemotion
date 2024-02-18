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

import { Link, useNavigate } from "react-router-dom";
import firebaseApp from "../firebaseConfig";
import { getAuth, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2'

function Register() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const auth = getAuth(firebaseApp);

    let navigate = useNavigate();

    useEffect(()=>{
        onAuthStateChanged(auth, (user)=>{
          if(user){
            navigate('/');
          }
        });
      },[])

    const handleRegistration = ()=>{
        if(
            name !=='' &&
            email !=='' &&
            password !=='' &&
            confirmPassword !=='' &&
            password == confirmPassword
        ){
            //code in register
            createUserWithEmailAndPassword(auth, email, password).then(
                (userCredential)=>{
                    const user=userCredential.user;
                    updateProfile(auth.currentUser, {
                        displayName: name
                    });

                    navigate("/");
                }
            )

            Swal.fire({
                title: "Registration Successful",
                text: "Your account has been successfully created.",
                icon: "success",
                confirmButtonColor: "#38b2ac" // Teal color
            });            
        }else{
            Swal.fire({
                title: "Registration Failed",
                text: "Please make sure all fields are filled, and passwords match.",
                icon: "error",
                confirmButtonColor: "#38b2ac" // Teal color
            });            
        }
    };

    return (
        <Flex p={10} align="center" justify="center" minHeight="100vh" bg={"#f3f3f3"}> {/* Changed background color */}
            <Container borderRadius="xl" maxW={{ base: '100%', md: '75%', lg: '50%', xl: '40%' }} bg="white" padding={{ base: 4, md: 8 }} p={10}> {/* Changed background color */}
                <Heading mb={{ base: 3, md: 5 }} fontSize={'3xl'} color="#38b2ac"> {/* Teal color */}
                    Welcome to Pixemotions
                </Heading>
                <Text mb={{ base: 3, md: 5 }} fontSize={'2xl'} color="#444444"> {/* Changed color */}
                    Create an account
                </Text>

                {/* Login form */}
                <Card borderRadius="xl" bg="#ffffff"> {/* Changed background color */}
                    <CardBody>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input 
                                type="text" 
                                onChange={(e)=>{
                                    setName(e.target.value)
                                }}
                                value={name}
                            />
                        </FormControl>

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

                        <FormControl mt={4}>
                            <FormLabel>Confirm Password</FormLabel>
                            <Input 
                                type="password" 
                                onChange={(e)=>{
                                    setConfirmPassword(e.target.value)
                                }}
                                value={confirmPassword}
                            />
                        </FormControl>

                        <Button mt={6} colorScheme="teal" fontSize={{ base: 'sm', md: 'md' }} onClick={handleRegistration}> {/* Teal color */}
                            Create account
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

export default Register;
