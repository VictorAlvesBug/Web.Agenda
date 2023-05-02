import createApi from './Utils/api.js';
import { formatar } from './Utils/formatador.js';
import {
  exibirMensagemSucesso,
  exibirMensagemErro,
  exibirMensagemInformacao,
} from './Utils/alert-flutuante.js';
import createLoading from './Utils/loading.js';

const elementosModoCadastrar = document.querySelectorAll('.modo-cadastrar');
const elementosModoEditar = document.querySelectorAll('.modo-editar');

const inputNomePessoa = document.querySelector('.nome-pessoa');
const selectTipoContato = document.querySelector('.select-tipo-contato');
const inputValorContato = document.querySelector('.valor-contato');
const btnCadastrarContato = document.querySelector('.btn-cadastrar-contato');
const tbodyListaContatos = document.querySelector('.lista-contatos');

const btnCadastrar = document.querySelector('.btn-cadastrar');
const btnEditar = document.querySelector('.btn-editar');

let codigoPessoa = 0;
let contatos = [];
let contatoEditando;

document.addEventListener('DOMContentLoaded', async () => {
  await renderizarListaTipoContato();

  await personalizarModoFormulario();
});

async function renderizarListaTipoContato() {
  const { data: tiposContato } = await createApi('tiposcontato').get();
  // Informando que nenhum registro foi encontrado
  if (tiposContato.length === 0) {
    selectTipoContato.innerHTML =
      '<option value="0">Nenhum registro foi encontrado</option>';
    return;
  }

  // Limpando select
  selectTipoContato.innerHTML = '';

  // Adicionando "Selecione..."
  const option = '<option value="0">Selecione...</option>';
  selectTipoContato.innerHTML += option;

  // Adicionando cada tipo de contato
  tiposContato.forEach((contato) => {
    const option = `<option 
          value="${contato.codigo}" 
          nome-tipo-contato="${contato.nome}" 
          regex-validacao="${contato.regexValidacao ?? ''}">
        ${contato.nome}
      </option>`;
    selectTipoContato.innerHTML += option;
  });
}

async function personalizarModoFormulario() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  codigoPessoa = urlParams.get('codigoPessoa');

  // Modo Cadastrar
  if (!codigoPessoa) {
    return habilitarModoCadastrar();
  }

  // Modo Editar
  habilitarModoEditar();

  const pessoa = await createApi('pessoas').get(codigoPessoa);

  if (!pessoa.data) {
    return await exibirMensagemErro(
      pessoa.erro ?? 'Ocorreu um erro ao retornar pessoa'
    );
  }

  inputNomePessoa.value = pessoa.data.nome;
  contatos = pessoa.data.listaContatos.map(
    ({ codigoTipoContato, valor, tipoContato }) => {
      return {
        codigoTipoContato: codigoTipoContato,
        valor: valor,
        regexValidacao: tipoContato.regexValidacao,
        nomeTipoContato: tipoContato.nome,
      };
    }
  );
  renderizarListaContatos();
  return;
}

function habilitarModoCadastrar() {
  elementosModoCadastrar.forEach((el) => el.classList.add('visivel'));
  elementosModoEditar.forEach((el) => el.classList.remove('visivel'));
}

function habilitarModoEditar() {
  elementosModoCadastrar.forEach((el) => el.classList.remove('visivel'));
  elementosModoEditar.forEach((el) => el.classList.add('visivel'));
}

btnCadastrarContato.addEventListener('click', async ({ target }) => {
  const loadingBotao = createLoading(target);
  loadingBotao.habilitar('Cadastrando...');

  const contato = {};
  const optionTipoContato = selectTipoContato.querySelector('option:checked');

  contato.codigoTipoContato = optionTipoContato.value;
  contato.nomeTipoContato = optionTipoContato.getAttribute('nome-tipo-contato');
  contato.regexValidacao = optionTipoContato.getAttribute('regex-validacao');
  contato.valor = inputValorContato.value.trim();

  const mensagemErro = validarContato(contato);

  if (mensagemErro) {
    loadingBotao.desabilitar();
    return await exibirMensagemErro(mensagemErro);
  }

  exibirMensagemSucesso('Contato adicionado com sucesso');

  contatos.push(contato);

  contatoEditando = null;
  selectTipoContato.value = 0;
  inputValorContato.value = '';

  renderizarListaContatos();
  loadingBotao.desabilitar();
});

function validarContato({
  codigoTipoContato,
  valor,
  regexValidacao,
  nomeTipoContato,
}) {
  let mensagemErro = '';
  if (codigoTipoContato <= 0) {
    mensagemErro += 'Selecione o tipo de contato\n';
  }

  if (valor.length === 0 || valor.length > 100) {
    mensagemErro += 'O valor do contato deve ter de 1 até 100 caracteres\n';
  }

  if (regexValidacao) {
    regexValidacao = new RegExp(regexValidacao);
    if (!regexValidacao.test(valor)) {
      mensagemErro += `O valor do contato deve seguir o formato de ${nomeTipoContato}\n(Regex: ${regexValidacao})\n`;
    }
  }

  return mensagemErro;
}

function renderizarListaContatos() {
  tbodyListaContatos.innerHTML = '';

  contatos.forEach((contato, indice) => {
    const valorFormatado = formatar(contato.valor, contato.nomeTipoContato);
    const trContato = `
      <tr> 
        <td>
        ${contato.nomeTipoContato}
        </td> 
        <td>
          ${valorFormatado}
        </td> 
        <td> 
          <button 
            class="btn btn-outline-secondary btn-editar-contato" 
            type="button"
            data-indice="${indice}"
            data-valor="${contato.valor}"
            data-codigo-tipo-contato="${contato.codigoTipoContato}">
              Alterar
          </button>
        </td>
        <td> 
          <button 
            class="btn btn-outline-danger btn-excluir-contato" 
            type="button"
            data-indice="${indice}"
            data-valor="${contato.valor}"
            data-tipo-contato="${contato.nomeTipoContato}">
              Excluir
          </button>
        </td>
      </tr>`;
    tbodyListaContatos.innerHTML += trContato;
  });

  recarregarEventos();
}

function recarregarEventos() {
  const listaBtnEditarContato = document.querySelectorAll(
    '.btn-editar-contato'
  );
  const listaBtnExcluirContato = document.querySelectorAll(
    '.btn-excluir-contato'
  );

  listaBtnEditarContato.forEach((btnEditarContato) => {
    const indice = Number(btnEditarContato.getAttribute('data-indice'));
    const valor = btnEditarContato.getAttribute('data-valor');
    const codigoTipoContato = btnEditarContato.getAttribute(
      'data-codigo-tipo-contato'
    );

    btnEditarContato.addEventListener('click', () => {
      if (contatoEditando) {
        contatos.push(contatoEditando);
        contatoEditando = null;
      }

      contatos = contatos.filter((contato, i) => {
        if (i === indice) {
          contatoEditando = contato;
          console.log(contatoEditando);
          return false;
        }

        return true;
      });
      renderizarListaContatos();
      selectTipoContato.value = codigoTipoContato;
      inputValorContato.value = valor;
    });
  });

  listaBtnExcluirContato.forEach((btnExcluirContato) => {
    const indice = Number(btnExcluirContato.getAttribute('data-indice'));
    const valor = btnExcluirContato.getAttribute('data-valor');
    const tipoContato = btnExcluirContato.getAttribute('data-tipo-contato');

    const valorFormatado = formatar(valor, tipoContato);

    btnExcluirContato.addEventListener('click', () => {
      if (
        confirm(
          `Deseja excluir este contato?\n${valorFormatado} (${tipoContato})`
        )
      ) {
        contatos = contatos.filter((_, i) => i !== indice);
        renderizarListaContatos();
      }
    });
  });
}

function recuperarPessoaCampos() {
  const pessoa = {};
  pessoa.nome = inputNomePessoa.value.trim();

  selectTipoContato.value = 0;
  inputValorContato.value = '';

  if (contatoEditando) {
    contatos.push(contatoEditando);
    contatoEditando = null;
    renderizarListaContatos();
  }

  pessoa.listaContatos = contatos.map((contato) => {
    return {
      codigoTipoContato: contato.codigoTipoContato,
      valor: contato.valor,
    };
  });
  return pessoa;
}

function validarPessoa(pessoa) {
  if (pessoa.nome.length < 3 || pessoa.nome.length > 100) {
    return 'O nome da pessoa deve ter de 3 até 100 caracteres';
  }
  return '';
}

btnCadastrar.addEventListener('click', async ({ target }) => {
  const loadingBotao = createLoading(target);
  loadingBotao.habilitar('Salvando...');

  const pessoa = recuperarPessoaCampos();

  const mensagemErro = validarPessoa(pessoa);
  if (mensagemErro) {
    loadingBotao.desabilitar();
    return await exibirMensagemErro(mensagemErro);
  }

  await cadastrarPessoa(pessoa);
  loadingBotao.desabilitar();
});

btnEditar.addEventListener('click', async ({ target }) => {
  const loadingBotao = createLoading(target);
  loadingBotao.habilitar('Salvando...');

  const pessoa = recuperarPessoaCampos();

  const mensagemErro = validarPessoa(pessoa);
  if (mensagemErro) {
    loadingBotao.desabilitar();
    return await exibirMensagemErro(mensagemErro);
  }

  await editarPessoa(codigoPessoa, pessoa);
  loadingBotao.desabilitar();
});

async function cadastrarPessoa(pessoa) {
  const retorno = await createApi('pessoas').post(pessoa);

  if (retorno.data) {
    await exibirMensagemSucesso('Pessoa cadastrada com sucesso');
    window.open('listar-pessoas.html', '_self');
    return;
  }

  if (retorno.erro) {
    return await exibirMensagemErro(retorno.erro);
  }

  return await exibirMensagemErro('Ocorreu um erro ao cadastrar pessoa');
}

async function editarPessoa(codigoPessoa, pessoa) {
  const retorno = await createApi('pessoas').put(codigoPessoa, pessoa);

  if (retorno.data) {
    await exibirMensagemSucesso('Pessoa alterada com sucesso');
    window.open('listar-pessoas.html', '_self');
    return;
  }

  if (retorno.erro) {
    return await exibirMensagemErro(retorno.erro);
  }

  return await exibirMensagemErro('Ocorreu um erro ao alterar pessoa');
}
