// Script rápido para probar el servidor
const http = require('http');

console.log('🧪 Probando servidor...\n');

// Esperar 3 segundos para que el servidor inicie
setTimeout(() => {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/mesas',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ Servidor funcionando correctamente!');
        console.log('✅ Status:', res.statusCode);
        console.log('✅ Respuesta:', JSON.parse(data));
        console.log('\n🎉 El error ha sido solucionado!');
        process.exit(0);
      } else {
        console.log('❌ Error:', res.statusCode);
        console.log('Respuesta:', data);
        process.exit(1);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Error al conectar:', error.message);
    console.log('⚠️  Asegúrate de que el servidor esté corriendo con: npm run start:dev');
    process.exit(1);
  });

  req.end();
}, 3000);

console.log('⏳ Esperando 3 segundos para que el servidor inicie...');
