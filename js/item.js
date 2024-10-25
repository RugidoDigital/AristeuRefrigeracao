document.addEventListener("DOMContentLoaded", function() {
    loja.eventos.init();
});

const button = document.getElementById("float-button-carrinho");
button.onclick = function() {
    window.location.href = "carrinho.html";
};

window.onscroll = function() {

    var floatButton = document.querySelector('.float-button');
    if (document.documentElement.scrollTop > 100) { // Exibe o botão após rolar 200px
        floatButton.style.display = 'block'; // Botao carrinho float (habilitado)
    } else {
        floatButton.style.display = 'none'; // Botao carrinho float (desabilitado)
    }
};

var loja = {};

loja.eventos = {

    init: () => {
        console.log("Função init está sendo chamada.");
        loja.metodos.obterItemSelecionado();
        carrinhoDeCompras.carregarCarrinho();
        loja.metodos.atualizarBadge(carrinhoDeCompras.calcularTotalQuantidade());
        // loja.metodos.obterProdutosCarrinho();
        loja.metodos.atualizarPreco();
    }
}

loja.metodos = {

    obterItemSelecionado:() =>{
        let string = sessionStorage.getItem('item_data')
        const item = string.split(",");
        console.log("Item passado ", item);
        console.log("Item ", item[0]);

        loja.metodos.getProximosElementos(parseInt(item[2]) - 1);
        
        let preco = parseFloat(item[3]).toFixed(2);
        preco = preco.replace('.', ',');

        let temp = loja.templates.item
        .replace(/\${img}/g, item[0])
        .replace(/\${name}/g, item[1])
        .replace(/\${id}/g, item[2])
        .replace(/\${price}/g, preco)
        .replace(/\${marca}/g, item[4])
        .replace(/\${largura}/g, item[5])
    
        // Adiciona os itens ao #itensProduto
        $("#itensProduto").append(temp);
        
    }, 

    atualizarPreco: () => {
    // Obtendo dados do produto do sessionStorage
    let string = sessionStorage.getItem('item_data');
    let item = string.split(",");
    const valorProduto = parseFloat(item[3]); // Preço de 1 metro do produto

    // Obtendo a metragem selecionada pelo usuário
    const metragemSelect = parseFloat(document.getElementById('metros').value);

    // Obtendo a quantidade selecionada pelo usuário
    const quantidade = parseInt(document.getElementById('inputQuantity').innerText); // Certifique-se de que este campo existe no HTML

    // Calculando o preço total com base na metragem e na quantidade
    const precoTotal = (valorProduto * metragemSelect * quantidade);

    // Atualizando o valor na tela
    document.getElementById('preco').innerText = `${precoTotal.toFixed(2)}`; // Preço total formatado

    // Logs para depuração
    console.log("Valor do produto (por metro):", valorProduto);
    console.log("Metragem selecionada >>>>>", metragemSelect); // Valor em metros
    console.log("Quantidade selecionada >>>>>", quantidade); // Quantidade de itens
    console.log("Preço total >>>>>", precoTotal); // Preço total calculado
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
                .replace(/\${largura}/g, itens[i].largura)
    
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

    adicionarAoCarrinho:(value) =>{

        let quantityLabel = document.getElementById('inputQuantity');
        quantidade = parseInt(quantityLabel.textContent);
        let metragemSelect = parseFloat(document.getElementById('metros').value);
        id = (parseInt(value)) - 1
        var itemParaAdicionar = MENU[id];
        carrinhoDeCompras.adicionarItem({
            img: itemParaAdicionar.img,
            id: itemParaAdicionar.id,
            name: itemParaAdicionar.name,
            preco: itemParaAdicionar.price,
            quantidade: quantidade,
            metragemSelect: metragemSelect,
            valUnit: metragemSelect
        });

        carrinhoDeCompras.salvarCarrinho();
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
        console.log(value);
        sessionStorage.setItem('item_data', value);
    }

    
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
                    <img class="card-img-top mb-5 mb-md-0 img-fluid rounded-start" src="\${img}" alt="..." />
                </div>
                <div class="col-md-6">
                    <div class="card-body">
                        <div class="product-header">
                            <span>Marca: \${marca}</span>
                        </div>
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
                                    <select id="metros" onchange="loja.metodos.atualizarPreco(\${id})" class="form-select" aria-label="Default select example">
                                        <option value="1">1.00m x 1.22m</option>
                                        <option value="1.5">1.50m x 1.22m</option>
                                        <option value="2">2.00m x 1.22m</option>
                                        <option value="2.5">2.50m x 1.22m</option>
                                        <option value="3">3.00m x 1.22m</option>
                                        <option value="3.5">3.50m x 1.22m</option>
                                        <option value="4">4.00m x 1.22m</option>
                                        <option value="4.5">4.50m x 1.22m</option>
                                        <option value="5">5.00m x 1.22m</option>
                                        <option value="5.5">5.50m x 1.22m</option>
                                        <option value="6">6.00m x 1.22m</option>
                                        <option value="6.5">6.50m x 1.22m</option>
                                        <option value="7">7.00m x 1.22m</option>
                                        <option value="7.5">7.50m x 1.22m</option>
                                        <option value="8">8.00m x 1.22m</option>
                                        <option value="8.5">8.50m x 1.22m</option>
                                        <option value="9">9.00m x 1.22m</option>
                                        <option value="9.5">9.50m x 1.22m</option>
                                        <option value="10">10.0m x 1.22m</option>
                                    </select>
                                </div>
                            </div>
                            <div class="product-quantity p-2">
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
                                <ul>
                                    <li>Largura: \${largura}</li>
                                    <li>Impermeável</li>
                                    <li>Lavável</li>
                                    <li>Antibacteriano</li>
                                    <li>Auto colante</li>
                                </ul>
                            </div>
                            <button class="add-to-cart-btn tolltip m-2" 
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
                                <li>Largura : \${largura}</li>
                                <li>Impermeável</li>
                                <li>Lavável</li>
                                <li>Antibacteriano</li>
                                <li>Auto colante</li>
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
                <a class="custom-button mt-auto" href="item.html"onclick="loja.metodos.verPaginaDoItem(['\${img}','\${name}','\${id}',parseFloat('\${price}'.replace(',','.')),'\${marca}','\${largura}'])"
                >Comprar</a></div>
            </div>
        </div>
        </div>
    `
}