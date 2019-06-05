jest.mock("../../services/converterService");
import { ConverterService } from "../../services/converterService";
import { MockFactory } from "../../test/mockFactory";
import { AzureOfflinePlugin } from "./azureOfflinePlugin";
import { invokeHook } from "../../test/utils"
import Serverless from "serverless";

describe("Azure Offline Plugin", () => {

  const transformedFunctions = MockFactory.createTestTransformedFunctions();

  function createPlugin(sls?: Serverless, options?: Serverless.Options) {
    return new AzureOfflinePlugin(
      sls || MockFactory.createTestServerless(),
      options || MockFactory.createTestServerlessOptions(),
    )
  }

  beforeAll(() => {
    ConverterService.prototype.convertServerlessToFunctionJson = jest.fn(() => MockFactory.createTestTransformedFunctions())
  });

  it("invokes build hook", async () => {
    const sls = MockFactory.createTestServerless();
    const plugin = createPlugin(sls);
    await invokeHook(plugin, "offline:build:build");
    expect(ConverterService.prototype.convertServerlessToFunctionJson).toBeCalled();
    const writeFileCalls = (sls.utils.writeFileSync as any).mock.calls;
    expect(writeFileCalls).toHaveLength(transformedFunctions.length);
    for (let i = 0; i < transformedFunctions.length; i++) {
      expect(writeFileCalls[i]).toEqual([
        `function${i + 1}/function.json`,
        JSON.stringify(transformedFunctions[i].json, null, 2),
      ])
    }
  });
});