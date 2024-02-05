// Pix.js
import { Card, CardBody, CardFooter, CardHeader, Flex, Box, Text, Image, Button, IconButton, Avatar, Heading } from "@chakra-ui/react";
import { BiLike, BiChat, BiShare } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import React from "react";

const Pix = ({ body, email, name, date_posted, imageUrl, images, imageIndex }) => {
  return (
    <div>

      {/* <Card> */}
        {/* <CardHeader>
          <Text fontWeight={"bold"} >{name}</Text>
          <Text fontSize={"small"} >{date_posted}</Text>
        </CardHeader>
        <CardBody>
          <Text>{body}</Text>
          {/* <p>{email}</p> */}
          {/* <Card>
            {images.length > 0 && (
              <img src={images[imageIndex % images.length]} alt={`Image ${imageIndex}`} />
            )}
          </Card>
        </CardBody> */}
      {/* </Card> */}


      <Card>
        <CardHeader>
          <Flex spacing='4'>
            <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
              <Avatar name='Segun Adebayo' src='https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/avatar-icon.png' />

              <Box>
                <Heading size='sm'>{name}</Heading>
                <Text fontSize="small">{date_posted}</Text>
              </Box>
            </Flex>
            <IconButton
              variant='ghost'
              colorScheme='gray'
              aria-label='See menu'
              icon={<BsThreeDotsVertical />}
            />
          </Flex>
        </CardHeader>
        <CardBody>
          <Text>
          {body}
          </Text>
        </CardBody>
        <Box p={"20px"}>
        {images.length > 0 && (
              <img src={images[imageIndex % images.length]} alt={`Image ${imageIndex}`} />
            )}
        </Box>

        <CardFooter
          justify='space-between'
          flexWrap='wrap'
          sx={{
            '& > button': {
              minW: '136px',
            },
          }}
        >
          <Button flex='1' variant='ghost' leftIcon={<BiLike />}>
            Like
          </Button>
          <Button flex='1' variant='ghost' leftIcon={<BiChat />}>
            Comment
          </Button>
          <Button flex='1' variant='ghost' leftIcon={<BiShare />}>
            Share
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Pix;
