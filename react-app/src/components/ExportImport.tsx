import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import GlobalStyles from "@mui/material/GlobalStyles";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  year: number;
  price: number;
  export: number;
  import: number;
}

const countries = ["Australia", "Saudi Arabia", "United States of America"]; // Placeholder list of countries
const commodities = [
  "Almonds, Shelled Basis",
  "Apples, Fresh",
  "Barley",
  "Coffee, Green",
  "Corn",
  "Fresh Peaches and Nectarines",
  "Grapes, Fresh Table",
  "Meal, Cottonseed",
  "Meal, Soybean",
  "Meal, Sunflowerseed",
  "Meat, Beef and Veal",
  "Meat, Chicken",
  "Oil, Cottonseed",
  "Oil, Olive",
  "Oil, Palm",
  "Oil, Soybean",
  "Oil, Sunflowerseed",
  "Oilseed, Cottonseed",
  "Oilseed, Soybean",
  "Oilseed, Sunflowerseed",
  "Oranges, Fresh",
  "Peaches and Nectarines, Fresh",
  "Pears, Fresh",
  "Pistachios, Inshell Basis",
  "Poultry, Meat, Broiler",
  "Rice, Milled",
  "Sorghum",
  "Sugar, Centrifugal",
  "Tobacco, Mfg., Cigarettes",
  "Wheat",
]; // Placeholder list of commodities

const theme = createTheme({
  typography: {
    fontFamily: ["Roboto", "Arial", "sans-serif"].join(","),
  },
});

function ExportImport() {
  const [fromYear, setFromYear] = useState<string>("1970");
  const [toYear, setToYear] = useState<string>("2023");
  const [country, setCountry] = useState<string>("United States of America");
  const [commodity, setCommodity] = useState<string>("Wheat");
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const [fetchStatus, setFetchStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const fetchData = async () => {
    try {
      setFetchStatus("loading"); // Start fetching
      const url = `http://127.0.0.1:5000/api/exportImport/?fromYear=${fromYear}&toYear=${toYear}&country=${country}&commodity=${commodity}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();

      setChartData(responseData.data);
      setFetchStatus("success"); // Fetch successful
    } catch (error) {
      console.error("Error fetching data:", error);
      setChartData([]); // Handle errors by setting an empty array or perform error handling as needed
      setFetchStatus("error"); // Fetch failed
    }
  };

  // useEffect(() => {
  //   fetchData(); // Call fetchData when the component mounts
  // }, []); // Empty dependency array ensures it runs only once on mount

  const handleFromYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFromYear(e.target.value);
  };

  const handleToYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setToYear(e.target.value);
  };

  const handleButtonClick = () => {
    setButtonClicked(true); // Set buttonClicked to true when Go is clicked
    fetchData();
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

      {/* Heading */}
      <Typography
        variant="h5"
        gutterBottom
        align="left"
        style={{
          marginLeft: "5%",
          marginTop: "20px",
          marginBottom: "10px",
          fontFamily: "Georgia, serif",
          color: "green", // Change the heading color here
        }}
      >
        Exports and Imports Impact on Food Prices
      </Typography>

      <div
        style={{
          marginTop: "40px",
          marginBottom: "20px",
          marginLeft: "5%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          {/* From Year Dropdown */}
          <label
            htmlFor="fromYear"
            style={{ marginRight: "10px", color: "#489AD8" }}
          >
            From Year:
          </label>
          <select
            id="fromYear"
            value={fromYear}
            onChange={handleFromYearChange}
            style={{ marginRight: "20px" }}
          >
            {Array.from({ length: 54 }, (_, index) => 1970 + index).map(
              (year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              )
            )}
          </select>

          {/* To Year Dropdown */}
          <label
            htmlFor="toYear"
            style={{ marginRight: "10px", color: "#489AD8" }}
          >
            To Year:
          </label>
          <select
            id="toYear"
            value={toYear}
            onChange={handleToYearChange}
            style={{ marginRight: "20px" }}
          >
            {Array.from({ length: 54 }, (_, index) => 1970 + index).map(
              (year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              )
            )}
          </select>

          {/* Country Dropdown */}
          <label
            htmlFor="country"
            style={{ marginRight: "10px", color: "#489AD8" }}
          >
            Country:
          </label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{ marginRight: "20px" }}
          >
            {/* <option value="">Select Country</option> */}
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Commodity Dropdown */}
          <label
            htmlFor="commodity"
            style={{ marginRight: "10px", color: "#489AD8" }}
          >
            Commodity:
          </label>
          <select
            id="commodity"
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
          >
            {/* <option value="">Select Commodity</option> */}
            {commodities.map((com) => (
              <option key={com} value={com}>
                {com}
              </option>
            ))}
          </select>

          {/* Go Button */}
          <button
            onClick={handleButtonClick}
            style={{
              width: "120px",
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "8px 16px",
              cursor: "pointer",
              marginLeft: "20px",
            }}
          >
            Go
          </button>
        </div>

        {buttonClicked &&
          fetchStatus === "success" &&
          chartData.length === 0 && (
            <div
              style={{
                marginTop: "50px",
                textAlign: "center",
                fontFamily: "Arial, sans-serif",
                color: "red", // Adjust the color as needed
              }}
            >
              No Data Available For This Input
            </div>
          )}

        {fetchStatus === "success" && chartData.length > 0 && (
          <div style={{ marginTop: "50px" }}>
            {" "}
            {/* Add margin-top to create space */}
            <ResponsiveContainer width="90%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  label={{
                    value: "Year",
                    position: "insideBottomRight",
                    dy: 15, // Adjust the vertical position as needed
                  }}
                />

                <YAxis
                  yAxisId="left"
                  label={{
                    value: "Exports and Imports",
                    angle: -90,
                    position: "insideBottomLeft",
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{
                    value: "Price",
                    angle: -90,
                    position: "insideRight",
                  }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#8884d8"
                  name={`${commodity} Price per Metric Ton`}
                  yAxisId="right"
                />
                <Line
                  type="monotone"
                  dataKey="export"
                  stroke="#82ca9d"
                  name="Exports in Metric Tons"
                  yAxisId="left"
                />
                <Line
                  type="monotone"
                  dataKey="import"
                  stroke="#ffc658"
                  name="Imports in Metric Tons"
                  yAxisId="left"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default ExportImport;
