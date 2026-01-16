import {
    Injectable,
    InternalServerErrorException,
    ServiceUnavailableException,
} from '@nestjs/common';
import { createPublicClient, http } from 'viem';
import { avalancheFuji } from 'viem/chains';
import { SIMPLE_STORAGE_ABI } from './simple-storage.abi';

// @Injectable() menandakan bahwa class ini adalah Provider yang bisa di-inject ke controller atau service lain.
@Injectable()
export class BlockchainService {
    private client; // Objek client untuk koneksi ke blockchain
    private contractAddress: `0x${string}`; // Alamat smart contract yang akan diinteraksi

    constructor() {
        // 🔹 Inisialisasi Public Client viem
        // Kita menggunakan 'createPublicClient' untuk membuat koneksi read-only ke blockchain.
        // Konfigurasi ini menghubungkan backend ke Avalanche Fuji Testnet.
        this.client = createPublicClient({
            chain: avalancheFuji, // Setup chain ke Avalanche Fuji
            transport: http('https://api.avax-test.network/ext/bc/C/rpc', {
                timeout: 10_000, // Memberikan batas waktu (timeout) 10 detik agar request tidak menggantung selamanya jika jaringan lambat
            }),
        });

        // 🔹 Setup Contract Address
        // Ini adalah alamat smart contract SimpleStorage yang sudah dideploy sebelumnya.
        // Pastikan address ini sesuai dengan hasil deploy di materi Day 2.
        this.contractAddress = '0x348110Ce7ED5b6Eef926ef66f231C2F77d8cA74E';
    }

    // 🔹 Fungsi: Membaca Nilai Terbaru Smart Contract
    // Fungsi ini memanggil fungsi 'getValue' pada smart contract secara on-chain.
    async getLatestValue() {
        try {
            // Membaca data langsung dari smart contract menggunakan client viem
            const value = await this.client.readContract({
                address: this.contractAddress, // Target address contract
                abi: SIMPLE_STORAGE_ABI,       // Definisi struktur fungsi contract (ABI)
                functionName: 'getValue',      // Nama fungsi di solidity yang ingin dipanggil
            });

            // Mengembalikan hasil dalam format JSON string
            return {
                value: value.toString(), // BigInt harus dikonversi ke string agar bisa dikirim sebagai JSON
            };
        } catch (error: any) {
            // Jika terjadi error koneksi atau lainnya, tangani di handleRpcError
            this.handleRpcError(error);
        }
    }

    // 🔹 Fungsi: Mengambil Riwayat Event (Logs)
    // Fungsi ini mencari event 'ValueUpdated' yang pernah terjadi di blockchain.
    // Berguna untuk menampilkan histori perubahan nilai di frontend.
    async getValueUpdatedEvents() {
        try {
            // Mendapatkan nomor block terbaru saat ini
            const blockNumber = await this.client.getBlockNumber();

            // Mengambil logs/event dari contract
            const events = await this.client.getLogs({
                address: this.contractAddress,
                event: {
                    type: 'event',
                    name: 'ValueUpdated', // Nama event yang dicari
                    inputs: [{ name: 'newValue', type: 'uint256', indexed: false }], // Parameter event
                },
                // Mengambil dari 2000 block terakhir hingga block terbaru (latest)
                // Ini dilakukan untuk efisiensi agar tidak scan dari block genesis (awal)
                fromBlock: blockNumber - 2000n,
                toBlock: 'latest',
            });

            // Memformat data event agar lebih rapih dan mudah dibaca oleh client/frontend
            return events.map((event) => ({
                blockNumber: event.blockNumber?.toString(), // Nomor block dimana event terjadi
                value: event.args.newValue.toString(),      // Nilai baru yang disimpan saat itu
                txHash: event.transactionHash,              // Hash transaksi penyebab perubahan
            }));
        } catch (error: any) {
            this.handleRpcError(error);
        }
    }

    // 🔹 Centralized RPC Error Handler
    // Fungsi khusus untuk menangani berbagai kemungkinan error saat berinteraksi dengan RPC (Remote Procedure Call).
    // Ini membantu memberikan pesan error yang jelas ke user/frontend daripada sekadar 'Internal Server Error'.
    private handleRpcError(error: any): never {
        const message = error?.message?.toLowerCase() || '';

        // Kasus 1: Timeout (RPC tidak merespon dalam batas waktu)
        if (message.includes('timeout')) {
            throw new ServiceUnavailableException(
                'RPC timeout. Silakan coba beberapa saat lagi.'
            );
        }

        // Kasus 2: Error Jaringan (DNS, koneksi putus, dsb)
        if (
            message.includes('network') ||
            message.includes('fetch') ||
            message.includes('failed')
        ) {
            throw new ServiceUnavailableException(
                'Tidak dapat terhubung ke blockchain RPC.'
            );
        }

        // Kasus 3: Error Logik/Lainnya yang tidak terduga
        throw new InternalServerErrorException(
            'Terjadi kesalahan saat membaca data blockchain.'
        );
    }
}
