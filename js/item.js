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
        loja.metodos.obterItemSelecionado();
        carrinhoDeCompras.carregarCarrinho();
        loja.metodos.atualizarBadge(carrinhoDeCompras.calcularTotalQuantidade());
        
        loja.metodos.atualizarPreco();
        loja.metodos.ProdutoSelected();
        
    }
}

loja.metodos = {
    
    voltarParaAnterior: () => {
        if (window.history.length > 1) {
            // Voltar para a página anterior
            window.history.back();
        } else {
            // Caso não haja página anterior, redirecionar para a rota principal ou outra página
            window.location.href = '/';
        }
    },

    obterItemSelecionado:() =>{
        let string = sessionStorage.getItem('item_data')
        let item = string.split(",");
        console.log("Item passado ", item);
        console.log("Item ", item[0]);
        console.log("Item ", item[8,0]);
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
            .replace(/\${opcoes_medidas}/g, item[8])
            .replace(/\${value}/g, item[8,0]);
        
        // Adiciona os itens ao #itensProduto
        $("#itensProduto").append(temp);
    },

    ProdutoSelected: () => {
        let string = sessionStorage.getItem('item_data');
        const NumberID = string.split(","); // Obtém o JSON do ID selecionado
        const NumberItem = parseInt(NumberID[2], 10); // Seleciona apenas o número do ID
        let optionsHTML = `<option disabled selected>Selecionar medida:</option>`;
        const idDesejado = NumberItem;
    
        const produto = MENU.find((item) => item.id === idDesejado);
        if (produto) {
            produto.opcoes_medidas.forEach((opcao) => {
                optionsHTML += `
                    <option value="${opcao.value}" data-imagem="${opcao.img}" 
                        data-medida="${opcao.medida}" data-marca="${opcao.marca}" 
                        data-price="${opcao.price}" data-codigo="${opcao.codigo}">
                            ${opcao.descricao}
                    </option>
                `;
            });
        }
    
        document.getElementById('metros').innerHTML = optionsHTML; // Atualiza o select
    
        // Elementos para atualizar as informações do produto
        const select = document.getElementById('metros');
        let quantityLabel = document.getElementById('inputQuantity');
        
        quantityLabel.textContent = 1;
    
        const Img = document.getElementById('valueImg');
        const Medida = document.getElementById('valueMed');
        const Marca = document.getElementById('valueMarca');
        const Price = document.getElementById('preco');
        const Codigo = document.getElementById('valueCodigo');
    
        select.addEventListener('change', () => {
            const optionSelected = select.options[select.selectedIndex];
    
            // Pega os atributos da opção selecionada
            const img = optionSelected.getAttribute('data-imagem');
            const medida = optionSelected.getAttribute('data-medida');
            const marca = optionSelected.getAttribute('data-marca');
            const Newprice = optionSelected.getAttribute('data-price');
            const codigo = optionSelected.getAttribute('data-codigo');
    
            // Formata o preço
            const price = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(Newprice);
    
            // Atualiza as informações
            Img.textContent = img;
            Marca.textContent = `Marca: ${marca}`;
            Medida.textContent = `Medida: ${medida}`;
            Price.textContent = price;
            Codigo.textContent = `Código: ${codigo}`;
        });
        console.log("ID do produto >>>", produto.id,);
        // Evento para adicionar ao carrinho
        document.querySelector('.add-to-cart-btn').addEventListener('click', () => {
            const optionSelected = select.options[select.selectedIndex];
    
            if (!optionSelected.value) {
                loja.metodos.mensagem('Selecione uma medida antes de adicionar ao carrinho.', 'red');
                return;
            }

            const produtoAtualizado = {
                id: produto.id,
                name: produto.name,
                img: optionSelected.getAttribute('data-imagem'),
                medida: optionSelected.getAttribute('data-medida'),
                marca: optionSelected.getAttribute('data-marca'),
                preco: parseFloat(optionSelected.getAttribute('data-price')),
                codigo: optionSelected.getAttribute('data-codigo'),
                quantidade: parseInt(quantityLabel.textContent),
                categoria: produto.categoria,
                sub_categoria: produto.sub_categoria,
                value: produto.value,
            };
            
            loja.metodos.adicionarAoCarrinho(produtoAtualizado);
            console.log("produtoAtualizado >>>", produtoAtualizado);
            
        });
    },

    atualizarPreco: () => {
        try {
            // Obtendo os dados do produto do sessionStorage
            const string = sessionStorage.getItem('item_data');
            if (!string) {
                console.error("Nenhum dado encontrado no sessionStorage.");
                return;
            }
            const item = string.split(",");
    
            // Obtendo o select e a opção selecionada
            const select = document.getElementById('metros');
            if (!select) {
                console.error("Elemento select com ID 'metros' não encontrado.");
                return;
            }
            const optionSelected = select.options[select.selectedIndex];
            informacao_produtos = document.getElementById('informacao_produtos');
            // Determinando o preço do produto (por unidade)
            let valorProduto = 0;
            if (optionSelected && optionSelected.hasAttribute('data-price')) {
                valorProduto = parseFloat(optionSelected.getAttribute('data-price'));
                informacao_produtos.style.display='block';
            } else {
                informacao_produtos.style.display='none'; // Se nenhuma medida selecionada, display none no preço
                console.log("Nenhuma medida selecionada!");
            }
    
            // Obtendo a quantidade selecionada pelo usuário
            const quantityElement = document.getElementById('inputQuantity');
            if (!quantityElement) {
                loja.metodos.mensagem('Nenhuma medida selecionada!', 'red');
                return;
            }
            const quantidade = parseInt(quantityElement.innerText) || 1; // Valor padrão para quantidade
    
            // Calculando o preço total com base na quantidade
            const precoTotal = valorProduto * quantidade;
    
            // Formatando o preço total para o formato brasileiro (R$)
            const precoTotalFormatado = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(precoTotal);
    
            const valorComEspaco = precoTotalFormatado.replace('R$', '').trim();
    
            // Atualizando o valor na tela
            const precoElement = document.getElementById('preco');
            if (precoElement) {
                precoElement.innerText = valorComEspaco; // Preço total formatado
            } else {
                console.error("Elemento com ID 'preco' não encontrado.");
                loja.metodos.mensagem('Nenhuma medida selecionada!', 'red');
            }
    
            // Logs para depuração
            console.log("Valor do produto (por unidade):", valorProduto);
            console.log("Quantidade selecionada:", quantidade);
            console.log("Preço total calculado:", precoTotal);
    
        } catch (error) {
            console.error("Erro ao atualizar o preço:", error);
        }
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
                .replace(/\${opcoes_medidas}/g, itens[i].opcoes_medidas)
                .replace(/\${value}/g, itens[i].value);
    
            // Adiciona os itens ao #itensProdutos
            $("#itensProdutos").append(temp);
        }
    },

    getProximosElementos:(index) =>{
        if (index < 0 || index >= MENU.length) {
            return null; // Retorna null se o índice estiver fora do intervalo do array
        }
    
        let proximosElementos;
        if (index + 4 > MENU.length) { // Se o índice estiver próximo do final do array, retorna os 4 elementos anteriores
            proximosElementos = MENU.slice(Math.max(0, index - 4), index);
        } else { // Retorna os 4 próximos elementos
            proximosElementos = MENU.slice(index + 1, index + 5);
        }
        
        loja.metodos.obterItensRelacionado(proximosElementos);
    },

    adicionarAoCarrinho: (produto) => {
        if (!produto || !produto.id) {
                loja.metodos.mensagem('Item adicionado ao carrinho', 'green');
                // loja.metodos.mensagem('Erro ao adicionar o produto ao carrinho.', 'red');
            return;
        }
        console.log(produto);
        carrinhoDeCompras.adicionarItem(produto);;
        
        // Salva e atualiza o carrinho
        carrinhoDeCompras.salvarCarrinho();
        carrinhoDeCompras.carregarCarrinho(); // Atualiza a interface
        loja.metodos.atualizarBadge(carrinhoDeCompras.calcularTotalQuantidade()); // Atualiza o badge do carrinho
        loja.metodos.mensagem('Item adicionado ao carrinho', 'green'); // Mensagem de sucesso
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
            
            console.warning("Item não encontrado no MENU.");
            return;
            ;
        }
        // Salva os dados no sessionStorage e no localStorage
        localStorage.setItem('itemSelecionado', JSON.stringify(itemParaSalvar));
        // loja.metodos.verPaginaDoItem('\${opcoes_medidas}');
        console.warning("Item armazenado com sucesso:", itemParaSalvar)
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
                        <div class="m-2">
                        <!-- onchange="loja.metodos.atualizarPreco(\${id})" -->
                            <select onclick="loja.metodos.atualizarPreco(\${id})" id="metros" class="form-select" aria-label="Selecione a medida"></select>
                        </div>
                        <p class="card-text">
                            <div id="informacao_produtos">
                                <div class="product-price">
                                    <span class="price">
                                        <span class="currency">R$</span>
                                        <span class="value me-3" id="preco"></span>
                                    </span>
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
                                <button 
                                    class="add-to-cart-btn tolltip m-2" 
                                    onclick="loja.metodos.adicionarAoCarrinho(\${id})">
                                    <div> Adicionar ao carrinho +<i class="bi-cart-fill me-1"></i></div> 
                                </button>
                            <div/>
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
                <a class="custom-button mt-auto" href="item.html" onclick="loja.metodos.verPaginaDoItem(['\${img}','\${name}', parseInt('\${id}'), parseFloat('\${price}'.replace(',','.')),'\${marca}','\${medida}','\${categoria}','\${codigo}'])"
                >Comprar</a></div>
            </div>
        </div>
        </div>
    `
}