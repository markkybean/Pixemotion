import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './pages/Layout';



function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout/>}>
      <Route index element={<Login/>} />
    
        

      </Route>
    </Routes>
    </BrowserRouter>
    
  );
}

export default App
