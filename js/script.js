document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links li');
    const pages = document.querySelectorAll('.page');
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    // Lógica para alternar a barra lateral
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });

    // Navegação entre páginas
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');

            // Remove a classe 'active' de todos os links e páginas
            navLinks.forEach(item => item.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));

            // Adiciona a classe 'active' ao link e à página selecionados
            this.classList.add('active');
            document.getElementById(targetPage).classList.add('active');

            // Fecha a barra lateral em telas pequenas após a seleção
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
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

    // Lógica para abrir/fechar o overlay de imagens
    const imageOverlay = document.querySelector('.image-overlay');
    imageOverlay.addEventListener('click', function() {
        this.classList.remove('active');
    });

    // Lógica para abrir/fechar o overlay de vídeos
    const videoOverlay = document.querySelector('.video-overlay');
    videoOverlay.addEventListener('click', function() {
        this.classList.remove('active');
        const iframeContainer = this.querySelector('.video-container');
        iframeContainer.innerHTML = '';
    });

    // Lógica do formulário de contato
    const form = document.querySelector('.contact-form form');
    const formURL = "https://formspree.io/f/mqayeznj";

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const response = await fetch(formURL, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            alert('Mensagem enviada com sucesso! Obrigado pelo contato.');
            form.reset();
        } else {
            alert('Ops! Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.');
        }
    });

    // Carregar projetos dinamicamente
    loadProjects();
});

// ... (as funções loadProjects e showProjectDetails que você já tem) ...
function loadProjects() {
    const projectsGrid = document.querySelector('.projects-grid');

    if (projectsGrid) {
        projectsGrid.innerHTML = '';

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
    }
}

function showProjectDetails(project) {
    const projectContent = document.querySelector('.project-content');
    const projectDetailsPage = document.getElementById('project-details');
    const projectsPage = document.getElementById('projects');

    if (projectContent && projectDetailsPage && projectsPage) {
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

        const projectScreenshots = document.querySelector('.project-screenshots');
        const imageOverlay = document.querySelector('.image-overlay');
        const overlayImage = imageOverlay.querySelector('img');

        projectScreenshots.addEventListener('click', function(e) {
            if (e.target.tagName === 'IMG') {
                overlayImage.src = e.target.src;
                imageOverlay.classList.add('active');
            }
        });

        const videoButton = document.querySelector('.video-button');
        if (videoButton) {
            videoButton.addEventListener('click', function() {
                const videoOverlay = document.querySelector('.video-overlay');
                const iframeContainer = videoOverlay.querySelector('.video-container');
                const videoUrl = this.getAttribute('data-video-url');

                const iframe = document.createElement('iframe');
                iframe.src = videoUrl;
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                iframe.setAttribute('allowfullscreen', '');

                iframeContainer.innerHTML = '';
                iframeContainer.appendChild(iframe);

                videoOverlay.classList.add('active');
            });
        }

        projectsPage.classList.remove('active');
        projectDetailsPage.classList.add('active');
    }
}