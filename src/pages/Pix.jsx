import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Box,
  Text,
  Image,
  Button,
  IconButton,
  Avatar,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@chakra-ui/react";
import { BiLike, BiChat, BiShare } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "./firebaseConfig";

const Pix = ({ id, body, email, name, date_posted, imageUrl, images, db }) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Hook for modal state
  const [editedBody, setEditedBody] = useState(body); // State variable for edited body
  const [editedImageUrl, setEditedImageUrl] = useState(imageUrl); // State variable for edited image URL

  const handleBodyChange = (event) => {
    setEditedBody(event.target.value); 
  };

  const handleImageChange = (event) => {
    setEditedImageUrl(URL.createObjectURL(event.target.files[0]));
  };

  const saveEditedPix = () => {
    // Handle saving the edited Pix
  };

  const deletePix = async () => {
    try {
      if (!id) {
        console.error("ID is undefined");
        return;
      }
  
      const confirmation = window.confirm(`Are you sure you want to delete this Pix posted by ${name} on ${date_posted}?`);
      if (confirmation) {
        // Delete Pix document
        await deleteDoc(doc(db, "pixs", id));
  
        // Delete associated image from Firebase Storage
        const filename = imageUrl.split("/").pop();
        const imageRef = ref(storage, `images/${filename}`);
        await deleteObject(imageRef);
  
        alert("Pix and associated image deleted successfully");
      }
    } catch (error) {
      if (error.code === "storage/object-not-found") {
        console.error("Object does not exist:", error);
        alert("The associated image does not exist.");
      } else {
        console.error("Error deleting Pix:", error);
        alert("An error occurred while deleting the Pix.");
      }
    }
  };
  
  

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <Card p={5} boxShadow={"lg"} mb={10} maxW={{ base: "100%", sm: "80%", md: "50%" }} mx="auto">
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
              <Avatar name="Segun Adebayo" src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/avatar-icon.png" />
              <Box>
                <Heading size="sm">{name}</Heading>
                <Text fontSize="sm">{formatTime(date_posted)}</Text>
              </Box>
            </Flex>
            <Menu>
              <MenuButton as={IconButton} variant="ghost" colorScheme="gray" aria-label="See menu" icon={<BsThreeDotsVertical />} />
              <MenuList>
                <MenuItem onClick={onOpen}>
                  <Box as="span" mr="2">
                    <EditIcon />
                  </Box>
                  Edit
                </MenuItem>
                <MenuItem onClick={deletePix}>
                  <Box as="span" mr="2">
                    <DeleteIcon />
                  </Box>
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </CardHeader>
        <CardBody>
          <Text>{editedBody}</Text>
          <Box mx="auto" maxW="400px" maxH="300px" overflow="hidden">
            <Image src={editedImageUrl} alt="Pix Image" />
          </Box>
        </CardBody>
        <CardFooter
          justifyContent="space-around"
          alignItems="center"
          textAlign="center"
          sx={{
            "& > button": {
              minW: "136px",
            },
          }}
        >
          <Button flex="1" variant="ghost" leftIcon={<BiLike />}>
            Like
          </Button>
          <Button flex="1" variant="ghost" leftIcon={<BiChat />}>
            Comment
          </Button>
          <Button flex="1" variant="ghost" leftIcon={<BiShare />}>
            Share
          </Button>
        </CardFooter>
      </Card>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Pix</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Edit Pix Body:</Text>
            <textarea value={editedBody} onChange={handleBodyChange} />
            <Text mt={4}>Edit Image:</Text>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={saveEditedPix}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Pix;
