import React, { useRef, useEffect, useState } from "react";
import Chart from "chart.js/auto";

const DoughnutChart = (props) => {
  const [totalComplete, setTotalComplete] = useState(null);
  const [totalIncomplete, setTotalIncomplete] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    setTotalIncomplete(props.totalIncomplete);
    setTotalComplete(props.totalComplete);
    console.log(totalComplete, totalIncomplete);
    const chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Incomplete", "Completed"],
        datasets: [
          {
            backgroundColor: ["#E46651", "#41B883"],
            data: [totalIncomplete, totalComplete],
          },
        ],
      },
      options: {
        responsive: true,
        cutout: "60%",
        plugins: {
          legend: {
            labels: {
              color: "green",
            },
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [totalIncomplete, totalComplete]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        maxWidth: "300px",
        maxHeight: "400px",
      }}
    />
  );
};

export default DoughnutChart;
