import {
    Container,
    Box,
    Flex,
    Heading,
    Card,
    Text,
    Divider,
    Button,
    Spacer,
    FormControl,
    FormLabel,
    Input
  } from "@chakra-ui/react";

function Pix(){
    return(
        <Card mt={5} pb={5} px={5} pt={2}>
            <Text fontWeight="bold">Mark Santos</Text>
            <Text fontSize="xs" color="gray">🕛 a few minutes ago</Text>
            <Divider my={2} color="lightgray"></Divider>
            <Text>This is where we put all the moments</Text>
          </Card>
    )
}
export default Pix;