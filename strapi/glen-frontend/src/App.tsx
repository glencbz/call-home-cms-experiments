 import './App.css';
import { useCallback, useState, default as React } from 'react';
import { default as axios } from 'axios';

// Default port for Strapi. Configure as needed.
const API_ROOT = 'http://localhost:1337/api';
// Routes. Comes from our Strapi config.
const ROUTES = {
  LAW_SOC: '/law-soc',
}

// Strapi wraps each model in a "data". Inside which, the things we care about
// are in "attributes".
interface StrapiModelResponse<T> {
  data: {
    attributes: T
  }
}

interface LawSocView {
  title: string;
  subtitle: string;
}

function App() {
  const [title, setTitle] = useState('Placeholder');
  const [subtitle, setSubtitle] = useState('Also a placeholder');

  const getBackendData = useCallback(async () => {
    const response = await axios
      .get<StrapiModelResponse<LawSocView>>(API_ROOT + ROUTES.LAW_SOC);
    const {
      title: newTitle,
      subtitle: newSubtitle
    } = response.data.data.attributes;

    setTitle(newTitle);
    setSubtitle(newSubtitle);
  }, []);

  return (
    <div className="App">
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <button onClick={getBackendData}>Get some backend data!!</button>
    </div>
  );
}

export default App;
