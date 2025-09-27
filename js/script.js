// Funcionalidades principais do site

document.addEventListener('DOMContentLoaded', function() {
    // --- Lógica de Navegação entre Páginas ---
    const navLinks = document.querySelectorAll('.nav-links li');
    const pages = document.querySelectorAll('.page');
    
    function showPage(targetPage) {
        navLinks.forEach(item => item.classList.remove('active'));
        pages.forEach(page => page.classList.remove('active'));
        
        const selectedLink = document.querySelector(`[data-page="${targetPage}"]`);
        if (selectedLink) {
            selectedLink.classList.add('active');
        }
        
        const selectedPage = document.getElementById(targetPage);
        if (selectedPage) {
            selectedPage.classList.add('active');
        }

        // Carrega o conteúdo dinâmico
        if (targetPage === 'projects') {
            loadProjects();
        } else if (targetPage === 'admin') {
            loadAdminProjects();
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            showPage(targetPage);
        });
    });

    // --- Botão de Voltar ---
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', function() {
            showPage('projects');
        });
    }

    // --- Lógica do formulário de contato ---
    const form = document.querySelector('.contact-form form');
    const formURL = "https://formspree.io/f/mqayeznj";
    if (form) {
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
    }

    // --- Overlay de Vídeo ---
    const videoOverlay = document.querySelector('.video-overlay');
    if (videoOverlay) {
        videoOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                const iframeContainer = this.querySelector('.video-container');
                iframeContainer.innerHTML = '';
            }
        });
    }
    
    // --- Overlay de Imagem ---
    const imageOverlay = document.querySelector('.image-overlay');
    if (imageOverlay) {
        imageOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    }

    // --- Lógica do Painel de Administração ---
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminPasswordInput = document.getElementById('adminPassword');
    const adminLoginCard = document.querySelector('.admin-login-card');
    const adminContent = document.querySelector('.admin-content');
    const addProjectBtn = document.getElementById('addProjectBtn');
    const projectListDiv = document.getElementById('projectList');
    const projectFormDiv = document.getElementById('projectForm');
    const projectEditorForm = document.getElementById('projectEditorForm');
    const projectIdInput = document.getElementById('projectId');
    const projectTittleInput = document.getElementById('projectTitle');
    const projectShortDescInput = document = document.getElementById('projectShortDesc');
    const projectFullDescInput = document.getElementById('projectFullDesc');
    const projectImageInput = document.getElementById('projectImage');
    const projectScreenshotsInput = document.getElementById('projectScreenshots');
    const projectVideoInput = document.getElementById('projectVideo');
    const projectTagsInput = document.getElementById('projectTags');
    const projectDateInput = document.getElementById('projectDate');
    const projectVersionInput = document.getElementById('projectVersion');
    const projectCodeInput = document.getElementById('projectCode');
    const projectDownloadInput = document.getElementById('projectDownload');
    const projectDemoInput = document.getElementById('projectDemo');
    const cancelEditBtn = document.getElementById('cancelEditBtn');

    // Senha de Admin - SUBSTITUA ESTA SENHA
    const ADMIN_PASSWORD = "Admin";

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (adminPasswordInput.value === ADMIN_PASSWORD) {
                adminLoginCard.style.display = 'none';
                adminContent.style.display = 'block';
                loadAdminProjects();
            } else {
                alert('Senha incorreta!');
            }
        });
    }

    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', () => {
            projectEditorForm.reset();
            projectIdInput.value = '';
            projectFormDiv.style.display = 'block';
        });
    }

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', () => {
            projectFormDiv.style.display = 'none';
        });
    }

    if (projectEditorForm) {
        projectEditorForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const projectData = {
                Tittle: projectTittleInput.value,
                shortDescription: projectShortDescInput.value,
                fullDescription: projectFullDescInput.value,
                image: projectImageInput.value,
                screenshots: projectScreenshotsInput.value.split(',').map(s => s.trim()).filter(s => s), // Filtra strings vazias
                video: {
                    url: projectVideoInput.value || null,
                    Tittle: ''
                },
                tags: projectTagsInput.value.split(',').map(s => s.trim()).filter(s => s), // Filtra strings vazias
                date: projectDateInput.value,
                version: projectVersionInput.value,
                codeSnippet: projectCodeInput.value,
                // Lida com múltiplos downloads (URL, nome, tamanho)
                downloadFiles: projectDownloadInput.value.split(';').map(item => {
                    const [url, name, size] = item.split(',').map(s => s.trim());
                    return { url, name, size };
                }).filter(file => file.url || file.name || file.size), // Filtra objetos vazios
                demoLink: projectDemoInput.value || null
            };

            const projectId = projectIdInput.value;
            try {
                if (projectId) {
                    await db.collection('projects').doc(projectId).update(projectData);
                    alert('Projeto atualizado com sucesso!');
                } else {
                    await db.collection('projects').add(projectData);
                    alert('Projeto adicionado com sucesso!');
                }
                projectFormDiv.style.display = 'none';
                loadAdminProjects();
            } catch (error) {
                console.error("Erro ao salvar o projeto: ", error);
                alert('Erro ao salvar o projeto. Verifique o console.');
            }
        });
    }

    async function loadAdminProjects() {
        if (!projectListDiv) return;
        projectListDiv.innerHTML = '<h4>Carregando projetos...</h4>';
        const snapshot = await db.collection('projects').get();
        projectListDiv.innerHTML = '';
        snapshot.forEach(doc => {
            const project = doc.data();
            const projectItem = document.createElement('div');
            projectItem.className = 'admin-project-item';
            projectItem.innerHTML = `
                <h4>${project.Tittle}</h4>
                <div class="admin-actions">
                    <button class="edit-btn" data-id="${doc.id}">Editar</button>
                    <button class="delete-btn" data-id="${doc.id}">Excluir</button>
                </div>
            `;
            projectListDiv.appendChild(projectItem);

            projectItem.querySelector('.edit-btn').addEventListener('click', () => {
                editProject(doc.id, project);
            });
            projectItem.querySelector('.delete-btn').addEventListener('click', () => {
                deleteProject(doc.id);
            });
        });
    }

    function editProject(id, project) {
        projectIdInput.value = id;
        projectTittleInput.value = project.Tittle;
        projectShortDescInput.value = project.shortDescription;
        projectFullDescInput.value = project.fullDescription;
        projectImageInput.value = project.image;
        projectScreenshotsInput.value = (project.screenshots || []).join(', ');
        projectVideoInput.value = (project.video && project.video.url) || '';
        projectTagsInput.value = (project.tags || []).join(', ');
        projectDateInput.value = project.date;
        projectVersionInput.value = project.version;
        projectCodeInput.value = project.codeSnippet;
        
        const downloads = (project.downloadFiles || []).map(file => `${file.url || ''}, ${file.name || ''}, ${file.size || ''}`).join('; ');
        projectDownloadInput.value = downloads;

        projectDemoInput.value = project.demoLink || '';

        projectFormDiv.style.display = 'block';
    }

    async function deleteProject(id) {
        if (confirm('Tem certeza que deseja excluir este projeto?')) {
            try {
                await db.collection('projects').doc(id).delete();
                alert('Projeto excluído com sucesso!');
                loadAdminProjects();
            } catch (error) {
                console.error("Erro ao excluir o projeto: ", error);
                alert('Erro ao excluir o projeto. Verifique o console.');
            }
        }
    }

    // --- Função de Carregar Projetos (Página Principal) ---
    async function loadProjects() {
        const projectsGrid = document.querySelector('.projects-grid');
        
        if (!projectsGrid) return;
        
        projectsGrid.innerHTML = '<p style="text-align:center;">Carregando projetos...</p>';
        
        try {
            const projectsRef = db.collection('projects');
            const snapshot = await projectsRef.get();
            const projects = [];
            snapshot.forEach(doc => {
                projects.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            projectsGrid.innerHTML = '';
            
            if (projects.length > 0) {
                projects.forEach(project => {
                    const projectCard = document.createElement('div');
                    projectCard.className = 'project-card';
                    
                    projectCard.innerHTML = `
                        <div class="project-image">
                            <img src="${project.image}" alt="${project.Tittle}">
                        </div>
                        <div class="project-info">
                            <h3>${project.Tittle}</h3>
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
                projectsGrid.innerHTML = '<p style="text-align:center;">Nenhum projeto encontrado.</p>';
            }
        } catch (error) {
            console.error("Erro ao carregar os projetos: ", error);
            projectsGrid.innerHTML = '<p style="text-align:center;">Erro ao carregar projetos. Verifique o console para mais detalhes.</p>';
        }
    }

    // --- Função de Mostrar Detalhes do Projeto ---
    function showProjectDetails(project) {
        const projectContent = document.querySelector('.project-content');
        const projectDetailsPage = document.getElementById('project-details');
        const projectsPage = document.getElementById('projects');

        if (projectContent && projectDetailsPage && projectsPage) {
            projectContent.innerHTML = `
                <div class="project-header">
                    <h1>${project.Tittle}</h1>
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
                        ${(project.screenshots || []).map(screenshot => `
                            <img src="${screenshot}" alt="Screenshot do projeto">
                        `).join('')}
                    </div>
                </div>
                
                <div class="video-button-container">
                    ${project.video && project.video.url ? `
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
            const overlayImage = document.querySelector('.image-overlay img');

            if (projectScreenshots) {
                projectScreenshots.addEventListener('click', function(e) {
                    if (e.target.tagName === 'IMG' && overlayImage) {
                        overlayImage.src = e.target.src;
                        imageOverlay.classList.add('active');
                    }
                });
            }

            const videoButton = document.querySelector('.video-button');
            if (videoButton) {
                videoButton.addEventListener('click', function() {
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

    // Carrega a página inicial ao carregar o site
    showPage('home');
});