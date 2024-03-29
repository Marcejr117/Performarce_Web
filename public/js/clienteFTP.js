// Instala la biblioteca ftp.js (npm install ftp.js)
const Ftp = require('ftp');

// Configura las credenciales de tu servidor FTP
const ftpConfig = {
  host: 'tu-servidor-ftp.com',
  user: 'tu-usuario',
  password: 'tu-contraseña',
};

// Crea una conexión FTP
const client = new Ftp();
client.connect(ftpConfig);

// Cuando se conecte correctamente
client.on('ready', () => {
  // Obtén la lista de archivos en el directorio
  client.list((err, files) => {
    if (err) {
      console.error('Error al obtener la lista de archivos:', err);
      return;
    }

    // Filtra solo los archivos PDF
    const pdfFiles = files.filter(file => file.type === 'f' && file.name.endsWith('.pdf'));

    // Muestra los nombres de los archivos PDF en tu sitio web
    pdfFiles.forEach(pdfFile => {
      console.log('Nombre del archivo PDF:', pdfFile.name);
      // Aquí puedes agregar lógica para mostrar los nombres en tu página web
    });

    // Cierra la conexión FTP
    client.end();
  });
});

// Manejo de errores
client.on('error', err => {
  console.error('Error en la conexión FTP:', err);
});