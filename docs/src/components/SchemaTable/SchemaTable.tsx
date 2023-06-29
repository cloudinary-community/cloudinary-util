import styles from './SchemaTable.module.scss';

interface Configuration {
  anyOf: Array<{ type: string; }>;
  default: string;
  description?: string;
  type: string;
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
      <table>
        <thead>
          <tr>
            <td><strong>Property</strong></td>
            <td><strong>Types</strong></td>
            <td><strong>Required</strong></td>
            <td><strong>Default</strong></td>
            <td><strong>Description</strong></td>
            <td></td>
          </tr>
        </thead>
        <tbody>
        {formattedProperties.map(({ name, required, types, defaultValue, description, link }) => {
          return (
            <tr key={name}>
              <td>{ name }</td>
              <td>{ types && types.join(' | ') }</td>
              <td>{ required ? 'Yes' : '-' }</td>
              <td>{ defaultValue || '-' }</td>
              <td>{ description }</td>
              <td>
                {link && <a href={link.url} className={styles.propertyLink}>{ link.label }</a>}
              </td>
            </tr>
          )
        })}
        </tbody>
      </table>
    </>
  )
}

export default SchemaTable;