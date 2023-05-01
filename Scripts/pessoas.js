import createApi from './Utils/api.js';
import { formatar } from './Utils/formatador.js';

document.addEventListener('DOMContentLoaded', listarPessoas);

function renderPessoas(pessoas) {
  const pessoasDiv = document.querySelector('#pessoas');
  pessoasDiv.innerHTML = '';

  pessoas.forEach((pessoa) => {
    const pessoaDiv = document.createElement('div');
    pessoaDiv.classList.add('pessoa');
    pessoaDiv.innerHTML = `
                    <h2>${pessoa.nome}</h2>
                    <div class="acoes">
                      <i class="fa fa-edit editar-pessoa" data-codigo="${
                        pessoa.codigo
                      }"></i>
                      <i class="fa fa-times excluir-pessoa" data-codigo="${
                        pessoa.codigo
                      }"></i>
                    </div>
                    <ul class="lista-contatos">
                        Lista de contatos
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
                                        valorFormatado = `<a href="${linkTelefone}">
                                                ${valorFormatado}
                                            </a>`;
                                        break;
                                      case 'E-mail':
                                        const linkEmail = `mailto:${valorFormatado}`;
                                        valorFormatado = `<a href="${linkEmail}">
                                              ${valorFormatado}
                                          </a>`;
                                        break;
                                      case 'WhatsApp':
                                        const linkWhatsApp = `https://wa.me/${contato.valor}`;
                                        valorFormatado = `<a 
                                          href="${linkWhatsApp}" 
                                          target="_blank">
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

document.querySelector('#listar').addEventListener('click', listarPessoas);

async function listarPessoas() {
  try {
    const pessoas = await createApi('pessoas').get();
    renderPessoas(pessoas.data);
  } catch (error) {
    alert(error);
  }
}

function recarregarEventos() {
  const listaEditarPessoa = document.querySelectorAll('.editar-pessoa');

  listaEditarPessoa.forEach((editarPessoa) => {
    editarPessoa.addEventListener('click', async () => {
      const codigoPessoa = editarPessoa.getAttribute('data-codigo');
      window.open(`cadastrar-editar-pessoa.html?codigoPessoa=${codigoPessoa}`, '_blank');
    });
  });
}
