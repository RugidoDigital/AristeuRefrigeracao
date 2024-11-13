document.addEventListener("DOMContentLoaded", function() {
    loja.eventos.init();
});

var loja = {};

var MEU_ENDERECO = null;

var CELULAR_EMPRESA = '5592984444694'

// Adição de (xx) e - automático
const tel = document.getElementById('txtTelefone') // Seletor do campo de telefone
tel.addEventListener('keypress', (e) => mascaraTelefone(e.target.value)) // Dispara quando digitado no campo
tel.addEventListener('change', (e) => mascaraTelefone(e.target.value)) // Dispara quando autocompletado o campo
const mascaraTelefone = (valor) => {
    valor = valor.replace(/\D/g, "")
    valor = valor.replace(/^(\d{2})(\d{0})/g, "($1) $2")
    valor = valor.replace(/(\d{5})(\d{0})/, "$1-$2")
    tel.value = valor // Insere o(s) valor(es) no campo
}

loja.eventos = {

    init: () => {
        
       
    }
}

// Função para salvar as informações do cliente no localStorage
function salvarInformacoesCliente() {
    const cliente = {
        nome: document.getElementById('txtNome').value,
        uf: document.getElementById('ddlUf').value,
        telefone: document.getElementById('txtTelefone').value,
        endereco: document.getElementById('txtEndereco').value
    };

    // Salva os dados do cliente no localStorage
    localStorage.setItem('cliente', JSON.stringify(cliente));
    alert("Informações salvas com sucesso!");
}

// Função para preencher automaticamente o formulário com os dados do cliente
function preencherFormulario() {
    const clienteInfo = localStorage.getItem('cliente');

    if (clienteInfo) {
        const cliente = JSON.parse(clienteInfo);

        // Preencher os campos do formulário com os dados salvos
        document.getElementById('txtNome').value = cliente.nome || '';
        document.getElementById('ddlUf').value = cliente.uf || '';
        document.getElementById('txtTelefone').value = cliente.telefone || '';
        document.getElementById('txtEndereco').value = cliente.endereco || '';

        alert(`Bem-vindo de volta, ${cliente.nome}! Seus dados foram preenchidos.`);
    } else {
        alert("Nenhum dado de cliente foi encontrado.");
    }
}

loja.metodos = {

    obterProdutosCarrinho: () => {

        carrinhoDeCompras.carregarCarrinho();
        let itens = [];
        itens = carrinhoDeCompras.itens;
        // Limpa o conteúdo
        $("#itensProdutosCarrinho").html('');
        console.log("itens :", carrinhoDeCompras.itens.length);
    
        for (var i = 0; i < itens.length; i++) {
            let preco = parseFloat(itens[i].preco).toFixed(2).replace('.', ',');
            // let metragem = parseFloat(itens[i].metragemSelect);  Metragem selecionada
            let quantItem = parseInt(itens[i].quantidade); // Quantidade selecionada
    
            // Cálculo do valor total com base na quantidade
            let valorMetragem = parseFloat(itens[i].preco) * quantItem;
    
            // Formatação do valor total para o formato monetário brasileiro
            valorMetragem = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(valorMetragem);
    
             // Adiciona o espaço após 'R$' para o formato correto
            const valorPtBR = valorMetragem.replace('R$', '');
            
            console.log("Valor Unitário: ", valorPtBR); // Valor total formatado
    
            // Substituindo valores no template
            let temp = loja.templates.itemResumo
                .replace(/\${img}/g, itens[i].img)
                .replace(/\${name}/g, itens[i].name)
                .replace(/\${qtd}/g, itens[i].quantidade)
                .replace(/\${total}/g, preco) // Preço unitário
                .replace(/\${price}/g, itens[i].preco)
                //.replace(/\${medida}/g, metragem) Metragem selecionada
                .replace(/\${valorMetragem}/g, valorPtBR); // Valor total formatado com a metragem
    
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
            var itens = ''; // Mover a declaração da variável para o início
           
            // $.each(carrinhoDeCompras.itens, (i, e) => {
            //     // Calculando o preço total com a metragem selecionada
            //     let precoTotal = (parseFloat(e.preco) * parseInt(e.quantidade)).toFixed(2).replace('.', ',');// * parseFloat(e.metragemSelect)
            //     // Concatena as informações de cada item no formato correto
            //     itens += `*${e.quantidade}x* ${e.name} - *R$ ${precoTotal}* \n`;//(Metragem: ${e.metragemSelect}m)
            // });

            $.each(carrinhoDeCompras.itens, (i, e) => {
                // Calculando o preço total com a metragem selecionada (multiplicando preço pela quantidade)
                let precoTotal = parseFloat(e.preco) * parseInt(e.quantidade);
            
                // Formatação do preço total no formato monetário brasileiro
                precoTotal = new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(precoTotal);
            
                // Concatena as informações de cada item no formato correto
                itens += `*${e.quantidade}x* ${e.name} - *${precoTotal}* \n`;  // Exibe o preço já formatado
            });
            
    
            // Continuando com a mensagem, concatenando endereço e cliente
            texto += `\n*Itens do pedido:*\n${itens}`; // Insere a lista de itens aqui
            texto += '\n*Endereço de entrega:*';
            texto += `\n${MEU_ENDERECO.endereco} - ${MEU_ENDERECO.uf}`;
            texto += `\nCliente: ${MEU_ENDERECO.nome}`;
            texto += `\nTelefone: ${MEU_ENDERECO.numeroTelefone}`;
            
            console.log("Texto da mensagem:", texto);
    
            // Converte a mensagem para URI e gera o link do WhatsApp
            let encode = encodeURI(texto);
            let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;
            console.log("URL gerada para WhatsApp:", URL);
    
            // Atualiza o href do botão com o link gerado
            $("#btnEtapaResumo").attr('href', URL);
    
        } else {
            loja.metodos.mensagem("Carrinho vazio ou endereço não definido.");
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
                        <!-- medida do produto 
                        <p class="text-muted">Metragem: \${medida}m² x 1.22m²</p>-->
                        <div class="d-flex justify-content-between">
                            <div>
                                <p class="card-text">Quantidade: \${qtd}</p>
                                <!-- Preço do produto -->
                                <p class="card-text fw-bolder">
                                    <label>Total:
                                        <h3>
                                            <span class="item-total price">
                                                <span class="currency">R$</span>
                                                <span class="value me-3" id="preco"> \${valorMetragem}</span>
                                            </span>
                                        </h3>
                                    </label>
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