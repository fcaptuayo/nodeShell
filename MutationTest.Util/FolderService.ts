import * as fs from "fs-extra";

export class FolderService {
    public async findFilesOnFolder(folderPath, filter) {
        const self = this;
        if (!fs.existsSync(folderPath)) {
            console.log("no dir ", folderPath);
            return;
        }
        return fs.readdirSync(folderPath);
    }
}
