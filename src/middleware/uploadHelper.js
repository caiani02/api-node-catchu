const multer = require('multer');
const fs = require('fs');

// Função que cria a configuração do Multer dinamicamente
const uploadImage = (destinationFolder) => {
  // Validação para garantir que a pasta de destino foi fornecida
  if (!destinationFolder) {
    throw new Error("O nome da pasta de destino é obrigatório.");
  }

  const fullPath = `./public/${destinationFolder}/`;

  // Garante que o diretório de destino exista, se não, cria
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }

  // Configuração do Storage (onde e como salvar)
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, fullPath);
    },
    filename: function (req, file, cb) {
      // Preserva o nome original do arquivo (sanitizado)
      // Ex: 'Celular preto.png' -> 'Celular_preto.png'
      // Remove caracteres perigosos e normaliza espaços
      let originalName = file.originalname || 'arquivo.png';
      // Substitui espaços por underline e remove caracteres não permitidos
      originalName = originalName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
      // Se por algum motivo ficou vazio, use um fallback
      if (!originalName) originalName = `arquivo.png`;
      cb(null, originalName);
    }
  });

  // Filtro para aceitar apenas certos tipos de imagem
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/gif'
    ) {
      cb(null, true);
    } else {
      // Rejeita o arquivo com uma mensagem de erro
      cb(new Error('Formato de imagem não suportado! Use JPEG, JPG, PNG ou GIF.'), false);
    }
  };

  // Retorna a instância do Multer configurada
  return multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5, // 5MB
    },
    fileFilter: fileFilter,
  });
};

module.exports = uploadImage;
