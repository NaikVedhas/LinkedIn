import {Outlet} from "react-router-dom";
import Navbar from "./component/Navbar";

function Layout () {

    return (
        <>
        <Navbar/>
        <Outlet/>
        </>
    )
}

export default Layout;