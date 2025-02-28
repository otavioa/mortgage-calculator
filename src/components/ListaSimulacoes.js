import React from 'react';
import { TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { formatarMoeda, formatarPorcentagem, formatarNumero } from '../utils/formatters';

function ListaSimulacoes({ simulacoes, onRemover }) {
  if (!simulacoes || simulacoes.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
        Nenhuma simulação cadastrada ainda.
      </div>
    );
  }

  const exportarCSV = (simulacao) => {
    const parcelas = simulacao.parcelas.map((parcela, index) => ({
      'N° da Parcela': index + 1,
      'Valor Total da Parcela': formatarNumero(parcela.valorParcela),
      'Valor dos Juros': formatarNumero(parcela.juros),
      'Valor das Taxas': formatarNumero(parcela.custosMensais),
      'Valor Amortizado': formatarNumero(parcela.amortizacao),
      'Saldo Devedor': formatarNumero(parcela.saldoDevedor),
    }));

    const csvContent = [
      ['N° da Parcela', 'Valor Total da Parcela', 'Valor dos Juros', 'Valor das Taxas', 'Valor Amortizado', 'Saldo Devedor'],
      ...parcelas.map(parcela => Object.values(parcela)),
    ]
      .map(e => e.join(";"))
      .join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `simulacao_${simulacao.dataCriacao}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <div className="overflow-x-auto">
        <div className="space-y-4 min-w-[425px]">
          {simulacoes.map((simulacao, index) => {
            const temParcelas = simulacao.parcelas && simulacao.parcelas.length > 0;
            const primeiraParcela = temParcelas ? simulacao.parcelas[0].valorParcela : null;
            const ultimaParcela = temParcelas ? simulacao.parcelas[simulacao.parcelas.length - 1].valorParcela : null;

            let totalGasto = 0;
            let totalJuros = 0;
            let totalCustos = 0;

            if (temParcelas) {
              simulacao.parcelas.forEach(parcela => {
                totalGasto += parcela.valorParcela;
                totalJuros += parcela.juros;
                totalCustos += parcela.custosMensais;
              });
            }

            return (
              <div id="simulacaoContainer"
                key={simulacao.dataCriacao || index}
                className="border rounded-lg p-4 hover:bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div id="simulacaoContent" className="flex-1 w-full">
                  <h3 className="font-semibold text-lg">
                    Financiamento {simulacao.tipo || 'N/A'}
                  </h3>
                  <div className="mt-2 text-sm text-gray-600 grid grid-cols-1 md:grid-cols-3">
                    <p>Valor do Imóvel: {formatarMoeda(simulacao.valorImovel)}</p>
                    <p>Valor Financiado: {formatarMoeda(simulacao.valorFinanciado)}</p>
                    <p>Prazo: {simulacao.prazoMeses} meses</p>
                    <p>Taxa de Juros: {formatarPorcentagem(simulacao.taxaJurosAnual)} ao ano</p>
                    <p>Encargos de Taxa Adm. + Seguros: {formatarMoeda(totalCustos)}</p>
                    <p>Taxa TR: {formatarPorcentagem(simulacao.taxaTR)} ao ano</p>
                    {temParcelas && (
                      <>
                        <p>Primeira Parcela: {formatarMoeda(primeiraParcela)}</p>
                        <p>Última Parcela: {formatarMoeda(ultimaParcela)}</p>
                      </>
                    )}
                  </div>
                  <div className="mt-4 border-t pt-2">
                    <h4 className="font-semibold text-lg">Totais</h4>
                    <p className="text-green-600 font-bold">Total gasto: {formatarMoeda(totalGasto)}</p>
                    <p className="text-green-600 font-bold">Total gasto com Juros: {formatarMoeda(totalJuros)}</p>
                    <p className="text-green-600 font-bold">Total gasto com Taxa Adm. + Seguros: {formatarMoeda(totalCustos)}</p>
                  </div>
                </div>
                <div id="buttonContainer" className="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-end">
                  <button
                    onClick={() => exportarCSV(simulacao)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                    title="Exportar como CSV"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onRemover(index)}
                    className="text-red-600 hover:text-red-800 p-2"
                    title="Remover simulação"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ListaSimulacoes; 