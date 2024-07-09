function obterNomeUsuario() {
    if (nomeUsuario !== undefined) {
        return nomeUsuario;
    }
    var configFile = new File(Folder.userData + "/seu_script_config.txt");
    if (configFile.exists) {
        configFile.open("r");
        nomeUsuario = configFile.readln();
        configFile.close();
        return nomeUsuario;
    } else {
        return null;
    }
}

function salvarNomeUsuario(nome) {
    nomeUsuario = nome; // Atualiza a variável global
    var configFile = new File(Folder.userData + "/seu_script_config.txt");
    configFile.open("w");
    configFile.writeln(nome);
    configFile.close();
}

function obterCorPainel() {
    if (corPainel !== undefined) {
        return corPainel;
    }
    var configFile = new File(Folder.userData + "/seu_script_cor_painel.txt");
    if (configFile.exists) {
        configFile.open("r");
        var cor = configFile.readln().split(",");
        configFile.close();
        corPainel = [parseFloat(cor[0]), parseFloat(cor[1]), parseFloat(cor[2])];
        return corPainel;
    } else {
        return null;
    }
}

function salvarCorPainel(cor) {
    corPainel = cor; // Atualiza a variável global
    var configFile = new File(Folder.userData + "/seu_script_cor_painel.txt");
    configFile.open("w");
    configFile.writeln(cor.join(","));
    configFile.close();
}

var coresPredefinidas = [
    [0.8, 0.8, 1],   // Light Blue
    [1, 0.8, 0.8],   // Light Red
    [0.8, 1, 0.8],   // Light Green
    [1, 1, 0.8],     // Light Yellow
    [1, 0.5, 0.5],   // Light Salmon
    [0.8, 0.8, 0.8], // Light Gray
];

var fontesDisponiveis = [
    { name: "Arial", postScriptName: "ArialMT" },
    { name: "Times New Roman", postScriptName: "TimesNewRomanPSMT" },
    { name: "Verdana", postScriptName: "Verdana" },
    // Adicione mais fontes disponíveis conforme necessário
];

var nomeUsuario = obterNomeUsuario();

if (!nomeUsuario) {
    nomeUsuario = prompt("Digite seu nome:");
    salvarNomeUsuario(nomeUsuario);
}

var corPainel = obterCorPainel();

if (!corPainel) {
    corPainel = coresPredefinidas[0]; // Cor azul clara
}

function criarJanelaBoasVindas() {
    var janelaBoasVindas = new Window("dialog", "Boas-Vindas");
    janelaBoasVindas.orientation = "column";
    janelaBoasVindas.alignChildren = "fill";
    
    var painelBoasVindas = janelaBoasVindas.add("panel");
    painelBoasVindas.preferredSize = [300, 200];
    painelBoasVindas.alignChildren = "fill";
    painelBoasVindas.graphics.backgroundColor = painelBoasVindas.graphics.newBrush(painelBoasVindas.graphics.BrushType.SOLID_COLOR, corPainel);

    var perfilUsuario = painelBoasVindas.add("group");
    perfilUsuario.orientation = "row";
    perfilUsuario.alignChildren = "center";

    var nomeUsuarioLabel = perfilUsuario.add("statictext", undefined, "Olá, " + nomeUsuario + "!");
    nomeUsuarioLabel.graphics.font = ScriptUI.newFont("Arial-Bold", 16);

    var btnEditarNome = perfilUsuario.add("button", undefined, "\u270D Editar Nome");
    btnEditarNome.onClick = function () {
        var novoNome = prompt("Digite o novo nome:");
        if (novoNome) {
            nomeUsuario = novoNome;
            nomeUsuarioLabel.text = "Olá, " + nomeUsuario + "!";
            salvarNomeUsuario(nomeUsuario);
        }
    };

    var btnAlterarCorPainel = perfilUsuario.add("button", undefined, "🌈 Alterar Cor do Painel🌈");
    btnAlterarCorPainel.alignment = "right";
    btnAlterarCorPainel.onClick = function () {
        var cores = [];
        for (var i = 0; i < coresPredefinidas.length; i++) {
            var cor = coresPredefinidas[i];
            cores.push(cor[0] * 255 + "," + cor[1] * 255 + "," + cor[2] * 255);
        }
        var corSelecionada = dropdownList(cores, corPainel[0] * 255 + "," + corPainel[1] * 255 + "," + corPainel[2] * 255);
        if (corSelecionada) {
            var rgb = corSelecionada.split(",");
            corPainel = [parseFloat(rgb[0]) / 255, parseFloat(rgb[1]) / 255, parseFloat(rgb[2]) / 255];
            painelBoasVindas.graphics.backgroundColor = painelBoasVindas.graphics.newBrush(painelBoasVindas.graphics.BrushType.SOLID_COLOR, corPainel);
            salvarCorPainel(corPainel);
        }
    };

    var btnSair = perfilUsuario.add("button", undefined, "👋Sair");
    btnSair.onClick = function () {
        janelaBoasVindas.close();
    };

    var tituloBoasVindas = painelBoasVindas.add("statictext", undefined, "📸 Bem-Vindo ao Aplicativo 📸");
    tituloBoasVindas.graphics.font = ScriptUI.newFont("Arial-Bold", 24);
    tituloBoasVindas.alignment = "center";

    var mensagemBoasVindas = painelBoasVindas.add("statictext", undefined, "Escolha uma opção abaixo:");
    mensagemBoasVindas.alignment = "center";

    var btnContinuarNumeracao = painelBoasVindas.add("button", undefined, "🔢 Adicionar Numeração");
    btnContinuarNumeracao.onClick = function () {
        janelaBoasVindas.close();
        criarPainelNumeracao();
    };

    var btnCortarImagens = painelBoasVindas.add("button", undefined, "✂️ CORTAR IMAGENS");
    btnCortarImagens.onClick = function () {
        janelaBoasVindas.close();
        criarPainelCortarImagens();
    };

    var btnContinuarFotosBrinde = painelBoasVindas.add("button", undefined, "🎁 Fotos Brinde");
    btnContinuarFotosBrinde.onClick = function () {
        janelaBoasVindas.close();
        criarPainelFotosBrinde();
    };

    var btnVerificarFotos = painelBoasVindas.add("button", undefined, "Verificar Fotos");
    btnVerificarFotos.onClick = function () {
        janelaBoasVindas.close();
        criarPainelVerificarFotos(); // Chama a função para criar o painel de verificação de fotos
    };


    var textoRodape = janelaBoasVindas.add("statictext", undefined, "© 2024 GRIDSTUDIO. Todos os direitos reservados.");
textoRodape.alignment = "center";

var textoVersao = painelBoasVindas.add("statictext", undefined, "Versão 3.2.0 - Desenvolvido por WELL - Painel sujeito a alterações.");
textoVersao.alignment = "center";
textoVersao.graphics.foregroundColor = textoVersao.graphics.newPen(textoVersao.graphics.PenType.SOLID_COLOR, [0.5, 0.5, 0.5], 1);

// Adicione um texto clicável "Baixar Nova Versão"
var linkBaixarNovaVersao = painelBoasVindas.add("statictext", undefined, "🔄 Baixar Nova Versão");
linkBaixarNovaVersao.alignment = "center";
linkBaixarNovaVersao.graphics.foregroundColor = linkBaixarNovaVersao.graphics.newPen(linkBaixarNovaVersao.graphics.PenType.SOLID_COLOR, [0, 0, 1], 1);
linkBaixarNovaVersao.onClick = function () {
    var folderPath = "\\\\desktop-a4rb6i8\\produção\\EDIÇÕES\\PAINEL";

    // Verifica se o caminho da pasta existe
    var folder = new Folder(folderPath);
    if (folder.exists) {
        folder.execute(); // Abre a pasta especificada
    } else {
        alert("A pasta especificada não foi encontrada.");
    }
};

    janelaBoasVindas.show();
}

function dropdownList(opcoes, selecionado) {
    var dialog = new Window("dialog", "Selecione uma Cor");
    dialog.orientation = "column";
    var dropdown = dialog.add("dropdownlist");

    for (var i = 0; i < opcoes.length; i++) {
        dropdown.add("item", opcoes[i]);
    }

    if (selecionado) {
        for (var i = 0; i < opcoes.length; i++) {
            if (opcoes[i].toString() === selecionado.toString()) {
                dropdown.selection = i;
                break;
            }
        }
    }

    var btnOK = dialog.add("button", undefined, "OK");
    btnOK.onClick = function () {
        dialog.close();
    };
    dialog.show();
    return dropdown.selection ? dropdown.selection.text : null;
}
// Função para criar o painel de verificação de fotos
function criarPainelVerificarFotos() {
    var janela = new Window("dialog", "Verificar Fotos");
    janela.preferredSize = [400, 200];
    var painel = janela.add("panel");
    painel.alignment = "fill";
    painel.alignChildren = "fill";
    painel.spacing = 15;

    var textoTitulo = painel.add("statictext", undefined, "Selecione a pasta contendo suas imagens:");
    var btnSelecionarPasta = painel.add("button", undefined, "Selecionar Pasta");

    btnSelecionarPasta.onClick = function () {
        var pasta = Folder.selectDialog("Selecione a pasta contendo suas imagens.");
        if (pasta) {
            janela.close(); // Fechar a janela de diálogo após a seleção da pasta
            verificarFotos(pasta);
        }
    };

    
    janela.show();
}

    function verificarFotos(pasta) {
    var arquivos = pasta.getFiles("*.jpg"); // Pode ajustar a extensão conforme necessário
    var numFotosPorNumero = {}; // Dicionário para contar quantas fotos há por número

    // Conta quantas fotos há para cada número
    for (var i = 0; i < arquivos.length; i++) {
        var nomeArquivo = arquivos[i].name;
        var match = nomeArquivo.match(/(\d+-\d+)/);

        if (match) {
            var numero = match[0];
            if (!numFotosPorNumero[numero]) {
                numFotosPorNumero[numero] = 1;
            } else {
                numFotosPorNumero[numero]++;
            }
        }
    }

    // Verifica se há grupos de fotos com menos ou mais de três fotos com o mesmo número
    var numerosComProblemas = [];
    for (var numero in numFotosPorNumero) {
        if (numFotosPorNumero.hasOwnProperty(numero)) {
            var numFotos = numFotosPorNumero[numero];
            if (numFotos !== 3) {
                var mensagem = "Número " + numero + ": ";
                mensagem += numFotos > 3 ? "Há fotos a mais" : "Faltam fotos";
                numerosComProblemas.push(mensagem);
            }
        }
    }

    // Exibe o painel com os resultados
    var janela = new Window("dialog", "Verificação de Fotos");
    janela.preferredSize = [400, 200];
    var painel = janela.add("panel");
    painel.alignment = "fill";
    painel.alignChildren = "fill";
    painel.spacing = 15;

    var textoTitulo = painel.add("statictext", undefined, "Resultado da Verificação:");
    textoTitulo.alignment = "center";

    if (numerosComProblemas.length > 0) {
        for (var i = 0; i < numerosComProblemas.length; i++) {
            var textoProblema = painel.add("statictext", undefined, numerosComProblemas[i]);
            textoProblema.alignment = "center";
            textoProblema.graphics.foregroundColor = textoProblema.graphics.newPen(textoProblema.graphics.PenType.SOLID_COLOR, [1, 0, 0], 1);
            textoProblema.graphics.font = ScriptUI.newFont("Tahoma-Bold", "BOLD", 14);
        }
    } else {
        var textoTodasCorretas = painel.add("statictext", undefined, "Todas as fotos estão corretas.");
        textoTodasCorretas.alignment = "center";
        textoTodasCorretas.graphics.foregroundColor = textoTodasCorretas.graphics.newPen(textoTodasCorretas.graphics.PenType.SOLID_COLOR, [0, 1, 0], 1);
        textoTodasCorretas.graphics.font = ScriptUI.newFont("Tahoma-Bold", "BOLD", 14);
    }

     // Botão para voltar para o menu principal
    var btnVoltar = painel.add("button", undefined, "Voltar para o Menu Principal");
    btnVoltar.onClick = function() {
        janela.close();
        janelaBoasVindas.show(); // Mostrar a janela de boas-vindas novamente
    };

    janela.show();
}


function criarPainelNumeracao() {
    var janela = new Window("dialog", "Adicionar Numeração");
    janela.preferredSize = [400, 300];
    var painel = janela.add("panel");
    painel.alignment = "fill";
    painel.alignChildren = "fill";
    painel.spacing = 15;
    var titulo = painel.add("statictext", undefined, "🔢 Painel de Adicionar Numeração");
    titulo.graphics.font = ScriptUI.newFont("Arial-Bold", "Bold", 24);
    titulo.alignment = "center";
    var grupo = painel.add("group");
    grupo.orientation = "column";
    grupo.alignChildren = "fill";
    grupo.spacing = 15;
    var campoOrigem = grupo.add("edittext", undefined, "Caminho da Pasta de Origem");
    campoOrigem.characters = 30;
    var btnSelecionarOrigem = grupo.add("button", undefined, "📂 Selecionar Pasta de Origem");
    btnSelecionarOrigem.helpTip = "Selecionar a pasta de origem";
    var tamanhoFonteSlider = grupo.add("slider", undefined, 10, 1, 20);
    var tamanhoFonteValor = grupo.add("statictext", undefined, "Tamanho da Fonte: 10");

    btnSelecionarOrigem.onClick = function () {
        var pastaOrigem = Folder.selectDialog("Selecione a pasta de origem");
        if (pastaOrigem) {
            campoOrigem.text = pastaOrigem.fsName;
        }
    };

    var btnAdicionarNumeracao = grupo.add("button", undefined, "Adicionar Numeração");
    var btnVoltar = grupo.add("button", undefined, "🔙 Voltar");

    btnAdicionarNumeracao.onClick = function () {
        // Adicione aqui o código para adicionar a numeração
    };

    btnVoltar.onClick = function () {
        janela.close();
        criarJanelaBoasVindas();
    };

    var result = janela.show();
}

function criarPainelCortarImagens() {
    var janela = new Window("dialog", "Cortar Imagens");
    janela.preferredSize = [400, 300];
    var painel = janela.add("panel");
    painel.alignment = "fill";
    painel.alignChildren = "fill";
    painel.spacing = 15;
    var titulo = painel.add("statictext", undefined, "✂️ Painel de Cortar Imagens");
    titulo.graphics.font = ScriptUI.newFont("Arial-Bold", "Bold", 24);
    titulo.alignment = "center";
    var grupo = painel.add("group");
    grupo.orientation = "column";
    grupo.alignChildren = "fill";
    grupo.spacing = 15;
    var tamanhoSlider = grupo.add("slider", undefined, 10, 1, 20);
    var tamanhoValor = grupo.add("statictext", undefined, "Tamanho: 10");

    var btnOK = grupo.add("button", undefined, "OK");
    btnOK.onClick = function () {
        // Adicione aqui o código para cortar as imagens
    };

    var btnVoltar = grupo.add("button", undefined, "🔙 Voltar");
    btnVoltar.onClick = function () {
        janela.close();
        criarJanelaBoasVindas();
    };

    var result = janela.show();
}

function criarPainelFotosBrinde() {
    var janela = new Window("dialog", "Fotos Brinde");
    janela.preferredSize = [400, 300];
    var painel = janela.add("panel");
    painel.alignment = "fill";
    painel.alignChildren = "fill";
    painel.spacing = 15;
    var titulo = painel.add("statictext", undefined, "🎁 Painel de Fotos Brinde");
    titulo.graphics.font = ScriptUI.newFont("Arial-Bold", "Bold", 24);
    titulo.alignment = "center";
    var grupo = painel.add("group");
    grupo.orientation = "column";
    grupo.alignChildren = "fill";
    grupo.spacing = 15;
    var tamanhoSlider = grupo.add("slider", undefined, 10, 1, 20);
    var tamanhoValor = grupo.add("statictext", undefined, "Tamanho: 10");

    var btnOK = grupo.add("button", undefined, "OK");
    btnOK.onClick = function () {
        // Adicione aqui o código para gerar as fotos brinde
    };

    var btnVoltar = grupo.add("button", undefined, "🔙 Voltar");
    btnVoltar.onClick = function () {
        janela.close();
        criarJanelaBoasVindas();
    };

    var result = janela.show();
}



function criarPainelCortarImagens() {
    var janelaCortarImagens = new Window("dialog", "✂️ Cortar Imagens");
    janelaCortarImagens.preferredSize = [300, 150];

    var dialog = janelaCortarImagens.add("panel");
    dialog.text = "Escolha o tamanho de corte:";
    dialog.orientation = "column";

    var sizesGroup = dialog.add("group");
    sizesGroup.orientation = "row";
    sizesGroup.alignment = "left";

    var sizeLabel = sizesGroup.add("statictext", undefined, "Tamanho:");
    var sizeDropdown = sizesGroup.add("dropdownlist", undefined, ["30X45 DEITADA", "30X45 EM PÉ", "15X21 DEITADA", "15X21 EM PÉ"]);
    sizeDropdown.selection = 0;

    var confirmButton = dialog.add("button", undefined, "OK");
    confirmButton.onClick = function() {
        janelaCortarImagens.close();
        var selectedSize = sizeDropdown.selection.text;
        executeCorteImagens(selectedSize);
    };

    var backButton = dialog.add("button", undefined, "⬅️ Voltar");
    backButton.onClick = function() {
        janelaCortarImagens.close();
        criarJanelaBoasVindas();  // Supondo que esta função existe para criar o painel principal
    };

    janelaCortarImagens.show();
}

function executeCorteImagens(selectedSize) {
    var folder = Folder.selectDialog("Selecione a pasta de fotos que deseja realizar o corte");
    if (folder) {
        var fileList = folder.getFiles(/\.(jpg|jpeg|png|gif|bmp|tiff)$/i);

        if (fileList.length > 0) {
            var targetWidth, targetHeight;

            if (selectedSize === "30X45 DEITADA") {
                targetWidth = 6000;
                targetHeight = 4000;
            } else if (selectedSize === "30X45 EM PÉ") {
                targetWidth = 2857;
                targetHeight = 4000;
            } else if (selectedSize === "15X21 DEITADA") {
                targetWidth = 5600;
                targetHeight = 4000;
            } else if (selectedSize === "15X21 EM PÉ") {
                targetWidth = 2667;
                targetHeight = 4000;
            }

            for (var i = 0; i < fileList.length; i++) {
                open(fileList[i]);
                var doc = app.activeDocument;

                applyCrop(doc, targetWidth, targetHeight);

                // Salvar o documento com a resolução desejada e qualidade máxima
                var saveOptions = new JPEGSaveOptions();
                saveOptions.quality = 12;
                doc.saveAs(fileList[i], saveOptions, true);

                doc.close(SaveOptions.DONOTSAVECHANGES);
            }
            alert("Cortes aplicados com sucesso a todas as imagens na pasta.");
        } else {
            alert("A pasta não contém arquivos de imagem (por exemplo, JPEG).");
        }
    } else {
        alert("Nenhuma pasta de fotos selecionada.");
    }
}

// Função para aplicar o corte central
function applyCrop(doc, targetWidth, targetHeight) {
    var targetResolution = 300; // DPI desejado
    var isLandscape = doc.width > doc.height;

    var left = isLandscape ? (doc.width - targetWidth) / 2 : 0;
    var top = isLandscape ? 0 : (doc.height - targetHeight) / 2;
    var right = left + targetWidth;
    var bottom = top + targetHeight;

    doc.crop([left, top, right, bottom]);

    doc.resizeImage(doc.width, doc.height, targetResolution, ResampleMethod.BICUBIC);
}



function dropdownList(opcoes, selecionado) {
    var dialog = new Window("dialog", "Selecione uma Cor");
    dialog.orientation = "column";
    var dropdown = dialog.add("dropdownlist");

    for (var i = 0; i < opcoes.length; i++) {
        dropdown.add("item", opcoes[i]);
    }

    if (selecionado) {
        for (var i = 0; i < opcoes.length; i++) {
            if (opcoes[i] === selecionado) {
                dropdown.selection = i;
                break;
            }
        }
    }

    var btnOK = dialog.add("button", undefined, "OK");
    btnOK.onClick = function () {
        corSelecionada = dropdown.selection.text;
        dialog.close();
    };
    dialog.show();
    return corSelecionada;
}
function criarPainelNumeracao() {
    var janela = new Window("dialog", "Adicionar Numeração");
    janela.preferredSize = [400, 300];
    var painel = janela.add("panel");
    painel.alignment = "fill";
    painel.alignChildren = "fill";
    painel.spacing = 15;
    var titulo = painel.add("statictext", undefined, "🔢 Painel de Adicionar Numeração");
    titulo.graphics.font = ScriptUI.newFont("Arial-Bold", "Bold", 24);
    titulo.alignment = "center";
    var grupo = painel.add("group");
    grupo.orientation = "column";
    grupo.alignChildren = "fill";
    grupo.spacing = 15;
    var campoOrigem = grupo.add("edittext", undefined, "Caminho da Pasta de Origem");
    campoOrigem.characters = 30;
    var btnSelecionarOrigem = grupo.add("button", undefined, "📂 Selecionar Pasta de Origem");
    btnSelecionarOrigem.helpTip = "Selecionar a pasta de origem";
    var tamanhoFonteSlider = grupo.add("slider", undefined, 10, 1, 20);
    tamanhoFonteSlider.onChanging = function () {
        tamanhoFonteValor.text = Math.round(tamanhoFonteSlider.value);
    };
    var tamanhoFonteValor = grupo.add("statictext", undefined, "Tamanho da Fonte: 10");

    // Adicione a opção para escolher a fonte
    var listaFontes = grupo.add("dropdownlist");
    for (var i = 0; i < fontesDisponiveis.length; i++) {
        listaFontes.add("item", fontesDisponiveis[i].name);
    }
    listaFontes.selection = 0;

    var grupoCores = grupo.add("group");
    grupoCores.orientation = "row";
    grupoCores.alignChildren = "fill";
    grupoCores.spacing = 20;
    grupoCores.add("statictext", undefined, "🎨 Cor da Fonte:");
    var listaCores = grupoCores.add("dropdownlist");
    listaCores.add("item", "Vermelho");
    listaCores.add("item", "Verde");
    listaCores.add("item", "Azul");
    listaCores.add("item", "Amarelo");
    listaCores.add("item", "Rosa");
    listaCores.add("item", "Laranja");
    listaCores.add("item", "Roxo");
    listaCores.add("item", "Ciano");
    listaCores.add("item", "preto");
    listaCores.add("item", "Branco");
    listaCores.selection = 0;

    var btnAdicionarNumeracao = grupo.add("button", undefined, "Adicionar Numeração");
    var btnVoltar = grupo.add("button", undefined, "🔙 Voltar");

    btnSelecionarOrigem.onClick = function () {
        var pastaOrigem = Folder.selectDialog("Selecione a pasta de origem");
        if (pastaOrigem) {
            campoOrigem.text = pastaOrigem.fsName;
        }
    };

    btnAdicionarNumeracao.onClick = function () {
        var pastaOrigem = new Folder(campoOrigem.text);
        if (!pastaOrigem.exists) {
            alert("Pasta de origem inválida.");
            return;
        }
        var tamanhoFonte = Math.round(tamanhoFonteSlider.value);
        var corSelecionada = listaCores.selection.text.toLowerCase();
        var corRGB;
        switch (corSelecionada) {
            case "vermelho":
                corRGB = [255, 0, 0];
                break;
            case "verde":
                corRGB = [0, 255, 0];
                break;
            case "azul":
                corRGB = [0, 0, 255];
                break;
            case "amarelo":
                corRGB = [255, 255, 0];
                break;
            case "rosa":
                corRGB = [255, 192, 203];
                break;
            case "laranja":
                corRGB = [255, 165, 0];
                break;
            case "roxo":
                corRGB = [128, 0, 128];
                break;
            case "ciano":
                corRGB = [0, 255, 255];
                break;
            case "preto":
                    corRGB = [0, 0, 0];
                    break;                
            case "Branco":
                    corRGB = [255, 255, 255];
                    break;              
            default:
                corRGB = [0, 0, 0];
        }

        // Adicione a seleção de fonte
        var fonteSelecionada = fontesDisponiveis[listaFontes.selection.index];

        processarImagens(pastaOrigem, tamanhoFonte, corRGB, fonteSelecionada);
        alert("Processo concluído. As imagens foram processadas.");
    };

    btnVoltar.onClick = function () {
        janela.close();
        criarJanelaBoasVindas();
    };

    var result = janela.show();
}
function processarImagens(pastaOrigem, tamanhoFonte, corRGB) {
    var arquivos = pastaOrigem.getFiles("*.jpg"); // Filtra apenas arquivos JPG na pasta de origem

    for (var i = 0; i < arquivos.length; i++) {
        if (arquivos[i] instanceof File) {
            var imagem = app.open(arquivos[i]);

            var nomeArquivo = arquivos[i].name;
            var match = nomeArquivo.match(/(\d+-\d+)/);

            if (match) {
                var textoNum = match[0];
                var textoLayer = imagem.artLayers.add();
                textoLayer.kind = LayerKind.TEXT;
                textoLayer.textItem.contents = textoNum;
                var textoItem = textoLayer.textItem;
                textoItem.color.rgb.red = corRGB[0];
                textoItem.color.rgb.green = corRGB[1];
                textoItem.color.rgb.blue = corRGB[2];
                textoItem.size = tamanhoFonte;
                var margemEsquerda = 20;
                var margemInferior = 20;
                textoItem.position = Array(margemEsquerda, imagem.height - margemInferior);

                var caminhoSalvo = new File(pastaOrigem + "/" + nomeArquivo);
                var opcoesSalvar = new JPEGSaveOptions();
                opcoesSalvar.quality = 12;
                imagem.saveAs(caminhoSalvo, opcoesSalvar, true);
                imagem.close(SaveOptions.DONOTSAVECHANGES);
            }
        }
    }
}
function criarPainelFotosBrinde() {
    var janela = new Window("dialog", "Fotos Brinde");
    janela.preferredSize = [400, 300];
    var painel = janela.add("panel");
    painel.alignment = "fill";
    painel.alignChildren = "fill";
    painel.spacing = 15;
    var titulo = painel.add("statictext", undefined, "🎁 Painel de Fotos Brinde");
    titulo.graphics.font = ScriptUI.newFont("Arial-Bold", "Bold", 24);
    titulo.alignment = "center";
    var grupo = painel.add("group");
    grupo.orientation = "column";
    grupo.alignChildren = "fill";
    grupo.spacing = 15;
    var overlayImageLabel = grupo.add("statictext", undefined, "Selecione a imagem de sobreposição BRINDE (PNG):");
    overlayImageLabel.graphics.font = ScriptUI.newFont("Arial", "Regular", 16);
    var overlayImageInput = grupo.add("edittext", undefined, "");
    overlayImageInput.characters = 30;
    var btnSelecionarOverlayImage = grupo.add("button", undefined, "📷Selecionar Imagem");
    var btnAplicarBrinde = grupo.add("button", undefined, "Aplicar Brinde");

    btnSelecionarOverlayImage.onClick = function () {
        var file = File.openDialog("Selecione a imagem de sobreposição BRINDE (PNG)", "*.png");
        if (file) {
            overlayImageInput.text = file.fsName;
        }
    };

    btnAplicarBrinde.onClick = function () {
        var overlayImagePath = overlayImageInput.text;
        if (!overlayImagePath) {
            alert("Selecione uma imagem de sobreposição BRINDE.");
            return;
        }

        var overlayImageFile = new File(overlayImagePath);
        if (!overlayImageFile.exists) {
            alert("O arquivo da imagem de sobreposição BRINDE não foi encontrado.");
            return;
        }

        // Adicione aqui o código para aplicar a imagem de sobreposição BRINDE às fotos
        var overlayImage = app.open(overlayImageFile);
        overlayImage.layers[0].blendMode = BlendMode.NORMAL;
        overlayImage.activeLayer.copy();

        var folder = Folder.selectDialog("Selecione a pasta onde estão suas fotos");
        if (folder) {
            var imageFiles = folder.getFiles("*.jpg");
            if (imageFiles.length > 0) {
                for (var i = 0; i < imageFiles.length; i++) {
                    var imagePath = imageFiles[i].absoluteURI;
                    var doc = app.open(new File(imagePath));
                    app.activeDocument = doc;
                    doc.paste();
                    var margemEsquerda = 20;
                    var margemInferior = 20;
                    var pastedLayer = doc.activeLayer;
                    pastedLayer.translate(margemEsquerda, doc.height - pastedLayer.bounds[3] - margemInferior);
                    var caminhoSalvo = new File(imagePath);
                    var opcoesSalvar = new JPEGSaveOptions();
                    opcoesSalvar.quality = 12;
                    doc.saveAs(caminhoSalvo, opcoesSalvar, true);
                    doc.close(SaveOptions.DONOTSAVECHANGES);
                }
                overlayImage.close(SaveOptions.DONOTSAVECHANGES);
                alert("Processo concluído. O brinde foi aplicado às fotos.");
            } else {
                alert("Nenhuma imagem válida encontrada na pasta selecionada.");
            }
        }
    };

    var btnVoltar = grupo.add("button", undefined, "⬅️Voltar");

    btnVoltar.onClick = function () {
        janela.close();
        criarJanelaBoasVindas();
    };

    var result = janela.show();
}

criarJanelaBoasVindas();

