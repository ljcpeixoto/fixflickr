const fs = require('fs');
const path = require('path');

const backupDirectory = '<path_to_backup_directory>'; // Specify the path to the directory containing the backup files
const restoreDirectory = '<path_to_restore_directory>'; // Specify the path to the directory where you want to restore the files

// Function to create a directory if it doesn't exist
const createDirectoryIfNotExists = (directoryPath) => {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
    }
};

// Function to move a file from the source path to the destination path
const moveFile = (sourcePath, destinationPath) => {
    fs.renameSync(sourcePath, destinationPath);
};

// Read albums.json file
const readAlbums = () => {
    const albumsPath = path.join(backupDirectory, 'albums.json');
    const albumsData = fs.readFileSync(albumsPath, 'utf-8');
    return JSON.parse(albumsData);
};

// Restore backup files
const restoreBackup = () => {
    const albums = readAlbums();

    // Create restore directory if it doesn't exist
    createDirectoryIfNotExists(restoreDirectory);

    // Process albums
    albums.forEach((album) => {
        const albumDirectory = path.join(restoreDirectory, album.title);
        createDirectoryIfNotExists(albumDirectory);

        // Process photos in the album
        album.photos.forEach((photo) => {
            const photoPath = path.join(backupDirectory, `photo_${photo.id}.json`);
            const photoData = fs.readFileSync(photoPath, 'utf-8');
            const photoInfo = JSON.parse(photoData);

            const year = new Date(photoInfo.dateTaken).getFullYear();
            const month = new Date(photoInfo.dateTaken).toLocaleString('default', { month: '2-digit' });
            const monthDirectory = path.join(albumDirectory, `${year}-${month}`);
            createDirectoryIfNotExists(monthDirectory);

            // Move the photo file to the appropriate directory
            const sourcePath = path.join(backupDirectory, `${photo.id}.jpg`);
            const destinationPath = path.join(monthDirectory, `${photoInfo.title}.jpg`);
            moveFile(sourcePath, destinationPath);
        });
    });

    console.log('Restoration completed successfully!');
};

// Start the restoration process
restoreBackup();
