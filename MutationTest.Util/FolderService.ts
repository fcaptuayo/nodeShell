import * as fs from "fs-extra";

export class FolderService {
    public async findFilesOnFolder(folderPath, filter) {
        const self = this;
        if (!fs.existsSync(folderPath)) {
            console.log("┌───────────────┬───────────────┬──────────────────────────────────┐");
            console.log(`│   The folder ${folderPath}            │`);
            console.log("│   does not exists                                                │");
            console.log("│   You must ceate folder and include all mutation apks            │");
            console.log("└───────────────┴───────────────┴──────────────────────────────────┘");
            return [];
        }
        return fs.readdirSync(folderPath);
    }
}
