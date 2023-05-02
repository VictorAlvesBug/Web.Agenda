export default function createLoading(botao) {
  const loading = {};

  loading.habilitar = (textoLoading = 'Carregando...') => {
    if (botao instanceof HTMLElement) {
        botao.style.pointerEvents = 'none';
        botao.setAttribute('texto-original', botao.innerText);
        botao.innerText = textoLoading;
    }
};

loading.desabilitar = () => {
    if (botao instanceof HTMLElement) {
        botao.style.pointerEvents = 'auto';
        botao.innerText = botao.getAttribute('texto-original');
        botao.setAttribute('texto-original', '');
    }
  };

  return loading;
}
