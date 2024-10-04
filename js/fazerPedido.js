document.addEventListener("DOMContentLoaded", function() {
    loja.eventos.init();
});

var loja = {};

var MEU_ENDERECO = null;

var CELULAR_EMPRESA = '5592992577657'
                       

loja.eventos = {

    init: () => {
        
       
    }
}

loja.metodos = {

    obterProdutosCarrinho:() =>{

        carrinhoDeCompras.carregarCarrinho();
        let itens = [];
        itens = carrinhoDeCompras.itens;
        //limpa o conteudo
        $("#itensProdutosCarrinho").html('');
        console.log("itens :", carrinhoDeCompras.itens.length);

        for (var i = 0; i < itens.length; i++) {
            let temp = loja.templates.itemResumo
                .replace(/\${img}/g, itens[i].img)
                .replace(/\${name}/g, itens[i].name)
                .replace(/\${qtd}/g, itens[i].quantidade)
                .replace(/\${total}/g, (itens[i].preco * itens[i].quantidade))
                .replace(/\${price}/g, itens[i].preco)
            // Adiciona os itens ao #itensProdutos
            $("#itensProdutosCarrinho").append(temp);
        }

    },

    resumoPedido: () => {

        //let cep = $("#txtCEP").val().trim();
        let endereco = $("#txtEndereco").val().trim();
        // let bairro = $("#txtBairro").val().trim();
        // let cidade = $("#txtCidade").val().trim();
        let uf = $("#ddlUf").val().trim();
        // let numero = $("#txtNumero").val().trim();
        // let complemento = $("#txtComplemento").val().trim();
        let nome = $("#txtNome").val().trim();
        let numeroTelefone = $("#txtTelefone").val().trim();
        // let empresa = $("#txtEmpresa").val().trim();


        if (nome.length <= 0) {
            loja.metodos.mensagem('Informe o seu Nome, por favor.');
            $("#txtNome").focus();
            return;
        }

        if (numeroTelefone.length <= 0) {
            loja.metodos.mensagem('Informe o Telefone de Contato, por favor.');
            $("#txtTelefone").focus();
            return;
        }

        // if (empresa.length <= 0) {
        //     loja.metodos.mensagem('Informe o Nome da Empresa, por favor.');
        //     $("#txtEmpresa").focus();
        //     return;
        // }

        // if (cep.length <= 0) {
        //     loja.metodos.mensagem('Informe o CEP, por favor.');
        //     //showToast();
        //     $("#txtCEP").focus();
        //     return;
        // }

        if (endereco.length <= 0) {
            loja.metodos.mensagem('Informe o Endereço, por favor.');
            $("#txtEndereco").focus();
            return;
        }

        // if (bairro.length <= 0) {
        //     loja.metodos.mensagem('Informe o Bairro, por favor.');
        //     $("#txtBairro").focus();
        //     return;
        // }

        // if (cidade.length <= 0) {
        //     loja.metodos.mensagem('Informe a Cidade, por favor.');
        //     $("#txtCidade").focus();
        //     return;
        // }

        if (uf == "-1") {
            loja.metodos.mensagem('Informe a UF, por favor.');
            $("#ddlUf").focus();
            return;
        }

        // if (numero.length <= 0) {
        //     loja.metodos.mensagem('Informe o Número, por favor.');
        //     $("#txtNumero").focus();
        //     return;
        // }

        

        MEU_ENDERECO = {
            nome: nome,
            //empresa: empresa,
            numeroTelefone: numeroTelefone,
            // cep: cep,
            endereco: endereco,
            // bairro: bairro,
            // cidade: cidade,
            uf: uf,
            // numero: numero,
            // complemento: complemento
        }

        loja.metodos.carregarResumo();

    },
    
    carregarResumo: () => {
       
        $("#Etapa2").removeClass('disable')
        $("#Etapa1").addClass('disable')

        loja.metodos.obterProdutosCarrinho();
        loja.metodos.finalizarPedido();

    },

    etapa1: () => {
        $("#Etapa2").addClass('disable')
        $("#Etapa1").removeClass('disable')
    },

    voltar: () =>{
        window.history.back();
    },

    finalizarPedido: () => {
        
        

        
        if (carrinhoDeCompras.itens.length > 0 && MEU_ENDERECO != null) {

            var texto = 'Olá! Vim pelo catálogo e gostaria de fazer meu pedido:';
            texto += `\n*Itens do pedido:*\n\n\${itens}`;
            texto += '\n*Endereço de entrega:*';
            texto += `\n${MEU_ENDERECO.endereco} - ${MEU_ENDERECO.uf}`;

            texto += `\nCliente: ${MEU_ENDERECO.nome}`;
            //texto += `\n\n*Total (com entrega): R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}*`;
            
            console.log("passou do texto");
            console.log("texto >>>>>>>", texto);

            var itens = '';

            $.each(carrinhoDeCompras.itens, (i, e) => {

                console.log("Está rodando");
                //itens += `*${e.quantidade}x* ${e.name} ....... R$ ${e.price.toFixed(2).replace('.', ',')} \n`;
                itens += `*${e.quantidade}x* ${e.name} \n`;


                // último item
                if ((i + 1) == carrinhoDeCompras.itens.length) {

                    texto = texto.replace(/\${itens}/g, itens);

                    // converte a URL
                    let encode = encodeURI(texto);
                    let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

                    $("#btnEtapaResumo").attr('href', URL);

                    console.log("final >>>>>>>", URL);

                }

            })

        }

    },

    mensagem: (texto, cor = 'red', tempo = 3500) => {

        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;

        $("#container-mensagens").append(msg);

        setTimeout(() => {
            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');
            setTimeout(() => {
                $("#msg-" + id).remove();
            }, 800);
        }, tempo)

    }

}


var showingToast = false; // Variável para verificar se o toast está sendo exibido

function showToast() {
    if (!showingToast) {
        let toast = `<div id="toast" class="toast hide">Mensagem de Alerta</div>`
        $("#container-mensagens").append(toast);
        $("toast").remove("hide");
        $("toast").add("show");

        showingToast = true;

       

        setTimeout(function(){
            $("toast").remove("show");
            $("toast").add("hide");

            showingToast = false;
        }, 3000); // Tempo em milissegundos (3 segundos)
    }
}

function formatCurrency(value) {
    let formattedValue = value.toFixed(2);
    formattedValue = formattedValue.replace('.', ',');
    return formattedValue + " R$";
}

loja.templates = {

    itemResumo:`
        <div class="container">
        <div class="card mb-3">
            <div class="row no-gutters">
                <div class="col-md-4">
                    <img src="\${img}" class="card-img" alt="Imagem do produto">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">\${name}</h5>
                        <p class="card-text">
                            <label>Preço:<span class="item-price">\${price}</span></label> 
                        </p>
                        <div class="d-flex justify-content-between">
                            <div>
                                <p class="card-text">
                                    <label>Quantidade:</label> <span class="item-quantity">\${qtd}</span>
                                </p>
                                <p class="card-text">
                                    <label>Total:</label> <span class="item-total">\${total}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `

}