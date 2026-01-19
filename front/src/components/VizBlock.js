import React, { useEffect, useState } from 'react';

function VizBlock({ block }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!block.media) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/media/${block.media.id}/data`);
        if (!res.ok) throw new Error('Données introuvables');
        const jsonData = await res.json();
        setData(jsonData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [block.media]);

  if (loading) return <p>Chargement des données...</p>;
  if (!data.length) return <p>Aucune donnée à afficher.</p>;

  const headers = Object.keys(data[0]);

  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            {headers.map(header => <th key={header}>{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {headers.map(header => <td key={header}>{row[header]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VizBlock;
