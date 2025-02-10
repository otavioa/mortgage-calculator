import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import FormularioFinanciamento from './FormularioFinanciamento';
import ListaSimulacoes from './ListaSimulacoes';
import GraficosFinanciamento from './GraficosFinanciamento';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SimuladorFinanciamento() {
  const [simulacoes, setSimulacoes] = useState([]);
  
  useEffect(() => {
    const simulacoesStorage = localStorage.getItem('simulacoes');
    if (simulacoesStorage) {
      setSimulacoes(JSON.parse(simulacoesStorage));
    }
  }, []);

  const adicionarSimulacao = (novaSimulacao) => {
    const simulacoesAtualizadas = [...simulacoes, novaSimulacao];
    setSimulacoes(simulacoesAtualizadas);
    localStorage.setItem('simulacoes', JSON.stringify(simulacoesAtualizadas));
  };

  const removerSimulacao = (index) => {
    const simulacoesAtualizadas = simulacoes.filter((_, i) => i !== index);
    setSimulacoes(simulacoesAtualizadas);
    localStorage.setItem('simulacoes', JSON.stringify(simulacoesAtualizadas));
  };

  return (
    <div className="grid gap-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200 bg-primary-50">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-primary-800">
              Nova Simulação
            </h2>
          </div>
        </div>
        <div className="p-6">
          <FormularioFinanciamento onAdicionar={adicionarSimulacao} />
        </div>
      </div>

      <div className="grid gap-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200 bg-primary-50">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-primary-800">
              Simulações Cadastradas
            </h2>
          </div>
        </div>
        <div className="p-6">
          <ListaSimulacoes 
              simulacoes={simulacoes} 
              onRemover={removerSimulacao} 
            />

{simulacoes.length > 0 && (
          <div className="lg:col-span-2">
            <GraficosFinanciamento simulacoes={simulacoes} />
          </div>
        )}
        </div>
      </div>
      </div>
    </div>
  );
}

export default SimuladorFinanciamento; 