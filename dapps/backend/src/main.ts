import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

// 🔹 Fungsi Utama untuk Menjalankan Aplikasi
// Ini adalah entry point (titik masuk) aplikasi NestJS.
async function bootstrap() {
  // Membuat instance aplikasi NestJS menggunakan AppModule sebagai root module
  const app = await NestFactory.create(AppModule);

  // 🔹 Konfigurasi Swagger (Dokumentasi API)
  // Menyiapkan judul, deskripsi, dan identitas pembuat API
  const config = new DocumentBuilder()
    .setTitle('Simple Storage dApp API') // Judul dokumentasi
    .setDescription('The Simple Storage dApp API description\n\n**Nama : Dimas Febrianto Wicaksono**\n**NIM : 251011401392**') // Deskripsi + Data Diri
    .setVersion('1.0') // Versi API
    .build();

  // Membuat dokumen Swagger berdasarkan konfigurasi di atas
  const document = SwaggerModule.createDocument(app, config);

  // Menampilkan UI Swagger di endpoint '/documentation'
  SwaggerModule.setup('documentation', app, document);

  // Menjalankan server pada port 3000 (atau port lain jika ada di environment variable)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
