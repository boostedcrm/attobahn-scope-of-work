import "./App.css";
import { Box, Button, TextField, Typography } from "@mui/material";
import logo from "../src/assets/logo.jfif";
import styled from "styled-components";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import { useEffect, useState } from "react";

const ZOHO = window.ZOHO;

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function App() {
  const [zohoLoaded, setZohoLoaded] = useState(false);
  const [recordId, setRecordId] = useState(null);
  const [scopeOfWork, setScopeOfWork] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState();

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileBlob = new Blob([reader.result], { type: selectedFile.type });
        // You now have the fileBlob containing the uploaded file data.
        console.log(selectedFile);
        // setSelectedFile(

        // )
        setFileName(selectedFile?.name);
        setFile(fileBlob);
      };
      reader.readAsArrayBuffer(selectedFile);
    } else {
      // Handle the case where no file is selected.
      console.error("No file selected");
    }
  };

  useEffect(() => {
    ZOHO.embeddedApp.on("PageLoad", function (data) {
      //Custom Bussiness logic goes here
      console.log(data.EntityId);
      setRecordId(data.EntityId);
    });
    /*
     * initializing the widget.
     */
    ZOHO.embeddedApp.init().then(() => {
      setZohoLoaded(true);
    });
  }, []);

  // async function getData() {
  //   if (zohoLoaded) {

  //     await ZOHO.CRM.API.getAllRecords({
  //       Entity: "Project_Labor",
  //       sort_order: "asc",
  //       per_page: 100,
  //       page: 1,
  //     }).then(function (data) {
  //       setLaborData(data.data);
  //     });

  //   }
  // }

  const handleSubmit = async () => {
    console.log({ file });
    // let finalData = {

    // };

    if (file != null) {
      await ZOHO.CRM.API.attachFile({
        Entity: "Project_Assignment",
        RecordID: recordId,
        File: { Name: file.name, Content: file },
      }).then(function (data) {
        console.log(data);
      });
    }

    if (recordId != null && scopeOfWork !== null) {
      var config = {
        Entity: "Project_Assignment",
        APIData: {
          id: recordId,
          Scope_of_Work: scopeOfWork,
        },
        Trigger: ["workflow"],
      };
      await ZOHO.CRM.API.updateRecord(config).then(function (data) {
        console.log(data);
        if (data.data[0].code === "SUCCESS") {
          ZOHO.CRM.UI.Popup.closeReload().then(function (data) {
            console.log(data);
          });
        }
      });
    }
  };

  // create a preview as a side effect, whenever selected file is changed

  const handleClose = async () => {
    await ZOHO.CRM.UI.Popup.close().then(function (data) {
      console.log(data);
    });
  };

  const [showScopeOfWork, setShowScopeOfWork] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  if (showScopeOfWork) {
    return (
      <Box>
        <iframe
          height="700px"
          width="100%"
          frameborder="0"
          allowTransparency="true"
          scrolling="auto"
          src="https://creatorapp.zohopublic.com/jamieenglish70/writter-data-collection/form-embed/Scope_Of_Work/tGC7PrtT473VAxdgY6mb1xpBmveb8TmxJxpWVdAEVgeg58PqZxUz8RV8szYdjfefJbnAuh7kPxSuKCj3QwHEyHOVB9ZKzmpRnkMt?PA_ID=+recordid"
        ></iframe>
        <Button variant="contained" onClick={() => setShowScopeOfWork(false)}>
          Go Back
        </Button>
      </Box>
    );
  } else if (showTerms) {
    return (
      <Box>
        <iframe
          height="700px"
          width="100%"
          frameborder="0"
          allowTransparency="true"
          scrolling="auto"
          src="https://creatorapp.zohopublic.com/jamieenglish70/writter-data-collection/form-embed/Terms_And_Conditions/hZUCd2zpY9a0HsPeZtg9GPQ6XBMW7twGmZrV3MTvjA2qU661xT2QEQ0hmkmYDYMGS1q9grtNwJFVFjSjAEtNv4jgSQ2hXptDpvZy?PA_ID=+recordid"
        ></iframe>
        <Button variant="contained" onClick={() => setShowTerms(false)}>
          Go Back
        </Button>
      </Box>
    );
  } else {
    return (
      <Box>
        <img src={logo} alt="Attobahn logo" />
        <br />
        <br /> <br />
        <br />
        <Box sx={{ display: "flex", justifyContent: "center", gap: 4 }}>
          <Button variant="contained" onClick={() => setShowScopeOfWork(true)}>
            Add Scope of Work
          </Button>
          <Button variant="contained" onClick={() => setShowTerms(true)}>
            Add Terms & Conditions
          </Button>
        </Box>
        <br /> <br />
        <Button
          component="label"
          variant="contained"
          endIcon={<SaveIcon />}
          color="success"
          onClick={handleSubmit}
        >
          Save
        </Button>
        <Button
          component="label"
          variant="outlined"
          onClick={handleClose}
          sx={{ marginLeft: "10px" }}
        >
          Cancel
        </Button>
      </Box>
    );
  }
}

export default App;
