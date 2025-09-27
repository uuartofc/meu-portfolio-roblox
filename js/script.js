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

            if (targetPage === 'projects') {
                loadProjects();
            }
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

    // Evento para fechar o overlay de vídeo ao clicar nele
    const videoOverlay = document.querySelector('.video-overlay');
    videoOverlay.addEventListener('click', function(e) {
        // Verifica se o clique foi diretamente no overlay e não no iframe
        if (e.target === this) {
            this.classList.remove('active');
            // Interrompe o vídeo quando o overlay é fechado
            const iframe = this.querySelector('iframe');
            if (iframe) {
                iframe.src = '';
            }
        }
    });

});

// Função para carregar os projetos na página
async function loadProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    
    if (projectsGrid) {
        projectsGrid.innerHTML = '';
        
        try {
            const snapshot = await db.collection('projects').get();
            const projects = [];
            snapshot.forEach(doc => {
                projects.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            if (projects.length > 0) {
                projects.forEach(project => {
                    const projectCard = document.createElement('div');
                    projectCard.className = 'project-card';
                    
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
                    
                    projectCard.addEventListener('click', function() {
                        showProjectDetails(project);
                    });
                    
                    projectsGrid.appendChild(projectCard);
                });
            } else {
                projectsGrid.innerHTML = '<p>Nenhum projeto encontrado. Adicione um através do painel de administração.</p>';
            }
        } catch (error) {
            console.error("Erro ao carregar os projetos: ", error);
            projectsGrid.innerHTML = '<p>Erro ao carregar os projetos. Por favor, verifique a sua conexão e a configuração do Firebase.</p>';
        }
    }
}

// Função para mostrar os detalhes do projeto
function showProjectDetails(project) {
    const projectsPage = document.getElementById('projects');
    const projectDetailsPage = document.getElementById('project-details');
    const projectContent = document.querySelector('.project-content');
    
    if (projectContent) {
        // Limpa o conteúdo anterior
        projectContent.innerHTML = '';
        
        const detailsHtml = `
            <h2>${project.title}</h2>
            <p class="project-version">Versão: ${project.version} | Data: ${project.date}</p>
            <div class="project-tags">
                ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
            </div>
            
            <div class="project-full-description">
                <p>${project.fullDescription}</p>
            </div>
            
            <div class="project-images">
                <img src="${project.image}" alt="Capa do Projeto">
                ${project.screenshots.map(src => `<img src="${src}" alt="Screenshot">`).join('')}
            </div>
            
            ${project.video && project.video.url ? `
            <div class="project-video">
                <button class="video-button" data-video-url="${project.video.url}">Assistir ao Vídeo</button>
            </div>
            ` : ''}

            ${project.codeSnippet ? `
            <div class="project-code">
                <h3>Código de Exemplo</h3>
                <pre><code>${project.codeSnippet}</code></pre>
            </div>
            ` : ''}

            ${project.downloadFiles && project.downloadFiles.length > 0 ? `
            <div class="project-downloads">
                <h3>Downloads</h3>
                <ul>
                    ${project.downloadFiles.map(file => `
                        <li><a href="${file.url}" download>${file.name}</a> (${file.size})</li>
                    `).join('')}
                </ul>
            </div>
            ` : ''}

            ${project.demoLink ? `
            <div class="project-demo-link">
                <a href="${project.demoLink}" target="_blank">Ver Demonstração</a>
            </div>
            ` : ''}
        `;
        
        projectContent.innerHTML = detailsHtml;

        // Evento para fechar o overlay de imagens ao clicar nele
        const imageOverlay = document.querySelector('.image-overlay');
        imageOverlay.addEventListener('click', function(e) {
            if (e.target === imageOverlay) {
                imageOverlay.classList.remove('active');
            }
        });
        
        // Adicionar o evento de clique nas imagens para abrir o overlay
        projectContent.querySelectorAll('.project-images img').forEach(img => {
            img.addEventListener('click', function() {
                const overlayImage = document.querySelector('.image-overlay img');
                overlayImage.src = this.src;
                imageOverlay.classList.add('active');
            });
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