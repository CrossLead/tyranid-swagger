import { Tyr as Tyranid } from 'tyranid';
import { Spec, Schema, Path } from 'swagger-schema-official';
import { yaml } from './utils';
import { schema } from './schema';



/**
 * options for spec generation
 */
export interface Options {
  /**
   * api version, defaults to 1
   */
  version?: string;
  /**
   * description of public api
   */
  description?: string;
  /**
   * title of public api
   */
  title?: string;
  /**
   * return yaml string
   */
  yaml?: boolean;
}



/**
 * Given an instance of tyranid, create a swagger api spec
 *
 * @param Tyr initialized tyranid object
 * @param options schema generation options
 */
export function spec(Tyr: typeof Tyranid, options?: Options & { yaml: true }): string;
export function spec(Tyr: typeof Tyranid, options?: Options & { yaml: void | false }): Spec;
export function spec(Tyr: typeof Tyranid, options: Options = {}): Spec | string {
  const {
    version = "1.0.0",
    description = "Public API generated from tyranid-swagger",
    title = "Public API"
  } = options;

  const spec = {
    swagger: "2.0",
    info: {
      description,
      title,
      version
    },
    paths: {} as { [key: string]: Path },
    definitions: {} as { [key: string]: Schema }
  };

  for (const col of Tyr.collections) {
    if (!col.def.swagger) continue;
    const result = schema(col.def);
    spec.definitions[result.name] = result.schema;
  }

  return options.yaml ? yaml(spec) : spec;
}