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

function Home() {
  return (
    <Container maxW="1024" pt="100">
      <Heading>Pixemotion</Heading>
      <Text>Every Image Tells a Story</Text>
      <Flex>
        <Box w="250px">
          <Card mt={5} p={5}>
            <Text>Username!</Text>
            <Text>testing@email.com</Text>
            <Button mt={5} size="xs" w={20}>
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
