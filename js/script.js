const demoUsers = {
  cliente: {
    email: "cliente@bbq-parrila.com",
    senha: "123456",
    destino: "pages/cardapio.html",
    label: "Area do Cliente",
  },
  gerente: {
    email: "gerente@bbq-parrila.com",
    senha: "123456",
    destino: "pages/gerente.html",
    label: "Area do Gerente",
  },
  cozinha: {
    email: "cozinha@bbq-parrila.com",
    senha: "123456",
    destino: "pages/cozinha.html",
    label: "Area da Cozinha",
  },
  motoboy: {
    email: "motoboy@bbq-parrila.com",
    senha: "123456",
    destino: "pages/motoboy.html",
    label: "Area do Motoboy",
  },
};

let currentRole = "cliente";

function setRole(role) {
  currentRole = role;
  document.querySelectorAll(".role-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.role === role);
  });
  document.getElementById("roleBadge").textContent = demoUsers[role].label;
}

function showAlert(message) {
  const alert = document.getElementById("loginAlert");
  alert.textContent = message;
  alert.classList.add("show");
}

function togglePassword(button) {
  const input = document.getElementById(button.dataset.passwordTarget);
  const showing = input.type === "text";
  input.type = showing ? "password" : "text";
  button.textContent = showing ? "Ver" : "Ocultar";
}

document.querySelectorAll(".role-btn").forEach((btn) => {
  btn.addEventListener("click", () => setRole(btn.dataset.role));
});

document.querySelectorAll("[data-password-target]").forEach((btn) => {
  btn.addEventListener("click", () => togglePassword(btn));
});

document.getElementById("fillDemoBtn").addEventListener("click", () => {
  const user = demoUsers[currentRole];
  document.getElementById("loginEmail").value = user.email;
  document.getElementById("loginPassword").value = user.senha;
});

document.getElementById("loginBtn").addEventListener("click", () => {
  const email = document
    .getElementById("loginEmail")
    .value.trim()
    .toLowerCase();
  const senha = document.getElementById("loginPassword").value;
  const user = demoUsers[currentRole];

  if (email !== user.email || senha !== user.senha) {
    showAlert("Use o login demo deste perfil ou confira e-mail e senha.");
    return;
  }

  localStorage.setItem(
    "burger_current_user",
    JSON.stringify({ role: currentRole, email, nome: user.label }),
  );
  window.location.href = user.destino;
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") document.getElementById("loginBtn").click();
});
