import * as fs from 'fs';
import * as path from 'path';

interface Album {
    photo_count: string;
    id: string;
    url: string;
    title: string;
    description: string;
    view_count: string;
    created: string;
    last_updated: string;
    cover_photo: string;
    photos: string[];
}

interface PhotoInfo {
    id: string;
    name: string;
    description: string;
    count_views: string;
    count_faves: string;
    count_comments: string;
    date_taken: string;
    count_tags: string;
    count_notes: string;
    rotation: number;
    date_imported: string;
    photopage: string;
    original: string;
    license: string;
    geo: any[];
    groups: any[];
    albums: any[];
    tags: any[];
    people: any[];
    notes: any[];
    privacy: string;
    comment_permissions: string;
    tagging_permissions: string;
    safety: string;
    comments: any[];
}

const restoreBackup = (backupDirectory: string, restoreDirectory: string) => {
    // Function to create a directory if it doesn't exist
    const createDirectoryIfNotExists = (directoryPath: string) => {
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath);
        }
    };

    // Function to move a file from the source path to the destination path
    const moveFile = (sourcePath: string, destinationPath: string) => {
        fs.renameSync(sourcePath, destinationPath);
    };

    // Read albums.json file
    const readAlbums = () => {
        const albumsPath = path.join(backupDirectory, 'albums.json');
        const albumsData = fs.readFileSync(albumsPath, 'utf-8');
        const { albums } = JSON.parse(albumsData) as { albums: Album[] };
        return albums;
    };

    const albums = readAlbums();

    // Create restore directory if it doesn't exist
    createDirectoryIfNotExists(restoreDirectory);

    // Process albums
    albums.forEach((album) => {
        const albumDirectory = path.join(restoreDirectory, album.title);
        createDirectoryIfNotExists(albumDirectory);

        // Process photos in the album
        album.photos.forEach((photoId) => {
            const photoPath = path.join(backupDirectory, `photo_${photoId}.json`);
            const photoData = fs.readFileSync(photoPath, 'utf-8');
            const photoInfo = JSON.parse(photoData) as PhotoInfo;

            const year = new Date(photoInfo.date_taken).getFullYear();
            const month = new Date(photoInfo.date_taken).toLocaleString('default', { month: '2-digit' });
            const monthDirectory = path.join(albumDirectory, `${year}-${month}`);
            createDirectoryIfNotExists(monthDirectory);

            // Search for the photo file in directories with matching names
            const parentDirectory = path.dirname(backupDirectory);
            const backupDirectoryName = path.basename(backupDirectory);
            const directories = fs.readdirSync(parentDirectory, { withFileTypes: true })
                .filter((dirent) => dirent.isDirectory() && dirent.name.startsWith(backupDirectoryName))
                .map((dirent) => dirent.name);

            let photoFile: string | undefined;
            directories.some((directory) => {
                const photoFilePath = path.join(parentDirectory, directory, `${photoId}.jpg`);
                if (fs.existsSync(photoFilePath)) {
                    photoFile = photoFilePath;
                    return true;
                }
            });

            if (photoFile) {
                // Move the photo file to the appropriate directory
                const destinationPath = path.join(monthDirectory, `${photoInfo.name}.jpg`);
                moveFile(photoFile, destinationPath);
            } else {
                console.log(`Photo file not found for ID: ${photoInfo.id}`);
            }
        });
    });

    console.log('Restoration completed successfully!');
};

// Parse command-line arguments
const args = process.argv.slice(2);
const backupDirectory = args[0] || '<default_backup_directory>'; // Specify the default backup directory if not provided as argument
const restoreDirectory = args[1] || '<default_restore_directory>'; // Specify the default restore directory if not provided as argument

// Start the restoration process
restoreBackup(backupDirectory, restoreDirectory);
