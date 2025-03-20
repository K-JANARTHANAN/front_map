import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function MonthPage() {
  const { name } = useParams();
  const [crops, setCrops] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/crops/${name}`)
      .then((response) => {
        setCrops(response.data);
        updateChartData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching crops:', error);
      });
  }, [name]);

  const updateChartData = (data) => {
    const formattedData = data.map((crop) => ({
      name: crop.name,
      value: crop.frequency,
    }));
    setChartData(formattedData);
  };

  const handleCropClick = (id) => {
    axios.put(`http://localhost:8080/api/crops/update/${id}`)
      .then((response) => {
        const updatedCrops = crops.map((crop) =>
          crop.id === id ? { ...crop, frequency: crop.frequency + 1 } : crop
        );
        setCrops(updatedCrops);
        updateChartData(updatedCrops);
      })
      .catch((error) => {
        console.error('Error updating frequency:', error);
      });
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Crops Available in {name}</h2>
      <div>
        {crops.map((crop) => (
          <button
            key={crop.id}
            onClick={() => handleCropClick(crop.id)}
            style={{
              padding: '10px',
              margin: '5px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            {crop.name}
          </button>
        ))}
      </div>
      <h3>Crop Frequency</h3>
      <PieChart width={400} height={400}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

export default MonthPage;

