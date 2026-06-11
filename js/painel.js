function getOrders() {
  return JSON.parse(localStorage.getItem("burger_orders") || "[]");
}

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getStatus(order) {
  const elapsed = Date.now() - order.createdAt;
  if (elapsed >= 30000) return "Entregue";
  if (elapsed >= 20000) return "Saiu para entrega";
  if (elapsed >= 10000) return "Na cozinha / preparando";
  return "Pedido enviado";
}

function filterOrders(panel, orders) {
  if (panel === "cozinha") {
    return orders.filter(
      (order) =>
        Date.now() - order.createdAt >= 10000 &&
        Date.now() - order.createdAt < 20000,
    );
  }
  if (panel === "motoboy") {
    return orders.filter(
      (order) =>
        Date.now() - order.createdAt >= 20000 &&
        Date.now() - order.createdAt < 30000,
    );
  }
  return orders;
}

function titleFor(panel) {
  return (
    {
      gerente: "Painel do Gerente",
      cozinha: "Painel da Cozinha",
      motoboy: "Painel do Motoboy",
    }[panel] || "Painel"
  );
}

function emptyText(panel) {
  return (
    {
      gerente: "Nenhum pedido recebido ainda.",
      cozinha: "Nenhum pedido na cozinha agora.",
      motoboy: "Nenhuma entrega disponivel agora.",
    }[panel] || "Nenhum pedido."
  );
}

function salesTotal(orders) {
  const total = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0,
  );
  return total || 155000;
}

function renderSpark(points) {
  return `
    <svg class="spark" viewBox="0 0 260 44" aria-hidden="true">
      <polyline points="${points}" fill="none" stroke="#23f0b5" stroke-width="2" />
    </svg>
  `;
}

function renderLineChart() {
  return `
    <svg class="manager-line-chart" viewBox="0 0 900 230" role="img" aria-label="Grafico de faturamento diario">
      <g class="grid-lines">
        <line x1="50" y1="30" x2="870" y2="30" />
        <line x1="50" y1="75" x2="870" y2="75" />
        <line x1="50" y1="120" x2="870" y2="120" />
        <line x1="50" y1="165" x2="870" y2="165" />
        <line x1="50" y1="210" x2="870" y2="210" />
        <line x1="50" y1="30" x2="50" y2="210" />
        <line x1="187" y1="30" x2="187" y2="210" />
        <line x1="324" y1="30" x2="324" y2="210" />
        <line x1="461" y1="30" x2="461" y2="210" />
        <line x1="598" y1="30" x2="598" y2="210" />
        <line x1="735" y1="30" x2="735" y2="210" />
        <line x1="870" y1="30" x2="870" y2="210" />
      </g>
      <g class="axis-labels">
        <text x="18" y="214">0</text><text x="10" y="169">2000</text><text x="10" y="124">4000</text><text x="10" y="79">6000</text><text x="10" y="34">8000</text>
        <text x="45" y="228">01</text><text x="182" y="228">05</text><text x="319" y="228">10</text><text x="456" y="228">15</text><text x="593" y="228">20</text><text x="730" y="228">25</text><text x="862" y="228">30</text>
      </g>
      <polyline points="50,118 187,98 324,70 461,82 598,58 735,50 870,66" fill="none" stroke="#ff2638" stroke-width="3" />
      <polyline points="50,128 187,112 324,82 461,96 598,75 735,65 870,80" fill="none" stroke="#b8ada0" stroke-width="2" stroke-dasharray="5 5" />
      <g fill="#ff2638" stroke="#fff" stroke-width="1.5">
        <circle cx="50" cy="118" r="4" /><circle cx="187" cy="98" r="4" /><circle cx="324" cy="70" r="4" /><circle cx="461" cy="82" r="4" /><circle cx="598" cy="58" r="4" /><circle cx="735" cy="50" r="4" /><circle cx="870" cy="66" r="4" />
      </g>
      <g fill="#b8ada0">
        <circle cx="50" cy="128" r="3" /><circle cx="187" cy="112" r="3" /><circle cx="324" cy="82" r="3" /><circle cx="461" cy="96" r="3" /><circle cx="598" cy="75" r="3" /><circle cx="735" cy="65" r="3" /><circle cx="870" cy="80" r="3" />
      </g>
    </svg>
    <div class="chart-legend"><span><i class="red-dot"></i>Periodo Atual</span><span><i class="gray-dot"></i>Periodo Anterior</span></div>
  `;
}

function renderBars() {
  const groups = [
    [72, 96, 86],
    [116, 146, 136],
    [98, 126, 116],
    [88, 110, 96],
    [136, 166, 146],
    [126, 156, 136],
    [96, 126, 106],
  ];
  return `
    <div class="bar-chart" aria-label="Vendas por horario">
      ${groups
        .map(
          (group, index) => `
        <div class="bar-group">
          ${group.map((height, barIndex) => `<span class="bar bar-${barIndex + 1}" style="height:${height}px"></span>`).join("")}
          <strong>${["11h", "12h", "13h", "18h", "19h", "20h", "21h"][index]}</strong>
        </div>
      `,
        )
        .join("")}
    </div>
    <div class="chart-legend"><span><i class="red-dot"></i>Sexta</span><span><i class="pink-dot"></i>Sabado</span><span><i class="soft-dot"></i>Domingo</span></div>
  `;
}

function renderManagerDashboard() {
  const orders = getOrders();
  const gross = salesTotal(orders);
  const net = gross * 0.7;
  const averageTicket = orders.length ? gross / orders.length : 125;
  const activeClients = Math.max(
    71,
    new Set(orders.map((order) => order.cliente)).size,
  );
  const container = document.getElementById("managerDashboard");

  container.innerHTML = `
    <aside class="manager-sidebar">
      <a class="manager-brand" href="gerente.html">
        <img src="../img/logo.svg" alt="">
        <span><strong>BBQ PARRILA</strong><small>Dashboard</small></span>
      </a>
      <nav class="manager-menu" aria-label="Menu do gerente">
        <a class="active" href="#overview">Overview</a>
        <a href="#vendas">Vendas</a>
        <a href="#operacional">Operacional</a>
        <a href="#estoque">Estoque</a>
        <a href="#clientes">Clientes</a>
        <a href="#configuracoes">Configuracoes</a>
      </nav>
      <a class="manager-logout" href="../index.html">Sair</a>
    </aside>

    <section class="manager-content">
      <header class="manager-header">
        <div>
          <h1>Overview</h1>
          <p>Painel de Controle Gerencial</p>
        </div>
        <div class="manager-user">
          <select aria-label="Periodo">
            <option>Mes Atual</option>
            <option>Semana Atual</option>
            <option>Ano Atual</option>
          </select>
          <span><strong>Andre</strong><small>Gerente</small></span>
          <b>A</b>
        </div>
      </header>

      <div class="period-tabs" role="tablist" aria-label="Periodo dos indicadores">
        <button>Dia</button><button>Semana</button><button class="active">Mes</button><button>Ano</button>
      </div>

      <section class="metric-grid" id="overview">
        <article class="manager-card metric-card">
          <span>Faturamento Bruto</span>
          <strong>${money(gross)}</strong>
          <em class="up">+ 3.5%</em>
          ${renderSpark("0,34 44,30 88,24 132,26 176,20 220,19 260,22")}
        </article>
        <article class="manager-card metric-card">
          <span>Faturamento Liquido</span>
          <strong>${money(net)}</strong>
          <em class="up">+ 2.8%</em>
          ${renderSpark("0,35 44,32 88,26 132,29 176,24 220,22 260,25")}
        </article>
        <article class="manager-card metric-card">
          <span>CMV</span>
          <strong>32.5%</strong>
          <em class="down">- 1.2%</em>
          <div class="progress"><span style="width:67%"></span></div>
        </article>
        <article class="manager-card metric-card">
          <span>Ticket Medio</span>
          <strong>${money(averageTicket)}</strong>
          <em class="up">+ 4.1%</em>
          ${renderSpark("0,34 44,30 88,24 132,26 176,20 220,19 260,22")}
        </article>
      </section>

      <section class="dashboard-grid">
        <article class="manager-card chart-card wide" id="vendas">
          <h2>Faturamento Diario</h2>
          ${renderLineChart()}
        </article>
        <article class="manager-card chart-card">
          <h2>Mix de Canais</h2>
          <div class="donut-wrap">
            <div class="donut"></div>
            <div class="channel-list">
              <span><i class="orange-dot"></i>iFood <strong>58%</strong></span>
              <span><i class="gold-dot"></i>99food <strong>42%</strong></span>
            </div>
          </div>
        </article>
        <article class="manager-card list-card">
          <h2>Curva ABC - Top Produtos</h2>
          <ol class="rank-list">
            <li><b>1</b><span><strong>Burger Classico</strong><small>342 vendas</small></span><em>R$ 11251.80<small class="up">+ 8.5%</small></em></li>
            <li><b>2</b><span><strong>Bacon Burger</strong><small>289 vendas</small></span><em>R$ 11242.10<small class="up">+ 5.2%</small></em></li>
            <li><b>3</b><span><strong>Double Smash</strong><small>254 vendas</small></span><em>R$ 10896.60<small class="danger">- 2.1%</small></em></li>
          </ol>
        </article>
        <article class="manager-card list-card" id="estoque">
          <h2>Nivel de Estoque Critico</h2>
          <div class="stock-list">
            ${[
              ["Carne Bovina", "12 kg", "24%"],
              ["Bacon", "8 kg", "40%"],
              ["Queijo Cheddar", "15 kg", "50%"],
              ["Pao Brioche", "25 un", "25%"],
            ]
              .map(
                (item) => `
              <div class="stock-item">
                <span><strong>${item[0]}</strong><b>${item[1]}</b></span>
                <div class="stock-bar"><i style="width:${item[2]}"></i></div>
              </div>
            `,
              )
              .join("")}
          </div>
        </article>
        <article class="manager-card chart-card wide" id="operacional">
          <h2>Vendas por Horario</h2>
          ${renderBars()}
        </article>
        <article class="manager-card operation-card">
          <h2>Eficiencia Operacional</h2>
          <div class="gauge"><span>87</span></div>
          <div class="operation-list">
            <span>Tempo Preparo <strong>14 min</strong></span>
            <span>Retencao <strong>65%</strong></span>
            <span>Clientes Ativos <strong>${activeClients}</strong></span>
          </div>
        </article>
        <article class="manager-card big-number" id="clientes">
          <h2>Novos Clientes</h2>
          <strong>${activeClients}</strong>
          <span>Este mes</span>
          <em class="up">+ 12.3%</em>
        </article>
        <article class="manager-card big-number" id="configuracoes">
          <h2>Taxa de Retencao</h2>
          <strong>65%</strong>
          <span>LTV medio</span>
          <em class="up">+ 5.1%</em>
        </article>
      </section>
    </section>
  `;
}

function renderPanel() {
  const panel = document.body.dataset.panel;
  if (panel === "gerente") {
    renderManagerDashboard();
    return;
  }

  const orders = filterOrders(panel, getOrders());
  const card = document.getElementById("panelCard");

  card.innerHTML = `
    <span class="section-kicker">${titleFor(panel)}</span>
    <h1>${titleFor(panel)}</h1>
    <div class="order-summary" style="margin-top:18px">
      ${
        orders.length
          ? orders
              .map(
                (order) => `
        <div class="summary-row"><span>#${order.id}</span><strong>${getStatus(order)}</strong></div>
        <div class="summary-row"><span>Cliente</span><strong>${order.cliente}</strong></div>
        <div class="summary-row"><span>Pagamento</span><strong>${order.payment}</strong></div>
        <div class="summary-row"><span>Total</span><strong>${money(order.total)}</strong></div>
        <hr style="border:0;border-top:1px solid var(--border);margin:10px 0">
      `,
              )
              .join("")
          : `<div class="empty">${emptyText(panel)}</div>`
      }
    </div>
  `;
}

renderPanel();
if (document.body.dataset.panel !== "gerente") {
  setInterval(renderPanel, 1000);
}
