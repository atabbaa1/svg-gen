"use client"
import { useState } from "react";
import { Box, Stack, TextField, Button } from "@mui/material";
require('dotenv').config();

const FileUploader = () => {
    const [svgImage, setSvgImage] = useState(null);
    
	const [files, setFiles] = useState([]);

	const handleFileChange = (e) => {
    const temp_file = e.target.files?.[0];
    if (temp_file) {
      const fileType = temp_file.name.substring(temp_file.name.lastIndexOf('.'), temp_file.name.length);
      console.log(fileType);
      if (!fileType.match(/(.png)$/)) {
        alert(`${temp_file.name} is not a supported file type. Must be .png`);
        return;
      }
      setFiles([...files, e.target.files?.[0]]);
    }
		// console.log(`New files are: ${files}`);
    // console.log(`Lenght of files is ${files.length}`);
	};
		
	const sendFile = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		for (let i = 0; i < files.length; i++) {
			formData.append('files', files[i]);
		}
		try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", process.env.Authorization);

            const raw = JSON.stringify({
            "contents": [
                {
                "role": "user",
                "parts": [
                    {
                    "text": "Please convert this PNG image into an SVG image",
                    "file": files[0],
                    "Content-Type": "application/json"
                    }
                ]
                }
            ]
            });

            const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
            };
			const response = await fetch(process.env.GOOGLE_LLM_LINK, requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
			if (!response.ok) {
                throw new Error(await response.text());
            } else {
                alert("File uploaded successfully");
                setSvgImage(response);
            }
		} catch (error) {
			console.error('Error uploading file:', error);
		}
	};
	return (
		<form
			method="POST"
			action={"/file_uploads"}
			encType="multipart/form-data" 
		>
			<Stack
        justifyContent={"center"}
        alignItems={"center"}
        direction={"row"}
        gap={5}
				>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          //startIcon={<CloudUploadIcon />}
					>
          Upload PNG file
          <input name="upload_input" type="file" hidden onChange={(e) => handleFileChange(e)} />
        </Button>
        {files.length !== 0 ?
          <Button
					component="label"
					role={undefined}
					variant="contained"
					tabIndex={-1}
					type="submit"
					onClick={(e) => sendFile(e)}
          >
            Convert into SVG
          </Button> : ""
        }
        {svgImage && (
            <Box>
                <h3>SVG Preview:</h3>
                <img src={`data:image/svg+xml;base64,${btoa(svgImage)}`} alt="SVG Preview" />
                <Button
                    component="a"
                    href={`data:image/svg+xml;base64,${btoa(svgImage)}`}
                    download="converted_image.svg"
                    variant="contained"
                >
                    Download SVG
                </Button>
            </Box>
        )}
      </Stack>
		</form>
	);
}

export default FileUploader;