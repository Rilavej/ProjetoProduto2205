const produtos = []

const adicionarAoCarrinho = async (event,produtoId,corId) =>{
    event.preventDefault()

    //const corSelecionada = document.querySelector('input[name="coresIds[' + produtoId + ']"]:checked').getAttribute('data-cor');

    event.target.innerText = 'Adicionado'; 
    event.target.classList.remove('is-success');
    event.target.classList.add('is-disabled'); 
    event.target.style.pointerEvents = 'none'

    //produtos.push({produtoId,corSelecionada})
    produtos.push(produtoId)
    
    const finalizarPedidoBtn = document.getElementById('finalizarPedido');
    finalizarPedidoBtn.style.display = 'block';
}

const finalizarPedido = async (event) =>{
    event.preventDefault()

    try {
        let body = JSON.stringify({
            valor: 0,
            status: "",
            produtosIds: produtos
        })
        let resposta = await fetch("/pedidos/1",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body : body
        })
        let pedidoId = await resposta.json()
        alert(`Pedido nº ${pedidoId} efetuado com sucesso!`)
        window.location.href = `/pedidos/1/${pedidoId}`
        
    } catch (error) {
        alert('Erro ao finalizar o pedido:', error)
    }


    const corSelecionada = document.querySelector('input[name="coresIds[' + produtoId + ']"]:checked').getAttribute('data-cor');

    event.target.innerText = 'Adicionado'; 
    event.target.classList.remove('is-success');
    event.target.classList.add('is-disabled'); 
    event.target.style.pointerEvents = 'none'

    produtos.push({produtoId,corSelecionada})
    
    const finalizarPedidoBtn = document.getElementById('finalizarPedido');
    finalizarPedidoBtn.style.display = 'block';
}