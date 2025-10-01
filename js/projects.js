// Dados dos projetos

const projects = [
    {
        id: 1,
        Tittle: "Sistema de Painel de Administrador",
        shortDescription: "Um sistema de painel de administrador completo e modular, com funções de moderação e gerenciamento de jogadores, itens e eventos.",
        fullDescription: `Este painel de administrador foi desenvolvido para ser uma ferramenta robusta e intuitiva, garantindo controle total e eficiente sobre a experiência de jogo.
        
        Interface Intuitiva: O design focado em UI/UX permite que a moderação seja realizada de forma rápida e segura.

        Gerenciamento de Jogadores: Oferece funções para banir, kickar, teleportar e dar itens a jogadores, facilitando a gestão da comunidade.

        Eventos Remotos: Utiliza RemoteEvents para uma comunicação segura entre o cliente e o servidor, minimizando vulnerabilidades e protegendo os dados do jogo.

        Sistema Modular: A lógica é dividida em módulos que podem ser facilmente expandidos para adicionar novas funcionalidades sem quebrar o sistema existente.

        Persistência de Dados: O sistema pode ser integrado com DataStore para registrar ações de moderação e manter um histórico de eventos do servidor.

        O painel foi projetado para ser facilmente integrado em qualquer jogo Roblox, com documentação clara para desenvolvedores e moderadores.`,
        image: "images/AdmPainel.png",
        screenshots: ["images/AdmPainel.png", "images/screenshot1.png", "images/screenshot2.png", "images/screenshot3.png"],
        
        video: {
            url: "https://youtube.com/embed/CraHn5e2boI", 
            Tittle: "Pequena Demonstração do Painel de Administrador"
        },
        
        downloadFiles: [
            {
                name: "Indisponível",
                url: null,  
                size: "falso"
            },
        ],
        tags: ["Lua", "UI", "Datastore"],
        date: "Setembro 2025",
        version: "v1.0.0",
        codeSnippet: `--Codigo Privado`,
        demoLink: null
    },
];