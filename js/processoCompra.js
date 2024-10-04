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

    obterProdutosCarrinho:() =>{

        carrinhoDeCompras.carregarCarrinho();
        let itens = [];
        itens = carrinhoDeCompras.itens;        
        console.log("Elementos Relacionados ",itens);

        if(itens.length == 0){
            console.log(" Carrinho vazio >>>>>>>");
            loja.metodos.carrinhoVazio();
        }else{
            loja.metodos.carrinhoCheio();
        }

        $("#itensProdutosCarrinho").html('');
        console.log("itens :", carrinhoDeCompras.itens.length);

        for (var i = 0; i < itens.length; i++) {

            let preco = itens[i].preco.toFixed(2).replace('.', ',');
            let temp = loja.templates.itemCarrinho
                .replace(/\${img}/g, itens[i].img)
                .replace(/\${name}/g, itens[i].name)
                .replace(/\${id}/g, itens[i].id)
                .replace(/\${qtd}/g, itens[i].quantidade)
                .replace(/\${price}/g, preco)
    
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
        } else
            valorTotal.textContent = "0,00" + " R$";
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
   <div class="col mb-4">
                        <div class="card custom-card">
                            <!-- Product image-->
                            <div class="card-cont-cart">
                                <img class="card-img-top" src="\${img}" alt="..." />
                            </div>
                            <!-- Product details-->
                            <div class="card-body custom-card-content">
                                <div class="text-center">
                                    <!-- Product name-->
                                    <h5 class="fw-bolder">\${name}</h5>
                                    <!-- Product price-->
                                    <br>
                                    <h5 class="fw-bolder">R$ \${price}</h5>
                                    
                                </div>
                            </div>

                            <div class="card-cart-control">

                                <div class=" quantity-control" style="width: 100px">
                                    <button class="btn-cart-control btn-subtract"
                                    onclick="loja.metodos.btnSubtract(\${id})"
                                    >-</button>
                                    <span class="quantity-label" id="quantity-label-\${id}">\${qtd}</span>
                                    <button class="btn-cart-control btn-add"
                                    onclick="loja.metodos.btnAdd(\${id})"
                                    >+</button>
                                </div>

                                <div class="card-footer border-top-0 bg-transparent">
                                    <div class="text-center"><a class="btn btn-outline-dark mt-auto"
                                    onclick="loja.metodos.btnRemove(\${id})"> 
                                    <i class="bi bi-trash-fill"></i>  
                                    Remover</a>
                                </div>
                                
                            </div>
                        </div>                    
                    </div>
    `,

}