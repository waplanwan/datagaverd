// ===== DATOS Y CONFIGURACIÓN =====

let AGAVERAS_CONFIG = {
    "CARLOS": [
        "LA CAJA ( PACO VAZQUEZ)",
        "EL VENADO",
        "PARCELA 738 2022",
        "PARCELA 1996 2022",
        "PARCELA 758 2022",
        "EL HUAMUCHIL 2022",
        "PARCELA 58 2022",
        "PARCELA 738 2023",
        "EL BORDO 2022",
        "PARCELA 1996 2023",
        "PARCELA 758 2023",
        "EL HUAMUCHIL 2023",
        "EL CHORREADO 2021",
        "PARCELA 58 2023",
        "PORTEZUELO 137 2022",
        "EL BORDO 2023"
    ],
    "LA UNION": [
        "ANDRES ROJO",
        "ASTILLEROS 1",
        "ASTILLEROS 2",
        "ASTILLEROS 3",
        "ASTILLEROS 4",
        "EL ARROYO",
        "LA CAJA 1",
        "LA LOMA",
        "LAS TEJAS",
        "LUIS CARMONA",
        "OSCAR BARBOSA",
        "LOS BAMBU 22",
        "LOS BAMBU 25",
        "LOS LOCALES",
        "PANDITO 2 2018",
        "PANDITO 2 2019",
        "PANDITO 3 2018",
        "PANDITO 3 2019",
        "PANDITO 4",
        "PARCELA 10",
        "PORTEZUELO",
        "POTRERILLOS 1",
        "POTRERILLOS 2",
        "POTRERILLOS 3",
        "SAN ANTONIO 2019",
        "SAN ANTONIO 2020",
        "TANHUATO"
    ],
    "JOSE & IGNACIO": [
        "PEÑA BLANCA",
        "CARLOS PEREZ",
        "CARMEN 32",
        "JAMAY"
    ],
    "GDL": [
        "PASO BLANCO 2021",
        "PASO BLANCO 2022",
        "CESAR BARBOSA (EL MEDICO)",
        "LA CASCADA",
        "TOTOTLAN"
    ],
    "MESA DE PIEDRA": [
        "ARENAL 2023",
        "ARENAL 2024",
        "ARENAL 2025"
    ],
    "NAVARRO & CASARIN": [
        "MORALES",
        "MALTARAÑAS"
    ],
    "IGNACIO CASTELLANOS": []
};

// Cargar configuración personalizada si existe
function cargarConfiguracion() {
    const saved = localStorage.getItem('agaveras_config');
    if (saved) {
        AGAVERAS_CONFIG = JSON.parse(saved);
    }
}

function guardarConfiguracion() {
    localStorage.setItem('agaveras_config', JSON.stringify(AGAVERAS_CONFIG));
}

// Usuarios del sistema
const USUARIOS = {
    "admin": { password: "admin123", role: "Super Admin" },
    "capturista": { password: "captura123", role: "Capturista" }
};

let currentUser = null;
let currentUserRole = null;

// ===== ALMACENAMIENTO LOCAL =====

function guardarDatos(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function cargarDatos(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

// ===== LOGIN =====

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (USUARIOS[username] && USUARIOS[username].password === password) {
        currentUser = username;
        currentUserRole = USUARIOS[username].role;
        document.getElementById('currentUser').textContent = username;
        document.getElementById('userRole').textContent = currentUserRole;
        
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('appContainer').classList.add('active');
        
        inicializarApp();
    } else {
        alert('Usuario o contraseña incorrectos');
    }
});

function logout() {
    if (confirm('¿Seguro que deseas cerrar sesión?')) {
        currentUser = null;
        currentUserRole = null;
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('appContainer').classList.remove('active');
        document.getElementById('loginForm').reset();
    }
}

// ===== NAVEGACIÓN =====

function showModule(moduleId) {
    // Ocultar todos los módulos
    document.querySelectorAll('.module-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar módulo seleccionado
    document.getElementById(moduleId).classList.add('active');
    
    // Actualizar menú
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Cargar datos del módulo
    if (moduleId === 'dashboard') cargarDashboard();
    if (moduleId === 'caja') {
        actualizarSaldos();
        cargarTablaCaja();
    }
    if (moduleId === 'nomina') cargarTablaNomina();
    if (moduleId === 'gastos') cargarTablaGastos();
    if (moduleId === 'jima') cargarTablaJima();
    if (moduleId === 'reportes') {
        cargarSelectsFiltrosReportes();
        cargarReportes();
        actualizarGraficas();
    }
    if (moduleId === 'configuracion') cargarConfiguracionModulo();
}

// ===== INICIALIZACIÓN =====

function inicializarApp() {
    cargarConfiguracion();
    cargarDashboard();
    inicializarFormularios();
    cargarSelectsAgaveras();
    setFechaHoy();
    actualizarSaldos();
}

function setFechaHoy() {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('cajaFecha').value = hoy;
    document.getElementById('gastoFecha').value = hoy;
    document.getElementById('jimaFecha').value = hoy;
}

function cargarSelectsAgaveras() {
    const agaveras = Object.keys(AGAVERAS_CONFIG);
    
    // Selects de nómina
    const selectNominaAgavera = document.getElementById('nominaAgavera');
    const filtroNominaAgavera = document.getElementById('filtroNominaAgavera');
    
    // Selects de gastos
    const selectGastoAgavera = document.getElementById('gastoAgavera');
    const filtroGastoAgavera = document.getElementById('filtroGastoAgavera');
    
    // Selects de jima
    const selectJimaAgavera = document.getElementById('jimaAgavera');
    const filtroJimaAgavera = document.getElementById('filtroJimaAgavera');
    
    agaveras.forEach(agavera => {
        selectNominaAgavera.innerHTML += `<option value="${agavera}">${agavera}</option>`;
        filtroNominaAgavera.innerHTML += `<option value="${agavera}">${agavera}</option>`;
        selectGastoAgavera.innerHTML += `<option value="${agavera}">${agavera}</option>`;
        filtroGastoAgavera.innerHTML += `<option value="${agavera}">${agavera}</option>`;
        selectJimaAgavera.innerHTML += `<option value="${agavera}">${agavera}</option>`;
        filtroJimaAgavera.innerHTML += `<option value="${agavera}">${agavera}</option>`;
    });
}

function cargarHuertasNomina() {
    const agavera = document.getElementById('nominaAgavera').value;
    const selectHuerta = document.getElementById('nominaHuerta');
    selectHuerta.innerHTML = '<option value="">Seleccionar...</option>';
    
    if (agavera && AGAVERAS_CONFIG[agavera]) {
        AGAVERAS_CONFIG[agavera].forEach(huerta => {
            selectHuerta.innerHTML += `<option value="${huerta}">${huerta}</option>`;
        });
    }
}

function cargarHuertasGastos() {
    const agavera = document.getElementById('gastoAgavera').value;
    const selectHuerta = document.getElementById('gastoHuerta');
    selectHuerta.innerHTML = '<option value="">Seleccionar...</option>';
    
    if (agavera && AGAVERAS_CONFIG[agavera]) {
        AGAVERAS_CONFIG[agavera].forEach(huerta => {
            selectHuerta.innerHTML += `<option value="${huerta}">${huerta}</option>`;
        });
    }
}

function cargarHuertasJima() {
    const agavera = document.getElementById('jimaAgavera').value;
    const selectHuerta = document.getElementById('jimaHuerta');
    selectHuerta.innerHTML = '<option value="">Seleccionar...</option>';
    
    if (agavera && AGAVERAS_CONFIG[agavera]) {
        AGAVERAS_CONFIG[agavera].forEach(huerta => {
            selectHuerta.innerHTML += `<option value="${huerta}">${huerta}</option>`;
        });
    }
}

// ===== DASHBOARD =====

function cargarDashboard() {
    const caja = cargarDatos('caja');
    const nomina = cargarDatos('nomina');
    const gastos = cargarDatos('gastos');
    const jima = cargarDatos('jima');
    
    // Actualizar saldos bancarios
    actualizarSaldos();
    
    // Calcular estadísticas
    const mesActual = new Date().getMonth();
    const añoActual = new Date().getFullYear();
    const gastosDelMes = gastos.filter(g => {
        const fecha = new Date(g.fecha);
        return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual;
    }).reduce((sum, g) => sum + parseFloat(g.monto), 0);
    
    document.getElementById('statNomina').textContent = nomina.length;
    document.getElementById('statGastos').textContent = formatearMoneda(gastosDelMes);
    document.getElementById('statJima').textContent = jima.length;
    
    // Actividad reciente
    const actividades = [
        ...caja.slice(-5).map(c => ({ ...c, modulo: 'Caja', desc: c.concepto })),
        ...gastos.slice(-5).map(g => ({ ...g, modulo: 'Gastos', desc: g.concepto, monto: g.monto })),
        ...jima.slice(-5).map(j => ({ ...j, modulo: 'Jima', desc: `${j.cliente} - ${j.pinas} piñas`, monto: j.total }))
    ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 10);
    
    const tbody = document.getElementById('actividadReciente');
    tbody.innerHTML = actividades.length === 0 ? 
        '<tr><td colspan="4" style="text-align: center; padding: 40px; color: #999;">No hay actividad reciente</td></tr>' :
        actividades.map(a => `
            <tr>
                <td>${a.modulo}</td>
                <td>${a.desc}</td>
                <td>${formatearFecha(a.fecha)}</td>
                <td>${a.monto ? formatearMoneda(a.monto) : '-'}</td>
            </tr>
        `).join('');
}

// ===== CAJA DIARIA =====

function inicializarFormularios() {
    // Form Saldo Inicial
    document.getElementById('formSaldoInicial').addEventListener('submit', function(e) {
        e.preventDefault();
        establecerSaldoInicial();
    });
    
    // Form Caja
    document.getElementById('formCaja').addEventListener('submit', function(e) {
        e.preventDefault();
        guardarCaja();
    });
    
    // Form Nómina
    document.getElementById('formNomina').addEventListener('submit', function(e) {
        e.preventDefault();
        guardarNomina();
    });
    
    // Calcular total nómina automáticamente
    document.getElementById('nominaCuadrilla').addEventListener('input', calcularTotalNomina);
    document.getElementById('nominaPagoJornal').addEventListener('input', calcularTotalNomina);
    document.getElementById('nominaPagoEncargado').addEventListener('input', calcularTotalNomina);
    document.getElementById('nominaDias').addEventListener('input', calcularTotalNomina);
    document.getElementById('nominaHorasExtras').addEventListener('input', calcularTotalNomina);
    document.getElementById('nominaGastosExtras').addEventListener('input', calcularTotalNomina);
    
    // Form Gastos
    document.getElementById('formGastos').addEventListener('submit', function(e) {
        e.preventDefault();
        guardarGasto();
    });
    
    // Form Jima
    document.getElementById('formJima').addEventListener('submit', function(e) {
        e.preventDefault();
        guardarJima();
    });
    
    // Calcular peso promedio y total jima automáticamente
    document.getElementById('jimaPinas').addEventListener('input', calcularPesoPromedio);
    document.getElementById('jimaKilos').addEventListener('input', calcularPesoPromedio);
    document.getElementById('jimaPrecio').addEventListener('input', calcularTotalJima);
    document.getElementById('jimaKilos').addEventListener('input', calcularTotalJima);
    document.getElementById('jimaJimaFlete').addEventListener('input', calcularTotalJima);
    document.getElementById('jimaGastos').addEventListener('input', calcularTotalJima);
    document.getElementById('jimaFactoraje').addEventListener('input', calcularTotalJima);
}

function establecerSaldoInicial() {
    const cuentaElement = document.getElementById('saldoCuenta');
    const montoElement = document.getElementById('saldoMonto');
    
    const cuenta = cuentaElement.value;
    const monto = parseFloat(montoElement.value);
    
    console.log('Estableciendo saldo inicial:', { cuenta, monto });
    
    if (!cuenta || cuenta === '') {
        alert('Por favor selecciona una cuenta bancaria');
        return;
    }
    
    if (!montoElement.value || isNaN(monto) || monto < 0) {
        alert('Por favor ingresa un monto válido (mayor o igual a 0)');
        return;
    }
    
    try {
        // Guardar el saldo inicial base
        const saldosIniciales = cargarDatos('saldosIniciales') || {};
        saldosIniciales[cuenta] = monto;
        guardarDatos('saldosIniciales', saldosIniciales);
        
        console.log('Saldo guardado exitosamente:', saldosIniciales);
        
        // Limpiar formulario
        document.getElementById('formSaldoInicial').reset();
        
        // Actualizar visualización
        actualizarSaldos();
        
        // Mostrar mensaje de éxito
        alert(`✅ Saldo inicial establecido correctamente\n\nCuenta: ${cuenta}\nMonto: ${formatearMoneda(monto)}`);
        
    } catch (error) {
        console.error('Error al establecer saldo inicial:', error);
        alert('Error al guardar el saldo inicial. Por favor intenta de nuevo.');
    }
}

function actualizarSaldos() {
    try {
        // Cargar saldos iniciales
        const saldosIniciales = cargarDatos('saldosIniciales') || {};
        const movimientos = cargarDatos('caja') || [];
        
        // Inicializar con saldos base (o cero si no hay saldo inicial establecido)
        let saldoBianca = saldosIniciales['Santander Bianca'] || 0;
        let saldoPablo = saldosIniciales['Santander Pablo'] || 0;
        
        console.log('Saldos iniciales:', { saldoBianca, saldoPablo });
        console.log('Movimientos totales:', movimientos.length);
        
        // Calcular saldos basados en movimientos
        movimientos.forEach(mov => {
            const monto = parseFloat(mov.monto) || 0;
            if (mov.cuenta === 'Santander Bianca') {
                if (mov.tipo === 'Ingreso') {
                    saldoBianca += monto;
                } else {
                    saldoBianca -= monto;
                }
            } else if (mov.cuenta === 'Santander Pablo') {
                if (mov.tipo === 'Ingreso') {
                    saldoPablo += monto;
                } else {
                    saldoPablo -= monto;
                }
            }
        });
        
        console.log('Saldos finales:', { saldoBianca, saldoPablo });
        
        // Actualizar display en módulo Caja
        const saldoBiancaElement = document.getElementById('saldoBianca');
        const saldoPabloElement = document.getElementById('saldoPablo');
        
        if (saldoBiancaElement) {
            saldoBiancaElement.textContent = formatearMoneda(saldoBianca);
        }
        if (saldoPabloElement) {
            saldoPabloElement.textContent = formatearMoneda(saldoPablo);
        }
        
        // Actualizar display en Dashboard
        const dashboardBianca = document.getElementById('dashboardSaldoBianca');
        const dashboardPablo = document.getElementById('dashboardSaldoPablo');
        
        if (dashboardBianca) {
            dashboardBianca.textContent = formatearMoneda(saldoBianca);
        }
        if (dashboardPablo) {
            dashboardPablo.textContent = formatearMoneda(saldoPablo);
        }
        
    } catch (error) {
        console.error('Error al actualizar saldos:', error);
    }
}

function guardarCaja() {
    const datos = cargarDatos('caja');
    const nuevo = {
        id: Date.now(),
        tipo: document.getElementById('cajaTipo').value,
        cuenta: document.getElementById('cajaCuenta').value,
        fecha: document.getElementById('cajaFecha').value,
        concepto: document.getElementById('cajaConcepto').value,
        cantidad: document.getElementById('cajaCantidad').value,
        unidad: document.getElementById('cajaUnidad').value,
        monto: document.getElementById('cajaMonto').value,
        formaPago: document.getElementById('cajaFormaPago').value,
        proveedor: document.getElementById('cajaProveedor').value,
        descripcion: document.getElementById('cajaDescripcion').value
    };
    
    datos.push(nuevo);
    guardarDatos('caja', datos);
    document.getElementById('formCaja').reset();
    setFechaHoy();
    cargarTablaCaja();
    actualizarSaldos();
    mostrarAlerta('Movimiento guardado exitosamente', 'success');
}

function cargarTablaCaja() {
    const datos = cargarDatos('caja');
    const tbody = document.getElementById('tablaCaja');
    
    actualizarSaldos();
    
    if (datos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #999;">No hay registros</td></tr>';
        return;
    }
    
    tbody.innerHTML = datos.map(item => `
        <tr>
            <td>${formatearFecha(item.fecha)}</td>
            <td><span style="color: ${item.tipo === 'Ingreso' ? '#4CAF50' : '#F44336'}; font-weight: 600;">${item.tipo || 'Egreso'}</span></td>
            <td>${item.cuenta}</td>
            <td>${item.concepto}</td>
            <td>${item.cantidad} ${item.unidad}</td>
            <td>${formatearMoneda(item.monto)}</td>
            <td>${item.formaPago}</td>
            <td>
                <button class="btn-small btn-delete" onclick="eliminarCaja(${item.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function eliminarCaja(id) {
    if (confirm('¿Eliminar este registro?')) {
        let datos = cargarDatos('caja');
        datos = datos.filter(item => item.id !== id);
        guardarDatos('caja', datos);
        cargarTablaCaja();
        mostrarAlerta('Registro eliminado', 'success');
    }
}

function filtrarCaja() {
    const cuenta = document.getElementById('filtroCajaCuenta').value;
    const tipo = document.getElementById('filtroCajaTipo').value;
    const desde = document.getElementById('filtroCajaDesde').value;
    const hasta = document.getElementById('filtroCajaHasta').value;
    
    let datos = cargarDatos('caja');
    
    if (cuenta) datos = datos.filter(d => d.cuenta === cuenta);
    if (tipo) datos = datos.filter(d => (d.tipo || 'Egreso') === tipo);
    if (desde) datos = datos.filter(d => d.fecha >= desde);
    if (hasta) datos = datos.filter(d => d.fecha <= hasta);
    
    const tbody = document.getElementById('tablaCaja');
    tbody.innerHTML = datos.map(item => `
        <tr>
            <td>${formatearFecha(item.fecha)}</td>
            <td><span style="color: ${item.tipo === 'Ingreso' ? '#4CAF50' : '#F44336'}; font-weight: 600;">${item.tipo || 'Egreso'}</span></td>
            <td>${item.cuenta}</td>
            <td>${item.concepto}</td>
            <td>${item.cantidad} ${item.unidad}</td>
            <td>${formatearMoneda(item.monto)}</td>
            <td>${item.formaPago}</td>
            <td>
                <button class="btn-small btn-delete" onclick="eliminarCaja(${item.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// ===== NÓMINA =====

function calcularTotalNomina() {
    const cuadrilla = parseFloat(document.getElementById('nominaCuadrilla').value) || 0;
    const pagoJornal = parseFloat(document.getElementById('nominaPagoJornal').value) || 0;
    const pagoEncargado = parseFloat(document.getElementById('nominaPagoEncargado').value) || 0;
    const dias = parseFloat(document.getElementById('nominaDias').value) || 0;
    const horasExtras = parseFloat(document.getElementById('nominaHorasExtras').value) || 0;
    const gastosExtras = parseFloat(document.getElementById('nominaGastosExtras').value) || 0;
    
    // Cálculo: (cantidad jornaleros × pago jornal × días) + (pago encargado × días) + horas extras + gastos extras
    const costoJornaleros = cuadrilla * pagoJornal * dias;
    const costoEncargado = pagoEncargado * dias;
    const total = costoJornaleros + costoEncargado + horasExtras + gastosExtras;
    
    document.getElementById('nominaTotal').value = total.toFixed(2);
}

function guardarNomina() {
    const datos = cargarDatos('nomina');
    const nuevo = {
        id: Date.now(),
        agavera: document.getElementById('nominaAgavera').value,
        huerta: document.getElementById('nominaHuerta').value,
        cuadrilla: document.getElementById('nominaCuadrilla').value,
        pagoJornal: document.getElementById('nominaPagoJornal').value,
        encargado: document.getElementById('nominaEncargado').value,
        pagoEncargado: document.getElementById('nominaPagoEncargado').value,
        colaborador: document.getElementById('nominaColaborador').value || '',
        semana: document.getElementById('nominaSemana').value,
        dias: document.getElementById('nominaDias').value,
        horasExtras: document.getElementById('nominaHorasExtras').value || 0,
        gastosExtras: document.getElementById('nominaGastosExtras').value || 0,
        total: document.getElementById('nominaTotal').value,
        observaciones: document.getElementById('nominaObservaciones').value
    };
    
    datos.push(nuevo);
    guardarDatos('nomina', datos);
    document.getElementById('formNomina').reset();
    cargarTablaNomina();
    mostrarAlerta('Nómina guardada exitosamente', 'success');
}

function cargarTablaNomina() {
    const datos = cargarDatos('nomina');
    const tbody = document.getElementById('tablaNomina');
    
    if (datos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="12" style="text-align: center; padding: 40px; color: #999;">No hay registros</td></tr>';
        return;
    }
    
    tbody.innerHTML = datos.map(item => `
        <tr>
            <td>${item.agavera}</td>
            <td>${item.huerta}</td>
            <td>${item.cuadrilla || '-'}</td>
            <td>${item.pagoJornal ? formatearMoneda(item.pagoJornal) : '-'}</td>
            <td>${item.encargado || '-'}</td>
            <td>${item.pagoEncargado ? formatearMoneda(item.pagoEncargado) : '-'}</td>
            <td>${item.semana}</td>
            <td>${item.dias}</td>
            <td>${item.horasExtras ? formatearMoneda(item.horasExtras) : '-'}</td>
            <td>${item.gastosExtras ? formatearMoneda(item.gastosExtras) : '-'}</td>
            <td><strong>${formatearMoneda(item.total)}</strong></td>
            <td>
                <button class="btn-small btn-delete" onclick="eliminarNomina(${item.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function eliminarNomina(id) {
    if (confirm('¿Eliminar este registro?')) {
        let datos = cargarDatos('nomina');
        datos = datos.filter(item => item.id !== id);
        guardarDatos('nomina', datos);
        cargarTablaNomina();
        mostrarAlerta('Registro eliminado', 'success');
    }
}

function filtrarNomina() {
    const agavera = document.getElementById('filtroNominaAgavera').value;
    const huerta = document.getElementById('filtroNominaHuerta').value;
    const semana = document.getElementById('filtroNominaSemana').value;
    
    let datos = cargarDatos('nomina');
    
    if (agavera) datos = datos.filter(d => d.agavera === agavera);
    if (huerta) datos = datos.filter(d => d.huerta === huerta);
    if (semana) datos = datos.filter(d => d.semana === semana);
    
    const tbody = document.getElementById('tablaNomina');
    tbody.innerHTML = datos.map(item => `
        <tr>
            <td>${item.agavera}</td>
            <td>${item.huerta}</td>
            <td>${item.cuadrilla || '-'}</td>
            <td>${item.pagoJornal ? formatearMoneda(item.pagoJornal) : '-'}</td>
            <td>${item.encargado || '-'}</td>
            <td>${item.pagoEncargado ? formatearMoneda(item.pagoEncargado) : '-'}</td>
            <td>${item.semana}</td>
            <td>${item.dias}</td>
            <td>${item.horasExtras ? formatearMoneda(item.horasExtras) : '-'}</td>
            <td>${item.gastosExtras ? formatearMoneda(item.gastosExtras) : '-'}</td>
            <td><strong>${formatearMoneda(item.total)}</strong></td>
            <td>
                <button class="btn-small btn-delete" onclick="eliminarNomina(${item.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// ===== GASTOS HUERTAS =====

function guardarGasto() {
    const datos = cargarDatos('gastos');
    const nuevo = {
        id: Date.now(),
        fecha: document.getElementById('gastoFecha').value,
        agavera: document.getElementById('gastoAgavera').value,
        huerta: document.getElementById('gastoHuerta').value,
        concepto: document.getElementById('gastoConcepto').value,
        subconcepto: document.getElementById('gastoSubconcepto').value,
        monto: document.getElementById('gastoMonto').value,
        proveedor: document.getElementById('gastoProveedor').value,
        factura: document.getElementById('gastoFactura').value,
        observaciones: document.getElementById('gastoObservaciones').value
    };
    
    datos.push(nuevo);
    guardarDatos('gastos', datos);
    document.getElementById('formGastos').reset();
    setFechaHoy();
    cargarTablaGastos();
    mostrarAlerta('Gasto guardado exitosamente', 'success');
}

function cargarTablaGastos() {
    const datos = cargarDatos('gastos');
    const tbody = document.getElementById('tablaGastos');
    
    if (datos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px; color: #999;">No hay registros</td></tr>';
        return;
    }
    
    tbody.innerHTML = datos.map(item => `
        <tr>
            <td>${formatearFecha(item.fecha)}</td>
            <td>${item.agavera}</td>
            <td>${item.huerta}</td>
            <td>${item.concepto}</td>
            <td>${formatearMoneda(item.monto)}</td>
            <td>${item.proveedor || '-'}</td>
            <td>
                <button class="btn-small btn-delete" onclick="eliminarGasto(${item.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function eliminarGasto(id) {
    if (confirm('¿Eliminar este registro?')) {
        let datos = cargarDatos('gastos');
        datos = datos.filter(item => item.id !== id);
        guardarDatos('gastos', datos);
        cargarTablaGastos();
        mostrarAlerta('Registro eliminado', 'success');
    }
}

function filtrarGastos() {
    const agavera = document.getElementById('filtroGastoAgavera').value;
    const huerta = document.getElementById('filtroGastoHuerta').value;
    const concepto = document.getElementById('filtroGastoConcepto').value;
    
    let datos = cargarDatos('gastos');
    
    if (agavera) datos = datos.filter(d => d.agavera === agavera);
    if (huerta) datos = datos.filter(d => d.huerta === huerta);
    if (concepto) datos = datos.filter(d => d.concepto === concepto);
    
    const tbody = document.getElementById('tablaGastos');
    tbody.innerHTML = datos.map(item => `
        <tr>
            <td>${formatearFecha(item.fecha)}</td>
            <td>${item.agavera}</td>
            <td>${item.huerta}</td>
            <td>${item.concepto}</td>
            <td>${formatearMoneda(item.monto)}</td>
            <td>${item.proveedor || '-'}</td>
            <td>
                <button class="btn-small btn-delete" onclick="eliminarGasto(${item.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function importarGastos() {
    // Crear input file oculto
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const extension = file.name.split('.').pop().toLowerCase();
        
        if (extension === 'csv') {
            importarCSV(file);
        } else {
            alert('Por ahora solo se soporta formato CSV. Por favor exporta tu Excel como CSV.');
        }
    };
    
    input.click();
}

function importarCSV(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const text = e.target.result;
        const lines = text.split('\n');
        
        if (lines.length < 2) {
            alert('El archivo está vacío o no tiene datos');
            return;
        }
        
        // Detectar el separador (coma o punto y coma)
        const separator = lines[0].includes(';') ? ';' : ',';
        
        // Procesar encabezados
        const headers = lines[0].split(separator).map(h => h.trim().replace(/"/g, ''));
        
        // Validar que tenga las columnas necesarias
        const requiredColumns = ['fecha', 'agavera', 'huerta', 'concepto', 'monto'];
        const hasRequired = requiredColumns.every(col => 
            headers.some(h => h.toLowerCase().includes(col))
        );
        
        if (!hasRequired) {
            alert('El archivo debe contener al menos las columnas: Fecha, Agavera, Huerta, Concepto, Monto');
            return;
        }
        
        // Procesar datos
        const datos = cargarDatos('gastos');
        let importados = 0;
        let errores = 0;
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const values = line.split(separator).map(v => v.trim().replace(/"/g, ''));
            
            try {
                const registro = {};
                headers.forEach((header, index) => {
                    registro[header.toLowerCase()] = values[index] || '';
                });
                
                // Crear objeto de gasto
                const nuevo = {
                    id: Date.now() + i,
                    fecha: registro.fecha || new Date().toISOString().split('T')[0],
                    agavera: registro.agavera || '',
                    huerta: registro.huerta || '',
                    concepto: registro.concepto || '',
                    subconcepto: registro.subconcepto || '',
                    monto: registro.monto || 0,
                    proveedor: registro.proveedor || '',
                    factura: registro.factura || registro['factura/ref'] || '',
                    observaciones: registro.observaciones || ''
                };
                
                // Validar datos mínimos
                if (nuevo.fecha && nuevo.agavera && nuevo.huerta && nuevo.concepto && nuevo.monto) {
                    datos.push(nuevo);
                    importados++;
                } else {
                    errores++;
                }
            } catch (err) {
                errores++;
                console.error('Error en línea ' + (i + 1), err);
            }
        }
        
        if (importados > 0) {
            guardarDatos('gastos', datos);
            cargarTablaGastos();
            mostrarAlerta(`✅ Se importaron ${importados} registros exitosamente${errores > 0 ? `. ${errores} registros con errores` : ''}`, 'success');
        } else {
            alert('No se pudo importar ningún registro. Verifica el formato del archivo.');
        }
    };
    
    reader.onerror = function() {
        alert('Error al leer el archivo');
    };
    
    reader.readAsText(file, 'UTF-8');
}

function mostrarInstruccionesImport() {
    const instrucciones = `
📥 INSTRUCCIONES PARA IMPORTAR GASTOS

1. FORMATO DEL ARCHIVO:
   - Debe ser un archivo CSV (puedes guardarlo desde Excel)
   - En Excel: Archivo > Guardar como > Tipo: CSV (delimitado por comas)

2. COLUMNAS REQUERIDAS (mínimo):
   • Fecha (formato: YYYY-MM-DD o DD/MM/YYYY)
   • Agavera (nombre de la empresa)
   • Huerta (nombre del predio)
   • Concepto (tipo de gasto)
   • Monto (valor numérico)

3. COLUMNAS OPCIONALES:
   • Subconcepto
   • Proveedor
   • Factura
   • Observaciones

4. EJEMPLO DE ARCHIVO CSV:
Fecha,Agavera,Huerta,Concepto,Monto,Proveedor
2024-01-15,CARLOS,LA CAJA,Nómina,50000,Juan Pérez
2024-01-16,GDL,TOTOTLAN,Combustible,3500,Gasolinera

5. NOTAS IMPORTANTES:
   ✓ Los nombres de agaveras y huertas deben existir en el sistema
   ✓ Los conceptos deben ser válidos (Administración, Nómina, etc.)
   ✓ El monto debe ser numérico (sin símbolos de moneda)
   ✓ Las fechas deben tener formato correcto

¿Necesitas un archivo de ejemplo?
Exporta algunos registros existentes y úsalo como plantilla.
    `;
    
    alert(instrucciones);
}

// ===== JIMA =====

function calcularPesoPromedio() {
    const pinas = parseFloat(document.getElementById('jimaPinas').value) || 0;
    const kilos = parseFloat(document.getElementById('jimaKilos').value) || 0;
    const promedio = pinas > 0 ? kilos / pinas : 0;
    document.getElementById('jimaPesoPromedio').value = promedio.toFixed(2);
}

function calcularTotalJima() {
    const kilos = parseFloat(document.getElementById('jimaKilos').value) || 0;
    const precio = parseFloat(document.getElementById('jimaPrecio').value) || 0;
    const jimaFlete = parseFloat(document.getElementById('jimaJimaFlete').value) || 0;
    const gastos = parseFloat(document.getElementById('jimaGastos').value) || 0;
    const factoraje = parseFloat(document.getElementById('jimaFactoraje').value) || 0;
    
    const total = (kilos * precio) - jimaFlete - gastos - factoraje;
    document.getElementById('jimaTotal').value = total.toFixed(2);
}

function guardarJima() {
    const datos = cargarDatos('jima');
    const nuevo = {
        id: Date.now(),
        viaje: document.getElementById('jimaViaje').value,
        fecha: document.getElementById('jimaFecha').value,
        semana: document.getElementById('jimaSemana').value,
        agavera: document.getElementById('jimaAgavera').value,
        huerta: document.getElementById('jimaHuerta').value,
        ciclo: document.getElementById('jimaCiclo').value,
        idJima: document.getElementById('jimaId').value,
        guia: document.getElementById('jimaGuia').value,
        folio: document.getElementById('jimaFolio').value,
        cliente: document.getElementById('jimaCliente').value,
        pinas: document.getElementById('jimaPinas').value,
        kilos: document.getElementById('jimaKilos').value,
        pesoPromedio: document.getElementById('jimaPesoPromedio').value,
        precio: document.getElementById('jimaPrecio').value,
        jimaFlete: document.getElementById('jimaJimaFlete').value,
        gastos: document.getElementById('jimaGastos').value,
        factoraje: document.getElementById('jimaFactoraje').value,
        total: document.getElementById('jimaTotal').value
    };
    
    datos.push(nuevo);
    guardarDatos('jima', datos);
    document.getElementById('formJima').reset();
    setFechaHoy();
    cargarTablaJima();
    mostrarAlerta('Jima guardada exitosamente', 'success');
}

function cargarTablaJima() {
    const datos = cargarDatos('jima');
    const tbody = document.getElementById('tablaJima');
    
    if (datos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #999;">No hay registros</td></tr>';
        return;
    }
    
    tbody.innerHTML = datos.map(item => `
        <tr>
            <td>${formatearFecha(item.fecha)}</td>
            <td>${item.agavera}</td>
            <td>${item.huerta}</td>
            <td>${item.cliente}</td>
            <td>${formatearNumero(item.pinas)}</td>
            <td>${formatearNumero(item.kilos)} kg</td>
            <td>${formatearMoneda(item.total)}</td>
            <td>
                <button class="btn-small btn-delete" onclick="eliminarJima(${item.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function eliminarJima(id) {
    if (confirm('¿Eliminar este registro?')) {
        let datos = cargarDatos('jima');
        datos = datos.filter(item => item.id !== id);
        guardarDatos('jima', datos);
        cargarTablaJima();
        mostrarAlerta('Registro eliminado', 'success');
    }
}

function filtrarJima() {
    const agavera = document.getElementById('filtroJimaAgavera').value;
    const huerta = document.getElementById('filtroJimaHuerta').value;
    const cliente = document.getElementById('filtroJimaCliente').value.toLowerCase();
    
    let datos = cargarDatos('jima');
    
    if (agavera) datos = datos.filter(d => d.agavera === agavera);
    if (huerta) datos = datos.filter(d => d.huerta === huerta);
    if (cliente) datos = datos.filter(d => d.cliente.toLowerCase().includes(cliente));
    
    const tbody = document.getElementById('tablaJima');
    tbody.innerHTML = datos.map(item => `
        <tr>
            <td>${formatearFecha(item.fecha)}</td>
            <td>${item.agavera}</td>
            <td>${item.huerta}</td>
            <td>${item.cliente}</td>
            <td>${formatearNumero(item.pinas)}</td>
            <td>${formatearNumero(item.kilos)} kg</td>
            <td>${formatearMoneda(item.total)}</td>
            <td>
                <button class="btn-small btn-delete" onclick="eliminarJima(${item.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// ===== REPORTES =====

let chartConceptos, chartAgaveras, chartJima;

function cargarSelectsFiltrosReportes() {
    const agaveras = Object.keys(AGAVERAS_CONFIG);
    const selectAgavera = document.getElementById('filtroReporteAgavera');
    const selectHuerta = document.getElementById('filtroReporteHuerta');
    
    selectAgavera.innerHTML = '<option value="">Todas</option>';
    selectHuerta.innerHTML = '<option value="">Todas</option>';
    
    agaveras.forEach(agavera => {
        selectAgavera.innerHTML += `<option value="${agavera}">${agavera}</option>`;
    });
    
    // Cargar todas las huertas
    const todasHuertas = [];
    Object.values(AGAVERAS_CONFIG).forEach(huertas => {
        huertas.forEach(h => {
            if (!todasHuertas.includes(h)) todasHuertas.push(h);
        });
    });
    
    todasHuertas.sort().forEach(huerta => {
        selectHuerta.innerHTML += `<option value="${huerta}">${huerta}</option>`;
    });
}

function actualizarGraficas() {
    const agavera = document.getElementById('filtroReporteAgavera').value;
    const huerta = document.getElementById('filtroReporteHuerta').value;
    const ciclo = document.getElementById('filtroReporteCiclo').value;
    const concepto = document.getElementById('filtroReporteConcepto').value;
    
    let gastos = cargarDatos('gastos');
    let jima = cargarDatos('jima');
    
    // Aplicar filtros
    if (agavera) {
        gastos = gastos.filter(g => g.agavera === agavera);
        jima = jima.filter(j => j.agavera === agavera);
    }
    if (huerta) {
        gastos = gastos.filter(g => g.huerta === huerta);
        jima = jima.filter(j => j.huerta === huerta);
    }
    if (ciclo) {
        jima = jima.filter(j => j.ciclo === ciclo);
    }
    if (concepto) {
        gastos = gastos.filter(g => g.concepto === concepto);
    }
    
    // Gráfica por Conceptos
    crearGraficoConceptos(gastos);
    
    // Gráfica por Agaveras
    crearGraficoAgaveras(gastos);
    
    // Gráfica Jima
    crearGraficoJima(jima);
}

function crearGraficoConceptos(gastos) {
    const conceptos = ["Administración", "Gastos de Operación", "Nómina", "Rentas", "Productos", 
                       "Herramientas", "Arrendamientos", "Combustible", "Plantación", "Hijuelos"];
    
    const datos = conceptos.map(concepto => {
        return gastos.filter(g => g.concepto === concepto)
            .reduce((sum, g) => sum + parseFloat(g.monto), 0);
    });
    
    const ctx = document.getElementById('graficoConceptos');
    
    if (chartConceptos) {
        chartConceptos.destroy();
    }
    
    chartConceptos = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: conceptos,
            datasets: [{
                label: 'Total Gastado',
                data: datos,
                backgroundColor: 'rgba(56, 189, 248, 0.8)',
                borderColor: 'rgba(14, 165, 233, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString('es-MX');
                        }
                    }
                }
            }
        }
    });
}

function crearGraficoAgaveras(gastos) {
    const agaveras = Object.keys(AGAVERAS_CONFIG);
    
    const datos = agaveras.map(agavera => {
        return gastos.filter(g => g.agavera === agavera)
            .reduce((sum, g) => sum + parseFloat(g.monto), 0);
    });
    
    const ctx = document.getElementById('graficoAgaveras');
    
    if (chartAgaveras) {
        chartAgaveras.destroy();
    }
    
    chartAgaveras = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: agaveras,
            datasets: [{
                label: 'Gastos',
                data: datos,
                backgroundColor: [
                    'rgba(14, 165, 233, 0.8)',
                    'rgba(56, 189, 248, 0.8)',
                    'rgba(125, 211, 252, 0.8)',
                    'rgba(186, 230, 253, 0.8)',
                    'rgba(224, 242, 254, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(252, 211, 77, 0.8)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'right'
                }
            }
        }
    });
}

function crearGraficoJima(jima) {
    const huertas = {};
    
    jima.forEach(j => {
        if (!huertas[j.huerta]) {
            huertas[j.huerta] = 0;
        }
        huertas[j.huerta] += parseFloat(j.kilos);
    });
    
    const labels = Object.keys(huertas).slice(0, 10); // Top 10
    const datos = labels.map(h => huertas[h]);
    
    const ctx = document.getElementById('graficoJima');
    
    if (chartJima) {
        chartJima.destroy();
    }
    
    chartJima = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Kilos Cosechados',
                data: datos,
                backgroundColor: 'rgba(56, 189, 248, 0.8)',
                borderColor: 'rgba(14, 165, 233, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
}

function cargarReportes() {
    cargarReporteAgaveras();
    cargarReporteConceptos();
}

function cargarReporteAgaveras() {
    const gastos = cargarDatos('gastos');
    const nomina = cargarDatos('nomina');
    const jima = cargarDatos('jima');
    
    const agaveras = Object.keys(AGAVERAS_CONFIG);
    const tbody = document.querySelector('#reporteAgaveras tbody');
    
    tbody.innerHTML = agaveras.map(agavera => {
        const gastosTotal = gastos.filter(g => g.agavera === agavera)
            .reduce((sum, g) => sum + parseFloat(g.monto), 0);
        const nominaTotal = nomina.filter(n => n.agavera === agavera)
            .reduce((sum, n) => sum + parseFloat(n.total), 0);
        const jimaKilos = jima.filter(j => j.agavera === agavera)
            .reduce((sum, j) => sum + parseFloat(j.kilos), 0);
        const jimaIngresos = jima.filter(j => j.agavera === agavera)
            .reduce((sum, j) => sum + parseFloat(j.total), 0);
        
        return `
            <tr>
                <td><strong>${agavera}</strong></td>
                <td>${formatearMoneda(gastosTotal)}</td>
                <td>${formatearMoneda(nominaTotal)}</td>
                <td>${formatearNumero(jimaKilos)} kg</td>
                <td>${formatearMoneda(jimaIngresos)}</td>
            </tr>
        `;
    }).join('');
}

function cargarReporteConceptos() {
    const gastos = cargarDatos('gastos');
    const conceptos = ["Administración", "Gastos de Operación", "Nómina", "Rentas", "Productos", 
                       "Herramientas", "Arrendamientos", "Combustible", "Plantación", "Hijuelos"];
    
    const total = gastos.reduce((sum, g) => sum + parseFloat(g.monto), 0);
    const tbody = document.querySelector('#reporteConceptos tbody');
    
    tbody.innerHTML = conceptos.map(concepto => {
        const registros = gastos.filter(g => g.concepto === concepto);
        const suma = registros.reduce((sum, g) => sum + parseFloat(g.monto), 0);
        const porcentaje = total > 0 ? (suma / total) * 100 : 0;
        
        return `
            <tr>
                <td><strong>${concepto}</strong></td>
                <td>${formatearMoneda(suma)}</td>
                <td>${porcentaje.toFixed(1)}%</td>
                <td>${registros.length}</td>
            </tr>
        `;
    }).join('');
}

// ===== CONFIGURACIÓN =====

function cargarConfiguracionModulo() {
    cargarTablaAgaveras();
    cargarTablaHuertas();
    cargarTablaColaboradores();
    cargarSelectsConfiguracion();
    inicializarFormulariosConfiguracion();
    
    // Mostrar controles de admin solo si es Super Admin
    if (currentUserRole === 'Super Admin') {
        document.getElementById('adminControls').style.display = 'block';
    }
}

function inicializarFormulariosConfiguracion() {
    // Form Nueva Agavera
    document.getElementById('formNuevaAgavera').addEventListener('submit', function(e) {
        e.preventDefault();
        agregarAgavera();
    });
    
    // Form Nueva Huerta
    document.getElementById('formNuevaHuerta').addEventListener('submit', function(e) {
        e.preventDefault();
        agregarHuerta();
    });
    
    // Form Nuevo Colaborador
    document.getElementById('formNuevoColaborador').addEventListener('submit', function(e) {
        e.preventDefault();
        agregarColaborador();
    });
}

function cargarSelectsConfiguracion() {
    const agaveras = Object.keys(AGAVERAS_CONFIG);
    const selectAgavera = document.getElementById('agaveraHuerta');
    const filtroAgavera = document.getElementById('filtroConfigAgavera');
    
    selectAgavera.innerHTML = '<option value="">Seleccionar...</option>';
    filtroAgavera.innerHTML = '<option value="">Todas</option>';
    
    agaveras.forEach(agavera => {
        selectAgavera.innerHTML += `<option value="${agavera}">${agavera}</option>`;
        filtroAgavera.innerHTML += `<option value="${agavera}">${agavera}</option>`;
    });
}

function agregarAgavera() {
    const nombre = document.getElementById('nuevaAgavera').value.trim().toUpperCase();
    
    if (!nombre) {
        alert('Por favor ingresa un nombre');
        return;
    }
    
    if (AGAVERAS_CONFIG[nombre]) {
        alert('Esta agavera ya existe');
        return;
    }
    
    AGAVERAS_CONFIG[nombre] = [];
    guardarConfiguracion();
    document.getElementById('formNuevaAgavera').reset();
    cargarTablaAgaveras();
    cargarSelectsAgaveras();
    cargarSelectsConfiguracion();
    mostrarAlerta('Agavera agregada exitosamente', 'success');
}

function eliminarAgavera(nombre) {
    if (confirm(`¿Eliminar la agavera "${nombre}" y todas sus huertas asociadas?`)) {
        delete AGAVERAS_CONFIG[nombre];
        guardarConfiguracion();
        cargarTablaAgaveras();
        cargarSelectsAgaveras();
        cargarSelectsConfiguracion();
        mostrarAlerta('Agavera eliminada', 'success');
    }
}

function cargarTablaAgaveras() {
    const tbody = document.getElementById('tablaAgaveras');
    const agaveras = Object.keys(AGAVERAS_CONFIG);
    
    tbody.innerHTML = agaveras.map(agavera => `
        <tr>
            <td><strong>${agavera}</strong></td>
            <td>${AGAVERAS_CONFIG[agavera].length} huerta(s)</td>
            <td>
                <button class="btn-small btn-delete" onclick="eliminarAgavera('${agavera}')">🗑️ Eliminar</button>
            </td>
        </tr>
    `).join('');
}

function agregarHuerta() {
    const agavera = document.getElementById('agaveraHuerta').value;
    const nombre = document.getElementById('nuevaHuerta').value.trim().toUpperCase();
    const ciclo = document.getElementById('cicloHuerta').value.trim();
    
    if (!agavera || !nombre) {
        alert('Por favor completa los campos requeridos');
        return;
    }
    
    const nombreCompleto = ciclo ? `${nombre} ${ciclo}` : nombre;
    
    if (AGAVERAS_CONFIG[agavera].includes(nombreCompleto)) {
        alert('Esta huerta ya existe en la agavera');
        return;
    }
    
    AGAVERAS_CONFIG[agavera].push(nombreCompleto);
    guardarConfiguracion();
    document.getElementById('formNuevaHuerta').reset();
    cargarTablaHuertas();
    mostrarAlerta('Huerta agregada exitosamente', 'success');
}

function eliminarHuerta(agavera, huerta) {
    if (confirm(`¿Eliminar la huerta "${huerta}"?`)) {
        const index = AGAVERAS_CONFIG[agavera].indexOf(huerta);
        if (index > -1) {
            AGAVERAS_CONFIG[agavera].splice(index, 1);
            guardarConfiguracion();
            cargarTablaHuertas();
            cargarTablaAgaveras();
            mostrarAlerta('Huerta eliminada', 'success');
        }
    }
}

function cargarTablaHuertas() {
    const tbody = document.getElementById('tablaHuertas');
    const filtro = document.getElementById('filtroConfigAgavera').value;
    
    const huertas = [];
    Object.keys(AGAVERAS_CONFIG).forEach(agavera => {
        if (!filtro || agavera === filtro) {
            AGAVERAS_CONFIG[agavera].forEach(huerta => {
                const cicloMatch = huerta.match(/\d{4}$/);
                const ciclo = cicloMatch ? cicloMatch[0] : '-';
                huertas.push({ agavera, huerta, ciclo });
            });
        }
    });
    
    if (huertas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px; color: #999;">No hay huertas</td></tr>';
        return;
    }
    
    tbody.innerHTML = huertas.map(h => `
        <tr>
            <td>${h.agavera}</td>
            <td>${h.huerta}</td>
            <td>${h.ciclo}</td>
            <td>
                <button class="btn-small btn-delete" onclick="eliminarHuerta('${h.agavera}', '${h.huerta}')">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function agregarColaborador() {
    const nombre = document.getElementById('nuevoColaborador').value.trim();
    const puesto = document.getElementById('puestoColaborador').value.trim();
    
    if (!nombre) {
        alert('Por favor ingresa un nombre');
        return;
    }
    
    const colaboradores = cargarDatos('colaboradores');
    const nuevo = {
        id: Date.now(),
        nombre: nombre,
        puesto: puesto
    };
    
    colaboradores.push(nuevo);
    guardarDatos('colaboradores', colaboradores);
    document.getElementById('formNuevoColaborador').reset();
    cargarTablaColaboradores();
    mostrarAlerta('Colaborador agregado exitosamente', 'success');
}

function eliminarColaborador(id) {
    if (confirm('¿Eliminar este colaborador?')) {
        let colaboradores = cargarDatos('colaboradores');
        colaboradores = colaboradores.filter(c => c.id !== id);
        guardarDatos('colaboradores', colaboradores);
        cargarTablaColaboradores();
        mostrarAlerta('Colaborador eliminado', 'success');
    }
}

function cargarTablaColaboradores() {
    const colaboradores = cargarDatos('colaboradores');
    const tbody = document.getElementById('tablaColaboradores');
    
    if (colaboradores.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 40px; color: #999;">No hay colaboradores</td></tr>';
        return;
    }
    
    tbody.innerHTML = colaboradores.map(c => `
        <tr>
            <td>${c.nombre}</td>
            <td>${c.puesto || '-'}</td>
            <td>
                <button class="btn-small btn-delete" onclick="eliminarColaborador(${c.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// ===== FUNCIONES DE ADMINISTRADOR =====

function limpiarBaseDatos() {
    const confirmacion = prompt('⚠️ ADVERTENCIA: Esto eliminará TODOS los registros de datos.\n\nEscribe exactamente: ELIMINAR\n(todo en mayúsculas)');
    
    if (confirmacion && confirmacion.trim() === 'ELIMINAR') {
        // Limpiar todas las colecciones de datos
        localStorage.removeItem('caja');
        localStorage.removeItem('nomina');
        localStorage.removeItem('gastos');
        localStorage.removeItem('jima');
        localStorage.removeItem('colaboradores');
        
        // Recargar las tablas
        if (document.getElementById('tablaCaja')) cargarTablaCaja();
        if (document.getElementById('tablaNomina')) cargarTablaNomina();
        if (document.getElementById('tablaGastos')) cargarTablaGastos();
        if (document.getElementById('tablaJima')) cargarTablaJima();
        if (document.getElementById('tablaColaboradores')) cargarTablaColaboradores();
        cargarDashboard();
        
        alert('✅ Base de datos limpiada exitosamente.\n\nLa configuración de agaveras y huertas se ha mantenido.');
    } else if (confirmacion !== null) {
        alert('❌ Cancelado.\n\nDebes escribir exactamente: ELIMINAR\n(todo en mayúsculas)');
    }
}

function resetearSistemaCompleto() {
    const confirmacion1 = prompt('🚨 PELIGRO: Esto eliminará TODO el sistema (datos + configuración).\n\nEscribe exactamente: RESETEAR\n(todo en mayúsculas)');
    
    if (confirmacion1 && confirmacion1.trim() === 'RESETEAR') {
        const confirmacion2 = prompt('⚠️ ÚLTIMA CONFIRMACIÓN\n\n¿Estás completamente seguro?\n\nEscribe exactamente: SI ESTOY SEGURO\n(todo en mayúsculas)');
        
        if (confirmacion2 && confirmacion2.trim() === 'SI ESTOY SEGURO') {
            // Limpiar absolutamente todo
            localStorage.clear();
            
            alert('✅ Sistema reseteado completamente.\n\nLa página se recargará...');
            location.reload();
        } else if (confirmacion2 !== null) {
            alert('❌ Cancelado.\n\nDebes escribir exactamente: SI ESTOY SEGURO\n(todo en mayúsculas)');
        }
    } else if (confirmacion1 !== null) {
        alert('❌ Cancelado.\n\nDebes escribir exactamente: RESETEAR\n(todo en mayúsculas)');
    }
}

// ===== EXPORTAR A EXCEL =====

function exportarExcel(modulo) {
    let datos, headers, filename;
    
    switch(modulo) {
        case 'caja':
            datos = cargarDatos('caja');
            headers = ['Fecha', 'Tipo', 'Cuenta', 'Concepto', 'Cantidad', 'Unidad', 'Monto', 'Forma Pago', 'Proveedor', 'Descripción'];
            filename = 'caja_diaria.csv';
            datos = datos.map(d => [d.fecha, d.tipo || 'Egreso', d.cuenta, d.concepto, d.cantidad, d.unidad, d.monto, d.formaPago, d.proveedor || '', d.descripcion || '']);
            break;
        case 'nomina':
            datos = cargarDatos('nomina');
            headers = ['Agavera', 'Huerta', 'Cant. Jornaleros', '$ Jornal', 'Encargado', '$ Encargado', 'Colaborador', 'Semana', 'Días', 'Horas Extras', 'Gastos Extras', 'Total', 'Observaciones'];
            filename = 'nomina.csv';
            datos = datos.map(d => [d.agavera, d.huerta, d.cuadrilla || '', d.pagoJornal || 0, d.encargado || '', d.pagoEncargado || 0, d.colaborador || '', d.semana, d.dias, d.horasExtras || 0, d.gastosExtras || 0, d.total, d.observaciones || '']);
            break;
        case 'gastos':
            datos = cargarDatos('gastos');
            headers = ['Fecha', 'Agavera', 'Huerta', 'Concepto', 'Subconcepto', 'Monto', 'Proveedor', 'Factura', 'Observaciones'];
            filename = 'gastos_huertas.csv';
            datos = datos.map(d => [d.fecha, d.agavera, d.huerta, d.concepto, d.subconcepto || '', d.monto, d.proveedor || '', d.factura || '', d.observaciones || '']);
            break;
        case 'jima':
            datos = cargarDatos('jima');
            headers = ['Viaje', 'Fecha', 'Semana', 'Agavera', 'Huerta', 'Ciclo', 'ID', 'Guía', 'Folio', 'Cliente', 'Piñas', 'Kilos', 'Peso Prom', 'Precio', 'Jima y Flete', 'Gastos', 'Factoraje', 'Total'];
            filename = 'jima.csv';
            datos = datos.map(d => [d.viaje || '', d.fecha, d.semana, d.agavera, d.huerta, d.ciclo || '', d.idJima || '', d.guia || '', d.folio || '', d.cliente, d.pinas, d.kilos, d.pesoPromedio, d.precio, d.jimaFlete || 0, d.gastos || 0, d.factoraje || 0, d.total]);
            break;
    }
    
    if (datos.length === 0) {
        alert('No hay datos para exportar');
        return;
    }
    
    // Crear CSV con formato correcto
    let csv = headers.join(',') + '\n';
    datos.forEach(row => {
        const values = row.map(v => {
            // Convertir a string y escapar comillas
            let val = String(v || '');
            // Si contiene comas, saltos de línea o comillas, envolver en comillas
            if (val.includes(',') || val.includes('\n') || val.includes('"')) {
                val = '"' + val.replace(/"/g, '""') + '"';
            }
            return val;
        });
        csv += values.join(',') + '\n';
    });
    
    // Agregar BOM para que Excel reconozca UTF-8
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    
    mostrarAlerta('Datos exportados exitosamente', 'success');
}

// ===== UTILIDADES =====

function formatearMoneda(valor) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(valor);
}

function formatearNumero(valor) {
    return new Intl.NumberFormat('es-MX').format(valor);
}

function formatearFecha(fecha) {
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function mostrarAlerta(mensaje, tipo) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo}`;
    alertDiv.textContent = mensaje;
    
    const contentArea = document.querySelector('.content-area');
    contentArea.insertBefore(alertDiv, contentArea.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}
