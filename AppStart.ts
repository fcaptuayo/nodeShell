import {UtilsService} from "./MutationTest.Util/UtilsService";
import {FolderService} from "./MutationTest.Util/FolderService";
import * as Path from "path";
import {IRipConfig} from "./MutationTest.Util/models/RipConfig";
import {ImageCompareService} from "./MutationTest.Util/ImageCompareService";


export class AppStart {

    private _utilService;
    private _folderService;
    private _imageCompareService;
    private APK_NAME = "com.evancharlton.mileage_3110-aligned-debugSigned.apk";
    private APKS_FOLDER = "apks";
    private basePath = null;

    constructor() {
        this._utilService = new UtilsService();
        this._folderService = new FolderService();
        this._imageCompareService = new ImageCompareService();
    }

    public async runAllTests() {
        const self = this;
        if (this.validateEnv()) {
            const apksFolder = Path.join(__dirname, '..', this.APKS_FOLDER);
            const mutationFolders = await this._folderService.findFilesOnFolder(apksFolder);
            for (let index = 0; index < mutationFolders.length; index++) {
                const item = mutationFolders[index];
                const isBase = index == 0; //we assume that the first file is the base
                await this.cleanPreviousResults(Path.join(this.APKS_FOLDER, item));
                await self.runSingleTest(isBase, Path.join(this.APKS_FOLDER, item));
                if (this.basePath) {
                    await self.compareWithBase(Path.join(this.APKS_FOLDER, item));
                }
            }
        }
    }

    public async cleanPreviousResults(mutationFolder) {
        await this._folderService.emptyFolder(Path.join(mutationFolder, 'output'));
        await this._folderService.emptyFolder(Path.join(mutationFolder, 'result'));
    }

    public async runSingleTest(isBaseApk: boolean, mutationFolder) {
        const mutationFilePath = Path.join(mutationFolder, this.APK_NAME);
        let command = "java -jar RIPRR.jar " + Path.join(mutationFolder, 'rip_config.json');
        let scriptPath = Path.join(mutationFolder, 'output', 'result.json');
        if (isBaseApk) {
            // this command is only for de base apk
            this.basePath = mutationFolder;
            scriptPath = Path.join(this.basePath, 'output', 'result.json');
            command = "java -jar RIP.jar " + Path.join(mutationFolder, 'rip_config.json');
        }

        const ripConfig: IRipConfig = {
            apkPath: Path.join(mutationFilePath),
            outputFolder: Path.join(mutationFolder, 'output'),
            isHybrid: false,
            executionMode: "events",
            scriptPath: scriptPath,//Todo: configurar bien esto para que ejecute los mismos pasos de la prueba base
            executionParams: {
                events: 10,
                time: 2
            }
        };
        console.log("┌───────────────┬───────────────┬───────────────────────────────────────────────────────────────────────────┐");
        console.log(`│  ${JSON.stringify(ripConfig)}`);
        await this._folderService.createConfigFile(mutationFolder, ripConfig);

        await this._utilService.executeCommand(command);
    }

    public async compareWithBase(mutationFolder) {
        const beforeFolder = Path.join(this.basePath, 'output');
        const afterFolder = Path.join(mutationFolder, 'output');
        const resultFolder = Path.join(mutationFolder, 'result');
        await this._imageCompareService.compareImagesFromDir(beforeFolder, afterFolder, resultFolder, '.png');
    }


    public async validateEnv() {
        if (!process.env.AAPT_LOCATION) {
            console.log("┌───────────────┬───────────────┬───────────────────────────────────────┐");
            console.log("│   Test is not running !!!                                             │");
            console.log("│   Before to start the test you need configure the next environment    │");
            console.log("│   vars must be configured:                                            │");
            console.log("│                                                                       │");
            console.log("│   AAPT_LOCATION={Android_SDK_LOCATION}/build-tools/28.0.3/aapt.exe    │");
            console.log("└───────────────┴───────────────┴───────────────────────────────────────┘");
            return false;
        } else {
            return true;
        }
    }
}

const mutationTester = new AppStart();
mutationTester.runAllTests();
