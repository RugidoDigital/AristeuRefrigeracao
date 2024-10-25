document.addEventListener("DOMContentLoaded", function() {
    loja.eventos.init();
});

var loja = {};

loja.eventos = {

    init: () => {
        console.log("Função init está sendo chamada.");
        carrinhoDeCompras.carregarCarrinho();
        loja.metodos.atualizarBadge(carrinhoDeCompras.calcularTotalQuantidade());
        loja.metodos.obterProdutosCarrinho();
    }
}

loja.metodos = {

    atualizarBadge:(value) =>{
        //var badgeSpan = document.getElementById('badgeCart');
        //badgeSpan.textContent = value;
    },

    obterProdutosCarrinho: () => {

        carrinhoDeCompras.carregarCarrinho();
        let itens = carrinhoDeCompras.itens;        
        console.log("Elementos Relacionados ", itens);
    
        if (itens.length == 0) {
            console.log("Carrinho vazio >>>>>>>");
            loja.metodos.carrinhoVazio();
        } else {
            loja.metodos.carrinhoCheio();
        }
    
        $("#itensProdutosCarrinho").html('');
        console.log("itens :", carrinhoDeCompras.itens.length);
    
        for (var i = 0; i < itens.length; i++) {
            let preco = parseFloat(itens[i].preco).toFixed(2).replace('.', ',');
            let metragem = parseFloat(itens[i].metragemSelect); // Metragem selecionada
            let quantItem = parseInt(itens[i].quantidade); // Quantidade selecionada
            let valorMetragem = (parseFloat(itens[i].preco) * metragem * quantItem).toFixed(2).replace('.', ','); // Valor do produto com base na metragem
            console.log("Valor Unitário: ", valorMetragem); // Tá escrito valorMetragem, mas também faz a function de calc. a quantidade e apresentar o valor total 
            let temp = loja.templates.itemCarrinho
                .replace(/\${img}/g, itens[i].img)
                .replace(/\${name}/g, itens[i].name)
                .replace(/\${id}/g, itens[i].id)
                .replace(/\${qtd}/g, itens[i].quantidade)
                .replace(/\${price}/g, preco) // Preço unitário
                .replace(/\${largura}/g, metragem) // Metragem selecionada
                .replace(/\${valorMetragem}/g, valorMetragem); // Valor total com a metragem
    
            // Adiciona os itens ao #itensProdutos
            $("#itensProdutosCarrinho").append(temp);
        }
    
        loja.metodos.atualizarValorTotal(loja.metodos.obterValorTotal());
    },

    btnSubtract: (id) =>{
        let quantityLabel = document.getElementById('quantity-label-' + id);
        quantidade = parseInt(quantityLabel.textContent);

        if (quantidade > 1) {
            quantidade--;
            quantityLabel.textContent = quantidade;

            carrinhoDeCompras.alterarQuantidade(id, quantidade);
            loja.metodos.atualizarValorTotal(loja.metodos.obterValorTotal());

        }

        
    },

    btnAdd: (id) =>{
        let quantityLabel = document.getElementById('quantity-label-' + id);
        quantidade = parseInt(quantityLabel.textContent);

        quantidade++;
        quantityLabel.textContent = quantidade;

        carrinhoDeCompras.alterarQuantidade(id, quantidade);
        loja.metodos.atualizarValorTotal(loja.metodos.obterValorTotal());

    
    },
    btnRemove: (id) =>{
    
        carrinhoDeCompras.removerItem(id)
        loja.metodos.atualizarBadge(carrinhoDeCompras.calcularTotalQuantidade());
        loja.metodos.obterProdutosCarrinho();
        loja.metodos.atualizarValorTotal(loja.metodos.obterValorTotal());

    },

    atualizarValorTotal:(value) =>{
        let valorTotal = document.getElementById('total-carrinho');
        if(valorTotal != null){
            valorTotal.textContent = ": R$ " + value.replace('.', ',');
        } else {valorTotal.textContent = "0,00" + " R$";}
    },

    obterValorTotal:() =>{
        let valorTotal = carrinhoDeCompras.calcularTotal();
        console.log('valor total', valorTotal);
        return valorTotal;
    },



    carrinhoVazio:() =>{

        $("#btn-finalizar-compra").addClass("disable");
        $("#div-de-alerta").removeClass("disable");
    },

    carrinhoCheio:() =>{

        $("#div-de-alerta").addClass("disable");
        $("#btn-finalizar-compra").removeClass("disable");

    },

}

loja.templates = {

    itemCarrinho:`
   
        <div class="col mb-4 flow-content">
            <div class="overflow-auto">
              <div class="blog-card">
                <!-- Imagem do produto -->
                <div class="meta">
                    <div class="photo" style="background-image:url(\${img})">
                        <!-- Controle de quantidade -->
                        <div onclick="loja.metodos.obterProdutosCarrinho()" class="quantity-control d-flex justify-content-center align-items-center" style="width: 100px">
                            <button class="btn-cart-control btn-subtract" onclick="loja.metodos.btnSubtract(\${id})">-</button>
                            <span class="quantity-label mx-2" id="quantity-label-\${id}"  >\${qtd}</span>
                            <button class="btn-cart-control btn-add" onclick="loja.metodos.btnAdd(\${id})">+</button>
                        </div>
                    </div>
                </div>
                <!-- Detalhes do produto -->
                <div class="description">
                    <!-- Nome do produto -->
                    <h6>\${name}</h6>
                    <!-- Metragem do produto -->
                    <h2>Metragem: \${largura}m² x 1,22m²</h2>
                    <!-- Preço do produto -->
                    <p class="fw-bolder">
                        <h5>
                            <span class="price">
                                <span class="currency">R$</span>
                                <span class="value me-3" id="preco"> \${valorMetragem}</span>
                            </span>
                        </h5>
                    </p>
                    <!-- remoção -->
                    <p class="read-more">
                        <a class="btn btn-outline-danger mt-auto" onclick="loja.metodos.btnRemove(\${id})"> 
                            Remover
                        </a>
                    </p>
                </div>
              </div>
            </div>
        </div>
    `,
}