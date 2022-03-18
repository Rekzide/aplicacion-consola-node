const { guardarDB, leerDB } = require('./helper/guardarArchivo');
const { inquirerMenu, pausa, leerInput, listadoTareasBorrar, confirmar, mostarrListadoChecklist } = require('./helper/inquirer');
const Tareas = require('./models/tareas');

require('colors');


const main = async() => {
    let opt = '';
    const tareas = new Tareas();
    const tareasDB =  leerDB();

    if(tareasDB) {
        tareas.cargarTareasFromArray(tareasDB);
    }

    do {  
        //Imprimir el menú
        opt = await inquirerMenu();
        switch (opt) {
            case '1':
                const desc = await leerInput('Descripción: ');
                tareas.crearTarea(desc);
                break;
            case '2':
                tareas.listadoCompleto();
                break;
            case '3':
                tareas.listarPendientesCompletadas(true);
                break;
            case '4':
                tareas.listarPendientesCompletadas(false);
                break;
            case '5':
                const ids = await mostarrListadoChecklist(tareas.listadoArr);
                tareas.toggleCompletadas(ids);
                break;
            case '6':
                const id = await listadoTareasBorrar( tareas.listadoArr );
                if(id !== '0') {
                    const aceptar = await confirmar('¿Está seguro?')
                    if(aceptar){
                        tareas.borrarTarea(id);
                        console.log('Tarea borrada');
                    }
                }
                break;
            
        }
        guardarDB( tareas.listadoArr );
        await pausa();
    } while (opt !== '0');
}

main();