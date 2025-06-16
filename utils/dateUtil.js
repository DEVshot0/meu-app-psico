export const getHojeFormatado = () => {
  const hoje = new Date();
  const dia = hoje.toLocaleString('pt-BR', { day: '2-digit', timeZone: 'America/Sao_Paulo' });
  const mes = hoje.toLocaleString('pt-BR', { month: '2-digit', timeZone: 'America/Sao_Paulo' });
  const ano = hoje.toLocaleString('pt-BR', { year: 'numeric', timeZone: 'America/Sao_Paulo' });
  return `${dia}/${mes}/${ano}`;
};
