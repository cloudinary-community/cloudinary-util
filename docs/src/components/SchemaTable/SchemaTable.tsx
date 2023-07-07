import { Table, Tr, Td } from 'nextra/components';
import styles from './SchemaTable.module.scss';

interface Configuration {
  anyOf: Array<{ type: string; }>;
  default: string;
  description?: string;
  type: string;
}

export const SchemaTable = ({ schema, schemaKey }) => {
  const { properties, required } = schema.definitions[schemaKey];
console.log('schema', schema)
  const formattedProperties = Object.entries(properties).map(([name, configuration]: [string, Configuration]) => {
    const { type, anyOf, default: defaultValue } = configuration;

    const types = Array.isArray(type) ? type : [type];

    if ( anyOf ) {
      anyOf.filter(({ type }) => !!type ).forEach(ao => {
        types.push(ao.type);
      })
    }

    const description = configuration?.description && JSON.parse(configuration.description);
    const { text, url } = description || {};

    return {
      name,
      required: required.includes(name),
      types,
      defaultValue,
      description: text,
      link: url && {
        label: 'More Info',
        url,
      }
    }
  })

  return (
    <>
      <Table>
        <thead>
          <Tr>
            <Td><strong>Property</strong></Td>
            <Td><strong>Types</strong></Td>
            <Td><strong>Required</strong></Td>
            <Td><strong>Default</strong></Td>
            <Td><strong>Description</strong></Td>
            <Td></Td>
          </Tr>
        </thead>
        <tbody>
        {formattedProperties.map(({ name, required, types, defaultValue, description, link }) => {
          return (
            <Tr key={name}>
              <Td>{ name }</Td>
              <Td>{ types && types.join(' | ') }</Td>
              <Td>{ required ? 'Yes' : '-' }</Td>
              <Td>{ defaultValue || '-' }</Td>
              <Td>{ description }</Td>
              <Td>
                {link && <a href={link.url} className={styles.propertyLink}>{ link.label }</a>}
              </Td>
            </Tr>
          )
        })}
        </tbody>
      </Table>
    </>
  )
}

export default SchemaTable;