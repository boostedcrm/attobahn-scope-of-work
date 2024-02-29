import "./App.css";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const ZOHO = window.ZOHO;

function App() {
  const [zohoLoaded, setZohoLoaded] = useState(false);
  const [recordId, setRecordId] = useState(null);

  useEffect(() => {
    ZOHO.embeddedApp.on("PageLoad", function (data) {
      setRecordId(data.EntityId);
    });
    /*
     * initializing the widget.
     */
    ZOHO.embeddedApp.init().then(() => {
      setZohoLoaded(true);
    });
  }, []);

  // create a preview as a side effect, whenever selected file is changed
  const handleClose = async () => {
    await ZOHO.CRM.UI.Popup.close().then(function (data) {
      console.log(data);
    });
  };

  return (
    <Box>
      {!zohoLoaded ? (
        <Box sx={{ mt: 28 }}>
          <Typography sx={{ textAlign: "center", fontWeight: "bold" }}>
            Please wait...
          </Typography>
        </Box>
      ) : (
        <Box>
          <iframe
            height="450px"
            width="100%"
            frameborder="0"
            allowTransparency="true"
            src={`https://creatorapp.zohopublic.com/jamieenglish70/writter-data-collection/form-embed/Scope_Of_Work/tGC7PrtT473VAxdgY6mb1xpBmveb8TmxJxpWVdAEVgeg58PqZxUz8RV8szYdjfefJbnAuh7kPxSuKCj3QwHEyHOVB9ZKzmpRnkMt?PA_ID=${recordId}`}
          ></iframe>
          <Box sx={{ display: "flex", justifyContent: "center", my: 1, mr: 1 }}>
            <Button
              onClick={handleClose}
              sx={{
                width: 72,
                borderRadius: 0,
                borderColor: "#1ABC9C",
                color: "#1ABC9C",
                "&:hover": { borderColor: "#1ABC9C" },
              }}
              size="small"
              variant="outlined"
            >
              Proceed
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default App;
