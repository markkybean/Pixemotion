import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
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
  useDisclosure,
} from "@chakra-ui/react";
import { BiLike, BiChat, BiShare } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "./firebaseConfig";
import { getAuth } from "firebase/auth";

const Pix = ({ id, body, email, name, date_posted, imageUrl, images, db }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editedBody, setEditedBody] = useState(body);
  const [editedImageUrl, setEditedImageUrl] = useState(imageUrl);
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  useEffect(() => {
    const auth = getAuth();
    setCurrentUserEmail(auth.currentUser.email);
  }, []);

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

      const confirmation = await Swal.fire({
        icon: "question",
        title: `Are you sure you want to delete this Pix posted by ${name}`,
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
      });

      if (confirmation.isConfirmed) {
        await deleteDoc(doc(db, "pixs", id));

        const filename = imageUrl.split("/").pop();
        const imageRef = ref(storage, `images/${filename}`);
        await deleteObject(imageRef);

        Swal.fire({
          icon: "success",
          title: "Pix and associated image deleted successfully",
        });
      }
    } catch (error) {
      if (error.code === "storage/object-not-found") {
        console.error("Object does not exist:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "The associated image does not exist.",
        });
      } else {
        console.error("Error deleting Pix:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "An error occurred while deleting the Pix.",
        });
      }
    }
  };

  const formatTime = (dateString) => {
    const postDate = new Date(dateString);
    const currentDate = new Date();
    const timeDifference = currentDate - postDate;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  return (
    <div>
      <Card
        p={2}
        boxShadow={"lg"}
        mb={10}
        maxW={{ base: "100%", sm: "80%", md: "50%" }}
        mx="auto"
        bg="white"
        color="gray.800"
      >
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Flex gap="4" alignItems="center">
              <Avatar
                name="Segun Adebayo"
                src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/avatar-icon.png"
                mr="2"
              />
              <Box>
                <Heading size="sm">{name}</Heading>
                <Text fontSize="sm">{formatTime(date_posted)}</Text>
              </Box>
            </Flex>
            {currentUserEmail === email && (
              <Menu>
                <MenuButton
                  as={IconButton}
                  variant="ghost"
                  colorScheme="gray"
                  aria-label="See menu"
                  icon={<BsThreeDotsVertical />}
                />
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
            )}
          </Flex>
        </CardHeader>

        <CardBody>
          <Text fontSize="md" mb={4}>
            {editedBody}
          </Text>
          <Box
            position="relative"
            mx="auto"
            maxW="400px"
            maxH="300px"
            overflow="hidden"
            boxShadow="md"
            borderRadius="md"
          >
            <Image
              src={editedImageUrl}
              alt="Pix Image"
              objectFit="cover"
              w="100%"
              h="100%"
              borderRadius="md"
            />
          </Box>
        </CardBody>

        <CardFooter
          justifyContent="space-around"
          alignItems="center"
          textAlign="center"
        >
          <Button
            flex="1"
            variant="ghost"
            leftIcon={<BiLike />}
            colorScheme="teal"
            mr={{ base: 12, sm: 4 }}
          >
            Like
          </Button>
          <Button
            flex="1"
            variant="ghost"
            leftIcon={<BiChat />}
            colorScheme="teal"
            mr={{ base: 12, sm: 4 }}
          >
            Comment
          </Button>
          <Button
            flex="1"
            variant="ghost"
            leftIcon={<BiShare />}
            colorScheme="teal"
          >
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
            <Text>Edit:</Text>
            <textarea value={editedBody} onChange={handleBodyChange} />
            <Text mt={4}>Edit Image:</Text>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={saveEditedPix}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose} colorScheme="gray">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Pix;
