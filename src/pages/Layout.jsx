import { Outlet } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

function Layout(){
    return(
        <ChakraProvider>
            <Outlet></Outlet>
        </ChakraProvider>
    )
}
export default Layout;