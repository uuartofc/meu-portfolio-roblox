// --- Lógica Principal do Portfólio e Admin ---
document.addEventListener('DOMContentLoaded', () => {

    const path = window.location.pathname;

    // Inicializa o Firebase (garantindo que só inicialize uma vez)
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.firestore();

    // ----------------------------------------------------------------
    // Lógica para o Painel de Administração (admin.html)
    // ----------------------------------------------------------------
    if (path.includes('admin.html')) {
        // Seletores e funções do Admin
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.style.display = 'none';
        }

        const adminLoginForm = document.getElementById('adminLoginForm');
        const adminPasswordInput = document.getElementById('adminPassword');
        const adminContentDiv = document.querySelector('.admin-content');
        const projectEditorForm = document.getElementById('projectEditorForm');
        const addProjectBtn = document.getElementById('addProjectBtn');
        const cancelEditBtn = document.getElementById('cancelEditBtn');
        const projectFormDiv = document.getElementById('projectForm');
        const projectListDiv = document.getElementById('projectList');

        function loadProjects() {
            projectListDiv.innerHTML = '';
            db.collection('projects').orderBy('date', 'desc').get().then(snapshot => {
                snapshot.forEach(doc => {
                    const project = doc.data();
                    const projectItem = document.createElement('div');
                    projectItem.classList.add('project-item');
                    projectItem.innerHTML = `
                        <h3>${project.Tittle}</h3>
                        <p>${project.shortDescription}</p>
                        <div>
                            <button class="edit-btn" data-id="${doc.id}">Editar</button>
                            <button class="delete-btn" data-id="${doc.id}">Excluir</button>
                        </div>
                    `;
                    projectListDiv.appendChild(projectItem);
                });
                console.log("Projetos carregados com sucesso!");
            }).catch(error => {
                console.error("Erro ao carregar projetos:", error);
                alert("Não foi possível carregar os projetos. Verifique sua conexão e as regras do Firebase.");
            });
        }

        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const password = adminPasswordInput.value;

            db.collection('admin').doc('credentials').get().then(doc => {
                if (doc.exists) {
                    const adminData = doc.data();
                    const correctPassword = adminData.password;

                    if (password === correctPassword) {
                        console.log("Acesso de administrador concedido.");
                        document.querySelector('.admin-login-card').style.display = 'none';
                        adminContentDiv.style.display = 'block';
                        loadProjects();
                    } else {
                        alert('Senha incorreta!');
                    }
                } else {
                    alert('Erro: Documento de credenciais não encontrado no banco de dados!');
                }
            }).catch(error => {
                console.error("Erro ao buscar senha:", error);
                alert("Erro ao tentar fazer login. Verifique sua conexão e as regras do Firebase.");
            });
        });

        addProjectBtn.addEventListener('click', () => {
            projectEditorForm.reset();
            document.getElementById('projectId').value = '';
            projectFormDiv.style.display = 'block';
        });

        cancelEditBtn.addEventListener('click', () => {
            projectFormDiv.style.display = 'none';
        });

        projectEditorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('projectId').value;

            const downloadText = document.getElementById('projectDownload').value;
            const downloads = downloadText.split('\n').filter(line => line.trim() !== '').map(line => {
                const parts = line.split(';');
                return {
                    url: parts[0] ? parts[0].trim() : '',
                    name: parts[1] ? parts[1].trim() : 'Arquivo',
                    size: parts[2] ? parts[2].trim() : ''
                };
            });

            const projectData = {
                Tittle: document.getElementById('projectTitle').value,
                shortDescription: document.getElementById('projectShortDesc').value,
                fullDescription: document.getElementById('projectFullDesc').value,
                image: document.getElementById('projectImage').value,
                screenshots: document.getElementById('projectScreenshots').value.split(',').map(s => s.trim()).filter(s => s),
                video: {
                    Tittle: "",
                    url: document.getElementById('projectVideo').value || null
                },
                tags: document.getElementById('projectTags').value.split(',').map(t => t.trim()).filter(t => t),
                date: document.getElementById('projectDate').value,
                version: document.getElementById('projectVersion').value,
                codeSnippet: document.getElementById('projectCode').value,
                downloadFiles: downloads,
                demoLink: document.getElementById('projectDemo').value || null
            };

            if (id) {
                db.collection('projects').doc(id).update(projectData).then(() => {
                    alert('Projeto atualizado com sucesso!');
                    loadProjects();
                    projectFormDiv.style.display = 'none';
                }).catch(error => {
                    console.error("Erro ao atualizar projeto: ", error);
                });
            } else {
                db.collection('projects').add(projectData).then(() => {
                    alert('Novo projeto adicionado com sucesso!');
                    loadProjects();
                    projectFormDiv.style.display = 'none';
                }).catch(error => {
                    console.error("Erro ao adicionar projeto: ", error);
                });
            }
        });

        projectListDiv.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            if (e.target.classList.contains('edit-btn')) {
                db.collection('projects').doc(id).get().then(doc => {
                    if (doc.exists) {
                        const data = doc.data();
                        document.getElementById('projectId').value = doc.id;
                        document.getElementById('projectTitle').value = data.Tittle;
                        document.getElementById('projectShortDesc').value = data.shortDescription;
                        document.getElementById('projectFullDesc').value = data.fullDescription;
                        document.getElementById('projectImage').value = data.image;
                        document.getElementById('projectScreenshots').value = data.screenshots.join(', ');
                        document.getElementById('projectVideo').value = data.video ? data.video.url : '';
                        document.getElementById('projectTags').value = data.tags.join(', ');
                        document.getElementById('projectDate').value = data.date;
                        document.getElementById('projectVersion').value = data.version;
                        document.getElementById('projectCode').value = data.codeSnippet;

                        let downloadText = '';
                        if (data.downloadFiles) {
                            downloadText = data.downloadFiles.map(d => `${d.url};${d.name};${d.size}`).join('\n');
                        }
                        document.getElementById('projectDownload').value = downloadText;

                        document.getElementById('projectDemo').value = data.demoLink || '';

                        projectFormDiv.style.display = 'block';
                    }
                });
            } else if (e.target.classList.contains('delete-btn')) {
                if (confirm('Tem certeza que deseja excluir este projeto?')) {
                    db.collection('projects').doc(id).delete().then(() => {
                        alert('Projeto excluído com sucesso!');
                        loadProjects();
                    }).catch(error => {
                        console.error("Erro ao excluir projeto: ", error);
                    });
                }
            }
        });

    // ----------------------------------------------------------------
    // Lógica para a Página Principal (index.html)
    // ----------------------------------------------------------------
    } else {
        
        // Seletores necessários para a lógica da página principal
        const menuToggle = document.querySelector('.menu-toggle');
        const container = document.querySelector('.container');
        const navLinks = document.querySelectorAll('.nav-links li');
        const pages = document.querySelectorAll('.page');
        const projectsGrid = document.querySelector('.projects-grid');
        const projectDetailsSection = document.getElementById('project-details');
        const imageOverlay = document.querySelector('.image-overlay');
        const videoOverlay = document.querySelector('.video-overlay');

        // Lógica de Alternância da Sidebar
        if (menuToggle && container) {
            menuToggle.addEventListener('click', () => {
                // Alterna a classe 'collapsed' no container principal (abre/fecha a sidebar)
                container.classList.toggle('collapsed');
            });
        }
        
        // Funções de exibição (mantidas para funcionalidade completa)
        function displayProjects(projects) {
            projectsGrid.innerHTML = '';
            projects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.classList.add('project-card');
                projectCard.innerHTML = `
                    <div class="project-image-container"> <img src="${project.image}" alt="${project.Tittle}">
                    </div>
                    <div class="project-info">
                        <h3>${project.Tittle}</h3>
                        <p>${project.shortDescription}</p>
                        <div class="project-tags">${project.tags.map(tag => `<span>${tag}</span>`).join('')}</div>
                    </div>
                `;
                projectCard.addEventListener('click', () => showProjectDetails(project));
                projectsGrid.appendChild(projectCard);
            });
        }

        function showProjectDetails(project) {
            projectDetailsSection.innerHTML = `
                <div class="back-button"><i class="fas fa-arrow-left"></i> Voltar</div>
                <div class="project-content">
                    <div class="project-header">
                        <h2>${project.Tittle}</h2>
                        <p class="project-date">${project.date} | Versão: ${project.version}</p>
                    </div>
                    <div class="project-description">
                        <p>${project.fullDescription}</p>
                    </div>
                    
                    ${project.screenshots && project.screenshots.length > 0 ? `
                        <div class="project-screenshots-section">
                            <h3>Miniaturas</h3>
                            <div class="screenshot-grid">
                                ${project.screenshots.map(s => `<img src="${s}" alt="Screenshot" class="screenshot">`).join('')}
                            </div>
                        </div>
                    ` : ''}

                    ${project.video && project.video.url ? `
                        <div class="video-button-container">
                            <a href="#" class="video-button" data-video-url="${project.video.url}">
                                <i class="fas fa-video"></i> Ver Vídeo
                            </a>
                        </div>
                    ` : `<div class="no-video-message">Nenhum vídeo disponível.</div>`}
                    
                    ${project.codeSnippet ? `
                        <div class="code-section">
                            <h3>Código Principal</h3>
                            <pre><code>${project.codeSnippet}</code></pre>
                        </div>
                    ` : ''}

                    ${project.downloadFiles && project.downloadFiles.length > 0 ? `
                        <div class="download-section">
                            <h3>Arquivos para Download</h3>
                            <div class="download-files">
                                ${project.downloadFiles.map(d => `<a href="${d.url}" target="_blank" class="download-item">
                                    <i class="fas fa-download"></i>
                                    <span class="file-name">${d.name}</span>
                                    <span class="file-size">${d.size}</span>
                                </a>`).join('')}
                            </div>
                        </div>` : ''}
                    
                    ${project.demoLink ? `<a href="${project.demoLink}" target="_blank" class="project-link-btn">Ver Demo</a>` : ''}
                </div>
            `;

            const newBackButton = projectDetailsSection.querySelector('.back-button');
            if (newBackButton) {
                newBackButton.addEventListener('click', () => {
                    projectDetailsSection.style.display = 'none';
                    document.getElementById('projects').style.display = 'block';
                });
            }

            document.getElementById('projects').style.display = 'none';
            projectDetailsSection.style.display = 'block';

            const videoButton = document.querySelector('.video-button');
            if (videoButton) {
                videoButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    const videoUrl = videoButton.dataset.videoUrl;
                    if (videoUrl) {
                        const iframe = videoOverlay.querySelector('.video-player');
                        if (iframe) {
                            iframe.src = videoUrl;
                            videoOverlay.style.display = 'flex';
                        }
                    }
                });
            }

            const screenshotImages = document.querySelectorAll('.screenshot-grid .screenshot');
            screenshotImages.forEach(img => {
                img.addEventListener('click', () => {
                    imageOverlay.querySelector('img').src = img.src;
                    imageOverlay.style.display = 'flex';
                });
            });
        }

        // Eventos de Fechamento de Overlays
        if (imageOverlay) {
            imageOverlay.addEventListener('click', (e) => {
                if (e.target === imageOverlay) {
                    imageOverlay.style.display = 'none';
                }
            });
        }

        if (videoOverlay) {
            videoOverlay.addEventListener('click', (e) => {
                if (e.target === videoOverlay) { 
                    videoOverlay.style.display = 'none';
                    videoOverlay.querySelector('.video-player').src = '';
                }
            });
        }

        let allProjects = [];
        async function fetchProjects() {
            const projectsCol = db.collection('projects');
            const snapshot = await projectsCol.get();
            allProjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            displayProjects(allProjects);
        }

        // ----------------------------------------------------------------
        // Lógica de Navegação e FECHAMENTO DA SIDEBAR (Conforme solicitado)
        // ----------------------------------------------------------------
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.forEach(nav => nav.classList.remove('active'));
                link.classList.add('active');
                const targetPage = link.getAttribute('data-page');
                pages.forEach(page => {
                    page.style.display = 'none';
                });
                if (targetPage === 'projects') {
                    projectDetailsSection.style.display = 'none';
                    document.getElementById('projects').style.display = 'block';
                } else {
                    document.getElementById(targetPage).style.display = 'block';
                }
                
                // Fecha a sidebar no mobile após a navegação
                if (window.innerWidth <= 768) {
                    container.classList.remove('collapsed');
                }
            });
        });

        // Configuração inicial e carregamento de projetos
        document.getElementById('home').style.display = 'block';
        fetchProjects();

        // --- Lógica de Envio de E-mail (Formspree) ---
        const contactForm = document.getElementById('contactForm');
        const formMessage = document.createElement('div');
        formMessage.classList.add('form-message');
        formMessage.style.display = 'none';

        if (contactForm) {
            contactForm.parentNode.insertBefore(formMessage, contactForm.nextSibling);

            contactForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                // OBS: VOCÊ PRECISA SUBSTITUIR ESTE ENDPOINT PELO SEU PRÓPRIO FORMULÁRIO FORMSPREE
                const formspreeEndpoint = 'https://formspree.io/f/movkjepb'; 

                const formData = new FormData(contactForm);
                const object = Object.fromEntries(formData);
                const json = JSON.stringify(object);

                try {
                    const response = await fetch(formspreeEndpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: json
                    });

                    if (response.ok) {
                        formMessage.textContent = 'Obrigado! Sua mensagem foi enviada com sucesso.';
                        formMessage.style.backgroundColor = '#4CAF50';
                        formMessage.style.display = 'block';
                        contactForm.reset();
                    } else {
                        const errorData = await response.json();
                        formMessage.textContent = errorData.error || 'Ocorreu um erro. Por favor, tente novamente mais tarde.';
                        formMessage.style.backgroundColor = '#f44336';
                        formMessage.style.display = 'block';
                    }
                } catch (error) {
                    console.error('Erro de envio:', error);
                    formMessage.textContent = 'Erro de rede. Por favor, verifique sua conexão.';
                    formMessage.style.backgroundColor = '#f44336';
                    formMessage.style.display = 'block';
                }

                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            });
        }
    }
});