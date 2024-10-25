document.addEventListener("DOMContentLoaded", function() {
    loja.eventos.init();
});

const button = document.getElementById("float-button-carrinho");
button.onclick = function() {
    window.location.href = "carrinho.html";
};

window.onscroll = function() {
    var header = document.getElementById("filtro"); // Barra-Fixa da navbar id='fildro'
    var sticky = header.offsetTop; // Barra-Fixa

    var floatButton = document.querySelector('.float-button');
    if (document.documentElement.scrollTop > 165 && window.pageYOffset > sticky) { // Exibe o botão após rolar 200px
        floatButton.style.display = 'block'; // Botao carrinho float (habilitado)
        header.classList.add("sticky"); // Navbar fixa (Ativado)
    } else {
        floatButton.style.display = 'none'; // Botao carrinho float (desabilitado)
        header.classList.remove("sticky"); // Navbar fixa (Desativado)
    }
};

// -------------- CAROUSEL-FUNCTION ---------------- 
//               Manual e Automático
let slideIndex = 0;
let autoSlide;  // Variável para controlar o intervalo automático

// Inicia o carousel
showSlides();

// Função para alterar para o slide atual, chamado ao clicar no ponto
function currentSlide(n) {
  clearTimeout(autoSlide); // Para a troca automática quando o usuário clica manualmente
  showSlides(slideIndex = n);
}

// Função principal que mostra os slides
function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");

  // Se nenhum valor for passado para `n`, ele incrementa o slideIndex
  if (n === undefined) {
    slideIndex++;
  }

  // Reseta o índice quando chegar ao último slide
  if (slideIndex > slides.length) { slideIndex = 1 }
  if (slideIndex < 1) { slideIndex = slides.length }

  // Esconde todos os slides
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }

  // Remove a classe 'active' de todos os pontos
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  // Mostra o slide atual e adiciona 'active' ao ponto correspondente
  slides[slideIndex - 1].style.display = "block";  
  dots[slideIndex - 1].className += " active";

  // Reinicia o auto slide após 2 segundos
  autoSlide = setTimeout(showSlides, 3000);  // Troca de imagem a cada 2 segundos
}
// ---------------- END-CAROUSEL-FUNCTION ----------------


var itemExibidosNoMenu = [];
var loja = {};
loja.eventos = {
    init: () => {
        console.log("Função init está sendo chamada.");
        carrinhoDeCompras.carregarCarrinho();
        loja.metodos.atualizarBadge(carrinhoDeCompras.calcularTotalQuantidade());
        loja.metodos.obterItensLojaInicio();
        loja.metodos.verMais();
    }
}


loja.metodos = {

    obterItensLojaInicio:() =>{
        itemExibidosNoMenu = MENU;
        $("#itensProdutos").html('');
        loja.metodos.obterItensLoja();
    },

    feedBackBuscaFalha:() =>{
        // Limpa o conteúdo antes de adicionar os itens
        $("#itensProdutos").html('');
        $("#itensProdutos").append(loja.templates.feedbackBusca);

        $("#btnVerMais").addClass('collapse');
        //$("#btnVerMais").classList.remove('show')
    },


    obterItensLoja:(busca=false) =>{

        // Limpa o conteúdo antes de adicionar os itens
        if(busca){
            $("#itensProdutos").html('');
        }

        tamanhoDaListagem = itemExibidosNoMenu.length;
        console.log("Tamanho da listagem", tamanhoDaListagem);
        console.log("Filhos da div ", $("#itensProdutos").children().length);
        var lastIndex = $("#itensProdutos").children().length;
        console.log('Ultimo index exibido -> ',lastIndex);

        for (var i = lastIndex; i < tamanhoDaListagem && i < lastIndex + 25; i++) {
            
            //Dessa forma o R$ fica na frente do valor do produto
            let preco = itemExibidosNoMenu[i].price.toFixed(2).replace('.', ',');
            let temp = loja.templates.item
                .replace(/\${img}/g, itemExibidosNoMenu[i].img)
                .replace(/\${name}/g, itemExibidosNoMenu[i].name)
                .replace(/\${id}/g, itemExibidosNoMenu[i].id)
                .replace(/\${price-show}/g, preco)
                .replace(/\${price}/g, itemExibidosNoMenu[i].price)
                .replace(/\${marca}/g, itemExibidosNoMenu[i].marca)
                .replace(/\${largura}/g, itemExibidosNoMenu[i].largura)
                
    
            // Adiciona os itens ao #itensProdutos
            

            //imagemExiste(itemExibidosNoMenu[i].img)
            //    .then(existe => {
            //        if (existe) {
            //            if(itemExibidosNoMenu[i].img ==="assets/img_produtos/"){
            //                console.log('A imagem não existe.');
            //            }else
            //                console.log('A imagem existe.');
            $("#itensProdutos").append(temp);
            //        } else {
            //            console.log('A imagem não existe.');
            //            // Faça algo se a imagem não existir
            //        }
            //    });

        }

        lastIndex = $("#itensProdutos").children().length;
        console.log("Momento de atribuição", lastIndex);



        if (lastIndex === tamanhoDaListagem) {
            console.log("Ocultou o botão ver mais ->");
            console.log("Ocultou o botão ver mais -> Ultimo indice ", lastIndex);
            console.log("Ocultou o botão ver mais -> Tamanho da listagem", tamanhoDaListagem);
            $("#btnVerMais").addClass('collapse');
        }else{
            let btnVerMais = document.getElementById("btnVerMais");
            btnVerMais.classList.remove("collapse");
            // $("#btnVerMais").remove('collapse');
        }

    },

    verMais: () => {

       loja.metodos.obterItensLoja();

    },

    obterItensPorTag: ( value ) => {
        var categorias, sub_categoria = []
        switch (value) {
            case 1:
                categorias = ['MADEIRAS'];
              break;

            case 2:
                categorias =['PEDRAS'];
              break;

            case 3:
                categorias = ['METAL'];
            break;

            case 4:
                categorias = ['TELADO'];
            break;

            case 5:
                categorias = ['PISOMAX'];
            break;

            case 6:
                categorias = ['DIVERSOS'];
            break;

            default:
          }

        dadosFiltrados = MENU.filter(item => categorias.includes(item.categoria));
        console.log("tags chegando ", categorias);

        console.log("resultado ", dadosFiltrados);
        
        //if (!Array.isArray(categorias)) {
        //    categorias = [categorias];
        //}

        if(dadosFiltrados.length == 0){
            loja.metodos.feedBackBuscaFalha();
        }else{
            itemExibidosNoMenu = dadosFiltrados;
            loja.metodos.obterItensLoja(true);
        }

    },

    obterItensPorPesquisa: ( ) => {

        var pesquisa = $("#inputPesquisa").val();
        console.log("Teste da pesquisa ", pesquisa);

        resultados = buscarComTratamento(pesquisa);

        console.log("resultado da pesquisa", resultados);

        if(resultados != [] && resultados != false){

            console.log("resultado da pesquisa", resultados);
            
            itemExibidosNoMenu = resultados;
            
            loja.metodos.obterItensLoja(true);
            
        }else{
            loja.metodos.feedBackBuscaFalha();
        }
        
    },

    verPaginaDoItem: (value) =>{
        console.log(value);
        sessionStorage.setItem('item_data', value);
    },

    atualizarBadge:(value) =>{
        var badgeSpan = document.getElementById('badgeCart');
        var badgeSpanFloat = document.getElementById('badgeCartFloat');
        badgeSpan.textContent = value;
        badgeSpanFloat.textContent = value;
    },

    btnSubtract:() =>{
        
    }

}


// Função de busca com tratamento na string de busca
function buscarComTratamento(termo) {
    // Verificar se o termo de busca é uma string não vazia e válida
    if (typeof termo !== 'string' || termo.trim() === '') {
      console.log("Termo de busca inválido ou vazio.");
      return []; // Retorna uma lista vazia se o termo de busca for inválido ou vazio
    }
  
    // Normalizar e converter para minúsculas o termo de busca
    termo = termo.normalize("NFD").toLowerCase();
  
    // Se o termo de busca for válido, proceder com a busca
    return MENU.filter(item => {
      // Verificar se o termo está contido em qualquer uma das propriedades do objeto
      for (let propriedade in item) {
        if (Object.prototype.hasOwnProperty.call(item, propriedade)) {
          // Verificar se o valor da propriedade é uma string antes de chamar toLowerCase()
          if (typeof item[propriedade] === 'string') {
            // Normalizar e converter para minúsculas a string da propriedade
            let propriedadeNormalizada = item[propriedade].normalize("NFD").toLowerCase();
            // Verificar se o termo está contido na string da propriedade normalizada
            if (propriedadeNormalizada.includes(termo)) {
              return true; // Se o termo for encontrado em qualquer propriedade, retornar true
            }
          }
        }
      }
      return false; // Se o termo não for encontrado em nenhuma propriedade, retornar false
    });
  }
  

async function imagemExiste(url) {
    try {
        const response = await fetch(url);
        return response.ok;
    } catch (error) {
        return false;
    }
}

function closeOtherSubMenus(currentSubMenu) {
    categoryItems.forEach(function(categoryItem) {
      const subCategoryList = categoryItem.querySelector('.sub-category-list');
      if (subCategoryList !== currentSubMenu && subCategoryList.classList.contains('show')) {
        subCategoryList.classList.remove('show');
      }
    });
  }


loja.templates = {

    item: `
        
        <div class="col mb-5">
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
                            <span class="value">\${price-show}</span>
                        </span>
                    </div>
                </div>
                <!-- Product actions-->
                <div class="card-footer p-3 pt-0 border-top-0 bg-transparent">
                    <div class="text-center">
                    <a class="custom-button mt-auto" href="item.html"onclick="loja.metodos.verPaginaDoItem(['\${img}','\${name}','\${id}','\${price}','\${marca}','\${largura}'])"
                    >Comprar</a></div>
                </div>
            </div>
        </div>
    `,

    feedbackBusca:`
    <div class="feedback-busca-no-items">
        <p>Nenhum item encontrado na busca.</p>
        <div style="display: flex; justify-content: center; align-items: center">
                <button class="btn btn-outline-dark mt-auto " type="submit" onclick="loja.metodos.obterItensLojaInicio()">
                    <i class="bi bi-arrow-clockwise me-1"></i>
                    Voltar a ver todas as categorias 
                </button>
        </div>
    </div>
    `

}

function showDropdown() {
    $("#dropdown-menu").addClass('show');
    //dropdownMenu.addClass("show");
}


document.addEventListener("DOMContentLoaded", function() {
    // Botão que controla o dropdown
    var dropdownButton = document.getElementById("ver_mais_link");
    // Dropdown menu
    var dropdownMenu = document.getElementById("dropdown-menu");
    // Função para exibir o dropdown
    var checkboxStates = {}; // Objeto para armazenar os estados dos checkboxes

    // Função para salvar o estado dos checkboxes
    function saveCheckboxStates() {
        categoryItems.forEach(function(item) {
            var subCategoryList = item.querySelector(".sub-category-list");
            var category = item.querySelector(".category").textContent;
            checkboxStates[category] = {}; // Criando um objeto para armazenar o estado dos checkboxes da categoria

            var checkboxes = subCategoryList.querySelectorAll("input[type='checkbox']");
            checkboxes.forEach(function(checkbox, index) {
                checkboxStates[category][index] = checkbox.checked; // Salvando o estado do checkbox
            });
        });
    }

    // Função para restaurar o estado dos checkboxes
    function restoreCheckboxStates() {
        categoryItems.forEach(function(item) {
            var subCategoryList = item.querySelector(".sub-category-list");
            var category = item.querySelector(".category").textContent;

            if (checkboxStates[category]) { // Verifica se há um estado salvo para a categoria
                var checkboxes = subCategoryList.querySelectorAll("input[type='checkbox']");
                checkboxes.forEach(function(checkbox, index) {
                    if (checkboxStates[category][index] !== undefined) { // Verifica se o estado foi salvo para o checkbox
                        checkbox.checked = checkboxStates[category][index]; // Restaura o estado do checkbox
                    }
                });
            }
        });
    }


    function showDropdown() {
        dropdownMenu.classList.add("show");
        //resetDropdown();
    }

    // Função para ocultar o dropdown
    function hideDropdown() {
        dropdownMenu.classList.remove("show");
        resetDropdown();
    }
    document.addEventListener("DOMContentLoaded", function() {
        dropdownButton.addEventListener("click", function(event) {
            event.stopPropagation(); 
            dropdownMenu.classList.contains("show") ? hideDropdown() : showDropdown();
            if (!dropdownMenu.classList.contains("show")) { // Salvando o estado dos checkboxes ao fechar o dropdown
                saveCheckboxStates();
            } else { // Restaurando o estado dos checkboxes ao abrir o dropdown
                restoreCheckboxStates();
            }
        });
    });

    // Evento de clique fora do dropdown para fechá-lo
    document.addEventListener("DOMContentLoaded", function() {
        document.addEventListener("click", function(event) {
            if (!dropdownMenu.contains(event.target) && !dropdownButton.contains(event.target)) {
                hideDropdown();
            }
        });
    });



    // Evento de clique nas categorias para exibir/ocultar as subcategorias
    var categoryItems = document.querySelectorAll(".category-item");

    // Fechamento das categorias abertas para restalrar 
    

    categoryItems.forEach(function(item) {
        var category = item.querySelector(".category");
        var subCategoryList = item.querySelector(".sub-category-list");
        var verTodos = item.querySelector(".ver-todos"); // Selecionando o elemento "Ver Todos"

        categoryItems.forEach(function(otherItem) {
            if (otherItem !== item) {
                otherItem.querySelector(".sub-category-list").classList.add("collapsed");
            }
        });

        category.addEventListener("click", function() {
            // Fecha todas as outras subcategorias
            categoryItems.forEach(function(otherItem) {
                if (otherItem !== item) {
                    otherItem.querySelector(".sub-category-list").classList.add("collapsed");
                }
            });
            // Exibe ou oculta a subcategoria clicada
            subCategoryList.classList.toggle("collapsed");
        });

        if (verTodos) {
            var checkboxes = subCategoryList.querySelectorAll("input[type='checkbox']");
            var allChecked = false; // Variável para rastrear se todos os itens estão selecionados
        
            verTodos.addEventListener("click", function() {
                // Verifica se todos os checkboxes estão marcados
                allChecked = Array.from(checkboxes).every(function(checkbox) {
                    return checkbox.checked;
                });
        
                // Se todos estiverem marcados, desmarca todos; caso contrário, seleciona todos
                checkboxes.forEach(function(checkbox) {
                    checkbox.checked = !allChecked;
                });
            });
        }
    });

    function resetDropdown() {
        // Fecha todas as categorias
        categoryItems.forEach(function(item) {
            var subCategoryList = item.querySelector(".sub-category-list");
            subCategoryList.classList.add("collapsed");
        });
    }
});


// Função para transformar as subcategorias selecionadas
function transformarSelecao(dadosSelecionados) {
    // Expressão regular para remover acentos
    const removerAcentos = function(s) {
        return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    // Transforma os dados em maiúsculas e remove os acentos
    return dadosSelecionados.map(function(dado) {
        return removerAcentos(dado.toUpperCase());
    });
}

function removerAcentos(texto) {
    const mapaAcentosHex = {
      a: /[\xE0-\xE6]/g,
      e: /[\xE8-\xEB]/g,
      i: /[\xEC-\xEF]/g,
      o: /[\xF2-\xF6]/g,
      u: /[\xF9-\xFC]/g,
      c: /\xE7/g,
      n: /\xF1/g
    };
  
    for (let letra in mapaAcentosHex) {
      const expressaoRegular = mapaAcentosHex[letra];
      texto = texto.replace(expressaoRegular, letra);
    }
  
    return texto.toUpperCase();
  }


// Função para construir o objeto com as categorias e suas subcategorias
function getCategoriasSelecionadas() {
    var categoriasSelecionadas = {}; // Objeto para armazenar as categorias e suas subcategorias

    // Obtém todas as categorias selecionadas
    var categoryItems = document.querySelectorAll(".category-item input[type='checkbox']:checked");

    // Percorre as categorias selecionadas
    categoryItems.forEach(function(checkbox) {
        var category = checkbox.closest('.category-item').querySelector('.category').textContent.trim().toUpperCase(); // Obtém o texto da categoria em maiúsculas
        var subcategories = Array.from(checkbox.closest('.category-item').querySelectorAll("input[type='checkbox']:checked")).map(function(subCheckbox) {
            return subCheckbox.parentNode.textContent.trim();
        });

        categoriasSelecionadas[removerAcentos(category)] = transformarSelecao(subcategories); // Adiciona a categoria e suas subcategorias ao objeto
    });

    // Retorna o objeto com as categorias e suas subcategorias
    return categoriasSelecionadas;
}

// Função para filtrar a base de dados com base nas categorias e subcategorias selecionadas
function filtrarBaseDeDados(categoriasSelecionadas) {
    var filteredData = [];

    MENU.forEach(function(item) {
        // Verifica se a categoria do item está presente nos itens selecionados
        var categoria = removerAcentos(item.categoria);
        if (categoriasSelecionadas[categoria]) {
            // Verifica se alguma das subcategorias do item está presente nas subcategorias selecionadas da categoria
            var subcategorias = categoriasSelecionadas[categoria];
            var subcategoriasItem = removerAcentos(item.sub_categoria);
            if (subcategorias.includes(subcategoriasItem)) {
                filteredData.push(item); // Adiciona o item filtrado ao array
            }
        }
    });

    // Retorna os itens filtrados
    return filteredData;
}
