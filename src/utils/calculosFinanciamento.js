export const calcularParcelas = ({
  tipo,
  valorFinanciado,
  prazoMeses,
  taxaJurosAnual,
  encargosAdm,
  encargosSeguro,
  taxaTR
}) => {
  const taxaJurosMensal = (1 + taxaJurosAnual / 100) ** (1 / 12) - 1;
  const taxaTRMensal = (taxaTR / 12) / 100;
  const custosMensais = encargosAdm + encargosSeguro;
  
  if (tipo === 'SAC') {
    return calcularParcelasSAC(valorFinanciado, prazoMeses, taxaJurosMensal, custosMensais, taxaTRMensal);
  } else {
    return calcularParcelasPRICE(valorFinanciado, prazoMeses, taxaJurosMensal, custosMensais, taxaTRMensal);
  }
};

const calcularParcelasSAC = (valorFinanciado, prazoMeses, taxaJurosMensal, custosMensais, taxaTRMensal) => {
  const parcelas = [];

  let saldoDevedor = valorFinanciado;

  for (let i = 1; i <= prazoMeses; i++) {
    const juros = saldoDevedor * taxaJurosMensal;
    const amortizacao = saldoDevedor / (prazoMeses - (i -1));
    const valorParcela = amortizacao + juros + custosMensais;
    saldoDevedor -= amortizacao;
    saldoDevedor += saldoDevedor * taxaTRMensal;

    parcelas.push({
      numero: i,
      valorParcela,
      amortizacao,
      juros,
      custosMensais,
      taxaTRMensal,
      saldoDevedor
    });
  }

  return parcelas;
};

const calcularParcelasPRICE = (valorFinanciado, prazoMeses, taxaJurosMensal, custosMensais, taxaTRMensal) => {
  const parcelas = [];
  let saldoDevedor = valorFinanciado;

  for (let i = 1; i <= prazoMeses; i++) {
    const valorParcela = calcularPMT(saldoDevedor, taxaJurosMensal, prazoMeses - (i -1))
    const juros = saldoDevedor * taxaJurosMensal;
    const amortizacao = valorParcela - juros;
    saldoDevedor -= amortizacao;
    saldoDevedor += saldoDevedor * taxaTRMensal;

    parcelas.push({
      numero: i,
      valorParcela,
      amortizacao,
      juros,
      custosMensais,
      taxaTRMensal,
      saldoDevedor
    });
  }

  function calcularPMT(valorPresente, taxaJurosMensal, numeroPeriodos) {
    return (valorPresente * taxaJurosMensal) / (1 - Math.pow(1 + taxaJurosMensal, -numeroPeriodos));
  }

  return parcelas;
}; 