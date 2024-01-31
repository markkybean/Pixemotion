import {
  Container,
  Box,
  Flex,
  Heading,
  Card,
  Text,
  Button,
  Spacer,
  FormControl,
  FormLabel,
  Input,
  Divider
} from "@chakra-ui/react";
import Pix from "./Pix";
import firebaseApp from "./firebaseConfig";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {

  const auth = getAuth(firebaseApp);

  let navigate = useNavigate();

  const [userProfile, setUserProfile] = useState('')

  useEffect(()=>{
    onAuthStateChanged(auth, (user)=>{
      if(user){
        setUserProfile({
          email: user.email,
          name: user.displayName
        })
      }else{
        navigate('/login');
      }
    });
  },[])

  const logout = () =>{
    signOut(auth).then(() =>{
      navigate("/login");
    });
  }

  return (
    <Container maxW="1024" pt="100">
      <Heading>Pixemotion</Heading>
      <Text>Every Image Tells a Story</Text>
      <Flex>
        <Box w="300px">
          <Card mt={5} me={5} p={5}>
            <Text fontWeight={"bold"}>{userProfile.name}</Text>
            <Text>{userProfile.email}</Text>
            <Button mt={5} size="xs" w={20} onClick={logout}>
              Logout
            </Button>
          </Card>
        </Box>

        <Spacer/>
        <Box w="700px">
        <Card mt={5} p={5}>
            <FormControl>
                <FormLabel>What's up?</FormLabel>
                <Input type="text" />
            </FormControl>
            <Button size="sm" w="100px" mt={3}>Pix</Button>
          </Card>

          <Divider m={5}></Divider>

          <Pix></Pix>
        </Box>
      </Flex>
    </Container>
  );
}
export default Home;
