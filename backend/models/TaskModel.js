import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
    {
        titulo: {
            type: String,
            required: [true, "El título es obligatorio"],
        },
        descripcion: {
            type: String,
            required: [true, "La descripción es obligatoria"],
        },
        fecha_limite: {
            type: Date,
            required: [true, "La fecha límite es obligatoria"],
            validate: {
                validator: function (value) {
                    return value >= new Date();
                },
                message: "La fecha límite no puede estar en el pasado"
            }
        },
        materia: {
            type: String,
            required: [true, "La materia es obligatoria"],
        },
        estado: {
            type: String,
            enum: ["pendiente", "completado"],
            default: "pendiente",
            required: [true, "El estado es obligatorio"],
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);



export const TaskModel = mongoose.model("Tarea", taskSchema);
