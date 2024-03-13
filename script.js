let menu = document.getElementById('menu')
let cartBtn = document.getElementById('cart-btn')
let cartModal = document.getElementById('cart-modal')
let cartItensContainers = document.getElementById('cart-items')
let cartTotal = document.getElementById('cart-total')
let checkoutBtn = document.getElementById('checkout-btn')
let closeModalBtn = document.getElementById('close-modal-btn')
let cartCouter = document.getElementById('cart-count')
let addressInput = document.getElementById('address')
let addressWarn = document.getElementById('address-warn')

let cart = []

// abrir o modal do carrinho
cartBtn.addEventListener('click', () => {
  updateCartModal()
  cartModal.style.display = 'flex'
})

// fechar o modal quando clicar fora ou no botao de fechar
cartModal.addEventListener('click', (event) => {
  if (event.target === cartModal || event.target === closeModalBtn) {
    cartModal.style.display = 'none'
  }
})

// função para pegar nome e valor dos pedidos adicionados
menu.addEventListener('click', (event) => {
  const parentButton = event.target.closest('.add-to-cart-btn')
  let name = parentButton.getAttribute('data-name')
  let price = parseFloat(parentButton.getAttribute('data-price'))
  addToCart(name, price)
})

// função para adicionar item no carrinho
function addToCart(name, price) {
  let existingItem = cart.find(item => item.name === name)
  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      name,
      price,
      quantity: 1
    })
  }
  updateCartModal()
}

function updateCartModal() {
  cartItensContainers.innerHTML = ""
  let total = 0

  cart.forEach(item => {
    let cartItemElement = document.createElement('div')
    cartItemElement.classList.add('flex', 'justify-between', 'mb-5', 'flex-col')
    cartItemElement.innerHTML = `
    <div class="flex items-center justify-between mb-2">
      <div>
        <p class="font-medium">${item.name}</p>
        <p>Qtd: ${item.quantity}</p>
        <p class="font-medium mt-2">R$ ${item.price}</p>
      </div>
        <button class="remove-from-cart-btn" data-name="${item.name}">
          Remover
        </button>
    </div>
    `
    total += item.price * item.quantity
    cartItensContainers.appendChild(cartItemElement)
  })

  cartTotal.textContent = total.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })

  cartCouter.innerHTML = cart.length
}


// função para remover item do pedido
cartItensContainers.addEventListener('click', (event) => {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute('data-name')
    removeItemCart(name)
  }
})

function removeItemCart(name) {
  const index = cart.findIndex(item => item.name === name)
  if (index != -1) {

    let item = cart[index]

    if (item.quantity > 1) {
      item.quantity -= 1

      updateCartModal()
      return
    }
    cart.splice(index, 1)
    updateCartModal()
  }
}

addressInput.addEventListener('input', (event) => {
  let inputValue = event.target.value
  if (inputValue != "") {
    addressWarn.classList.add("hidden")
    addressInput.classList.remove("border-orange-100")
  }
})

checkoutBtn.addEventListener('click', () => {

  let isOpen = checkRestaurantOpen()
  if (!isOpen) {
    Toastify({
      text: "Ops, o restaurante esta fechado!!!",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4445",
      },
    }).showToast();
    return
  }

  if (cart.length == 0) return
  if (addressInput.value == "") {
    addressWarn.classList.remove("hidden")
    addressInput.classList.add("border-orange-100")
    return
  }

  const cartItems = cart.map(item => {
    return (
      `${item.name} Quantidade: ${item.quantity} Preço: R$${item.price}`
    )
  }).join(" | ")

  const message = encodeURIComponent(cartItems)
  const phone = "61999136697"
  window.open(`https://wa.me/${phone}/?text=${message} Endereco: ${addressInput.value}`, "_blank")

  cart = []
  addressInput.value = ""
  updateCartModal()
  setTimeout(() => {
    cartModal.style.display = 'none'
  }, 2000)
  
})

// verificar a hora e manipular o carde de horario
function checkRestaurantOpen() {
  const data = new Date()
  const hora = data.getHours()
  return hora > 18 && hora < 22
}

let spanItem = document.getElementById('date-span')
let isOpen = checkRestaurantOpen()

if (isOpen) {
  spanItem.classList.remove('bg-red-500')
  spanItem.classList.add('bg-green-500')
} else {
  spanItem.classList.remove('bg-green-500')
  spanItem.classList.add('bg-red-500')
}
