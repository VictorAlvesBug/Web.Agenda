# Web.Agenda

Este projeto foi desenvolvido com objetivo de participar de um processo seletivo.
Sua proposta é gerenciar **Pessoas**, **Contatos** e **Tipos de Contato** de uma
**Agenda**.

## Configurando o projeto

Primeiramente, configure as seguintes variáveis de ambiente, conforme o servidor 
SQL Server que deseja utilizar, em **Windows** > **Variáveis de Ambiente** > 
**Variáveis de Ambiente...**:
- **DB_ADDRESS**: IP do servidor de banco;
- **DB_USER_ID**: Usuário de login do banco, caso seja diferente de **sa**;
- **DB_PASSWORD**: Senha de login do banco;

**OBS.:** Caso seja necessário alterar o valor destas variáveis enquanto o 
projeto estiver **aberto no Visual Studio**, será necessário **reiniciar a IDE**, 
pois os valores das variáveis de ambiente são recuperados apenas no ato de abrir
o **Visual Studio**.

Execute o 
[Script SQL](https://github.com/VictorAlvesBug/Api.Agenda/blob/master/Script%20de%20Cria%C3%A7%C3%A3o%20das%20Tabelas.sql) 
de criação de **banco**, **tabelas** e inserção dos **dados iniciais** de 
algumas tabelas.

Realize o clone dos repositórios com os comandos abaixo:

```bash
git clone https://github.com/VictorAlvesBug/Api.Agenda.git
git clone https://github.com/VictorAlvesBug/Web.Agenda.git
```

Abra o projeto **Api.Agenda** no **Visual Studio** e pressione **IIS Express**.

Abra a tela **Web.Agenda** > **Pages** > **listar-pessoas.html**.