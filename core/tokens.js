// eslint-disable-next-line @typescript-eslint/no-var-requires
const StyleDictionary = require('style-dictionary');

const { fileHeader } = StyleDictionary.formatHelpers;

// Empty for as an example of how we can add some extra variables, not from the tokens JSON
const customVariables = ``;

// CSS vanilla :root format
StyleDictionary.registerFormat({
  name: 'rootFormat',
  formatter({ dictionary, file }) {
    // Add a prefix to all variable names
    const prefixedVariables = dictionary.allProperties.map((prop) => {
      return `  --${prop.name}: ${prop.value};`;
    });

    return (
      fileHeader({ file }) +
      ':root {\n' +
      prefixedVariables.join('\n') + // Join all prefixed variables with a newline
      customVariables +
      '\n}\n'
    );
  },
});

// scss variables format
StyleDictionary.registerFormat({
  name: 'scssVariablesFormat',
  formatter({ dictionary, file }) {
    // Add a prefix to all variable names
    const prefixedVariables = dictionary.allProperties.map((prop) => {
      return `$${prop.name}: ${prop.value};`;
    });

    return (
      fileHeader({ file }) +
      prefixedVariables.join('\n') + // Join all prefixed variables with a newline
      customVariables +
      '\n'
    );
  },
});

// Make Style Dictionary comply with the $ format on properties from W3C Guidelines
const w3cTokenJsonParser = {
  pattern: /\.json|\.tokens\.json|\.tokens$/,
  parse(_a) {
    var contents = _a.contents;
    // replace $value with value so that style dictionary recognizes it
    var preparedContent = (contents || '{}')
      .replace(/"\$?value":/g, '"value":')
      // convert $description to comment
      .replace(/"\$?description":/g, '"comment":');
    //
    return JSON.parse(preparedContent);
  },
};

StyleDictionary.registerParser(w3cTokenJsonParser);

// Generate Tokens
StyleDictionary.extend({
  source: ['src/foundations/*.json'],
  platforms: {
    css: {
      buildPath: 'src/foundations/',
      transformGroup: 'css',
      files: [
        {
          destination: 'ionic.root.scss',
          format: 'rootFormat',
          options: {
            outputReferences: true,
            fileHeader: `myFileHeader`,
          },
        },
      ],
    },
    scss: {
      buildPath: 'src/foundations/',
      transformGroup: 'scss',
      files: [
        {
          destination: 'ionic.vars.scss',
          format: 'scssVariablesFormat',
          options: {
            outputReferences: true,
            fileHeader: `myFileHeader`,
          },
        },
      ],
    },
  },
  fileHeader: {
    myFileHeader: () => {
      return ['Ionic Design System'];
    },
  },
}).buildAllPlatforms();
