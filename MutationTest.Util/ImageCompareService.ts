import * as  compareImages from "resemblejs/compareImages";
import * as  fs from 'fs-extra';
import * as Path from "path";

export class ImageCompareService {

    constructor() {

    }

    public async compareImagesFromDir(beforePath, afterPath, resultPath, filter) {
        let misMatchPercentageTotal = 0;
        let misMatchPercentageAverage = 100;
        console.log("┌───────────────┬───────────────┬───────────────────────────────────────────────────────────────────────────┐");
        console.log(`│   beforePath ${beforePath}            `);
        console.log(`│   afterPath  ${afterPath}             `);
        console.log(`│   resultPath ${resultPath}            `);
        let dataResult = {};
        if (!fs.existsSync(beforePath)) {
            console.log("no dir ", beforePath);
            return;
        }
        let files = fs.readdirSync(beforePath).filter(function (file) {
            return Path.extname(file).toLowerCase() === filter;
        });

        //console.log('files', files);
        //console.log('ensure ', resultPath);

        if (!fs.existsSync(resultPath)) {
            fs.mkdirSync(resultPath);
        }

        for (let i = 0; i < files.length; i++) {
            let beforeFilePath = Path.join(beforePath, files[i]);
            let afterFilePath = Path.join(afterPath, files[i]);
            let resultFilePath = Path.join(resultPath, files[i]);
            const baseName = Path.basename(beforeFilePath);
            /*console.log('-- baseName: ', baseName);
            console.log('-- beforeFilePath: ', beforeFilePath);
            console.log('-- afterFilePath: ', afterFilePath);
            console.log('-- resultFilePath: ', resultFilePath);*/
            const result = await this.executeCompare(beforeFilePath, afterFilePath, resultFilePath);
            if (result) {
                dataResult[baseName] = result.misMatchPercentage;
                misMatchPercentageTotal = misMatchPercentageTotal + parseFloat(result.misMatchPercentage);
            } else {
                dataResult[baseName] = 100;
                misMatchPercentageTotal = misMatchPercentageTotal + 100.0;
            }

        }

        if (Object.keys(dataResult).length > 0){
            misMatchPercentageAverage = misMatchPercentageAverage - (misMatchPercentageTotal/files.length);
        } else {
            misMatchPercentageAverage = 0;
        }

        console.log(`|   VRT AVERAGE THE MUTATION TEST ( ${JSON.stringify(misMatchPercentageAverage)} %)        |`    );
        console.log("└───────────────┴───────────────┴───────────────────────────────────────────────────────────────────────────┘");
        console.log("\n\n\n");
        return misMatchPercentageAverage;
    }

    public async executeCompare(imageBefore, imageAfter, imageOutput) {
        if (fs.existsSync(imageBefore) && fs.existsSync(imageAfter)) {
            return await this.getDiff(imageBefore, imageAfter, imageOutput);
        }
        return null;
    }

    public async getDiff(input_image01, input_image02, output_image) {
        const options = {
            output: {
                errorColor: {
                    red: 255,
                    green: 0,
                    blue: 255
                },
                errorType: 'movement',
                transparency: 0.3,
                largeImageThreshold: 1200,
                useCrossOrigin: false,
                outputDiff: true
            },
            scaleToSameSize: true,
            ignore: ['nothing', 'less', 'antialiasing', 'colors', 'alpha'],
        };
        const data = await compareImages(
            await fs.readFile(input_image01),
            await fs.readFile(input_image02),
            options
        );
        await fs.writeFile(output_image, data.getBuffer());
        return data;
    }

}

