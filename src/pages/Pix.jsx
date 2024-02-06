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

const Pix = ({ id, body, email, name, date_posted, imageUrl, images, imageIndex, db }) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Hook for modal state
  const [editedBody, setEditedBody] = useState(body); // State variable for edited body
  const [editedImageUrl, setEditedImageUrl] = useState(imageUrl); // State variable for edited image URL

  // Function to handle changes in the edit form fields
  const handleBodyChange = (event) => {
    setEditedBody(event.target.value);
  };

  const handleImageChange = (event) => {
    setEditedImageUrl(URL.createObjectURL(event.target.files[0]));
  };

  // Function to handle saving the edited Pix
  const saveEditedPix = () => {
    // Call your backend API to update the Pix with the edited body and image URL
    // After successful update, close the modal
    onClose();
  };

  // Function to delete the Pix
// Function to delete the Pix and its associated images
const deletePix = () => {
  if (!id) {
    console.error("ID is undefined");
    return;
  }

  const confirmation = window.confirm(`Are you sure you want to delete this Pix posted by ${name} on ${date_posted}?`);
  if (confirmation) {
    // Delete Pix document
    deleteDoc(doc(db, "pixs", id))
      .then(() => {
        // Pix deleted successfully, now delete associated images
        images.forEach((imageId) => {
          deleteDoc(doc(db, "images", imageId))
            .then(() => {
              console.log("Image deleted successfully");
            })
            .catch((error) => {
              console.error("Error deleting image: ", error);
              // Handle error if deletion fails
            });
        });
        // Inform user that Pix and associated images were deleted successfully
        alert("Pix and associated images deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting Pix: ", error);
        // Handle error if deletion fails
      });
  }
};


  
  // Function to format the time from date_posted
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
                {/* Display only the time */}
                <Text fontSize="sm">{formatTime(date_posted)}</Text>
              </Box>
            </Flex>
            <Menu>
              <MenuButton as={IconButton} variant="ghost" colorScheme="gray" aria-label="See menu" icon={<BsThreeDotsVertical />} />
              <MenuList>
                {/* Open modal on Edit click */}
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
          {/* Render the image if imageUrl exists */}
          <Box mx="auto" maxW="400px" maxH="300px" overflow="hidden">
            <Image src={editedImageUrl} alt="Pix Image" />
          </Box>
        </CardBody>
        <CardFooter
          justifyContent="space-around" // Distribute items evenly along the row
          alignItems="center" // Align items vertically
          textAlign="center" // Center-align button text
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
      {/* Modal for editing */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Pix</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Edit form components */}
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
