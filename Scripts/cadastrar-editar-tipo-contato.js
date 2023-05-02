import createApi from './Utils/api.js';
import {
  exibirMensagemSucesso,
  exibirMensagemErro,
  exibirMensagemInformacao,
} from './Utils/alert-flutuante.js';
import createLoading from './Utils/loading.js';

const elementosModoCadastrar = document.querySelectorAll('.modo-cadastrar');
const elementosModoEditar = document.querySelectorAll('.modo-editar');

const inputNome = document.querySelector('.nome');
const inputRegexValidacao = document.querySelector('.regex-validacao');

const btnCadastrar = document.querySelector('.btn-cadastrar');
const btnEditar = document.querySelector('.btn-editar');

let codigoTipoContato = 0;

document.addEventListener('DOMContentLoaded', async () => {
  await personalizarModoFormulario();
});

async function personalizarModoFormulario() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  codigoTipoContato = urlParams.get('codigoTipoContato');

  // Modo Cadastrar
  if (!codigoTipoContato) {
    return habilitarModoCadastrar();
  }

  // Modo Editar
  habilitarModoEditar();

  const pessoa = await createApi('tiposcontato').get(codigoTipoContato);

  if (!pessoa.data) {
    return await exibirMensagemErro(
      pessoa.erro ?? 'Ocorreu um erro ao retornar tipo de contato'
    );
  }

  inputNome.value = pessoa.data.nome;
  inputRegexValidacao.value = pessoa.data.regexValidacao;
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

function validarTipoContato({ nome, regexValidacao }) {
  let mensagemErro = '';

  if (nome.length === 0 || nome.length > 100) {
    mensagemErro +=
      'O nome do tipo de contato deve ter de 1 até 100 caracteres\n';
  }

  if (regexValidacao && !regexEhValido(regexValidacao)) {
    mensagemErro += 'Informe um regex de validação válido\n';
  }

  return mensagemErro;
}

function regexEhValido(regex) {
  try {
    new RegExp(regex);
  } catch (e) {
    return false;
  }

  return true;
}

function recuperarTipoContatoCampos() {
  const tipoContato = {};
  tipoContato.nome = inputNome.value.trim();
  tipoContato.regexValidacao = inputRegexValidacao.value.trim();
  return tipoContato;
}

btnCadastrar.addEventListener('click', async ({ target }) => {
  const loadingBotao = createLoading(target);
  loadingBotao.habilitar('Salvando...');

  const tipoContato = recuperarTipoContatoCampos();

  const mensagemErro = validarTipoContato(tipoContato);
  if (mensagemErro) {
    loadingBotao.desabilitar();
    return await exibirMensagemErro(mensagemErro);
  }

  await cadastrarTipoContato(tipoContato);
  loadingBotao.desabilitar();
});

btnEditar.addEventListener('click', async ({ target }) => {
  const loadingBotao = createLoading(target);
  loadingBotao.habilitar('Salvando...');

  const tipoContato = recuperarTipoContatoCampos();

  const mensagemErro = validarTipoContato(tipoContato);
  if (mensagemErro) {
    loadingBotao.desabilitar();
    return await exibirMensagemErro(mensagemErro);
  }

  await editarTipoContato(codigoTipoContato, tipoContato);
  loadingBotao.desabilitar();
});

async function cadastrarTipoContato(tipoContato) {
  const retorno = await createApi('tiposcontato').post(tipoContato);

  if (retorno.data) {
    await exibirMensagemSucesso('Tipo de contato cadastrado com sucesso');
    window.open('listar-tipos-contato.html', '_self');
    return;
  }

  if (retorno.erro) {
    return await exibirMensagemErro(retorno.erro);
  }

  return await exibirMensagemErro(
    'Ocorreu um erro ao cadastrar tipo de contato'
  );
}

async function editarTipoContato(codigoTipoContato, tipoContato) {
  const retorno = await createApi('tiposcontato').put(
    codigoTipoContato,
    tipoContato
  );

  if (retorno.data) {
    await exibirMensagemSucesso('Tipo de contato alterado com sucesso');
    window.open('listar-tipos-contato.html', '_self');
    return;
  }

  if (retorno.erro) {
    return await exibirMensagemErro(retorno.erro);
  }

  return await exibirMensagemErro('Ocorreu um erro ao alterar tipo de contato');
}
