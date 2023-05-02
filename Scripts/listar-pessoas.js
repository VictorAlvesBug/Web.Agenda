import createApi from './Utils/api.js';
import { formatar } from './Utils/formatador.js';
import {
  exibirMensagemSucesso,
  exibirMensagemErro,
  exibirMensagemInformacao,
} from './Utils/alert-flutuante.js';
import createLoading from './Utils/loading.js';

const pessoasDiv = document.querySelector('#pessoas');

document.addEventListener('DOMContentLoaded', listarPessoas);

function renderizarPessoas(pessoas) {
  if (pessoas.length === 0) {
    return (pessoasDiv.innerHTML =
      '<div class="alert alert-primary">Nenhuma pessoa cadastrada</div>');
  }

  pessoasDiv.innerHTML = '';

  pessoas.forEach((pessoa) => {
    const pessoaDiv = document.createElement('div');
    pessoaDiv.classList.add('card');
    pessoaDiv.innerHTML = `
      <h3>${pessoa.nome}</h3>
      <div class="acoes">
      <i class="fa fa-edit btn-editar-pessoa" 
          data-codigo="${pessoa.codigo}"></i>
      <i class="fa fa-times btn-excluir-pessoa" 
        data-codigo="${pessoa.codigo}"
        data-nome="${pessoa.nome}"></i>
      </div>
      <ul class="lista-contatos">
        Contatos:
        ${
          pessoa.listaContatos.length === 0
            ? '<p>(Nenhum contato)</p>'
            : pessoa.listaContatos
                .map((contato) => {
                  let valorFormatado = formatar(
                    contato.valor,
                    contato.tipoContato.nome
                  );

                  switch (contato.tipoContato.nome) {
                    case 'Telefone':
                      const linkTelefone = `tel:${valorFormatado}`;
                      valorFormatado = `<a href="${linkTelefone}" target="_blank">
                            ${valorFormatado}
                      </a>`;
                      break;
                    case 'E-mail':
                      const linkEmail = `mailto:${valorFormatado}`;
                      valorFormatado = `<a href="${linkEmail}" target="_blank">
                          ${valorFormatado}
                      </a>`;
                      break;
                    case 'WhatsApp':
                      const linkWhatsApp = `https://wa.me/${contato.valor}`;
                      valorFormatado = `<a href="${linkWhatsApp}" target="_blank">
                          ${valorFormatado}
                      </a>`;
                      break;
                  }

                  return `<li>${valorFormatado} (${contato.tipoContato.nome})</li>`;
                })
                .join('')
        }
      </ul>
    `;
    pessoasDiv.appendChild(pessoaDiv);
  });

  recarregarEventos();
}

async function listarPessoas() {
  try {
    const pessoas = await createApi('pessoas').get();
    renderizarPessoas(pessoas.data);
  } catch (error) {
    await exibirMensagemErro(error);
  }
}

function recarregarEventos() {
  const listaBtnEditarPessoa = document.querySelectorAll('.btn-editar-pessoa');
  const listaBtnExcluirPessoa = document.querySelectorAll(
    '.btn-excluir-pessoa'
  );

  listaBtnEditarPessoa.forEach((btnEditarPessoa) => {
    btnEditarPessoa.addEventListener('click', async () => {
      const codigoPessoa = btnEditarPessoa.getAttribute('data-codigo');
      window.open(
        `cadastrar-editar-pessoa.html?codigoPessoa=${codigoPessoa}`,
        '_self'
      );
    });
  });

  listaBtnExcluirPessoa.forEach((btnExcluirPessoa) => {
    btnExcluirPessoa.addEventListener('click', async () => {
      const codigoPessoa = btnExcluirPessoa.getAttribute('data-codigo');
      const nomePessoa = btnExcluirPessoa.getAttribute('data-nome');
      if (confirm(`Deseja excluir "${nomePessoa}" da agenda?`)) {
        await excluirPessoa(codigoPessoa);
      }
    });
  });
}

async function excluirPessoa(codigoPessoa) {
  try {
    await createApi('pessoas').delete(codigoPessoa);

    await exibirMensagemSucesso('Pessoa excluída com sucesso');
    location.reload();
    return;
  } catch (e) {
    console.error(e);
    return await exibirMensagemErro('Ocorreu um erro ao excluir pessoa');
  }
}