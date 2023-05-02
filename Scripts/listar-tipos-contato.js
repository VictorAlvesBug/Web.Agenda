import createApi from './Utils/api.js';
import {
  exibirMensagemSucesso,
  exibirMensagemErro,
  exibirMensagemInformacao,
} from './Utils/alert-flutuante.js';
import createLoading from './Utils/loading.js';

const tiposContatoDiv = document.querySelector('#tipos-contato');

document.addEventListener('DOMContentLoaded', listarTiposContato);

function renderizarTiposContato(tiposContato) {
  if (tiposContato.length === 0) {
    return (tiposContatoDiv.innerHTML =
      '<div class="alert alert-primary">Nenhum tipo de contato cadastrado</div>');
  }

  tiposContatoDiv.innerHTML = '';

  tiposContato.forEach((tipoContato) => {
    const tipoContatoDiv = document.createElement('div');
    tipoContatoDiv.classList.add('card');
    tipoContatoDiv.innerHTML = `
      <h3>${tipoContato.nome}</h3>
      <div class="acoes">
        <i class="fa fa-edit btn-editar-tipo-contato" 
          data-codigo="${tipoContato.codigo}"></i>
        <i class="fa fa-times btn-excluir-tipo-contato" 
          data-codigo="${tipoContato.codigo}"
          data-nome="${tipoContato.nome}"></i>
      </div>
      ${
        tipoContato.regexValidacao
          ? `<p>Regex de validação:<br>${tipoContato.regexValidacao}</p>`
          : ''
      }
    `;
    tiposContatoDiv.appendChild(tipoContatoDiv);
  });

  recarregarEventos();
}

async function listarTiposContato() {
  try {
    const tiposContato = await createApi('tiposcontato').get();
    renderizarTiposContato(tiposContato.data);
  } catch (error) {
    await exibirMensagemErro(error);
  }
}

function recarregarEventos() {
  const listaBtnEditarTipoContato = document.querySelectorAll(
    '.btn-editar-tipo-contato'
  );
  const listaBtnExcluirTipoContato = document.querySelectorAll(
    '.btn-excluir-tipo-contato'
  );

  listaBtnEditarTipoContato.forEach((btnEditarTipoContato) => {
    btnEditarTipoContato.addEventListener('click', async () => {
      const codigoTipoContato =
        btnEditarTipoContato.getAttribute('data-codigo');
      window.open(
        `cadastrar-editar-tipo-contato.html?codigoTipoContato=${codigoTipoContato}`,
        '_self'
      );
    });
  });

  listaBtnExcluirTipoContato.forEach((btnExcluirTipoContato) => {
    btnExcluirTipoContato.addEventListener('click', async () => {
      const codigoTipoContato =
        btnExcluirTipoContato.getAttribute('data-codigo');
      const nomeTipoContato = btnExcluirTipoContato.getAttribute('data-nome');
      if (
        confirm(`Deseja excluir "${nomeTipoContato}" dos tipos de contato?`)
      ) {
        await excluirTipoContato(codigoTipoContato);
      }
    });
  });
}

async function excluirTipoContato(codigoTipoContato) {
  try {
    await createApi('tiposcontato').delete(codigoTipoContato);

    await exibirMensagemSucesso('Tipo de contato excluído com sucesso');
    location.reload();
    return;
  } catch (e) {
    return await exibirMensagemErro(
      'Ocorreu um erro ao excluir tipo de contato'
    );
  }
}