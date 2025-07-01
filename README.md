##  Autores

**Tom Jonnes França Aguiar - 500912**
**Marcelo Henrique damasceno de castro - 500870**
**Alexandre Gomes Camelo - 504315**
**Ítalo Ramon Lopes Rodrigues - 499226**

-   GitHub: 

#  Sistema Solar

Um projeto de visualização 3D do Sistema Solar, desenvolvido com **Three.js**, que permite ao usuário explorar os planetas, suas órbitas e obter informações detalhadas sobre cada corpo celeste.

##  Descrição

Este projeto usa Three.js para criar uma visualização 3D interativa do Sistema Solar, exibindo o Sol e os planetas com suas respectivas texturas reais e movimentos. Cada planeta executa sua translação ao redor do Sol, respeitando velocidades relativas diferentes.

Os planetas giram em torno de seus próprios eixos. Saturno possui seus anéis representados por texturas aplicadas em um anel 3D.

O usuário pode interagir com a cena utilizando o mouse para navegar e teclas para alterar a velocidade dos movimentos planetários.

A cena não considera satélites naturais (como luas), exceto no upgrade caso seja implementado.

##  Funcionalidades

-   **Movimento Orbital e de Rotação:** Os planetas giram em torno de seus próprios eixos e orbitam o Sol em velocidades relativas.
-   **Navegação Interativa:** Controles de órbita (`OrbitControls`) que permitem ao usuário rotacionar a câmera, dar zoom e mover a cena livremente.

-   **Painel de Informações Dinâmico:** Ao clicar em um planeta ou no Sol, um painel lateral surge com informações detalhadas:
    -   Imagem do astro
    -   Diâmetro
    -   Massa
    -   Distância do Sol
    -   Período Orbital e de Rotação
    -   Temperatura Média
    -   Velocidades distintas para cada planeta.
    -   Controles via teclado para aumentar ou diminuir a velocidade da rotação e translação.
    -   Navegação da câmera com mouse usando OrbitControls.

-   **Foco Automático:** Clicar em um astro ou selecioná-lo no menu faz a câmera se mover suavemente para focá-lo.
-   **Menu de Seleção Rápida:** Um menu na parte inferior da tela permite selecionar e focar diretamente em qualquer astro.
-   **Fundo Estrelado (Starfield):** Um campo de estrelas gerado proceduralmente para criar uma imersão maior no ambiente espacial.
-   **Design Responsivo:** A interface se adapta a diferentes tamanhos de tela.


**Uso das Teclas para Controle de Velocidade**
+ ou - = : Aumenta ou diminui a velocidade da translação dos planetas.

] ou [ : Aumenta ou diminui a velocidade da rotação dos planetas.


##  Tecnologias Utilizadas
    -   HTML5
    -   CSS3
    -   JavaScript (ES6+)
    -   OrbitControls.js = Para a navegação interativa com o mouse.
    -   Tween.js = para animações suaves
    -   Three.js = O motor principal para a renderização 3D via WebGL.

##  Como Executar o Projeto Localmente

Para executar este projeto em sua máquina, você precisará de um servidor local.

**Pré-requisitos:**
*   Um navegador web moderno (Chrome, Firefox, Edge e entre outros).
*   Node.js (opcional, para usar `live-server`) ou Python.