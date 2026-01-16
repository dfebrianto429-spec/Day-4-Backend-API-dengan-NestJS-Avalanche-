import { Controller, Get } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { ApiTags } from '@nestjs/swagger';

// @Controller('blockchain') mendefinisikan bahwa semua route di class ini akan memiliki prefix '/blockchain'
// Contoh: GET /blockchain/value, GET /blockchain/events
@ApiTags('Blockchain')
@Controller('blockchain')
export class BlockchainController {
    // Inject BlockchainService agar bisa digunakan di controller ini
    constructor(private readonly blockchainService: BlockchainService) { }

    // Endpoint 1: GET /blockchain/value
    // Tujuan: Mengambil nilai terbaru yang tersimpan di smart contract
    @Get('value')
    async getValue() {
        // Memanggil fungsi getLatestValue dari service
        return this.blockchainService.getLatestValue();
    }

    // Endpoint 2: GET /blockchain/events
    // Tujuan: Mengambil daftar riwayat perubahan nilai (event history) dari blockchain
    @Get('events')
    async getEvents() {
        // Memanggil fungsi getValueUpdatedEvents dari service
        return this.blockchainService.getValueUpdatedEvents();
    }
}
