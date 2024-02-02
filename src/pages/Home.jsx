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
import { getFirestore, addDoc, collection, Timestamp, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {

  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  let navigate = useNavigate();

  const [userProfile, setUserProfile] = useState('')
  const [pix, setPix] = useState('');
  const [pixs, setPixs] = useState([]);

  const [buttonLoading, setButtonLoading] = useState(false);


  
  useEffect(()=>{

    //Authentication
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

    // retrieved pix

    onSnapshot(collection(db, "pixs"), snapshot => {

      setPixs(snapshot.docs.map(p=>p.data()));
      // const pixList = [];
      // snapshot.forEach(px=>{
      //   pixList.push(px.data())
      // })
      // setPixs(pixList);
    });

  },[])

  const createPix = () => { 
    setButtonLoading(true);
    if(pix!==''){

      const pixData = {
        body: pix,
        user_email: userProfile.email,
        name: userProfile.name,
        date_posted: Timestamp.now()
      }
      addDoc( collection(db, "pixs"), pixData).then(()=>{
        setPix('');
        setButtonLoading(false);
      });

    }else{
      alert("Pix cannot be empty").then(()=>{
        setButtonLoading(false);
      });
    }
  }

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
                <Input disabled={buttonLoading} type="text" onChange={(e)=>{setPix(e.target.value)}} value={pix} />
            </FormControl>
            <Button isLoading={buttonLoading} size="sm" w="100px" mt={3} onClick={createPix}>Pix</Button>
          </Card>

          <Divider m={5}></Divider>

          {
            pixs.map((pixRecord) => (
              <Pix
                key={pixRecord.id}
                body={pixRecord.body}
                email={pixRecord.user_email}
                name={pixRecord.name}
                date_posted={pixRecord.date_posted.toDate().toString()}
              ></Pix>
            ))
          }


          
        </Box>
      </Flex>
    </Container>
  );
}
export default Home;
