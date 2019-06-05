import AzureProvider from "../../provider/azureProvider";
import Serverless from "serverless";
import { ConverterService } from "../../services/converterService"
import { OfflineService } from "../../services/offlineService";


export class AzureOfflinePlugin {
  public hooks: { [eventName: string]: Promise<any> };
  public commands: any;
  private offlineService: OfflineService;

  public constructor(private serverless: Serverless, private options: Serverless.Options) {
    this.hooks = {
      "before:offline:offline": this.azureOfflineBuild.bind(this),
      "offline:build:build": this.azureOfflineBuild.bind(this),
      "offline:offline": this.azureOfflineStart.bind(this),
    };

    this.commands = {
      offline: {
        usage: "Start Azure Function App offline",
        lifecycleEvents: [
          "offline",
        ],
        commands: {
          build: {
            usage: "Build necessary files for running Azure Function App offline",
            lifecycleEvents: [
              "build",
            ]
          }
        }
      }
    }
  }

  private async azureOfflineBuild(){
    this.offlineService = new OfflineService(this.serverless, this.options);
    this.offlineService.build();
  }

  private async azureOfflineStart(){
    if (!this.offlineService) {
      this.offlineService = new OfflineService(this.serverless, this.options);
    }
    this.offlineService.start();
  }
}