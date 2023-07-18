import { Table, Tr, Td } from 'nextra/components';

import { sortByKey } from '../../lib/util';

import styles from './SchemaTable.module.scss';

interface Configuration {
  anyOf: Array<{ type: string; }>;
  default: string;
  description?: string;
  type: string;
}

interface Property {
  name: string;
  required: boolean;
  types: Array<string>;
  defaultValue?: string;
  description?: string;
  link?: {
    label: string;
    url: string;
  }
}

export const SchemaTable = ({ schema, schemaKey }) => {
  const { properties, required } = schema.definitions[schemaKey];

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

    const property: Property = {
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

    return property;
  })

  const sortedProperties = sortByKey(formattedProperties, 'name');

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
        {sortedProperties.map(({ name, required, types, defaultValue, description, link }: Property) => {
          console.log('types', types)
          return (
            <Tr key={name}>
              <Td>{ name }</Td>
              <Td>{ types && types.filter(v => !!v).length > 0 ? types.join(' | ') : '-' }</Td>
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