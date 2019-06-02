import {UtilsService} from "./MutationTest.Util/UtilsService";
import {FolderService} from "./MutationTest.Util/FolderService";
import * as fs from "fs-extra";
import * as Path from "path";
import {ImageCompareService} from "./MutationTest.Util/ImageCompareService";


export class ResembleStart {

    private _utilService;
    private _folderService;
    private _imageCompareService;
    private APKS_FOLDER = "apks";
    private basePath = "/";
    private averageCollection = [];
    private averageStillbornCollection = [];
    private averageTrivialCollection = [];

    constructor() {
        this._utilService = new UtilsService();
        this._folderService = new FolderService();
        this._imageCompareService = new ImageCompareService();
    }

    public async runAllTests() {
        const self = this;
        const apksFolder = Path.join(__dirname, '..', this.APKS_FOLDER);
        const mutationFolders = await this._folderService.findFilesOnFolder(apksFolder);
        for (let index = 0; index < mutationFolders.length; index++) {
            const item = mutationFolders[index];
            console.log(Path.join(this.APKS_FOLDER, item));
            const isBase = index == 0;
            await this.cleanPreviousResults(Path.join(this.APKS_FOLDER, item));
            await self.runSingleTest(isBase, Path.join(this.APKS_FOLDER, item));
            if (this.basePath) {
                await self.compareWithBase(Path.join(this.APKS_FOLDER, item));
            }
        }
        this.generateGeneralSupportFile();
        this.generateStillbornSupportFile();
        this.generateTrivialSupportFile();

    }

    public async cleanPreviousResults(mutationFolder) {
        await this._folderService.emptyFolder(Path.join(mutationFolder, 'result'));
    }

    public async runSingleTest(isBaseApk: boolean, mutationFolder) {
        if (isBaseApk) {
            this.basePath = mutationFolder;
        }
    }

    public async compareWithBase(mutationFolder) {
        const beforeFolder = Path.join(this.basePath, 'output');
        const afterFolder = Path.join(mutationFolder, 'output');
        const resultFolder = Path.join(mutationFolder, 'result');
        let misMatchPercentageAverage = await this._imageCompareService.compareImagesFromDir(beforeFolder, afterFolder, resultFolder, '.png');

        let typeMutator = "Equivalente";
        if (misMatchPercentageAverage == 0) {
            typeMutator = "Stillborn";
        } else if (misMatchPercentageAverage < 95.1) {
            typeMutator = "Trivial";
        }

        console.log("┌───────────────┬───────────────┬───────────────────────────────────────┐");
        console.log("│   Start evaluation the mutation folder !!                             │");
        console.log("│   Result the evaluation the mutation folder                           │");
        console.log("│   Summary:                                                            │");
        console.log(`│   MUTATION NAME= ${mutationFolder}  %            │`);
        console.log(`│   TYPE MUTATOR = ${typeMutator}                           │`);
        console.log(`│   AVERAGE EVALUATION= ${misMatchPercentageAverage}  %              │`);
        console.log("└───────────────┴───────────────┴───────────────────────────────────────┘");

        let result = {
            folder: mutationFolder,
            average: misMatchPercentageAverage + "%",
            type: typeMutator,
            step_by_step: "../parcial2/mutation-folder/" + mutationFolder + "/output/log.log",
            result_mutation: "../parcial2/mutation-folder/" + mutationFolder + "/output/result.json",
            result_regression: "../parcial2/mutation-folder/" + mutationFolder + "/result/*",
        };

        this.averageCollection.push(result)
        if (misMatchPercentageAverage == 0) {
            this.averageStillbornCollection.push(result);
        } else if (misMatchPercentageAverage < 95.1) {
            this.averageTrivialCollection.push(result);
        }
    }

    public async generateGeneralSupportFile() {
        console.log(Path.join(__dirname, 'average_results.json'));
        fs.writeFileSync(Path.join(__dirname, 'average_results.json'), JSON.stringify(this.averageCollection));
        console.log("┌───────────────┬───────────────┬───────────────────────────────────────┐");
        console.log("│   Finished process the compare results!!!                             │");
        console.log(`│   Please view the file in :     ${Path.join(__dirname, 'average_results.json')}  │`);
        console.log("└───────────────┴───────────────┴───────────────────────────────────────┘");
    }

    public async generateStillbornSupportFile() {
        console.log(Path.join(__dirname, 'average_results_stillborn.json'));
        fs.writeFileSync(Path.join(__dirname, 'average_results_stillborn.json'), JSON.stringify(this.averageStillbornCollection));
        console.log("┌───────────────┬───────────────┬───────────────────────────────────────┐");
        console.log("│   Finished process the compare results for Stillborn !!!              │");
        console.log(`│   Please view the file in :     ${Path.join(__dirname, 'average_results_stillborn.json')}  │`);
        console.log("└───────────────┴───────────────┴───────────────────────────────────────┘");
    }

    public async generateTrivialSupportFile() {
        console.log(Path.join(__dirname, 'average_results_trivial.json'));
        fs.writeFileSync(Path.join(__dirname, 'average_results_trivial.json'), JSON.stringify(this.averageTrivialCollection));
        console.log("┌───────────────┬───────────────┬───────────────────────────────────────┐");
        console.log("│   Finished process the compare results for Trivial!!!                 │");
        console.log(`│   Please view the file in :     ${Path.join(__dirname, 'average_results_trivial.json')}  │`);
        console.log("└───────────────┴───────────────┴───────────────────────────────────────┘");
    }
}

const mutationTester = new ResembleStart();
mutationTester.runAllTests();
