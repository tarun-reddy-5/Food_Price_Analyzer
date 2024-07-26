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
  monthName: string;
  price: number;
}

const countries = ["Australia", "Saudi Arabia", "United States of America"]; // Placeholder list of countries
const commodities = [
  "Beans",
  "Beans (dry)",
  "Beans (white)",
  "Bread",
  "Cabbage",
  "Carrots",
  "Cassava",
  "Cassava flour",
  "Eggs",
  "Exchange rate",
  "Fuel (diesel)",
  "Fuel (kerosene)",
  "Fuel (petrol-gasoline)",
  "Groundnuts (shelled)",
  "Lentils",
  "Maize",
  "Maize (local)",
  "Maize (white)",
  "Maize flour",
  "Meat (beef)",
  "Meat (chicken, whole)",
  "Meat (mutton)",
  "Meat (pork)",
  "Milk",
  "Millet",
  "Oil (sunflower)",
  "Oil (vegetable)",
  "Oil (vegetable, imported)",
  "Onions",
  "Pasta",
  "Potatoes",
  "Rice",
  "Rice (imported)",
  "Rice (local)",
  "Salt",
  "Sorghum",
  "Sorghum (white)",
  "Sugar",
  "Tea (black)",
  "Tomatoes",
  "Wage (non-qualified labour)",
  "Wage (non-qualified labour, non-agricultural)",
  "Wheat",
  "Wheat flour",
]; // Placeholder list of commodities

const theme = createTheme({
  typography: {
    fontFamily: ["Roboto", "Arial", "sans-serif"].join(","),
  },
});

function Season() {
  const [fromYear, setFromYear] = useState<string>("1970");
  const [toYear, setToYear] = useState<string>("2023");
  const [country, setCountry] = useState<string>("United States of America");
  const [commodity, setCommodity] = useState<string>("Beans (dry)");
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const [fetchStatus, setFetchStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const fetchData = async () => {
    try {
      setFetchStatus("loading");
      const url = `http://127.0.0.1:5000/api/season/?fromYear=${fromYear}&toYear=${toYear}&country=${country}&commodity=${commodity}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();

      setChartData(responseData.data);
      setFetchStatus("success");
    } catch (error) {
      console.error("Error fetching data:", error);
      setChartData([]); // Handle errors by setting an empty array or perform error handling as needed
      setFetchStatus("error");
    }
  };

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
        Seasonal Impact on Food Prices
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
            style={{ marginRight: "20px" }}
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
            <ResponsiveContainer width="90%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="monthName"
                  label={{
                    value: "Month",
                    position: "insideBottomRight",
                    dy: 15, // Adjust the vertical position as needed
                  }}
                />

                <YAxis
                  label={{
                    value: "Price",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#82ca9d"
                  name={`${commodity} Average Price per Month`}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default Season;
