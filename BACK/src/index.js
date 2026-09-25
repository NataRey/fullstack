import "dotenv/config";
import "./conexion.js";

import servidor from "./servidor.js";
servidor.listen(3000, ()=>{
    console.log("El servidor esta conectado a http://localhost:3000");
});
