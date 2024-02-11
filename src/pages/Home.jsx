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
  InputRightElement,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
} from "@chakra-ui/react";
import { FiUpload } from "react-icons/fi"; // Import the upload icon
import { ChevronDownIcon } from "@chakra-ui/icons";

import Pix from "./Pix";
import firebaseApp from "./firebaseConfig";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  Timestamp,
  onSnapshot,
  updateDoc,
  doc,
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

  const [editMode, setEditMode] = useState(false);
  const [editedPix, setEditedPix] = useState(null);

  const imageListRef = ref(storage, "images/");

  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch image URLs from Firebase Storage
        const imageRefs = await listAll(imageListRef);
        const urls = await Promise.all(
          imageRefs.items.map((item) => getDownloadURL(item))
        );
        setImageList(urls);

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

        // Retrieve pixs
        const pixsListener = onSnapshot(collection(db, "pixs"), (snapshot) => {
          setPixs(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        // Cleanup function
        return () => {
          authStateListener(); // Unsubscribe from auth state changes
          pixsListener(); // Unsubscribe from pixs collection changes
        };
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const createPix = async () => {
    setButtonLoading(true);

    try {
      if (pix !== "" && imageUpload !== null) {
        // Upload image to Firebase Storage
        const imageUrl = await uploadImage(); // Wait for image upload to complete

        const pixData = {
          body: pix,
          user_email: userProfile.email,
          name: userProfile.name,
          date_posted: Timestamp.now(),
          imageUrl: imageUrl, // Assign the imageUrl obtained from the upload
        };

        // Add Pix data to Firestore
        const docRef = await addDoc(collection(db, "pixs"), pixData);

        // Update imageList state with the new URL
        setImageList((prevList) => [...prevList, imageUrl]);

        // Reset the file input value to null
        setImageUpload(null);

        setPix("");
      } else {
        alert("Pix and image are required");
      }
    } catch (error) {
      console.error("Error creating Pix:", error);
    } finally {
      setButtonLoading(false);
    }
  };

  const uploadImage = async () => {
    if (imageUpload === null) return null;

    const imageRef = ref(storage, `images/${v4()}_${imageUpload.name}`);

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

  // edit
  // Function to handle updating a pix
  const handleEditPix = (updatedPix) => {
    // Get the reference to the pix document in Firestore
    const pixRef = doc(db, "pixs", updatedPix.id);

    // Update the pix document with the new data
    updateDoc(pixRef, {
      body: updatedPix.body,
      // Update other fields as needed
    })
      .then(() => {
        // Reset edit mode and editedPix state
        setEditMode(false);
        setEditedPix(null);
      })
      .catch((error) => {
        console.error("Error updating pix:", error);
      });
  };

  return (
    <Container maxW={{ base: "100%", lg: "1200px" }} pt="10" bg="gray.100">
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <Heading color="teal.500">Pixemotion</Heading>
          <Text color="gray.600">Every Image Tells a Story</Text>
        </Box>

        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} color="teal.500">
            <Text fontWeight="bold">{userProfile.name}</Text>
          </MenuButton>
          <MenuList>
            <MenuItem minH="48px">
              <Image
                boxSize="2rem"
                borderRadius="full"
                src="https://placekitten.com/100/100"
                alt="Fluffybuns the destroyer"
                mr="12px"
              />
              <Text color="teal.500">{userProfile.email}</Text>
            </MenuItem>
            <MenuItem minH="40px">
              <Button size="md" ml="auto" onClick={logout} colorScheme="teal">
                Logout
              </Button>
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      <Flex>
        <Spacer />
        <Box w="100%">
          <Card mt={5} p={5} bg="white" color="teal.500">
            <FormControl>
              <FormLabel>What's up?</FormLabel>
              <Grid templateColumns={{ base: "1fr", md: "3fr 1fr" }} gap={4}>
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
              colorScheme="teal"
            >
              Pix
            </Button>
          </Card>

          <Divider my={5} />

          {pixs.map((pixRecord, index) => (
            <Pix
              key={pixRecord.id}
              id={pixRecord.id} // Pass the id prop
              body={pixRecord.body}
              email={pixRecord.user_email}
              name={pixRecord.name}
              date_posted={pixRecord.date_posted.toDate().toString()}
              imageUrl={pixRecord.imageUrl}
              images={imageList} // Pass the imageList as the images prop
              imageIndex={index} // Pass the index as the imageIndex prop
              db={db} // Pass the db prop
            ></Pix>
          ))}
        </Box>
      </Flex>
    </Container>
  );
}

export default Home;
