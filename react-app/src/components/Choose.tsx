import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import GlobalStyles from "@mui/material/GlobalStyles";
import { Box } from "@mui/material";

import image1 from "../images/farmer.jpg";
import image2 from "../images/distributor.jpg";
import image3 from "../images/policyHolder.jpg";

const searchParams = new URLSearchParams(window.location.search);
const info = searchParams.get("info");

// Theme setup
const theme = createTheme({
  typography: {
    fontFamily: ["Roboto", "Arial", "sans-serif"].join(","),
  },
});

const content = [
  "Exports and Imports Impact",
  "Climate Impact",
  "Global Events Impact",
  "Unaffordability",
  "Seasonal Trends",
];

const isVisible = (queryIndex: number) => {
  if (info === "Farmers" && (queryIndex === 1 || queryIndex === 3)) {
    return false; // Hide query 1 for Farmers
  } else if (
    info === "Distributors" &&
    (queryIndex === 0 || queryIndex === 4)
  ) {
    return false; // Hide query 1 for Farmers
  }
  // Add other visibility conditions based on the info value
  return true; // Show by default
};

function Choose() {
  const imgStyle: React.CSSProperties = {
    width: "30%", // Occupy the full width of the div
    height: "30%", // Occupy the full height of the div
    objectFit: "cover", // Maintain aspect ratio and cover the div area
    borderRadius: "5%",
    marginTop: "10px", // Makes the image circular
  };

  let imageSrc = "";

  const getHeading = () => {
    let headingText = "Default Heading";
    let fontSize = "30px";
    let color = "#416FA3"; // Default color
    let fontFamily = "Georgia, serif";

    if (info === "Farmers") {
      headingText = "For Farmers";
      imageSrc = image1;
      // Update font size and color for Farmers
    } else if (info === "Distributors") {
      headingText = "For Distributors";
      imageSrc = image2;
    } else {
      headingText = "For Policy Makers";
      imageSrc = image3;
    }
    // Add other conditions for different 'info' values if needed

    return (
      <Typography variant="h2" style={{ fontSize, color, fontFamily }}>
        {headingText}
      </Typography>
    );
  };

  const handleClick = (index: number) => {
    // Handle click event for each flex item
    if (index == 0) {
      window.location.href = "http://localhost:5173/exportImport";
    }
    if (index == 1) {
      window.location.href = "http://localhost:5173/climateChange";
    }
    if (index == 2) {
      window.location.href = "http://localhost:5173/globalEvent";
    }
    if (index == 3) {
      window.location.href = "http://localhost:5173/unaffordability";
    }
    if (index == 4) {
      window.location.href = "http://localhost:5173/season";
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Global styles */}
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />

      {/* Header */}
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Tama {/* Your app/company name */}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          height: "400px", // Set a height for the flex container
          backgroundColor: "#ffffff", // Background color for the flex container
          padding: "20px", // Add padding for spacing
        }}
      >
        {getHeading() /* Render the heading based on 'info' value */}

        {imageSrc && <img src={imageSrc} alt="Image 1" style={imgStyle} />}

        {[...Array(5)].map(
          (_, index) =>
            isVisible(index) && (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flex: "0 0 50px", // Fixed height for each item
                  width: "60%",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                  textAlign: "center",
                  marginTop: "30px", // Spacing between items
                  marginBottom: "10px",
                  backgroundColor: "#C5F1CB",
                  borderRadius: "10px",
                  fontFamily: "Georgia, serif",
                }}
                onClick={() => handleClick(index)}
              >
                <Typography
                  variant="body1"
                  sx={{ fontFamily: "Georgia, serif" }}
                >
                  {content[index]}
                </Typography>
              </Box>
            )
        )}
      </Box>
    </ThemeProvider>
  );
}

export default Choose;
