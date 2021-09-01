let mainArea = document.querySelector("textarea")
let finishButton = document.getElementById("finalizar")
let clearButton = document.getElementById("clearAll")
let clearParameters = document.getElementById("clearParameters") 
let allInputs = document.querySelectorAll("input")
let data = new Date();
let months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

clearParameters.addEventListener("click", clearParams)
clearButton.addEventListener("click", clear)
finishButton.addEventListener("click", tratarFormulario)

for(let element of allInputs){
    element.addEventListener("input", function(){verificarPreenchimento(this)})
}

/*Função que verifica se determinado campo do formulário está preenchido e muda a cor da borda
inferior do input, a depender da resposta (preenchido/não preenchido) */
function verificarPreenchimento(elemento){
    if (elemento.value !== "") elemento.style.borderColor = "green"
    else elemento.style.borderColor = "red"
}

/* Função que preenche o formulário com os dados recebidos do email. Além disso, no momento do clique do botão "preencher" ela
já verifica se o campo está preenchido, realizando a alteração de cor da borda inferior do input e, ao final, chama a função
elaborateString() para enviar os dados do formulário para a área de exibição da petição estruturada*/
function tratarFormulario(){

    /*Formatador de string colata na TEXTAREA*/
    let pessoaDados = (mainArea.value.replaceAll("\n", ":").
    replaceAll("*", "").
    replaceAll("<", "j").
    replaceAll("script", "Não").replaceAll(";", "")
    ).split(":")

    /*Seleciona o requerente ou o requerido de acordo com a escolha no DROPDOWN 
    Funciona pegando o valor selecionado no dropdown e concatenando com o tipo de dado
    do campo do formulário, especificado na ID de cada campo*/
    let pessoaSelecionada = document.getElementById("seletorPessoa").value

    
    /*Loop que pega a lista de dados recebidos da string recuperada do email e os estrutura
    dentro do âmbito do formulário*/
    pessoaDados.forEach((dado, indice) => {
        let nextData = pessoaDados[indice + 1]
        let pessoa = pessoaSelecionada
        switch(dado){
            case "Nome completo":
                document.getElementById(pessoa + "Nome").value = nextData.trim()
                break;
            case "CPF":
                nextData.includes(".")?document.getElementById(pessoa +"CPF").value = nextData.trim():
                document.getElementById(pessoa +"CPF").value = nextData.trim()
                break;
            case "CPF/CNPJ":
                document.getElementById(pessoa +"CPF").value = nextData.trim()
                break;
            case "RG":
                document.getElementById(pessoa + "RG").value = nextData.trim()
                break;
            case "Endereço":
                document.getElementById(pessoa + "Endereco").value = nextData.trim()
                break;
            case "Cidade":
                document.getElementById(pessoa + "Cidade").value = nextData.trim()
                break;
            case "Estado":
                document.getElementById(pessoa + "Estado").value = nextData.trim()
                break;
            case "Bairro":
                document.getElementById(pessoa + "Bairro").value = nextData.trim()
                break;
            case "CEP":
                document.getElementById(pessoa + "CEP").value = nextData.trim()
                break;
        }   
    })

    /*Loop que verifica quais inputs estão preenchidos e deixa estes verdes, enquanto deixa os não 
    preenchidos vermelhos*/
    for (let elemento of allInputs){
        verificarPreenchimento(elemento)
    }

    /*Elabora as strings dinâmicas que serão colocadas no modelo de inicial com os dados desejados */
    elaborateString()
}

function elaborateString(){

    //Cria a qualificação do requerente de acordo com os dados fornecidos no formulário//
    function makeRequerente(){
        let inputList = document.getElementsByClassName("requerente")
        let gender = document.getElementById("rdg1").checked? "o": "a"

        let qualiRequerente = `${inputList[0].value.toUpperCase()}, brasileir${gender}, 
        inscrit${gender} no Cadastro de Pessoas Físicas do Ministério da Fazenda sob o nº ${inputList[1].value} 
        e portador${gender === "a"? "a": ""} do RG nº ${inputList[2].value}, residente e domiciliad${gender} na 
        ${inputList[3].value}, Bairro ${inputList[6].value}, 
        CEP: ${inputList[7].value}, no Município de ${inputList[4].value}, ${inputList[5].value}, vem, respeitosamente, à presença de 
        Vossa Excelência propor a presente demanda de:`

        return qualiRequerente  
    }

    /*Cria a qualificação do requerido de acordo com os dados fornecidos no formulário*/
    function makeRequerido(){
        let inputList = document.getElementsByClassName("requerido")
        let gender = document.getElementById("rdg3").checked? "o": "a"

        // Operador ternário que verifica se o requerido é Pessoa Jurídica ou Pessoa Física, a depender da marcação do usuário//
        let qualiRequerido = document.getElementById('rd1').checked?
        `<br><br>movida em face de ${inputList[0].value.toUpperCase()}, pessoa jurídica de 
        direito privado, inscrita no CNPJ ${inputList[1].value}, com endereço na ${inputList[3].value}, Bairro 
        ${inputList[6].value}, CEP ${inputList[7].value}, Município de ${inputList[4].value}, 
        ${inputList[5].value} pelos fatos e fundamentos a seguir expostos:`:
        `<br><br>movida em face de ${inputList[0].value.toUpperCase()}, brasileir${gender}, 
        inscrit${gender} no Cadastro de Pessoas Físicas do Ministério da Fazenda sob o nº ${inputList[1].value}
        e portador${gender === "a"? "a": ""} do RG nº ${inputList[2].value}, 
        residente e domiciliad${gender} na ${inputList[3].value}, Bairro 
        ${inputList[6].value}, CEP ${inputList[7].value}, Município de ${inputList[4].value}, 
        ${inputList[5].value} pelos fatos e fundamentos a seguir expostos:`

        return qualiRequerido
    }

    // --                              MODELÃO                                             --//

    /*Modelo de petição inicial utilizado. Nele serão encaixados todos os dados fornecidos no formulário ou
    recuperados do email*/

    let fullString = `<strong>EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA ___ª SECRETARIA
    DO JUIZADO ESPECIAL CÍVEL DO FORO CENTRAL DA COMARCA DA REGIÃO METROPOLITANA DE CURITIBA – 
    ESTADO DO PARANÁ.</strong> <br><br>` + 
    makeRequerente() +  
    `<br><br><p><strong>${document.getElementById("tipoDemanda").value.toUpperCase()}</strong></p>`+
    makeRequerido()+
    `<br><br><strong>I - DOS FATOS</strong>` +
    `<br><br><strong>II - DOS DIREITOS</strong>`+
    `<br><br><strong>III - DOS PEDIDOS</strong>` +
    `<br><br>Diante do exposto, requer-se:
    <br><br>a) prestar assistência jurídica integral e gratuita às pessoas que necessitam, com fulcro no artigo 5°, LXXIV, da Carta Magna, artigo 22 da Lei 8.906, de 4.7.1994 e artigo 5°, da Lei Estadual n°. 18.664 de 22 de dezembro de 2015;
    <br><br>b) A citação do do réu para, querendo, contestar a presente ação no prazo legal, bem como a apresentação da contestação no prazo legal, sob fundamento do art. 334, 4º, I, do CPC/15, sob pena de revelia e confissão;
    <br><br>c) Condenação da fornecedora de serviços, a título de restituição dos valores pagos e gastos <mark>Se for o caso</mark>;
    <br><br>d)A condenação da fornecedora de serviços reclamada ao pagamento de Indenização por Danos Morais, estes arbitrados em <strong>valor</strong>.
    <br><br>e)Seja julgado totalmente procedente, a respectiva ação de ${document.getElementById("tipoDemanda").value.toLowerCase()}, condenando a ré a <mark>pagamento dos danos morais</mark>;`+
    `<br><br>Por fim, pugna a reclamante pela produção de todas as provas em direito admitidas, notadamente o depoimento pessoal, 
    inquirição de testemunhas, juntada posterior de documentos e tudo mais que se fizer necessário para que se cumpra o feito.`+
    ` Dá-se à causa o valor de R$${document.getElementById("valorCausa").value}`+
    `<p><br><br>Termos em que,<br>
    <br><br>pede deferimento, 
                                               
    
    <br><br><br>${document.getElementById("requerenteNome").value.toUpperCase()}
    <br><br>Curitiba, ${data.getDate()} de ${(months[data.getMonth()].toLowerCase())} de 2021
    </p>`



    /********************************************************************************************* */
    
    // Criação do output com a petição inicial //
    document.getElementById("printDiv").innerHTML = fullString
}

/*Função de limpeza de dados associada ao botão "Limpar tudo".
Limpa todos os dados preenchidos*/

function clear(){
    for(let element of document.getElementsByClassName("limpar")){
        element.value = ""
        element.style.borderColor = "white"
    }
}

/*Função de limpeza de dados associada ao botão "Limpar parâmetros"
Limpa apenas o que for colocado na área de conversão da string recuperada do email*/
function clearParams(){
    document.querySelector("textarea").value = ""
}
