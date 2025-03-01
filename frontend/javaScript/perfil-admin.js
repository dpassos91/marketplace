document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('.admin-sidebar a');
    const sections = document.querySelectorAll('.admin-content > section');
  
    // Função para esconder todas as sections
    function hideAllSections() {
      sections.forEach(section => {
        section.classList.add('hidden');
      });
    }
  
    // Evento de clique para os links do sidebar
    links.forEach(link => {
      link.addEventListener('click', function (event) {
        event.preventDefault();
  
        hideAllSections(); // Esconde todas as sections
  
        // Mostra a section correspondente ao link clicado
        let targetId = this.getAttribute('id');
        if (targetId === 'gestao-utilizadores') {
          targetId = 'utilizadores';
        } else if (targetId === 'gestao-produtos') {
          targetId = 'produtos';
        } else if (targetId === 'ver-dashboard') {
          targetId = 'dashboard';
        }
        document.getElementById(targetId).classList.remove('hidden');
      });
    });
  
    // Evento de clique para o botão "Filtrar"
    const filtrarButton = document.getElementById('adminFiltrarProd');
    filtrarButton.addEventListener('click', function (event) {
      event.preventDefault(); // Impede o comportamento padrão do link
  
      hideAllSections(); // Esconde todas as sections
  
      // Mostra a secção de filtros
      document.getElementById('filtros').classList.remove('hidden');
    });
  });


