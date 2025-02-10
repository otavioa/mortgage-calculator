import React, { useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { calcularParcelas } from '../utils/calculosFinanciamento';
import { formatarMoeda } from '../utils/formatters';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

function FormularioFinanciamento({ onAdicionar }) {
  const [form, setForm] = useState({
    tipo: 'SAC',
    valorImovel: '',
    valorEntrada: '',
    prazoMeses: '',
    taxaJurosAnual: '',
    encargosAdm: '',
    encargosSeguro: '',
    taxaTR: ''
  });

  const [erro, setErro] = useState('');

  const converterParaNumero = (valor) => {
    return !valor ? 0 : parseFloat(valor);
  };

  const handleValorImovelChange = (values) => {
    const novoValor = values.value;
    setForm({ ...form, valorImovel: novoValor });
  };

  const handleValorEntradaChange = (values) => {
    const novoValor = values.value;
    setForm({ ...form, valorEntrada: novoValor });
  };

  const handlePrazoChange = (values) => {
    const novoPrazo = values.value;
    setForm({ ...form, prazoMeses: novoPrazo });
  };

  const validarFormulario = () => {
    const valorImovelNum = converterParaNumero(form.valorImovel);
    const valorEntradaNum = converterParaNumero(form.valorEntrada);
    const taxaJuros = converterParaNumero(form.taxaJurosAnual);
    const taxaTR = converterParaNumero(form.taxaTR);
    const prazo = converterParaNumero(form.prazoMeses);
    const encargosAdm = converterParaNumero(form.encargosAdm);
    const encargosSeguro = converterParaNumero(form.encargosSeguro);
    
    if (valorImovelNum <= 0) {
      setErro('O valor do imóvel deve ser maior que zero.');
      return false;
    }
    if (valorEntradaNum <= 0) {
      setErro('O valor da entrada deve ser maior que zero.');
      return false;
    }
    if (valorEntradaNum >= valorImovelNum) {
      setErro('O valor da entrada deve ser menor que o valor do imóvel.');
      return false;
    } else if (valorEntradaNum < valorImovelNum * 0.2) {
      setErro('A entrada mínima deve ser de 20% do valor do imóvel.');
      return false;
    }
    if (prazo <= 0) {
      setErro('O prazo deve ser maior que zero.');
      return false;
    }
    if (prazo < 120) {
      setErro('O prazo mínimo é de 120 meses (10 anos).');
      return false;
    } else if (prazo > 420) {
      setErro('O prazo máximo é de 420 meses (35 anos).');
      return false;
    }
    
    if (taxaJuros <= 0) {
      setErro('A taxa de juros deve ser maior que zero.');
      return false;
    }
    if (taxaTR < 0) {
      setErro('A taxa TR não pode ser negativa.');
      return false;
    }

    if (encargosAdm < 0) {
      setErro('A taxa de administração não pode ser negativa.');
      return false;
    }
    if (!encargosSeguro < 0) {
      setErro('O valor dos seguros não pode ser negativo.');
      return false;
    }
    setErro('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    try {
      const valorImovelNumerico = converterParaNumero(form.valorImovel);
      const valorEntradaNumerico = converterParaNumero(form.valorEntrada);
      const valorFinanciado = valorImovelNumerico - valorEntradaNumerico;

      const parcelas = calcularParcelas({
        tipo: form.tipo,
        valorFinanciado,
        prazoMeses: parseInt(form.prazoMeses),
        taxaJurosAnual: converterParaNumero(form.taxaJurosAnual),
        encargosAdm: converterParaNumero(form.encargosAdm),
        encargosSeguro: converterParaNumero(form.encargosSeguro),
        taxaTR: converterParaNumero(form.taxaTR),
      });

      onAdicionar({
        ...form,
        valorFinanciado,
        parcelas,
        dataCriacao: new Date().toISOString()
      });

      setForm({
        tipo: 'SAC',
        valorImovel: '',
        valorEntrada: '',
        prazoMeses: '',
        taxaJurosAnual: '',
        encargosAdm: '',
        encargosSeguro: '',
        taxaTR: ''
      });
      setErro('');
    } catch (error) {
      setErro('Erro ao calcular o financiamento. Verifique os valores informados.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {erro && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <p className="font-medium">{erro}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Financiamento:
            <QuestionMarkCircleIcon className="h-5 w-5 inline-block ml-1 cursor-pointer" title="Escolha o tipo de financiamento desejado." />
          </label>
          <select
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors duration-200"
          >
            <option value="SAC">SAC</option>
            <option value="PRICE">PRICE</option>
          </select>
        </div>

        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor do Imóvel:
            <QuestionMarkCircleIcon className="h-5 w-5 inline-block ml-1 cursor-pointer" title="Informe o valor total do imóvel." />
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">R$</span>
            </div>
            <NumericFormat
              value={form.valorImovel}
              onValueChange={handleValorImovelChange}
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              prefix=""
              placeholder="0,00"
              isNumericString
              className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-200 bg-gray-50 transition-colors duration-200"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor da Entrada:
            <QuestionMarkCircleIcon className="h-5 w-5 inline-block ml-1 cursor-pointer" title="Informe o valor que você pretende dar como entrada." />
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">R$</span>
            </div>
            <NumericFormat
              value={form.valorEntrada}
              onValueChange={handleValorEntradaChange}
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              prefix=""
              placeholder="0,00"
              isNumericString
              className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-200 bg-gray-50 transition-colors duration-200"
            />
          </div>
          {form.valorImovel && (
            <p className="mt-1 text-sm text-gray-500">
              Entrada mínima: {formatarMoeda(converterParaNumero(form.valorImovel) * 0.2)}
            </p>
          )}
          {form.valorImovel && form.valorEntrada && (
            <p className="mt-1 text-sm text-gray-500">
              Valor a financiar: {formatarMoeda(
                converterParaNumero(form.valorImovel) -
                converterParaNumero(form.valorEntrada)
              )}
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prazo: (meses)
            <QuestionMarkCircleIcon className="h-5 w-5 inline-block ml-1 cursor-pointer" title="Informe o prazo em meses para o financiamento." />
          </label>
          <div className="relative">
            <NumericFormat
              value={form.prazoMeses}
              onValueChange={handlePrazoChange}
              decimalScale={0}
              allowNegative={false}
              placeholder="360"
              min={120}
              max={420}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-200 bg-gray-50 transition-colors duration-200"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">meses</span>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Taxa de Juros Anual:
            <QuestionMarkCircleIcon className="h-5 w-5 inline-block ml-1 cursor-pointer" title="Informe a taxa de juros efetiva anual do financiamento." />
          </label>
          <div className="relative">
            <NumericFormat
              value={form.taxaJurosAnual}
              onValueChange={(values) => {
                setForm({ ...form, taxaJurosAnual: values.value });
              }}
              decimalScale={2}
              allowNegative={false}
              fixedDecimalScale
              decimalSeparator=","
              suffix="%"
              placeholder="8,50%"
              className="w-full pr-8 pl-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors duration-200"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Taxa Referencial (TR):
            <QuestionMarkCircleIcon className="h-5 w-5 inline-block ml-1 cursor-pointer" title="Informe a expectativa para a Taxa Referencial (TR) no ano." />
          </label>
          <div className="relative">
            <NumericFormat
              value={form.taxaTR}
              onValueChange={(values) => {
                setForm({ ...form, taxaTR: values.value });
              }}
              decimalScale={2}
              fixedDecimalScale
              decimalSeparator=","
              allowNegative={false}
              suffix="%"
              placeholder="1,70%"
              className="w-full pr-8 pl-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors duration-200"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Encargos com Administração:
            <QuestionMarkCircleIcon className="h-5 w-5 inline-block ml-1 cursor-pointer" title="Informe a custo de administração mensal do financiamento." />
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">R$</span>
            </div>
            <NumericFormat
              value={form.encargosAdm}
              onValueChange={(values) => {
                setForm({ ...form, encargosAdm: values.value });
              }}
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              prefix=""
              placeholder="25,00"
              isNumericString
              className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-200 bg-gray-50 transition-colors duration-200"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Encargos com Seguros:
            <QuestionMarkCircleIcon className="h-5 w-5 inline-block ml-1 cursor-pointer" title="Informe o valor aproximado de encargos com seguro MIP e DFI." />
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">R$</span>
            </div>
            <NumericFormat
              value={form.encargosSeguro}
              onValueChange={(values) => {
                setForm({ ...form, encargosSeguro: values.value });
              }}
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              prefix=""
              placeholder="55,00"
              isNumericString
              className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-200 bg-gray-50 transition-colors duration-200"
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          className="w-full py-3 px-4 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transform transition-all duration-200 hover:-translate-y-0.5"
        >
          Calcular Financiamento
        </button>
      </div>
    </form>
  );
}

export default FormularioFinanciamento; 