import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';



export default function CustomCard(props) {

    let {packages,subscribe} = props

    const [hoverId,setHoverId] = React.useState("")


    return (
    <Card sx={{ minWidth: 275,backgroundColor:"lightGray",opacity : hoverId == packages.id  ? 0.8 : 1 }} onMouseLeave={()=>setHoverId('')} onMouseEnter={()=>setHoverId(packages.id)} >
      <CardContent>
        <Typography sx={{ fontSize: 18,textAlign:"left",fontWeight:"bold",fontFamily:"Poppins",color:"black" }} color="text.secondary" gutterBottom>
          Package Duration: <span style={{fontWeight:"400"}} > {packages?.packageDuration} Days </span>
        </Typography>
        <Typography sx={{ fontSize: 18,textAlign:"left",fontWeight:"bold",fontFamily:"Poppins",color:"black" }}  gutterBottom component="div">
          Total Rides: <span style={{fontWeight:"400"}} > {packages?.freeRides} Rides </span>
        </Typography>
       
        <Typography sx={{ fontSize: 18,textAlign:"left",fontWeight:"bold",fontFamily:"Poppins",color:"black" }}  component="div">
          Package Price: <span style={{fontWeight:"400"}} > ${packages?.packageAmount}  </span>
        </Typography>
      </CardContent>
      <CardActions>
        <Box sx={{display:"flex",justifyContent:"center",width:"100%"}} >
        <Button size="large" sx={{border:`1px solid black`,backgroundColor:"green",color:"white",borderRadius:2,'&:hover': {
                color: "green", // Set your desired hover color
            }}}  onClick={()=>subscribe(packages)} >Subscribe Now</Button>
        </Box>
      </CardActions>
    </Card>
  );
}