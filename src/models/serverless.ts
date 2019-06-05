// TODO: Expand upon this model or find model within service
export interface ServerlessConfig {
  service: string;
  provider: any;
  plugins: string[];
  package: any;
  functions: any;
}