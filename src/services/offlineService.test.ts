import Serverless from "serverless";
import { OfflineService } from "./offlineService"
import { MockFactory } from "../test/mockFactory";

jest.mock("./converterService");
import { ConverterService } from "./converterService";

describe("Offline Service", () => {

  const transformedFunctions = MockFactory.createTestTransformedFunctions();

  function createService(sls?: Serverless) {
    return new OfflineService(
      sls || MockFactory.createTestServerless(),
      MockFactory.createTestServerlessOptions(),
    )
  }

  beforeAll(() => {
    ConverterService.prototype.convertServerlessToFunctionJson = jest.fn(() => transformedFunctions)
  })

  it("builds required files for offline execution", () => {
    const sls = MockFactory.createTestServerless();
    const service = createService(sls);
    service.build();
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