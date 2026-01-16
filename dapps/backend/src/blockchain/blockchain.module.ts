import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { BlockchainController } from './blockchain.controller';

// @Module mengatur dependensi untuk fitur Blockchain
// - controllers: Menentukan controller mana yang diproses di modul ini
// - providers: Menentukan service/logic apa yang tersedia untuk di-inject
@Module({
    controllers: [BlockchainController],
    providers: [BlockchainService],
})
export class BlockchainModule { }
