import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function VizBlock({ block, theme }) {
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
  
  // Détection automatique ou configuration manuelle
  let type = 'bar';
  let labelColumn = headers[0];
  let valueColumn = headers[1];
  let chartLabel = 'Valeurs';

  if (block.vizConfig && block.vizConfig.type) {
    type = block.vizConfig.type;
    labelColumn = block.vizConfig.labelColumn || headers[0];
    valueColumn = block.vizConfig.valueColumn || headers[1];
    chartLabel = block.vizConfig.label || valueColumn;
  } else {
    // Essayer de trouver une colonne numérique pour valueColumn si headers[1] ne l'est pas
    const numericCol = headers.find(h => !isNaN(parseFloat(data[0][h])));
    if (numericCol) {
        valueColumn = numericCol;
        // Si la colonne numérique est la même que labelColumn, prendre une autre pour label
        if (valueColumn === labelColumn) {
            labelColumn = headers.find(h => h !== valueColumn) || headers[0];
        }
    }
  }

  // Si on a au moins deux colonnes, on affiche un graphique par défaut
  if (headers.length >= 2) {
    const chartLabels = data.map(row => row[labelColumn]);
    const chartValues = data.map(row => parseFloat(row[valueColumn]));

    // Gestion des couleurs
    let bgColors, borderColors;
    
    if (theme && theme.chartColor) {
        // Utiliser la couleur du thème
        // Conversion simple hex vers rgba pour l'opacité
        const hexToRgba = (hex, alpha) => {
            let r = 0, g = 0, b = 0;
            if (hex.length === 4) {
                r = parseInt(hex[1] + hex[1], 16);
                g = parseInt(hex[2] + hex[2], 16);
                b = parseInt(hex[3] + hex[3], 16);
            } else if (hex.length === 7) {
                r = parseInt(hex.substring(1, 3), 16);
                g = parseInt(hex.substring(3, 5), 16);
                b = parseInt(hex.substring(5, 7), 16);
            }
            return `rgba(${r},${g},${b},${alpha})`;
        };

        const mainColor = theme.chartColor;
        // Pour un pie chart, on veut plusieurs couleurs. Pour Bar/Line, une seule peut suffire.
        // Générons des variations simples pour le pie chart
        if (type === 'pie') {
            bgColors = chartValues.map((_, i) => hexToRgba(mainColor, 1 - (i * 0.1) % 0.8)); // Dégradé d'opacité
            borderColors = chartValues.map(() => mainColor);
        } else {
            bgColors = hexToRgba(mainColor, 0.6);
            borderColors = mainColor;
        }

    } else {
        // Couleurs par défaut
        bgColors = [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
        ];
        borderColors = [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
        ];
    }

    const chartData = {
      labels: chartLabels,
      datasets: [
        {
          label: chartLabel,
          data: chartValues,
          backgroundColor: bgColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: block.content || 'Graphique automatique',
          color: theme?.titleColor || '#666', // Appliquer la couleur de titre du thème au titre du graphique aussi
          font: {
             family: theme?.fontFamily || "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
          }
        },
      },
    };

    return (
      <div className="viz-chart-container" style={{ maxWidth: '800px', margin: '10px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        {type === 'bar' && <Bar data={chartData} options={options} />}
        {type === 'line' && <Line data={chartData} options={options} />}
        {type === 'pie' && <Pie data={chartData} options={options} />}
      </div>
    );
  }

  // Fallback final : Affichage tableau
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