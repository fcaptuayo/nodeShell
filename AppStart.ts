import {UtilsService} from "./MutationTest.Util/UtilsService";
import {FolderService} from "./MutationTest.Util/FolderService";
import * as Path from "path";
import {IRipConfig} from "./MutationTest.Util/models/RipConfig";


export class AppStart {

    private _utilService;
    private _folderService;
    private APK_NAME = "com.evancharlton.mileage_3110-aligned-debugSigned.apk";
    private APKS_FOLDER = "apks";

    constructor() {
        this._utilService = new UtilsService();
        this._folderService = new FolderService();

    }

    public async runAllTests() {
        const self = this;
        if (this.validateEnv()) {
            const apksFolder = Path.join(__dirname, '..', this.APKS_FOLDER);
            const mutationFolders = await this._folderService.findFilesOnFolder(apksFolder, "apk");
            for (let index = 0; index < mutationFolders.length; index++) {
                const item = mutationFolders[index];
                await self.runSingleTest(Path.join(this.APKS_FOLDER, item));
            }
        }
    }

    public async runSingleTest(mutationFolder) {
        const mutationFilePath = Path.join(mutationFolder, this.APK_NAME);
        const command = "java -jar RIP.jar " + Path.join(mutationFolder, 'rip_config.json');
        const ripConfig: IRipConfig = {
            apkPath: Path.join(mutationFilePath),
            outputFolder: Path.join(mutationFolder, 'output'),
            isHybrid: false,
            executionMode: "events",
            scriptPath: Path.join(mutationFolder, 'output', 'result.json'),
            executionParams: {
                events: 20,
                time: 2
            }
        };
        await this._folderService.createConfigFile(mutationFolder, ripConfig);

        await this._utilService.executeCommand(command);
        console.log(command);
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
