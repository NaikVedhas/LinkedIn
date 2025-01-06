import Layout from "./Layout"
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Home from "./pages/Home"
import NotFound  from "./pages/NotFound";
import { createBrowserRouter,Route,createRoutesFromElements,RouterProvider } from "react-router"

function App() {


  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout/>}>
        <Route path="" element={<Home/>}/>
        <Route path="login" element={<Login/>}/>
        <Route path="signup" element={<Signup/>}/>
        <Route path="*" element={<NotFound/>}/> 
      </Route>
    )
  );


  return (<RouterProvider router={router}/>)
}

export default App
