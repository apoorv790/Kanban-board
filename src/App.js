import React, { useState, useEffect } from 'react';
import Board from './components/Board/Board.jsx';
import "./App.css"

const App = () => {
  const [data, setData] = useState({ tickets: [], users: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
        const result = await response.json();
        setData(result);
        console.log(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <Board data={data} />
    </div>
  );
};

export default App;