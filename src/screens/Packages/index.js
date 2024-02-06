import { Box, Grid, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import CustomCard from "../../Components/CustomCards"
import app from "../../configs/config"
import {
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,

    setDoc,
    updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth"
import CustomModal from "../../Components/customModal";
import { AutoGraph } from "@mui/icons-material";
import UserContext from "../../Context/userContext/context";
import { RingLoader } from "react-spinners";




function Packages() {


    const db = getFirestore(app)
    const auth = getAuth(app)


    const userCont = React.useContext(UserContext)

    const { user, setUser } = userCont


    const [packagesData, setPackagesData] = useState([])
    const [selectedPackage, setSelectedPackage] = useState("")
    const [authModalVisible, setAuthModalVisible] = useState(false)
    const [loading, setLoading] = useState(false)


    const getPackages = async () => {


        const docRef = doc(db, "packages", "createsubspackage987654321");
        const docSnap = await getDoc(docRef);

        setLoading(true)
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());

            let packages = docSnap?.data();

            if (packages.packages) {

                let data = packages.packages
                console.log(data, "data")

                let activeData = data && data.length > 0 && data.filter((e, i) => {
                    return e.status == "active"
                })

                setPackagesData(activeData)
                setLoading(false)

            } else {
                setLoading(false)
            }
        } else {
            setLoading(false)
            console.log("No such document!");
        }

    }


    const getUserData = async () => {

        let id = auth?.currentUser?.uid
        const docRef = doc(db, "Users", id);
        const docSnap = await getDoc(docRef);


        setLoading(true)
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            let data = docSnap.data()

            console.log(data, "data")

            setLoading(false)
            if (data?.mobileNumber && data?.fullName && data?.state) {

                setUser(data)

            }

        } else {
            setLoading(false)
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }

    }


    useEffect(() => {


        getPackages()



    }, [])
    useEffect(() => {


        if (auth.currentUser) {

            getUserData()

        }

    }, [auth.currentUser])


    const handleSubscribeClick = (selectedPackage) => {



        if (auth.currentUser) {

            setAuthModalVisible(true)
            setSelectedPackage(selectedPackage)

        }

    }


    return (

        loading ? <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100vw", height: "95vh" }} >

            <RingLoader size={200} color={"black"} loading={loading} />

        </Box> : <Box sx={{ width: "100vw" }} >


            {user && Object.keys(user).length > 0 && <Box sx={{ p: 1, ml: 2, mt: 2 }} >

                <Typography sx={{ textAlign: "left", fontSize: "24px", fontFamily: "Poppins", fontWeight: "bold", }}>
                    Welcome <span sx={{ color: "gray" }} >{user.fullName} </span>
                </Typography>


                <Typography sx={{ textAlign: "left", fontSize: "24px", fontFamily: "Poppins", fontWeight: "400", mt: 1 }}>
                    Buy Subscribtions to get excellent ride offers.
                </Typography>

            </Box>}


            <Grid container xs={12} sx={{ display: "flex", justifyContent: "space-between", padding: 4 }} >
                {
                    packagesData && packagesData.length > 0 && packagesData.map((packages, i) => {
                        return (

                            <Grid xs={12} sm={5.8} md={5.8} lg={2.9} sx={{ marginTop: "20px" }}  >
                                <CustomCard packages={packages} subscribe={handleSubscribeClick} />
                            </Grid>

                        )
                    })
                }
            </Grid>

            {authModalVisible && <CustomModal

                open={authModalVisible}
                close={() => setAuthModalVisible(false)}

            />}

        </Box>


    )

}

export default Packages









