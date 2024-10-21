// clientData.js

let supabaseClient;

function initializeSupabase() {
    const supabaseUrl = 'https://ozxntghuwrycyqqpvhst.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96eG50Z2h1d3J5Y3lxcXB2aHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwOTA3ODcsImV4cCI6MjA0NDY2Njc4N30.pYG9V2Xo2uJZdNveeootOX45rrPsH_cdkdbkL-90ak8';
    supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
}

// Call this function when the script loads
initializeSupabase();

// Function to save client data
window.guardarDatosCliente = async function(formData, urlFrente, urlDorso) {
    const clienteData = {
        numero_documento: formData.numeroDocumento,
        nombre_completo: `${formData.nombre} ${formData.apellido}`,
        telefono: formData.celular,
        url_frente: urlFrente,
        url_dorso: urlDorso,
        fecha_registro: new Date().toISOString(),
        estado: 'Aprobada (Pendiente de pago)',
        vehiculo_ingreso: formData.vehiculoIngreso,
        cantidad_cuotas: parseInt(formData.cantidadCuotas),
        valor_cuota: parseFloat(formData.valorCuotas),
        metodo_pago: formData.metodoPago
    };

    try {
        const { data, error } = await supabaseClient
            .from('clientes')
            .insert([clienteData])
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            throw new Error('No se recibieron datos después de la inserción');
        }

        console.log('Datos guardados:', data[0]);
        return data[0];
    } catch (error) {
        console.error('Error al guardar datos:', error);
        throw error;
    }
}

// Function to get client data by document number
window.obtenerDatosCliente = async function(numeroDocumento) {
    try {
        const { data, error } = await supabaseClient
            .from('clientes')
            .select('*')
            .eq('numero_documento', numeroDocumento)
            .single();

        if (error) throw error;

        console.log('Datos del cliente:', data);
        return data;
    } catch (error) {
        console.error('Error al obtener datos:', error);
        throw error;
    }
}

// Function to update client status
window.actualizarVistasVehiculo = async function(vehiculoId) {
    try {
        const { data, error } = await supabaseClient
            .from('vehiculos')
            .select('views')
            .eq('id', vehiculoId)
            .single();

        if (error) throw error;

        const newViewCount = (data.views || 0) + 1;

        const { data: updateData, error: updateError } = await supabaseClient
            .from('vehiculos')
            .update({ views: newViewCount })
            .eq('id', vehiculoId);

        if (updateError) throw updateError;

        console.log('Vistas del vehículo actualizadas:', newViewCount);
        return newViewCount;
    } catch (error) {
        console.error('Error al actualizar vistas del vehículo:', error);
        return 0; // Devolver 0 en caso de error
    }
}

window.agregarUsuarioInteresado = async function(nombre, vehiculoId) {
    try {
        const { data, error } = await supabaseClient
            .from('interested_users')
            .insert([{ name: nombre, vehiculo_id: vehiculoId }]);

        if (error) throw error;

        console.log('Usuario interesado agregado:', data);
        return data;
    } catch (error) {
        console.error('Error al agregar usuario interesado:', error);
        throw error;
    }
}

window.actualizarVistasVehiculo = async function(vehiculoId) {
    try {
        const { data, error } = await supabaseClient
            .from('vehiculos')
            .select('views')
            .eq('id', vehiculoId)
            .single();

        if (error) throw error;

        const newViewCount = (data.views || 0) + 1;

        const { data: updateData, error: updateError } = await supabaseClient
            .from('vehiculos')
            .update({ views: newViewCount })
            .eq('id', vehiculoId);

        if (updateError) throw updateError;

        console.log('Vistas del vehículo actualizadas:', newViewCount);
        return newViewCount;
    } catch (error) {
        console.error('Error al actualizar vistas del vehículo:', error);
        return 0; // Devolver 0 en caso de error
    }
}

// ... (resto de las funciones sin cambios) ...

async function updateInterestedUsersCount(vehiculoId) {
    try {
        const { count, error } = await supabaseClient
            .from('interested_users')
            .select('*', { count: 'exact', head: true })
            .eq('vehiculo_id', vehiculoId);

        if (error) throw error;

        const countElement = document.getElementById('interestedUsersCount');
        if (countElement) {
            countElement.textContent = count;
        }
        return count;
    } catch (error) {
        console.error('Error al obtener el conteo de usuarios interesados:', error);
        return 0;
    }
}

async function mostrarInteresados(vehiculoId) {
    try {
        const { data, error } = await supabaseClient
            .from('interested_users')
            .select('name')
            .eq('vehiculo_id', vehiculoId);

        if (error) throw error;

        const interesadosContainer = document.getElementById('interesadosContainer');
        interesadosContainer.innerHTML = '<h3 class="font-semibold mb-2">Usuarios Interesados:</h3>';
        if (data.length > 0) {
            const lista = document.createElement('ul');
            data.forEach(usuario => {
                const item = document.createElement('li');
                item.textContent = usuario.name;
                lista.appendChild(item);
            });
            interesadosContainer.appendChild(lista);
        } else {
            interesadosContainer.innerHTML += '<p>No hay usuarios interesados aún.</p>';
        }
        interesadosContainer.classList.remove('hidden');
    } catch (error) {
        console.error('Error al obtener los usuarios interesados:', error);
    }
}

async function mostrarInteresados(vehiculoId) {
    try {
        const { data, error } = await supabaseClient
            .from('interested_users')
            .select('name')
            .eq('vehiculo_id', vehiculoId);

        if (error) throw error;

        const interesadosLista = document.getElementById('interesadosLista');
        interesadosLista.innerHTML = '';

        if (data.length > 0) {
            const lista = document.createElement('ul');
            lista.className = 'list-disc pl-5';
            data.forEach(usuario => {
                const item = document.createElement('li');
                item.textContent = usuario.name;
                item.className = 'mb-2';
                lista.appendChild(item);
            });
            interesadosLista.appendChild(lista);
        } else {
            interesadosLista.innerHTML = '<p>No hay usuarios interesados aún.</p>';
        }

        document.getElementById('interesadosModal').classList.remove('hidden');
        document.getElementById('interesadosModal').classList.add('flex');
    } catch (error) {
        console.error('Error al obtener los usuarios interesados:', error);
        alert('Error al cargar los usuarios interesados. Por favor, intente nuevamente.');
    }
}

// Evento para cerrar el modal
document.getElementById('cerrarModalBtn').addEventListener('click', function() {
    document.getElementById('interesadosModal').classList.add('hidden');
    document.getElementById('interesadosModal').classList.remove('flex');
});

// Cerrar el modal si se hace clic fuera de él
document.getElementById('interesadosModal').addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.add('hidden');
        this.classList.remove('flex');
    }
});