import React from 'react';
import { Line } from 'react-chartjs-2';

function GraficosFinanciamento({ simulacoes }) {
  const cores = [
    'rgb(53, 162, 235)',
    'rgb(255, 99, 132)',
    'rgb(75, 192, 192)',
    'rgb(255, 205, 86)',
    'rgb(153, 102, 255)'
  ];

  return (
    <div className="space-y-8">
      {simulacoes.map((simulacao, index) => {
        const dadosGrafico = {
          labels: simulacao.parcelas.map(p => p.numero),
          datasets: [
            {
              label: "Parcela",
              data: simulacao.parcelas.map(p => p.valorParcela),
              borderColor: cores[index % cores.length],
              backgroundColor: cores[index % cores.length],
              tension: 0.1,
              yAxisID: 'y',
            },
            {
              label: "Saldo Devedor",
              data: simulacao.parcelas.map(p => p.saldoDevedor),
              borderColor: cores[(index + 1) % cores.length],
              backgroundColor: cores[(index + 1) % cores.length],
              tension: 0.1,
              yAxisID: 'y1',
            },
            {
              label: "Amortização",
              data: simulacao.parcelas.map(p => p.amortizacao),
              borderColor: cores[(index + 2) % cores.length],
              backgroundColor: cores[(index + 2) % cores.length],
              tension: 0.1,
              yAxisID: 'y',
            }
          ]
        };

        const opcoes = {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: `Evolução do Financiamento - ${simulacao.tipo}`
            }
          },
          interaction: {
            mode: 'index',
            intersect: false
          },
          scales: {
            y: {
              min: 0,
              max: Math.max(...simulacao.parcelas.map(p => Math.max(p.valorParcela, p.amortizacao))) * 1.1,
              position: 'left',
            },
            y1: {
              min: 0,
              max: Math.max(...simulacao.parcelas.map(p => p.saldoDevedor)) * 1.1,
              position: 'right',
              grid: {
                drawOnChartArea: false,
              },
            },
            x: {
              beginAtZero: true,
            }
          }
        };

        return (
          <div key={simulacao.dataCriacao} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 text-primary-700">Gráfico de {simulacao.tipo}</h3>
            <Line data={dadosGrafico} options={opcoes} />
          </div>
        );
      })}
    </div>
  );
}

export default GraficosFinanciamento; 