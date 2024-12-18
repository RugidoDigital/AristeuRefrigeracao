document.addEventListener("DOMContentLoaded", function() {
    loja.eventos.init();
});

const button = document.getElementById("float-button-carrinho");
button.onclick = function() {
    window.location.href = "carrinho.html";
};

window.onscroll = function() {

    var floatButton = document.querySelector('.float-button');
    // var floatPetzap = document.querySelector('.float-zap');// BOTÃO DE WHATSAPP
    if (document.documentElement.scrollTop > 100) { // Exibe o botão após rolar 200px
        floatButton.style.display = 'block'; // Botao carrinho float (habilitado)
        // floatPetzap.style.display = 'block';
    } else {
        floatButton.style.display = 'none'; // Botao carrinho float (desabilitado)
        // floatPetzap.style.display = 'none';
    }
};

// Objeto para armazenar os dados atualizados
var loja = {};

loja.eventos = {

    init: () => {
        console.log("Função init está sendo chamada.");
        console.log("ID do produto: ", sessionStorage.getItem('itemSelecionadoID'));
        // console.log("Item selecionado: ", sessionStorage.getItem('item_data'));

        loja.metodos.obterItemSelecionado();
        carrinhoDeCompras.carregarCarrinho();
        loja.metodos.atualizarBadge(carrinhoDeCompras.calcularTotalQuantidade());
        loja.metodos.ProdutoSelected();
        loja.metodos.atualizarPreco();
    }
}

loja.metodos = {

    obterItemSelecionado:() =>{
        let string = sessionStorage.getItem('item_data');
        const item = string.split(",");
        console.log("Item passado ", item);
        loja.metodos.getProximosElementos(parseInt(item[2]) - 1);
    
        // Formata o preço
        let preco = parseFloat(item[3]).toFixed(2);
        preco = preco.replace('.', ',');
        // Adiciona as informações do produto
        let temp = loja.templates.item
            .replace(/\${img}/g, item[0])// IMAGEM - PRODUTO
            .replace(/\${name}/g, item[1])// NOME - PRODUTO
            .replace(/\${id}/g, item[2])// ID - PRODUTO
            .replace(/\${price}/g, preco)// PREÇO - PRODUTO
            .replace(/\${marca}/g, item[4])// MARCA - PRODUTO
            .replace(/\${medida}/g, item[5])// UNIDADE DE MEDIDA - PRODUTO
            .replace(/\${categoria}/g, item[6]) // CATEGORIA - PRODUTO
            .replace(/\${sub_categoria}/g, item[6]) // SUB-CATEGORIA - PRODUTO
            .replace(/\${codigo}/g, item[7]) // CÓDIGO - PRODUTO
        
            
        // Adiciona os itens ao #itensProduto
        $("#itensProduto").append(temp);
        
    },

    ProdutoSelected:() => {
        let string = sessionStorage.getItem('item_data');
        const NumberID = string.split(","); // Chama a JSON do ID selecionado em Comprar
        const NumberItem = parseInt(NumberID[2], 10); // Seleciona apenas o número do ID
        let optionsHTML = ''; 
        const idDesejado = NumberItem; // Substitua por qualquer ID para teste
        
        const produto = MENU.find((item) => item.id === idDesejado);
        if (produto) {
            produto.opcoes_medidas.forEach((opcao) => {
                optionsHTML += `
                <option value="${opcao.value}" data-imagem="${opcao.img}" 
                    data-medida="${opcao.medida}" data-marca="${opcao.marca}" 
                    data-price="${opcao.price}" data-codigo="${opcao.codigo}">
                        ${opcao.descricao}
                </option>`;
            });
        }

        document.getElementById('metros').innerHTML = optionsHTML; //Mostra as opções no select
        // Seleciona o elemento select
        const select = document.getElementById('metros'); // SelectOptions - Produtos
        const quantityLabel = document.getElementById('inputQuantity');// O ID do seletor de quantidade
        quantityLabel.textContent = 1;
        // Seleciona os elementos que serão alterados
        const Img = document.getElementById('valueImg'); // Imagem
        const Medida = document.getElementById('valueMed'); // Medida
        const Marc = document.getElementById('valueMarca'); // Marca
        const Price = document.getElementById('preco'); // Preço
        const Cod = document.getElementById('valueCodigo'); // Código
        
        

        // Adiciona um evento de mudança (change) ao select
        
        select.addEventListener('change', () => {
            // Altera a quantidade de volta para 1 
            // sempre que a medida for alterada
            
            // Obtém a opção selecionada
            const optionSelected = select.options[select.selectedIndex];
            // Pega os atributos data-imagem e data-medida da opção
            const img = optionSelected.getAttribute('data-imagem');
            const medida = optionSelected.getAttribute('data-medida');
            const marca = optionSelected.getAttribute('data-marca');
            const Newprice = optionSelected.getAttribute('data-price');
            const codigo = optionSelected.getAttribute('data-codigo');

            // Formata o preço para o formato monetário
            const price = new Intl.NumberFormat('pt-BR', {
                minimumFractionDigits: 2, // Garante sempre duas casas decimais
                maximumFractionDigits: 2,
            }).format(Newprice);

            // imagemProduto.src = newImg;
            Img.textContent = `${img}`;
            Marc.textContent = `Marca: ${marca}`;
            Medida.textContent = `Medida: ${medida}`;
            Price.textContent = `${price}`
            Cod.textContent = `Código: ${codigo}`;
        });

        // Configura o evento de clique no botão "Adicionar ao Carrinho"
        document.querySelector('.add-to-cart-btn').addEventListener('click', () => {
            const optionSelected = select.options[select.selectedIndex];

            
                // Verifica se uma medida foi selecionada
                let produtoAtualizado = {};
                if (optionSelected.value) {
                    // Usa os dados da opção selecionada
                    produtoAtualizado = {
                        id: produto.id,
                        name: produto.name,
                        img: optionSelected.getAttribute('data-imagem'),
                        medida: optionSelected.getAttribute('data-medida'),
                        marca: optionSelected.getAttribute('data-marca'),
                        preco: parseFloat(optionSelected.getAttribute('data-price')),
                        codigo: optionSelected.getAttribute('data-codigo'),
                        quantidade: produto.quantidade,
                        categoria: produto.categoria,
                        sub_categoria: produto.sub_categoria,
                        opcoes_medidas: produto.opcoes_medidas,
                    };
                } else {
                    produtoAtualizado = {
                        img: produto.img,
                        id: produto.id,
                        name: produto.name,
                        preco: produto.price,
                        quantidade: quantidade,
                        codigo: produto.codigo,
                        categoria: produto.categoria,
                        sub_categoria: produto.sub_categoria,
                        opcoes_medidas: produto.opcoes_medidas,
                    };
                }
            loja.metodos.adicionarAoCarrinho(produtoAtualizado);// Passa o produto atualizado para o método adicionarAoCarrinho
        });
    },

    atualizarPreco: () => {
        // Obtendo os dados do produto do sessionStorage
        let string = sessionStorage.getItem('item_data');
        let item = string.split(",");
        
        // Obtendo o select e a opção selecionada
        const select = document.getElementById('metros'); // Certifique-se de que o ID do select está correto
        const optionSelected = select.options[select.selectedIndex];
        
        // Obtendo o preço atualizado da opção selecionada
        const valorProduto = parseFloat(optionSelected.getAttribute('data-price')); // Preço da medida selecionada
        
        // Obtendo a quantidade selecionada pelo usuário
        const quantidade = parseInt(document.getElementById('inputQuantity').innerText); // Certifique-se de que este campo existe no HTML
        
        // Calculando o preço total com base na quantidade
        const precoTotal = valorProduto * quantidade;
        
        // Formatando o preço total para o formato brasileiro (R$)
        const precoTotalFormatado = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(precoTotal);
        const valorComEspaco = precoTotalFormatado.replace('R$', '');
        // Atualizando o valor na tela
        document.getElementById('preco').innerText = valorComEspaco; // Preço total formatado
        
        // Logs para depuração
        console.log("Valor do produto (por unidade):", valorProduto);
        console.log("Quantidade selecionada:", quantidade);
        console.log("Preço total calculado:", precoTotal);
    },
    // Atualizar o carrinho na interface do usuário
    atualizarCarrinho: function() {
        // Aqui você pode implementar a lógica para atualizar a interface do carrinho na sua página HTML
        // Por exemplo, atualizar a lista de itens, exibir o total, etc.
        console.log("Carrinho atualizado: ", this.itens);
        console.log("Carrinho Quantidade : ", this.itens.length);
    }, 

    obterItensRelacionado:(itens) =>{
        console.log("Elementos Relacionados ",itens);

        for (var i = 0; i < itens.length; i++) {
            let preco = itens[i].price.toFixed(2).replace('.', ',');
            let temp = loja.templates.itemRelacionado
                .replace(/\${img}/g, itens[i].img)
                .replace(/\${name}/g, itens[i].name)
                .replace(/\${id}/g, itens[i].id)
                .replace(/\${price}/g, preco)
                .replace(/\${price}/g, itens[i].price)
                .replace(/\${marca}/g, itens[i].marca)
                .replace(/\${medida}/g, itens[i].medida)
                .replace(/\${categoria}/g, itens[i].categoria)
                .replace(/\${sub_categoria}/g, itens[i].sub_categoria)
                .replace(/\${codigo}/g, itens[i].codigo)
    
            // Adiciona os itens ao #itensProdutos
            $("#itensProdutos").append(temp);
        }
    },

    getProximosElementos:(index) =>{
        if (index < 0 || index >= MENU.length) {
            return null; // Retorna null se o índice estiver fora do intervalo do array
        }
    
        let proximosElementos;
        if (index + 4 > MENU.length) {
            // Se o índice estiver próximo do final do array, retorna os 4 elementos anteriores
            proximosElementos = MENU.slice(Math.max(0, index - 4), index);
        } else {
            // Retorna os 4 próximos elementos
            proximosElementos = MENU.slice(index + 1, index + 5);
        }
        
        loja.metodos.obterItensRelacionado(proximosElementos);
    },

    adicionarAoCarrinho: (produtoAtualizado) => {
        // Garante que a quantidade inicial seja 1, caso não tenha sido definida
        let quantidade = 1; 
    
        // Tenta buscar a quantidade atual do input (caso o usuário tenha alterado)
        let quantityLabel = document.getElementById('inputQuantity');
        if (quantityLabel) {
            quantidade = parseInt(quantityLabel.textContent) || 1;
        }
    
        // Verifica se o produto foi passado corretamente
        if (!produtoAtualizado || Object.keys(produtoAtualizado).length === 0) {
            console.error("Nenhum produto foi selecionado ou os dados estão incompletos.");
            return;
        }
    
        // Atribui a quantidade ao produto
        produtoAtualizado.quantidade = quantidade;
    
        // Carrega o carrinho do sessionStorage
        let carrinho = JSON.parse(sessionStorage.getItem('carrinho')) || [];
    
        // Verifica se o produto já existe no carrinho
        const produtoExistente = carrinho.find((item) =>
            item.id === produtoAtualizado.id && item.codigo === produtoAtualizado.codigo
        );
    
        if (produtoExistente) {
            // Se existe, incrementa a quantidade
            produtoExistente.quantidade += quantidade;
        } else {
            // Se não existe, adiciona ao carrinho com quantidade 1
            carrinho.push(produtoAtualizado);
        }
    
        // Salva o carrinho atualizado no sessionStorage
        sessionStorage.setItem('carrinho', JSON.stringify(carrinho));
        console.log("Produto adicionado ao carrinho:", produtoAtualizado);
        // alert("Produto adicionado ao carrinho com sucesso!"); // Test
    
        // Atualiza a interface
        carrinhoDeCompras.carregarCarrinho();
        loja.metodos.atualizarBadge(carrinhoDeCompras.calcularTotalQuantidade());
        loja.metodos.mensagem('Item adicionado ao carrinho', 'green');
    },

    atualizarBadge:(value) =>{
        var badgeSpan = document.getElementById('badgeCart');
        var badgeSpanFloat = document.getElementById('badgeCartFloat');
        badgeSpan.textContent = value;
        badgeSpanFloat.textContent = value;
    },

    obterProdutosCarrinho:() =>{
        carrinhoDeCompras.carregarCarrinho();
        let itens = carrinhoDeCompras.itens || [];
        itens = carrinhoDeCompras.itens;
        console.log("Elementos Relacionados ",itens);
        if (loja.templates && loja.templates.item) { // Verifica se o template está definido
            for (var i = 0; i < itens.length; i++) {
                // Certifique-se de que todas as propriedades existem
                let img = itens[i].img || '';  // Valor padrão vazio se não existir
                let name = itens[i].name || 'Sem nome'; // Nome padrão se não existir
                let id = itens[i].id || ''; // Valor padrão vazio se não existir
                // Gera o HTML substituindo os valores
                let temp = loja.templates.item
                    .replace(/\${img}/g, itens[i].img)
                    .replace(/\${name}/g, itens[i].name)
                    .replace(/\${id}/g, itens[i].id)
    
                // Adiciona os itens ao #itensProdutos
                console.log("temp ",temp);
                $("#itensProdutosCarrinho").append(temp);
                // Adiciona os itens ao #itensProdutos
                console.log("temp ", temp);
                $("#itensProdutosCarrinho").append(temp);
            }
        } else {
            console.error("Template 'itemCarrinho' não encontrado em 'loja.templates'");
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
    },

    btnSubtract: ( ) =>{
        let quantityLabel = document.getElementById('inputQuantity');
        quantidade = parseInt(quantityLabel.textContent);
        console.log("teste ", quantidade);
        if (quantidade > 1) {
            quantidade--;
            quantityLabel.textContent = quantidade;
        }
    },

    btnAdd: ( ) =>{
        let quantityLabel = document.getElementById('inputQuantity');
        console.log("anterior ", quantityLabel);
        quantidade = parseInt(quantityLabel.textContent);
        console.log("posterior ", quantidade);
        quantidade++;
        quantityLabel.textContent = quantidade;
    },

    verPaginaDoItem: (value) =>{
        sessionStorage.setItem('item_data', value);
        console.log("Valor recebido:", value);
    
        // Obter o item correspondente do MENU usando o `value`
        const item = MENU.find(produto => produto.id === value);
        if (!item) {
            console.error("Item não encontrado no MENU.");
            return;
        }
        // Salva os dados no sessionStorage e no localStorage
        localStorage.setItem('itemSelecionado', JSON.stringify(itemParaSalvar));
        // loja.metodos.verPaginaDoItem('\${opcoes_medidas}');
        console.log("Item armazenado com sucesso:", itemParaSalvar);
    },

    
}

loja.templates = {  // R$ \${price}
                
    item: `
    <div class="card mb-3" style="border: 0;">
        <div class="product-actions">
            <form class="mb-3" action="index.html">
                <button class="btn btn-outline-dark" type="submit">
                    <i class="bi bi-arrow-left-square-fill me-2"></i>
                    Continuar Comprando
                </button>
            </form> 
        </div>
            <div class="row g-0">
                <div class="col-md-6">
                    <img id="valueImg" class="card-img-top mb-5 mb-md-0 img-fluid rounded-start" src="\${img}" alt="..." />
                </div>
                <div class="col-md-6">
                    <div class="card-body">
                        <h5 class="card-title">
                            <div class="product-title">
                                \${name}
                            </div>
                        </h5>
                        <p class="card-text">
                            <div class="product-price">
                                <span class="price">
                                    <span class="currency">R$</span>
                                    <span class="value me-3" id="preco">\${price}</span>
                                </span>
                                <div class="m-2">
                                <!-- onchange="loja.metodos.atualizarPreco(\${id})" -->
                                    <select id="metros" class="form-select" aria-label="Selecione a medida"></select>
                                </div>
                            </div>
                            <div class="product-quantity py-2">
                                <p class="quantity-label-item">Quantidade: </p>
                                <div class=" quantity-control me-2" onclick="loja.metodos.atualizarPreco(\${id})">
                                    <button class="btn-cart-control btn-subtract me-2" 
                                    onclick="loja.metodos.btnSubtract()"
                                    >-</button>
                                    <span class="quantity-label me-2" id="inputQuantity">1</span>
                                    <button class="btn-cart-control btn-add"
                                    onclick="loja.metodos.btnAdd()"
                                    >+</button>
                                </div>
                            </div>
                            <div class="product-description">
                                <p>Sobre este item</p>
                                <ul><!-- Informações do produto-->
                                    <li id="valueMarca">Marca: \${marca}</li>
                                    <li>Categoria: \${categoria}</li>
                                    <li id="valueMed">Medida: \${medida}</li>
                                    <li id="valueCodigo">Código: \${codigo}</li>
                                </ul>
                            </div>
                            <!-- <button class="add-to-cart-btn tolltip m-2" 
                                onclick="loja.metodos.adicionarAoCarrinho(\${id})">
                                <div> Adicionar ao carrinho +<i class="bi-cart-fill me-1"></i></div> 
                            </button> -->
                            <button 
                                class="add-to-cart-btn tolltip m-2" 
                                onclick="loja.metodos.adicionarAoCarrinho(\${id})">
                                <div> Adicionar ao carrinho +<i class="bi-cart-fill me-1"></i></div> 
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `,

    itemRelacionado:`
    <div class="col-12 mb-5">
                        
        <div class="card h-100">
            <!-- Product image-->
            <div class="card-title grid">
                <figure class="effect-milo">
                    <img class="card-img-top" src="\${img}" alt="..." />
                    <figcaption>
                        <div class="product-description">
                            <h5>Sobre este item:</h5>
                            <ul>
                                <li>Marca: \${marca}</li>
                                <li>Categoria: \${categoria}</li>
                                <li>Medida: \${medida}</li>
                            </ul>
                        </div>
                    </figcaption>			
                </figure>
            </div>
            <!-- Product details-->
            <div class="card-body p-2">
                <div class="text-center">
                    <!-- Product name-->
                    <h6>\${name}</h6>
                    <!-- Product price-->
                    <span class="price">
                        <span class="currency">R$</span>
                        <span class="value">\${price}</span>
                    </span>
                </div>
            </div>
            <!-- Product actions-->
            <div class="card-footer p-3 pt-0 border-top-0 bg-transparent">
                <div class="text-center">
                <a class="custom-button mt-auto" href="item.html" onclick="loja.metodos.verPaginaDoItem(['\${img}','\${name}','\${id}',parseFloat('\${price}'.replace(',','.')),'\${marca}','\${medida}','\${categoria}','\${codigo}'])"
                >Comprar</a></div>
            </div>
        </div>
        </div>
    `
}