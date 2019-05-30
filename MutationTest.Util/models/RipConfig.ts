export interface IRipConfig {
    "apkPath": string;
    "outputFolder": string;
    "isHybrid": boolean;
    "executionMode": string;
    "scriptPath": string;
    "executionParams": IExecutionParams
}

export interface IExecutionParams {
    "events": number;
    "time": number;
}