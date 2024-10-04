document.addEventListener("DOMContentLoaded", function() {
    loja.eventos.init();
});

var loja = {};

loja.eventos = {

    init: () => {
        console.log("Função init está sendo chamada.");
        loja.metodos.obterItemSelecionado();
        carrinhoDeCompras.carregarCarrinho();
        loja.metodos.atualizarBadge(carrinhoDeCompras.calcularTotalQuantidade());
        loja.metodos.obterProdutosCarrinho();
        loja.metodos.atualizarPreco();
    }
}

loja.metodos = {

    obterItemSelecionado:() =>{
        let string = sessionStorage.getItem('item_data')
        let item = string.split(",");
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
        let string = sessionStorage.getItem('item_data')
        let item = string.split(",");
        const valorProduto = item[3] // Preço de 1metro do produto chamado da JSON "\${price}"

        const metragemSelect = parseFloat(document.getElementById('metros').value);
        const precoTotal = (valorProduto * metragemSelect);
        
        // Calculo => precoTotal = (valorProduto * metragemSelect) = passando o resultado na tela
        document.getElementById('preco').innerText = `${precoTotal.toFixed(2)}`;//Preço total
        console.log(valorProduto);
        console.log("Metragem selecionada >>>>>", metragemSelect); // Valor em metros que foi selecionado
        console.log(precoTotal); // Referênte ao metro
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
        metragemSelect: metragemSelect
        });

        carrinhoDeCompras.salvarCarrinho();
        carrinhoDeCompras.carregarCarrinho();
        loja.metodos.atualizarBadge(carrinhoDeCompras.calcularTotalQuantidade());

        loja.metodos.mensagem('Item adicionado ao carrinho', 'green');

    },

    atualizarBadge:(value) =>{
        var badgeSpan = document.getElementById('badgeCart');
        badgeSpan.textContent = value;
    },

    obterProdutosCarrinho:() =>{

        carrinhoDeCompras.carregarCarrinho();
        let itens = [];
        itens = carrinhoDeCompras.itens;
        console.log("Elementos Relacionados ",itens);

        for (var i = 0; i < itens.length; i++) {
            let temp = loja.templates.itemCarrinho
                .replace(/\${img}/g, itens[i].img)
                .replace(/\${name}/g, itens[i].name)
                .replace(/\${id}/g, itens[i].id)
    
            // Adiciona os itens ao #itensProdutos
            console.log("temp ",temp);
            $("#itensProdutosCarrinho").append(temp);
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
                            <div class="product-quantity">
                                <p class="quantity-label-item">Quantidade: </p>
                                <div class=" quantity-control me-4">
                                    <button class="btn-cart-control btn-subtract me-2" 
                                    onclick="loja.metodos.btnSubtract()"
                                    >-</button>
                                    <span class="quantity-label me-2" id="inputQuantity">1</span>
                                    <button class="btn-cart-control btn-add"
                                    onclick="loja.metodos.btnAdd()"
                                    >+</button>
                                </div>

                                <button class="add-to-cart-btn" onclick="loja.metodos.adicionarAoCarrinho(\${id})">
                                Adicionar ao carrinho</button>
                            </div>
                            <div class="product-description">
                                <p>Sobre este item</p>
                                <ul>
                                    <li>Largura : \${largura}</li>
                                    <li>Impermeável</li>
                                    <li>Lavável</li>
                                    <li>Antibacteriano</li>
                                    <li>Auto colante</li>
                                </ul>
                            </div>
                            <div class="product-actions">
                                <form class="mb-3" action="index.html">
                                    <button class="btn btn-outline-dark" type="submit">
                                        <i class="bi bi-arrow-left-square-fill me-2"></i>
                                        Continuar Comprando
                                    </button>
                                </form> 
                            </div>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Favicon
        <div class="col-md-6">

            <div class="d-flex">
                <form class="mb-3" action="index.html">
                    <button class="btn btn-outline-dark" type="submit">
                        Voltar
                    </button>
                </form>

                <div class="div-quantity-control">
                    <button class="btn btn-outline-dark flex-shrink-0 me-4" type="button"
                    onclick="loja.metodos.adicionarAoCarrinho(\${id})">
                        <i class="bi bi-bag-fill me-1"></i>
                        Adicionar ao Carrinho
                    </button>
                </div>


            </div>

            <h1 class="display-5 fw-bolder">\${name}</h1>

            <div class="fs-5 mb-5">
                
            </div>

            <div class="d-flex">

                                               
                                
                <div class="div-quantity-control">
                    <button class="btn btn-outline-dark flex-shrink-0 me-4" type="button"
                    onclick="loja.metodos.adicionarAoCarrinho(\${id})">
                        <i class="bi bi-bag-fill me-1"></i>
                        Adicionar ao Carrinho
                    </button>
                </div>

            </div>
        </div>-->
    `,

    itemRelacionado:`
    <div class="col-12 mb-5">
        <div class="card h-100">
            <!-- Product image-->

            <div class="card-cont">
            <img class="card-img-top" src="\${img}" alt="..." />
            </div>

            <!-- Product details-->
            <div class="card-body p-4">
                <div class="text-center">
                    <!-- Product name-->
                    <h5 class="fw-bolder">\${name}</h5>
                    <!-- Product price-->
                    <h2 class="fw-bolder">R$ \${price}</h2>
                    
                    
                </div>
            </div>
            <!-- Product actions-->
            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                <div class="text-center">
                <a class="custom-button mt-auto" href="item.html"onclick="loja.metodos.verPaginaDoItem(['\${img}','\${name}','\${id}','\${price},\${marca},\${largura}'])"
                >Comprar</a></div>
            </div>
        </div>
    </div>
    `

}