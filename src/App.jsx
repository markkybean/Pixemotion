import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import Layout from './pages/Layout';



function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout/>}>
      <Route index element={<Home/>} />
      <Route path="login" element={<Login/>}></Route>
      <Route path="register" element={<Register/>}></Route>
    
        

      </Route>
    </Routes>
    </BrowserRouter>
    
  );
}

export default App
