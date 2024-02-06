


import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Close, CloseFullscreenRounded, TextFields } from '@mui/icons-material';
import { TextField } from '@mui/material';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import UserContext from '../Context/userContext/context';
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
import app from '../configs/config';
import { RingLoader } from "react-spinners"
import countriesObject from '../constant/countries';
import BasicSelect from "../Components/dropdown"
import { all } from 'axios';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    maxHeight: 600,
    overflow: "auto",
    transform: 'translate(-50%, -50%)',
    width: "30%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
};

export default function CustomModal({ open, close }) {

    const db = getFirestore(app)
    const auth = getAuth(app)

    const [userData, setUserData] = React.useState({
        email: "",
        password: "",
        fullName: "",
    })

    const [registrationData, setRegistrationData] = React.useState({
        fullName: userData?.fullName,
        mobileNumber: "+1",
        streetAddress: "",
        country: {
            value: "United States",
            id: 186,
            subject: "United States"
        },
        state: "",
        city: "",
        zipCode: ""
    })

    const [loading, setLoading] = React.useState(false)

    const [isRegisteredModalVisible, setIsRegistedModalVisible] = React.useState(false)


    const userCont = React.useContext(UserContext)

    const { user, setUser } = userCont

    const [signup, setSignup] = React.useState(false)


    const handleSingupClicked = () => {
        setSignup(!signup)
    }


    const handleLoginClicked = async () => {


        if (signup) {

            if (!userData.fullName) {
                alert("Full Name is missing")
                return
            }

            if (!userData.email) {
                alert("Email is missing")
                return
            }
            if (!userData.password) {
                alert("Password is missing")
                return
            }

            if (userData.password.length < 8) {
                alert("Password must be atleast 8 characters")
                return
            }

            setLoading(true)
            createUserWithEmailAndPassword(auth,
                userData.email,
                userData.password
            ).then(async (userCredential) => {

                let { user } = userCredential
                userData.id = user.uid
                userData.agree = true


                let dataToSend = { ...userData }
                delete dataToSend.password
                await setDoc(doc(db, "Users", user.uid), userData)

                signInWithEmailAndPassword(auth, userData.email, userData.password).then(async (res) => {


                    setUser(dataToSend)
                    setLoading(false)
                    setIsRegistedModalVisible(true)
                    let stringData = JSON.stringify(userData)
                    await localStorage.setItem("userData", stringData)
                    alert("Signup Successful")



                }).catch((error) => {

                    setLoading(false)
                    alert(error.message)
                })

            }).catch((error) => {
                setLoading(false)
                alert(error?.message)

            })


        }

        if (!signup) {

            if (!userData?.email) {

                alert("Email is missing")
                return

            }


            if (!userData?.password) {

                alert("Password is missing")
                return

            }

            if (userData?.password?.length < 8) {

                alert("Password must be atleast 8 characters")
                return

            }

            setLoading(true)

            signInWithEmailAndPassword(auth, userData.email, userData.password).then(async (userCredential) => {

                let { user } = userCredential

                let { uid } = user

                console.log(uid, "uiddddd")

                const docRef = doc(db, "Users", uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {

                    let data = docSnap.data()

                    console.log(data, "dataaaa")

                    if (data?.created_at && data?.fullName && data?.state) {

                        setUser(data)
                        close()
                        setLoading(false)
                    }

                    else {
                        setLoading(false)
                        setIsRegistedModalVisible(true)
                    }

                } else {
                    setLoading(false)
                    setIsRegistedModalVisible(true)
                    console.log("No such document!");
                }





                // setIsRegistedModalVisible(true)
                // let stringData = JSON.stringify(userData)
                // await localStorage.setItem("userData", stringData)
                // alert("Signup Successful")



            }).catch((error) => {

                setLoading(false)
                alert(error.message)
            })

        }


    }


    console.log(user, "usersss")

    const handleRegisterClicked = async () => {




        let allData = { ...registrationData }

        allData.fullName = registrationData.fullName ? registrationData.fullName : userData.fullName
        allData.created_at = new Date()

        if (!allData.fullName) {
            alert("Full Name is missing")
            return
        }
        if (!allData.mobileNumber || allData?.mobileNumber.length < 10) {
            alert("Invalid Mobile Number")
            return
        }

        if (!allData.streetAddress) {
            alert("Address is missing")
            return
        }

        if (!allData.country || !allData.country.value) {
            alert("Country is missing")
            return
        }


        if (!allData.city) {
            alert("City is missing")
            return
        }

        if (!allData.zipCode) {
            alert("ZipCode is missing")
            return
        }

        setLoading(true)


        const washingtonRef = doc(db, "Users", auth?.currentUser?.uid);

        // Set the "capital" field of the city 'DC'
        updateDoc(washingtonRef, allData).then((res) => {

            let dataToSend = {
                ...registrationData,
                id: auth.currentUser.uid,
                fullName: registrationData?.fullName ? registrationData?.fullName : userData.fullName,
                email: auth.currentUser.email,
                created_at: new Date()
            }

            setUser(dataToSend)
            setIsRegistedModalVisible(false)
            close()
            setLoading(false)

        }).catch((error) => {
            setLoading(false)
            console.log(error)
        })

        setLoading(false)
    }


    return (
        <div>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={close}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    {!isRegisteredModalVisible ? <Box sx={style}>
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                            Login Your Account
                        </Typography>


                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1, width: "100%" }} >

                            <Button size="medium" sx={{
                                border: `1px solid black`, width: "48%", backgroundColor: "lightGray", fontFamily: "Poppins", fontWeight: "bold", borderRadius: 1, p: 1, color: "black", '&:hover': {
                                    color: "green", // Set your desired hover color
                                }
                            }}   >Google</Button>


                            <Button size="medium" sx={{
                                border: `1px solid black`, backgroundColor: "black", width: "48%", fontFamily: "Poppins", fontWeight: "bold", color: "white", borderRadius: 1, p: 1, '&:hover': {
                                    color: "green", // Set your desired hover color
                                }
                            }}   >Apple</Button>


                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", mt: 1, flexDirection: "column" }} >

                            {signup && <TextField
                                value={userData?.fullName}
                                onChange={(e) => {
                                    setUserData({
                                        ...userData,
                                        fullName: e?.target?.value
                                    })
                                }}
                                variant="standard" // <== changed this
                                margin="normal"
                                required
                                type="text"
                                fullWidth
                                sx={{ width: "90%", fontSize: "10px", padding: 1, fontFamily: "Poppins", marginTop: "10px", fontWeight: "bold", border: "1px solid gray", borderRadius: "5px" }}
                                placeholder="Enter Your Full Name..."
                                InputProps={{
                                    // startAdornment: <AccountCircle />, // <== adjusted this
                                    disableUnderline: true, // <== added this
                                    // fontSize: "2px"
                                }}
                            />}


                            <TextField
                                value={userData?.email}
                                onChange={(e) => {
                                    setUserData({
                                        ...userData,
                                        email: e?.target?.value
                                    })
                                }}
                                variant="standard" // <== changed this
                                margin="normal"
                                required
                                type="email"
                                fullWidth
                                sx={{ width: "90%", fontSize: "10px", padding: 1, fontFamily: "Poppins", fontWeight: "bold", marginTop: signup ? "0px" : "10px", border: "1px solid gray", borderRadius: "5px" }}
                                placeholder="Enter Your Email..."
                                InputProps={{
                                    // startAdornment: <AccountCircle />, // <== adjusted this
                                    disableUnderline: true, // <== added this
                                    // fontSize: "2px"
                                }}
                            />

                            <TextField
                                value={userData?.password}
                                onChange={(e) => {
                                    setUserData({
                                        ...userData,
                                        password: e?.target?.value
                                    })
                                }}
                                variant="standard" // <== changed this
                                margin="normal"
                                required
                                type="password"
                                fullWidth
                                sx={{ width: "90%", fontSize: "10px", padding: 1, fontFamily: "Poppins", fontWeight: "bold", marginTop: "0px", border: "1px solid gray", borderRadius: "5px" }}
                                placeholder="Enter Your Password..."
                                InputProps={{
                                    // startAdornment: <AccountCircle />, // <== adjusted this
                                    disableUnderline: true, // <== added this
                                    // fontSize: "2px"
                                }}
                            />


                            <Button size="medium" onClick={() => !loading && handleLoginClicked()} sx={{
                                border: `1px solid black`, marginTop: "10px", backgroundColor: "green", width: "70%", fontFamily: "Poppins", fontWeight: "bold", color: "white", borderRadius: 1, p: 1, '&:hover': {
                                    color: "green", alignSelf: "center" // Set your desired hover color
                                }
                            }}   >{loading ? <RingLoader size={30} loading={loading} /> : signup ? "Signup" : "Login"}</Button>


                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }} >
                            <Typography id="transition-modal-description">
                                {!signup ? "Don't Have Account?" : "Already Have Account?"}
                            </Typography>
                            <Button onClick={() => handleSingupClicked()} size="medium" sx={{
                                width: "fit-content", fontFamily: "Poppins", fontWeight: "bold", color: "green", p: 0, m: 0, '&:hover': {
                                    color: "green", alignSelf: "center" // Set your desired hover color
                                }
                            }}   >{!signup ? "Signup" : "Login"}</Button>
                        </Box>
                    </Box> : <Box sx={style} >

                        <Typography id="transition-modal-title" variant="h6" component="h2">
                            Register Your Account
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", mt: 1, flexDirection: "column" }} >

                            <Box sx={{ marginTop: "10px", width: "100%" }} >

                                <Typography id="transition-modal-title" sx={{ textAlign: "left", fontFamily: "Poppins", fontWeight: "bold" }} >
                                    Full Name:
                                </Typography>


                                <TextField
                                    value={registrationData?.fullName ? registrationData.fullName : userData.fullName}
                                    onChange={(e) => {
                                        setUserData({
                                            ...registrationData,
                                            fullName: e?.target?.value
                                        })
                                    }}
                                    variant="standard" // <== changed this
                                    margin="normal"
                                    required
                                    type="text"
                                    fullWidth
                                    sx={{ width: "90%", fontSize: "10px", m: 0, padding: 1, fontFamily: "Poppins", fontWeight: "bold", border: "1px solid gray", borderRadius: "5px" }}
                                    placeholder="Enter Your Full Name..."
                                    InputProps={{
                                        // startAdornment: <AccountCircle />, // <== adjusted this
                                        disableUnderline: true, // <== added this
                                        // fontSize: "2px"
                                    }}
                                />
                            </Box>

                            <Box sx={{ marginTop: "10px", width: "100%" }} >

                                <Typography id="transition-modal-title" sx={{ textAlign: "left", fontFamily: "Poppins", fontWeight: "bold" }} >
                                    Mobile Number:
                                </Typography>


                                <TextField
                                    value={registrationData?.mobileNumber}
                                    onChange={(e) => {
                                        setRegistrationData({
                                            ...registrationData,
                                            mobileNumber: e?.target?.value
                                        })
                                    }}
                                    variant="standard" // <== changed this
                                    margin="normal"
                                    required
                                    type="phone"
                                    fullWidth
                                    sx={{ width: "90%", fontSize: "10px", m: 0, padding: 1, fontFamily: "Poppins", fontWeight: "bold", border: "1px solid gray", borderRadius: "5px" }}
                                    placeholder="Enter Your Mobile Number..."
                                    InputProps={{
                                        // startAdornment: <AccountCircle />, // <== adjusted this
                                        disableUnderline: true, // <== added this
                                        // fontSize: "2px"
                                    }}
                                />
                            </Box>

                            <Box sx={{ marginTop: "10px", width: "100%" }} >

                                <Typography id="transition-modal-title" sx={{ textAlign: "left", fontFamily: "Poppins", fontWeight: "bold" }} >
                                    Street Address:
                                </Typography>


                                <TextField
                                    value={registrationData?.streetAddress}
                                    onChange={(e) => {
                                        setRegistrationData({
                                            ...registrationData,
                                            streetAddress: e?.target?.value
                                        })
                                    }}
                                    variant="standard" // <== changed this
                                    margin="normal"
                                    required
                                    type="text"
                                    fullWidth
                                    sx={{ width: "90%", fontSize: "10px", m: 0, padding: 1, fontFamily: "Poppins", fontWeight: "bold", border: "1px solid gray", borderRadius: "5px" }}
                                    placeholder="Enter Your Street Address..."
                                    InputProps={{
                                        // startAdornment: <AccountCircle />, // <== adjusted this
                                        disableUnderline: true, // <== added this
                                        // fontSize: "2px"
                                    }}
                                />
                            </Box>

                            <Box sx={{ marginTop: "10px", width: "100%" }} >

                                <Typography id="transition-modal-title" sx={{ textAlign: "left", fontFamily: "Poppins", fontWeight: "bold" }} >
                                    Country:
                                </Typography>


                                <BasicSelect
                                    value={registrationData?.country}
                                    status="Select Country"
                                    id={countriesObject}
                                    innerStyle={{
                                        fontSize: "14px",
                                        border: `1px solid lightGray`,
                                        borderRadius: 1,
                                        width: "100%",
                                        fontFamily: "Poppins",
                                        p: 0.5,
                                        m: 0,
                                        fontWeight: "400",
                                    }}
                                    style={{ border: "0px", width: "95%", m: 0 }}
                                    onChange={(e) => setRegistrationData({
                                        ...registrationData,
                                        country: e
                                    })}
                                />
                            </Box>

                            <Box sx={{ marginTop: "10px", width: "100%" }} >

                                <Typography id="transition-modal-title" sx={{ textAlign: "left", fontFamily: "Poppins", fontWeight: "bold" }} >
                                    State:
                                </Typography>


                                <TextField
                                    value={registrationData?.state}
                                    onChange={(e) => {
                                        setRegistrationData({
                                            ...registrationData,
                                            state: e?.target?.value
                                        })
                                    }}
                                    variant="standard" // <== changed this
                                    margin="normal"
                                    required
                                    type="text"
                                    fullWidth
                                    sx={{ width: "90%", fontSize: "10px", m: 0, padding: 1, fontFamily: "Poppins", fontWeight: "bold", border: "1px solid gray", borderRadius: "5px" }}
                                    placeholder="Enter Your State..."
                                    InputProps={{
                                        // startAdornment: <AccountCircle />, // <== adjusted this
                                        disableUnderline: true, // <== added this
                                        // fontSize: "2px"
                                    }}
                                />
                            </Box>

                            <Box sx={{ marginTop: "10px", width: "100%" }} >

                                <Typography id="transition-modal-title" sx={{ textAlign: "left", fontFamily: "Poppins", fontWeight: "bold" }} >
                                    City:
                                </Typography>


                                <TextField
                                    value={registrationData?.city}
                                    onChange={(e) => {
                                        setRegistrationData({
                                            ...registrationData,
                                            city: e?.target?.value
                                        })
                                    }}
                                    variant="standard" // <== changed this
                                    margin="normal"
                                    required
                                    type="text"
                                    fullWidth
                                    sx={{ width: "90%", fontSize: "10px", m: 0, padding: 1, fontFamily: "Poppins", fontWeight: "bold", border: "1px solid gray", borderRadius: "5px" }}
                                    placeholder="Enter Your City..."
                                    InputProps={{
                                        // startAdornment: <AccountCircle />, // <== adjusted this
                                        disableUnderline: true, // <== added this
                                        // fontSize: "2px"
                                    }}
                                />
                            </Box>

                            <Box sx={{ marginTop: "10px", width: "100%" }} >

                                <Typography id="transition-modal-title" sx={{ textAlign: "left", fontFamily: "Poppins", fontWeight: "bold" }} >
                                    Zip Code:
                                </Typography>


                                <TextField
                                    value={registrationData?.zipCode}
                                    onChange={(e) => {
                                        setRegistrationData({
                                            ...registrationData,
                                            zipCode: e?.target?.value
                                        })
                                    }}
                                    variant="standard" // <== changed this
                                    margin="normal"
                                    required
                                    type="text"
                                    fullWidth
                                    sx={{ width: "90%", fontSize: "10px", m: 0, padding: 1, fontFamily: "Poppins", fontWeight: "bold", border: "1px solid gray", borderRadius: "5px" }}
                                    placeholder="Enter Your Zipcode..."
                                    InputProps={{
                                        // startAdornment: <AccountCircle />, // <== adjusted this
                                        disableUnderline: true, // <== added this
                                        // fontSize: "2px"
                                    }}
                                />
                            </Box>



                            <Button size="medium" onClick={() => handleRegisterClicked()} sx={{
                                border: `1px solid black`, marginTop: "10px", backgroundColor: "green", width: "70%", fontFamily: "Poppins", fontWeight: "bold", color: "white", borderRadius: 1, p: 1, '&:hover': {
                                    color: "green", alignSelf: "center" // Set your desired hover color
                                }
                            }}   >{loading ? <RingLoader size={30} loading={loading} /> : "Register"}</Button>


                        </Box>


                    </Box>}
                </Fade>
            </Modal>
        </div>
    );
}