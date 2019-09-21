import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const Fib = () => {
  const [seenIndices, setSeenIndices] = useState([]);
  const [values, setValues] = useState({});
  const [index, setIndex] = useState('');

  const fetchValues = useCallback(async () => {
    const response = await axios.get('/api/values/current');
    setValues(response.data);
  }, [setValues]);

  const fetchIndices =  useCallback(async () => {
    const response = await axios.get('/api/values/all');
    setSeenIndices(response.data);
  }, [setSeenIndices]);

  const fetchAll = useCallback(() => {
    fetchValues();
    fetchIndices();
  }, [fetchValues, fetchIndices]);


  const handleSubmit = async event => {
    event.preventDefault();

    await axios.post('/api/values', {
      index
    });
    setIndex('');
    fetchAll();
  }

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);


  const renderSeenIndices = () => {
    return seenIndices.map(({ number }) => number).join(', ');
  }

  const renderValues = () => {
    const entries = [];

    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      );
    }

    return entries;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Enter your index:</label>
        <input
          value={index}
          onChange={event => setIndex(event.target.value)}
        />
        <button>Submit</button>
      </form>

      <h3>Indices I have seen:</h3>
      {renderSeenIndices()}

      <h3>Calculated Values:</h3>
      {renderValues()}
    </div>
  );
}

export default Fib;
