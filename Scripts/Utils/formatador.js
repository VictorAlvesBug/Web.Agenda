function formatarTelefone(telefone) {
    const regex = /^(\d{2})(\d{4,5})(\d{4})$/;
    const match = regex.exec(telefone);
    if (!match) {
      return telefone;
    }
    const ddd = match[1];
    const parte1 = match[2];
    const parte2 = match[3];
    const formato = parte1.length === 4 ? '0000-0000' : '00000-0000';
    return `(${ddd}) ${parte1}-${parte2}`.replace(formato, '');
  }
  
  function formatarWhatsApp(whatsApp) {
    const regex = /^(\d{2})(\d{2})(\d{4,5})(\d{4})$/;
    const match = regex.exec(whatsApp);
    if (!match) {
      return telefone;
    }
    const ddi = match[1];
    const ddd = match[2];
    const parte1 = match[3];
    const parte2 = match[4];
    const formato = parte1.length === 5 ? '0000-0000' : '00000-0000';
    return `+${ddi} (${ddd}) ${parte1}-${parte2}`.replace(formato, '');
  }
  
function formatar(valor, formato){
    switch(formato){
        case 'WhatsApp': return formatarWhatsApp(valor);
        case 'Telefone': return formatarTelefone(valor);
    }

    return valor;
}

export {
    formatarTelefone,
    formatarWhatsApp,
    formatar
};