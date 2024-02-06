import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Select } from "@mui/material";
// import { Colors } from "../Constant/Color";



export default function Dropdown(prop) {
    let {
        status,
        id,
        value,
        marginTop,
        disabled,
        innerStyle,
        width,
        onChange,
        style
    } = prop;

    // const handleChange = (event) => {
    //   setAge(event.target.value);
    // };
    const handleChange = (event) => {
        console.log(event, "event")
        onChange(event.target.value);
    };

    console.log(value,"value")


    return (
        <Box sx={{ minWidth: 120, width: width, padding: 0 }}>
            <FormControl size={"small"} sx={{ marginTop: marginTop, display: "flex", alignItems: "center", ...style }} fullWidth>
                <Select
                    id="demo-simple-select"
                    value={value}
                    // label={status}
                    sx={{ alignSelf: "flex-start", width: width, textAlign: "start", fontSize: "14px", color: "black", fontWeight: "400", ...innerStyle }}
                    onChange={handleChange}
                    disabled={disabled}
                >
                    <MenuItem value="select" disabled>
                        {status} {/* Placeholder text */}
                    </MenuItem>
                    {Object.entries(id).map(([key, value], index) => (
                        <MenuItem key={index} value={value}>
                            {value?.value}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}
