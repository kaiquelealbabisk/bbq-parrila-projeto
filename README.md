# Projeto Dark Kitchen

Este é um sistema front-end estático desenvolvido para simular uma hamburgueria no conceito de *dark kitchen*. O projeto foca na experiência do usuário e na visualização do fluxo de pedidos, desde a seleção dos itens no cardápio até o acompanhamento da entrega.

## Tecnologias Utilizadas

- **HTML5**: Estrutura e conteúdo das páginas web.
- **CSS3**: Estilização e responsividade da interface.
- **JavaScript**: Lógica de interação, gerenciamento de pedidos e simulação de rastreamento.

## Estrutura do Projeto

A estrutura de pastas foi organizada para facilitar a navegação e manutenção do código:

```
.github/
  workflows/             # Fluxos de trabalho do GitHub Actions (ex: CI/CD)
public/
  css/                   # Arquivos CSS principais (reset, style, responsive)
  img/                   # Imagens do projeto (logo, produtos)
  js/                    # Arquivos JavaScript principais (carrinho, painel, pedido, script)
  pages/                 # Páginas HTML secundárias (cardapio, cozinha, gerente, motoboy, pedido)
  index.html             # Página inicial (tela de login)
outros/                  # Arquivos e pastas que não fazem parte do projeto principal, mas foram incluídos no ZIP original
.gitignore               # Arquivos e pastas a serem ignorados pelo Git
README.md                # Este arquivo
LICENSE                  # Licença do projeto
```

## Como Rodar o Projeto

Para visualizar o projeto, basta abrir o arquivo `public/index.html` em seu navegador. Não é necessário nenhum servidor web para a execução local, pois se trata de um projeto estático.

## Credenciais de Login (Demo)

Para testar as diferentes interfaces do sistema, utilize as seguintes credenciais:

| Perfil   | E-mail                     | Senha    |
| :------- | :------------------------- | :------- |
| Cliente  | `cliente@bbq-parrila.com`  | `123456` |
| Gerente  | `gerente@bbq-parrila.com`  | `123456` |
| Cozinha  | `cozinha@bbq-parrila.com`  | `123456` |
| Motoboy  | `motoboy@bbq-parrila.com`  | `123456` |

## Fluxo do Pedido (Simulado)

O sistema simula o seguinte fluxo de pedido:

1. O cliente adiciona itens ao carrinho através da página de cardápio.
2. Escolhe a forma de pagamento (Pix, cartão de crédito, débito, vale refeição ou dinheiro).
3. Se o pagamento for Pix, um QR Code é exibido por 15 segundos.
4. A tela de acompanhamento de pedido atualiza automaticamente, simulando as etapas:
   - 10 segundos para o pedido chegar à cozinha.
   - 10 segundos para o preparo.
   - 10 segundos para a entrega.

## Contribuição

Contribuições são bem-vindas! Se você tiver sugestões de melhoria, novas funcionalidades ou encontrar algum bug, sinta-se à vontade para abrir uma *issue* ou enviar um *pull request*.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
