import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Sube un archivo en memoria (buffer) y devuelve el resultado, con result.secure_url
export function subirImagen(buffer, carpeta = 'agroanima/products') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: carpeta, resource_type: 'image' },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });
}

// Borra una imagen de Cloudinary a partir de su URL (ignora las imágenes viejas locales)
export async function borrarImagen(url) {
  if (!url || !url.includes('res.cloudinary.com')) return;
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  if (match) await cloudinary.uploader.destroy(match[1]);
}