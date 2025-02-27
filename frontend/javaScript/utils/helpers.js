'use strict';

export function gerarRating(avaliacoes) {
  if (!avaliacoes) {
    avaliacoes = [];
  }

  let totalEstrelas = 0;
  for (let avaliacao of avaliacoes) {
    totalEstrelas += avaliacao.estrelas;
  }
  let mediaEstrelas =
    avaliacoes.length > 0 ? totalEstrelas / avaliacoes.length : 0;
  let estrelas = '';
  for (let i = 0; i < 5; i++) {
    if (i < mediaEstrelas) {
      estrelas += '&#9733';
    } else {
      estrelas += '&#10032';
    }
  }
  return { mediaEstrelas, estrelas };
}
