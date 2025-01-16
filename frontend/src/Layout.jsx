import {Outlet} from "react-router-dom";
import Navbar from "./component/Navbar";
import ScrollToTop from "./ScrollToTop";

//Aded scroll to top so that when u go from one page to aother u go at the top of another page
function Layout () {

    return (
        <>
        <ScrollToTop/>
        <Navbar/>
        <Outlet/>
        </>
    )
}

export default Layout;