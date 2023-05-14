import React, { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './App.css'; // Import the CSS file for styling

const App = () => {
  const [histogramData, setHistogramData] = useState([]);

  const fetchHistogramData = async () => {
    try {
      const response = await axios.get('https://www.terriblytinytales.com/test.txt');
      const data = response.data;

      // Split the content into an array of words
      const words = data.split(/\s+/);

      // Count the frequency of each word
      const frequencyMap = {};
      words.forEach((word) => {
        if (word !== '') {
          frequencyMap[word] = (frequencyMap[word] || 0) + 1;
        }
      });

      // Sort the words by frequency in descending order and take the top 20
      const sortedWords = Object.keys(frequencyMap).sort((a, b) => frequencyMap[b] - frequencyMap[a]);
      const top20Words = sortedWords.slice(0, 20);

      // Prepare the histogram data
      const histogramData = top20Words.map((word) => ({
        word,
        frequency: frequencyMap[word],
      }));

      setHistogramData(histogramData);
    } catch (error) {
      console.error('Error fetching histogram data:', error);
    }
  };

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURI(
      'Word,Frequency\n' +
      histogramData.map(({ word, frequency }) => `${word},${frequency}`).join('\n')
    );

    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', 'histogram_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
      <button onClick={fetchHistogramData}>Submit</button>
      {histogramData.length > 0 && (
        <div>
          <button onClick={exportCSV}>Export</button>
          <div className="chart-container">
            <BarChart width={800} height={400} data={histogramData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="word" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="frequency" fill="#8884d8" />
            </BarChart>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
