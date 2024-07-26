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

// Define the ChartData interface

interface ChartData {
  year: string;

  price: number;
}

// Original lists for COVID event

const countriesCOVID = [
  "Australia",

  "Kyrgyzstan",

  "Mauritania",

  "Niger",

  "Saudi Arabia",

  "Sri Lanka",

  "Syrian Arab Republic",

  "United States of America",
];

const commoditiesCOVID = [
  "Bread",

  "Exchange rate",

  "Fuel (diesel)",

  "Wage (non-qualified labour, non-agricultural)",

  "Wheat",
];

// New lists for Global Recession

const countriesRecession = [
  "Australia",
  "Saudi Arabia",
  "United States of America",
]; // Example countries for Global Recession

const commoditiesRecession = [
  "Maize",
  "Maize (local)",
  "Maize (white)",
  "Millet",
  "Rice",
  "Rice (imported)",
  "Rice (local)",
  "Sorghum",
  "Sugar",
  "Wheat",
  "Wheat flour",
]; // Example commodities for Global Recession

const globalEvents = ["Covid 19", "Great Recession"];

const theme = createTheme({
  typography: {
    fontFamily: ["Roboto", "Arial", "sans-serif"].join(","),
  },
});

function GlobalEvent() {
  const [fromEvent, setGlobalEvent] = useState<string>("Covid 19");

  const [country, setCountry] = useState<string>("Australia");

  const [commodity, setCommodity] = useState<string>("Bread");

  const [chartData, setChartData] = useState<ChartData[]>([]);

  const [buttonClicked, setButtonClicked] = useState<boolean>(false);

  const [fetchStatus, setFetchStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const fetchData = async () => {
    try {
      setFetchStatus("loading");

      const url = `http://127.0.0.1:5000/api/globalEvent/?fromEvent=${fromEvent}&country=${country}&commodity=${commodity}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();

      setChartData(responseData.data);

      setFetchStatus("success");
    } catch (error) {
      console.error("Error fetching data:", error);

      setChartData([]);

      setFetchStatus("error");
    }
  };

  const handleButtonClick = () => {
    setButtonClicked(true);

    fetchData();
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />

      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Tama
          </Typography>
        </Toolbar>
      </AppBar>

      <Typography
        variant="h5"
        gutterBottom
        align="left"
        style={{
          marginLeft: "5%",

          marginTop: "20px",

          marginBottom: "10px",

          fontFamily: "Georgia, serif",

          color: "green",
        }}
      >
        Global Events Impact
      </Typography>

      <div
        style={{ marginTop: "40px", marginBottom: "20px", marginLeft: "5%" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <label
            htmlFor="fromEvent"
            style={{ marginRight: "10px", color: "#489AD8" }}
          >
            Global Event:
          </label>

          <select
            id="fromEvent"
            value={fromEvent}
            onChange={(e) => {
              setGlobalEvent(e.target.value);

              setCountry("");

              setCommodity("");
            }}
            style={{ marginRight: "20px" }}
          >
            <option value="">Select Global Event</option>

            {globalEvents.map((event) => (
              <option key={event} value={event}>
                {event}
              </option>
            ))}
          </select>

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
            <option value="">Select Country</option>

            {(fromEvent === "Great Recession"
              ? countriesRecession
              : countriesCOVID
            ).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

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
            <option value="">Select Commodity</option>

            {(fromEvent === "Great Recession"
              ? commoditiesRecession
              : commoditiesCOVID
            ).map((com) => (
              <option key={com} value={com}>
                {com}
              </option>
            ))}
          </select>

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

                color: "red",
              }}
            >
              No Data Available For This Input
            </div>
          )}

        {fetchStatus === "success" && chartData.length > 0 && (
          <div style={{ marginTop: "50px" }}>
            <ResponsiveContainer width="90%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="year"
                  label={{
                    value: "Year_Month",

                    position: "insideBottomRight",

                    dy: 15,
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
                  name={`${commodity} Price`}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default GlobalEvent;
