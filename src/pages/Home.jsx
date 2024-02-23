import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
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
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
} from "@chakra-ui/react";
import { MdImage } from "react-icons/md";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FiUpload } from "react-icons/fi";
import Pix from "./Pix";
import firebaseApp from "./firebaseConfig";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
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
import { useNavigate } from "react-router-dom";

function Home() {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const [userProfile, setUserProfile] = useState("");
  const [pix, setPix] = useState("");
  const [pixs, setPixs] = useState([]);
  const [imageUpload, setImageUpload] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false);
  let navigate = useNavigate();
  const imageListRef = ref(storage, "images/");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const imageRefs = await listAll(imageListRef);
        const urls = await Promise.all(
          imageRefs.items.map((item) => getDownloadURL(item))
        );
        setImageList(urls);

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

        const pixsListener = onSnapshot(collection(db, "pixs"), (snapshot) => {
          const sortedPixs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          sortedPixs.sort(
            (a, b) => b.date_posted.toMillis() - a.date_posted.toMillis()
          );
          setPixs(sortedPixs);
        });

        return () => {
          authStateListener();
          pixsListener();
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
        const imageUrl = await uploadImage();

        const pixData = {
          body: pix,
          user_email: userProfile.email,
          name: userProfile.name,
          date_posted: Timestamp.now(),
          imageUrl: imageUrl,
        };

        await addDoc(collection(db, "pixs"), pixData);

        setImageList((prevList) => [...prevList, imageUrl]);
        setImageUpload(null);
        setPix("");

        Swal.fire({
          icon: "success",
          title: "Pix created successfully",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#38b2ac",
          iconColor: "#ffffff",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Pix and image are required",
        });
      }
    } catch (error) {
      console.error("Error creating Pix:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error occurred while creating Pix",
      });
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

  return (
    <Container maxW={{ base: "100%", lg: "1200px" }} pt="5" bg="gray.100">
      <Flex justifyContent="space-between" alignItems="center" flexWrap="wrap">
        <Box flex="1" mb={{ base: 4, md: 0 }}>
          <Heading color="teal.500" fontSize={{ base: "2xl", md: "4xl" }}>
            Pixemotions
          </Heading>
          <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
            Every Image Tells a Story
          </Text>
        </Box>

        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            color="teal.500"
          >
            <Text fontWeight="bold">{userProfile.name}</Text>
          </MenuButton>
          <MenuList>
            <MenuItem minH="48px">
              <Image
                boxSize="2rem"
                borderRadius="full"
                src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/avatar-icon.png"
                alt="User Avatar"
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
        <Box w="100%" px={{ base: 2, md: 4 }}>
          <Card
            mx={"auto"}
            w={{ base: "90%", md: "50%" }}
            mt={5}
            p={10}
            bg="white"
            color="teal.500"
          >
            <FormControl>
              <FormLabel>What's up?</FormLabel>
              <Flex alignItems="center">
                <Input
                  flex="1"
                  disabled={buttonLoading}
                  type="text"
                  onChange={(e) => setPix(e.target.value)}
                  value={pix}
                  mr={10}
                />
                <Box position="relative">
                  <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageUpload(e.target.files[0])}
                      style={{ display: "none" }}
                    />
                    <IconButton
                      as="span"
                      aria-label="Upload photo"
                      icon={<MdImage />}
                      fontSize={{ base: "16px", md: "30px" }}
                      variant="outline"
                      colorScheme="teal"
                      borderRadius="50%"
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                    />
                  </label>
                </Box>
              </Flex>
            </FormControl>
            <Button
              isLoading={buttonLoading}
              size="sm"
              w={{ base: "40%", sm: "150px", md: "100px" }}
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
              id={pixRecord.id}
              body={pixRecord.body}
              email={pixRecord.user_email}
              name={pixRecord.name}
              date_posted={pixRecord.date_posted.toDate().toString()}
              imageUrl={pixRecord.imageUrl}
              images={imageList}
              imageIndex={index}
              db={db}
            />
          ))}
        </Box>
      </Flex>
    </Container>
  );
}

export default Home;
