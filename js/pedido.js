const STEPS = [
  {
    key: "Enviado",
    title: "Pedido enviado",
    desc: "Recebemos seu pedido. Em 10 segundos ele chega na cozinha.",
  },
  {
    key: "Cozinha",
    title: "Pedido chegou na cozinha",
    desc: "A equipe da cozinha recebeu a comanda e iniciou o preparo.",
  },
  {
    key: "em_entrega",
    title: "Pedido saiu para entrega",
    desc: "Preparo concluido. O pedido está indo até você.",
  },
  {
    key: "Entregue",
    title: "Pedido entregue",
    desc: "Entrega concluida. Bom apetite!",
  },
];

const STEP_INDEX = { enviado: 0, cozinha: 1, em_entrega: 2, entregue: 3 };

function money(value) {
  return (
    "R$ " +
    Number(value || 0)
      .toFixed(2)
      .replace(".", ",")
  );
}

function getOrders() {
  return JSON.parse(localStorage.getItem("burger_orders") || "[]");
}

function findOrder() {
  const id = localStorage.getItem("burger_track_id");
  const orders = getOrders();
  return orders.find((order) => order.id === id) || orders[0];
}

function getStatus(order) {
  const elapsed = Date.now() - order.createdAt;
  if (elapsed >= 30000)
    return { step: "entregue", secondsLeft: 0, title: "Pedido entregue" };
  if (elapsed >= 20000)
    return {
      step: "em_entrega",
      secondsLeft: Math.ceil((30000 - elapsed) / 1000),
      title: "Saiu para entrega",
    };
  if (elapsed >= 10000)
    return {
      step: "cozinha",
      secondsLeft: Math.ceil((20000 - elapsed) / 1000),
      title: "Preparando pedido",
    };
  return {
    step: "enviado",
    secondsLeft: Math.ceil((10000 - elapsed) / 1000),
    title: "Indo para a cozinha",
  };
}

function addressText(address) {
  if (!address) return "Endereco nao informado";
  return `${address.street}, ${address.number} - ${address.district}${address.complement ? " - " + address.complement : ""}`;
}

function render() {
  const order = findOrder();
  const card = document.getElementById("trackingCard");
  if (!order) {
    card.innerHTML = `
      <h1>Nenhum pedido encontrado</h1>
      <p style="color:var(--muted);margin-top:8px">Faca um pedido no cardapio para acompanhar a entrega.</p>
      <a class="small-btn red" style="display:inline-flex;margin-top:18px" href="cardapio.html">Abrir cardapio</a>
    `;
    return;
  }

  const status = getStatus(order);
  const currentIndex = STEP_INDEX[status.step];
  const currentStep = STEPS[currentIndex];

  card.innerHTML = `
    <span class="section-kicker">Pedido #${order.id}</span>
    <h1>Acompanhar entrega</h1>
    <div class="status-title">${status.title}</div>
    <p style="color:var(--muted)">${currentStep.desc}</p>
    ${status.secondsLeft ? `<p class="countdown" style="margin-top:10px">Proxima etapa em ${status.secondsLeft}s</p>` : ""}

    <div class="timeline">
      ${STEPS.map(
        (step, index) => `
        <div class="step ${index < currentIndex ? "done" : ""} ${index === currentIndex ? "current" : ""}">
          <div class="dot">${index < currentIndex ? "OK" : index + 1}</div>
          <div>
            <h3>${step.title}</h3>
            <p>${step.desc}</p>
          </div>
        </div>
      `,
      ).join("")}
    </div>

    <div class="order-summary">
      ${(order.items || [])
        .map(
          (item) => `
        <div class="summary-row"><span>${item.name} x${item.qty}</span><strong>${money(item.price * item.qty)}</strong></div>
      `,
        )
        .join("")}
      <div class="summary-row"><span>Pagamento</span><strong>${order.payment}</strong></div>
      <div class="summary-row"><span>Endereco</span><strong>${addressText(order.address)}</strong></div>
      <div class="summary-row"><span>Total</span><strong>${money(order.total)}</strong></div>
    </div>
  `;
}

render();
setInterval(render, 1000);
