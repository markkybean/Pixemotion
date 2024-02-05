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
  Divider,
  Grid,
} from "@chakra-ui/react";
import Pix from "./Pix";
import firebaseApp from "./firebaseConfig";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { storage } from "./firebaseConfig";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";


import { v4 } from "uuid";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  let navigate = useNavigate();

  const [userProfile, setUserProfile] = useState("");
  const [pix, setPix] = useState("");
  const [pixs, setPixs] = useState([]);
  const [imageUpload, setImageUpload] = useState(null);
  const [imageList, setImageList] = useState([]);

  const imageListRef = ref(storage, "images/");

  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {

    listAll(imageListRef)
    .then((response) => {
      const promises = response.items.map((item) => getDownloadURL(item));
      return Promise.all(promises);
    })
    .then((urls) => {
      setImageList(urls);
    })
    .catch((error) => {
      console.error("Error listing images:", error);
    });


    // Authentication
    const authStateListener = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserProfile({
          email: user.email,
          name: user.displayName,
        });
      } else {
        navigate("/login");
      }
    });

    // Retrieve pix
    const pixsListener = onSnapshot(collection(db, "pixs"), (snapshot) => {
      setPixs(snapshot.docs.map((p) => p.data()));
    });

    // Cleanup function
    return () => {
      authStateListener(); // Unsubscribe from auth state changes
      pixsListener(); // Unsubscribe from pixs collection changes
    };
  }, []);

  const createPix = async () => {
    setButtonLoading(true);

    try {
      if (pix !== "") {
        const pixData = {
          body: pix,
          user_email: userProfile.email,
          name: userProfile.name,
          date_posted: Timestamp.now(),
        };

        // Add Pix data to Firestore
        const docRef = await addDoc(collection(db, "pixs"), pixData);

        // Upload image to Firebase Storage
        uploadImage(docRef.id);

        setPix("");
      } else {
        alert("Pix cannot be empty");
      }
    } catch (error) {
      console.error("Error creating Pix:", error);
    } finally {
      setButtonLoading(false);
    }
  };

  const uploadImage = async (pixId) => {
    if (imageUpload === null) return null;
  
    const imageRef = ref(
      storage,
      `images/${pixId}_${imageUpload.name + v4()}`
      // getDownloadURL(snapshot.ref).then((url)=>{
      //   setImageList((prev) => [...prev, url])
      // })
      
    );
  
    try {
      await uploadBytes(imageRef, imageUpload);
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };
  
  const logout = () => {
    signOut(auth).then(() => {
      navigate("/login");
    });
  };

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
        {/* {imageList.map((url)=>{
        return <img src={url} />
      })} */}

        <Spacer />
        <Box w="700px">
          <Card mt={5} p={5}>
            <FormControl>
              <FormLabel>What's up?</FormLabel>
              <Grid templateColumns="3fr 1fr" gap={4}>
                <Input
                  w="100%"
                  disabled={buttonLoading}
                  type="text"
                  onChange={(e) => setPix(e.target.value)}
                  value={pix}
                />
                <Input
                  w="100%"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setImageUpload(e.target.files[0]);
                  }}
                />
              </Grid>
            </FormControl>
            <Button
              isLoading={buttonLoading}
              size="sm"
              w="100px"
              mt={3}
              onClick={createPix}
            >
              Pix
            </Button>
          </Card>

          <Divider m={5}></Divider>

          {pixs.map((pixRecord, index) => (
            <Pix
              key={pixRecord.id}
              body={pixRecord.body}
              email={pixRecord.user_email}
              name={pixRecord.name}
              date_posted={pixRecord.date_posted.toDate().toString()}
              imageUrl={pixRecord.imageUrl}
              images={imageList} // Pass the imageList as the images prop
              imageIndex={index} // Pass the index as the imageIndex prop
            ></Pix>
          ))}
        </Box>
      </Flex>
    </Container>
  );
}

export default Home;
