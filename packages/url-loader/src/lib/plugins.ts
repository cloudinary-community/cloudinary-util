import { z } from 'zod';

const constructPluginSchemaProps = z.array(z.object({
  name: z.string(),
  type: z.any(),
  assetTypes: z.array(z.string())
}));

type ConstructPluginSchemaProps = z.infer<typeof constructPluginSchemaProps>;

export function constructPluginSchema(props: ConstructPluginSchemaProps) {
  return z.object(props.reduce((prev, curr) => {
    const key: string = curr.name;
    // @ts-ignore
    prev[key] = curr.type;
    return prev;
  }, {}));
}