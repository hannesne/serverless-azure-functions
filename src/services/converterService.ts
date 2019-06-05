import { BaseService } from "./baseService";
import Serverless from "serverless";

export class ConverterService extends BaseService {
  public constructor(protected serverless: Serverless, protected options: Serverless.Options){
    super(serverless, options, false);
  }

  public convertServerlessToFunctionJson(): {name: string; json: any}[]{
    this.serverless.cli.log("Building required function.json files from serverless.yml...");
    const functions = this.getServerlessConfig().functions;
    const functionNames = Object.keys(functions);
    return functionNames.map((functionName) => {
      const slsFunction = functions[functionName]
      return { name: functionName, json: this.convertToFunctionJson(functionName, slsFunction) }
    });
  }

  private convertToFunctionJson(functionName: string, slsFunction: any) {
    // TODO - Stub until we piece out the conversion process
    return slsFunction;
  }
}