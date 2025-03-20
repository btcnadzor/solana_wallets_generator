const { Keypair } = require('@solana/web3.js');
const readlineSync = require('readline-sync');
const fs = require('fs');
const path = require('path');

// Функция для генерации одного кошелька
function generateWallet() {
    const keypair = Keypair.generate();
    return {
        publicKey: keypair.publicKey.toString(),
        privateKey: Array.from(keypair.secretKey)
    };
}

// Функция для создания директории, если она не существует
function createDirectoryIfNotExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// Основная функция генерации кошельков
function generateWallets() {
    // Запрашиваем название папки
    const folderName = readlineSync.question('Введите название папки: ');
    if (!folderName) {
        console.error('Название папки обязательно!');
        process.exit(1);
    }

    // Запрашиваем количество кошельков
    const defaultCount = 1;
    const count = readlineSync.question(`Сколько кошельков нужно создать? (по умолчанию ${defaultCount}): `);
    const walletsCount = parseInt(count) || defaultCount;

    // Создаем директорию
    const dirPath = path.join(process.cwd(), folderName);
    createDirectoryIfNotExists(dirPath);

    console.log(`\nНачинаю генерацию ${walletsCount} кошельков...`);

    // Генерируем кошельки
    for (let i = 0; i < walletsCount; i++) {
        const wallet = generateWallet();
        const fileName = `${wallet.publicKey}.json`;
        const filePath = path.join(dirPath, fileName);

        // Сохраняем приватный ключ в файл в одну строку
        fs.writeFileSync(filePath, JSON.stringify(wallet.privateKey));
        console.log(`Создан кошелек ${i + 1}/${walletsCount}: ${wallet.publicKey}`);
    }

    console.log(`\nГотово! Все кошельки сохранены в директории: ${dirPath}`);
}

// Запускаем генерацию
try {
    generateWallets();
} catch (error) {
    console.error('Произошла ошибка:', error.message);
    process.exit(1);
} 