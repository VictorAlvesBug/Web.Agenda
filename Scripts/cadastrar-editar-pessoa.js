import createApi from './Utils/api.js';
import { formatar } from './Utils/formatador.js';

let contatos = [];

document.addEventListener('DOMContentLoaded', async () => {
  const selectTipoContato = document.querySelector('.select-tipo-contato');

  const { data: tiposContato } = await createApi('tiposcontato').get();

  selectTipoContato.innerHTML = '';

  const option = document.createElement('option');
  option.setAttribute('value', 0);
  option.innerText = 'Selecione...';
  selectTipoContato.appendChild(option);

  tiposContato.forEach((contato) => {
    const option = document.createElement('option');
    option.setAttribute('value', contato.codigo);
    option.setAttribute('nome-tipo-contato', contato.nome);
    option.setAttribute('regex-validacao', contato.regexValidacao);
    option.innerText = contato.nome;
    selectTipoContato.appendChild(option);
  });

  await popularCamposCasoSejaEdicao();
});

async function popularCamposCasoSejaEdicao(){
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const codigoPessoa = urlParams.get('codigoPessoa');

if(codigoPessoa){
    const pessoa = await createApi('pessoas').get(codigoPessoa);

    if(pessoa.data){
        document.querySelector('.nome-pessoa').value = pessoa.data.nome;
        contatos = pessoa.data.listaContatos.map(contato => {
            return {
                codigoTipoContato: contato.codigoTipoContato,
                valor: contato.valor,
                regexValidacao: contato.tipoContato.regexValidacao,
                nomeTipoContato: contato.tipoContato.nome
            };
        });
        renderizarListaContatos();
        return;
    }
}
}

document
  .querySelector('.btn-cadastrar-contato')
  .addEventListener('click', () => {
    const contato = {};
    const optionTipoContato = document.querySelector(
      '.select-tipo-contato>option:checked'
    );

    contato.codigoTipoContato = optionTipoContato.value;
    contato.nomeTipoContato =
      optionTipoContato.getAttribute('nome-tipo-contato');
    contato.regexValidacao = optionTipoContato.getAttribute('regex-validacao');
    contato.valor = document.querySelector('.valor-contato').value;

    const mensagemErro = validarContato(contato);

    if (mensagemErro) {
      return alert(mensagemErro);
    }

    contatos.push(contato);

    document.querySelector('.select-tipo-contato').value = 0;
    document.querySelector('.valor-contato').value = '';

    renderizarListaContatos();
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
  const tableListaContatos = document.querySelector('#lista-contatos');

  tableListaContatos.innerHTML = '';

  contatos.forEach((contato, indice) => {
    const trContato = document.createElement('tr');

    const tdContato = document.createElement('td');
    const valorFormatado = formatar(contato.valor, contato.nomeTipoContato);
    tdContato.innerText = `${valorFormatado} (${contato.nomeTipoContato})`;
    trContato.appendChild(tdContato);

    const tdAcao = document.createElement('td');
    const iExcluir = document.createElement('i');
    iExcluir.classList.add('fa');
    iExcluir.classList.add('fa-times');
    iExcluir.addEventListener('click', () => {
      contatos = contatos.filter((_, i) => i !== indice);
      renderizarListaContatos();
    });
    tdAcao.appendChild(iExcluir);
    trContato.appendChild(tdAcao);

    tableListaContatos.appendChild(trContato);
  });
}

document.querySelector('.btn-salvar').addEventListener('click', async (e) => {
  e.preventDefault();
  const pessoa = {};
  pessoa.nome = document.querySelector('.nome-pessoa').value;
  pessoa.listaContatos = contatos.map((contato) => {
    return {
      codigoTipoContato: contato.codigoTipoContato,
      valor: contato.valor,
    };
  });

  if (pessoa.nome.length < 3 || pessoa.nome.length > 100) {
    return alert('O nome da pessoa deve ter de 3 até 100 caracteres');
  }

  const retorno = await createApi('pessoas').post(pessoa);

  if(retorno.data){
      alert('Pessoa cadastrada com sucesso');
      location.reload();
      return; 
  }

  if(retorno.erro){
    return alert(retorno.erro);
  }

  return alert('Ocorreu um erro ao cadastrar pessoa');
});
