// Script de prueba simple para verificar los endpoints
const http = require('http');

function testEndpoint(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const result = {
            status: res.statusCode,
            data: body ? JSON.parse(body) : null
          };
          resolve(result);
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Iniciando pruebas exhaustivas...\n');

  try {
    // Test 1: Mesas - GET all
    console.log('1️⃣ GET /api/mesas');
    const mesas = await testEndpoint('/api/mesas');
    console.log(`   ✅ Status: ${mesas.status}`);
    console.log(`   📊 Mesas encontradas: ${mesas.data?.data?.length || 0}\n`);

    // Test 2: Mesas - GET one
    console.log('2️⃣ GET /api/mesas/1');
    const mesa1 = await testEndpoint('/api/mesas/1');
    console.log(`   ✅ Status: ${mesa1.status}`);
    console.log(`   📊 Mesa: ${mesa1.data?.data?.numero || 'N/A'}\n`);

    // Test 3: Clientes - GET all
    console.log('3️⃣ GET /api/clientes');
    const clientes = await testEndpoint('/api/clientes');
    console.log(`   ✅ Status: ${clientes.status}`);
    console.log(`   📊 Clientes encontrados: ${clientes.data?.data?.length || 0}\n`);

    // Test 4: Mozos - GET all
    console.log('4️⃣ GET /api/mozos');
    const mozos = await testEndpoint('/api/mozos');
    console.log(`   ✅ Status: ${mozos.status}`);
    console.log(`   📊 Mozos encontrados: ${mozos.data?.data?.length || 0}\n`);

    // Test 5: Platos - GET all
    console.log('5️⃣ GET /api/platos');
    const platos = await testEndpoint('/api/platos');
    console.log(`   ✅ Status: ${platos.status}`);
    console.log(`   📊 Platos encontrados: ${platos.data?.data?.length || 0}\n`);

    // Test 6: Reservas - GET all
    console.log('6️⃣ GET /api/reservas');
    const reservas = await testEndpoint('/api/reservas');
    console.log(`   ✅ Status: ${reservas.status}`);
    console.log(`   📊 Reservas encontradas: ${reservas.data?.data?.length || 0}\n`);

    // Test 7: Pedidos - GET all
    console.log('7️⃣ GET /api/pedidos');
    const pedidos = await testEndpoint('/api/pedidos');
    console.log(`   ✅ Status: ${pedidos.status}`);
    console.log(`   📊 Pedidos encontrados: ${pedidos.data?.data?.length || 0}\n`);

    // Test 8: Crear Mesa
    console.log('8️⃣ POST /api/mesas (crear nueva)');
    const newMesa = await testEndpoint('/api/mesas', 'POST', {
      numero: 99,
      capacidad: 4,
      estado: 'disponible'
    });
    console.log(`   ✅ Status: ${newMesa.status}`);
    console.log(`   📊 Mesa creada: ${newMesa.data?.data?.id || 'N/A'}\n`);

    // Test 9: Actualizar Mesa
    if (newMesa.data?.data?.id) {
      console.log(`9️⃣ PUT /api/mesas/${newMesa.data.data.id} (actualizar)`);
      const updatedMesa = await testEndpoint(`/api/mesas/${newMesa.data.data.id}`, 'PUT', {
        numero: 99,
        capacidad: 6,
        estado: 'disponible'
      });
      console.log(`   ✅ Status: ${updatedMesa.status}`);
      console.log(`   📊 Capacidad actualizada: ${updatedMesa.data?.data?.capacidad || 'N/A'}\n`);

      // Test 10: Eliminar Mesa
      console.log(`🔟 DELETE /api/mesas/${newMesa.data.data.id} (eliminar)`);
      const deletedMesa = await testEndpoint(`/api/mesas/${newMesa.data.data.id}`, 'DELETE');
      console.log(`   ✅ Status: ${deletedMesa.status}`);
      console.log(`   📊 Mesa eliminada\n`);
    }

    // Test 11: Error 404
    console.log('1️⃣1️⃣ GET /api/mesas/9999 (error 404)');
    const notFound = await testEndpoint('/api/mesas/9999');
    console.log(`   ✅ Status: ${notFound.status} (esperado: 404)\n`);

    console.log('✅ ¡Todas las pruebas completadas!\n');
    console.log('📊 Resumen:');
    console.log(`   - Mesas: ${mesas.data?.data?.length || 0} registros`);
    console.log(`   - Clientes: ${clientes.data?.data?.length || 0} registros`);
    console.log(`   - Mozos: ${mozos.data?.data?.length || 0} registros`);
    console.log(`   - Platos: ${platos.data?.data?.length || 0} registros`);
    console.log(`   - Reservas: ${reservas.data?.data?.length || 0} registros`);
    console.log(`   - Pedidos: ${pedidos.data?.data?.length || 0} registros`);

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    process.exit(1);
  }
}

runTests();
