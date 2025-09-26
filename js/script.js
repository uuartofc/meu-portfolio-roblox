// Funcionalidades principais do site

document.addEventListener('DOMContentLoaded', function() {
    // Navegação entre páginas
    const navLinks = document.querySelectorAll('.nav-links li');
    const pages = document.querySelectorAll('.page');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            
            // Remover classe ativa de todos os links e páginas
            navLinks.forEach(item => item.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));
            
            // Adicionar classe ativa ao link e página selecionados
            this.classList.add('active');
            document.getElementById(targetPage).classList.add('active');
        });
    });
    
    // Botão de voltar na página de detalhes do projeto
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', function() {
            document.getElementById('project-details').classList.remove('active');
            document.getElementById('projects').classList.add('active');
        });
    }

    // Carregar projetos dinamicamente
    loadProjects();
    
    // Evento para fechar o overlay de imagens ao clicar nele
    const imageOverlay = document.querySelector('.image-overlay');
    imageOverlay.addEventListener('click', function() {
        this.classList.remove('active');
    });

    // Evento para fechar o overlay de vídeos ao clicar nele
    const videoOverlay = document.querySelector('.video-overlay');
    videoOverlay.addEventListener('click', function() {
        this.classList.remove('active');
        // Pausar o vídeo quando o overlay for fechado para evitar que continue tocando
        const iframeContainer = this.querySelector('.video-container');
        iframeContainer.innerHTML = ''; // Remove o iframe do DOM
    });

    // --- Lógica do formulário de contato ---
    const form = document.querySelector('.contact-form form');
    const formURL = "https://formspree.io/f/mqayeznj"; // O URL do seu formulário

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const formData = new FormData(form);
        const response = await fetch(formURL, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Se o envio foi um sucesso, mostra o popup
            alert('Mensagem enviada com sucesso! Obrigado pelo contato.');
            form.reset(); // Limpa os campos do formulário
        } else {
            // Se houver um erro, avisa o usuário
            alert('Ops! Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.');
        }
    });
    // --- Fim da lógica do formulário ---
});

// Função para carregar os projetos na página
function loadProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    
    if (projectsGrid) {
        // Limpar o grid de projetos
        projectsGrid.innerHTML = '';
        
        // Para cada projeto no arquivo projects.js
        projects.forEach(project => {
            // Criar card do projeto
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
            // Adicionar conteúdo do card
            projectCard.innerHTML = `
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}">
                </div>
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.shortDescription}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
                    </div>
                </div>
            `;
            
            // Adicionar evento de clique para abrir detalhes do projeto
            projectCard.addEventListener('click', function() {
                showProjectDetails(project);
            });
            
            // Adicionar card ao grid
            projectsGrid.appendChild(projectCard);
        });
    }
}

// Função para mostrar detalhes do projeto
function showProjectDetails(project) {
    const projectContent = document.querySelector('.project-content');
    const projectDetailsPage = document.getElementById('project-details');
    const projectsPage = document.getElementById('projects');

    if (projectContent && projectDetailsPage && projectsPage) {
        // Preencher o conteúdo do projeto
        projectContent.innerHTML = `
            <div class="project-header">
                <h1>${project.title}</h1>
                <div class="project-meta">
                    <span><i class="fas fa-calendar"></i> ${project.date}</span>
                    <span><i class="fas fa-code-branch"></i> ${project.version}</span>
                </div>
            </div>
            
            <div class="project-description">
                ${project.fullDescription}
            </div>

            <div class="project-media">
                <h3>Miniaturas</h3>
                <div class="project-screenshots">
                    ${project.screenshots.map(screenshot => `
                        <img src="${screenshot}" alt="Screenshot do projeto">
                    `).join('')}
                </div>
            </div>
            
            <div class="video-button-container">
                ${project.video ? `
                    <button class="video-button" data-video-url="${project.video.url}">
                        <i class="fas fa-play-circle"></i> Ver Vídeo
                    </button>
                ` : `
                    <p class="no-video-message">Sem vídeo demonstrativo, ou em produção.</p>
                `}
            </div>

            <div class="code-section">
                <h3>Código Principal</h3>
                <div class="code-block">
                    <pre><code>${project.codeSnippet}</code></pre>
                </div>
            </div>
            
            ${project.downloadFiles && project.downloadFiles.length > 0 ? `
                <div class="download-section">
                    <h3>Arquivos para Download</h3>
                    <div class="download-files">
                        ${project.downloadFiles.map(file => `
                            <a href="${file.url}" download class="download-item">
                                <i class="fas fa-download"></i>
                                <span class="file-name">${file.name}</span>
                                <span class="file-size">${file.size}</span>
                            </a>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${project.demoLink ? `
                <div class="demo-link">
                    <a href="${project.demoLink}" target="_blank" class="submit-btn">
                        <i class="fas fa-external-link-alt"></i> Ver Demonstração
                    </a>
                </div>
            ` : ''}
        `;
        
        // Adicionar o evento de clique nas miniaturas para abrir o pop-up de imagem
        const projectScreenshots = document.querySelector('.project-screenshots');
        const imageOverlay = document.querySelector('.image-overlay');
        const overlayImage = imageOverlay.querySelector('img');

        projectScreenshots.addEventListener('click', function(e) {
            if (e.target.tagName === 'IMG') {
                overlayImage.src = e.target.src;
                imageOverlay.classList.add('active');
            }
        });

        // Adicionar o evento de clique no botão de vídeo
        const videoButton = document.querySelector('.video-button');
        if (videoButton) {
            videoButton.addEventListener('click', function() {
                const videoOverlay = document.querySelector('.video-overlay');
                const iframeContainer = videoOverlay.querySelector('.video-container');
                const videoUrl = this.getAttribute('data-video-url');
                
                // Cria o iframe dinamicamente
                const iframe = document.createElement('iframe');
                iframe.src = videoUrl;
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                iframe.setAttribute('allowfullscreen', '');
                
                // Limpa o container e insere o novo iframe
                iframeContainer.innerHTML = '';
                iframeContainer.appendChild(iframe);
                
                videoOverlay.classList.add('active');
            });
        }

        // Mostrar página de detalhes e esconder página de projetos
        projectsPage.classList.remove('active');
        projectDetailsPage.classList.add('active');
    }
}