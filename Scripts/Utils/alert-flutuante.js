const elementoListaAlertFlutuante = document.querySelector(
  '.lista-alert-flutuante'
);

export async function exibirMensagemSucesso(html) {
  await exibirMensagem(html, 'sucesso', 1000);
}

export async function exibirMensagemErro(html) {
  await exibirMensagem(html, 'erro');
}

export async function exibirMensagemInformacao(html) {
  await exibirMensagem(html, 'informacao');
}

async function exibirMensagem(html, classe, delayMilissegundos = 3000) {
  const alertFlutuante = document.createElement('div');
  alertFlutuante.className = `alert-flutuante ${classe}`;
  alertFlutuante.innerHTML = html.replaceAll('\n', '<br>');
  elementoListaAlertFlutuante.appendChild(alertFlutuante);
  await programarFechamentoMensagem(alertFlutuante, delayMilissegundos);
}

function programarFechamentoMensagem(alertFlutuante, delayMilissegundos) {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        alertFlutuante.className = 'alert-flutuante';

        const tempoTransitionCss = 500;
        setTimeout(() => {
          alertFlutuante.remove();
          resolve();
        }, tempoTransitionCss);
      }, delayMilissegundos);
    } catch (error) {
      reject(error);
    }
  });
}
