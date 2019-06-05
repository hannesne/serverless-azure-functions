import { BaseService } from "./baseService";
import Serverless from "serverless";
// import { Utils } from "../shared/utils"
import { ConverterService } from "./converterService";

export class OfflineService extends BaseService {
  
  public constructor(protected serverless: Serverless, protected options: Serverless.Options) {
    super(serverless, options, false);
  }

  public async build() {
    this.log("Building offline service");
    const converterService = new ConverterService(this.serverless, this.options);
    const transformedFunctions = converterService.convertServerlessToFunctionJson();
    for (const transformedFunction of transformedFunctions) {
      this.serverless.utils.writeFileSync(
        `${transformedFunction.name}/function.json`,
        JSON.stringify(transformedFunction.json, null, 2))
    }
    this.log("Finished building offline service");
  }

  public start() {
    this.log("Starting offline service");
    // TODO Do we spawn the process here? Or instruct users to just use npm start?
    // Utils.spawn("func host start");
    this.log("Finished starting service");
  }
}