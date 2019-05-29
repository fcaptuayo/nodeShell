import {UtilsService} from "./MutationTest.Util/UtilsService";
import {FolderService} from "./MutationTest.Util/FolderService";
import * as Path from "path";


export class AppStart {

    private _utilService;
    private _folderService;
    private APK_NAME = "com.evancharlton.mileage_3110-aligned-debugSigned.apk";

    constructor() {
        this._utilService = new UtilsService();
        this._folderService = new FolderService();
    }

    public async runAllTests() {
        const self = this;
        const apksFolder = Path.join(__dirname, '..', 'apks');
        console.log(apksFolder);
        const mutationFolders = await this._folderService.findFilesOnFolder(apksFolder, "apk");

        for (let index = 0; index < mutationFolders.length; index++) {
            const item = mutationFolders[index];
            await self.runSingleTest(item);
        }
    }

    public async runSingleTest(mutationFolder) {
        const mutationFilePath = Path.join(mutationFolder, this.APK_NAME);
        console.log("running test", mutationFilePath);
    }
}

const mutationTester = new AppStart();
mutationTester.runAllTests();
