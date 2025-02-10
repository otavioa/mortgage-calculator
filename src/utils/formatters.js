export const formatarMoeda = (valor) => {
  if (!valor && valor !== 0) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
};

export const formatarPorcentagem = (valor) => {
  if (!valor && valor !== 0) return '0,00%';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor) + '%';
}; 

export const formatarNumero = (valor) => {
  return valor.toFixed(2).replace('.', ','); // Formata para duas casas decimais e substitui o ponto pela vírgula
};