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

    voltarParaAnterior: () => {
        if (window.history.length > 1) {
            // Voltar para a página anterior
            window.history.back();
        } else {
            // Caso não haja página anterior, redirecionar para a rota principal ou outra página
            window.location.href = '/';
        }
    },

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
            // Preço unitário formatado
            let preco = parseFloat(itens[i].preco).toFixed(2).replace('.', ',');
    
            // Quantidade selecionada
            let quantItem = parseInt(itens[i].quantidade); 
    
            // Valor total com a metragem (formato monetário brasileiro)
            let valorMetragem = (parseFloat(itens[i].preco) * quantItem);
    
            // Formatando o valor total (valorMetragem) para o padrão monetário brasileiro
            valorMetragem = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(valorMetragem);

            // Adiciona o espaço após 'R$' para o formato correto
            const valorComEspaco = valorMetragem.replace('R$', '');
    
            console.log("Valor Unitário: ", valorComEspaco); // Valor total formatado
    
            let temp = loja.templates.itemCarrinho
                .replace(/\${img}/g, itens[i].img)
                .replace(/\${name}/g, itens[i].name)
                .replace(/\${id}/g, itens[i].id)
                .replace(/\${qtd}/g, itens[i].quantidade)
                .replace(/\${categoria}/g, itens[i].categoria)
                .replace(/\${sub_categoria}/g, itens[i].sub_categoria)
                .replace(/\${codigo}/g, itens[i].codigo)
                .replace(/\${price}/g, preco) // Preço unitário
                .replace(/\${medida}/g, itens[i].medida)  // Metragem selecionada
                .replace(/\${valorMetragem}/g, valorComEspaco); // Valor total com a metragem
    
            // Adiciona os itens ao #itensProdutosCarrinho
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
        let quantityLabel = document.getElementById('quantity-label-' + id);// Seleciona o rótulo com ID e código
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

    atualizarValorTotal: (value) => {
        let valorTotal = document.getElementById('total-carrinho');
        
        // Verifica se o valor de entrada é um número válido
        if (value && !isNaN(value)) {
            // Formata o número para o formato brasileiro com ponto como separador de milhar e vírgula como separador decimal
            const valorFormatado = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(value);

            // Adiciona o espaço após 'R$' para o formato correto
            const valorComEspaco = valorFormatado.replace('R$', ': R$');
            
            // Atualiza o conteúdo do elemento com o valor formatado
            if (valorTotal != null) {
                valorTotal.textContent = valorComEspaco;

            } else {
                valorTotal.textContent = ": R$ 0,00";
            }
        } else {
            // Caso o valor seja inválido ou indefinido, define o valor como "R$ 0,00"
            if (valorTotal != null) {
                valorTotal.textContent = ": R$ 0,00";
            }
        }
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
                    <div class="photo card-img" style="background-image:url(\${img})">
                        <!-- Controle de quantidade -->
                        <div onclick="loja.metodos.obterProdutosCarrinho()" class="quantity-control d-flex justify-content-center align-items-center" style="width: 100px">
                            <button class="btn-cart-control btn-subtract" onclick="loja.metodos.btnSubtract(\${id})">-</button>
                            <span class="quantity-label mx-2" id="quantity-label-\${id}">\${qtd}</span>
                            <button class="btn-cart-control btn-add" onclick="loja.metodos.btnAdd(\${id})">+</button>
                        </div>
                    </div>
                </div>
                <!-- Detalhes do produto -->
                <div class="description">
                    <!-- Nome do produto -->
                    <h6>\${name}</h6>
                    <!-- Informações do produto-->
                    <h2>Medida: \${medida}</h2>
                    <h2>Código: \${codigo}</h2>
                    <h2>Categoria: \${categoria}</h2>
                    <h2>Sub Categoria: \${sub_categoria}</h2>
                    <br>
                    <!-- Preço do produto -->
                    <p class="fw-bolder">
                        <h5>
                            <span class="price">
                                <span class="currency">R$</span>
                                <span class="value me-3" id="preco"> \${valorMetragem}</span>
                            </span>
                        </h5>
                    </p>
                    <!-- remoção ,'\${codigo}'-->
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