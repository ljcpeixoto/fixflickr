import * as fs from 'fs';
import path from 'path';

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
    const readAlbums = ()
