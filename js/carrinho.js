// Objeto para gerenciar o carrinho de compras
var carrinhoDeCompras = {
    itens: [],

    // Adicionar um item ao carrinho
    adicionarItem: function(novoItem) {
        // Carrega os itens atuais do carrinho
        carrinhoDeCompras.carregarCarrinho();
    
        // Procura o item no carrinho pelo ID e código
        let itemExistente = this.itens.find(item => item.id === novoItem.id && item.codigo === novoItem.codigo);
    
        if (itemExistente) {
            // Se o item já existe, aumenta a quantidade
            itemExistente.quantidade += novoItem.quantidade;
        } else {
            // Caso contrário, adiciona como um novo item
            this.itens.push(novoItem);
        }
    
        // Salva o carrinho atualizado
        this.salvarCarrinho();
        this.atualizarCarrinho();
    },
    
    // Remover um item do carrinho
    removerItem: function(id) {
        // Procura o índice do item no carrinho pelo ID e código
        let index = this.itens.findIndex(item => item.id === id);
    
        if (index !== -1) {
            // Remove o item pelo índice
            this.itens.splice(index, 1);
            this.salvarCarrinho();
            this.atualizarCarrinho();
        } else {
            console.error(`Item não encontrado para remover: ID ${id}`);
        }
    },

    // Alterar a quantidade de um item no carrinho
    alterarQuantidade: function(id, novaQuantidade) {
        // Procura o item no carrinho pelo ID e código
        
        let item = this.itens.find(item => item.id === id);
        console.log("item: ", this.itens.indexOf(item => item.id === id));
        console.log("itens: ", this.itens);
        console.log("id_: ", id);
        if (item) {
            // Atualiza a quantidade
            item.quantidade = novaQuantidade;
            this.salvarCarrinho();
            this.atualizarCarrinho();
        } else {
            console.error(`Item não encontrado para alterar a quantidade: ID ${id}`);
        }
    },

    // Calcular o total do carrinho
    calcularTotal: function() {
        let total = 0;
        this.itens.forEach(function(item) {
            total += (item.preco * item.quantidade)// * item.metragemSelect;  Calcula o valor total
            //total += parseFloat(item.preco.replace(',', '.')) * item.quantidade;
        });
        console.log("teste >>>>>>", total.toFixed(2))
        total = total.toFixed(2);
        return total;
    },

    calcularTotalQuantidade: function() {
        let total = this.itens.length;
        document.getElementById('badgeCart').innerText = this.itens.length; // Redireciona a quant. de itens no carrinho para o id="badgeCart"
        return total;
    },

    // Atualizar o carrinho na interface do usuário
    atualizarCarrinho: function() {
        // Aqui você pode implementar a lógica para atualizar a interface do carrinho na sua página HTML
        // Por exemplo, atualizar a lista de itens, exibir o total, etc.
        console.log("Carrinho atualizado: ", this.itens);
        console.log("Carrinho Quantidade : ", this.itens.length);
    },

    // Salvar o carrinho no sessionStorage
    salvarCarrinho: function() {
        //let carrinhoExistente = sessionStorage.getItem('carrinho');
        //let dadosExistente = carrinhoExistente ? JSON.parse(carrinhoExistente) : [];
        //let dadosCompletos = dadosExistente.concat(this.itens);
        //sessionStorage.setItem('carrinho', JSON.stringify(dadosCompletos));

        sessionStorage.setItem('carrinho', JSON.stringify(this.itens));
    },

    // Carregar o carrinho do sessionStorage
    carregarCarrinho: function() {
        let carrinhoSalvo = sessionStorage.getItem('carrinho');
        if (carrinhoSalvo) {
            this.itens = JSON.parse(carrinhoSalvo);
            //this.atualizarCarrinho();
            
        }
    }
};

// Exemplo de uso:
// Suponha que você tenha um item do MENU que você deseja adicionar ao carrinho
//var itemParaAdicionar = MENU[0]; // Suponha que queremos adicionar o primeiro item do MENU
//carrinhoDeCompras.adicionarItem({
//    id: itemParaAdicionar.id,
//    nome: itemParaAdicionar.name,
//    preco: itemParaAdicionar.preco,
//    quantidade: 1 // Quantidade inicial
//});

// Exemplo de como remover um item do carrinho
// Suponha que você queira remover o primeiro item do carrinho
//carrinhoDeCompras.removerItem(0);

// Exemplo de como alterar a quantidade de um item no carrinho
// Suponha que você queira alterar a quantidade do primeiro item para 3
//carrinhoDeCompras.alterarQuantidade(0, 3);

// Exemplo de como calcular o total do carrinho
//console.log("Total do carrinho:", carrinhoDeCompras.calcularTotal());

// Exemplo de como salvar o carrinho no sessionStorage
//carrinhoDeCompras.salvarCarrinho();

// Exemplo de como carregar o carrinho do sessionStorage
//carrinhoDeCompras.carregarCarrinho();
