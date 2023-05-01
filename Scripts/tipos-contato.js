import createApi from './api.js';

document.addEventListener('DOMContentLoaded', listarTiposContato);

// Helper function to make HTTP GET requests
async function get(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Helper function to make HTTP POST requests
async function post(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Function to render a list of people
function renderTiposContato(tiposContato) {
  const tiposContatoDiv = document.querySelector('#tipos-contato');
  tiposContatoDiv.innerHTML = '';

  tiposContato.forEach((tipoContato) => {
    const tipoContatoDiv = document.createElement('div');
    tipoContatoDiv.classList.add('tipo-contato');
    tipoContatoDiv.innerHTML = `
                    <h2>${tipoContato.nome}</h2>
                    <p>${tipoContato.regexValidacao}</p>
                `;
    tiposContatoDiv.appendChild(tipoContatoDiv);
  });
}

// Function to handle the "Listar Tipos de Contato" button click event
document.querySelector('#listar').addEventListener('click', listarTiposContato);

async function listarTiposContato() {
  try {
    const tiposContato = await createApi('tiposcontato').get();
    renderTiposContato(tiposContato.data);
  } catch (error) {
    console.error(error);
  }
}

// Function to handle the "Cadastrar Tipo Contato" button click event
document.querySelector('#cadastrar').addEventListener('click', async () => {
  try {
    const data = {
      nome: 'João da Silva',
      listaContatos: [
        { valor: '123456789', codigoTipoContato: 1 },
        { valor: 'joao.silva', codigoTipoContato: 2 },
      ],
    };
    const tipoContato = await createApi('tiposcontato').post(data);
    renderTiposContato([tipoContato.dados]);
  } catch (error) {
    console.error(error);
  }
});
