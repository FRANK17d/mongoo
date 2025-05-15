import { TaskModel } from "../models/TaskModel.js"; //me imaginare que ese sera el archivo del modelo xd

//Metodo para obtener todas las tareas de la DB
export const getAllTask = async (req, res) => {
    try {
        const task = await TaskModel.find() //Obtener todas las tareas de la DB asociada con el modelo
        res.status(200).json(task) // convertir el objeto a respuesta .JSON
    } catch (error) {
        return res.status(500).json({message: 'Error al obtener las tareas',error}) //Mostrando el error xd
    }
}

//Metodo para obtener una tarea por ID
export const getTask = async (req, res) => {
    try {
        const tarea = await TaskModel.findById(req.params.id); //Obtener la tarea de la DB asociada con el modelo
        res.status(200).json(tarea) // convertir el objeto a respuesta.JSON
    }catch(error){
        return res.status(500).json({message: 'Error al obtener la tarea',error}) //Mostrando el error xd
    }
}

//Metodo para crear una tarea
export const createTask = async (req, res) => {
    try {
        const newTask = new TaskModel(req.body); // Creando una nueva tarea con el modelo
        const taskSave = await newTask.save(); // Guardar la nueva tarea en la base de datos
        res.status(201).json(taskSave); // Enviar la tarea creada como respuesta
    } catch (error) {
        return res.status(500).json({ message: 'Error al crear la tarea', error }); // Mostrando el error xd
    }
}

//Metodo para actualizar una tarea

export const updateTask = async (req,res) =>{
    try{
        const taskUpdate = await TaskModel.findByIdAndUpdate(
            req.params.id, //este es el id de la tarea que se quiere actualizar
            req.body, //este es el objeto con los datos que se quieren actualizar
            {new: true}); //Actualizar la tarea de la DB asociada con el modelo
        if (!taskUpdate) {
            return res.status(404).json({ message: 'Tarea no encontrada' }); // Si la tarea no se encuentra, enviar un mensaje de error 
        }
        res.status(200).json(taskUpdate) //Enviar la tarea actualizada como respuesta :D  
    }catch(error){
        return res.status(500).json({message: 'Error al actualizar la tarea',error}) //Mostrando el error xd
    }
}
//Metodo para eliminar una tarea
export const deleteTask = async (req,res) =>{
    try{
        const taskDelete = await TaskModel.findByIdAndDelete(req.params.id); //Eliminar la tarea de la DB asociada con el modelo
        if (!taskDelete) {
            return res.status(404).json({ message: 'Tarea no encontrada' }); // Si la tarea no se encuentra, enviar un mensaje de error
        }
        res.status(200).json({ message: 'Tarea eliminada correctamente' }); //Enviar un mensaje de confirmación de eliminación
    }catch(error){
        return res.status(500).json({message: 'Error al eliminar la tarea',error}) //Mostrando el error xd
    }
}