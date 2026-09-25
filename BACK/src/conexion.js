import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGODB)
  .then((dato) => {
    console.log("Esta conectado a la base de datos");
  })
  .catch((error) => {
    console.log("Error de conexión:", error);
  });