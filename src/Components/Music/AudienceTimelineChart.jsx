import React, { useEffect, useState, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Papa from "papaparse";
import "./MusicMain.css";

const formatXAxis = (tickItem) => {
  const date = new Date(tickItem);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const accumulateData = (data) => {
  let cumulativeListeners = 68187;
  let cumulativeStreams = 486177;

  return data.map((row) => {
    cumulativeListeners += row.listeners;
    cumulativeStreams += row.streams;
    return {
      date: row.date,
      listeners: cumulativeListeners,
      streams: cumulativeStreams,
      followers: row.followers,
    };
  });
};

const filterDataEverySixMonths = (data) => {
  if (data.length === 0) return [];
  
  const filteredData = [data[0]];
  let lastDate = new Date(data[0].date);

  for (let i = 1; i < data.length; i++) {
    const currentDate = new Date(data[i].date);
    const monthsDifference =
      (currentDate.getFullYear() - lastDate.getFullYear()) * 12 +
      (currentDate.getMonth() - lastDate.getMonth());
    
    if (monthsDifference >= 4) {
      filteredData.push(data[i]);
      lastDate = currentDate;
    }
  }

  if (filteredData[filteredData.length - 1].date !== data[data.length - 1].date) {
    filteredData.push(data[data.length - 1]);
  }

  return filteredData;
};

const lineConfig = [
  { 
    dataKey: "listeners", 
    name: "Listeners", 
    color: "rgb(201, 114, 241)" 
  },
  { 
    dataKey: "streams", 
    name: "Total Streams", 
    color: "rgb(179, 33, 145)" 
  },
  { 
    dataKey: "followers", 
    name: "Followers", 
    color: "rgb(234, 59, 59)" 
  }
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-date">{formatXAxis(label)}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const renderLegend = (props) => {
  const { payload } = props;
  return (
    <div className="chart-legend">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="legend-item">
          <div className="legend-color" style={{ backgroundColor: entry.color }}></div>
          <span className="legend-text">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const AudienceTimelineChart = () => {
  const [data, setData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [chartVisible, setChartVisible] = useState(false);
  const chartRef = useRef(null);

  // Fetch CSV data
  useEffect(() => {
    fetch("/Shep-audience-timeline.csv")
      .then((response) => response.text())
      .then((csvData) => {
        Papa.parse(csvData, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (result) => {
            const parsedData = result.data.map((row) => ({
              date: new Date(row.date).toISOString().split("T")[0],
              listeners: Number(row.listeners) || 0,
              streams: Number(row.streams) || 0,
              followers: Number(row.followers) || 0,
            }));
            setData(filterDataEverySixMonths(accumulateData(parsedData)));
          },
        });
      })
      .catch((error) => console.error("Data Error: Error loading CSV!", error));
  }, []);

  // Detect when the chart enters the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => {
      if (chartRef.current) {
        observer.disconnect();
      }
    };
  }, [isVisible]);

  // Show chart (and trigger built-in animations) when visible and data is loaded
  useEffect(() => {
    if (isVisible && data.length > 0) {
      setTimeout(() => {
        setChartVisible(true);
      }, 100);
    }
  }, [isVisible, data]);

  // Custom dot that displays for every data point except the first and last
  const CustomDot = (props) => {
    const { cx, cy, index, stroke, fill } = props;
    // Exclude first and last dots based on the current data length
    if (index === 0 || index === data.length - 1) return null;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        stroke={stroke}
        strokeWidth={1}
        fill={fill || stroke}
        className="custom-dot"
      />
    );
  };

  return (
    <div 
      className="main-container" 
      ref={chartRef}
      style={{ overflow: 'visible' }}
    >
      {chartVisible && (
        <ResponsiveContainer width="100%" height={450}>
          <LineChart data={data} margin={{ top: 0, bottom: 20, left: 0, right: 0}}>
            <XAxis dataKey="date" tickFormatter={formatXAxis} />
            <YAxis yAxisId="left" domain={[0, 'auto']} tick={false} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 'auto']} tick={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
            {lineConfig.map((config, index) => (
              <Line 
                key={config.dataKey}
                yAxisId={config.dataKey === "followers" ? "right" : "left"}
                type="monotone" 
                dataKey={config.dataKey}
                name={config.name}
                stroke={config.color}
                strokeWidth={2}
                dot={CustomDot}
                isAnimationActive={true}
                animationDuration={1000}
                animationBegin={600 + index * 200}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AudienceTimelineChart;
