import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom"
import Packages from "../screens/Packages"
import Registration from "../screens/Registration"
import NotFound from "../screens/NotFound"




function Navigation() {

    return (

        <Router>
        
        <Routes>
        
            <Route path="/" element={<Packages/>} />
            <Route path={"/Registration"} element={<Registration/>} />
            <Route path="*" element={<NotFound />} />
        
        </Routes>
        
        </Router>

    )

}

export default Navigation

