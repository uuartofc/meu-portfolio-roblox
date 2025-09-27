document.addEventListener('DOMContentLoaded', () => {
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
    const projectShortDescInput = document.getElementById('projectShortDesc');
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

    // Senha de Admin
    const ADMIN_PASSWORD = "Admin"; // Altere esta senha!

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
                screenshots: projectScreenshotsInput.value.split(',').map(s => s.trim()),
                video: { url: projectVideoInput.value, Tittle: '' },
                tags: projectTagsInput.value.split(',').map(s => s.trim()),
                date: projectDateInput.value,
                version: projectVersionInput.value,
                codeSnippet: projectCodeInput.value,
                downloadFiles: projectDownloadInput.value.split(';').map(item => {
                    const [url, name, size] = item.split(',').map(s => s.trim());
                    return { url, name, size };
                }),
                demoLink: projectDemoInput.value
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
                alert('Erro ao salvar o projeto. Tente novamente.');
            }
        });
    }

    async function loadAdminProjects() {
        projectListDiv.innerHTML = '';
        const snapshot = await db.collection('projects').get();
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
        projectScreenshotsInput.value = project.screenshots.join(', ');
        projectVideoInput.value = project.video.url;
        projectTagsInput.value = project.tags.join(', ');
        projectDateInput.value = project.date;
        projectVersionInput.value = project.version;
        projectCodeInput.value = project.codeSnippet;
        
        const downloads = project.downloadFiles.map(file => `${file.url}, ${file.name}, ${file.size}`).join('; ');
        projectDownloadInput.value = downloads;

        projectDemoInput.value = project.demoLink;

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
                alert('Erro ao excluir o projeto. Tente novamente.');
            }
        }
    }
});